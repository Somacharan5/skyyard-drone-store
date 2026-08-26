// Simple line-art glyphs per product category, used both as the big
// illustration on product cards and as the small icon in category tiles.

function DroneGlyph({ fg }) {
  const corners = [
    [30, 30],
    [70, 30],
    [30, 70],
    [70, 70],
  ];
  return (
    <g stroke={fg} strokeWidth="2.5" fill="none" strokeLinecap="round">
      {corners.map(([x, y], i) => (
        <line key={i} x1="50" y1="50" x2={x} y2={y} />
      ))}
      {corners.map(([x, y], i) => (
        <circle key={i} cx={x} cy={y} r="9" opacity="0.35" />
      ))}
      {corners.map(([x, y], i) => (
        <circle key={i} cx={x} cy={y} r="3.4" fill={fg} stroke="none" />
      ))}
      <rect x="41" y="43" width="18" height="14" rx="4" fill={fg} stroke="none" />
      <circle cx="50" cy="50" r="2" fill="#fff" stroke="none" />
    </g>
  );
}

function CarGlyph({ fg }) {
  return (
    <g stroke={fg} strokeWidth="2.5" fill="none" strokeLinejoin="round" strokeLinecap="round">
      <polygon points="20,58 30,58 36,41 50,34 64,36 72,58 80,58" fill={fg} fillOpacity="0.12" />
      <rect x="14" y="58" width="72" height="16" rx="6" fill={fg} fillOpacity="0.9" stroke="none" />
      <circle cx="31" cy="78" r="9" fill="#fff" stroke={fg} />
      <circle cx="31" cy="78" r="3.4" fill={fg} stroke="none" />
      <circle cx="69" cy="78" r="9" fill="#fff" stroke={fg} />
      <circle cx="69" cy="78" r="3.4" fill={fg} stroke="none" />
      <line x1="30" y1="66" x2="70" y2="66" stroke="#fff" strokeWidth="2" opacity="0.6" />
    </g>
  );
}

function PlaneGlyph({ fg }) {
  return (
    <g fill={fg} stroke="none">
      <rect x="46" y="14" width="8" height="64" rx="4" />
      <polygon points="50,34 14,54 50,49" opacity="0.9" />
      <polygon points="50,34 86,54 50,49" opacity="0.9" />
      <polygon points="50,68 37,84 50,76" opacity="0.9" />
      <polygon points="50,68 63,84 50,76" opacity="0.9" />
      <circle cx="50" cy="24" r="4" fill="#fff" fillOpacity="0.7" />
    </g>
  );
}

function BlasterGlyph({ fg }) {
  return (
    <g fill={fg} stroke="none">
      <rect x="20" y="46" width="52" height="12" rx="5" />
      <rect x="66" y="42" width="18" height="8" rx="3" />
      <rect x="26" y="56" width="10" height="20" rx="3" transform="rotate(14 31 66)" />
      <rect x="42" y="58" width="10" height="16" rx="3" />
      <rect x="16" y="44" width="14" height="16" rx="4" />
      <circle cx="76" cy="46" r="2.4" fill="#fff" fillOpacity="0.8" />
    </g>
  );
}

function GadgetGlyph({ fg }) {
  return (
    <g stroke={fg} strokeWidth="2.5" fill="none" strokeLinejoin="round" strokeLinecap="round">
      <rect x="24" y="20" width="52" height="60" rx="12" fill={fg} fillOpacity="0.1" />
      <polygon points="54,32 38,58 48,58 46,70 64,44 53,44" fill={fg} stroke="none" />
    </g>
  );
}

function BatteryGlyph({ fg }) {
  return (
    <g stroke={fg} strokeWidth="2.5" fill="none" strokeLinejoin="round">
      <rect x="24" y="30" width="46" height="42" rx="6" />
      <rect x="70" y="42" width="7" height="18" rx="2" fill={fg} stroke="none" />
      <rect x="31" y="52" width="32" height="13" rx="2" fill={fg} stroke="none" />
      <line x1="31" y1="44" x2="63" y2="44" stroke={fg} strokeWidth="2.5" opacity="0.5" />
    </g>
  );
}

const GLYPHS = {
  drone: DroneGlyph,
  car: CarGlyph,
  plane: PlaneGlyph,
  blaster: BlasterGlyph,
  gadget: GadgetGlyph,
  battery: BatteryGlyph,
};

export default function CategoryGlyph({ icon, fg = '#2298c6', className }) {
  const Glyph = GLYPHS[icon] || DroneGlyph;
  return (
    <svg viewBox="0 0 100 100" className={className} aria-hidden="true">
      <Glyph fg={fg} />
    </svg>
  );
}
