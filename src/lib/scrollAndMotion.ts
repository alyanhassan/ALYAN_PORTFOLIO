import { useEffect, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';
import Lenis from 'lenis';

gsap.registerPlugin(ScrollTrigger, useGSAP);

export const REVEAL_EASE: [number, number, number, number] = [0.22, 1, 0.36, 1];
export const REVEAL_DURATION = 0.7;
export const REVEAL_VIEWPORT = { once: true, margin: '-10% 0px' } as const;

let lenisInstance: Lenis | null = null;
let isScrollLocked = false;

export function getPrefersReducedMotion(): boolean {
  if (typeof window === 'undefined' || !window.matchMedia) {
    return false;
  }
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

export function useReducedMotionPreference(): boolean {
  const [reducedMotion, setReducedMotion] = useState<boolean>(() =>
    getPrefersReducedMotion()
  );

  useEffect(() => {
    if (typeof window === 'undefined' || !window.matchMedia) return;
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    const handleChange = () => setReducedMotion(mq.matches);
    mq.addEventListener?.('change', handleChange);
    return () => mq.removeEventListener?.('change', handleChange);
  }, []);

  return reducedMotion;
}

export function useIsDesktop(): boolean {
  const [isDesktop, setIsDesktop] = useState<boolean>(() => {
    if (typeof window === 'undefined' || !window.matchMedia) return true;
    return window.matchMedia('(min-width: 768px)').matches;
  });

  useEffect(() => {
    if (typeof window === 'undefined' || !window.matchMedia) return;
    const mq = window.matchMedia('(min-width: 768px)');
    const handleChange = () => {
      setIsDesktop(mq.matches);
      requestAnimationFrame(() => {
        ScrollTrigger.refresh();
      });
    };
    mq.addEventListener?.('change', handleChange);
    return () => mq.removeEventListener?.('change', handleChange);
  }, []);

  return isDesktop;
}

export function initLenisSmoothScroll(): () => void {
  let resizeTimer: number | null = null;
  const handleResize = () => {
    if (resizeTimer !== null) {
      window.clearTimeout(resizeTimer);
    }
    resizeTimer = window.setTimeout(() => {
      ScrollTrigger.refresh();
    }, 150);
  };

  const handleWindowLoad = () => {
    ScrollTrigger.refresh();
  };

  window.addEventListener('resize', handleResize);
  window.addEventListener('load', handleWindowLoad);

  if (typeof document !== 'undefined' && document.fonts?.ready) {
    document.fonts.ready
      .then(() => {
        ScrollTrigger.refresh();
      })
      .catch(() => {});
  }

  if (getPrefersReducedMotion()) {
    lenisInstance = null;
    return () => {
      if (resizeTimer !== null) window.clearTimeout(resizeTimer);
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('load', handleWindowLoad);
    };
  }

  const lenis = new Lenis({
    autoRaf: false,
  });
  lenisInstance = lenis;

  if (isScrollLocked) {
    lenis.stop();
  }

  lenis.on('scroll', ScrollTrigger.update);

  const tickerCallback = (time: number) => {
    lenis.raf(time * 1000);
  };

  gsap.ticker.add(tickerCallback);
  gsap.ticker.lagSmoothing(0);

  return () => {
    if (resizeTimer !== null) window.clearTimeout(resizeTimer);
    window.removeEventListener('resize', handleResize);
    window.removeEventListener('load', handleWindowLoad);
    gsap.ticker.remove(tickerCallback);
    lenis.off('scroll', ScrollTrigger.update);
    lenis.destroy();
    if (lenisInstance === lenis) {
      lenisInstance = null;
    }
  };
}

export function lockScrollForPreloader(): void {
  isScrollLocked = true;
  if (typeof document !== 'undefined') {
    document.documentElement.style.overflow = 'hidden';
    document.body.style.overflow = 'hidden';
  }
  if (lenisInstance) {
    lenisInstance.stop();
  }
}

export function unlockScrollAfterPreloader(): void {
  isScrollLocked = false;
  if (typeof document !== 'undefined') {
    document.documentElement.style.overflow = '';
    document.body.style.overflow = '';
  }
  if (lenisInstance) {
    lenisInstance.start();
  }
  requestAnimationFrame(() => {
    ScrollTrigger.refresh();
    window.setTimeout(() => {
      ScrollTrigger.refresh();
    }, 120);
  });
}

export function smoothScrollToTop(): void {
  if (getPrefersReducedMotion()) {
    window.scrollTo({ top: 0, behavior: 'auto' });
    return;
  }

  if (lenisInstance) {
    lenisInstance.scrollTo(0);
  } else {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }
}

export function immediateScrollToTop(): void {
  if (lenisInstance) {
    lenisInstance.scrollTo(0, { immediate: true });
  }
  window.scrollTo({ top: 0, behavior: 'auto' });
  requestAnimationFrame(() => {
    ScrollTrigger.refresh();
  });
}

export function smoothScrollToHash(hash: string): void {
  const cleanId = hash.replace(/^#/, '');
  const el = document.getElementById(cleanId);
  if (!el) return;

  if (getPrefersReducedMotion()) {
    el.scrollIntoView({ behavior: 'auto' });
    return;
  }

  if (lenisInstance) {
    lenisInstance.scrollTo(el);
  } else {
    el.scrollIntoView({ behavior: 'smooth' });
  }
}
