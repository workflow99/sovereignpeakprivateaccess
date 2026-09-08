import { useEffect, useMemo, useRef } from "react";

function Particles({ count = 22 }) {
  const particles = useMemo(
    () =>
      Array.from({ length: count }, (_, i) => ({
        id: i,
        left: Math.random() * 100,
        size: 1 + Math.random() * 2,
        duration: 14 + Math.random() * 16,
        delay: Math.random() * -20,
        drift: `${(Math.random() - 0.5) * 80}px`,
      })),
    [count]
  );

  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden">
      {particles.map((p) => (
        <span
          key={p.id}
          className="animate-particle absolute bottom-0 rounded-full bg-[#D62839]"
          style={{
            left: `${p.left}%`,
            width: p.size,
            height: p.size,
            animationDuration: `${p.duration}s`,
            animationDelay: `${p.delay}s`,
            "--drift-x": p.drift,
            boxShadow: "0 0 6px 1px rgba(214,40,57,0.8)",
          }}
        />
      ))}
    </div>
  );
}

export default function BackgroundFX() {
  const spotlightRef = useRef(null);

  useEffect(() => {
    const el = spotlightRef.current;
    if (!el) return;
    let raf = null;
    const handleMove = (e) => {
      if (raf) return;
      raf = requestAnimationFrame(() => {
        el.style.setProperty("--x", `${e.clientX}px`);
        el.style.setProperty("--y", `${e.clientY}px`);
        raf = null;
      });
    };
    window.addEventListener("pointermove", handleMove);
    return () => {
      window.removeEventListener("pointermove", handleMove);
      if (raf) cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <div className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
      <div className="absolute inset-0 bg-[#050505]" />

      <div className="grid-bg animate-pan-grid absolute inset-0 opacity-60" />

      <div
        className="animate-drift absolute -top-40 left-[8%] h-[38rem] w-[38rem] rounded-full opacity-40 blur-[120px]"
        style={{ background: "radial-gradient(circle, rgba(177,18,38,0.35), transparent 70%)" }}
      />
      <div
        className="animate-drift-slow absolute top-[35%] right-[4%] h-[30rem] w-[30rem] rounded-full opacity-30 blur-[110px]"
        style={{ background: "radial-gradient(circle, rgba(214,40,57,0.3), transparent 70%)" }}
      />
      <div
        className="animate-pulse-glow absolute bottom-0 left-1/3 h-[26rem] w-[26rem] rounded-full opacity-30 blur-[110px]"
        style={{ background: "radial-gradient(circle, rgba(177,18,38,0.25), transparent 70%)" }}
      />

      <Particles />

      <div ref={spotlightRef} className="cursor-spotlight absolute inset-0 hidden md:block" />

      <div
        className="absolute inset-0 opacity-70"
        style={{
          background:
            "radial-gradient(ellipse 80% 60% at 50% 0%, transparent 0%, rgba(5,5,5,0.4) 55%, #050505 100%)",
        }}
      />
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-[#050505]" />
    </div>
  );
}
