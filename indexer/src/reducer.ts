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
