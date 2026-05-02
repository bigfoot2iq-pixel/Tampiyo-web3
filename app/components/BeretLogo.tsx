/**
 * BeretLogo — the actual brand mark.
 * Black beret silhouette with gold "T" patch.
 * Used in nav, footer, modal header, favicon.
 */
export default function BeretLogo({
  size = 36,
  className = "",
}: {
  size?: number;
  className?: string;
}) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 80 80"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-label="TAMPIYO logo"
    >
      {/* Beret body — irregular ink-drawn shape */}
      <path
        d="M12 48 Q10 30, 22 22 Q30 16, 42 14 Q54 12, 62 20 Q70 28, 68 42 Q66 54, 54 58 Q42 62, 30 58 Q18 54, 12 48Z"
        fill="currentColor"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinejoin="round"
      />
      {/* Beret top bump */}
      <path
        d="M36 14 Q38 8, 42 6 Q46 8, 44 14"
        fill="currentColor"
        stroke="currentColor"
        strokeWidth="1"
      />
      {/* Gold patch */}
      <rect
        x="28"
        y="32"
        width="22"
        height="18"
        rx="2"
        fill="var(--color-gold, #C8961F)"
        stroke="var(--color-gold-deep, #8E6A14)"
        strokeWidth="1"
        transform="rotate(-3, 39, 41)"
      />
      {/* "T" on patch */}
      <text
        x="39"
        y="47"
        textAnchor="middle"
        fill="white"
        fontFamily="sans-serif"
        fontWeight="800"
        fontSize="14"
        transform="rotate(-3, 39, 41)"
      >
        T
      </text>
    </svg>
  );
}
