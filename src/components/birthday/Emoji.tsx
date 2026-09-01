import type { ReactNode } from "react";

import { getAppleEmojiUrl } from "./appleEmoji";

const EMOJI_REGEX = /\p{Extended_Pictographic}+/gu;

/** Exact Apple emoji artwork (same images as iOS), via emoji-datasource-apple. */
export function Emoji({
  children,
  className = "",
  size = "1.15em",
}: {
  children: string;
  className?: string;
  size?: string | number;
}) {
  return (
    <img
      src={getAppleEmojiUrl(children)}
      alt=""
      aria-hidden="true"
      draggable={false}
      className={`inline-block align-[-0.12em] select-none ${className}`}
      style={{ width: size, height: size }}
      loading="lazy"
      decoding="async"
    />
  );
}

/** Inline text with Apple emoji images substituted for every emoji grapheme. */
export function renderAppleEmojiText(text: string): ReactNode[] {
  const nodes: ReactNode[] = [];
  let lastIndex = 0;
  let key = 0;

  for (const match of text.matchAll(EMOJI_REGEX)) {
    const index = match.index ?? 0;
    if (index > lastIndex) {
      nodes.push(text.slice(lastIndex, index));
    }
    nodes.push(
      <Emoji key={key++} size="1.15em">
        {match[0]}
      </Emoji>,
    );
    lastIndex = index + match[0].length;
  }

  if (lastIndex < text.length) {
    nodes.push(text.slice(lastIndex));
  }

  return nodes.length > 0 ? nodes : [text];
}
