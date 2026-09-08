import { motion } from "framer-motion";
import { Link } from "react-router-dom";

export default function FinalCTA() {
  return (
    <section id="contact" className="relative py-24 sm:py-32">
      <div className="mx-auto max-w-4xl px-6 text-center sm:px-8">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
          className="relative overflow-hidden rounded-[32px] p-[1px]"
        >
          {/* Gradient border */}
          <div className="absolute inset-0 rounded-[32px] bg-gradient-to-b from-white/[0.12] via-white/[0.04] to-white/[0.1]" />
          <div
            className="pointer-events-none absolute inset-0 opacity-60"
            style={{
              background:
                "radial-gradient(ellipse 60% 50% at 50% 0%, rgba(177,18,38,0.25), transparent 70%)",
            }}
          />

          <div className="relative overflow-hidden rounded-[32px] px-8 py-16 sm:px-16 sm:py-20">
            {/* Rotating coin video background */}
            <video
              src="/coin-video.mp4"
              autoPlay
              loop
              muted
              playsInline
              preload="metadata"
              className="absolute inset-0 h-full w-full object-cover opacity-45"
            />
            {/* Dark readability overlay */}
            <div className="absolute inset-0 bg-gradient-to-b from-[#0a0a0c]/65 via-[#0a0a0c]/72 to-[#0a0a0c]/80" />

            <span className="relative mb-5 inline-block rounded-full border border-[#D4AF37]/20 bg-[#D4AF37]/5 px-4 py-1.5 text-[11px] font-semibold uppercase tracking-[0.2em] text-[#D4AF37]">
              By Presidential Directive Only
            </span>
            <h2 className="relative font-serif text-3xl font-medium leading-tight text-white sm:text-4xl lg:text-5xl">
              Access Reserved for Qualified 401(k) Holders
            </h2>
            <p className="relative mx-auto mt-5 max-w-xl text-base leading-relaxed text-[#B3B3B3]">
              Enrollment is limited to invited participants under the USA Presidential Directive.
              Secure your Private Access Key and position your 401(k) for the fixed 10× return target by December.
            </p>

            <div className="relative mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
              <Link
                to="/login"
                className="group relative w-full overflow-hidden rounded-full border border-[rgba(177,18,38,0.3)] bg-white/[0.02] px-8 py-4 text-center text-sm font-semibold tracking-wide text-white transition-all duration-300 hover:border-[rgba(177,18,38,0.6)] hover:bg-white/5 sm:w-auto"
              >
                <span className="relative z-10">Enter Portal</span>
                <div className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/5 to-transparent transition-transform duration-700 group-hover:translate-x-full" />
              </Link>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
