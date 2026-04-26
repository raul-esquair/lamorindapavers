interface Props {
  className?: string;
}

export default function PaverCrossSection({ className }: Props) {
  return (
    <svg
      viewBox="0 0 460 290"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      role="img"
      aria-label="Cross-section diagram of a Lamorinda Pavers installation showing five layers from top to bottom: pavers with polymeric sand joints, bedding sand, Class II aggregate base, geotextile fabric, and compacted subgrade."
    >
      <title>Lamorinda Pavers build spec — cross-section</title>

      {/* Soft drop shadow under the cross-section block */}
      <ellipse cx="200" cy="278" rx="175" ry="5" fill="#1A1A1A" opacity="0.08" />

      {/* E: Compacted subgrade (bottom layer) */}
      <rect x="30" y="200" width="340" height="74" fill="#6B4A30" />
      <g fill="#3F2A18" opacity="0.55">
        <circle cx="58" cy="225" r="2.5" />
        <circle cx="92" cy="252" r="2" />
        <circle cx="135" cy="238" r="3" />
        <circle cx="172" cy="260" r="2" />
        <circle cx="210" cy="220" r="2.5" />
        <circle cx="248" cy="255" r="2" />
        <circle cx="285" cy="235" r="3" />
        <circle cx="320" cy="260" r="2" />
        <circle cx="350" cy="230" r="2.5" />
      </g>
      <g fill="#85603F" opacity="0.6">
        <circle cx="75" cy="245" r="1.5" />
        <circle cx="155" cy="218" r="1.5" />
        <circle cx="225" cy="258" r="1.5" />
        <circle cx="305" cy="220" r="1.5" />
      </g>

      {/* D: Geotextile fabric (thin dashed line) */}
      <line
        x1="30"
        y1="198"
        x2="370"
        y2="198"
        stroke="#1F2937"
        strokeWidth="1.5"
        strokeDasharray="4 3"
      />

      {/* C: Class II aggregate base */}
      <rect x="30" y="95" width="340" height="103" fill="#B5B5B5" />
      <g fill="#787878" opacity="0.75">
        <circle cx="52" cy="112" r="2.5" />
        <circle cx="80" cy="135" r="3" />
        <circle cx="115" cy="120" r="2" />
        <circle cx="148" cy="155" r="3.5" />
        <circle cx="180" cy="130" r="2.5" />
        <circle cx="215" cy="172" r="3" />
        <circle cx="248" cy="145" r="2.5" />
        <circle cx="282" cy="125" r="3" />
        <circle cx="315" cy="158" r="2.5" />
        <circle cx="348" cy="135" r="3" />
        <circle cx="70" cy="172" r="2.5" />
        <circle cx="132" cy="188" r="3" />
        <circle cx="200" cy="112" r="2" />
        <circle cx="268" cy="180" r="2.5" />
        <circle cx="335" cy="188" r="3" />
        <circle cx="98" cy="160" r="2" />
        <circle cx="165" cy="110" r="2" />
        <circle cx="230" cy="135" r="2" />
        <circle cx="298" cy="165" r="2" />
      </g>
      <g fill="#9A9A9A" opacity="0.55">
        <circle cx="42" cy="130" r="1.5" />
        <circle cx="125" cy="148" r="1.5" />
        <circle cx="195" cy="185" r="1.5" />
        <circle cx="265" cy="110" r="1.5" />
        <circle cx="345" cy="112" r="1.5" />
      </g>

      {/* B: Bedding sand */}
      <rect x="30" y="75" width="340" height="20" fill="#E5C28A" />
      <g fill="#B68A50" opacity="0.55">
        <circle cx="55" cy="83" r="0.8" />
        <circle cx="88" cy="88" r="0.8" />
        <circle cx="120" cy="82" r="0.8" />
        <circle cx="155" cy="89" r="0.8" />
        <circle cx="190" cy="83" r="0.8" />
        <circle cx="225" cy="88" r="0.8" />
        <circle cx="260" cy="82" r="0.8" />
        <circle cx="295" cy="89" r="0.8" />
        <circle cx="328" cy="83" r="0.8" />
        <circle cx="358" cy="88" r="0.8" />
      </g>

      {/* A: Pavers (4 blocks with polymeric sand joints between) */}
      <rect x="30" y="20" width="82" height="55" fill="#A8694F" />
      <rect x="115" y="20" width="80" height="55" fill="#945A40" />
      <rect x="198" y="20" width="82" height="55" fill="#B07555" />
      <rect x="283" y="20" width="87" height="55" fill="#955F44" />
      {/* Polymeric sand joints */}
      <rect x="112" y="20" width="3" height="55" fill="#D4A574" />
      <rect x="195" y="20" width="3" height="55" fill="#D4A574" />
      <rect x="280" y="20" width="3" height="55" fill="#D4A574" />
      {/* Subtle highlight on top of pavers */}
      <line x1="30" y1="22" x2="112" y2="22" stroke="#FFFFFF" strokeWidth="0.5" opacity="0.25" />
      <line x1="115" y1="22" x2="195" y2="22" stroke="#FFFFFF" strokeWidth="0.5" opacity="0.25" />
      <line x1="198" y1="22" x2="280" y2="22" stroke="#FFFFFF" strokeWidth="0.5" opacity="0.25" />
      <line x1="283" y1="22" x2="370" y2="22" stroke="#FFFFFF" strokeWidth="0.5" opacity="0.25" />

      {/* Block outline */}
      <rect
        x="30"
        y="20"
        width="340"
        height="254"
        fill="none"
        stroke="#1A1A1A"
        strokeWidth="1"
        opacity="0.18"
      />

      {/* Surface line on top of pavers */}
      <line
        x1="30"
        y1="20"
        x2="370"
        y2="20"
        stroke="#1A1A1A"
        strokeWidth="0.75"
        opacity="0.35"
      />

      {/* Callouts: connector line + gold circle + letter */}
      {[
        { letter: "A", y: 47.5 },
        { letter: "B", y: 85 },
        { letter: "C", y: 146.5 },
        { letter: "D", y: 198 },
        { letter: "E", y: 237 },
      ].map(({ letter, y }) => (
        <g key={letter}>
          <line
            x1="375"
            y1={y}
            x2="408"
            y2={y}
            stroke="#1A1A1A"
            strokeWidth="1"
            opacity="0.4"
          />
          <circle cx="425" cy={y} r="14" fill="#E8A83E" />
          <text
            x="425"
            y={y + 1}
            textAnchor="middle"
            dominantBaseline="middle"
            fontFamily="ui-sans-serif, system-ui, -apple-system, sans-serif"
            fontWeight="700"
            fontSize="14"
            fill="#1A1A1A"
          >
            {letter}
          </text>
        </g>
      ))}
    </svg>
  );
}
