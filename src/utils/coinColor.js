// Deterministic per-symbol color so each asset in a donut/legend gets a
// distinct, stable color (same symbol always maps to the same swatch)
// instead of every holding sharing one accent color.
const PALETTE = [
  "#F7931A", // amber
  "#8C9EFF", // periwinkle
  "#22C55E", // green
  "#EAB308", // gold
  "#38BDF8", // sky
  "#A855F7", // purple
  "#F472B6", // pink
  "#FB923C", // orange
  "#2DD4BF", // teal
  "#F87171", // coral
  "#818CF8", // indigo
  "#D62839", // crimson
];

const BRAND_OVERRIDES = {
  WHT401k: "#D4AF37", // gold stable-coin
};

export function colorForSymbol(symbol) {
  if (BRAND_OVERRIDES[symbol]) return BRAND_OVERRIDES[symbol];
  let hash = 0;
  for (let i = 0; i < symbol.length; i += 1) {
    hash = (hash * 31 + symbol.charCodeAt(i)) >>> 0;
  }
  return PALETTE[hash % PALETTE.length];
}
