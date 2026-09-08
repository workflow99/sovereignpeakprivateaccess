import { useRef } from "react";
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import TrendChart from "./TrendChart";
import { CRYPTO_ICONS } from "./icons/CryptoIcons";
import { portfolioSummary, holdings, allocation, chartTrend } from "../data/mockPortfolio";

const currency = (n) =>
  n.toLocaleString("en-US", { style: "currency", currency: "USD", minimumFractionDigits: 2 });

const compact = (n) =>
  n.toLocaleString("en-US", { maximumFractionDigits: n < 10 ? 3 : 2 });

export default function PortfolioCard() {
  const cardRef = useRef(null);

  const px = useMotionValue(0.5);
  const py = useMotionValue(0.5);
  const springConfig = { stiffness: 150, damping: 18, mass: 0.5 };
  const springX = useSpring(px, springConfig);
  const springY = useSpring(py, springConfig);

  const rotateX = useTransform(springY, [0, 1], [9, -9]);
  const rotateY = useTransform(springX, [0, 1], [-9, 9]);
  const glareX = useTransform(springX, [0, 1], ["0%", "100%"]);
  const glareY = useTransform(springY, [0, 1], ["0%", "100%"]);

  const glareOpacity = useMotionValue(0);
  const glareOpacitySpring = useSpring(glareOpacity, { stiffness: 200, damping: 25 });

  const handleMouseMove = (e) => {
    const rect = cardRef.current.getBoundingClientRect();
    px.set((e.clientX - rect.left) / rect.width);
    py.set((e.clientY - rect.top) / rect.height);
  };

  const handleMouseEnter = () => glareOpacity.set(1);

  const handleMouseLeave = () => {
    px.set(0.5);
    py.set(0.5);
    glareOpacity.set(0);
  };

  const positive = portfolioSummary.monthlyChangePercent >= 0;

  return (
    <div className="w-full max-w-xl" style={{ perspective: 1400 }}>
      <motion.div
        ref={cardRef}
        onMouseMove={handleMouseMove}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        initial={{ opacity: 0, y: 40, rotateX: 6 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1], delay: 0.2 }}
        whileHover={{ y: -6 }}
        style={{ rotateX, rotateY, transformStyle: "preserve-3d" }}
        className="relative w-full max-w-xl rounded-[24px] border border-[rgba(177,18,38,0.28)] bg-[rgba(15,15,15,0.1)] p-6 shadow-[0_20px_80px_rgba(0,0,0,0.45)] sm:p-7"
      >
        <motion.div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 z-20 rounded-[24px]"
          style={{
            opacity: glareOpacitySpring,
            background: useTransform(
              [glareX, glareY],
              ([gx, gy]) =>
                `radial-gradient(500px circle at ${gx} ${gy}, rgba(255,255,255,0.12), transparent 55%)`
            ),
          }}
        />

        <div
          className="pointer-events-none absolute -inset-px rounded-[24px] opacity-60"
          style={{
            background:
              "linear-gradient(135deg, rgba(177,18,38,0.25), transparent 30%, transparent 70%, rgba(214,40,57,0.15))",
            mask: "linear-gradient(#fff, #fff) content-box, linear-gradient(#fff, #fff)",
          }}
        />

      <div className="flex items-center justify-between">
        <span className="text-xs font-semibold uppercase tracking-[0.18em] text-[#B3B3B3]">
          Total Assets
        </span>
        <div className={`flex items-center gap-1.5 text-sm font-medium ${positive ? "text-emerald-400" : "text-red-400"}`}>
          <ArrowUpRight size={16} className={positive ? "" : "rotate-90"} />
          <span>{positive ? "+" : ""}{portfolioSummary.monthlyChangePercent.toFixed(2)}%</span>
        </div>
      </div>

      <div className="mt-2 flex items-end gap-3">
        <span className="font-serif text-3xl font-medium text-white sm:text-4xl">
          {currency(portfolioSummary.totalAssets)}
        </span>
      </div>

      <div className="mt-4 h-20">
        <TrendChart points={chartTrend} />
      </div>

      <div className="mt-3 space-y-2">
        {holdings.map((h) => {
          const Icon = CRYPTO_ICONS[h.symbol];
          return (
            <div
              key={h.symbol}
              className="flex items-center justify-between rounded-xl border border-white/5 bg-white/[0.02] px-3.5 py-2.5"
            >
              <div className="flex items-center gap-2.5">
                {Icon && <Icon size={24} />}
                <div className="leading-tight">
                  <p className="text-sm font-semibold text-white">{h.symbol}</p>
                  <p className="text-[11px] text-[#B3B3B3]">{compact(h.quantity)}</p>
                </div>
              </div>
              <p className="text-sm font-medium text-white">{currency(h.price)}</p>
            </div>
          );
        })}
      </div>

      <div className="mt-4">
        <p className="mb-2.5 text-xs font-semibold uppercase tracking-[0.18em] text-[#B3B3B3]">
          Portfolio Allocation
        </p>
        <div className="flex h-2 w-full overflow-hidden rounded-full bg-white/5">
          {allocation.map((a, i) => (
            <motion.div
              key={a.symbol}
              initial={{ width: 0 }}
              whileInView={{ width: `${a.percent}%` }}
              viewport={{ once: true }}
              transition={{ duration: 1, delay: 0.2 + i * 0.15, ease: "easeOut" }}
              className={
                i === 0 ? "bg-[#B11226]" : i === 1 ? "bg-[#D62839]" : i === 2 ? "bg-[#EF4444]" : "bg-[#D4AF37]"
              }
            />
          ))}
        </div>
        <div className="mt-2.5 flex flex-wrap gap-x-5 gap-y-1.5">
          {allocation.map((a, i) => (
            <div key={a.symbol} className="flex items-center gap-1.5 text-xs text-[#B3B3B3]">
              <span
                className={`h-1.5 w-1.5 rounded-full ${
                  i === 0 ? "bg-[#B11226]" : i === 1 ? "bg-[#D62839]" : i === 2 ? "bg-[#EF4444]" : "bg-[#D4AF37]"
                }`}
              />
              {a.label} {a.percent}%
            </div>
          ))}
        </div>
      </div>
      </motion.div>
    </div>
  );
}
