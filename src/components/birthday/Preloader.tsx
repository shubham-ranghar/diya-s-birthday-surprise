import { AnimatePresence, motion } from "motion/react";

const word = "Loading a Surprise...";

export function Preloader({ show }: { show: boolean }) {
  return (
    <AnimatePresence>
      {show && (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center bg-sunrise grain"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
        >
          <div className="text-center">
            <p className="flex flex-wrap justify-center gap-[0.02em] font-display text-2xl tracking-wide text-ink sm:text-4xl">
              {word.split("").map((c, i) => (
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
                  {c === " " ? "\u00A0" : c}
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
