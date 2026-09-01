import { useEffect } from "react";

// Global reference to lenis instance for other components to access
export let lenisInstance: any = null;

/** Lenis smooth scroll, wired to GSAP ScrollTrigger. Disabled for reduced-motion users. */
export function useSmoothScroll(enabled = true) {
  useEffect(() => {
    if (!enabled) return;

    window.scrollTo(0, 0);

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    let cleanup = () => {};
    let cancelled = false;

    (async () => {
      const [{ default: Lenis }, { default: gsap }, { ScrollTrigger }] = await Promise.all([
        import("lenis"),
        import("gsap"),
        import("gsap/ScrollTrigger"),
      ]);
      if (cancelled) return;
      gsap.registerPlugin(ScrollTrigger);

      window.scrollTo(0, 0);

      const lenis = new Lenis({ duration: 1.15, smoothWheel: true });
      lenisInstance = lenis;
      lenis.scrollTo(0, { immediate: true });

      ScrollTrigger.scrollerProxy(document.documentElement, {
        scrollTop(value) {
          if (arguments.length) {
            lenis.scrollTo(value, { immediate: true });
          }
          return lenis.scroll;
        },
        getBoundingClientRect() {
          return {
            top: 0,
            left: 0,
            width: window.innerWidth,
            height: window.innerHeight,
          };
        },
      });

      let scrollRaf = 0;
      const onScroll = () => {
        if (scrollRaf) return;
        scrollRaf = requestAnimationFrame(() => {
          ScrollTrigger.update();
          scrollRaf = 0;
        });
      };

      const onRefresh = () => lenis.resize();
      ScrollTrigger.addEventListener("refresh", onRefresh);
      lenis.on("scroll", onScroll);

      const raf = (time: number) => lenis.raf(time * 1000);
      gsap.ticker.add(raf);

      requestAnimationFrame(() => {
        ScrollTrigger.refresh();
      });

      cleanup = () => {
        ScrollTrigger.removeEventListener("refresh", onRefresh);
        gsap.ticker.remove(raf);
        lenis.destroy();
        lenisInstance = null;
      };
    })();

    return () => {
      cancelled = true;
      cleanup();
    };
  }, [enabled]);
}
