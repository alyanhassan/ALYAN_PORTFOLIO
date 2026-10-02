import { useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';
import { motion } from 'motion/react';
import { SERVICES_DATA } from '../data/projects';
import {
  REVEAL_DURATION,
  REVEAL_EASE,
  REVEAL_VIEWPORT,
  useIsDesktop,
  useReducedMotionPreference,
} from '../lib/scrollAndMotion';
import { LineReveal } from './LineReveal';

gsap.registerPlugin(ScrollTrigger, useGSAP);

function ServicesDesktopPinned() {
  const sectionRef = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const sectionEl = sectionRef.current;
      if (!sectionEl) return;

      const numEls = gsap.utils.toArray<HTMLElement>(
        '[data-pin-service-num]',
        sectionEl
      );
      const driftEls = gsap.utils.toArray<HTMLElement>(
        '[data-pin-service-num-drift]',
        sectionEl
      );
      const panelEls = gsap.utils.toArray<HTMLElement>(
        '[data-pin-service-panel]',
        sectionEl
      );

      if (numEls.length < 3 || panelEls.length < 3 || driftEls.length < 3) return;

      // Initial state: Service 01 visible, 02 and 03 hidden
      gsap.set(numEls[0], { opacity: 1, yPercent: 0 });
      gsap.set([numEls[1], numEls[2]], { opacity: 0, yPercent: 18 });
      gsap.set(driftEls, { yPercent: 5 });

      gsap.set(panelEls[0], { opacity: 1, x: 0, pointerEvents: 'auto' });
      gsap.set([panelEls[1], panelEls[2]], {
        opacity: 0,
        x: 56,
        pointerEvents: 'none',
      });

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: sectionEl,
          start: 'top top',
          end: '+=200%', // 300vh total scroll track (100vh viewport + 200vh pin distance)
          pin: true,
          scrub: 0.5,
          anticipatePin: 1,
          invalidateOnRefresh: true,
        },
      });

      // Hold Service 01 (0 -> 0.8)
      tl.to({}, { duration: 0.8 })
        // Transition 01 -> 02 (0.8 -> 1.6)
        .to(
          numEls[0],
          {
            opacity: 0,
            yPercent: -18,
            duration: 0.8,
            ease: 'power2.inOut',
          },
          0.8
        )
        .to(
          panelEls[0],
          {
            opacity: 0,
            x: -56,
            pointerEvents: 'none',
            duration: 0.8,
            ease: 'power2.inOut',
          },
          0.8
        )
        .to(
          numEls[1],
          {
            opacity: 1,
            yPercent: 0,
            duration: 0.8,
            ease: 'power2.inOut',
          },
          0.8
        )
        .to(
          panelEls[1],
          {
            opacity: 1,
            x: 0,
            pointerEvents: 'auto',
            duration: 0.8,
            ease: 'power2.inOut',
          },
          0.8
        )
        // Hold Service 02 (1.6 -> 2.4)
        .to({}, { duration: 0.8 })
        // Transition 02 -> 03 (2.4 -> 3.2)
        .to(
          numEls[1],
          {
            opacity: 0,
            yPercent: -18,
            duration: 0.8,
            ease: 'power2.inOut',
          },
          2.4
        )
        .to(
          panelEls[1],
          {
            opacity: 0,
            x: -56,
            pointerEvents: 'none',
            duration: 0.8,
            ease: 'power2.inOut',
          },
          2.4
        )
        .to(
          numEls[2],
          {
            opacity: 1,
            yPercent: 0,
            duration: 0.8,
            ease: 'power2.inOut',
          },
          2.4
        )
        .to(
          panelEls[2],
          {
            opacity: 1,
            x: 0,
            pointerEvents: 'auto',
            duration: 0.8,
            ease: 'power2.inOut',
          },
          2.4
        )
        // Hold Service 03 before unpinning (3.2 -> 4.0)
        .to({}, { duration: 0.8 })
        // Subtle ±5% yPercent parallax drift on each service's big number during its portion of the pinned scroll
        .fromTo(
          driftEls[0],
          { yPercent: 5 },
          { yPercent: -5, duration: 1.6, ease: 'none' },
          0
        )
        .fromTo(
          driftEls[1],
          { yPercent: 5 },
          { yPercent: -5, duration: 2.4, ease: 'none' },
          0.8
        )
        .fromTo(
          driftEls[2],
          { yPercent: 5 },
          { yPercent: -5, duration: 1.6, ease: 'none' },
          2.4
        );
    },
    { scope: sectionRef }
  );

  return (
    <section
      ref={sectionRef}
      id="services"
      aria-labelledby="services-heading"
      className="w-full min-h-screen section-spacing flex flex-col justify-center py-12 overflow-hidden bg-[var(--bg)]"
    >
      <div className="layout-container w-full">
        <div className="pb-6 sm:pb-8 hairline-b">
          <LineReveal
            as="h2"
            id="services-heading"
            text="Services"
            defaultLines={['Services']}
            className="font-archivo-wide font-extrabold text-[var(--text)] text-[clamp(1.75rem,3.5vw,3rem)] leading-[1.05] m-0"
          />
        </div>

        <div className="pt-12 md:pt-16 grid grid-cols-12 gap-8 items-start">
          {/* LEFT (5 columns): Huge number 01 / 02 / 03 in Archivo weight 300, wdth 100, colored --muted, plain text with no dot */}
          <div className="col-span-5 grid grid-cols-1 grid-rows-1 items-start">
            {SERVICES_DATA.map((service) => (
              <div
                key={`num-${service.id}`}
                data-pin-service-num
                aria-label={`0${service.index}`}
                className="col-start-1 row-start-1 font-archivo-number text-[var(--muted)] text-[clamp(6rem,22vw,19rem)] leading-[0.82] tracking-[-0.03em] select-none whitespace-nowrap will-change-transform"
              >
                <span
                  data-pin-service-num-drift
                  className="inline-block will-change-transform"
                >
                  0{service.index}
                </span>
              </div>
            ))}
          </div>

          {/* RIGHT (starting at column 6): Stacked panels crossfading/sliding in sync with the number */}
          <div className="col-start-6 col-span-7 grid grid-cols-1 grid-rows-1 items-start">
            {SERVICES_DATA.map((service) => (
              <article
                key={service.id}
                id={service.id}
                data-pin-service-panel
                data-service-index={service.index}
                className="col-start-1 row-start-1 flex flex-col gap-6 sm:gap-8 will-change-transform"
              >
                <h3 className="font-archivo-service-title text-[var(--text)] text-[clamp(2.25rem,4.5vw,4rem)] leading-[1.05] m-0">
                  {service.name}
                </h3>

                <p className="font-geist font-normal text-[1.25rem] leading-[1.6] text-[var(--text)] max-w-[42ch] m-0">
                  {service.description}
                </p>

                <ul
                  aria-label={`${service.name} tags`}
                  className="list-none m-0 p-0 pt-2 flex flex-wrap gap-3"
                >
                  {service.tags.map((tag) => (
                    <li
                      key={tag}
                      className="border border-[var(--muted)] rounded-[999px] py-[12px] px-[22px] font-geist font-normal text-[15px] sm:text-[16px] leading-none text-[var(--muted)] bg-transparent"
                    >
                      {tag}
                    </li>
                  ))}
                </ul>
              </article>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

function ServicesStacked({ reducedMotion }: { reducedMotion: boolean }) {
  return (
    <section
      id="services"
      aria-labelledby="services-heading"
      className="w-full section-spacing"
    >
      <div className="layout-container">
        <div className="pb-6 sm:pb-8">
          <LineReveal
            as="h2"
            id="services-heading"
            text="Services"
            defaultLines={['Services']}
            className="font-archivo-wide font-extrabold text-[var(--text)] text-[clamp(1.75rem,3.5vw,3rem)] leading-[1.05] m-0"
          />
        </div>

        <div>
          {SERVICES_DATA.map((service) => (
            <article
              key={service.id}
              id={service.id}
              data-service-index={service.index}
              className="w-full hairline-t py-12 sm:py-16"
            >
              <motion.div
                initial={reducedMotion ? false : { opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={REVEAL_VIEWPORT}
                transition={{
                  duration: REVEAL_DURATION,
                  ease: REVEAL_EASE,
                  delay: 0,
                }}
                className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start"
              >
                {/* Plain text 01, 02, 03 — no dot */}
                <div
                  data-service-number
                  aria-label={`0${service.index}`}
                  className="md:col-span-5 font-archivo-number text-[var(--muted)] text-[clamp(5rem,28vw,8rem)] md:text-[clamp(6rem,24vw,21rem)] leading-[0.82] tracking-[-0.03em] select-none whitespace-nowrap"
                >
                  0{service.index}
                </div>

                <div
                  data-service-content
                  className="md:col-start-6 md:col-span-7 flex flex-col gap-6 sm:gap-8"
                >
                  <h3 className="font-archivo-service-title text-[var(--text)] text-[clamp(2.25rem,4.5vw,4rem)] leading-[1.05] m-0">
                    {service.name}
                  </h3>

                  <p className="font-geist font-normal text-[1.125rem] sm:text-[1.25rem] leading-[1.6] text-[var(--text)] max-w-[42ch] m-0">
                    {service.description}
                  </p>

                  <ul
                    aria-label={`${service.name} tags`}
                    className="list-none m-0 p-0 pt-2 flex flex-wrap gap-3"
                  >
                    {service.tags.map((tag) => (
                      <li
                        key={tag}
                        className="border border-[var(--muted)] rounded-[999px] py-[12px] px-[22px] font-geist font-normal text-[15px] sm:text-[16px] leading-none text-[var(--muted)] bg-transparent"
                      >
                        {tag}
                      </li>
                    ))}
                  </ul>
                </div>
              </motion.div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

export function Services() {
  const isDesktop = useIsDesktop();
  const reducedMotion = useReducedMotionPreference();

  // Mount desktop pinned version only on >= 768px when reduced motion is off
  if (isDesktop && !reducedMotion) {
    return <ServicesDesktopPinned />;
  }

  return <ServicesStacked reducedMotion={reducedMotion} />;
}
