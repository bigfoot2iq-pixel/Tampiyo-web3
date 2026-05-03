import Image from "next/image";

const characters = [
  {
    name: "The King",
    desc: "Rules from a chair. Has not gotten up since 2023.",
    img: "/panda/king.png",
    size: "large",
    rotation: -1.5,
  },
  {
    name: "The Samurai",
    desc: "Katana in hand. Blossom petals falling. Unbothered.",
    img: "/panda/samurai.png",
    size: "small",
    rotation: 1,
  },
  {
    name: "The Skater",
    desc: "Shredding the streets. Graffiti backdrop included.",
    img: "/panda/skater.png",
    size: "small",
    rotation: -0.8,
  },
  {
    name: "The Conqueror",
    desc: "Riding dragons. Nothing stops him. Not even you.",
    img: "/panda/dragon.png",
    size: "small",
    rotation: 1.2,
  },
];

export default function CastSection() {
  return (
    <section id="characters" className="bg-paper px-5 py-20 sm:px-6 sm:py-24 md:px-12 md:py-36">
      <div className="max-w-[1200px] mx-auto">
        {/* Section header — left-aligned, asymmetric */}
        <div className="mb-10 reveal-stamp sm:mb-12 md:mb-16">
          <div className="font-stencil text-xs text-smoke uppercase tracking-widest mb-4">
            The Tampiyo Universe
          </div>
          <h2
            className="font-display text-[34px] font-bold leading-[0.94] text-ink sm:text-[44px] lg:text-[56px]"
          >
            One Panda,
            <br />
            <span className="font-marker text-gold" style={{ fontSize: "0.85em" }}>
              Many Lives.
            </span>
          </h2>
        </div>

        {/* Comic panel grid — stacks on mobile, asymmetric mosaic on desktop */}
        <div className="cast-grid">
          {characters.map((char) => {
            const area =
              char.name === "The King"
                ? "king"
                : char.name === "The Samurai"
                  ? "samurai"
                  : char.name === "The Skater"
                    ? "skater"
                    : "dragon";
            return (
            <div
              key={char.name}
              className="cast-card reveal-stamp relative bg-paper border-2 border-ink overflow-hidden"
              style={{
                gridArea: area,
                transform: `rotate(${char.rotation}deg)`,
                boxShadow: "3px 3px 0 var(--color-ink)",
              }}
            >
              {/* Character image */}
              <div className="cast-img-wrap relative bg-paper-2 overflow-hidden">
                <Image
                  src={char.img}
                  alt={char.name}
                  fill
                  sizes="(max-width: 768px) 100vw, 33vw"
                  className="object-cover"
                  loading="lazy"
                />
              </div>

              {/* Hand-lettered name caption */}
              <div className="p-4 border-t border-ink/20 flex-shrink-0">
                <div className="font-marker text-ink text-xl mb-1">
                  {char.name}
                </div>
                <div className="font-body text-sm text-smoke leading-snug">
                  {char.desc}
                </div>
              </div>
            </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
