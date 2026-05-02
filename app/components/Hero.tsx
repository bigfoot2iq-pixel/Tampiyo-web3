"use client";

import { useEffect, useState } from "react";
import { ConnectButton } from "./ConnectButton";

export default function Hero({ onClaim }: { onClaim?: () => void }) {
  const [petals, setPetals] = useState<
    { id: number; left: number; delay: number; duration: number; scale: number }[]
  >([]);

  useEffect(() => {
    const generated = Array.from({ length: 7 }, (_, i) => ({
      id: i,
      left: Math.random() * 100,
      delay: Math.random() * 8,
      duration: 8 + Math.random() * 6,
      scale: 0.6 + Math.random() * 0.6,
    }));
    setPetals(generated);
  }, []);

  return (
    <section className="relative min-h-screen overflow-hidden bg-paper">
      {/* Sakura petals */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {petals.map((p) => (
          <div
            key={p.id}
            className="petal"
            style={{
              left: `${p.left}%`,
              animationDelay: `${p.delay}s`,
              animationDuration: `${p.duration}s`,
            }}
          >
            <svg
              width={14 * p.scale}
              height={14 * p.scale}
              viewBox="0 0 20 20"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              style={{ opacity: 0.35 }}
            >
              <path
                d="M10 2 C14 6, 18 10, 10 18 C2 10, 6 6, 10 2Z"
                fill="currentColor"
                className="text-ink"
              />
            </svg>
          </div>
        ))}
      </div>

      {/* Nav */}
      <nav className="fixed top-0 left-0 right-0 z-100 flex items-center justify-between px-12 py-5"
        style={{ background: 'linear-gradient(to bottom, rgba(10,10,11,0.95) 0%, transparent 100%)', backdropFilter: 'blur(2px)' }}
      >
        <div className="flex items-center gap-3 text-ink">
          <img
            src="/panda/samurai.png"
            alt="Tampiyo"
            width={32}
            height={32}
            className="rounded overflow-hidden object-cover"
          />
          <span
            className="font-stencil text-gold text-xl uppercase"
            style={{ letterSpacing: "0.18em", textShadow: "2px 2px 0 #8E6A14" }}
          >
            TAMPIYO
          </span>
        </div>
        <ConnectButton />
      </nav>

      {/* Main hero content */}
      <div className="relative z-10 flex flex-col justify-center min-h-screen pt-32 pb-16 px-6 md:pl-16 lg:pl-24 xl:pl-32 w-full md:w-1/2">

        <div className="flex items-center gap-3 text-ink mb-12" style={{ visibility: 'hidden' }}>
          <img
            src="/panda/samurai.png"
            alt="Tampiyo"
            width={36}
            height={36}
            className="rounded-full overflow-hidden object-cover"
          />
          <span
            className="font-stencil text-gold text-2xl uppercase"
            style={{ letterSpacing: "0.18em", textShadow: "2px 2px 0 #8E6A14" }}
          >
            TAMPIYO
          </span>
        </div>

        <h1
          className="font-display font-bold leading-[0.93] tracking-tight text-ink"
          style={{ fontSize: "clamp(48px, 5vw, 80px)" }}
        >
          <span className="ink-wipe block" style={{ animationDelay: "0.1s" }}>
            A grumpy panda.
          </span>
          <span className="ink-wipe block" style={{ animationDelay: "0.3s" }}>
            A token.
          </span>
          <span className="ink-wipe block" style={{ animationDelay: "0.5s" }}>
            Don&apos;t make it{" "}
            <span className="font-marker text-gold" style={{ fontSize: "0.72em" }}>
              weird.
            </span>
          </span>
        </h1>

        <p
          className="font-body text-ink-soft mt-10 max-w-xs text-sm leading-loose opacity-0"
          style={{ animation: "fadeSlideUp 0.6s 0.7s ease forwards" }}
        >
          <strong className="text-ink">$TMPY</strong> — He doesn&apos;t care
          if you ape in. He won&apos;t care if you leave.
        </p>

        {onClaim && (
          <div
            className="mt-8 opacity-0"
            style={{ animation: "fadeSlideUp 0.6s 0.9s ease forwards" }}
          >
            <button className="btn-ink btn-ink-gold text-sm" onClick={onClaim}>
              CLAIM YOUR TOKENS &rarr;
            </button>
          </div>
        )}

        <div
          className="mt-12 grid grid-cols-3 w-fit font-body opacity-0 border-y border-ink/20 divide-x divide-ink/15"
          style={{ animation: "fadeSlideUp 0.6s 1.1s ease forwards" }}
        >
          {[
            { value: "1B", label: "supply" },
            { value: "0%", label: "tax" },
            { value: "100%", label: "grumpy" },
          ].map((stat) => (
            <div key={stat.label} className="px-5 py-4">
              <div className="font-display font-bold text-lg text-ink leading-none">
                {stat.value}
              </div>
              <div className="text-[10px] text-smoke uppercase tracking-widest mt-1.5">
                {stat.label}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Hero panda — right side, anchored top-to-bottom */}
      <div className="absolute top-0 right-0 bottom-0 z-0 pointer-events-none select-none hidden md:flex items-end w-[46%] lg:w-[48%]">
        <img
          src="/panda/king.png"
          alt=""
          className="block h-full w-full"
          style={{
            objectFit: "contain",
            objectPosition: "bottom right",
            opacity: 0.92,
          }}
          loading="eager"
        />
      </div>

      {/* Mobile panda — low opacity background */}
      <div className="absolute inset-0 z-0 pointer-events-none select-none md:hidden flex items-end justify-center">
        <img
          src="/panda/king.png"
          alt=""
          className="block"
          style={{
            height: "70vh",
            width: "auto",
            objectFit: "contain",
            objectPosition: "bottom center",
            opacity: 0.12,
          }}
          loading="eager"
        />
      </div>

      {/* Fade at bottom edge to blend panda */}
      <div
        className="absolute bottom-0 left-0 right-0 h-32 z-[5] pointer-events-none"
        style={{
          background:
            "linear-gradient(to top, var(--color-paper) 0%, transparent 100%)",
        }}
      />
    </section>
  );
}