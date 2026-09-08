import { useRef } from "react";
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import { Link } from "react-router-dom";

import heroImage from "../assets/hero.jpeg";
import PortfolioCard from "./PortfolioCard";

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  show: (delay = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.7, ease: [0.16, 1, 0.3, 1], delay },
  }),
};

export default function Hero() {
  const sectionRef = useRef(null);

  const mx = useMotionValue(0);
  const mouseSpring = { stiffness: 60, damping: 20, mass: 0.6 };
  const badgeX = useSpring(useTransform(mx, [-0.5, 0.5], [6, -6]), mouseSpring);

  const handleMouseMove = (e) => {
    const rect = sectionRef.current.getBoundingClientRect();
    mx.set((e.clientX - rect.left) / rect.width - 0.5);
  };

  return (
    <section
      ref={sectionRef}
      onMouseMove={handleMouseMove}
      id="hero-content"
      className="relative isolate z-10 flex min-h-screen w-full items-center overflow-hidden bg-[#050505] pt-32 pb-20 sm:pt-36"
    >
      <div className="absolute inset-0 -z-10">
        <img src={heroImage} alt="" className="h-full w-full object-cover opacity-60" />
        <div className="absolute inset-0 bg-gradient-to-r from-[#050505] via-[#050505]/50 to-[#050505]/10" />
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-[#050505]" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_50%_at_50%_0%,rgba(177,18,38,0.08),transparent)]" />
      </div>

      <div className="mx-auto grid w-full max-w-7xl grid-cols-1 items-center gap-12 px-6 sm:px-8 lg:grid-cols-12 lg:gap-8">

        {/* LEFT CONTENT */}
        <div className="lg:col-span-7">

          <motion.div
            variants={fadeUp}
            initial="hidden"
            animate="show"
            custom={0}
            style={{ x: badgeX }}
            className="inline-flex items-center gap-2.5 rounded-full border border-[rgba(177,18,38,0.35)] bg-[rgba(177,18,38,0.1)] px-5 py-2.5 backdrop-blur-sm"
          >
            <span className="relative flex h-2.5 w-2.5">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[#EF4444] opacity-75" />
              <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-[#EF4444] shadow-[0_0_8px_rgba(239,68,68,0.9)]" />
            </span>
            <span className="text-[11px] font-semibold uppercase tracking-[.18em] text-[#FCA5A5]">
              Presidential Directive - 401(k) Sovereign Access Program
            </span>
          </motion.div>

          <motion.div
            variants={fadeUp}
            initial="hidden"
            animate="show"
            custom={0.06}
            className="mt-5 inline-block"
          >
            <span
              className="text-xs font-black uppercase tracking-[0.3em] text-[#EF4444] sm:text-sm"
              style={{
                textShadow:
                  "0 0 10px rgba(239,68,68,0.9), 0 0 20px rgba(177,18,38,0.7), 0 0 40px rgba(177,18,38,0.4)",
              }}
            >
              HIGHLY CONFIDENTIAL
            </span>
          </motion.div>

          <motion.h1
            variants={fadeUp}
            initial="hidden"
            animate="show"
            custom={0.12}
            className="mt-6 font-serif text-4xl font-medium leading-[1.05] text-white sm:text-5xl lg:text-[3.5rem]"
          >
            The $9 Trillion Retirement Fund Is Now Open
            <br />
            <span className="bg-gradient-to-r from-[#D4AF37] via-[#E5C76B] to-[#D4AF37] bg-clip-text text-transparent">
              to Qualified 401(k) Holders
            </span>
          </motion.h1>

          <motion.p
            variants={fadeUp}
            initial="hidden"
            animate="show"
            custom={0.24}
            className="mt-6 max-w-xl text-base leading-relaxed text-[#a0a0a0] sm:text-lg"
          >
            Under the USA Presidential Directive, a classified $9 trillion
            retirement strengthening fund has been authorized. For the first
            time, existing 401(k) account holders are granted access to private
            equity opportunities previously reserved for investors with a $5
            million minimum—with a fixed 10× target.
          </motion.p>

          {/* STABLE COIN FEATURE CARD */}
          <motion.div
            variants={fadeUp}
            initial="hidden"
            animate="show"
            custom={0.30}
            className="mt-8"
          >
            <div className="group relative inline-flex max-w-lg items-center gap-5 rounded-2xl border border-[#D4AF37]/20 bg-gradient-to-br from-[#0d0d0d] to-[#0a0a0c] p-5 backdrop-blur-xl transition-all duration-500 hover:border-[#D4AF37]/40 hover:shadow-[0_0_60px_rgba(212,175,55,0.12)] sm:gap-6 sm:p-6">
              {/* Ambient glow behind on hover */}
              <div
                className="pointer-events-none absolute -inset-px rounded-2xl opacity-0 transition-opacity duration-500 group-hover:opacity-100"
                style={{ background: "radial-gradient(ellipse 60% 50% at 50% 50%, rgba(212,175,55,0.08), transparent 70%)" }}
              />

              {/* Video container */}
              <div className="relative shrink-0">
                <div className="absolute -inset-1 rounded-full bg-[#D4AF37]/20 blur-md transition-all duration-500 group-hover:bg-[#D4AF37]/30" />
                <div className="relative h-[72px] w-[72px] overflow-hidden rounded-full border-2 border-[#D4AF37]/40 shadow-[0_0_20px_rgba(212,175,55,0.15)] sm:h-[88px] sm:w-[88px]">
                  <video
                    src="/coin-video.mp4"
                    autoPlay
                    loop
                    muted
                    playsInline
                    className="h-full w-full object-cover"
                  />
                </div>
                {/* Live pulse badge */}
                <div className="absolute -bottom-1 -right-1 flex h-6 w-6 items-center justify-center rounded-full border border-[#D4AF37]/40 bg-[#0a0a0c] shadow-lg">
                  <span className="relative flex h-2 w-2">
                    <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
                    <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-400 shadow-[0_0_6px_rgba(52,211,153,0.8)]" />
                  </span>
                </div>
              </div>

              <div className="relative min-w-0">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="text-sm font-bold text-white">WhitehouseTesla401k (WHT401k)</span>
                  <span className="rounded-full border border-[#D4AF37]/30 bg-[#D4AF37]/10 px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-[#E5C76B]">
                    Now Live
                  </span>
                </div>
                <div className="mt-1.5 flex items-baseline gap-2">
                  <span className="font-mono text-xl font-bold text-[#D4AF37]">$1.00</span>
                  <span className="text-xs text-[#6a6a6a]">stable-coin</span>
                </div>
              </div>
            </div>
          </motion.div>

          <motion.div
            variants={fadeUp}
            initial="hidden"
            animate="show"
            custom={0.36}
            className="mt-10 flex flex-col gap-4 sm:flex-row sm:items-center"
          >
            <Link
              to="/login"
              className="group relative overflow-hidden rounded-full bg-gradient-to-r from-[#B11226] to-[#D62839] px-8 py-4 text-center text-sm font-semibold tracking-wide text-white shadow-[0_0_40px_rgba(177,18,38,0.35)] transition-all duration-300 hover:shadow-[0_0_60px_rgba(239,68,68,0.55)]"
            >
              <span className="relative z-10">Enter With Private Access Key</span>
              <div className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/10 to-transparent transition-transform duration-700 group-hover:translate-x-full" />
            </Link>
          </motion.div>
        </div>

        {/* RIGHT SIDE */}
        <motion.div
          initial={{ opacity: 0, x: 40 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 1, delay: 0.35 }}
          className="flex w-full justify-center lg:col-span-5 lg:-translate-y-20 lg:justify-end"
        >
          <PortfolioCard />
        </motion.div>
      </div>
    </section>
  );
}