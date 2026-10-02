import { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';
import { SITE_IDENTITY } from '../data/projects';
import {
  useIsDesktop,
  useReducedMotionPreference,
} from '../lib/scrollAndMotion';

gsap.registerPlugin(ScrollTrigger, useGSAP);

export function Footer() {
  const reducedMotion = useReducedMotionPreference();
  const isDesktop = useIsDesktop();
  const footerTriggerRef = useRef<HTMLDivElement>(null);
  const footerBandRef = useRef<HTMLElement>(null);
  const revealWrapRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const textRef = useRef<HTMLParagraphElement>(null);
  const spanRef = useRef<HTMLSpanElement>(null);
  const [fittedSize, setFittedSize] = useState<number | null>(null);

  useEffect(() => {
    const fitFooterName = () => {
      const container = containerRef.current;
      const textEl = textRef.current;
      const spanEl = spanRef.current;
      if (!container || !textEl || !spanEl) return;

      const containerWidth = container.getBoundingClientRect().width;
      if (containerWidth <= 0) return;

      // Span ~96% of the content width with small equal margins on each side
      const targetWidth = Math.max(10, containerWidth * 0.96);
      const REF_SIZE = 100;

      textEl.style.fontSize = `${REF_SIZE}px`;
      const measuredAtRef = Math.max(
        spanEl.getBoundingClientRect().width,
        spanEl.scrollWidth
      );

      if (measuredAtRef > 0) {
        let computedSize = (targetWidth / measuredAtRef) * REF_SIZE;
        textEl.style.fontSize = `${computedSize}px`;

        const actualRenderedWidth = Math.max(
          spanEl.getBoundingClientRect().width,
          spanEl.scrollWidth
        );
        if (actualRenderedWidth > targetWidth && actualRenderedWidth > 0) {
          computedSize =
            computedSize * (targetWidth / actualRenderedWidth) - 0.5;
          textEl.style.fontSize = `${computedSize}px`;
        }

        setFittedSize(computedSize);
      }
    };

    let rafId: number | null = null;
    let lastObservedWidth = -1;

    const scheduleFit = () => {
      if (rafId !== null) cancelAnimationFrame(rafId);
      rafId = requestAnimationFrame(() => {
        rafId = null;
        fitFooterName();
      });
    };

    fitFooterName();

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

    if (containerRef.current) {
      observer.observe(containerRef.current);
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
      const triggerEl = footerTriggerRef.current;
      const bandEl = footerBandRef.current;
      const wrapEl = revealWrapRef.current;
      if (!triggerEl || !bandEl || !wrapEl) return;

      // Reduced motion: skip curtain reveal and text animation, footer just appears
      if (reducedMotion) {
        gsap.set(bandEl, { clearProps: 'clipPath' });
        gsap.set(wrapEl, { y: 0, opacity: 1 });
        return;
      }

      // Mobile (< 768px): graceful simple fade-up as the footer enters view
      if (!isDesktop) {
        gsap.set(bandEl, { clearProps: 'clipPath' });
        gsap.set(wrapEl, { y: 16, opacity: 0 });

        gsap.to(wrapEl, {
          y: 0,
          opacity: 1,
          duration: 0.65,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: triggerEl,
            start: 'top 92%',
            toggleActions: 'play none none none',
            once: true,
          },
        });
        return;
      }

      // Desktop (>= 768px): polygon clip-path curtain reveal upward + synced ALYAN HASSAN fade+rise
      gsap.set(bandEl, {
        clipPath: 'polygon(0% 100%, 100% 100%, 100% 100%, 0% 100%)',
      });
      gsap.set(wrapEl, { y: 24, opacity: 0 });

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: triggerEl,
          start: 'top bottom',
          end: 'clamp(top 60%)',
          scrub: 1,
          invalidateOnRefresh: true,
        },
      });

      tl.to(
        bandEl,
        {
          clipPath: 'polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%)',
          ease: 'none',
          duration: 1,
        },
        0
      ).to(
        wrapEl,
        {
          y: 0,
          opacity: 1,
          ease: 'power2.out',
          duration: 1,
        },
        0
      );
    },
    { scope: footerTriggerRef, dependencies: [isDesktop, reducedMotion] }
  );

  return (
    <div ref={footerTriggerRef} className="w-full">
      <footer
        ref={footerBandRef}
        id="footer"
        className="w-full hairline-t bg-[#000000] text-[#FFFFFF] will-change-[clip-path]"
      >
        <div className="layout-container py-12 sm:py-16 md:py-20">
          <div ref={revealWrapRef} className="will-change-transform">
            <div ref={containerRef} className="w-full flex justify-center">
              <p
                ref={textRef}
                style={
                  fittedSize
                    ? { fontSize: `${fittedSize}px`, lineHeight: 0.9 }
                    : { lineHeight: 0.9 }
                }
                className="font-archivo-wide font-extrabold uppercase tracking-[-0.025em] text-[#FFFFFF] text-center whitespace-nowrap select-none m-0 text-[clamp(2.5rem,9.2vw,7.75rem)]"
              >
                <span ref={spanRef} className="inline-block whitespace-nowrap">
                  {SITE_IDENTITY.footerName}
                </span>
              </p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
