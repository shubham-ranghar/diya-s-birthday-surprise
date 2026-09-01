import { motion } from "motion/react";
import type { ReactNode } from "react";

import { renderAppleEmojiText } from "./Emoji";

const ease = [0.22, 1, 0.36, 1] as const;

export function Reveal({
  children,
  delay = 0,
  y = 28,
  className,
}: {
  children: ReactNode;
  delay?: number;
  y?: number;
  className?: string;
}) {
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-12% 0px" }}
      transition={{ duration: 1.1, delay, ease }}
    >
      {children}
    </motion.div>
  );
}

export function WordReveal({
  text,
  className,
  delay = 0,
  stagger = 0.055,
}: {
  text: string;
  className?: string;
  delay?: number;
  stagger?: number;
}) {
  return (
    <motion.span
      className={className}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-10% 0px" }}
      transition={{ staggerChildren: stagger, delayChildren: delay }}
      aria-label={text}
    >
      {text.split(" ").map((w, i) => (
        <span key={i} className="inline-block overflow-hidden pb-[0.08em] align-bottom">
          <motion.span
            className="inline-block"
            variants={{
              hidden: { y: "110%", opacity: 0 },
              visible: { y: "0%", opacity: 1 },
            }}
            transition={{ duration: 0.95, ease }}
          >
            {renderAppleEmojiText(w)}
            {"\u00A0"}
          </motion.span>
        </span>
      ))}
    </motion.span>
  );
}

export function LineReveal({
  lines,
  className,
}: {
  lines: string[];
  className?: string;
}) {
  return (
    <div className={className}>
      {lines.map((line, i) => (
        <Reveal key={i} delay={i * 0.14} y={22}>
          <p>{renderAppleEmojiText(line)}</p>
        </Reveal>
      ))}
    </div>
  );
}
