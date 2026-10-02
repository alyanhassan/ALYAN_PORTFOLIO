import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { CONTACT_DATA, SITE_IDENTITY } from '../data/projects';
import {
  smoothScrollToTop,
  useReducedMotionPreference,
} from '../lib/scrollAndMotion';
import { LineReveal } from './LineReveal';

export function Contact() {
  const reducedMotion = useReducedMotionPreference();
  const backToTopRef = useRef<HTMLAnchorElement>(null);

  const handleBackToTop = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    smoothScrollToTop();
  };

  useEffect(() => {
    const btnEl = backToTopRef.current;
    if (!btnEl) return;

    if (reducedMotion) {
      gsap.set(btnEl, { x: 0, y: 0 });
      return;
    }

    const MAGNETIC_RADIUS = 40; // ~40px proximity radius
    const MAX_SHIFT = 7; // ~6-8px max shift toward cursor
    let isInsideRadius = false;

    const springBack = () => {
      if (!isInsideRadius) return;
      isInsideRadius = false;
      gsap.to(btnEl, {
        x: 0,
        y: 0,
        duration: 0.8,
        ease: 'elastic.out(1, 0.3)',
        overwrite: 'auto',
      });
    };

    const handleMouseMove = (e: MouseEvent) => {
      const rect = btnEl.getBoundingClientRect();
      const clampedX = Math.max(rect.left, Math.min(e.clientX, rect.right));
      const clampedY = Math.max(rect.top, Math.min(e.clientY, rect.bottom));
      const distFromEdge = Math.hypot(
        e.clientX - clampedX,
        e.clientY - clampedY
      );

      if (distFromEdge <= MAGNETIC_RADIUS) {
        isInsideRadius = true;
        const centerX = rect.left + rect.width / 2;
        const centerY = rect.top + rect.height / 2;
        const dx = e.clientX - centerX;
        const dy = e.clientY - centerY;
        const rangeX = rect.width / 2 + MAGNETIC_RADIUS;
        const rangeY = rect.height / 2 + MAGNETIC_RADIUS;

        const targetX = gsap.utils.clamp(
          -MAX_SHIFT,
          MAX_SHIFT,
          (dx / rangeX) * MAX_SHIFT
        );
        const targetY = gsap.utils.clamp(
          -MAX_SHIFT,
          MAX_SHIFT,
          (dy / rangeY) * MAX_SHIFT
        );

        gsap.to(btnEl, {
          x: targetX,
          y: targetY,
          duration: 0.2,
          ease: 'power2.out',
          overwrite: 'auto',
        });
      } else if (isInsideRadius) {
        springBack();
      }
    };

    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    btnEl.addEventListener('mouseleave', springBack);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      btnEl.removeEventListener('mouseleave', springBack);
      gsap.killTweensOf(btnEl);
      gsap.set(btnEl, { x: 0, y: 0 });
    };
  }, [reducedMotion]);

  return (
    <section
      id="contact"
      aria-labelledby="contact-heading"
      className="w-full section-spacing pb-8 sm:pb-10 relative"
    >
      <div className="layout-container">
        <div className="pt-10 sm:pt-16 hairline-t">
          <LineReveal
            as="h2"
            id="contact-heading"
            text={SITE_IDENTITY.contactHeading}
            defaultLines={[SITE_IDENTITY.contactHeading]}
            className="font-archivo-statement font-extrabold text-[var(--text)] text-[clamp(2.25rem,5.5vw,4.75rem)] leading-[0.98] m-0 max-w-[16em]"
          />

          <LineReveal
            as="p"
            text={SITE_IDENTITY.contactSubline}
            defaultLines={[SITE_IDENTITY.contactSubline]}
            delay={0.08}
            className="mt-4 sm:mt-6 font-archivo-statement font-semibold text-[clamp(1.5rem,3vw,2.25rem)] leading-[1.18] text-[var(--text)] m-0 max-w-[28ch]"
          />

          <ul className="mt-14 sm:mt-20 list-none m-0 p-0 w-full divide-y divide-[var(--rule)] hairline-t hairline-b">
            {CONTACT_DATA.projectEnquiries.map((item) => {
              const isExternal = item.href.startsWith('http');
              return (
                <li key={item.label} className="w-full">
                  <a
                    href={item.href}
                    target={isExternal ? '_blank' : undefined}
                    rel={isExternal ? 'noopener noreferrer' : undefined}
                    className="group contact-row-link w-full py-5 sm:py-6 px-2 sm:px-3 flex items-center justify-between gap-4 min-h-[44px] font-geist text-lg sm:text-2xl text-[var(--text)] hover:text-[var(--accent)] focus-visible:text-[var(--accent)] cursor-pointer no-underline"
                  >
                    <span className="break-all sm:break-normal">{item.label}</span>
                    <span
                      aria-hidden="true"
                      className="arrow-shift font-geist-mono text-base sm:text-xl shrink-0"
                    >
                      &rarr;
                    </span>
                  </a>
                </li>
              );
            })}
          </ul>

          {/* [STEP 4 SLOT]: Chatbot widget will be mounted here near the bottom right */}

          <div className="mt-8 sm:mt-12 flex justify-end">
            <a
              ref={backToTopRef}
              href="#top-bar"
              onClick={handleBackToTop}
              className="inline-flex items-center gap-2 min-h-[44px] font-geist-mono text-xs sm:text-sm text-[var(--text)] hover:text-[var(--accent)] transition-colors duration-150 whitespace-nowrap cursor-pointer will-change-transform"
            >
              <span>Back to top</span>
              <span aria-hidden="true">&uarr;</span>
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
