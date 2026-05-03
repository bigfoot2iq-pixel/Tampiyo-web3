# Tampiyo Indexer — Implementation Plan

Standalone service that indexes `Tampiyo` ERC20 `Transfer` events into Supabase, exposing live holder balances for the leaderboard UI.

## Goals

- Track current Tampiyo balance per wallet by reducing `Transfer` events.
- Persist to Supabase (`tampiyo_*` prefixed tables).
- Run as a long-lived Docker container on a VPS.
- 5-minute poll interval. Lag tolerated.
- Match `balanceOf` onchain truth (sum balances == `totalSupply`).

## Non-goals

- Indexing other contracts (only `Tampiyo` ERC20).
- Real-time websocket subscriptions (polling sufficient).
- Historical analytics beyond current balances (transfers table optional).
- Multi-chain (Tempo testnet first; mainnet swap via env).

## Architecture

```
┌──────────────────┐  eth_getLogs    ┌────────────────────┐
│  Tempo RPC       │ ───────────────►│  Indexer container │
│  (HTTP)          │  Transfer only  │   (VPS + Docker)   │
└──────────────────┘                 └─────────┬──────────┘
                                               │ upsert (service key)
                                               ▼
                                     ┌────────────────────┐
                                     │  Supabase Postgres │
                                     │  tampiyo_balances  │
                                     │  tampiyo_indexer_  │
                                     │       state        │
                                     └─────────┬──────────┘
                                               │ select desc (anon key)
                                               ▼
                                     ┌────────────────────┐
                                     │  Next.js API route │
                                     │  /api/leaderboard  │
                                     └─────────┬──────────┘
                                               │
                                               ▼
                                     ┌────────────────────┐
                                     │  LeaderboardPreview│
                                     │   React component  │
                                     └────────────────────┘
```

## Indexer loop

Every 5 minutes:

1. Read `last_block` from `tampiyo_indexer_state`.
2. Fetch `latest = rpc.getBlockNumber()`.
3. Compute `safeTo = latest - REORG_BUFFER` (default 50).
4. If `safeTo <= last_block` → skip tick.
5. Call `eth_getLogs({ address: TAMPIYO, topics: [TRANSFER], fromBlock: last_block+1, toBlock: safeTo })`. Chunk if RPC range cap.
6. Reduce logs into in-memory delta map: `from -= value`, `to += value` (skip zero address per side).
7. Upsert deltas to `tampiyo_balances` (atomic, additive).
8. Update `tampiyo_indexer_state.last_block = safeTo`.
9. Sleep 5 min.

Reorg handling: 50-block lag is sufficient on Tempo. No rewind logic needed in v1.

Cold start: `last_block` initialized to `START_BLOCK = 15688965` (Tampiyo deploy block on testnet 42431).

## File structure

```
indexer/
├── PLAN.md                  # this file
├── Dockerfile
├── docker-compose.yml
├── .env.example
├── .dockerignore
├── package.json
├── tsconfig.json
├── sql/
│   └── 001_init.sql         # run once in Supabase SQL editor
└── src/
    ├── index.ts             # entry: scheduler loop
    ├── rpc.ts               # viem client + getLogs chunker
    ├── reducer.ts           # Transfer log → balance deltas
    ├── db.ts                # Supabase client + upsert helpers
    ├── config.ts            # env parsing + validation
    └── abi.ts               # minimal ERC20 Transfer event ABI
```

## Supabase schema (sql/001_init.sql)

```sql
create table if not exists tampiyo_balances (
  address text primary key,
  balance numeric(78,0) not null default 0,
  updated_block bigint not null,
  updated_at timestamptz default now()
);

create index if not exists tampiyo_balances_balance_desc
  on tampiyo_balances (balance desc)
  where balance > 0;

create table if not exists tampiyo_indexer_state (
  contract text primary key,
  chain_id int not null,
  last_block bigint not null,
  updated_at timestamptz default now()
);

-- RLS: anon read, service_role write
alter table tampiyo_balances enable row level security;
alter table tampiyo_indexer_state enable row level security;

create policy "tampiyo_balances anon read"
  on tampiyo_balances for select
  to anon, authenticated
  using (true);

create policy "tampiyo_indexer_state anon read"
  on tampiyo_indexer_state for select
  to anon, authenticated
  using (true);

-- service_role bypasses RLS by default; no explicit write policy needed.

-- Atomic delta upsert RPC for indexer
create or replace function tampiyo_apply_delta(
  p_address text,
  p_delta numeric,
  p_block bigint
) returns void
language plpgsql
security definer
as $$
begin
  insert into tampiyo_balances (address, balance, updated_block)
  values (p_address, p_delta, p_block)
  on conflict (address) do update
    set balance = tampiyo_balances.balance + excluded.balance,
        updated_block = greatest(tampiyo_balances.updated_block, excluded.updated_block),
        updated_at = now();
end;
$$;

revoke all on function tampiyo_apply_delta(text, numeric, bigint) from public, anon, authenticated;
grant execute on function tampiyo_apply_delta(text, numeric, bigint) to service_role;
```

## src/abi.ts

```ts
import { parseAbiItem } from "viem";

export const TRANSFER_EVENT = parseAbiItem(
  "event Transfer(address indexed from, address indexed to, uint256 value)"
);
```

## src/config.ts

```ts
import "dotenv/config";

function req(name: string): string {
  const v = process.env[name];
  if (!v) throw new Error(`Missing env: ${name}`);
  return v;
}

export const config = {
  rpcUrl: req("RPC_URL"),
  tokenAddress: req("TOKEN_ADDRESS") as `0x${string}`,
  startBlock: BigInt(process.env.START_BLOCK ?? "15688965"),
  chainId: Number(process.env.CHAIN_ID ?? "42431"),
  pollIntervalMs: Number(process.env.POLL_INTERVAL_MS ?? "300000"), // 5 min
  reorgBuffer: BigInt(process.env.REORG_BUFFER ?? "50"),
  logsChunkSize: BigInt(process.env.LOGS_CHUNK_SIZE ?? "5000"),
  supabaseUrl: req("SUPABASE_URL"),
  supabaseServiceKey: req("SUPABASE_SERVICE_KEY"),
};
```

## src/rpc.ts

```ts
import { createPublicClient, http, type Log } from "viem";
import { TRANSFER_EVENT } from "./abi.js";
import { config } from "./config.js";

export const client = createPublicClient({
  transport: http(config.rpcUrl, { retryCount: 3, retryDelay: 1000 }),
});

export async function fetchTransferLogs(
  fromBlock: bigint,
  toBlock: bigint
): Promise<Log[]> {
  const all: Log[] = [];
  let f = fromBlock;
  while (f <= toBlock) {
    const t = f + config.logsChunkSize - 1n > toBlock
      ? toBlock
      : f + config.logsChunkSize - 1n;
    const logs = await client.getLogs({
      address: config.tokenAddress,
      event: TRANSFER_EVENT,
      fromBlock: f,
      toBlock: t,
    });
    all.push(...logs);
    f = t + 1n;
  }
  return all;
}

export async function getLatestBlock(): Promise<bigint> {
  return client.getBlockNumber();
}
```

## src/reducer.ts

```ts
import { type Log, getAddress } from "viem";

export type Delta = { address: string; delta: bigint; block: bigint };

const ZERO = "0x0000000000000000000000000000000000000000";

export function reduceLogs(logs: Log[]): Delta[] {
  const map = new Map<string, { delta: bigint; block: bigint }>();

  for (const log of logs) {
    const args = (log as any).args as { from: string; to: string; value: bigint };
    const block = log.blockNumber!;
    const value = args.value;
    const from = getAddress(args.from);
    const to = getAddress(args.to);

    if (from.toLowerCase() !== ZERO) {
      const cur = map.get(from) ?? { delta: 0n, block: 0n };
      cur.delta -= value;
      cur.block = block > cur.block ? block : cur.block;
      map.set(from, cur);
    }
    if (to.toLowerCase() !== ZERO) {
      const cur = map.get(to) ?? { delta: 0n, block: 0n };
      cur.delta += value;
      cur.block = block > cur.block ? block : cur.block;
      map.set(to, cur);
    }
  }

  return [...map.entries()].map(([address, v]) => ({
    address,
    delta: v.delta,
    block: v.block,
  }));
}
```

## src/db.ts

```ts
import { createClient } from "@supabase/supabase-js";
import { config } from "./config.js";
import type { Delta } from "./reducer.js";

export const db = createClient(config.supabaseUrl, config.supabaseServiceKey, {
  auth: { persistSession: false },
});

export async function readLastBlock(): Promise<bigint> {
  const { data, error } = await db
    .from("tampiyo_indexer_state")
    .select("last_block")
    .eq("contract", config.tokenAddress)
    .maybeSingle();
  if (error) throw error;
  if (!data) return config.startBlock - 1n;
  return BigInt(data.last_block);
}

export async function writeLastBlock(block: bigint): Promise<void> {
  const { error } = await db.from("tampiyo_indexer_state").upsert({
    contract: config.tokenAddress,
    chain_id: config.chainId,
    last_block: Number(block),
    updated_at: new Date().toISOString(),
  });
  if (error) throw error;
}

export async function applyDeltas(deltas: Delta[]): Promise<void> {
  for (const d of deltas) {
    const { error } = await db.rpc("tampiyo_apply_delta", {
      p_address: d.address,
      p_delta: d.delta.toString(),
      p_block: Number(d.block),
    });
    if (error) throw error;
  }
}
```

## src/index.ts

```ts
import { config } from "./config.js";
import { fetchTransferLogs, getLatestBlock } from "./rpc.js";
import { reduceLogs } from "./reducer.js";
import { applyDeltas, readLastBlock, writeLastBlock } from "./db.js";

async function tick() {
  const lastBlock = await readLastBlock();
  const latest = await getLatestBlock();
  const safeTo = latest - config.reorgBuffer;

  if (safeTo <= lastBlock) {
    console.log(`[tick] up to date (last=${lastBlock} safeTo=${safeTo})`);
    return;
  }

  const fromBlock = lastBlock + 1n;
  console.log(`[tick] fetching ${fromBlock} -> ${safeTo}`);
  const logs = await fetchTransferLogs(fromBlock, safeTo);
  console.log(`[tick] ${logs.length} Transfer logs`);

  const deltas = reduceLogs(logs);
  await applyDeltas(deltas);
  await writeLastBlock(safeTo);
  console.log(`[tick] applied ${deltas.length} deltas, checkpoint=${safeTo}`);
}

async function main() {
  console.log(`[indexer] start, contract=${config.tokenAddress} chain=${config.chainId}`);
  while (true) {
    try {
      await tick();
    } catch (e) {
      console.error("[tick] error:", e);
    }
    await new Promise((r) => setTimeout(r, config.pollIntervalMs));
  }
}

main();
```

## package.json

```json
{
  "name": "tampiyo-indexer",
  "version": "0.1.0",
  "private": true,
  "type": "module",
  "scripts": {
    "build": "tsc",
    "start": "node dist/index.js",
    "dev": "tsx src/index.ts"
  },
  "dependencies": {
    "@supabase/supabase-js": "^2.45.0",
    "dotenv": "^16.4.5",
    "viem": "^2.21.0"
  },
  "devDependencies": {
    "@types/node": "^22.5.0",
    "tsx": "^4.19.0",
    "typescript": "^5.6.0"
  }
}
```

## tsconfig.json

```json
{
  "compilerOptions": {
    "target": "ES2022",
    "module": "ES2022",
    "moduleResolution": "Bundler",
    "esModuleInterop": true,
    "strict": true,
    "outDir": "dist",
    "rootDir": "src",
    "declaration": false,
    "skipLibCheck": true
  },
  "include": ["src/**/*"]
}
```

## Dockerfile

```dockerfile
FROM node:22-alpine AS build
WORKDIR /app
COPY package.json package-lock.json* ./
RUN npm install --include=dev
COPY tsconfig.json ./
COPY src ./src
RUN npm run build

FROM node:22-alpine AS runtime
WORKDIR /app
ENV NODE_ENV=production
COPY package.json package-lock.json* ./
RUN npm install --omit=dev
COPY --from=build /app/dist ./dist
USER node
CMD ["node", "dist/index.js"]
```

## docker-compose.yml

```yaml
services:
  indexer:
    build: .
    restart: unless-stopped
    env_file: .env
    logging:
      driver: json-file
      options:
        max-size: "10m"
        max-file: "3"
```

## .env.example

```
RPC_URL=https://rpc.moderato.tempo.xyz
TOKEN_ADDRESS=0x47CAD479B1D525E88Cf69f0a0b05BFD1747E92f2
CHAIN_ID=42431
START_BLOCK=15688965
POLL_INTERVAL_MS=300000
REORG_BUFFER=50
LOGS_CHUNK_SIZE=5000
SUPABASE_URL=https://YOUR_PROJECT.supabase.co
SUPABASE_SERVICE_KEY=eyJ...                  # service_role key, server only
```

## .dockerignore

```
node_modules
dist
.env
.env.*
*.log
.git
```

## Next.js API route — app/api/leaderboard/route.ts

```ts
import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

export const revalidate = 60;

const CLAIM_ADDRESS = "0x2E9e441983448B923cC859867252237494daDe23".toLowerCase();
const ZERO = "0x0000000000000000000000000000000000000000";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
  { auth: { persistSession: false } }
);

export async function GET() {
  const { data, error } = await supabase
    .from("tampiyo_balances")
    .select("address, balance")
    .gt("balance", 0)
    .order("balance", { ascending: false })
    .limit(100);

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  const filtered = (data ?? []).filter(
    (r) => r.address.toLowerCase() !== CLAIM_ADDRESS && r.address.toLowerCase() !== ZERO
  );

  return NextResponse.json({ holders: filtered });
}
```

Env additions to Next.js (`.env.local`):

```
NEXT_PUBLIC_SUPABASE_URL=https://YOUR_PROJECT.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJ...           # anon key, safe for client
```

## LeaderboardPreview update — render live data

Replace placeholder rows with fetch from `/api/leaderboard`. Address truncation via `formatUnits(balance, 18)` and `addr.slice(0,6) + "..." + addr.slice(-4)`. Implementation deferred to UI task; component contract is `holders: { address, balance }[]`.

## Deploy steps

1. **Supabase**:
   - Open SQL editor, paste `sql/001_init.sql`, run.
   - Copy project URL, anon key, service_role key.
2. **VPS**:
   - `git clone` repo, `cd indexer`.
   - `cp .env.example .env`, fill `SUPABASE_URL`, `SUPABASE_SERVICE_KEY`, confirm `RPC_URL`.
   - `docker compose up -d --build`.
   - `docker compose logs -f indexer` to verify `[tick]` lines appear.
3. **First backfill**:
   - From `START_BLOCK=15688965` to current ~ few thousand blocks.
   - Chunked at 5000/call. Should complete in 1–2 ticks.
4. **Next.js app**:
   - Add `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY` to `.env.local` and Vercel project env.
   - Add `app/api/leaderboard/route.ts`.
   - Wire `LeaderboardPreview.tsx` to the API.
5. **Sanity check**: sum of balances == `Tampiyo.totalSupply()` minus burns.

## Ops

- **Logs**: `docker compose logs -f --tail=100 indexer`. Rotated at 10MB/3 files.
- **Restart**: `docker compose restart indexer`. State in Supabase, safe to restart anytime.
- **Reset**: truncate `tampiyo_balances`, set `tampiyo_indexer_state.last_block = START_BLOCK - 1`, restart container. Full re-scan.
- **Switch chain (mainnet)**: edit `.env` (`RPC_URL`, `TOKEN_ADDRESS`, `CHAIN_ID`, `START_BLOCK`), run separate stack or wipe + restart.
- **RPC failover**: if public RPC flaky, set `RPC_URL` to private endpoint (Conduit, Chainstack, 1RPC). Single env change.
- **Healthcheck**: optional cron on VPS hits Supabase `tampiyo_indexer_state.updated_at` — alert if older than 15 min.

## Reconcile (manual sanity)

Run periodically:

```sql
select sum(balance) as indexed_total
from tampiyo_balances
where address != '0x0000000000000000000000000000000000000000';
```

Compare vs onchain `Tampiyo.totalSupply()` minus burns. Drift means lost log or bug — wipe + reindex.

## Future (not v1)

- Add `tampiyo_transfers` raw log archive for analytics.
- Multicall3 reconcile job (nightly): batch `balanceOf` for all known addresses, overwrite balances, fix any drift.
- Websocket subscription for sub-block latency (replace 5-min cron).
- Indexer metrics endpoint (Prometheus) for VPS monitoring.
- Track `Claimed` events separately for "Top Claimers" leaderboard.
