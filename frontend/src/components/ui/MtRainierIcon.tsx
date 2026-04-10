export default function MtRainierIcon({ className = "", size = 40 }: { className?: string; size?: number }) {
  return (
    <svg
      width={size}
      height={size * 0.65}
      viewBox="0 0 200 130"
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

      {/* Treeline */}
      {[18, 34, 50, 66, 82, 98, 114, 130, 146, 162, 178].map((x) => (
        <path
          key={x}
          d={`M${x} 92 L${x - 5} 85 L${x - 2.5} 85 L${x - 7} 78 L${x} 71 L${x + 7} 78 L${x + 2.5} 85 L${x + 5} 85 Z`}
          fill="#222"
        />
      ))}

      {/* Ground line */}
      <line x1="5" y1="93" x2="195" y2="93" stroke="#222" strokeWidth="2.5" />

      {/* Water dashes */}
      <line x1="28" y1="103" x2="48" y2="103" stroke="#222" strokeWidth="2.5" strokeLinecap="round" />
      <line x1="58" y1="103" x2="74" y2="103" stroke="#222" strokeWidth="2.5" strokeLinecap="round" />
      <line x1="88" y1="103" x2="112" y2="103" stroke="#222" strokeWidth="2.5" strokeLinecap="round" />
      <line x1="124" y1="103" x2="142" y2="103" stroke="#222" strokeWidth="2.5" strokeLinecap="round" />
      <line x1="152" y1="103" x2="172" y2="103" stroke="#222" strokeWidth="2.5" strokeLinecap="round" />
      <line x1="40" y1="113" x2="56" y2="113" stroke="#222" strokeWidth="2.5" strokeLinecap="round" />
      <line x1="70" y1="113" x2="86" y2="113" stroke="#222" strokeWidth="2.5" strokeLinecap="round" />
      <line x1="100" y1="113" x2="120" y2="113" stroke="#222" strokeWidth="2.5" strokeLinecap="round" />
      <line x1="134" y1="113" x2="152" y2="113" stroke="#222" strokeWidth="2.5" strokeLinecap="round" />
    </svg>
  );
}
