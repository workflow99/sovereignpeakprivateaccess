import { colorForSymbol } from "./coinColor";

const MAX_INDIVIDUAL_SEGMENTS = 5;

// Shows at most 5 holdings individually in an allocation chart; anything
// beyond that (by market value) gets folded into the "Other Assets" slice
// alongside whatever otherAssetsValue the admin has set, so the chart never
// gets cluttered with a long tail of tiny slices.
export function buildAllocationSegments(holdings, otherAssetsValue, totalValue) {
  const sorted = [...holdings].sort((a, b) => b.marketValue - a.marketValue);
  const top = sorted.slice(0, MAX_INDIVIDUAL_SEGMENTS);
  const overflow = sorted.slice(MAX_INDIVIDUAL_SEGMENTS);
  const overflowValue = overflow.reduce((sum, h) => sum + h.marketValue, 0);
  const combinedOtherValue = otherAssetsValue + overflowValue;

  return [
    ...top.map((h) => ({
      label: `${h.name} (${h.symbol})`,
      percent: h.allocationPercent,
      color: colorForSymbol(h.symbol),
    })),
    {
      label: "Other Assets",
      percent: totalValue ? (combinedOtherValue / totalValue) * 100 : 0,
      color: "#5a5a5a",
    },
  ];
}
