export default function SpaceNeedleSkyline({ className = "" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 1440 200"
      preserveAspectRatio="none"
      className={className}
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      {/* Mt. Rainier in background */}
      <path
        d="M1050 200 L1050 120 L1100 60 L1120 45 L1140 30 L1160 20 L1180 14 L1200 20 L1220 30 L1240 45 L1260 60 L1310 120 L1310 200 Z"
        fill="rgba(255,255,255,0.06)"
      />
      {/* Rainier snow cap */}
      <path
        d="M1140 30 L1160 20 L1180 14 L1200 20 L1220 30 L1210 35 L1195 25 L1180 20 L1165 25 L1150 35 Z"
        fill="rgba(255,255,255,0.12)"
      />

      {/* Space Needle */}
      {/* Observation deck */}
      <path d="M330 95 L340 80 L350 75 L360 72 L370 70 L380 70 L390 72 L400 75 L410 80 L420 95 Z" fill="rgba(255,255,255,0.15)" />
      {/* Deck underside */}
      <path d="M335 95 L340 100 L410 100 L415 95 Z" fill="rgba(255,255,255,0.1)" />
      {/* Shaft */}
      <rect x="371" y="100" width="8" height="95" fill="rgba(255,255,255,0.12)" />
      {/* Base legs */}
      <path d="M350 195 L371 145 L375 195 Z" fill="rgba(255,255,255,0.1)" />
      <path d="M375 195 L379 145 L400 195 Z" fill="rgba(255,255,255,0.1)" />
      {/* Top spire */}
      <rect x="373" y="55" width="4" height="15" fill="rgba(255,255,255,0.15)" />
      <rect x="374" y="40" width="2" height="15" fill="rgba(255,255,255,0.12)" />

      {/* Downtown buildings */}
      <rect x="440" y="130" width="25" height="70" fill="rgba(255,255,255,0.08)" />
      <rect x="470" y="110" width="30" height="90" fill="rgba(255,255,255,0.1)" />
      <rect x="505" y="120" width="20" height="80" fill="rgba(255,255,255,0.07)" />
      <rect x="530" y="100" width="35" height="100" fill="rgba(255,255,255,0.09)" />
      <rect x="570" y="115" width="22" height="85" fill="rgba(255,255,255,0.08)" />
      <rect x="596" y="105" width="28" height="95" fill="rgba(255,255,255,0.1)" />
      <rect x="628" y="125" width="18" height="75" fill="rgba(255,255,255,0.07)" />
      <rect x="650" y="135" width="25" height="65" fill="rgba(255,255,255,0.08)" />

      {/* Columbia Center (tallest) */}
      <rect x="530" y="60" width="35" height="140" rx="2" fill="rgba(255,255,255,0.11)" />

      {/* Left side buildings / industrial */}
      <rect x="100" y="155" width="30" height="45" fill="rgba(255,255,255,0.06)" />
      <rect x="140" y="145" width="25" height="55" fill="rgba(255,255,255,0.07)" />
      <rect x="175" y="160" width="20" height="40" fill="rgba(255,255,255,0.05)" />
      <rect x="210" y="150" width="28" height="50" fill="rgba(255,255,255,0.06)" />
      <rect x="250" y="165" width="22" height="35" fill="rgba(255,255,255,0.05)" />

      {/* Far right — trees / residential */}
      <path d="M700 200 L710 170 L720 200 Z" fill="rgba(255,255,255,0.05)" />
      <path d="M730 200 L740 165 L750 200 Z" fill="rgba(255,255,255,0.06)" />
      <path d="M760 200 L770 175 L780 200 Z" fill="rgba(255,255,255,0.04)" />
      <path d="M800 200 L810 160 L820 200 Z" fill="rgba(255,255,255,0.05)" />
      <path d="M840 200 L850 170 L860 200 Z" fill="rgba(255,255,255,0.06)" />
      <path d="M870 200 L880 155 L890 200 Z" fill="rgba(255,255,255,0.04)" />
      <path d="M910 200 L920 168 L930 200 Z" fill="rgba(255,255,255,0.05)" />
      <path d="M950 200 L960 172 L970 200 Z" fill="rgba(255,255,255,0.06)" />
      <path d="M990 200 L1000 162 L1010 200 Z" fill="rgba(255,255,255,0.04)" />

      {/* Water / Puget Sound reflection line */}
      <line x1="0" y1="195" x2="1440" y2="195" stroke="rgba(255,255,255,0.04)" strokeWidth="2" />
    </svg>
  );
}
