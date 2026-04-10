export default function MtRainierIcon({ className = "", size = 40 }: { className?: string; size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 100 100"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-label="Mt. Rainier"
    >
      {/* Snow-capped peak */}
      <path
        d="M50 8 L72 45 L80 42 L90 60 L95 58 L100 72 L0 72 L5 58 L10 60 L20 42 L28 45 Z"
        fill="currentColor"
        opacity="0.9"
      />
      {/* Snow cap */}
      <path
        d="M50 8 L62 32 L55 30 L50 20 L45 30 L38 32 Z"
        fill="white"
        opacity="0.95"
      />
      {/* Secondary snow patches */}
      <path
        d="M35 38 L40 35 L44 40 L38 42 Z M56 40 L60 35 L65 38 L62 42 Z"
        fill="white"
        opacity="0.7"
      />
      {/* Treeline at base */}
      <path
        d="M0 72 L5 65 L8 72 L12 63 L15 72 L19 64 L22 72 L26 62 L30 72 L34 64 L37 72 L41 63 L44 72 L48 65 L50 72 L52 65 L56 72 L59 63 L63 72 L66 64 L70 72 L74 62 L78 72 L81 64 L85 72 L88 63 L92 72 L95 65 L100 72 L100 80 L0 80 Z"
        fill="currentColor"
        opacity="0.5"
      />
      {/* Recycling arrows at base */}
      <path
        d="M42 82 L50 78 L58 82 L54 82 L54 90 L46 90 L46 82 Z"
        fill="currentColor"
        opacity="0.3"
      />
    </svg>
  );
}
