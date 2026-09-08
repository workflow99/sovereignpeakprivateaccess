import { useEffect } from "react";
import { motion, useMotionValue, useSpring } from "framer-motion";

const DOTS = [
  { size: 7, stiffness: 1000, damping: 40, opacity: 1 },
  { size: 16, stiffness: 300, damping: 30, opacity: 0.45 },
  { size: 26, stiffness: 140, damping: 26, opacity: 0.22 },
  { size: 38, stiffness: 70, damping: 22, opacity: 0.1 },
];

function TrailDot({ mouseX, mouseY, size, stiffness, damping, opacity }) {
  const x = useSpring(mouseX, { stiffness, damping, mass: 0.5 });
  const y = useSpring(mouseY, { stiffness, damping, mass: 0.5 });

  return (
    <motion.span
      style={{
        x,
        y,
        width: size,
        height: size,
        marginLeft: -size / 2,
        marginTop: -size / 2,
      }}
      className="absolute top-0 left-0 rounded-full"
    >
      <span
        className="block h-full w-full rounded-full"
        style={{
          background: "radial-gradient(circle, rgba(239,68,68,0.95), rgba(214,40,57,0) 70%)",
          opacity,
        }}
      />
    </motion.span>
  );
}

export default function CursorTrail() {
  const mouseX = useMotionValue(-100);
  const mouseY = useMotionValue(-100);

  useEffect(() => {
    if (!window.matchMedia("(pointer: fine)").matches) return;

    const handleMove = (e) => {
      mouseX.set(e.clientX);
      mouseY.set(e.clientY);
    };
    window.addEventListener("pointermove", handleMove);
    return () => window.removeEventListener("pointermove", handleMove);
  }, [mouseX, mouseY]);

  return (
    <div className="pointer-events-none fixed inset-0 z-[70] hidden sm:block">
      {DOTS.map((dot, i) => (
        <TrailDot key={i} mouseX={mouseX} mouseY={mouseY} {...dot} />
      ))}
    </div>
  );
}
