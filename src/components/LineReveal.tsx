import React, { useEffect, useLayoutEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';
import { useReducedMotionPreference } from '../lib/scrollAndMotion';

gsap.registerPlugin(ScrollTrigger, useGSAP);

interface LineRevealProps {
  as?: 'h1' | 'h2' | 'h3' | 'p' | 'div';
  id?: string;
  text: string;
  defaultLines?: string[];
  className?: string;
  delay?: number;
}

export function LineReveal({
  as: Component = 'h2',
  id,
  text,
  defaultLines,
  className = '',
  delay = 0,
}: LineRevealProps) {
  const containerRef = useRef<HTMLElement>(null);
  const measureRef = useRef<HTMLSpanElement>(null);
  const hasPlayedRef = useRef<boolean>(false);
  const reducedMotion = useReducedMotionPreference();
  const [computedLines, setComputedLines] = useState<string[]>(
    () => defaultLines ?? [text]
  );

  useLayoutEffect(() => {
    const measureEl = measureRef.current;
    if (!measureEl) return;

    const computeVisualLines = () => {
      const wordSpans = Array.from(
        measureEl.querySelectorAll<HTMLSpanElement>('[data-word-index]')
      );
      if (wordSpans.length === 0) return;

      const lines: string[] = [];
      let currentLineWords: string[] = [];
      let currentTop: number | null = null;

      wordSpans.forEach((span) => {
        const top = Math.round(span.offsetTop);
        const word = span.getAttribute('data-word-text') ?? '';
        if (currentTop === null || Math.abs(top - currentTop) <= 4) {
          currentLineWords.push(word);
          if (currentTop === null) currentTop = top;
        } else {
          if (currentLineWords.length > 0) {
            lines.push(currentLineWords.join(' '));
          }
          currentLineWords = [word];
          currentTop = top;
        }
      });

      if (currentLineWords.length > 0) {
        lines.push(currentLineWords.join(' '));
      }

      if (lines.length > 0) {
        setComputedLines((prev) => {
          if (
            prev.length === lines.length &&
            prev.every((val, idx) => val === lines[idx])
          ) {
            return prev;
          }
          return lines;
        });
      }
    };

    let rafId: number | null = null;
    let lastObservedWidth = -1;

    const scheduleCompute = () => {
      if (rafId !== null) cancelAnimationFrame(rafId);
      rafId = requestAnimationFrame(() => {
        rafId = null;
        computeVisualLines();
      });
    };

    computeVisualLines();

    if (document.fonts?.ready) {
      document.fonts.ready.then(scheduleCompute).catch(() => {});
    }

    const observer = new ResizeObserver((entries) => {
      const entry = entries[0];
      if (!entry) return;
      const width = Math.round(entry.contentRect.width);
      if (width !== lastObservedWidth) {
        lastObservedWidth = width;
        scheduleCompute();
      }
    });

    if (containerRef.current) {
      observer.observe(containerRef.current);
    }

    return () => {
      if (rafId !== null) cancelAnimationFrame(rafId);
      observer.disconnect();
    };
  }, [text]);

  useGSAP(
    () => {
      const el = containerRef.current;
      if (!el) return;

      const lineInners = el.querySelectorAll<HTMLElement>('[data-line-inner]');
      if (lineInners.length === 0) return;

      if (reducedMotion || hasPlayedRef.current) {
        gsap.set(lineInners, { yPercent: 0, opacity: 1 });
        hasPlayedRef.current = true;
        return;
      }

      const playReveal = () => {
        if (hasPlayedRef.current) return;
        hasPlayedRef.current = true;
        gsap.to(lineInners, {
          yPercent: 0,
          opacity: 1,
          duration: 0.65,
          ease: 'power2.out',
          stagger: 0.07,
          delay,
          overwrite: 'auto',
        });
      };

      gsap.set(lineInners, { yPercent: 100, opacity: 0 });

      ScrollTrigger.create({
        trigger: el,
        start: 'top 85%',
        toggleActions: 'play none none none',
        once: true,
        onEnter: playReveal,
        onRefresh: (self) => {
          if (self.progress > 0 || el.getBoundingClientRect().top < window.innerHeight * 0.88) {
            playReveal();
          }
        },
      });
    },
    { scope: containerRef, dependencies: [computedLines, reducedMotion, delay] }
  );

  // Safety fallback via IntersectionObserver so an element can never remain stuck invisible
  useEffect(() => {
    const el = containerRef.current;
    if (!el || reducedMotion) return;

    let fallbackTimer: number | null = null;
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && !hasPlayedRef.current) {
            fallbackTimer = window.setTimeout(() => {
              if (!hasPlayedRef.current && containerRef.current) {
                hasPlayedRef.current = true;
                const lineInners =
                  containerRef.current.querySelectorAll<HTMLElement>(
                    '[data-line-inner]'
                  );
                gsap.to(lineInners, {
                  yPercent: 0,
                  opacity: 1,
                  duration: 0.65,
                  ease: 'power2.out',
                  stagger: 0.07,
                  delay,
                  overwrite: 'auto',
                });
              }
            }, 120);
          }
        });
      },
      { threshold: 0.05, rootMargin: '0px 0px -10% 0px' }
    );

    io.observe(el);
    return () => {
      io.disconnect();
      if (fallbackTimer !== null) window.clearTimeout(fallbackTimer);
    };
  }, [computedLines, reducedMotion, delay]);

  const words = text.split(/\s+/).filter(Boolean);

  return React.createElement(
    Component,
    {
      ref: containerRef,
      id,
      className: `relative ${className}`,
    },
    <>
      <span
        ref={measureRef}
        aria-hidden="true"
        className="pointer-events-none invisible absolute inset-x-0 top-0 select-none"
      >
        {words.map((word, idx) => (
          <React.Fragment key={`${word}-${idx}`}>
            <span data-word-index={idx} data-word-text={word} className="inline-block">
              {word}
            </span>
            {idx < words.length - 1 ? ' ' : ''}
          </React.Fragment>
        ))}
      </span>

      {computedLines.map((line, idx) => (
        <span
          key={`${idx}-${line}`}
          className="block overflow-hidden pb-[0.12em] -mb-[0.12em]"
        >
          <span data-line-inner className="block will-change-transform">
            {line}
          </span>
        </span>
      ))}
    </>
  );
}
