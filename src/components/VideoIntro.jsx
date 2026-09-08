import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowDownRight, ArrowUpRight } from "lucide-react";
import heroImage from "../assets/hero.jpeg";
import CryptoTicker from "./CryptoTicker";
import NetworkOverlay from "./NetworkOverlay";
import TrendChart from "./TrendChart";
import { chartTrend, portfolioSummary } from "../data/mockPortfolio";

const currency = (n) =>
  n.toLocaleString("en-US", { style: "currency", currency: "USD", minimumFractionDigits: 2 });

function CurlyArrow(props) {
  return (
    <svg width="32" height="54" viewBox="0 0 32 54" fill="none" {...props}>
      <path
        d="M16 2C28 6 28 18 16 20C4 22 4 34 16 38"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        fill="none"
      />
      <path d="M16 38V48" stroke="currentColor" strokeWidth="2" strokeLinecap="round" fill="none" />
      <path
        d="M9 43L16 52L23 43"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
      />
    </svg>
  );
}

export default function VideoIntro() {
  const positive = portfolioSummary.monthlyChangePercent >= 0;
  const isMobile = typeof window !== "undefined" && window.matchMedia("(max-width: 768px)").matches;
  const shouldReduceMotion =
    typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  return (
    <section
      id="home"
      className="sticky top-0 z-0 flex h-screen w-full items-end overflow-hidden bg-[#050505]"
    >
      <motion.video
        src="/hero-bg.mp4"
        poster={heroImage}
        autoPlay
        loop
        muted
        playsInline
        preload={isMobile ? "metadata" : "auto"}
        initial={{ opacity: 0, scale: 1.06 }}
        animate={{
          opacity: 1,
          scale: shouldReduceMotion || isMobile ? 1.02 : [1.06, 1.14],
        }}
        transition={{
          opacity: { duration: 1.8, ease: "easeOut" },
          scale: shouldReduceMotion || isMobile
            ? { duration: 0.01 }
            : { duration: 22, ease: "linear", repeat: Infinity, repeatType: "reverse" },
        }}
        className="absolute inset-0 h-full w-full object-cover"
      />

      {/* Brand color grade — pulls the raw footage into the red/black palette */}
      <div className="absolute inset-0 mix-blend-color" style={{ backgroundColor: "#3a0a10" }} />
      <div
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse 120% 90% at 50% 40%, transparent 35%, rgba(5,5,5,0.55) 78%, rgba(5,5,5,0.92) 100%)",
        }}
      />

      <div className="absolute inset-0 bg-gradient-to-b from-[#050505]/25 via-transparent to-[#050505]" />
      <div className="absolute inset-0 bg-gradient-to-r from-[#050505]/55 via-transparent to-transparent" />
      <div className="absolute inset-x-0 bottom-0 h-64 bg-gradient-to-t from-[#050505] via-[#050505]/40 to-transparent" />

      {/* Blockchain-style network overlay */}
      <NetworkOverlay className="absolute inset-0 opacity-70" />

      {/* Live price ticker, pinned below the fixed navbar */}
      <div className="absolute inset-x-0 top-24 z-10">
        <CryptoTicker />
      </div>

      {/* Floating live AUM widget */}
      <motion.div
        initial={{ opacity: 0, y: -14 }}
        animate={{ opacity: 1, y: [0, -8, 0] }}
        transition={{
          opacity: { duration: 0.8, delay: 1.4 },
          y: {
            duration: 5,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 1.4,
          },
        }}
        className="absolute top-40 right-6 z-10 hidden w-64 rounded-2xl border border-[rgba(177,18,38,0.28)] bg-[rgba(10,10,12,0.55)] p-5 backdrop-blur-xl sm:right-10 sm:block"
      >
        <div className="flex items-center justify-between">
          <span className="text-[10px] font-semibold uppercase tracking-[0.16em] text-[#B3B3B3]">
            Sovereign Fund Assets
          </span>
          <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 shadow-[0_0_6px_2px_rgba(52,211,153,0.7)]" />
        </div>

        <div className="mt-2 flex items-end justify-between">
          <span className="font-serif text-xl text-white">{currency(portfolioSummary.totalAssets)}</span>
          <span className={`flex items-center gap-0.5 text-xs font-medium ${positive ? "text-emerald-400" : "text-red-400"}`}>
            {positive ? <ArrowUpRight size={13} /> : <ArrowDownRight size={13} />}
            {positive ? "+" : ""}
            {portfolioSummary.monthlyChangePercent.toFixed(2)}%
          </span>
        </div>

        <div className="mt-3 h-10">
          <TrendChart points={chartTrend} />
        </div>
      </motion.div>

      {/* Middle-left statement, fades/slides in */}
      <motion.div
        initial={{ opacity: 0, x: -50 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 1.1, delay: 1.7, ease: [0.16, 1, 0.3, 1] }}
        className="absolute top-1/2 left-6 z-10 max-w-md -translate-y-1/2 text-left sm:left-10 sm:max-w-lg"
      >
        <p className="font-serif text-2xl leading-tight text-white sm:text-3xl lg:text-[2.6rem]">
          Gain 10× on Your 401(k) Through the{" "}
          <span className="text-gradient-accent">US Presidential Retirement Strengthening Fund in partnership with Space X</span>
        </p>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 1.2 }}
        className="absolute bottom-12 right-6 z-10 flex flex-col items-end gap-3 text-right text-[#B3B3B3] transition-colors hover:text-white sm:bottom-16 sm:right-10"
      >
        <span className="inline-flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.2em] text-[#FCA5A5]">
          United States Presidential Directive - $9 Trillion Fund
        </span>

        <Link to="/signup" className="font-serif text-3xl text-white sm:text-4xl">
          Request Your Private Access Key
        </Link>

        <motion.span
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut" }}
        >
          <CurlyArrow className="scale-x-[-1] text-[#D62839]" />
        </motion.span>
      </motion.div>
    </section>
  );
}
