const PREVIEW_ROWS = [
  { label: "Claim events", value: "Pending first claims" },
  { label: "Top wallet", value: "Hidden until onchain" },
  { label: "Pool status", value: "Read from Tempo contract" },
  { label: "Cooldowns", value: "Per wallet and tier" },
];

export default function LeaderboardPreview() {
  return (
    <section className="py-28 md:py-36 px-6 md:px-12 bg-paper-2">
      <div className="max-w-[900px] mx-auto">

        <div className="mb-16 reveal-stamp">
          <div className="font-stencil text-xs text-smoke uppercase tracking-widest mb-4">
            The Grumpy Ranks
          </div>
          <h2
            className="font-display font-bold text-ink leading-[0.9] tracking-tight"
            style={{ fontSize: "clamp(28px, 4vw, 48px)" }}
          >
            Top Holders.{" "}
            <span className="font-marker text-gold" style={{ fontSize: "0.85em" }}>
              He&apos;s watching.
            </span>
          </h2>
        </div>

        <div className="reveal-stamp">
          {/* Column headers */}
          <div className="flex items-center gap-4 md:gap-8 pb-3 border-b border-ink/30">
            <span className="flex-1 font-stencil text-xs text-smoke uppercase tracking-widest">Signal</span>
            <span className="font-stencil text-xs text-smoke uppercase tracking-widest text-right">Status</span>
          </div>

          {PREVIEW_ROWS.map((row) => (
            <div
              key={row.label}
              className="flex items-center gap-4 md:gap-8 py-5 border-b border-ink/15"
            >
              <div className="flex-1 min-w-0">
                <span className="font-mono text-sm text-smoke">{row.label}</span>
              </div>
              <span className="font-display font-bold text-base text-ink text-right max-w-[52%] break-words">
                {row.value}
              </span>
            </div>
          ))}
        </div>

        <div className="mt-10 flex justify-end reveal-stamp">
          <span className="inline-flex border-2 border-ink/20 px-8 py-3 text-sm text-smoke uppercase tracking-wider">
            Leaderboard unlocks after live claims
          </span>
        </div>

      </div>
    </section>
  );
}
