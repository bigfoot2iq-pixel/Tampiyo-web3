const PREVIEW_ROWS = [
  { label: "Claim events", value: "Pending first claims" },
  { label: "Top wallet", value: "Hidden until onchain" },
  { label: "Pool status", value: "Read from Tempo contract" },
  { label: "Cooldowns", value: "Per wallet and tier" },
];

export default function LeaderboardPreview() {
  return (
    <section className="bg-paper-2 px-5 py-20 sm:px-6 sm:py-24 md:px-12 md:py-36">
      <div className="max-w-[900px] mx-auto">

        <div className="mb-10 reveal-stamp sm:mb-12 md:mb-16">
          <div className="font-stencil text-xs text-smoke uppercase tracking-widest mb-4">
            The Grumpy Ranks
          </div>
          <h2
            className="font-display text-[32px] font-bold leading-[0.94] text-ink sm:text-[40px] lg:text-[48px]"
          >
            Top Holders.{" "}
            <span className="font-marker text-gold" style={{ fontSize: "0.85em" }}>
              He&apos;s watching.
            </span>
          </h2>
        </div>

        <div className="reveal-stamp">
          {/* Column headers */}
          <div className="flex items-center gap-4 border-b border-ink/30 pb-3 md:gap-8">
            <span className="flex-1 font-stencil text-xs text-smoke uppercase tracking-widest">Signal</span>
            <span className="font-stencil text-xs text-smoke uppercase tracking-widest text-right">Status</span>
          </div>

          {PREVIEW_ROWS.map((row) => (
            <div
              key={row.label}
              className="flex flex-col items-start gap-1 border-b border-ink/15 py-5 sm:flex-row sm:items-center sm:gap-4 md:gap-8"
            >
              <div className="flex-1 min-w-0">
                <span className="font-mono text-sm text-smoke">{row.label}</span>
              </div>
              <span className="font-display text-base font-bold text-ink sm:max-w-[52%] sm:text-right">
                {row.value}
              </span>
            </div>
          ))}
        </div>

        <div className="mt-10 flex justify-end reveal-stamp">
          <span className="inline-flex w-full justify-center border-2 border-ink/20 px-4 py-3 text-center text-sm uppercase tracking-wider text-smoke sm:w-auto sm:px-8">
            Leaderboard unlocks after live claims
          </span>
        </div>

      </div>
    </section>
  );
}
