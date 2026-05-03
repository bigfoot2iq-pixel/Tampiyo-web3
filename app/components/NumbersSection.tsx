"use client";

import { useState } from "react";
import { activeAddresses } from "@/app/lib/addresses";
import { activeChain } from "@/app/lib/chains";

const CONTRACT_ADDRESS = activeAddresses.tampiyo;
const EXPLORER_BASE_URL = activeChain.blockExplorers.default.url;

const tokenRows = [
  { fraction: "40%", label: "Community & Claims" },
  { fraction: "30%", label: "Tempo Liquidity" },
  { fraction: "15%", label: "Market & Listings" },
  { fraction: "15%", label: "Team Lock" },
];

function isRealAddress(address: string) {
  return /^0x[0-9a-fA-F]{40}$/.test(address);
}

export default function NumbersSection() {
  const [copied, setCopied] = useState(false);
  const contractIsLive = isRealAddress(CONTRACT_ADDRESS);

  async function handleCopy() {
    if (!contractIsLive) return;
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
      className="bg-paper px-5 py-20 sm:px-6 sm:py-24 md:px-12 md:py-36"
    >
      <div className="max-w-[900px] mx-auto">
        {/* Section header */}
        <div className="mb-10 reveal-stamp sm:mb-12 md:mb-16">
          <div className="font-stencil text-xs text-smoke uppercase tracking-widest mb-4">
            Tokenomics
          </div>
          <h2
            className="font-display text-[32px] font-bold leading-[0.94] text-ink sm:text-[40px] lg:text-[48px]"
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
              className="flex flex-col gap-1 border-b border-ink/15 py-5 sm:flex-row sm:items-baseline sm:gap-6 sm:py-6"
            >
              <span
                className="flex-shrink-0 font-display text-[38px] font-bold leading-none text-ink sm:text-[46px] lg:text-[56px]"
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
        <div className="mt-10 border border-ink/10 bg-paper-2 p-4 reveal-stamp sm:mt-12 sm:p-6">
          <div className="text-xs text-smoke uppercase tracking-widest mb-3">
            Tempo Contract Address
          </div>
          <div className="flex flex-col sm:flex-row sm:items-center gap-4">
            <code className="font-mono text-ink text-sm break-all">
              {contractIsLive ? CONTRACT_ADDRESS : "Revealed at launch"}
            </code>
            <div className="flex w-full flex-wrap gap-3 sm:w-auto" aria-live="polite">
              <button
                className="btn-paper w-full flex-shrink-0 px-4 py-2 text-xs sm:w-auto"
                onClick={handleCopy}
                aria-label="Copy Tempo contract address"
                disabled={!contractIsLive}
              >
                {copied ? "Copied" : "Copy"}
              </button>
              {contractIsLive ? (
                <a
                  href={`${EXPLORER_BASE_URL}/address/${CONTRACT_ADDRESS}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-paper w-full px-4 py-2 text-center text-xs no-underline sm:w-auto"
                >
                  View Explorer
                </a>
              ) : (
                <span className="inline-flex w-full items-center justify-center border border-ink/20 px-4 py-2 text-center text-xs uppercase tracking-widest text-smoke sm:w-auto">
                  Verification pending
                </span>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
