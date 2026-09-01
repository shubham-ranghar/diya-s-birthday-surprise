import { createFileRoute } from "@tanstack/react-router";
import { motion } from "motion/react";
import { useCallback, useEffect, useState } from "react";

import { Emoji, renderAppleEmojiText } from "@/components/birthday/Emoji";
import { Hero } from "@/components/birthday/Hero";
import { ChapterOneFannedGallery } from "@/components/birthday/FannedGallery";
import { Photo } from "@/components/birthday/Photo";
import { Particles } from "@/components/birthday/Particles";
import { PinnedPhoto } from "@/components/birthday/PinnedPhoto";
import { Preloader } from "@/components/birthday/Preloader";
import { LineReveal, Reveal, WordReveal } from "@/components/birthday/Reveal";
import { lenisInstance, useSmoothScroll } from "@/components/birthday/useSmoothScroll";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Diya's Birthday Surprise — 10th September" },
      {
        name: "description",
        content:
          "A scroll-through birthday surprise for Diya, built by hand as a gift by Shubham. Happy Birthday, Diya.",
      },
      { property: "og:title", content: "Diya's Birthday Surprise — 10th September" },
      {
        property: "og:description",
        content: "A scroll-through birthday surprise for Diya, built by hand as a gift by Shubham.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: BirthdayPage,
});

function BirthdayPage() {
  const [loading, setLoading] = useState(true);
  const [scrollLocked, setScrollLocked] = useState(true);
  const [scrollReady, setScrollReady] = useState(false);
  const onHeroEntranceComplete = useCallback(() => setScrollReady(true), []);
  useSmoothScroll(scrollReady && !scrollLocked);

  useEffect(() => {
    // Only scroll to top on initial page load, not on re-renders
    if (lenisInstance && lenisInstance.scroll === 0) {
      window.scrollTo(0, 0);
    }
  }, []);

  useEffect(() => {
    if (!scrollLocked) return;

    document.documentElement.classList.add("scroll-locked");
    document.body.classList.add("scroll-locked");
    lenisInstance?.stop();

    const preventScroll = (e: Event) => e.preventDefault();

    window.addEventListener("wheel", preventScroll, { passive: false });
    window.addEventListener("touchmove", preventScroll, { passive: false });

    return () => {
      document.documentElement.classList.remove("scroll-locked");
      document.body.classList.remove("scroll-locked");
      window.removeEventListener("wheel", preventScroll);
      window.removeEventListener("touchmove", preventScroll);
    };
  }, [scrollLocked]);

  useEffect(() => {
    if (scrollLocked) return;

    lenisInstance?.start();
  }, [scrollLocked]);

  useEffect(() => {
    const t = setTimeout(() => setLoading(false), 2300);
    return () => clearTimeout(t);
  }, []);

  const onPreloaderExit = useCallback(() => setScrollLocked(false), []);

  return (
    <main className="relative w-full overflow-x-hidden bg-background text-foreground">
      <Preloader show={loading} onExitComplete={onPreloaderExit} />

      <Hero ready={!loading} onEntranceComplete={onHeroEntranceComplete} />
      <OpeningMessage />

      <ChapterOneFannedGallery
        enabled={scrollReady}
        eyebrow="Chapter One"
        title="Moments 📸"
        blurb="Little ordinary days that somehow turned into favourites. 💕"
        images={[1, 2, 3, 4, 5, 6]}
      />
      <PinnedPhoto
        enabled={scrollReady}
        index={4}
        title="Moments, exactly as they were 📷"
        subtitle="No filter needed — this is simply you, being you. ✨"
      />

      <PhotoChapter
        eyebrow="Chapter Two"
        title="Memories 🌅"
        blurb="Places, laughter, and the timing that made all of it feel easy. ✨"
        images={[5, 6, 7, 8]}
        flip
      />
      <PinnedPhoto enabled={scrollReady} index={9} title="Memories worth keeping 💫" subtitle="Saved, framed, and scrolled back to. 🖼️" />

      <PhotoChapter
        eyebrow="Chapter Three"
        title="Smiles 😊"
        blurb="The kind that shows up in the photo before it shows up in the room. 🌸"
        images={[10, 11, 12]}
      />
      <PhotoChapter
        eyebrow="Chapter Four"
        title="You, this year 🌟"
        blurb="Growing, glowing, and still the most genuine person in the room. 💖"
        images={[13, 14, 15]}
        flip
      />

      <MessageFromShubham />
      <DateReveal />
      <GiftSection />
      <Closing />
    </main>
  );
}

/* 2. Opening message ------------------------------------------------------- */
function OpeningMessage() {
  return (
    <section className="relative overflow-hidden px-6 py-16 sm:py-24">
      <Particles emojiCount={5} />
      <div className="relative mx-auto max-w-3xl text-center">
      <Reveal>
        <p className="text-[clamp(0.76rem,2.5vw,0.65rem)] uppercase tracking-[0.38em] text-muted-foreground">
          Before you scroll <Emoji>✨</Emoji>
        </p>
      </Reveal>
      <h2 className="mt-6 font-display text-[clamp(2.2rem,7vw,1.875rem)] leading-snug tracking-tight sm:text-5xl">
        <WordReveal text="Some people make life lighter just by being in it — and you have been one of them. 💫" />
      </h2>
      <LineReveal
        className="mt-8 space-y-3 text-[clamp(1.125rem,4vw,1rem)] font-light leading-relaxed text-muted-foreground sm:text-lg"
        lines={[
          "So instead of a message that disappears in a chat,",
          "I put together something you can scroll through slowly.",
          "Take your time. It was made for exactly one person.",
        ]}
      />
      </div>
    </section>
  );
}
/* 3. Photo chapters -------------------------------------------------------- */
const animCycle = ["fade-scale", "left", "blur", "right", "tilt", "parallax"] as const;

function PhotoChapter({
  eyebrow,
  title,
  blurb,
  images,
  flip = false,
}: {
  eyebrow: string;
  title: string;
  blurb: string;
  images: number[];
  flip?: boolean;
}) {
  return (
    <section className="relative overflow-hidden px-5 py-20 sm:px-8 sm:py-28">
      <Particles emojiCount={4} />
      <div className="relative mx-auto max-w-6xl">
        <div className={`max-w-xl ${flip ? "sm:ml-auto sm:text-right" : ""}`}>
          <Reveal>
            <p className="text-[clamp(0.76rem,2.5vw,0.65rem)] uppercase tracking-[0.38em] text-sunset">{eyebrow}</p>
          </Reveal>
          <h2 className="mt-4 font-display text-[clamp(2.65rem,8vw,2.25rem)] tracking-tight sm:text-6xl">
            <WordReveal text={title} />
          </h2>
          <Reveal delay={0.12}>
            <p className="mt-4 text-[clamp(1.125rem,4vw,1rem)] font-light leading-relaxed text-muted-foreground">
              {renderAppleEmojiText(blurb)}
            </p>
          </Reveal>
        </div>

        <div
          className={`mt-12 grid gap-4 sm:mt-16 sm:gap-6 ${
            images.length >= 4 ? "grid-cols-2 lg:grid-cols-4" : "grid-cols-1 sm:grid-cols-3"
          }`}
        >
          {images.map((n, i) => (
            <Photo
              key={n}
              index={n}
              anim={animCycle[(n + i) % animCycle.length]!}
              delay={i * 0.12}
              drift={i % 2 === 0 ? 16 : 26}
              enhancedHover
              className={i === 1 && images.length === 3 ? "sm:mt-12" : i % 2 === 1 ? "sm:mt-8" : ""}
            />
          ))}
        </div>
      </div>
    </section>
  );
}

/* 4. Message from Shubham -------------------------------------------------- */
function MessageFromShubham() {
  return (
    <section className="relative overflow-hidden bg-sunrise grain px-6 py-28 sm:py-40">
      <Particles emojiCount={5} />
      <div className="relative mx-auto max-w-2xl rounded-[2.5rem] bg-card/80 p-8 shadow-soft backdrop-blur-sm sm:p-14">
        <Reveal>
          <p className="text-[clamp(0.76rem,2.5vw,0.65rem)] uppercase tracking-[0.38em] text-muted-foreground">
            A message for you <Emoji>💌</Emoji>
          </p>
        </Reveal>
        <h2 className="mt-6 font-display text-[clamp(2.2rem,7vw,1.875rem)] leading-snug tracking-tight sm:text-4xl">
          <WordReveal text="Diya, 💖" stagger={0.08} />
        </h2>
        <LineReveal
          className="mt-6 space-y-4 text-[clamp(1.125rem,4vw,1rem)] font-light leading-relaxed text-foreground/85 sm:text-lg"
          lines={[
            "Another year of you — and honestly, the world is nicer for it.",
            "Thank you for the conversations that ran too long, for the patience you never made a big deal about, and for being someone I can be completely myself around.",
            "I hope this year is kind to you: fewer things to worry about, more reasons to laugh, and a whole lot of moments worth photographing.",
            "You deserve every good thing coming your way. Every single one. 🥳",
          ]}
        />
        <Reveal delay={0.3} className="mt-10">
          <div className="flex items-end justify-between gap-4 border-t border-border pt-6">
            <span className="text-[clamp(0.76rem,2.5vw,0.65rem)] uppercase tracking-[0.32em] text-muted-foreground">
              With warmth
            </span>
            <span className="font-script text-[clamp(2.65rem,8vw,2.25rem)] text-sunset sm:text-5xl">{renderAppleEmojiText("Shubham 🫶")}</span>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

/* 5. Date reveal ----------------------------------------------------------- */
function DateReveal() {
  return (
    <section className="relative grid min-h-[80svh] place-items-center overflow-hidden px-6 py-28">
      <Particles emojiCount={5} />
      <div className="relative text-center">
        <Reveal>
          <p className="text-[clamp(0.76rem,2.5vw,0.65rem)] uppercase tracking-[0.4em] text-muted-foreground">
            The day itself <Emoji>🎈</Emoji>
          </p>
        </Reveal>

        <div className="mt-8 flex items-baseline justify-center gap-3 sm:gap-6">
          <motion.span
            className="font-display text-[7rem] leading-none tracking-tight text-sunset sm:text-[12rem]"
            initial={{ opacity: 0, scale: 0.86 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true, margin: "-15% 0px" }}
            transition={{ duration: 1.5, ease: [0.22, 1, 0.36, 1] }}
          >
            10
          </motion.span>
          <div className="text-left">
            <Reveal delay={0.25}>
              <p className="font-display text-[clamp(2.2rem,7vw,1.875rem)] italic tracking-tight sm:text-5xl">th</p>
            </Reveal>
            <Reveal delay={0.35}>
              <p className="font-display text-[clamp(2.2rem,7vw,1.875rem)] tracking-[0.12em] sm:text-5xl">September</p>
            </Reveal>
          </div>
        </div>

        <motion.div
          className="mx-auto mt-10 h-px w-56 origin-left bg-gradient-to-r from-transparent via-gold to-transparent"
          initial={{ scaleX: 0 }}
          whileInView={{ scaleX: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 1.6, ease: "easeInOut" }}
        />
        <Reveal delay={0.4}>
          <p className="mt-8 text-[clamp(1rem,3.5vw,0.875rem)] font-light tracking-wide text-muted-foreground">
            {renderAppleEmojiText("Circled, remembered, and celebrated. 🎂")}
          </p>
        </Reveal>
      </div>

      <div className="mx-auto mt-16 grid w-full max-w-4xl grid-cols-2 gap-4 sm:grid-cols-4 sm:gap-6">
        {[16, 17, 18, 20].map((n, i) => (
          <Photo
            key={n}
            index={n}
            anim={(["blur", "tilt", "left", "right"] as const)[i]!}
            delay={i * 0.14}
            drift={18}
            className={i % 2 === 1 ? "sm:mt-10" : ""}
          />
        ))}
      </div>
    </section>
  );
}

/* 6. This is a gift -------------------------------------------------------- */
function GiftSection() {
  return (
    <section className="relative overflow-hidden bg-ink px-6 py-32 text-cream sm:py-44">
      <Particles emojiCount={5} />
      <div className="relative mx-auto max-w-3xl text-center">
        <Reveal>
          <p className="text-[clamp(0.76rem,2.5vw,0.65rem)] uppercase tracking-[0.42em] text-gold">Your gift <Emoji>🎁</Emoji></p>
        </Reveal>
        <h2 className="mt-8 font-display text-[clamp(3rem,10vw,2.6rem)] leading-[1.08] tracking-tight sm:text-7xl">
          <WordReveal text="I built this entire website" />
          <span className="mt-2 block italic text-gold">
            <WordReveal text="just for you. 💝" delay={0.3} />
          </span>
        </h2>
        <LineReveal
          className="mx-auto mt-10 max-w-xl space-y-3 text-[clamp(1.125rem,4vw,1rem)] font-light leading-relaxed text-cream/75 sm:text-lg"
          lines={[
            "Every section, every photo, every line — written and coded by hand.",
            "No template, no shortcut. Just a few late nights and one very specific person in mind.",
            "Consider this your birthday present: something that exists only because you do.",
          ]}
        />
        <Reveal delay={0.35} className="mt-14">
          <p className="text-[clamp(0.7rem,2.5vw,0.6rem)] uppercase tracking-[0.34em] text-cream/50">Made by</p>
          <motion.p
            className="mt-2 font-script text-[clamp(3.5rem,12vw,3rem)] text-gold sm:text-7xl"
            initial={{ opacity: 0, y: 18, letterSpacing: "0.14em" }}
            whileInView={{ opacity: 1, y: 0, letterSpacing: "0.01em" }}
            viewport={{ once: true }}
            transition={{ duration: 1.8, ease: [0.22, 1, 0.36, 1] }}
          >
            {renderAppleEmojiText("Shubham 🫶")}
          </motion.p>
        </Reveal>
      </div>
    </section>
  );
}

/* 7. Closing --------------------------------------------------------------- */
function Closing() {
  return (
    <section className="relative overflow-hidden bg-sunrise grain px-5 pt-24 pb-20 sm:px-8 sm:pt-32">
      <Particles emojiCount={6} />
      <div className="relative mx-auto max-w-5xl">
        <div className="mx-auto max-w-xl text-center">
          <h2 className="font-display text-[clamp(2.2rem,7vw,1.875rem)] leading-snug tracking-tight sm:text-5xl">
            <WordReveal text="Here's to a year that treats you as well as you treat everyone else. 🥂" />
          </h2>
        </div>

        <div className="mt-14 grid grid-cols-2 gap-4 sm:mt-20 sm:grid-cols-4 sm:gap-6">
          {[19, 1, 12, 7].map((n, i) => (
            <Photo
              key={`${n}-close`}
              index={n}
              anim={(["tilt", "right", "fade-scale", "blur"] as const)[i]!}
              delay={i * 0.12}
              drift={i % 2 ? 24 : 14}
              className={i % 2 ? "sm:mt-10" : ""}
            />
          ))}
        </div>

        <div className="mt-24 text-center sm:mt-32">
          <Reveal>
            <p className="font-display text-[clamp(2.65rem,8vw,2.25rem)] tracking-tight text-ink sm:text-6xl">
              Happy Birthday, <span className="italic text-sunset">Diya</span> <Emoji>🎉</Emoji>
            </p>
          </Reveal>
          <Reveal delay={0.2}>
            <p className="mt-6 text-[clamp(1rem,3.5vw,0.875rem)] font-light tracking-[0.18em] uppercase text-ink/55">
              10 · 09 — from {renderAppleEmojiText("Shubham 🫶")} <Emoji>💌</Emoji>
            </p>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
