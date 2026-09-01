import { useMemo, type CSSProperties } from "react";

import { Emoji } from "./Emoji";

const CELEBRATION_EMOJIS = ["🎂", "🎉", "✨", "🎈", "💖", "🎁", "🌟", "🥳"];

/** Subtle floating Apple emojis — no dot bubbles. */
export function Particles({ emojiCount = 6 }: { emojiCount?: number }) {
  const emojis = useMemo(
    () =>
      Array.from({ length: emojiCount }, (_, i) => ({
        left: 8 + ((i * 43) % 84),
        top: 12 + ((i * 31) % 76),
        emoji: CELEBRATION_EMOJIS[i % CELEBRATION_EMOJIS.length]!,
        size: 16 + ((i * 3) % 5) * 4,
        driftY: 28 + ((i * 11) % 42),
        driftX: ((i % 7) - 3) * 14,
        duration: 5 + ((i * 2) % 7),
        delay: (i * 0.55) % 6,
        opacity: 0.28 + ((i * 5) % 5) * 0.06,
      })),
    [emojiCount],
  );

  const floatStyle = (d: {
    driftX: number;
    driftY: number;
    duration: number;
    delay: number;
    opacity: number;
  }): CSSProperties =>
    ({
      "--drift-x": `${d.driftX}px`,
      "--drift-y": `${d.driftY}px`,
      "--float-duration": `${d.duration}s`,
      "--float-delay": `${d.delay}s`,
      "--emoji-opacity": String(d.opacity),
    }) as CSSProperties;

  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden="true">
      {emojis.map((e, i) => (
        <span
          key={i}
          className="ambient-emoji absolute leading-none"
          style={{
            left: `${e.left}%`,
            top: `${e.top}%`,
            ...floatStyle(e),
          }}
        >
          <Emoji size={e.size}>{e.emoji}</Emoji>
        </span>
      ))}
    </div>
  );
}
