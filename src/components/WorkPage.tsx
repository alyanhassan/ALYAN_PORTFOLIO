import React from 'react';
import {
  ALL_WORK_PROJECTS,
  ArchiveProject,
  SITE_IDENTITY,
  WORK_NICHES,
} from '../data/projects';
import { Carousel } from './Carousel';
import { LineReveal } from './LineReveal';

export function WorkPage() {
  return (
    <section
      id="all-work"
      aria-labelledby="all-work-heading"
      className="w-full pt-10 sm:pt-16 pb-16 sm:pb-24"
    >
      <div className="layout-container">
        {/* Page Header */}
        <div className="pb-8 sm:pb-12 hairline-b flex flex-col gap-4">
          <LineReveal
            as="h1"
            id="all-work-heading"
            text="All Work"
            defaultLines={['All Work']}
            className="font-archivo-wide font-extrabold text-[var(--text)] text-[clamp(2.75rem,7vw,6.5rem)] leading-[0.92] m-0"
          />
          <LineReveal
            as="p"
            text="Every concept project, grouped by industry."
            defaultLines={['Every concept project, grouped by industry.']}
            delay={0.08}
            className="font-geist font-light text-base sm:text-lg text-[var(--muted)] m-0 max-w-[54ch]"
          />
        </div>

        {/* Niche Groups with Draggable Card Carousels */}
        <div className="flex flex-col">
          {WORK_NICHES.map((niche) => {
            const projectsInNiche = ALL_WORK_PROJECTS.filter(
              (p) => p.nicheId === niche.id
            );

            if (projectsInNiche.length === 0) {
              return null;
            }

            return (
              <section
                key={niche.id}
                id={niche.id}
                aria-labelledby={`heading-${niche.id}`}
                className="pt-12 sm:pt-20"
              >
                {/* Niche heading with LineReveal and project count */}
                <div className="pb-4 hairline-b flex items-baseline justify-between gap-4">
                  <LineReveal
                    as="h2"
                    id={`heading-${niche.id}`}
                    text={niche.name}
                    defaultLines={[niche.name]}
                    className="font-archivo-wide font-bold text-[var(--text)] text-[clamp(1.375rem,2.5vw,2.25rem)] leading-[1.1] m-0"
                  />
                  <span className="font-geist-mono text-xs text-[var(--muted)] shrink-0">
                    {projectsInNiche.length}{' '}
                    {projectsInNiche.length === 1 ? 'project' : 'projects'}
                  </span>
                </div>

                {/* Draggable card carousel */}
                <div className="pt-6 sm:pt-8 pb-4">
                  <Carousel<ArchiveProject>
                    items={projectsInNiche}
                    ariaLabel={`${niche.name} carousel`}
                    renderItem={(project) => {
                      const isExternal = project.url.startsWith('http');

                      return (
                        <article
                          id={project.id}
                          className="w-full flex flex-col gap-4 group/card"
                        >
                          {/* 16:10 Thumbnail placeholder with minimal rounding */}
                          <div
                            role={project.thumbnailImage ? undefined : 'img'}
                            aria-label={project.thumbnailAlt}
                            className="w-full aspect-[16/10] bg-[var(--line)] overflow-hidden flex items-center justify-center relative select-none rounded-[2px]"
                          >
                            {project.thumbnailImage ? (
                              <img
                                src={project.thumbnailImage}
                                alt={project.thumbnailAlt}
                                loading="lazy"
                                referrerPolicy="no-referrer"
                                className="w-full h-full object-cover object-top block pointer-events-none"
                              />
                            ) : (
                              <span className="font-geist-mono text-xs sm:text-sm text-[var(--muted)] text-center px-4">
                                {project.thumbnailLabel}
                              </span>
                            )}
                          </div>

                          {/* Card Content */}
                          <div className="flex flex-col gap-2">
                            {/* Project Name in Archivo */}
                            <h3 className="font-archivo-wide font-bold text-[var(--text)] text-[clamp(1.15rem,1.8vw,1.45rem)] leading-[1.15] m-0 break-words [overflow-wrap:break-word]">
                              {project.name}
                            </h3>

                            {/* Niche + Concept tag line in Geist Mono */}
                            <p className="font-geist-mono text-xs text-[var(--muted)] m-0">
                              {project.niche} &middot; Concept
                            </p>

                            {/* Visit link with arrow-shift */}
                            <div className="pt-1">
                              <a
                                href={project.url}
                                target={isExternal ? '_blank' : undefined}
                                rel={isExternal ? 'noopener noreferrer' : undefined}
                                className="group/link inline-flex items-center gap-2 min-h-[44px] font-geist-mono text-sm text-[var(--text)] hover:text-[var(--accent)] transition-colors duration-150 whitespace-nowrap"
                              >
                                <span>Visit</span>
                                <span aria-hidden="true" className="arrow-shift">
                                  &rarr;
                                </span>
                              </a>
                            </div>
                          </div>
                        </article>
                      );
                    }}
                  />
                </div>
              </section>
            );
          })}
        </div>
      </div>
    </section>
  );
}
