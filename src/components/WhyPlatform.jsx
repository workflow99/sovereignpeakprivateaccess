import { motion } from "framer-motion";
import { KeyRound, LineChart, ShieldCheck } from "lucide-react";
import SectionHeading from "./SectionHeading";
import { whyCards } from "../data/mockPortfolio";

const ICONS = [KeyRound, LineChart, ShieldCheck];

export default function WhyPlatform() {
  return (
    <section id="program" className="relative py-24 sm:py-32">
      <div className="mx-auto max-w-7xl px-6 sm:px-8">
        <SectionHeading
          eyebrow="The Directive"
          title="Why the 401(k) Sovereign Access Program Exists"
          description="Established under the USA Presidential Directive to redirect qualified retirement capital into high-growth institutional assets previously gated behind a $5 million minimum."
        />

        <div className="mt-16 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {whyCards.map((card, i) => {
            const Icon = ICONS[i];
            return (
              <motion.div
                key={card.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-60px" }}
                transition={{ duration: 0.6, delay: i * 0.12, ease: [0.16, 1, 0.3, 1] }}
                whileHover={{ y: -6 }}
                className="group relative overflow-hidden rounded-2xl p-[1px] transition-all duration-500"
              >
                {/* Gradient border wrapper */}
                <div className="absolute inset-0 rounded-2xl bg-gradient-to-b from-white/[0.08] to-white/[0.02] opacity-60 transition-opacity duration-500 group-hover:opacity-100" />
                <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-[rgba(177,18,38,0.15)] via-transparent to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100" />

                <div className="relative h-full rounded-2xl bg-[#0a0a0c]/90 p-8 backdrop-blur-xl">
                  <div
                    className="pointer-events-none absolute -top-16 -right-16 h-40 w-40 rounded-full opacity-0 blur-3xl transition-opacity duration-500 group-hover:opacity-100"
                    style={{ background: "radial-gradient(circle, rgba(177,18,38,0.35), transparent 70%)" }}
                  />
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl border border-[rgba(177,18,38,0.25)] bg-white/[0.03] shadow-[0_0_20px_rgba(177,18,38,0.1)] transition-shadow duration-500 group-hover:shadow-[0_0_30px_rgba(177,18,38,0.2)]">
                    <Icon size={20} className="text-[#D62839]" />
                  </div>
                  <h3 className="mt-6 font-serif text-xl font-medium text-white">{card.title}</h3>
                  <p className="mt-3 text-sm leading-relaxed text-[#B3B3B3]">{card.description}</p>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
