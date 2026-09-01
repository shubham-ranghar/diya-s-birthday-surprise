import { useEffect } from "react";

// Global reference to lenis instance for other components to access
export let lenisInstance: any = null;

const SCROLLER = typeof document !== "undefined" ? document.documentElement : null;

let refreshRaf = 0;
let scrollSystemReady = false;
let scrollSystemWaiters: (() => void)[] = [];

function notifyScrollSystemReady() {
  scrollSystemReady = true;
  scrollSystemWaiters.forEach((resolve) => resolve());
  scrollSystemWaiters = [];
}

/** Resolves once Lenis + scrollerProxy are wired (or immediately if reduced-motion). */
export function waitForScrollSystem(): Promise<void> {
  if (scrollSystemReady || window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
    return Promise.resolve();
  }
  if (lenisInstance) {
    scrollSystemReady = true;
    return Promise.resolve();
  }
  return new Promise((resolve) => {
    scrollSystemWaiters.push(resolve);
  });
}

/** ScrollTrigger scroller element — must match scrollerProxy target in PinnedPhoto. */
export function getScrollScroller() {
  return lenisInstance && SCROLLER ? SCROLLER : undefined;
}

/** Debounced ScrollTrigger refresh — skips while a pin is actively engaged. */
export function scheduleScrollTriggerRefresh() {
  if (refreshRaf) cancelAnimationFrame(refreshRaf);
  refreshRaf = requestAnimationFrame(async () => {
    const { ScrollTrigger } = await import("gsap/ScrollTrigger");
    const pinActive = ScrollTrigger.getAll().some((st) => st.pin && st.progress > 0 && st.progress < 1);
    if (!pinActive) {
      ScrollTrigger.refresh(false);
    }
    refreshRaf = 0;
  });
}

/** Lenis smooth scroll, wired to GSAP ScrollTrigger. Disabled for reduced-motion users. */
export function useSmoothScroll(enabled = true) {
  useEffect(() => {
    if (!enabled) return;

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      notifyScrollSystemReady();
      return;
    }

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

      const lenis = new Lenis({
        duration: 1.15,
        smoothWheel: true,
        autoRaf: false,
      });
      lenisInstance = lenis;

      ScrollTrigger.scrollerProxy(SCROLLER!, {
        scrollTop(value) {
          if (arguments.length && value !== undefined) {
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
        pinType: SCROLLER!.style.transform ? "transform" : "fixed",
      });

      ScrollTrigger.defaults({ scroller: SCROLLER! });

      lenis.on("scroll", ScrollTrigger.update);

      const onRefresh = () => lenis.resize();
      ScrollTrigger.addEventListener("refresh", onRefresh);

      const raf = (time: number) => lenis.raf(time * 1000);
      gsap.ticker.add(raf);
      gsap.ticker.lagSmoothing(0);

      notifyScrollSystemReady();

      requestAnimationFrame(() => {
        ScrollTrigger.refresh(true);
      });

      cleanup = () => {
        ScrollTrigger.removeEventListener("refresh", onRefresh);
        gsap.ticker.remove(raf);
        lenis.destroy();
        lenisInstance = null;
        scrollSystemReady = false;
        // @ts-ignore - clearing scroller defaults
        ScrollTrigger.defaults({ scroller: undefined });
        ScrollTrigger.clearScrollMemory?.();
      };
    })();

    return () => {
      cancelled = true;
      cleanup();
    };
  }, [enabled]);
}
