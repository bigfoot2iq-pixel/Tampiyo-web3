export default function Manifesto() {
  return (
    <section className="relative overflow-hidden bg-charcoal px-5 py-20 sm:px-6 sm:py-24 md:px-12 md:py-40">
      {/* Halftone overlay */}
      <div className="absolute inset-0 halftone" />

      <div className="relative z-10 max-w-4xl mx-auto text-center">
        <p
          className="font-display text-[30px] font-bold leading-[0.98] text-paper sm:text-[42px] lg:text-[64px]"
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
