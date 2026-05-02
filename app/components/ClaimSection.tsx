"use client";

import { useState } from "react";

export default function ClaimSection({ onClaim }: { onClaim: () => void }) {
  const [wallet, setWallet] = useState("");

  return (
    <section
      id="claim"
      className="relative py-28 md:py-36 px-6 md:px-12 bg-paper-2 overflow-hidden"
    >
      <div className="max-w-[1100px] mx-auto flex flex-col lg:flex-row items-center gap-16 lg:gap-20">
        {/* Samurai panda — anchored with tape */}
        <div className="relative flex-shrink-0 reveal-stamp">
          <img
            src="/panda/samurai.png"
            alt=""
            className="block"
            style={{ width: 220, height: "auto" }}
            loading="lazy"
          />
          {/* Tape accent */}
          <div
            className="absolute -top-3 left-1/2 -translate-x-1/2 w-20 h-5 bg-bone/60 rotate-[-2deg]"
            style={{
              clipPath:
                "polygon(2% 0%, 98% 3%, 100% 100%, 0% 97%)",
            }}
          />
        </div>

        {/* Contract / ritual card */}
        <div className="flex-1 max-w-lg reveal-stamp">
          {/* Stamp */}
          <div
            className="font-stencil text-xs text-gold uppercase tracking-widest mb-6"
            style={{ letterSpacing: "0.2em" }}
          >
            &#9670; The Panda&apos;s Offer
          </div>

          <h2
            className="font-display font-bold text-ink leading-[0.95] tracking-tight mb-6"
            style={{ fontSize: "clamp(28px, 4vw, 48px)" }}
          >
            Take the tokens.
            <br />
            He&apos;s not going to{" "}
            <span className="font-marker text-gold" style={{ fontSize: "0.85em" }}>
              ask twice.
            </span>
          </h2>

          {/* Paper card with torn edge — shadow on wrapper so clip-path doesn't eat it */}
          <div className="mt-8 shadow-hard">
          <div className="bg-paper border border-ink/15 p-8 torn-edge">
            {/* Amount display */}
            <div className="text-center mb-8 pb-6 border-b border-ink/10">
              <div className="text-xs text-smoke uppercase tracking-widest mb-2">
                Your Claimable Amount
              </div>
              <div
                className="font-display font-bold text-ink"
                style={{ fontSize: "clamp(36px, 5vw, 56px)" }}
              >
                10,000{" "}
                <sup className="text-smoke font-body text-lg">$TMPY</sup>
              </div>
            </div>

            {/* Signature line input */}
            <div className="mb-6">
              <label
                htmlFor="claim-wallet"
                className="block text-xs text-smoke uppercase tracking-widest mb-3"
              >
                Your Ethereum Address
              </label>
              <input
                id="claim-wallet"
                type="text"
                value={wallet}
                onChange={(e) => setWallet(e.target.value)}
                placeholder="0x..."
                autoComplete="off"
                aria-label="Ethereum wallet address"
                className="w-full bg-transparent border-0 border-b-2 border-ink/30 pb-3 font-mono text-ink text-sm placeholder:text-bone focus:border-ink focus:outline-none transition-colors"
              />
            </div>

            {/* Claim button */}
            <button
              className="btn-ink btn-ink-gold w-full text-base py-4"
              onClick={onClaim}
            >
              Claim 10,000 $TMPY
            </button>
          </div>
          </div>

          <p className="text-xs text-smoke mt-6 leading-relaxed">
            One claim per wallet. Gas is on you. Don&apos;t make him repeat
            himself.
          </p>
        </div>
      </div>
    </section>
  );
}