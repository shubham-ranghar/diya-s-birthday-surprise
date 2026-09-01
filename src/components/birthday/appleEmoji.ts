/** Unicode codepoint path used by emoji-datasource-apple (e.g. "1f382", "2728"). */
export function emojiToUnified(emoji: string): string {
  const codepoints: string[] = [];
  for (let i = 0; i < emoji.length; ) {
    const codepoint = emoji.codePointAt(i)!;
    codepoints.push(codepoint.toString(16));
    i += codepoint > 0xffff ? 2 : 1;
  }
  return codepoints.join("-");
}

const APPLE_EMOJI_CDN =
  "https://cdn.jsdelivr.net/npm/emoji-datasource-apple@15.1.1/img/apple/64";

export function getAppleEmojiUrl(emoji: string): string {
  return `${APPLE_EMOJI_CDN}/${emojiToUnified(emoji)}.png`;
}
