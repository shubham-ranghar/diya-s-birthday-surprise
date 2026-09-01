import { useEffect, useRef, type CSSProperties } from "react";
import { getScrollScroller, lenisInstance, scheduleScrollTriggerRefresh, waitForScrollSystem } from "./useSmoothScroll";
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
      await waitForScrollSystem();
      if (cancelled || !section.current || !image.current || !text.current) return;

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

      const scroller = getScrollScroller();

      const ctx = gsap.context(() => {
        gsap.set(image.current, { scale: 1.15, "--blur-amount": "12px" });
        gsap.set(text.current, { opacity: 0 });

        const scrollTriggerConfig: gsap.plugins.ScrollTriggerInstanceVars = {
          trigger: section.current,
          start: "top top",
          end: "+=120%",
          pin: true,
          pinSpacing: true,
          scrub: true,
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
        };

        if (scroller) {
          scrollTriggerConfig.scroller = scroller;
        }

        const tl = gsap.timeline({ scrollTrigger: scrollTriggerConfig });

        tl.fromTo(
          image.current,
          { scale: 1.15, "--blur-amount": "12px" },
          { scale: 1, "--blur-amount": "0px", ease: "none" },
        ).fromTo(
          text.current,
          { opacity: 0 },
          { opacity: 1, ease: "power2.out" },
          0.15,
        );
      }, section);

      cleanup = () => ctx.revert();

      requestAnimationFrame(() => {
        requestAnimationFrame(() => scheduleScrollTriggerRefresh());
      });
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
        fetchPriority="high"
        decoding="async"
        style={{ "--blur-amount": "12px" } as CSSProperties}
        className="pinned-photo__img absolute inset-0 h-full w-full scale-[1.15] object-cover object-[50%_30%] will-change-transform"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-[#fdf9ef]/30 via-[#fdf9ef]/5 to-transparent" />
      <div
        ref={text}
        className="absolute inset-x-0 bottom-[20%] px-6 text-center opacity-0"
      >
        <h3 className="font-display text-[clamp(2rem,6vw,2.25rem)] tracking-wide text-cream sm:text-6xl">{renderAppleEmojiText(title)}</h3>
        {subtitle && (
          <p className="mx-auto mt-2 max-w-md text-[clamp(0.875rem,2.5vw,0.875rem)] font-light text-cream/85 sm:mt-3 sm:text-base">
            {subtitle.includes("🖼️") ? subtitle.replace("🖼️", "") + " " : subtitle}
            {subtitle.includes("🖼️") && <Emoji>🖼️</Emoji>}
          </p>
        )}
      </div>
    </section>
  );
}
