import { motion } from "framer-motion";
import { Fingerprint, Lock, ServerCog, ShieldCheck } from "lucide-react";
import SectionHeading from "./SectionHeading";
import { securityFeatures } from "../data/mockPortfolio";

const ICONS = [Lock, Fingerprint, ServerCog, ShieldCheck];

export default function SecuritySection() {
  return (
    <section id="security" className="relative py-24 sm:py-32">
      <div className="mx-auto max-w-7xl px-6 sm:px-8">
        <SectionHeading
          eyebrow="Infrastructure"
          title="Sovereign-Grade Security"
          description="Military-grade protections guarding the $9 trillion fund portal, your 401(k) assets, and every Tesla 401(k) Launch Coin transaction."
        />

        <div className="mt-16 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {securityFeatures.map((f, i) => {
            const Icon = ICONS[i];
            return (
              <motion.div
                key={f.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-60px" }}
                transition={{ duration: 0.6, delay: i * 0.1, ease: [0.16, 1, 0.3, 1] }}
                whileHover={{ y: -6 }}
                className="group relative overflow-hidden rounded-2xl p-[1px] transition-all duration-500"
              >
                {/* Gradient border wrapper */}
                <div className="absolute inset-0 rounded-2xl bg-gradient-to-b from-white/[0.08] to-white/[0.02] opacity-60 transition-opacity duration-500 group-hover:opacity-100" />
                <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-[rgba(177,18,38,0.15)] via-transparent to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100" />

                <div className="relative h-full rounded-2xl bg-[#0a0a0c]/90 p-6 backdrop-blur-xl transition-colors duration-300">
                  <div className="flex h-11 w-11 items-center justify-center rounded-xl border border-[rgba(177,18,38,0.25)] bg-white/[0.03] shadow-[0_0_16px_rgba(177,18,38,0.08)] transition-shadow duration-500 group-hover:shadow-[0_0_24px_rgba(177,18,38,0.15)]">
                    <Icon size={18} className="text-[#D62839]" />
                  </div>
                  <h3 className="mt-5 font-serif text-base font-medium text-white">{f.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-[#B3B3B3]">{f.description}</p>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
