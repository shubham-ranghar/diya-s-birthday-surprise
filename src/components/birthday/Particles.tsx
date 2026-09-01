import { motion } from "motion/react";
import { useMemo } from "react";

export function Particles({
  count = 18,
  tone = "gold",
}: {
  count?: number;
  tone?: "gold" | "blush";
}) {
  const dots = useMemo(
    () =>
      Array.from({ length: count }, (_, i) => ({
        left: (i * 37) % 100,
        size: 4 + ((i * 13) % 9),
        duration: 9 + ((i * 7) % 9),
        delay: (i * 0.9) % 8,
        drift: ((i % 5) - 2) * 18,
      })),
    [count],
  );

  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden="true">
      {dots.map((d, i) => (
        <motion.span
          key={i}
          className={`absolute rounded-full ${tone === "gold" ? "bg-gold/60" : "bg-blush/70"}`}
          style={{ left: `${d.left}%`, width: d.size, height: d.size, bottom: -20 }}
          animate={{
            y: [0, -520],
            x: [0, d.drift, 0],
            opacity: [0, 0.85, 0],
          }}
          transition={{
            duration: d.duration,
            delay: d.delay,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
      ))}
    </div>
  );
}
