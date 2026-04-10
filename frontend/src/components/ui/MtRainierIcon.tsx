export default function MtRainierIcon({ className = "", size = 40 }: { className?: string; size?: number }) {
  return (
    <svg
      width={size}
      height={size * 0.6}
      viewBox="0 0 120 72"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-label="Mt. Rainier"
    >
      <path d="M60 0 L100 55 L120 72 L0 72 L20 55 Z" fill="currentColor" />
      <path d="M60 0 L70 22 L64 18 L60 8 L56 18 L50 22 Z" fill="white" />
    </svg>
  );
}
