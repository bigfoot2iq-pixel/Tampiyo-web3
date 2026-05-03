"use client";

import Link from "next/link";
import BeretLogo from "../components/BeretLogo";
import { ConnectButton } from "../components/ConnectButton";
import { useAccount } from "wagmi";
import { useEffect, useState, useCallback } from "react";

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

const PER_PAGE = 25;

export default function LeaderboardPage() {
  const { address: connectedAddress } = useAccount();
  const [holders, setHolders] = useState<Holder[]>([]);
  const [myHolder, setMyHolder] = useState<Holder | null>(null);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);

  const fetchPage = useCallback((p: number) => {
    setLoading(true);
    fetch(`/api/leaderboard?page=${p}&limit=${PER_PAGE}`)
      .then((r) => r.json())
      .then((d) => {
        setHolders(d.holders ?? []);
        setTotal(d.total ?? 0);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  useEffect(() => { fetchPage(1); }, [fetchPage]);

  useEffect(() => {
    if (!connectedAddress) { setMyHolder(null); return; }
    fetch(`/api/leaderboard?address=${connectedAddress}`)
      .then((r) => r.json())
      .then((d) => setMyHolder(d.holder ?? null))
      .catch(() => setMyHolder(null));
  }, [connectedAddress]);

  const totalPages = Math.max(1, Math.ceil(total / PER_PAGE));

  function goToPage(p: number) {
    const clamped = Math.max(1, Math.min(totalPages, p));
    setPage(clamped);
    fetchPage(clamped);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  return (
    <div className="min-h-screen bg-paper">
      {/* Nav */}
      <nav
        className="sticky top-0 z-[100] flex items-center justify-between gap-3 px-5 py-3 sm:px-6 md:px-12 md:py-5"
        style={{
          background: "rgba(239,233,220,0.97)",
          borderBottom: "1px solid rgba(20,19,15,0.12)",
          backdropFilter: "blur(2px)",
        }}
      >
        <Link
          href="/"
          className="flex items-center gap-2 text-ink no-underline"
          aria-label="Tampiyo home"
        >
          <BeretLogo size={28} className="flex-shrink-0 text-ink" />
          <span
            className="font-stencil text-sm text-gold uppercase"
            style={{ letterSpacing: "0.12em" }}
          >
            TAMPIYO
          </span>
        </Link>
        <ConnectButton compact />
      </nav>

      <main id="main" className="px-5 py-16 sm:px-6 sm:py-20 md:px-12 md:py-28">
        <div className="max-w-[900px] mx-auto">

          {/* Page header */}
          <div className="mb-10 sm:mb-12 md:mb-16">
            <Link
              href="/"
              className="inline-flex items-center gap-1 font-mono text-xs text-smoke no-underline hover:text-ink transition-colors mb-6"
            >
              &larr; Home
            </Link>
            <div className="font-stencil text-xs text-smoke uppercase tracking-widest mb-4">
              The Grumpy Ranks
            </div>
            <h1 className="font-display text-[32px] font-bold leading-[0.94] text-ink sm:text-[40px] lg:text-[48px]">
              Leaderboard.{" "}
              <span className="font-marker text-gold" style={{ fontSize: "0.85em" }}>
                He&apos;s still watching.
              </span>
            </h1>
            {total > 0 && (
              <p className="mt-4 font-mono text-sm text-smoke">
                {total.toLocaleString()} holder{total !== 1 ? "s" : ""}
              </p>
            )}
          </div>

          {/* Connected wallet — always visible at top */}
          {connectedAddress && (
            <div className="mb-8 border-2 border-gold shadow-hard-sm">
              <div className="flex items-center gap-2 border-b border-gold/30 bg-gold/[0.06] px-4 py-2">
                <span className="font-stencil text-[10px] text-gold-deep uppercase tracking-widest">Your Standing</span>
              </div>
              {myHolder ? (
                <div className="flex flex-col items-start gap-1 bg-gold/[0.04] px-4 py-5 sm:flex-row sm:items-center sm:gap-4 md:gap-8">
                  <span className="w-10 flex-shrink-0 font-mono text-lg font-bold text-gold leading-none">
                    #{myHolder.rank}
                  </span>
                  <div className="flex-1 min-w-0">
                    <div className="font-mono text-sm text-ink font-bold sm:hidden">{fmtAddress(myHolder.address)}</div>
                    <div className="font-mono text-sm text-ink font-bold hidden sm:block break-all">{myHolder.address}</div>
                  </div>
                  <span className="font-display text-xl font-bold text-ink sm:text-right flex-shrink-0">
                    {fmtBalance(myHolder.balance)}
                  </span>
                </div>
              ) : (
                <div className="px-4 py-5 font-mono text-sm text-smoke">
                  {loading ? "Loading…" : "No holdings found for this wallet."}
                </div>
              )}
            </div>
          )}

          {/* Table */}
          <div>
            <div className="flex items-center gap-4 border-b border-ink/30 pb-3 md:gap-8">
              <span className="w-10 flex-shrink-0 font-stencil text-xs text-smoke uppercase tracking-widest">#</span>
              <span className="flex-1 font-stencil text-xs text-smoke uppercase tracking-widest">Wallet</span>
              <span className="font-stencil text-xs text-smoke uppercase tracking-widest text-right">Balance</span>
            </div>

            {loading && (
              <div className="py-20 text-center font-mono text-sm text-smoke">Loading&hellip;</div>
            )}

            {!loading && holders.length === 0 && (
              <div className="py-20 text-center font-mono text-sm text-smoke">No holders yet.</div>
            )}

            {!loading && holders.map((h) => {
              const isMe = connectedAddress != null && h.address.toLowerCase() === connectedAddress.toLowerCase();
              return (
                <div
                  key={h.address}
                  className={`flex flex-col items-start gap-1 border-b border-ink/15 py-5 sm:flex-row sm:items-center sm:gap-4 md:gap-8${isMe ? " bg-gold/[0.06]" : ""}`}
                >
                  <span className={`w-10 flex-shrink-0 font-mono text-sm${isMe ? " text-gold font-bold" : " text-smoke"}`}>
                    {h.rank}
                  </span>
                  <div className="flex-1 min-w-0 flex flex-wrap items-center gap-2">
                    <span className={`font-mono text-sm sm:hidden${isMe ? " text-ink font-bold" : " text-ink"}`}>
                      {fmtAddress(h.address)}
                    </span>
                    <span className={`font-mono text-sm hidden sm:block break-all${isMe ? " text-ink font-bold" : " text-ink"}`}>
                      {h.address}
                    </span>
                    {isMe && (
                      <span className="font-stencil text-[10px] uppercase tracking-widest text-gold border border-gold/50 px-1.5 py-0.5 leading-none">
                        You
                      </span>
                    )}
                  </div>
                  <span className="font-display text-base font-bold text-ink sm:text-right flex-shrink-0">
                    {fmtBalance(h.balance)}
                  </span>
                </div>
              );
            })}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="mt-10 flex items-center justify-between gap-4">
              <button
                className="btn-paper px-6 py-3 text-xs"
                onClick={() => goToPage(page - 1)}
                disabled={page <= 1}
              >
                &larr; Prev
              </button>
              <span className="font-mono text-sm text-smoke">
                Page {page} of {totalPages}
              </span>
              <button
                className="btn-paper px-6 py-3 text-xs"
                onClick={() => goToPage(page + 1)}
                disabled={page >= totalPages}
              >
                Next &rarr;
              </button>
            </div>
          )}

        </div>
      </main>

      {/* Footer strip */}
      <footer className="border-t border-ink/15 px-5 py-8 sm:px-6 md:px-12">
        <div className="max-w-[900px] mx-auto flex items-center justify-between gap-4">
          <span className="font-mono text-xs text-smoke">$TAMPIYO on Tempo</span>
          <Link href="/" className="font-mono text-xs text-smoke no-underline hover:text-ink transition-colors">
            &larr; Back to home
          </Link>
        </div>
      </footer>
    </div>
  );
}
