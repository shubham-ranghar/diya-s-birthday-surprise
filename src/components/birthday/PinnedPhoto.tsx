import { useEffect, useRef } from "react";
import { lenisInstance } from "./useSmoothScroll";
import { Particles } from "./Particles";

/**
 * A pinned, scroll-scrubbed single-image reveal (GSAP ScrollTrigger).
 * The image slowly scales down and the caption rises while the section stays pinned.
 */
export function PinnedPhoto({
  index,
  title,
  subtitle,
}: {
  index: number;
  title: string;
  subtitle?: string;
}) {
  const section = useRef<HTMLDivElement>(null);
  const image = useRef<HTMLImageElement>(null);
  const text = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let cleanup = () => {};
    let cancelled = false;

    (async () => {
      const [{ default: gsap }, { ScrollTrigger }] = await Promise.all([
        import("gsap"),
        import("gsap/ScrollTrigger"),
      ]);
      if (cancelled || !section.current) return;
      gsap.registerPlugin(ScrollTrigger);

      const ctx = gsap.context(() => {
        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: section.current,
            start: "top top",
            end: "+=120%",
            pin: true,
            scrub: 1,
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
        tl.fromTo(image.current, { scale: 1.15 }, { scale: 1, ease: "none" }).fromTo(
          text.current,
          { yPercent: 40, opacity: 0 },
          { yPercent: 0, opacity: 1, ease: "power2.out" },
          0.15,
        );
      }, section);

      cleanup = () => ctx.revert();
    })();

    return () => {
      cancelled = true;
      cleanup();
    };
  }, []);

  const src = `/images/diya-${String(index).padStart(2, "0")}.jpg`;

  return (
    <section ref={section} className="relative h-svh w-full overflow-hidden bg-ink/5">
      <Particles emojiCount={4} />
      <img
        ref={image}
        src={src}
        alt={title}
        loading="lazy"
        decoding="async"
        className="absolute inset-0 h-full w-full object-cover object-[50%_30%] will-change-transform"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-ink/55 via-ink/10 to-transparent" />
      <div
        ref={text}
        className="absolute inset-x-0 bottom-0 px-6 pb-16 text-center sm:pb-24"
      >
        <h3 className="font-display text-4xl tracking-wide text-cream sm:text-6xl">{title}</h3>
        {subtitle && (
          <p className="mx-auto mt-3 max-w-md text-sm font-light text-cream/85 sm:text-base">
            {subtitle}
          </p>
        )}
      </div>
    </section>
  );
}
