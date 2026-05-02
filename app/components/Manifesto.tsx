export default function Manifesto() {
  return (
    <section className="relative bg-charcoal py-32 md:py-40 px-6 md:px-12 overflow-hidden">
      {/* Halftone overlay */}
      <div className="absolute inset-0 halftone" />

      <div className="relative z-10 max-w-4xl mx-auto text-center">
        <p
          className="font-display font-bold text-paper leading-[0.95] tracking-tight"
          style={{ fontSize: "clamp(28px, 4.5vw, 64px)" }}
        >
          He doesn&apos;t care if you ape in.
          <br />
          He doesn&apos;t care if you don&apos;t.
          <br />
          The chart will do{" "}
          <span className="font-marker text-gold" style={{ fontSize: "0.85em" }}>
            whatever it wants.
          </span>
        </p>
      </div>
    </section>
  );
}
