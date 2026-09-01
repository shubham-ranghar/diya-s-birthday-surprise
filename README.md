# Diya's Birthday Surprise

Build a beautiful, animated birthday surprise website called "Diya's Birthday Surprise" — a personal gift website created by Shubham for Diya, whose birthday is September 10th.

CONCEPT

This is a one-page, scroll-driven experience that feels like unwrapping a thoughtful gift. As the visitor (Diya) scrolls, the story unfolds — animated reveals, personal messages, and 19 photos of her presented in a warm, elegant, celebratory way. The site should make her feel special and clearly convey that Shubham built this himself as a birthday surprise.

TECH STACK

- React + TypeScript

- GSAP with ScrollTrigger for scroll-based animations

- Framer Motion for component transitions and micro-interactions

- Tailwind CSS for styling

- Fully responsive, mobile-first (most gift links get opened on phones)

VISUAL DIRECTION

- Warm, elegant, pastel palette: soft pinks, cream, gold, sunset orange/peach gradients

- Clean modern typography — pair an elegant serif (for headings/names) with a soft sans-serif (for body text)

- Subtle grain/gradient backgrounds, soft shadows, rounded corners — nothing sharp or corporate

- No overt romantic symbols (no hearts, cupids, roses) — keep the tone warm, appreciative, and celebratory rather than romantic

- Generous whitespace, smooth easing on all transitions (avoid anything jarring or bouncy)

IMAGE HANDLING

- 19 images of Diya, all in portrait aspect ratio (9:16)

- Use full-bleed portrait image sections, alternating with masonry/grid layouts for image clusters

- Each image should have its own animation trigger as it scrolls into view — vary between: fade + scale up, slide-in from left/right, gentle parallax drift, soft blur-to-focus reveal, subtle rotation on entry

- Avoid repeating the same animation back-to-back — cycle through styles so each section feels fresh

- Images should never feel cropped awkwardly — respect portrait framing throughout

PAGE STRUCTURE (scroll sections, in order)

1. Hero/Landing Section

   - Full-screen intro with animated text reveal: "Happy Birthday, Diya" 

   - Subtle animated background (soft gradient shift or floating particles — tasteful, not cluttered)

   - Small scroll-down indicator/prompt

2. Opening Message

   - A short, heartfelt intro line from Shubham, animated in word-by-word or line-by-line as it scrolls into view

   - Sets the tone: warmth, friendship, appreciation

3. Photo Journey (main section, uses most of the 19 images)

   - Break into 3–4 sub-sections, each with a short caption/theme (e.g., "Moments," "Memories," "Smiles") 

   - Mix of full-screen single-image reveals and 2–3 image grid clusters

   - Each image animates independently on scroll (staggered timing, not all at once)

4. The Message from Shubham

   - A dedicated, visually distinct section (different background treatment — maybe a soft card or full-bleed color block)

   - Heartfelt written message from Shubham to Diya, animated text reveal

   - Shubham's name displayed prominently as the author/gift-giver

5. The Date Reveal

   - Elegant animated display of "10th September" — could be a large stylized number/date treatment with subtle animation (count-up, fade, or draw-in effect)

6. "This Is a Gift" Section

   - Explicitly and warmly convey that Shubham made this entire website himself as a surprise — e.g., "I built this, just for you" styled prominently

   - This is the emotional highlight — give it standout visual treatment (different color mood, larger typography, maybe a small animated signature-style text for "Shubham")

7. Closing Section

   - Final warm message, maybe remaining images in a closing gallery/collage

   - A calm, satisfying end to the scroll journey — soft fade to a closing "Happy Birthday, Diya 🎉" (no explicit hearts, but a subtle celebratory touch like confetti-style particles is fine)

INTERACTIONS & POLISH

- Smooth scroll behavior (consider Lenis or native smooth-scroll)

- ScrollTrigger-pinned sections where appropriate for dramatic single-image reveals

- Subtle hover/tap micro-interactions on images (gentle scale on hover for desktop)

- Loading state: a simple elegant preloader (e.g., animated "Loading a Surprise..." text) so images don't pop in abruptly

- Performance: lazy-load images below the fold, optimize for smooth 60fps scroll animation even with 19 images

NAMING

- Use placeholder image paths like /images/diya-01.jpg through /images/diya-19.jpg so images can be swapped in easily

- GitHub repo name: diya-birthday-surprise

TONE REMINDER

Throughout, the feeling should be: "You are special, and this is for you — from Shubham." Warm, sincere, celebratory, and personal — not generic or templated. Every section should feel like it was made with care specifically for Diya.

This project was built with [Lovable](https://lovable.dev).

## Build with Lovable

Continue developing this project in the [Lovable editor](https://lovable.dev/projects/505a5016-6323-448d-b52c-ef8d06c1d564).

- **Ship faster**: describe what you want to build and Lovable handles the code.
- **Stay in sync**: every change made in Lovable is committed straight to this repository.
- **Full ownership**: this code is yours. Push to `main` on GitHub and your changes sync back into Lovable, ready for your next prompt.

## Development

Prefer working locally? You need Node.js and npm — [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating).

```sh
git clone <this-repository-url>
cd <repository-name>
npm i
npm run dev
```
