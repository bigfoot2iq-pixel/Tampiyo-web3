"use client";

import { useState } from "react";

const CONTRACT_ADDRESS = "To be announced at launch";

const tokenRows = [
  { fraction: "40 / 100", label: "Community & Airdrop" },
  { fraction: "30 / 100", label: "Liquidity (Locked 12 Months)" },
  { fraction: "15 / 100", label: "Marketing" },
  { fraction: "15 / 100", label: "Team (12-Month Lock)" },
];

export default function NumbersSection() {
  const [copied, setCopied] = useState(false);

  async function handleCopy() {
    try {
      await navigator.clipboard.writeText(CONTRACT_ADDRESS);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      // clipboard not available
    }
  }

  return (
    <section
      id="tokenomics"
      className="py-28 md:py-36 px-6 md:px-12 bg-paper"
    >
      <div className="max-w-[900px] mx-auto">
        {/* Section header */}
        <div className="mb-16 reveal-stamp">
          <div className="font-stencil text-xs text-smoke uppercase tracking-widest mb-4">
            Tokenomics
          </div>
          <h2
            className="font-display font-bold text-ink leading-[0.9] tracking-tight"
            style={{ fontSize: "clamp(28px, 4vw, 48px)" }}
          >
            The math.
            <br />
            <span className="font-marker text-gold" style={{ fontSize: "0.85em" }}>
              He did it once.
            </span>
          </h2>
        </div>

        {/* Typographic tokenomics */}
        <div className="reveal-stamp">
          {tokenRows.map((row) => (
            <div
              key={row.label}
              className="flex items-baseline gap-6 py-6 border-b border-ink/15"
            >
              <span
                className="font-display font-bold text-ink flex-shrink-0"
                style={{ fontSize: "clamp(32px, 5vw, 56px)" }}
              >
                {row.fraction}
              </span>
              <span className="font-body text-ink-soft text-base uppercase tracking-wider">
                {row.label}
              </span>
            </div>
          ))}
        </div>

        {/* Contract address */}
        <div className="mt-12 p-6 bg-paper-2 border border-ink/10 reveal-stamp">
          <div className="text-xs text-smoke uppercase tracking-widest mb-3">
            Contract Address
          </div>
          <div className="flex items-center gap-4">
            <code className="font-mono text-ink text-sm break-all">
              {CONTRACT_ADDRESS}
            </code>
            <button
              className="flex-shrink-0 btn-paper text-xs py-2 px-4"
              onClick={handleCopy}
              aria-label="Copy contract address"
            >
              {copied ? "Copied" : "Copy"}
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
