import { useMemo, useState } from "react";
import { Bar, CartesianGrid, Cell, ComposedChart, Line, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { portfolioCandles, RANGE_OPTIONS } from "../../data/dashboardData";

const currency = (n) =>
  n.toLocaleString("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 });

const compact = (n) => `$${(n / 1000).toFixed(1)}k`;

const UP_COLOR = "#26A69A";
const DOWN_COLOR = "#EF5350";

function ChartTooltip({ active, payload }) {
  if (!active || !payload?.length) return null;
  const point = payload[0]?.payload;
  if (!point) return null;
  const isUp = point.close >= point.open;
  const color = isUp ? UP_COLOR : DOWN_COLOR;
  return (
    <div className="rounded-lg border border-[rgba(177,18,38,0.3)] bg-[#0a0a0c] px-3 py-2 text-[11px]">
      <p className="font-semibold" style={{ color }}>
        {currency(point.close)}
      </p>
      <p className="mt-0.5 text-[10px] text-[#B3B3B3]">
        O {currency(point.open)} &middot; H {currency(point.high)} &middot; L {currency(point.low)}
      </p>
      <p className="mt-0.5 text-[10px] text-[#6a6a6a]">Vol {point.volume.toLocaleString()}</p>
    </div>
  );
}

// Custom candlestick body+wick. dataKey on the Bar is an accessor returning
// [low, high], so recharts already maps y/height to that pixel range — the
// body is then drawn proportionally inside it from the open/close values.
function Candle({ x, y, width, height, payload }) {
  const { open, close, low, high } = payload;
  const isUp = close >= open;
  const color = isUp ? UP_COLOR : DOWN_COLOR;
  const range = high - low || 1;
  const bodyTop = Math.max(open, close);
  const bodyBottom = Math.min(open, close);
  const bodyY = y + height * (1 - (bodyTop - low) / range);
  const bodyHeight = Math.max(height * ((bodyTop - bodyBottom) / range), 1.5);
  const bodyWidth = Math.max(width * 0.55, 3);
  const bodyX = x + (width - bodyWidth) / 2;
  const wickX = x + width / 2;

  return (
    <g>
      <line x1={wickX} x2={wickX} y1={y} y2={y + height} stroke={color} strokeWidth={1.25} />
      <rect x={bodyX} y={bodyY} width={bodyWidth} height={bodyHeight} fill={color} rx={1} />
    </g>
  );
}

// Rough support/resistance channel through the candles — connects the
// highest high of each half of the range (resistance) and the lowest low
// of each half (support).
function withTrendLines(data) {
  if (data.length < 4) return data;
  const half = Math.floor(data.length / 2);
  const firstHalf = data.slice(0, half);
  const secondHalf = data.slice(half);

  const extremeIndex = (slice, offset, key, comparator) =>
    offset + slice.reduce((best, d, i) => (comparator(d[key], slice[best][key]) ? i : best), 0);

  const idxHighFirst = extremeIndex(firstHalf, 0, "high", (a, b) => a > b);
  const idxHighSecond = extremeIndex(secondHalf, half, "high", (a, b) => a > b);
  const idxLowFirst = extremeIndex(firstHalf, 0, "low", (a, b) => a < b);
  const idxLowSecond = extremeIndex(secondHalf, half, "low", (a, b) => a < b);

  const highFirst = data[idxHighFirst].high;
  const highSecond = data[idxHighSecond].high;
  const lowFirst = data[idxLowFirst].low;
  const lowSecond = data[idxLowSecond].low;

  return data.map((d, i) => {
    const highT = (i - idxHighFirst) / (idxHighSecond - idxHighFirst || 1);
    const lowT = (i - idxLowFirst) / (idxLowSecond - idxLowFirst || 1);
    return {
      ...d,
      resistance: highFirst + (highSecond - highFirst) * highT,
      support: lowFirst + (lowSecond - lowFirst) * lowT,
    };
  });
}

export default function PortfolioOverviewChart() {
  const [range, setRange] = useState("1D");
  const data = useMemo(() => withTrendLines(portfolioCandles[range]), [range]);
  const maxVolume = useMemo(() => Math.max(...data.map((d) => d.volume)), [data]);

  const latest = data[data.length - 1];
  const prev = data[data.length - 2] ?? latest;
  const change = latest.close - prev.close;
  const changePercent = prev.close ? (change / prev.close) * 100 : 0;
  const isUp = change >= 0;
  const readoutColor = isUp ? UP_COLOR : DOWN_COLOR;

  return (
    <div className="glass-panel rounded-2xl p-5 sm:p-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <span className="text-sm font-medium text-white">Portfolio Overview</span>
          <p className="mt-0.5 font-mono text-[11px] text-[#6a6a6a]">
            O {currency(latest.open)} H {currency(latest.high)} L {currency(latest.low)} C{" "}
            <span style={{ color: readoutColor }}>{currency(latest.close)}</span>{" "}
            <span style={{ color: readoutColor }}>
              {isUp ? "+" : ""}
              {currency(change)} ({isUp ? "+" : ""}
              {changePercent.toFixed(2)}%)
            </span>
          </p>
        </div>
        <div className="flex flex-wrap gap-1 rounded-full border border-white/10 p-1">
          {RANGE_OPTIONS.map((opt) => (
            <button
              key={opt}
              type="button"
              onClick={() => setRange(opt)}
              className={`rounded-full px-2.5 py-1 text-[11px] font-medium transition-colors ${
                range === opt
                  ? "bg-[#D62839] text-white"
                  : "text-[#B3B3B3] hover:text-white"
              }`}
            >
              {opt}
            </button>
          ))}
        </div>
      </div>

      <div className="mt-4 h-64">
        <ResponsiveContainer width="100%" height="100%">
          <ComposedChart data={data} margin={{ top: 8, right: 0, left: 0, bottom: 0 }} barCategoryGap="25%">
            <CartesianGrid stroke="rgba(255,255,255,0.06)" vertical={false} />
            <XAxis
              dataKey="i"
              tick={{ fill: "#6a6a6a", fontSize: 10 }}
              axisLine={{ stroke: "rgba(255,255,255,0.08)" }}
              tickLine={false}
              minTickGap={28}
            />
            <YAxis
              yAxisId="price"
              orientation="right"
              domain={["dataMin - 4000", "dataMax + 4000"]}
              tick={{ fill: "#6a6a6a", fontSize: 10 }}
              axisLine={false}
              tickLine={false}
              tickFormatter={compact}
              width={48}
            />
            <YAxis yAxisId="volume" hide domain={[0, maxVolume * 4]} />
            <Tooltip content={<ChartTooltip />} cursor={{ stroke: "rgba(177,18,38,0.25)" }} />
            <Bar yAxisId="volume" dataKey="volume" isAnimationActive={false}>
              {data.map((d, i) => (
                <Cell key={i} fill={d.close >= d.open ? UP_COLOR : DOWN_COLOR} fillOpacity={0.3} />
              ))}
            </Bar>
            <Line
              yAxisId="price"
              type="linear"
              dataKey="resistance"
              stroke="#FBBF24"
              strokeWidth={1.25}
              strokeDasharray="5 4"
              dot={false}
              activeDot={false}
              isAnimationActive={false}
              legendType="none"
            />
            <Line
              yAxisId="price"
              type="linear"
              dataKey="support"
              stroke="#FBBF24"
              strokeWidth={1.25}
              strokeDasharray="5 4"
              dot={false}
              activeDot={false}
              isAnimationActive={false}
              legendType="none"
            />
            <Bar yAxisId="price" dataKey={(d) => [d.low, d.high]} shape={Candle} isAnimationActive={false} />
          </ComposedChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
