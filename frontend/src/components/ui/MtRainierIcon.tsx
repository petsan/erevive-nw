export default function MtRainierIcon({ className = "", size = 40 }: { className?: string; size?: number }) {
  return (
    <svg
      width={size}
      height={size * 0.45}
      viewBox="0 0 200 80"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-label="Mt. Rainier"
    >
      {/* Mountain outline — broad, flat-topped dome */}
      <path
        d="M5 75 L25 65 L45 54 L60 44 L72 36 L80 30 L88 26 L96 24
           L104 24 L112 26 L120 30 L128 36 L140 44 L155 54 L175 65 L195 75"
        stroke="#222"
        strokeWidth="3"
        strokeLinecap="round"
        strokeLinejoin="round"
      />

      {/* Glacier lines on face */}
      <path d="M66 46 L72 40 L76 44" stroke="#222" strokeWidth="2.5" strokeLinecap="round" />
      <path d="M80 50 L86 42 L90 46 L94 38" stroke="#222" strokeWidth="2.5" strokeLinecap="round" />
      <path d="M106 38 L110 46 L114 42 L120 50" stroke="#222" strokeWidth="2.5" strokeLinecap="round" />
      <path d="M124 44 L128 40 L134 46" stroke="#222" strokeWidth="2.5" strokeLinecap="round" />
      <path d="M52 56 L58 50 L62 54" stroke="#222" strokeWidth="2.5" strokeLinecap="round" />
      <path d="M138 54 L144 50 L148 56" stroke="#222" strokeWidth="2.5" strokeLinecap="round" />
    </svg>
  );
}
