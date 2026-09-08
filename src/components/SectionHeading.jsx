import { motion } from "framer-motion";

export default function SectionHeading({ eyebrow, title, description, align = "center" }) {
  const isCenter = align === "center";
  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
      className={`mx-auto max-w-2xl ${isCenter ? "text-center" : "text-left"}`}
    >
      {eyebrow && (
        <span className="mb-4 inline-block text-[11px] font-semibold uppercase tracking-[0.2em] text-[#D62839]">
          {eyebrow}
        </span>
      )}
      <h2 className="font-serif text-3xl font-medium leading-tight text-white sm:text-4xl">
        {title}
      </h2>
      {description && (
        <p className="mt-4 text-base leading-relaxed text-[#B3B3B3]">{description}</p>
      )}
    </motion.div>
  );
}
