import { createClient, type SupabaseClient } from "@supabase/supabase-js";
import { config } from "./config.js";
import type { Delta } from "./reducer.js";

// Lazy-init: Supabase validates URL on creation; defer until first DB call
// so DRY_RUN=1 (stub URL) can still exercise RPC + reducer without erroring.
let _db: SupabaseClient | null = null;
function getDb(): SupabaseClient {
  if (!_db) _db = createClient(config.supabaseUrl, config.supabaseServiceKey, {
    auth: { persistSession: false },
  });
  return _db;
}

export async function readLastBlock(): Promise<bigint> {
  const { data, error } = await getDb()
    .from("tampiyo_indexer_state")
    .select("last_block")
    .eq("contract", config.tokenAddress)
    .maybeSingle();
  if (error) throw error;
  if (!data) return config.startBlock - 1n;
  return BigInt(data.last_block);
}

export async function writeLastBlock(block: bigint): Promise<void> {
  const { error } = await getDb().from("tampiyo_indexer_state").upsert({
    contract: config.tokenAddress,
    chain_id: config.chainId,
    last_block: Number(block),
    updated_at: new Date().toISOString(),
  });
  if (error) throw error;
}

export async function applyDeltas(deltas: Delta[]): Promise<void> {
  for (const d of deltas) {
    const { error } = await getDb().rpc("tampiyo_apply_delta", {
      p_address: d.address,
      p_delta: d.delta.toString(),
      p_block: Number(d.block),
    });
    if (error) throw error;
  }
}
