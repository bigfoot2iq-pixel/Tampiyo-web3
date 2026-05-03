import { config } from "./config.js";
import { fetchTransferLogs, getLatestBlock } from "./rpc.js";
import { reduceLogs } from "./reducer.js";
import { applyDeltas, readLastBlock, writeLastBlock } from "./db.js";

// DRY_RUN=1: fetch one tick, print delta count, exit without writing to Supabase.
// Leave gated so it can be used for smoke tests against live RPC.
const DRY_RUN = process.env.DRY_RUN === "1";

async function tick() {
  const lastBlock = DRY_RUN
    ? config.startBlock - 1n
    : await readLastBlock();
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

  if (DRY_RUN) {
    console.log(`[dry-run] ${deltas.length} deltas (not written)`);
    return;
  }

  await applyDeltas(deltas);
  await writeLastBlock(safeTo);
  console.log(`[tick] applied ${deltas.length} deltas, checkpoint=${safeTo}`);
}

async function main() {
  console.log(`[indexer] start, contract=${config.tokenAddress} chain=${config.chainId}`);
  if (DRY_RUN) {
    await tick();
    return;
  }
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
