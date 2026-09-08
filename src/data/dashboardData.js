const RANGE_POINT_COUNTS = {
  "1D": 24,
  "1W": 7,
  "1M": 30,
  "3M": 12,
  YTD: 8,
  "1Y": 12,
  ALL: 18,
};

function seededWalk(seed, points, start, drift) {
  let value = start;
  let s = seed;
  const rand = () => {
    s = (s * 9301 + 49297) % 233280;
    return s / 233280;
  };
  return Array.from({ length: points }, (_, i) => {
    value += drift + (rand() - 0.42) * drift * 6;
    return { i, value: Math.max(value, start * 0.5) };
  });
}

export const portfolioHistory = Object.fromEntries(
  Object.entries(RANGE_POINT_COUNTS).map(([range, points], idx) => [
    range,
    seededWalk(idx + 7, points, 200000, 3200),
  ])
);

// Candlestick (OHLC) version of the same walk, for the trading-style chart.
function seededCandles(seed, points, start, drift) {
  let s = seed;
  const rand = () => {
    s = (s * 9301 + 49297) % 233280;
    return s / 233280;
  };
  let prevClose = start;
  return Array.from({ length: points }, (_, i) => {
    const open = prevClose;
    const close = Math.max(open + drift * 0.6 + (rand() - 0.45) * drift * 5, start * 0.4);
    const wickUp = Math.abs(drift) * (0.3 + rand() * 0.9);
    const wickDown = Math.abs(drift) * (0.3 + rand() * 0.9);
    const high = Math.max(open, close) + wickUp;
    const low = Math.max(Math.min(open, close) - wickDown, start * 0.35);
    const move = Math.abs(close - open) + wickUp + wickDown;
    const volume = Math.round(400 + move * 0.08 + rand() * 900);
    prevClose = close;
    return { i, open, high, low, close, volume };
  });
}

export const portfolioCandles = Object.fromEntries(
  Object.entries(RANGE_POINT_COUNTS).map(([range, points], idx) => [
    range,
    seededCandles(idx + 7, points, 200000, 3200),
  ])
);

export const RANGE_OPTIONS = ["1D", "1W", "1M", "3M", "YTD", "1Y", "ALL"];
