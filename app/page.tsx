"use client";

import Hero from "./components/Hero";
import Manifesto from "./components/Manifesto";
import TickerStrip from "./components/TickerStrip";
import ClaimSection from "./components/claim/ClaimSection";
import TempoProofSection from "./components/TempoProofSection";
import CastSection from "./components/CastSection";
import NumbersSection from "./components/NumbersSection";
import PathSection from "./components/PathSection";
import CommunitySection from "./components/CommunitySection";
import LeaderboardPreview from "./components/LeaderboardPreview";
import FooterSection from "./components/FooterSection";
import { useScrollReveal } from "./components/useScrollReveal";

export default function Home() {
  useScrollReveal();

  return (
    <>
      {/* SVG filter for ink-edge roughening (used via .ink-edge class) */}
      <svg width="0" height="0" style={{ position: "absolute" }}>
        <defs>
          <filter id="inkRoughen">
            <feTurbulence
              type="fractalNoise"
              baseFrequency="0.05"
              numOctaves="3"
              result="noise"
            />
            <feDisplacementMap
              in="SourceGraphic"
              in2="noise"
              scale="2"
              xChannelSelector="R"
              yChannelSelector="G"
            />
          </filter>
        </defs>
      </svg>

      <main id="main">
        <Hero />
        <Manifesto />
        <TickerStrip />
        <ClaimSection />
        <TempoProofSection />
        <CastSection />
        <NumbersSection />
        <PathSection />
        <CommunitySection />
        <LeaderboardPreview />
      </main>
      <FooterSection />
    </>
  );
}
