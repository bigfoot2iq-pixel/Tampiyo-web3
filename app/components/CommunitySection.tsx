import Image from "next/image";
import Link from "next/link";

export default function CommunitySection() {
  return (
    <section id="movement" className="relative overflow-hidden bg-charcoal px-5 py-20 sm:px-6 sm:py-24 md:px-12 md:py-40">
      {/* Halftone overlay */}
      <div className="absolute inset-0 halftone" />

      {/* Dragon rider background — large, low opacity */}
      <Image
        src="/panda/dragon.png"
        alt=""
        className="absolute right-0 bottom-0 pointer-events-none select-none"
        width={500}
        height={500}
        sizes="500px"
        style={{
          width: 500,
          height: "auto",
          opacity: 0.06,
        }}
        loading="lazy"
      />

      <div className="relative z-10 max-w-3xl mx-auto text-center">
        <div className="font-stencil text-xs text-smoke uppercase tracking-widest mb-6">
          Join the Movement
        </div>
        <h2
          className="mb-6 font-display text-[42px] font-bold leading-[0.94] text-paper sm:text-[54px] lg:text-[72px]"
        >
          Join. Or{" "}
          <span
            className="font-marker"
            style={{ fontSize: "0.85em", color: "var(--color-gold)" }}
          >
            don&apos;t.
          </span>
        </h2>

        {/* Social buttons — ink-outlined, no fills */}
        <div className="mt-10 flex flex-wrap justify-center gap-3 sm:mt-12 sm:gap-4">
          {/* X / Twitter */}
          <a
            href="https://x.com/Tampiyocoin"
            target="_blank"
            rel="noopener noreferrer"
            className="group flex w-full items-center justify-center gap-3 border-2 border-paper/30 px-6 py-4 font-body text-sm font-medium uppercase tracking-wider text-paper no-underline transition-colors hover:bg-paper hover:text-charcoal sm:w-auto sm:px-8"
          >
            <svg
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="currentColor"
              className="transition-colors"
              aria-hidden="true"
            >
              <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.742l7.732-8.835L1.254 2.25H8.08l4.253 5.622L18.244 2.25z" />
            </svg>
            Follow on X
          </a>

          {/* Discord */}
          <span
            className="group flex w-full items-center justify-center gap-3 border-2 border-paper/15 px-6 py-4 font-body text-sm font-medium uppercase tracking-wider text-paper/45 sm:w-auto sm:px-8"
            aria-disabled="true"
          >
            <svg
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="currentColor"
              className="transition-colors"
              aria-hidden="true"
            >
              <path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028c.462-.63.874-1.295 1.226-1.994a.076.076 0 0 0-.041-.106 13.107 13.107 0 0 1-1.872-.892.077.077 0 0 1-.008-.128 10.2 10.2 0 0 0 .372-.292.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127 12.299 12.299 0 0 1-1.873.892.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.839 19.839 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03z" />
            </svg>
            Discord Soon
          </span>

          {/* Claim */}
          <Link
            href="#claim"
            className="group flex w-full items-center justify-center gap-3 border-2 border-paper/30 px-6 py-4 font-body text-sm font-medium uppercase tracking-wider text-paper no-underline transition-colors hover:bg-paper hover:text-charcoal sm:w-auto sm:px-8"
          >
            <svg
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              className="transition-colors"
              aria-hidden="true"
            >
              <path d="M20 7H4a2 2 0 0 0-2 2v6a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2z" />
              <path d="M16 12h.01" />
            </svg>
            Claim $TAMPIYO
          </Link>
        </div>
      </div>
    </section>
  );
}
