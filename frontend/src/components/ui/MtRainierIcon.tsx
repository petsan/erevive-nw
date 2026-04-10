export default function MtRainierIcon({ className = "", size = 40 }: { className?: string; size?: number }) {
  return (
    <svg
      width={size}
      height={size * 0.75}
      viewBox="0 0 200 150"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-label="Mt. Rainier"
    >
      {/* Sun behind summit */}
      <circle cx="90" cy="22" r="14" fill="#e8943a" stroke="#222" strokeWidth="2.5" />

      {/* Mountain outline — broad dome like the real Rainier */}
      <path
        d="M10 95 L30 78 L48 65 L62 52 L74 40 L84 30 L92 22 L100 18
           L108 22 L116 30 L126 40 L138 52 L152 65 L170 78 L190 95"
        stroke="#222"
        strokeWidth="3"
        strokeLinecap="round"
        strokeLinejoin="round"
      />

      {/* Glacier lines — curved strokes on the mountain face */}
      <path d="M68 56 L74 48 L78 52 L84 44" stroke="#222" strokeWidth="2.5" strokeLinecap="round" />
      <path d="M82 58 L88 50 L92 54" stroke="#222" strokeWidth="2.5" strokeLinecap="round" />
      <path d="M116 44 L122 52 L126 48 L132 56" stroke="#222" strokeWidth="2.5" strokeLinecap="round" />
      <path d="M108 54 L112 50 L118 58" stroke="#222" strokeWidth="2.5" strokeLinecap="round" />
      <path d="M56 68 L62 62 L66 66" stroke="#222" strokeWidth="2.5" strokeLinecap="round" />
      <path d="M134 66 L140 62 L144 68" stroke="#222" strokeWidth="2.5" strokeLinecap="round" />

      {/* Treeline — row of simple arrow trees */}
      {[20, 36, 52, 68, 84, 100, 116, 132, 148, 164, 180].map((x) => (
        <path
          key={x}
          d={`M${x} 112 L${x - 6} 104 L${x - 3} 104 L${x - 8} 96 L${x} 88 L${x + 8} 96 L${x + 3} 104 L${x + 6} 104 Z`}
          fill="#222"
        />
      ))}

      {/* Ground line under trees */}
      <line x1="8" y1="113" x2="192" y2="113" stroke="#222" strokeWidth="2.5" />

      {/* Water / ground dashes */}
      <line x1="30" y1="124" x2="50" y2="124" stroke="#222" strokeWidth="2.5" strokeLinecap="round" />
      <line x1="60" y1="124" x2="76" y2="124" stroke="#222" strokeWidth="2.5" strokeLinecap="round" />
      <line x1="90" y1="124" x2="110" y2="124" stroke="#222" strokeWidth="2.5" strokeLinecap="round" />
      <line x1="122" y1="124" x2="138" y2="124" stroke="#222" strokeWidth="2.5" strokeLinecap="round" />
      <line x1="150" y1="124" x2="170" y2="124" stroke="#222" strokeWidth="2.5" strokeLinecap="round" />
      <line x1="44" y1="134" x2="60" y2="134" stroke="#222" strokeWidth="2.5" strokeLinecap="round" />
      <line x1="76" y1="134" x2="88" y2="134" stroke="#222" strokeWidth="2.5" strokeLinecap="round" />
      <line x1="106" y1="134" x2="124" y2="134" stroke="#222" strokeWidth="2.5" strokeLinecap="round" />
      <line x1="140" y1="134" x2="156" y2="134" stroke="#222" strokeWidth="2.5" strokeLinecap="round" />
    </svg>
  );
}
