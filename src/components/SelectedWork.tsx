import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';
import { motion } from 'motion/react';
import {
  SelectedProject,
  SELECTED_PROJECTS,
  SITE_IDENTITY,
} from '../data/projects';
import {
  REVEAL_EASE,
  REVEAL_VIEWPORT,
  useReducedMotionPreference,
} from '../lib/scrollAndMotion';

gsap.registerPlugin(ScrollTrigger, useGSAP);

interface SelectedWorkRowProps {
  project: SelectedProject;
  isAlternated: boolean;
  reducedMotion: boolean;
}

function SelectedWorkRow({
  project,
  isAlternated,
  reducedMotion,
}: SelectedWorkRowProps) {
  const rowRef = useRef<HTMLElement>(null);
  const textRef = useRef<HTMLDivElement>(null);
  const mediaRef = useRef<HTMLDivElement>(null);
  const mediaParallaxRef = useRef<HTMLDivElement>(null);
  const hasPlayedRef = useRef<boolean>(false);

  const isExternal = project.url ? project.url.startsWith('http') : false;

  useGSAP(
    () => {
      const rowEl = rowRef.current;
      const textEl = textRef.current;
      const mediaEl = mediaRef.current;
      const mediaParallaxEl = mediaParallaxRef.current;
      if (!rowEl || !textEl || !mediaEl || !mediaParallaxEl) return;

      if (reducedMotion) {
        gsap.set([textEl, mediaEl], { x: 0, opacity: 1 });
        gsap.set(mediaParallaxEl, { yPercent: 0 });
        hasPlayedRef.current = true;
        return;
      }

      // Continuous vertical scrub parallax on the media unit across the row's scroll range
      gsap.fromTo(
        mediaParallaxEl,
        { yPercent: 6 },
        {
          yPercent: -6,
          ease: 'none',
          scrollTrigger: {
            trigger: rowEl,
            start: 'top bottom',
            end: 'bottom top',
            scrub: 0.5,
            invalidateOnRefresh: true,
          },
        }
      );

      if (hasPlayedRef.current) {
        gsap.set([textEl, mediaEl], { x: 0, opacity: 1 });
        return;
      }

      // If isAlternated is false: text is on left (-70px), media is on right (+70px)
      // If isAlternated is true: text is on right (+70px), media is on left (-70px)
      const textFromX = isAlternated ? 70 : -70;
      const mediaFromX = isAlternated ? -70 : 70;

      gsap.set(textEl, { x: textFromX, opacity: 0 });
      gsap.set(mediaEl, { x: mediaFromX, opacity: 0 });

      const playRowReveal = () => {
        if (hasPlayedRef.current) return;
        hasPlayedRef.current = true;
        const tl = gsap.timeline();
        tl.to(
          textEl,
          {
            x: 0,
            opacity: 1,
            duration: 0.95,
            ease: 'power3.out',
            overwrite: 'auto',
          },
          0
        ).to(
          mediaEl,
          {
            x: 0,
            opacity: 1,
            duration: 0.95,
            ease: 'power3.out',
            overwrite: 'auto',
          },
          0.1
        );
      };

      ScrollTrigger.create({
        trigger: rowEl,
        start: 'top 75%',
        toggleActions: 'play none none none',
        once: true,
        onEnter: playRowReveal,
        onRefresh: (self) => {
          if (
            self.progress > 0 ||
            rowEl.getBoundingClientRect().top < window.innerHeight * 0.78
          ) {
            playRowReveal();
          }
        },
      });
    },
    { scope: rowRef, dependencies: [isAlternated, reducedMotion] }
  );

  // Safety fallback via IntersectionObserver so a row never remains invisible
  useEffect(() => {
    const rowEl = rowRef.current;
    const textEl = textRef.current;
    const mediaEl = mediaRef.current;
    if (!rowEl || !textEl || !mediaEl || reducedMotion) return;

    let fallbackTimer: number | null = null;
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && !hasPlayedRef.current) {
            fallbackTimer = window.setTimeout(() => {
              if (!hasPlayedRef.current && textRef.current && mediaRef.current) {
                hasPlayedRef.current = true;
                gsap.to([textRef.current, mediaRef.current], {
                  x: 0,
                  opacity: 1,
                  duration: 0.95,
                  ease: 'power3.out',
                  stagger: 0.1,
                  overwrite: 'auto',
                });
              }
            }, 150);
          }
        });
      },
      { threshold: 0.2 }
    );

    io.observe(rowEl);
    return () => {
      io.disconnect();
      if (fallbackTimer !== null) window.clearTimeout(fallbackTimer);
    };
  }, [reducedMotion]);

  const isForge = project.id === 'forge-athletic';

  return (
    <article
      ref={rowRef}
      id={`project-${project.id}`}
      data-work-row
      data-alternated={isAlternated ? 'true' : 'false'}
      className="py-10 sm:py-16 grid grid-cols-1 md:grid-cols-12 gap-8 md:gap-10 items-center"
    >
      {/* Text side: 5 cols on desktop, always stacked above media on mobile */}
      <div
        ref={textRef}
        data-work-text
        className={`md:col-span-5 flex flex-col items-start gap-4 will-change-transform ${
          isAlternated ? 'md:order-2' : 'md:order-1'
        }`}
      >
        <h3
          className={`font-archivo-wide font-bold text-[var(--text)] leading-[1.04] m-0 w-full max-w-full break-words [overflow-wrap:break-word] [word-break:break-word] ${
            isForge
              ? 'text-[clamp(1.75rem,2.75vw,2.75rem)]'
              : 'text-[clamp(2rem,4vw,3.75rem)]'
          }`}
        >
          {project.name}
        </h3>

        <div className="font-geist-mono text-xs sm:text-sm text-[var(--muted)] flex flex-wrap items-center gap-x-2 gap-y-1">
          {project.tags.map((tag, tagIdx) => (
            <React.Fragment key={tag}>
              <span>{tag}</span>
              {tagIdx < project.tags.length - 1 && (
                <span aria-hidden="true">&middot;</span>
              )}
            </React.Fragment>
          ))}
        </div>

        <p className="font-geist font-light text-base leading-[1.6] text-[var(--muted)] m-0 max-w-[54ch]">
          {project.description}
        </p>

        {project.url ? (
          <a
            href={project.url}
            target={isExternal ? '_blank' : undefined}
            rel={isExternal ? 'noopener noreferrer' : undefined}
            className="group inline-flex items-center gap-2 min-h-[44px] font-geist-mono text-sm text-[var(--text)] hover:text-[var(--accent)] transition-colors duration-150 whitespace-nowrap mt-1"
          >
            <span>{project.ctaLabel}</span>
            <span aria-hidden="true" className="arrow-shift">
              &rarr;
            </span>
          </a>
        ) : (
          <span className="inline-flex items-center min-h-[44px] font-geist-mono text-sm text-[var(--muted)] whitespace-nowrap mt-1">
            {project.ctaLabel}
          </span>
        )}
      </div>

      {/* Media side: 7 cols on desktop, alternated side on each row */}
      <div
        ref={mediaRef}
        data-work-media
        className={`md:col-span-7 w-full will-change-transform ${
          isAlternated ? 'md:order-1' : 'md:order-2'
        }`}
      >
        <div ref={mediaParallaxRef} className="w-full will-change-transform">
          {project.mediaType === 'dual-device' ? (
            <div className="relative w-full pb-4 pr-2 sm:pb-6 sm:pr-4">
              <div
                role={project.desktopImage ? undefined : 'img'}
                aria-label={project.desktopImage ? undefined : project.desktopAlt}
                className={`w-full aspect-[16/10] bg-[var(--line)] overflow-hidden flex items-center justify-center ${
                  project.desktopImage ? 'p-0' : 'p-4'
                }`}
              >
                {project.desktopImage ? (
                  <img
                    src={project.desktopImage}
                    alt={project.desktopAlt || `${project.name} desktop screenshot`}
                    loading="lazy"
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover object-top block"
                  />
                ) : (
                  <span className="font-geist-mono text-xs sm:text-sm text-[var(--text)] text-center">
                    {project.desktopLabel}
                  </span>
                )}
              </div>

              <div
                role={project.phoneImage ? undefined : 'img'}
                aria-label={project.phoneImage ? undefined : project.phoneAlt}
                className={`absolute bottom-0 right-0 w-[22%] min-w-[68px] aspect-[9/19.5] bg-[var(--line)] border-2 border-[var(--bg)] overflow-hidden flex items-center justify-center ${
                  project.phoneImage ? 'p-0' : 'p-1.5'
                }`}
              >
                {project.phoneImage ? (
                  <img
                    src={project.phoneImage}
                    alt={project.phoneAlt || `${project.name} mobile screenshot`}
                    loading="lazy"
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover object-top block"
                  />
                ) : (
                  <span className="font-geist-mono text-[10px] sm:text-xs leading-tight text-[var(--text)] text-center">
                    {project.phoneLabel}
                  </span>
                )}
              </div>
            </div>
          ) : (
            <div
              role={project.desktopImage ? undefined : 'img'}
              aria-label={project.desktopImage ? undefined : project.desktopAlt}
              className={`w-full aspect-[16/10] bg-[var(--line)] overflow-hidden flex items-center justify-center ${
                project.desktopImage ? 'p-0' : 'p-4'
              }`}
            >
              {project.desktopImage ? (
                <img
                  src={project.desktopImage}
                  alt={project.desktopAlt || `${project.name} visual`}
                  loading="lazy"
                  className="w-full h-full object-cover object-top block"
                />
              ) : (
                <span className="font-geist-mono text-xs sm:text-sm text-[var(--text)] text-center">
                  {project.desktopLabel}
                </span>
              )}
            </div>
          )}
        </div>
      </div>
    </article>
  );
}

interface SelectedWorkProps {
  onNavigate: (path: string, hash?: string) => void;
}

export function SelectedWork({ onNavigate }: SelectedWorkProps) {
  const reducedMotion = useReducedMotionPreference();

  const handleViewAllClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    onNavigate('/work');
  };

  return (
    <section
      id="work"
      aria-labelledby="selected-work-heading"
      className="w-full section-spacing overflow-x-hidden"
    >
      <div className="layout-container">
        <div className="pb-6 hairline-b flex items-baseline justify-between gap-4">
          <motion.h2
            id="selected-work-heading"
            initial={reducedMotion ? false : { opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={REVEAL_VIEWPORT}
            transition={{
              duration: 0.6,
              ease: REVEAL_EASE,
              delay: 0,
            }}
            className="font-archivo-wide font-extrabold text-[var(--text)] text-[clamp(1.75rem,3.5vw,3rem)] leading-[1.05] m-0"
          >
            Selected work
          </motion.h2>

          <a
            href="/work"
            onClick={handleViewAllClick}
            className="group inline-flex items-center gap-2 min-h-[44px] font-geist-mono text-sm text-[var(--text)] hover:text-[var(--accent)] transition-colors duration-150 whitespace-nowrap shrink-0"
          >
            <span>View all work</span>
            <span aria-hidden="true" className="arrow-shift">
              &rarr;
            </span>
          </a>
        </div>

        <motion.p
          initial={reducedMotion ? false : { opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={REVEAL_VIEWPORT}
          transition={{
            duration: 0.6,
            ease: REVEAL_EASE,
            delay: 0.08,
          }}
          className="pt-6 sm:pt-8 pb-2 font-geist font-light text-base sm:text-lg leading-[1.6] text-[var(--muted)] max-w-[40ch] m-0"
        >
          {SITE_IDENTITY.selectedWorkIntro[0]}{' '}
          {SITE_IDENTITY.selectedWorkIntro[1]}
        </motion.p>

        <div className="divide-y divide-[var(--rule)] hairline-b">
          {SELECTED_PROJECTS.map((project, index) => (
            <SelectedWorkRow
              key={project.id}
              project={project}
              isAlternated={index % 2 === 1}
              reducedMotion={reducedMotion}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
