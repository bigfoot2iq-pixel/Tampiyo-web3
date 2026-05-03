"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useAccount } from "wagmi";

type Holder = { address: string; balance: string | number; rank: number };

function fmtAddress(addr: string) {
  return `${addr.slice(0, 6)}…${addr.slice(-4)}`;
}

function fmtBalance(raw: string | number) {
  try {
    return (BigInt(raw.toString()) / BigInt(10 ** 18)).toLocaleString();
  } catch {
    return "—";
  }
}

export default function LeaderboardPreview() {
  const { address: connectedAddress } = useAccount();
  const [holders, setHolders] = useState<Holder[]>([]);
  const [myHolder, setMyHolder] = useState<Holder | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/leaderboard?limit=5")
      .then((r) => r.json())
      .then((d) => { setHolders(d.holders ?? []); setLoading(false); })
      .catch(() => setLoading(false));
  }, []);

  useEffect(() => {
    if (!connectedAddress) { setMyHolder(null); return; }
    fetch(`/api/leaderboard?address=${connectedAddress}`)
      .then((r) => r.json())
      .then((d) => setMyHolder(d.holder ?? null))
      .catch(() => setMyHolder(null));
  }, [connectedAddress]);

  const myInTop5 = myHolder != null && holders.some(
    (h) => h.address.toLowerCase() === connectedAddress?.toLowerCase()
  );

  return (
    <section id="leaderboard" className="bg-paper-2 px-5 py-20 sm:px-6 sm:py-24 md:px-12 md:py-36">
      <div className="max-w-[900px] mx-auto">

        <div className="mb-10 reveal-stamp sm:mb-12 md:mb-16">
          <div className="font-stencil text-xs text-smoke uppercase tracking-widest mb-4">
            The Grumpy Ranks
          </div>
          <h2 className="font-display text-[32px] font-bold leading-[0.94] text-ink sm:text-[40px] lg:text-[48px]">
            Top Holders.{" "}
            <span className="font-marker text-gold" style={{ fontSize: "0.85em" }}>
              He&apos;s watching.
            </span>
          </h2>
        </div>

        <div className="reveal-stamp">
          <div className="flex items-center gap-4 border-b border-ink/30 pb-3 md:gap-8">
            <span className="w-8 font-stencil text-xs text-smoke uppercase tracking-widest">#</span>
            <span className="flex-1 font-stencil text-xs text-smoke uppercase tracking-widest">Wallet</span>
            <span className="font-stencil text-xs text-smoke uppercase tracking-widest text-right">Balance</span>
          </div>

          {/* Connected wallet pinned — only shown when not already in top 5 */}
          {myHolder && !myInTop5 && (
            <div className="flex flex-col items-start gap-1 border-b-2 border-gold/60 bg-gold/[0.06] py-5 -mx-5 px-5 sm:-mx-6 sm:px-6 md:-mx-0 md:px-0 sm:flex-row sm:items-center sm:gap-4 md:gap-8">
              <span className="w-8 flex-shrink-0 font-mono text-sm font-bold text-gold">{myHolder.rank}</span>
              <div className="flex-1 min-w-0 flex flex-wrap items-center gap-2">
                <span className="font-mono text-sm text-ink font-bold">{fmtAddress(myHolder.address)}</span>
                <span className="font-stencil text-[10px] uppercase tracking-widest text-gold border border-gold/50 px-1.5 py-0.5 leading-none">You</span>
              </div>
              <span className="font-display text-base font-bold text-ink sm:text-right">
                {fmtBalance(myHolder.balance)}
              </span>
            </div>
          )}

          {loading && (
            <div className="py-10 text-center font-mono text-sm text-smoke">Loading&hellip;</div>
          )}

          {!loading && holders.length === 0 && (
            <div className="py-10 text-center font-mono text-sm text-smoke">No holders yet.</div>
          )}

          {holders.map((h) => {
            const isMe = connectedAddress != null && h.address.toLowerCase() === connectedAddress.toLowerCase();
            return (
              <div
                key={h.address}
                className={`flex flex-col items-start gap-1 border-b border-ink/15 py-5 sm:flex-row sm:items-center sm:gap-4 md:gap-8${isMe ? " bg-gold/[0.06]" : ""}`}
              >
                <span className={`w-8 flex-shrink-0 font-mono text-sm${isMe ? " text-gold font-bold" : " text-smoke"}`}>
                  {h.rank}
                </span>
                <div className="flex-1 min-w-0 flex flex-wrap items-center gap-2">
                  <span className={`font-mono text-sm break-all${isMe ? " text-ink font-bold" : " text-ink"}`}>
                    {fmtAddress(h.address)}
                  </span>
                  {isMe && (
                    <span className="font-stencil text-[10px] uppercase tracking-widest text-gold border border-gold/50 px-1.5 py-0.5 leading-none">You</span>
                  )}
                </div>
                <span className="font-display text-base font-bold text-ink sm:text-right">
                  {fmtBalance(h.balance)}
                </span>
              </div>
            );
          })}
        </div>

        <div className="mt-10 flex justify-end reveal-stamp">
          <Link
            href="/leaderboard"
            className="btn-ink text-xs no-underline inline-block"
          >
            View Full Leaderboard &rarr;
          </Link>
        </div>

      </div>
    </section>
  );
}
