import { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { SITE_IDENTITY } from '../data/projects';
import {
  getPrefersReducedMotion,
  lockScrollForPreloader,
  unlockScrollAfterPreloader,
} from '../lib/scrollAndMotion';

const SESSION_KEY = 'alyan_portfolio_preloader_seen';
let hasPlayedInCurrentRuntime = false;

export function hasSeenPreloaderInSession(): boolean {
  // Always play on a fresh page load/reload in the current runtime,
  // and skip on internal SPA navigation (/ -> /work -> /)
  return hasPlayedInCurrentRuntime;
}

export function markPreloaderSeenInSession(): void {
  hasPlayedInCurrentRuntime = true;
  try {
    window.sessionStorage.setItem(SESSION_KEY, '1');
  } catch {
    // Ignore storage errors
  }
}

interface PreloaderProps {
  onComplete: () => void;
}

export function Preloader({ onComplete }: PreloaderProps) {
  const reducedMotion = getPrefersReducedMotion();
  const [progress, setProgress] = useState<number>(() =>
    reducedMotion ? 100 : 0
  );
  const [isExiting, setIsExiting] = useState<boolean>(false);

  useEffect(() => {
    lockScrollForPreloader();

    let rafId: number | null = null;
    let holdTimer: number | null = null;
    let exitTimer: number | null = null;
    let cancelled = false;

    if (reducedMotion) {
      holdTimer = window.setTimeout(() => {
        if (cancelled) return;
        setIsExiting(true);
        exitTimer = window.setTimeout(() => {
          if (cancelled) return;
          markPreloaderSeenInSession();
          unlockScrollAfterPreloader();
          onComplete();
        }, 400);
      }, 100);

      return () => {
        cancelled = true;
        if (holdTimer !== null) window.clearTimeout(holdTimer);
        if (exitTimer !== null) window.clearTimeout(exitTimer);
        unlockScrollAfterPreloader();
      };
    }

    const startTime = performance.now();
    const MIN_DURATION = 1250; // ~1.25s minimum floor
    const MAX_DURATION = 2400; // capped under 2.5s maximum

    let fontsLoaded = false;
    if (typeof document !== 'undefined' && document.fonts?.ready) {
      document.fonts.ready
        .then(() => {
          fontsLoaded = true;
        })
        .catch(() => {
          fontsLoaded = true;
        });
    } else {
      fontsLoaded = true;
    }

    const tick = (now: number) => {
      if (cancelled) return;
      const elapsed = now - startTime;
      const minRatio = Math.min(1, elapsed / MIN_DURATION);
      const maxTimedOut = elapsed >= MAX_DURATION;
      const assetsReady = fontsLoaded || maxTimedOut;

      const easedTime = 1 - Math.pow(1 - minRatio, 2.4);

      let nextValue: number;
      if (assetsReady && minRatio >= 1) {
        nextValue = 100;
      } else if (!assetsReady && minRatio >= 1) {
        const extraRatio = Math.min(
          1,
          (elapsed - MIN_DURATION) / (MAX_DURATION - MIN_DURATION)
        );
        nextValue = Math.min(99, Math.floor(90 + extraRatio * 9));
      } else {
        const cap = assetsReady ? 100 : 90;
        nextValue = Math.min(cap, Math.floor(easedTime * cap));
      }

      setProgress((prev) => Math.max(prev, nextValue));

      if (nextValue >= 100) {
        holdTimer = window.setTimeout(() => {
          if (cancelled) return;
          setIsExiting(true);
          exitTimer = window.setTimeout(() => {
            if (cancelled) return;
            markPreloaderSeenInSession();
            unlockScrollAfterPreloader();
            onComplete();
          }, 550);
        }, 180);
        return;
      }

      rafId = window.requestAnimationFrame(tick);
    };

    rafId = window.requestAnimationFrame(tick);

    return () => {
      cancelled = true;
      if (rafId !== null) window.cancelAnimationFrame(rafId);
      if (holdTimer !== null) window.clearTimeout(holdTimer);
      if (exitTimer !== null) window.clearTimeout(exitTimer);
      unlockScrollAfterPreloader();
    };
  }, [onComplete, reducedMotion]);

  const overlay = (
    <div
      id="site-preloader"
      aria-label="Loading portfolio"
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        width: '100vw',
        height: '100dvh',
        zIndex: 9999,
        backgroundColor: 'var(--bg)',
        color: 'var(--text)',
        transition: reducedMotion
          ? 'opacity 400ms ease'
          : 'transform 560ms cubic-bezier(0.76, 0, 0.24, 1), opacity 560ms cubic-bezier(0.76, 0, 0.24, 1)',
        transform:
          !reducedMotion && isExiting ? 'translateY(-100%)' : 'translateY(0%)',
        opacity: isExiting ? 0 : 1,
      }}
      className="fixed inset-0 z-[9999] bg-[var(--bg)] text-[var(--text)] flex flex-col justify-end pointer-events-auto select-none hairline-b"
    >
      <div className="layout-container pb-8 sm:pb-12 flex items-end justify-between gap-6">
        <span className="font-archivo-wide font-extrabold uppercase tracking-[-0.025em] text-[var(--text)] text-[clamp(2.5rem,8vw,6rem)] leading-[0.85]">
          {SITE_IDENTITY.heroName}
        </span>

        <span className="font-geist-mono text-[clamp(1.5rem,4vw,3rem)] leading-[0.85] text-[var(--text)] tabular-nums">
          {progress}%
        </span>
      </div>
    </div>
  );

  if (typeof document !== 'undefined' && document.body) {
    return createPortal(overlay, document.body);
  }

  return overlay;
}
