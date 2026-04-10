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
      {/* Main massif — broad, asymmetric like the real mountain */}
      <path
        d="M25 130 L40 95 L52 82 L60 70 L68 58 L78 42 L85 32 L92 22 L98 15 L103 12 L108 15 L114 22 L119 32 L125 42 L130 50 L138 62 L148 78 L158 90 L170 105 L180 130 Z"
        fill="#1a1a1a"
      />
      {/* Left subsidiary ridge — Tahoma glacier side */}
      <path
        d="M0 130 L15 115 L25 105 L35 98 L40 95 L25 130 Z"
        fill="#2a2a2a"
      />
      {/* Right subsidiary ridge — Emmons side */}
      <path
        d="M180 130 L200 130 L192 118 L182 108 L175 102 L170 105 L180 130 Z"
        fill="#2a2a2a"
      />
      {/* Snow — summit dome and upper glaciers */}
      <path
        d="M92 22 L98 15 L103 12 L108 15 L114 22 L119 32 L125 42 L120 40 L113 35 L108 30 L103 26 L98 24 L93 26 L88 32 L82 40 L78 42 L85 32 Z"
        fill="white"
      />
      {/* Snow — Nisqually glacier (left) */}
      <path
        d="M78 42 L82 40 L86 48 L80 55 L72 60 L68 58 Z"
        fill="white"
        opacity="0.85"
      />
      {/* Snow — Emmons glacier (right) */}
      <path
        d="M125 42 L120 40 L118 50 L122 58 L130 62 L138 62 L130 50 Z"
        fill="white"
        opacity="0.85"
      />
      {/* Snow — upper Ingraham glacier (center) */}
      <path
        d="M93 26 L98 24 L103 26 L108 30 L106 38 L100 44 L94 38 L88 32 Z"
        fill="white"
        opacity="0.9"
      />
      {/* Rock cleaver between glaciers — dark lines */}
      <path d="M88 32 L94 38 L92 42 L86 48" stroke="#1a1a1a" strokeWidth="1.5" fill="none" />
      <path d="M113 35 L108 30 L106 38 L110 46" stroke="#1a1a1a" strokeWidth="1.5" fill="none" />
      {/* Lower snow patches — Kautz, Wilson */}
      <path
        d="M60 70 L65 65 L70 68 L66 75 Z"
        fill="white"
        opacity="0.5"
      />
      <path
        d="M140 72 L146 68 L150 74 L144 78 Z"
        fill="white"
        opacity="0.5"
      />
    </svg>
  );
}
