const phases = [
  {
    phase: "01",
    label: "Phase 01 · Live Now",
    title: "Awakening",
    items: [
      { text: "Tempo contract deployment", done: true },
      { text: "Website and X launch", done: true },
      { text: "Tiered Tempo claim portal", done: true },
      { text: "Explorer verification", done: false },
    ],
    torn: "minimal",
  },
  {
    phase: "02",
    label: "Phase 02 · Upcoming",
    title: "Uprising",
    items: [
      { text: "Liquidity proof and lock receipt", done: false },
      { text: "Claim leaderboard", done: false },
      { text: "Tempo fee-token onboarding guide", done: false },
      { text: "Community distribution report", done: false },
    ],
    torn: "medium",
  },
  {
    phase: "03",
    label: "Phase 03 · Future",
    title: "",
    items: [],
    torn: "heavy",
    note: "More phases unlock after the claim data is public",
  },
];

export default function PathSection() {
  return (
    <section id="roadmap" className="bg-paper px-5 py-20 sm:px-6 sm:py-24 md:px-12 md:py-36">
      <div className="max-w-[800px] mx-auto">
        {/* Section header */}
        <div className="mb-10 reveal-stamp sm:mb-12 md:mb-16">
          <div className="font-stencil text-xs text-smoke uppercase tracking-widest mb-4">
            Roadmap
          </div>
          <h2
            className="font-display text-[32px] font-bold leading-[0.94] text-ink sm:text-[40px] lg:text-[48px]"
          >
            If he{" "}
            <span className="font-marker text-gold" style={{ fontSize: "0.85em" }}>
              feels like it.
            </span>
          </h2>
        </div>

        {/* Journal pages — staggered */}
        <div className="flex flex-col gap-8">
          {phases.map((phase, idx) => (
            <div
              key={phase.phase}
              className={`journal-page relative border border-ink/15 bg-paper p-5 shadow-hard-sm reveal-stamp sm:p-6 md:p-8 ${
                idx === 1 ? "md:ml-6" : idx === 2 ? "md:ml-12" : ""
              }`}
              style={{
                transform: `rotate(${[-0.5, 0.8, -0.3][idx]}deg)`,
              }}
            >
              {/* Date stamp — flows above title, not absolute (avoids overlap) */}
              <div className="font-stencil text-xs text-smoke mb-3">
                {phase.label}
              </div>

              {phase.title && (
                <h3
                  className="mb-6 font-display text-[24px] font-bold text-ink sm:text-[28px] lg:text-[32px]"
                >
                  {phase.title}
                </h3>
              )}

              {/* Checklist items */}
              {phase.items.length > 0 && (
                <ul className="space-y-3 font-body text-ink-soft">
                  {phase.items.map((item, j) => (
                    <li key={j} className="flex items-start gap-3">
                      <span
                        className={`flex-shrink-0 w-5 h-5 border-2 mt-0.5 ${
                          item.done
                            ? "border-ink bg-ink"
                            : "border-ink/30"
                        }`}
                        style={{
                          display: "inline-flex",
                          alignItems: "center",
                          justifyContent: "center",
                        }}
                      >
                        {item.done && (
                          <svg
                            width="12"
                            height="12"
                            viewBox="0 0 12 12"
                            fill="none"
                            aria-hidden="true"
                          >
                            <path
                              d="M2 6L5 9L10 3"
                              stroke="var(--color-paper)"
                              strokeWidth="2"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            />
                          </svg>
                        )}
                      </span>
                      <span>{item.text}</span>
                    </li>
                  ))}
                </ul>
              )}

              {/* Phase 3 marker note */}
              {phase.note && (
                <div className="mt-8 pt-8 border-t border-ink/10">
                  <span className="font-marker text-2xl text-smoke">
                    {phase.note}
                  </span>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
