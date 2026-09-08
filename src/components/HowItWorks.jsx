import { motion } from "framer-motion";
import SectionHeading from "./SectionHeading";
import { howItWorks } from "../data/mockPortfolio";

export default function HowItWorks() {
  return (
    <section className="relative py-24 sm:py-32">
      <div className="mx-auto max-w-7xl px-6 sm:px-8">
        <SectionHeading
          eyebrow="Enrollment"
          title="How the Program Works"
          description="A three-step path from 401(k) qualification to portfolio activation under the Presidential Directive."
        />

        <div className="relative mt-20 grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {/* Connector line */}
          <div className="absolute top-6 left-0 hidden h-px w-full bg-gradient-to-r from-transparent via-[rgba(177,18,38,0.35)] to-transparent lg:block" />

          {howItWorks.map((item, i) => (
            <motion.div
              key={item.step}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.6, delay: i * 0.12, ease: [0.16, 1, 0.3, 1] }}
              className="group relative"
            >
              <div className="relative z-10 flex h-12 w-12 items-center justify-center rounded-full border border-[rgba(177,18,38,0.35)] bg-[#0d0d0d] font-serif text-sm text-[#D62839] shadow-[0_0_20px_rgba(177,18,38,0.25)] transition-all duration-500 group-hover:shadow-[0_0_30px_rgba(177,18,38,0.45)] group-hover:border-[rgba(177,18,38,0.6)]">
                {item.step}
              </div>
              <h3 className="mt-5 font-serif text-lg font-medium text-white">{item.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-[#B3B3B3]">{item.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
