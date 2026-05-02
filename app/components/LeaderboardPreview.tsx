const PREVIEW_ROWS = [
  { rank: 1, address: "0x3f4a…c891", amount: "48,200,000", tag: "GRUMP KING" },
  { rank: 2, address: "0xa12b…ff03", amount: "31,500,000" },
  { rank: 3, address: "0x7c8d…2244", amount: "22,100,000" },
  { rank: 4, address: "0x9e1f…b730", amount: "18,750,000" },
  { rank: 5, address: "0x5511…4c9a", amount: "14,900,000" },
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
              He's watching.
            </span>
          </h2>
        </div>

        <div className="reveal-stamp">
          {/* Column headers */}
          <div className="flex items-center gap-4 md:gap-8 pb-3 border-b border-ink/30">
            <span className="w-8 font-stencil text-xs text-smoke uppercase tracking-widest">#</span>
            <span className="flex-1 font-stencil text-xs text-smoke uppercase tracking-widest">Address</span>
            <span className="font-stencil text-xs text-smoke uppercase tracking-widest text-right">$TMPY Held</span>
          </div>

          {PREVIEW_ROWS.map((row) => (
            <div
              key={row.rank}
              className="flex items-center gap-4 md:gap-8 py-5 border-b border-ink/15"
            >
              <span
                className="w-8 font-display font-bold text-xl leading-none flex-shrink-0"
                style={{ color: row.rank === 1 ? "var(--color-gold)" : "var(--color-ink)" }}
              >
                {row.rank}
              </span>
              <div className="flex-1 min-w-0">
                <span className="font-mono text-sm text-smoke">{row.address}</span>
                {row.tag && (
                  <span className="ml-3 font-stencil text-[10px] text-gold uppercase tracking-widest">
                    {row.tag}
                  </span>
                )}
              </div>
              <span className="font-display font-bold text-base text-ink text-right flex-shrink-0">
                {row.amount}
              </span>
            </div>
          ))}
        </div>

        <div className="mt-10 flex justify-end reveal-stamp">
          <a href="/leaderboard" className="btn-paper text-sm py-3 px-8 no-underline">
            View Full Leaderboard &rarr;
          </a>
        </div>

      </div>
    </section>
  );
}
