import BeretLogo from "./BeretLogo";

export default function FooterSection() {
  return (
    <footer className="bg-paper py-12 px-6 md:px-12">
      {/* Ink horizontal rule */}
      <hr className="border-0 h-[2px] bg-ink/80 mb-12" />

      <div className="max-w-[1200px] mx-auto flex flex-col md:flex-row items-start md:items-center justify-between gap-8">
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
          $TMPY is a community token. He bears no responsibility for your
          decisions.
        </p>

        {/* Links */}
        <div className="flex gap-6">
          {["Whitepaper", "Audit", "Twitter/X"].map((link) => (
            <a
              key={link}
              href="#"
              className="font-body text-sm text-smoke no-underline hover:text-ink transition-colors"
            >
              {link}
            </a>
          ))}
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
