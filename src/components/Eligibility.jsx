import { motion } from "framer-motion";
import { Check } from "lucide-react";
import SectionHeading from "./SectionHeading";
import { eligibilityRequirements } from "../data/mockPortfolio";

export default function Eligibility() {
  return (
    <section id="eligibility" className="relative py-24 sm:py-32">
      <div className="mx-auto max-w-7xl px-6 sm:px-8">
        <SectionHeading eyebrow="Qualification" title="Who Can Participate" />

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
          className="relative mx-auto mt-14 max-w-4xl overflow-hidden rounded-[28px] p-[1px]"
        >
          {/* Gradient border */}
          <div className="absolute inset-0 rounded-[28px] bg-gradient-to-b from-white/[0.1] via-white/[0.03] to-white/[0.08]" />
          <div
            className="pointer-events-none absolute -top-24 right-0 h-72 w-72 rounded-full opacity-40 blur-[100px]"
            style={{ background: "radial-gradient(circle, rgba(177,18,38,0.4), transparent 70%)" }}
          />

          <div className="relative rounded-[28px] bg-[#0a0a0c]/95 p-8 backdrop-blur-2xl sm:p-12">
            <p className="max-w-xl text-sm leading-relaxed text-[#B3B3B3]">
              Participation is strictly limited to invited individuals who maintain an active 401(k)
              retirement account. The standard $5 million institutional minimum has been permanently
              waived under the current Presidential Directive.
            </p>

            <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2">
              {eligibilityRequirements.map((req, i) => (
                <motion.div
                  key={req}
                  initial={{ opacity: 0, x: -12 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: i * 0.08 }}
                  className="group flex items-center gap-3 rounded-xl border border-white/5 bg-white/[0.02] px-4 py-3.5 transition-all duration-300 hover:border-[rgba(177,18,38,0.25)] hover:bg-white/[0.04]"
                >
                  <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-[#B11226] to-[#D62839] shadow-[0_0_12px_rgba(177,18,38,0.35)]">
                    <Check size={13} className="text-white" />
                  </span>
                  <span className="text-sm font-medium text-white">{req}</span>
                </motion.div>
              ))}
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
