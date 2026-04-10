export default function MtRainierIcon({ className = "", size = 40 }: { className?: string; size?: number }) {
  return (
    <svg
      width={size}
      height={size * 0.7}
      viewBox="0 0 240 168"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-label="Mt. Rainier"
    >
      {/* Main mountain body — dark rock/forest base */}
      <path
        d="M0 168 L8 148 L18 132 L30 118 L42 106 L55 94 L65 84 L75 72 L84 60
           L92 48 L98 38 L104 28 L110 20 L116 14 L120 10 L124 14 L128 18
           L134 26 L140 36 L146 46 L152 56 L160 68 L168 78 L178 90 L188 102
           L198 114 L208 128 L218 142 L228 154 L240 168 Z"
        fill="#222222"
      />

      {/* Snow and glacier coverage — upper 60% of mountain */}
      {/* Summit dome — broad, slightly flat */}
      <path
        d="M104 28 L110 20 L116 14 L120 10 L124 14 L128 18 L134 26
           L140 36 L136 34 L130 28 L124 22 L120 18 L116 20 L110 26
           L106 32 L100 38 L98 38 Z"
        fill="white"
      />

      {/* Tahoma glacier — large left face */}
      <path
        d="M75 72 L84 60 L92 48 L98 38 L100 38 L106 32 L102 42
           L96 54 L90 64 L84 72 L78 78 L72 82 Z"
        fill="white"
      />

      {/* Nisqually glacier — center-left, the famous one */}
      <path
        d="M106 32 L110 26 L116 20 L120 18 L118 28 L114 40 L108 52
           L102 62 L96 72 L90 80 L86 84 L84 72 L90 64 L96 54 L102 42 Z"
        fill="white"
        opacity="0.95"
      />

      {/* Emmons/Winthrop glacier — right face, largest glacier */}
      <path
        d="M120 18 L124 22 L130 28 L136 34 L140 36 L146 46 L152 56
           L148 58 L142 52 L136 44 L130 38 L124 34 L120 30 Z"
        fill="white"
      />

      {/* Lower Emmons — extending further down */}
      <path
        d="M152 56 L160 68 L156 72 L150 66 L144 60 L148 58 Z"
        fill="white"
        opacity="0.85"
      />

      {/* Lower Tahoma — extending down left */}
      <path
        d="M72 82 L78 78 L82 85 L78 92 L72 96 L65 98 L65 94 Z"
        fill="white"
        opacity="0.7"
      />

      {/* Rock cleavers — dark lines between glaciers */}
      <path
        d="M102 42 L106 32 L108 36 L106 44 L102 54 L98 62"
        stroke="#222222"
        strokeWidth="2"
        fill="none"
      />
      <path
        d="M120 30 L124 22 L126 28 L124 36 L120 44"
        stroke="#222222"
        strokeWidth="2"
        fill="none"
      />

      {/* Small snow patch — Wilson glacier area */}
      <path
        d="M168 78 L172 74 L176 80 L172 86 Z"
        fill="white"
        opacity="0.45"
      />
      <path
        d="M58 96 L62 92 L66 98 L60 102 Z"
        fill="white"
        opacity="0.4"
      />
    </svg>
  );
}
