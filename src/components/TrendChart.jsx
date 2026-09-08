import { motion } from "framer-motion";

function buildPath(points, width, height, padding = 6) {
  const max = Math.max(...points);
  const min = Math.min(...points);
  const range = max - min || 1;
  const stepX = (width - padding * 2) / (points.length - 1);

  const coords = points.map((p, i) => {
    const x = padding + i * stepX;
    const y = padding + (height - padding * 2) * (1 - (p - min) / range);
    return [x, y];
  });

  const line = coords.reduce((acc, [x, y], i) => {
    if (i === 0) return `M ${x} ${y}`;
    const [px, py] = coords[i - 1];
    const cx = (px + x) / 2;
    return `${acc} C ${cx} ${py}, ${cx} ${y}, ${x} ${y}`;
  }, "");

  const area = `${line} L ${coords[coords.length - 1][0]} ${height - padding} L ${coords[0][0]} ${height - padding} Z`;

  return { line, area };
}

export default function TrendChart({ points, width = 320, height = 120 }) {
  const { line, area } = buildPath(points, width, height);

  return (
    <svg
      viewBox={`0 0 ${width} ${height}`}
      className="h-full w-full overflow-visible"
      preserveAspectRatio="none"
    >
      <defs>
        <linearGradient id="trendFill" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#D62839" stopOpacity="0.35" />
          <stop offset="100%" stopColor="#D62839" stopOpacity="0" />
        </linearGradient>
        <filter id="trendGlow" x="-20%" y="-40%" width="140%" height="180%">
          <feGaussianBlur stdDeviation="3.2" result="blur" />
          <feMerge>
            <feMergeNode in="blur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>

      <path d={area} fill="url(#trendFill)" />

      <motion.path
        d={line}
        fill="none"
        stroke="#EF4444"
        strokeWidth={2}
        strokeLinecap="round"
        filter="url(#trendGlow)"
        initial={{ pathLength: 0 }}
        whileInView={{ pathLength: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 1.6, ease: "easeInOut" }}
      />
    </svg>
  );
}
