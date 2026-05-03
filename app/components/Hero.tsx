"use client";

import Image from "next/image";
import Link from "next/link";
import BeretLogo from "./BeretLogo";
import { ConnectButton } from "./ConnectButton";

const petals = [
  { id: 0, left: 6, delay: 0.2, duration: 12, scale: 0.75 },
  { id: 1, left: 18, delay: 2.4, duration: 10, scale: 0.95 },
  { id: 2, left: 33, delay: 5.1, duration: 14, scale: 0.68 },
  { id: 3, left: 52, delay: 1.7, duration: 11, scale: 1.05 },
  { id: 4, left: 68, delay: 4.6, duration: 13, scale: 0.82 },
  { id: 5, left: 84, delay: 0.9, duration: 15, scale: 1.15 },
  { id: 6, left: 94, delay: 6.2, duration: 12, scale: 0.7 },
];

export default function Hero() {
  return (
    <section className="relative min-h-[100svh] overflow-hidden bg-paper md:min-h-screen">
      {/* Sakura petals */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden" aria-hidden="true">
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
      <nav className="landing-nav fixed top-0 left-0 right-0 z-[100] flex items-center justify-between gap-3 px-4 py-3 sm:px-5 md:px-12 md:py-5"
        style={{ background: 'linear-gradient(to bottom, rgba(10,10,11,0.95) 0%, transparent 100%)', backdropFilter: 'blur(2px)' }}
      >
        <Link href="/" className="flex min-w-0 items-center gap-2 text-ink no-underline sm:gap-3" aria-label="Tampiyo home">
          <BeretLogo size={32} className="flex-shrink-0 text-ink" />
          <span
            className="hero-brand-text whitespace-nowrap font-stencil text-base text-gold uppercase md:text-xl"
            style={{ letterSpacing: "0.12em", textShadow: "1px 1px 0 #8E6A14" }}
          >
            TAMPIYO
          </span>
        </Link>
        <div className="landing-nav-links hidden items-center gap-6 font-body text-xs uppercase tracking-widest md:flex">
          <Link href="#claim" className="text-paper/80 no-underline hover:text-gold transition-colors">
            Claim
          </Link>
          <Link href="#tempo" className="text-paper/80 no-underline hover:text-gold transition-colors">
            Tempo
          </Link>
          <Link href="#tokenomics" className="text-paper/80 no-underline hover:text-gold transition-colors">
            Tokenomics
          </Link>
        </div>
        <div className="flex flex-shrink-0 justify-end">
          <ConnectButton compact />
        </div>
      </nav>

      {/* Main hero content */}
      <div className="relative z-10 flex min-h-[100svh] w-full flex-col justify-center px-5 pb-10 pt-24 sm:px-6 sm:pt-28 md:min-h-screen md:w-1/2 md:pb-16 md:pl-16 md:pt-32 lg:pl-24 xl:pl-32">
        <h1
          className="font-display text-[44px] font-bold leading-[0.96] text-ink sm:text-[54px] md:text-[60px] lg:text-[72px] xl:text-[80px]"
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
          className="font-body mt-7 max-w-[18rem] text-[15px] leading-7 text-ink-soft opacity-0 sm:mt-8 sm:max-w-xs"
          style={{ animation: "fadeSlideUp 0.6s 0.7s ease forwards" }}
        >
          <strong className="text-ink" translate="no">$TAMPIYO</strong> on Tempo Mainnet.
          Stable-fee claims, no native gas token, no fake complexity.
        </p>

        <div
          className="hero-actions mt-7 flex flex-col gap-3 opacity-0 sm:mt-8 sm:flex-row"
          style={{ animation: "fadeSlideUp 0.6s 0.9s ease forwards" }}
        >
          <Link className="btn-ink btn-ink-gold text-center text-xs no-underline sm:text-sm" href="#claim">
            Claim $TAMPIYO on Tempo -&gt;
          </Link>
          <Link className="btn-paper text-center text-xs no-underline sm:text-sm" href="#tempo">
            Verify Network
          </Link>
        </div>

        <div
          className="mt-8 grid w-full max-w-[20rem] grid-cols-3 divide-x divide-ink/15 border-y border-ink/20 font-body opacity-0 sm:mt-10 sm:w-fit"
          style={{ animation: "fadeSlideUp 0.6s 1.1s ease forwards" }}
        >
          {[
            { value: "1B", label: "supply" },
            { value: "0%", label: "tax" },
            { value: "4217", label: "chain" },
          ].map((stat) => (
            <div key={stat.label} className="px-3 py-3 sm:px-5 sm:py-4">
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
        <Image
          src="/panda/king.png"
          alt=""
          fill
          sizes="(max-width: 1024px) 46vw, 48vw"
          className="block"
          style={{
            objectFit: "contain",
            objectPosition: "bottom right",
            opacity: 0.92,
          }}
          preload
        />
      </div>

      {/* Mobile panda — low opacity background */}
      <div className="absolute inset-0 z-0 pointer-events-none select-none md:hidden flex items-end justify-center">
        <Image
          src="/panda/king.png"
          alt=""
          className="block"
          width={720}
          height={720}
          style={{
            height: "48svh",
            width: "auto",
            objectFit: "contain",
            objectPosition: "bottom center",
            opacity: 0.11,
            transform: "translateY(4%)",
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
