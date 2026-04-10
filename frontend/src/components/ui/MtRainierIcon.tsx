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
      {/* White mountain body */}
      <path
        d="M0 168 L8 148 L18 132 L30 118 L42 106 L55 94 L65 84 L75 72 L84 60
           L92 48 L98 38 L104 28 L110 20 L116 14 L120 10 L124 14 L128 18
           L134 26 L140 36 L146 46 L152 56 L160 68 L168 78 L178 90 L188 102
           L198 114 L208 128 L218 142 L228 154 L240 168 Z"
        fill="white"
        stroke="#222"
        strokeWidth="2"
      />

      {/* Glacier outlines — Tahoma (left face) */}
      <path
        d="M75 72 L84 60 L92 48 L98 38 L102 42 L96 54 L90 64 L84 72 L78 78 L72 82"
        stroke="#333"
        strokeWidth="1.5"
        fill="none"
      />

      {/* Nisqually glacier (center-left) */}
      <path
        d="M106 32 L110 26 L116 20 L118 28 L114 40 L108 52 L102 62 L96 72 L90 80"
        stroke="#333"
        strokeWidth="1.5"
        fill="none"
      />

      {/* Rock cleaver — Gibraltar Rock between Nisqually and Ingraham */}
      <path
        d="M106 32 L108 38 L106 46 L102 56 L98 64"
        stroke="#222"
        strokeWidth="2"
        fill="none"
      />

      {/* Ingraham / Emmons glacier divide */}
      <path
        d="M120 18 L122 26 L122 36 L120 46"
        stroke="#222"
        strokeWidth="2"
        fill="none"
      />

      {/* Emmons/Winthrop glacier (right face) */}
      <path
        d="M124 22 L130 28 L136 34 L140 36 L146 46 L152 56 L148 58 L142 52 L136 44"
        stroke="#333"
        strokeWidth="1.5"
        fill="none"
      />

      {/* Lower ridgeline texture */}
      <path
        d="M55 94 L60 100 L65 94"
        stroke="#444"
        strokeWidth="1"
        fill="none"
      />
      <path
        d="M178 90 L183 96 L188 90"
        stroke="#444"
        strokeWidth="1"
        fill="none"
      />
    </svg>
  );
}
