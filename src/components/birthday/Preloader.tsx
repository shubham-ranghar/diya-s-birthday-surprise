import { AnimatePresence, motion } from "motion/react";
import { Emoji, renderAppleEmojiText } from "./Emoji";

const word = "loading a surprise for diya 🫶";

export function Preloader({ show, onExitComplete }: { show: boolean; onExitComplete?: () => void }) {
  return (
    <AnimatePresence onExitComplete={onExitComplete}>
      {show && (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center bg-sunrise grain"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
        >
          <div className="text-center">
            <p className="flex flex-wrap justify-center gap-[0.02em] font-display text-4xl tracking-wide text-ink sm:text-6xl">
              {renderAppleEmojiText(word).map((c, i) => (
                <motion.span
                  key={i}
                  initial={{ opacity: 0.15 }}
                  animate={{ opacity: [0.15, 1, 0.15] }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                    delay: i * 0.06,
                    ease: "easeInOut",
                  }}
                >
                  {c}
                </motion.span>
              ))}
            </p>
            <motion.div
              className="mx-auto mt-8 h-px w-40 origin-left bg-ink/30"
              initial={{ scaleX: 0 }}
              animate={{ scaleX: 1 }}
              transition={{ duration: 2.2, ease: "easeInOut" }}
            />
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
