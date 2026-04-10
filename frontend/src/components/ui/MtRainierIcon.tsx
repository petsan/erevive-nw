export default function MtRainierIcon({ className = "", size = 40 }: { className?: string; size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 100 80"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-label="Mt. Rainier"
    >
      {/* Mountain body */}
      <path
        d="M50 5 L75 50 L82 47 L95 65 L100 63 L100 80 L0 80 L0 63 L5 65 L18 47 L25 50 Z"
        fill="currentColor"
        opacity="0.85"
      />
      {/* Snow cap */}
      <path
        d="M50 5 L60 28 L56 26 L50 15 L44 26 L40 28 Z"
        fill="white"
        opacity="0.95"
      />
      {/* Snow patches on ridges */}
      <path
        d="M38 35 L42 31 L46 37 L41 39 Z"
        fill="white"
        opacity="0.6"
      />
      <path
        d="M54 37 L58 31 L62 35 L59 39 Z"
        fill="white"
        opacity="0.6"
      />
    </svg>
  );
}
