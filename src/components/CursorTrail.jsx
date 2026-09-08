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
    const isCoarse = window.matchMedia("(pointer: coarse)").matches;
    const updatePosition = (clientX, clientY) => {
      mouseX.set(clientX);
      mouseY.set(clientY);
    };

    const handleMove = (e) => updatePosition(e.clientX, e.clientY);
    const handleTouchMove = (e) => {
      const touch = e.touches?.[0];
      if (!touch) return;
      updatePosition(touch.clientX, touch.clientY);
    };
    const handleScroll = () => {
      if (!isCoarse) return;
      updatePosition(window.innerWidth / 2, window.innerHeight * 0.35 + window.scrollY * 0.5);
    };

    window.addEventListener("pointermove", handleMove);
    window.addEventListener("touchmove", handleTouchMove, { passive: true });
    window.addEventListener("scroll", handleScroll, { passive: true });

    return () => {
      window.removeEventListener("pointermove", handleMove);
      window.removeEventListener("touchmove", handleTouchMove);
      window.removeEventListener("scroll", handleScroll);
    };
  }, [mouseX, mouseY]);

  const displayDots = window.matchMedia("(pointer: coarse)").matches ? DOTS.slice(0, 2) : DOTS;

  return (
    <div className="pointer-events-none fixed inset-0 z-[70] block">
      {displayDots.map((dot, i) => (
        <TrailDot key={i} mouseX={mouseX} mouseY={mouseY} {...dot} />
      ))}
    </div>
  );
}
