import Link from "next/link";
import BeretLogo from "./BeretLogo";

const footerLinks = [
  { label: "Tempo Docs", href: "https://docs.tempo.xyz/" },
  { label: "X", href: "https://x.com/Tampiyocoin" },
];

export default function FooterSection() {
  return (
    <footer className="bg-paper px-5 py-10 sm:px-6 md:px-12 md:py-12">
      {/* Ink horizontal rule */}
      <hr className="border-0 h-[2px] bg-ink/80 mb-12" />

      <div className="mx-auto flex max-w-[1200px] flex-col items-start justify-between gap-7 md:flex-row md:items-center md:gap-8">
        {/* Logo */}
        <div className="flex items-center gap-3 text-ink">
          <BeretLogo size={32} />
          <span
            className="font-display font-bold text-lg tracking-widest"
            style={{ letterSpacing: "0.1em" }}
          >
            TAMPIYO
          </span>
        </div>

        {/* Disclaimer — left-aligned, narrow column */}
        <p
          className="font-body text-sm text-smoke max-w-sm leading-relaxed"
          style={{ fontVariant: "small-caps" }}
        >
          $TAMPIYO is a community token on Tempo Mainnet. Verify contracts and claim
          state before sending transactions.
        </p>

        {/* Links */}
        <div className="flex flex-wrap gap-x-6 gap-y-3">
          <Link
            href="#claim"
            className="font-body text-sm text-smoke no-underline hover:text-ink transition-colors"
          >
            Claim
          </Link>
          {footerLinks.map((link) => (
            <a
              key={link.label}
              href={link.href}
              target="_blank"
              rel="noopener noreferrer"
              className="font-body text-sm text-smoke no-underline hover:text-ink transition-colors"
            >
              {link.label}
            </a>
          ))}
          <span className="font-body text-sm text-bone" aria-disabled="true">
            Audit Pending
          </span>
        </div>
      </div>

      {/* Tiny "panda approved" stamp */}
      <div className="mt-12 flex justify-center">
        <div
          className="font-stencil text-xs text-bone uppercase tracking-widest"
          style={{ letterSpacing: "0.15em", opacity: 0.5 }}
        >
          &#9670; Panda saw this and approved
        </div>
      </div>
    </footer>
  );
}
