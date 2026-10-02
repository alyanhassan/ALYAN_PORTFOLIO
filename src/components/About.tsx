import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';
import { ABOUT_DATA } from '../data/projects';
import { useReducedMotionPreference } from '../lib/scrollAndMotion';
import { LineReveal } from './LineReveal';

gsap.registerPlugin(ScrollTrigger, useGSAP);

export function About() {
  const sectionRef = useRef<HTMLElement>(null);
  const photoInnerRef = useRef<HTMLDivElement>(null);
  const reducedMotion = useReducedMotionPreference();

  useGSAP(
    () => {
      const sectionEl = sectionRef.current;
      const photoInnerEl = photoInnerRef.current;
      if (!sectionEl) return;

      if (photoInnerEl) {
        if (reducedMotion) {
          gsap.set(photoInnerEl, { y: 0 });
        } else {
          gsap.fromTo(
            photoInnerEl,
            { y: -25 },
            {
              y: 25,
              ease: 'none',
              scrollTrigger: {
                trigger: sectionEl,
                start: 'top bottom',
                end: 'bottom top',
                scrub: 0.5,
                invalidateOnRefresh: true,
              },
            }
          );
        }
      }

      const revealItems = sectionEl.querySelectorAll<HTMLElement>(
        '[data-about-reveal]'
      );

      revealItems.forEach((item) => {
        if (reducedMotion || item.getAttribute('data-revealed') === 'true') {
          gsap.set(item, { y: 0, opacity: 1 });
          item.setAttribute('data-revealed', 'true');
          return;
        }

        gsap.set(item, { y: 20, opacity: 0 });

        const playItem = () => {
          if (item.getAttribute('data-revealed') === 'true') return;
          item.setAttribute('data-revealed', 'true');
          gsap.to(item, {
            y: 0,
            opacity: 1,
            duration: 0.7,
            ease: 'power2.out',
            overwrite: 'auto',
          });
        };

        ScrollTrigger.create({
          trigger: item,
          start: 'top 85%',
          toggleActions: 'play none none none',
          once: true,
          onEnter: playItem,
          onRefresh: (self) => {
            if (
              self.progress > 0 ||
              item.getBoundingClientRect().top < window.innerHeight * 0.88
            ) {
              playItem();
            }
          },
        });
      });
    },
    { scope: sectionRef, dependencies: [reducedMotion] }
  );

  // Safety fallback via IntersectionObserver so no About block can stay invisible
  useEffect(() => {
    const sectionEl = sectionRef.current;
    if (!sectionEl || reducedMotion) return;

    const items = sectionEl.querySelectorAll<HTMLElement>('[data-about-reveal]');
    const timers: number[] = [];

    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          const target = entry.target as HTMLElement;
          if (
            entry.isIntersecting &&
            target.getAttribute('data-revealed') !== 'true'
          ) {
            const t = window.setTimeout(() => {
              if (target.getAttribute('data-revealed') !== 'true') {
                target.setAttribute('data-revealed', 'true');
                gsap.to(target, {
                  y: 0,
                  opacity: 1,
                  duration: 0.7,
                  ease: 'power2.out',
                  overwrite: 'auto',
                });
              }
            }, 140);
            timers.push(t);
          }
        });
      },
      { threshold: 0.1 }
    );

    items.forEach((item) => io.observe(item));
    return () => {
      io.disconnect();
      timers.forEach((t) => window.clearTimeout(t));
    };
  }, [reducedMotion]);

  return (
    <section
      ref={sectionRef}
      id="about"
      aria-labelledby="about-heading"
      className="w-full section-spacing"
    >
      <div className="layout-container">
        <div className="pt-10 sm:pt-14 hairline-t grid grid-cols-1 md:grid-cols-12 gap-10 md:gap-12 items-start">
          {/* Left column: 4:5 portrait, sticky-pinned on desktop during scroll */}
          <div className="md:col-span-5 w-full md:sticky md:top-24 self-start">
            <div
              data-about-reveal
              className="w-full aspect-[4/5] bg-[var(--line)] overflow-hidden relative will-change-transform"
            >
              <div
                ref={photoInnerRef}
                className="w-full h-[116%] -mt-[8%] relative will-change-transform"
              >
                <img
                  src={ABOUT_DATA.photo}
                  alt={ABOUT_DATA.photoAlt}
                  loading="lazy"
                  className="w-full h-full object-cover object-center block"
                />
              </div>
            </div>
          </div>

          {/* Right column: About heading, 3 sequential Fraunces blocks, facts, and counters */}
          <div className="md:col-span-7 flex flex-col">
            <LineReveal
              as="h2"
              id="about-heading"
              text="About"
              defaultLines={['About']}
              className="font-archivo-wide font-extrabold text-[var(--text)] text-[clamp(1.75rem,3.5vw,3rem)] leading-[1.05] m-0"
            />

            <div className="mt-8 sm:mt-12 flex flex-col gap-12 sm:gap-16 md:gap-24 md:pb-12">
              {ABOUT_DATA.paragraphs.map((blockText, idx) => (
                <p
                  key={idx}
                  data-about-reveal
                  className="font-fraunces-about text-[clamp(1.5rem,2.6vw,2.25rem)] leading-[1.3] text-[var(--text)] m-0 max-w-[34ch] will-change-transform"
                >
                  {blockText}
                </p>
              ))}
            </div>

            <div
              data-about-reveal
              className="mt-10 md:mt-4 pt-6 hairline-t font-geist-mono text-xs sm:text-sm text-[var(--text)] flex flex-wrap items-center gap-x-2.5 gap-y-1 will-change-transform"
            >
              {ABOUT_DATA.facts.map((fact, idx) => (
                <React.Fragment key={fact}>
                  <span>{fact}</span>
                  {idx < ABOUT_DATA.facts.length - 1 && (
                    <span aria-hidden="true" className="text-[var(--muted)]">
                      &middot;
                    </span>
                  )}
                </React.Fragment>
              ))}
            </div>

            <div
              data-about-reveal
              className="mt-6 pt-6 hairline-t grid grid-cols-1 sm:grid-cols-2 gap-6 will-change-transform"
            >
              {ABOUT_DATA.counters.map((counter) => (
                <div key={counter.label} className="flex flex-col gap-1">
                  <span className="font-archivo-wide font-bold text-[clamp(2rem,3.5vw,3rem)] leading-none text-[var(--text)]">
                    {counter.value}
                  </span>
                  <span className="font-geist-mono text-xs sm:text-sm text-[var(--muted)]">
                    {counter.label}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
