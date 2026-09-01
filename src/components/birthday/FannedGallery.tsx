import { useEffect, useRef, type CSSProperties } from "react";

import { renderAppleEmojiText } from "@/components/birthday/Emoji";
import { Reveal, WordReveal } from "@/components/birthday/Reveal";

const CARD_ROTATIONS = [-9, -4, 5, 8, -6, 7, -3, 6, -7, 4] as const;
const CARD_OFFSETS = [-18, 14, -10, 20, -14, 8, -12, 16, -8, 12] as const;

function imageSrc(index: number) {
  return `/images/diya-${String(index).padStart(2, "0")}.jpg`;
}

export function ChapterOneFannedGallery({
  eyebrow,
  title,
  blurb,
  images,
  enabled = true,
}: {
  eyebrow: string;
  title: string;
  blurb: string;
  images: number[];
  enabled?: boolean;
}) {
  const sectionRef = useRef<HTMLElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;

    const onWheel = (e: WheelEvent) => {
      const atStart = track.scrollLeft <= 1;
      const atEnd = track.scrollLeft >= track.scrollWidth - track.clientWidth - 1;
      const delta = Math.abs(e.deltaY) > Math.abs(e.deltaX) ? e.deltaY : e.deltaX;

      if (delta === 0) return;

      const scrollingForward = delta > 0;
      const scrollingBack = delta < 0;

      if ((scrollingForward && !atEnd) || (scrollingBack && !atStart)) {
        e.preventDefault();
        e.stopPropagation();
        track.scrollLeft += delta;
      }
    };

    track.addEventListener("wheel", onWheel, { passive: false });
    return () => track.removeEventListener("wheel", onWheel);
  }, []);

  useEffect(() => {
    if (!enabled) return;

    let cleanup = () => {};
    let cancelled = false;
    let hoverCleanups: (() => void)[] = [];

    (async () => {
      const [{ default: gsap }, { ScrollTrigger }] = await Promise.all([
        import("gsap"),
        import("gsap/ScrollTrigger"),
      ]);
      if (cancelled || !sectionRef.current) return;
      gsap.registerPlugin(ScrollTrigger);

      const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

      const ctx = gsap.context(() => {
        const cards = gsap.utils.toArray<HTMLElement>(".fanned-gallery__card-inner", sectionRef.current!);
        hoverCleanups = [];

        if (reducedMotion) {
          cards.forEach((card, i) => {
            const rotate = CARD_ROTATIONS[i % CARD_ROTATIONS.length]!;
            gsap.set(card, { opacity: 1, y: 0, "--rotate": `${rotate}deg`, "--scale": 1 });
          });
          return;
        }

        gsap.set(cards, { opacity: 0, y: 30, "--rotate": "0deg", "--scale": 1 });

        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top 72%",
            once: true,
          },
        });

        cards.forEach((card, i) => {
          const rotate = CARD_ROTATIONS[i % CARD_ROTATIONS.length]!;
          tl.to(
            card,
            {
              opacity: 1,
              y: 0,
              "--rotate": `${rotate}deg`,
              duration: 0.9,
              ease: [0.22, 1, 0.36, 1],
            },
            i * 0.1,
          );
        });

        if (window.matchMedia("(hover: hover)").matches) {
          cards.forEach((card, i) => {
            const rotate = CARD_ROTATIONS[i % CARD_ROTATIONS.length]!;
            const parent = card.parentElement;
            if (!parent) return;

            const onEnter = () => {
              gsap.to(card, { "--rotate": "0deg", "--scale": 1.05, duration: 0.3, ease: "power2.out" });
            };
            const onLeave = () => {
              gsap.to(card, { "--rotate": `${rotate}deg`, "--scale": 1, duration: 0.3, ease: "power2.out" });
            };

            parent.addEventListener("mouseenter", onEnter);
            parent.addEventListener("mouseleave", onLeave);
            hoverCleanups.push(() => {
              parent.removeEventListener("mouseenter", onEnter);
              parent.removeEventListener("mouseleave", onLeave);
            });
          });
        }

      }, sectionRef);

      cleanup = () => {
        hoverCleanups.forEach((fn) => fn());
        ctx.revert();
      };
    })();

    return () => {
      cancelled = true;
      cleanup();
    };
  }, [enabled]);

  return (
    <section
      ref={sectionRef}
      className="relative flex min-h-svh w-full flex-col justify-center overflow-hidden bg-ink py-12 sm:py-16"
    >
      <div className="relative mx-auto w-full max-w-6xl px-5 sm:px-8">
        <Reveal>
          <p className="text-[clamp(0.76rem,2.5vw,0.65rem)] uppercase tracking-[0.38em] text-gold">{eyebrow}</p>
        </Reveal>
        <h2 className="mt-4 font-display text-[clamp(2.65rem,8vw,2.25rem)] tracking-tight text-cream sm:text-6xl">
          <WordReveal text={title} />
        </h2>
        <Reveal delay={0.12}>
          <p className="mt-4 max-w-xl text-[clamp(1.125rem,4vw,1rem)] font-light leading-relaxed text-cream/70">
            {renderAppleEmojiText(blurb)}
          </p>
        </Reveal>
      </div>

      <div className="fanned-gallery__wrap mt-8 sm:mt-10">
        <div
          ref={trackRef}
          className="fanned-gallery__track"
          aria-label="Chapter one photo gallery"
        >
          <div className="fanned-gallery__spacer" aria-hidden="true" />
          {images.map((index, i) => (
            <article
              key={index}
              className="fanned-gallery__card shrink-0"
              style={{
                zIndex: images.length - i,
                marginTop: `${CARD_OFFSETS[i % CARD_OFFSETS.length]}px`,
              }}
            >
              <div
                className="fanned-gallery__card-inner"
                style={{ "--rotate": `${CARD_ROTATIONS[i % CARD_ROTATIONS.length]}deg` } as CSSProperties}
              >
                <img
                  src={imageSrc(index)}
                  alt={`A photo of Diya, number ${index}`}
                  loading={i < 4 ? "eager" : "lazy"}
                  fetchPriority={i < 4 ? "high" : "auto"}
                  decoding="async"
                  draggable={false}
                  className="fanned-gallery__img"
                />
              </div>
            </article>
          ))}
          <div className="fanned-gallery__spacer" aria-hidden="true" />
        </div>
        <p className="fanned-gallery__hint mt-4 text-center text-[0.7rem] uppercase tracking-[0.28em] text-cream/40">
          Swipe to browse
        </p>
      </div>
    </section>
  );
}
