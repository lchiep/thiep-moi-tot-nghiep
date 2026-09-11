"use client";

const STAMP_RED = "#b3261e";

/** Five small stars spread along the lower arc, mirroring the reference
 * mockup's star row — simpler and more reliable than curved bottom text. */
function BottomStars() {
  const stars = [200, 235, 270, 305, 340]; // degrees, spread under the circle
  return (
    <>
      {stars.map((deg) => {
        const rad = (deg * Math.PI) / 180;
        const r = 68;
        const cx = 100 + r * Math.cos(rad);
        const cy = 100 + r * Math.sin(rad);
        return (
          <text
            key={deg}
            x={cx}
            y={cy}
            fontSize="11"
            textAnchor="middle"
            fill={STAMP_RED}
            transform={`rotate(${deg + 90} ${cx} ${cy})`}
          >
            ★
          </text>
        );
      })}
    </>
  );
}

/**
 * The ink impression itself — red rubber-stamp mark reading "BẠN ĐƯỢC
 * MỜI" around the top, double ring border, light grunge texture via SVG
 * turbulence so it reads as a real (slightly imperfect) ink press rather
 * than a flat sticker.
 */
export default function InkStampMark({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 200 200"
      className={className}
      style={{ mixBlendMode: "multiply" }}
    >
      <defs>
        <path id="stampTopArc" d="M 24,112 A 76,76 0 1 1 176,112" fill="none" />
        <filter id="stampGrunge">
          <feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves={2} result="noise" />
          <feDisplacementMap in="SourceGraphic" in2="noise" scale="3.2" />
        </filter>
      </defs>

      <g filter="url(#stampGrunge)" opacity={0.88}>
        <circle cx="100" cy="100" r="94" fill="none" stroke={STAMP_RED} strokeWidth="3" />
        <circle cx="100" cy="100" r="84" fill="none" stroke={STAMP_RED} strokeWidth="1.5" />

        <text fontSize="19" fontWeight={700} fill={STAMP_RED} letterSpacing="1.5">
          <textPath href="#stampTopArc" startOffset="50%" textAnchor="middle">
            BẠN ĐƯỢC MỜI
          </textPath>
        </text>

        <BottomStars />

        <text
          x="100"
          y="108"
          fontSize="15"
          fontWeight={700}
          textAnchor="middle"
          fill={STAMP_RED}
        >
          ★
        </text>
      </g>
    </svg>
  );
}
