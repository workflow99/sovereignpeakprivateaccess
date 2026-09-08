import { AnimatePresence, motion } from "framer-motion";
import RocketGlyph from "./RocketGlyph";

export default function RocketLoader({ visible, label = "Loading" }) {
  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.25 }}
          className="fixed inset-0 z-[200] flex flex-col items-center justify-center bg-[#050505]"
        >
          <div className="relative flex h-40 flex-col items-center justify-end overflow-hidden">
            <motion.div
              animate={{ y: [0, -22, 0] }}
              transition={{ duration: 1.1, repeat: Infinity, ease: "easeInOut" }}
              className="relative z-10"
            >
              <RocketGlyph />
              <motion.span
                animate={{ scaleY: [1, 1.5, 1], opacity: [0.5, 1, 0.5] }}
                transition={{ duration: 0.45, repeat: Infinity, ease: "easeInOut" }}
                className="absolute top-[68px] left-1/2 h-8 w-3 -translate-x-1/2 rounded-full bg-gradient-to-b from-[#EF4444] via-[#D62839]/70 to-transparent blur-[2px]"
                style={{ transformOrigin: "top" }}
              />
            </motion.div>
          </div>

          <motion.p
            animate={{ opacity: [0.4, 1, 0.4] }}
            transition={{ duration: 1.6, repeat: Infinity, ease: "easeInOut" }}
            className="mt-2 text-[11px] font-semibold uppercase tracking-[0.3em] text-[#B3B3B3]"
          >
            {label}
          </motion.p>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
