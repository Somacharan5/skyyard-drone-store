import CategoryGlyph from './CategoryGlyph';

export const VARIANT_PALETTE = [
  { start: '#eaf6fc', end: '#cfe9f7', fg: '#1a7aa3' }, // blue
  { start: '#fff0ea', end: '#ffd9c7', fg: '#c1501f' }, // orange
  { start: '#eefaf0', end: '#cdf0d6', fg: '#2f8f45' }, // green
  { start: '#f4f0ff', end: '#e5daff', fg: '#6b3fc7' }, // purple
  { start: '#fff4e0', end: '#ffe3ad', fg: '#b8790a' }, // amber
];

export function paletteFor(variant = 0) {
  return VARIANT_PALETTE[Math.abs(variant) % VARIANT_PALETTE.length];
}

export default function ProductArt({ imageKey, imageVariant = 0, forceBlue = false, className = '' }) {
  const palette = forceBlue ? VARIANT_PALETTE[0] : paletteFor(imageVariant);
  return (
    <div
      className={`product-art ${className}`}
      style={{ background: `linear-gradient(155deg, ${palette.start}, ${palette.end})` }}
    >
      <CategoryGlyph icon={imageKey} fg={palette.fg} className="product-art__glyph" />
    </div>
  );
}
