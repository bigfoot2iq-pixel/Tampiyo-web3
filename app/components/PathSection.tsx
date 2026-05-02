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
    <section id="roadmap" className="py-28 md:py-36 px-6 md:px-12 bg-paper">
      <div className="max-w-[800px] mx-auto">
        {/* Section header */}
        <div className="mb-16 reveal-stamp">
          <div className="font-stencil text-xs text-smoke uppercase tracking-widest mb-4">
            Roadmap
          </div>
          <h2
            className="font-display font-bold text-ink leading-[0.9] tracking-tight"
            style={{ fontSize: "clamp(28px, 4vw, 48px)" }}
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
              className={`relative bg-paper border border-ink/15 p-6 md:p-8 reveal-stamp shadow-hard-sm ${
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
                  className="font-display font-bold text-ink mb-6"
                  style={{ fontSize: "clamp(22px, 3vw, 32px)" }}
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
