import { useEffect, useRef, type CSSProperties } from "react";
import { lenisInstance } from "./useSmoothScroll";
import { Particles } from "./Particles";
import { Emoji, renderAppleEmojiText } from "./Emoji";

/**
 * A pinned, scroll-scrubbed single-image reveal (GSAP ScrollTrigger).
 * The image slowly scales down and the caption rises while the section stays pinned.
 */
export function PinnedPhoto({
  index,
  title,
  subtitle,
  enabled = true,
}: {
  index: number;
  title: string;
  subtitle?: string;
  enabled?: boolean;
}) {
  const section = useRef<HTMLDivElement>(null);
  const image = useRef<HTMLImageElement>(null);
  const text = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!enabled) return;

    let cleanup = () => {};
    let cancelled = false;

    (async () => {
      const [{ default: gsap }, { ScrollTrigger }] = await Promise.all([
        import("gsap"),
        import("gsap/ScrollTrigger"),
      ]);
      if (cancelled || !section.current || !image.current || !text.current) return;
      gsap.registerPlugin(ScrollTrigger);

      await new Promise<void>((resolve) => {
        if (image.current!.complete) {
          resolve();
          return;
        }
        image.current!.addEventListener("load", () => resolve(), { once: true });
        image.current!.addEventListener("error", () => resolve(), { once: true });
      });
      if (cancelled || !section.current) return;

      const ctx = gsap.context(() => {
        gsap.set(image.current, { scale: 1.15, "--blur-amount": "12px" });
        gsap.set(text.current, { yPercent: 40, opacity: 0 });

        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: section.current,
            start: "top top",
            end: "+=120%",
            pin: true,
            scrub: 1,
            anticipatePin: 1,
            invalidateOnRefresh: true,
            onEnter: () => {
              if (lenisInstance) lenisInstance.duration = 1.5;
            },
            onLeave: () => {
              if (lenisInstance) lenisInstance.duration = 1.15;
            },
            onEnterBack: () => {
              if (lenisInstance) lenisInstance.duration = 1.5;
            },
            onLeaveBack: () => {
              if (lenisInstance) lenisInstance.duration = 1.15;
            },
          },
        });
        tl.fromTo(image.current, { scale: 1.15, "--blur-amount": "12px" }, { scale: 1, "--blur-amount": "0px", ease: "none" }).fromTo(
          text.current,
          { yPercent: 40, opacity: 0 },
          { yPercent: 0, opacity: 1, ease: "power2.out" },
          0.15,
        );

        requestAnimationFrame(() => ScrollTrigger.refresh());
      }, section);

      cleanup = () => ctx.revert();
    })();

    return () => {
      cancelled = true;
      cleanup();
    };
  }, [enabled]);

  const src = `/images/diya-${String(index).padStart(2, "0")}.jpg`;

  return (
    <section ref={section} className="relative h-svh w-full overflow-hidden bg-ink/5">
      <Particles emojiCount={4} />
      <img
        ref={image}
        src={src}
        alt={title}
        loading="eager"
        decoding="async"
        style={{ "--blur-amount": "12px" } as CSSProperties}
        className="pinned-photo__img absolute inset-0 h-full w-full scale-[1.15] object-cover object-[50%_30%] will-change-transform"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-ink/55 via-ink/10 to-transparent" />
      <div
        ref={text}
        className="absolute inset-x-0 bottom-0 translate-y-[40%] px-6 pb-16 text-center opacity-0 sm:pb-24"
      >
        <h3 className="font-display text-[clamp(2.65rem,8vw,2.25rem)] tracking-wide text-cream sm:text-6xl">{renderAppleEmojiText(title)}</h3>
        {subtitle && (
          <p className="mx-auto mt-3 max-w-md text-[clamp(1rem,3.5vw,0.875rem)] font-light text-cream/85 sm:text-base">
            {renderAppleEmojiText(subtitle)}
          </p>
        )}
      </div>
    </section>
  );
}
