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
