import { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';
import { motion } from 'motion/react';
import { SITE_IDENTITY } from '../data/projects';
import { useKarachiTime } from '../hooks/useKarachiTime';
import {
  REVEAL_DURATION,
  REVEAL_EASE,
  useReducedMotionPreference,
} from '../lib/scrollAndMotion';

gsap.registerPlugin(ScrollTrigger, useGSAP);

interface HeroProps {
  isReady?: boolean;
}

export function Hero({ isReady = true }: HeroProps) {
  const karachiTime = useKarachiTime();
  const reducedMotion = useReducedMotionPreference();
  const heroSectionRef = useRef<HTMLElement>(null);
  const heroParallaxRef = useRef<HTMLDivElement>(null);
  const textContainerRef = useRef<HTMLDivElement>(null);
  const headingRef = useRef<HTMLHeadingElement>(null);
  const textSpanRef = useRef<HTMLSpanElement>(null);
  const [fittedFontSize, setFittedFontSize] = useState<number | null>(null);

  useEffect(() => {
    const fitHeading = () => {
      const container = textContainerRef.current;
      const heading = headingRef.current;
      const textSpan = textSpanRef.current;
      if (!container || !heading || !textSpan) return;

      const containerWidth = container.getBoundingClientRect().width;
      if (containerWidth <= 0) return;

      // Leave 4px of safety so right-edge glyph sidebearings are never clipped
      const targetWidth = Math.max(10, containerWidth - 4);
      const REF_SIZE = 100;

      heading.style.fontSize = `${REF_SIZE}px`;
      const measuredAtRef = Math.max(
        textSpan.getBoundingClientRect().width,
        textSpan.scrollWidth
      );

      if (measuredAtRef > 0) {
        let computedSize = (targetWidth / measuredAtRef) * REF_SIZE;
        heading.style.fontSize = `${computedSize}px`;

        // Verify actual rendered width at the target font size and adjust if needed
        const actualRenderedWidth = Math.max(
          textSpan.getBoundingClientRect().width,
          textSpan.scrollWidth
        );
        if (actualRenderedWidth > targetWidth && actualRenderedWidth > 0) {
          computedSize = computedSize * (targetWidth / actualRenderedWidth) - 0.5;
          heading.style.fontSize = `${computedSize}px`;
        }

        setFittedFontSize(computedSize);
      }
    };

    let rafId: number | null = null;
    let lastObservedWidth = -1;

    const scheduleFit = () => {
      if (rafId !== null) cancelAnimationFrame(rafId);
      rafId = requestAnimationFrame(() => {
        rafId = null;
        fitHeading();
      });
    };

    fitHeading();

    if (document.fonts) {
      if (document.fonts.ready) {
        document.fonts.ready.then(() => {
          scheduleFit();
        });
      }
      document.fonts.addEventListener?.('loadingdone', scheduleFit);
    }

    const observer = new ResizeObserver((entries) => {
      const entry = entries[0];
      if (!entry) return;
      const width = Math.round(entry.contentRect.width);
      if (width !== lastObservedWidth) {
        lastObservedWidth = width;
        scheduleFit();
      }
    });

    if (textContainerRef.current) {
      observer.observe(textContainerRef.current);
    }

    const mediaQuery = window.matchMedia('(min-width: 640px)');
    const handleMediaChange = () => scheduleFit();
    mediaQuery.addEventListener?.('change', handleMediaChange);

    window.addEventListener('resize', scheduleFit);
    return () => {
      if (rafId !== null) cancelAnimationFrame(rafId);
      observer.disconnect();
      window.removeEventListener('resize', scheduleFit);
      mediaQuery.removeEventListener?.('change', handleMediaChange);
      document.fonts?.removeEventListener?.('loadingdone', scheduleFit);
    };
  }, []);

  useGSAP(
    () => {
      const sectionEl = heroSectionRef.current;
      const parallaxEl = heroParallaxRef.current;
      if (!sectionEl || !parallaxEl) return;

      if (reducedMotion) {
        gsap.set(parallaxEl, { yPercent: 0 });
        return;
      }

      gsap.fromTo(
        parallaxEl,
        { yPercent: 0 },
        {
          yPercent: -15,
          ease: 'none',
          scrollTrigger: {
            trigger: sectionEl,
            start: 'top top',
            end: 'bottom top',
            scrub: 0.5,
            invalidateOnRefresh: true,
          },
        }
      );
    },
    { scope: heroSectionRef, dependencies: [reducedMotion] }
  );

  const targetAnimate =
    reducedMotion || isReady ? { opacity: 1, y: 0 } : { opacity: 0, y: 16 };

  return (
    <section
      ref={heroSectionRef}
      id="hero"
      aria-label="Introduction"
      className="w-full pt-10 sm:pt-14 md:pt-16 overflow-hidden"
    >
      <div className="layout-container">
        <div ref={heroParallaxRef} className="will-change-transform">
          <motion.div
            initial={reducedMotion ? false : { opacity: 0, y: 16 }}
            animate={targetAnimate}
            transition={{
              duration: REVEAL_DURATION,
              ease: REVEAL_EASE,
              delay: 0,
            }}
          >
            <div ref={textContainerRef} className="w-full">
              <h1
                ref={headingRef}
                style={
                  fittedFontSize
                    ? { fontSize: `${fittedFontSize}px`, lineHeight: 0.85 }
                    : { lineHeight: 0.85 }
                }
                className="font-archivo-wide font-extrabold uppercase tracking-[-0.025em] text-[var(--text)] whitespace-nowrap select-none m-0 block text-[clamp(3.5rem,18vw,15.5rem)]"
              >
                <span ref={textSpanRef} className="inline-block whitespace-nowrap">
                  {SITE_IDENTITY.heroName}
                </span>
              </h1>
            </div>
          </motion.div>

          <div className="mt-8 flex flex-col items-start gap-3.5 sm:gap-4">
            <motion.p
              initial={reducedMotion ? false : { opacity: 0, y: 16 }}
              animate={targetAnimate}
              transition={{
                duration: REVEAL_DURATION,
                ease: REVEAL_EASE,
                delay: 0.1,
              }}
              className="font-archivo-statement font-bold text-[var(--text)] text-[clamp(1.2rem,2.15vw,2rem)] leading-[1.2] m-0"
            >
              {SITE_IDENTITY.heroPitchLines[0]}{' '}
              <br className="hidden sm:inline" />
              {SITE_IDENTITY.heroPitchLines[1]}{' '}
              <br className="hidden sm:inline" />
              {SITE_IDENTITY.heroPitchLines[2]}
            </motion.p>

            <motion.p
              initial={reducedMotion ? false : { opacity: 0, y: 16 }}
              animate={targetAnimate}
              transition={{
                duration: REVEAL_DURATION,
                ease: REVEAL_EASE,
                delay: 0.2,
              }}
              className="font-geist-mono text-xs sm:text-sm text-[var(--muted)] m-0 flex flex-wrap items-center gap-x-2 gap-y-1"
            >
              <span>{SITE_IDENTITY.location}</span>
              <span aria-hidden="true">&middot;</span>
              <span>Local time {karachiTime}</span>
              <span aria-hidden="true">&middot;</span>
              <span className="text-[var(--text)]">{SITE_IDENTITY.availability}</span>
            </motion.p>
          </div>
        </div>
      </div>
    </section>
  );
}
