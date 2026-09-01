import { motion, useScroll, useTransform, type Variants } from "motion/react";
import { useRef } from "react";

const ease = [0.22, 1, 0.36, 1] as const;

export type PhotoAnim = "fade-scale" | "left" | "right" | "parallax" | "blur" | "tilt";

const variants: Record<PhotoAnim, Variants> = {
  "fade-scale": {
    hidden: { opacity: 0, scale: 1.08 },
    visible: { opacity: 1, scale: 1 },
  },
  left: {
    hidden: { opacity: 0, x: "-8%" },
    visible: { opacity: 1, x: "0%" },
  },
  right: {
    hidden: { opacity: 0, x: "8%" },
    visible: { opacity: 1, x: "0%" },
  },
  parallax: {
    hidden: { opacity: 0, y: 60 },
    visible: { opacity: 1, y: 0 },
  },
  blur: {
    hidden: { opacity: 0, filter: "blur(18px)", scale: 1.04 },
    visible: { opacity: 1, filter: "blur(0px)", scale: 1 },
  },
  tilt: {
    hidden: { opacity: 0, rotate: -3.5, scale: 0.94 },
    visible: { opacity: 1, rotate: 0, scale: 1 },
  },
};

export function Photo({
  index,
  anim = "fade-scale",
  delay = 0,
  className,
  caption,
  drift = 0,
  priority = false,
}: {
  index: number;
  anim?: PhotoAnim;
  delay?: number;
  className?: string;
  caption?: string;
  drift?: number;
  priority?: boolean;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });
  const y = useTransform(scrollYProgress, [0, 1], [drift, -drift]);
  const src = `/images/diya-${String(index).padStart(2, "0")}.jpg`;

  return (
    <motion.div
      ref={ref}
      className={`group relative overflow-hidden rounded-3xl bg-secondary shadow-soft ${className ?? ""}`}
      style={{ aspectRatio: "9 / 16" }}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-8% 0px" }}
      variants={variants[anim]}
      transition={{ duration: 1.3, delay, ease }}
    >
      <motion.img
        src={src}
        alt={caption ?? `A photo of Diya, number ${index}`}
        loading={priority ? "eager" : "lazy"}
        decoding="async"
        className="h-full w-full object-cover object-center transition-transform duration-[900ms] ease-out will-change-transform group-hover:scale-[1.04]"
        style={{ y }}
      />
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-ink/25 via-transparent to-transparent" />
      {caption && (
        <span className="pointer-events-none absolute bottom-4 left-5 font-display text-lg tracking-wide text-cream/95 sm:text-xl">
          {caption}
        </span>
      )}
    </motion.div>
  );
}
