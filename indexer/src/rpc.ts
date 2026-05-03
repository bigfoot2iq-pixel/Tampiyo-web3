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
