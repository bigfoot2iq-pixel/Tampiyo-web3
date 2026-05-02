const proofCards = [
  {
    label: "Network",
    value: "Tempo Mainnet",
    detail: "Payment-first L1 built for stablecoin settlement.",
  },
  {
    label: "Chain ID",
    value: "4217",
    detail: "Use Tempo Mainnet in your wallet before claiming.",
  },
  {
    label: "Gas Model",
    value: "USD Fees",
    detail: "Tempo has no native gas token. Fees are paid in supported USD stables.",
  },
  {
    label: "Claim Flow",
    value: "Approve -> Claim",
    detail: "One fee-token approval, then tiered $TMPY claims with cooldowns.",
  },
];

const links = [
  { label: "Tempo Docs", href: "https://docs.tempo.xyz/" },
  { label: "Tempo Explorer", href: "https://explore.tempo.xyz/" },
  { label: "Fee Model", href: "https://docs.tempo.xyz/protocol/fees" },
];

export default function TempoProofSection() {
  return (
    <section
      id="tempo"
      className="relative py-28 md:py-36 px-6 md:px-12 bg-ink text-paper overflow-hidden scroll-mt-24"
    >
      <div className="absolute inset-0 halftone" aria-hidden="true" />
      <div className="relative z-10 max-w-[1160px] mx-auto">
        <div className="grid gap-12 lg:grid-cols-[0.85fr_1.15fr] lg:items-end">
          <div className="reveal-stamp">
            <div className="font-stencil text-xs text-gold uppercase tracking-widest mb-5">
              Tempo Native
            </div>
            <h2
              className="font-display font-bold leading-[0.9] tracking-tight text-paper"
              style={{ fontSize: "clamp(34px, 5vw, 68px)" }}
            >
              Built where payments move.
            </h2>
            <p className="mt-7 max-w-md text-paper/70 leading-relaxed">
              Tampiyo claims are pointed at Tempo Mainnet: stable-fee transactions,
              chain ID 4217, and no native gas token to hunt down before a claim.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              {links.map((link) => (
                <a
                  key={link.label}
                  href={link.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-4 py-2 border border-paper/25 text-paper/80 text-xs uppercase tracking-widest no-underline hover:border-gold hover:text-gold transition-colors"
                >
                  {link.label}
                </a>
              ))}
            </div>
          </div>

          <div className="tempo-proof-grid reveal-stamp">
            {proofCards.map((card) => (
              <article key={card.label} className="tempo-proof-card">
                <div className="font-stencil text-[10px] text-gold uppercase tracking-widest">
                  {card.label}
                </div>
                <div className="font-display text-3xl font-bold leading-none text-paper">
                  {card.value}
                </div>
                <p className="text-sm leading-relaxed text-paper/65">{card.detail}</p>
              </article>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
