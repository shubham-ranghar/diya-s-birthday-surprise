import { useEffect, useRef } from "react";
import gsap from "gsap";

import { Particles } from "@/components/birthday/Particles";
import { Emoji } from "@/components/birthday/Emoji";

const SUNSET = "oklch(76.2% 0.132 45)";
const SUNSET_LIGHT = "oklch(88% 0.06 55)";

export function Hero({
  ready,
  onEntranceComplete,
}: {
  ready: boolean;
  onEntranceComplete?: () => void;
}) {
  const sectionRef = useRef<HTMLElement>(null);
  const bgLayerRef = useRef<HTMLDivElement>(null);
  const fadeOverlayRef = useRef<HTMLDivElement>(null);
  const eyebrowRef = useRef<HTMLParagraphElement>(null);
  const happyRef = useRef<HTMLSpanElement>(null);
  const birthdayRef = useRef<HTMLSpanElement>(null);
  const diyaWrapRef = useRef<HTMLSpanElement>(null);
  const diyaRef = useRef<HTMLSpanElement>(null);
  const dividerRef = useRef<HTMLDivElement>(null);
  const dateRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!ready) return;

    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    const ctx = gsap.context(() => {
      if (reducedMotion) {
        gsap.set(fadeOverlayRef.current, { opacity: 0 });
        gsap.set(
          [
            eyebrowRef.current,
            happyRef.current,
            birthdayRef.current,
            diyaRef.current,
            dividerRef.current,
            dateRef.current,
          ],
          { opacity: 1, y: 0, scale: 1, scaleX: 1, color: SUNSET, clearProps: "letterSpacing" },
        );
        onEntranceComplete?.();
        return;
      }

      gsap.set(eyebrowRef.current, { opacity: 0, letterSpacing: "0.38em" });
      gsap.set([happyRef.current, birthdayRef.current], { opacity: 0, y: 30 });
      gsap.set(diyaRef.current, { opacity: 0, scale: 0.9, color: SUNSET_LIGHT });
      gsap.set(dividerRef.current, { scaleX: 0, transformOrigin: "center center" });
      gsap.set(dateRef.current, { opacity: 0, y: 8 });
      gsap.set(fadeOverlayRef.current, { opacity: 1 });

      gsap
        .timeline({
          defaults: { ease: "power3.out" },
          onComplete: onEntranceComplete,
        })
        .fromTo(fadeOverlayRef.current, { opacity: 1 }, { opacity: 0, duration: 0.4 })
        .fromTo(
          eyebrowRef.current,
          { opacity: 0, letterSpacing: "0.38em" },
          { opacity: 1, letterSpacing: "0.25em", duration: 0.8 },
          0.3,
        )
        .fromTo(happyRef.current, { y: 30, opacity: 0 }, { y: 0, opacity: 1, duration: 0.7 }, 0.65)
        .fromTo(birthdayRef.current, { y: 30, opacity: 0 }, { y: 0, opacity: 1, duration: 0.7 }, 0.85)
        .fromTo(
          diyaRef.current,
          { scale: 0.9, opacity: 0, color: SUNSET_LIGHT },
          { scale: 1, opacity: 1, color: SUNSET, duration: 0.9 },
          1.05,
        )
        .fromTo(dividerRef.current, { scaleX: 0 }, { scaleX: 1, duration: 0.55 }, 1.95)
        .fromTo(dateRef.current, { opacity: 0, y: 8 }, { opacity: 1, y: 0, duration: 0.5 }, 2.7);
    }, sectionRef);

    return () => ctx.revert();
  }, [ready, onEntranceComplete]);

  useEffect(() => {
    if (!ready) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const el = bgLayerRef.current;
    if (!el) return;

    const setX = gsap.quickSetter(el, "x", "px");
    const setY = gsap.quickSetter(el, "y", "px");
    let targetX = 0;
    let targetY = 0;
    let currentX = 0;
    let currentY = 0;
    let rafId = 0;

    const tick = () => {
      currentX += (targetX - currentX) * 0.12;
      currentY += (targetY - currentY) * 0.12;
      setX(currentX);
      setY(currentY);
      if (Math.abs(targetX - currentX) > 0.05 || Math.abs(targetY - currentY) > 0.05) {
        rafId = requestAnimationFrame(tick);
      } else {
        rafId = 0;
      }
    };

    const onMove = (e: MouseEvent) => {
      targetX = (e.clientX / window.innerWidth - 0.5) * 14;
      targetY = (e.clientY / window.innerHeight - 0.5) * 10;
      if (!rafId) rafId = requestAnimationFrame(tick);
    };

    window.addEventListener("mousemove", onMove, { passive: true });
    return () => {
      window.removeEventListener("mousemove", onMove);
      if (rafId) cancelAnimationFrame(rafId);
    };
  }, [ready]);

  return (
    <section
      ref={sectionRef}
      className="relative flex min-h-svh flex-col items-center justify-center overflow-hidden bg-sunrise grain px-6 py-8 sm:py-10"
    >
      <div
        ref={fadeOverlayRef}
        className="pointer-events-none absolute inset-0 z-30 bg-sunrise opacity-100"
        aria-hidden="true"
      />

      <div ref={bgLayerRef} className="absolute -inset-10 will-change-transform">
        <div className="hero-glow-pulse absolute inset-0 bg-glow" />
        <div
          className="hero-orb-drift-a absolute top-[18%] left-[12%] h-80 w-80 rounded-full bg-peach/25 blur-[100px] sm:h-96 sm:w-96"
          aria-hidden="true"
        />
        <div
          className="hero-orb-drift-b absolute right-[10%] bottom-[20%] h-72 w-72 rounded-full bg-sunset/12 blur-[90px] sm:h-80 sm:w-80"
          aria-hidden="true"
        />
      </div>

      <Particles emojiCount={6} />

      <div className="relative z-10 w-full max-w-4xl text-center">
        <p
          ref={eyebrowRef}
          className="font-label text-[clamp(0.95rem,2.8vw,0.8125rem)] font-medium uppercase tracking-[0.25em] text-ink/65 opacity-0 sm:text-[0.9375rem] md:text-base"
        >
          A surprise from Shubham <Emoji>💌</Emoji>
        </p>

        <h1 className="mt-4 font-display tracking-tight text-ink sm:mt-5">
          <span className="block overflow-hidden leading-[0.94]">
            <span
              ref={happyRef}
              className="block text-[clamp(4rem,10vw,9rem)] opacity-0"
            >
              Happy
            </span>
          </span>
          <span className="-mt-1 block overflow-hidden leading-[0.9] sm:-mt-2">
            <span
              ref={birthdayRef}
              className="block text-[clamp(4rem,10vw,9rem)] opacity-0"
            >
              Birthday,
            </span>
          </span>
          <span className="relative -mt-2 block overflow-hidden pb-0.5 sm:-mt-3">
            <div
              className="pointer-events-none absolute top-1/2 left-1/2 -z-10 h-52 w-[min(88vw,28rem)] -translate-x-1/2 -translate-y-1/2 rounded-full bg-gradient-to-br from-peach/15 via-sunset/12 to-gold/10 blur-[88px] sm:h-64 sm:w-[32rem]"
              aria-hidden="true"
            />
            <span ref={diyaWrapRef} className="hero-breathe inline-block">
              <span
                ref={diyaRef}
                className="block text-[clamp(5rem,13vw,11rem)] leading-[0.88] italic text-sunset opacity-0"
              >
                Diya
              </span>
            </span>
          </span>
        </h1>

        <div ref={dividerRef} className="mx-auto mt-6 h-px w-28 origin-center scale-x-0 bg-ink/25 sm:mt-7" />

        <div
          ref={dateRef}
          className="font-label mt-3 text-[clamp(1rem,3.2vw,0.875rem)] font-medium uppercase tracking-[0.2em] text-ink/60 opacity-0 sm:text-[1rem] md:text-[1.0625rem]"
        >
          10th September <Emoji>🎂</Emoji>
        </div>
      </div>
    </section>
  );
}
