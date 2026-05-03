import Image from "next/image";

export default function BeretLogo({
  size = 36,
  className = "",
}: {
  size?: number;
  className?: string;
}) {
  return (
    <span
      className={`inline-flex shrink-0 overflow-hidden border border-gold/60 bg-charcoal ${className}`}
      style={{
        width: size,
        height: size,
        borderRadius: 4,
        boxShadow: "2px 2px 0 rgba(20, 19, 15, 0.32)",
      }}
      role="img"
      aria-label="TAMPIYO samurai panda logo"
    >
      <Image
        src="/panda/samurai.png"
        alt=""
        width={size}
        height={size}
        sizes={`${size}px`}
        className="h-full w-full object-cover"
      />
    </span>
  );
}
