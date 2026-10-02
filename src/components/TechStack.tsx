import React, { useState } from 'react';
import type { IconType } from 'react-icons';
import {
  SiCss,
  SiDotnet,
  SiGit,
  SiGithub,
  SiGooglegemini,
  SiHtml5,
  SiJavascript,
  SiLaravel,
  SiMysql,
  SiN8N,
  SiNextdotjs,
  SiNodedotjs,
  SiOpenjdk,
  SiPhp,
  SiReact,
  SiSupabase,
  SiTailwindcss,
  SiTypescript,
  SiVercel,
} from 'react-icons/si';
import { LineReveal } from './LineReveal';

interface TechItem {
  name: string;
  icon?: IconType;
}

interface TechCategory {
  id: string;
  title: string;
  icon: IconType;
  items: TechItem[];
}

const TECH_STACK_CATEGORIES: TechCategory[] = [
  {
    id: 'frontend',
    title: 'Frontend',
    icon: SiReact,
    items: [
      { name: 'HTML', icon: SiHtml5 },
      { name: 'CSS', icon: SiCss },
      { name: 'JavaScript', icon: SiJavascript },
      { name: 'TypeScript', icon: SiTypescript },
      { name: 'React', icon: SiReact },
      { name: 'Next.js', icon: SiNextdotjs },
      { name: 'Tailwind CSS', icon: SiTailwindcss },
    ],
  },
  {
    id: 'backend',
    title: 'Backend',
    icon: SiPhp,
    items: [
      { name: 'PHP', icon: SiPhp },
      { name: 'Laravel', icon: SiLaravel },
      { name: 'Java', icon: SiOpenjdk },
      { name: 'C#' },
      { name: '.NET', icon: SiDotnet },
      { name: 'Node.js', icon: SiNodedotjs },
    ],
  },
  {
    id: 'data',
    title: 'Data',
    icon: SiMysql,
    items: [
      { name: 'SQL' },
      { name: 'MySQL', icon: SiMysql },
      { name: 'Supabase (PostgreSQL)', icon: SiSupabase },
    ],
  },
  {
    id: 'ai-automation',
    title: 'AI & Automation',
    icon: SiGooglegemini,
    items: [
      { name: 'Gemini API', icon: SiGooglegemini },
      { name: 'n8n', icon: SiN8N },
      { name: 'REST APIs' },
    ],
  },
  {
    id: 'tools-deployment',
    title: 'Tools & Deployment',
    icon: SiGit,
    items: [
      { name: 'Git', icon: SiGit },
      { name: 'GitHub', icon: SiGithub },
      { name: 'Vercel', icon: SiVercel },
    ],
  },
];

export function TechStack() {
  const [activeDesktopId, setActiveDesktopId] = useState<string | null>(null);
  const [openMobileId, setOpenMobileId] = useState<string | null>(
    TECH_STACK_CATEGORIES[0].id
  );

  const handleMobileToggle = (id: string) => {
    setOpenMobileId((prev) => (prev === id ? null : id));
  };

  return (
    <section
      id="tech-stack"
      aria-labelledby="tech-stack-heading"
      className="w-full section-spacing"
    >
      <div className="layout-container">
        <div className="pb-6 sm:pb-8 hairline-b">
          <LineReveal
            as="h2"
            id="tech-stack-heading"
            text="Tech Stack"
            defaultLines={['Tech Stack']}
            className="font-archivo-wide font-extrabold text-[var(--text)] text-[clamp(1.75rem,3.5vw,3rem)] leading-[1.05] m-0"
          />

          <LineReveal
            as="p"
            text="What I build with, grouped by where it's used."
            defaultLines={["What I build with, grouped by where it's used."]}
            delay={0.08}
            className="pt-4 sm:pt-5 font-geist font-light text-base sm:text-lg leading-[1.6] text-[var(--muted)] max-w-[46ch] m-0"
          />
        </div>

        {/* DESKTOP (>= 768px): 5-card expand-on-hover horizontal row */}
        <div
          className="hidden md:flex items-stretch gap-3 lg:gap-4 pt-10 md:pt-12 w-full h-[360px] lg:h-[380px]"
          onMouseLeave={() => setActiveDesktopId(null)}
        >
          {TECH_STACK_CATEGORIES.map((category) => {
            const CategoryIcon = category.icon;
            const isExpanded = activeDesktopId === category.id;
            const hasAnyActive = activeDesktopId !== null;

            // Equal width (20%) when none are active; ~2.4x width when active (37.5% vs 15.625%)
            const widthClass = !hasAnyActive
              ? 'w-1/5'
              : isExpanded
              ? 'w-[37.5%]'
              : 'w-[15.625%]';

            return (
              <div
                key={category.id}
                data-tech-card={category.id}
                data-expanded={isExpanded ? 'true' : 'false'}
                tabIndex={0}
                onMouseEnter={() => setActiveDesktopId(category.id)}
                onFocus={() => setActiveDesktopId(category.id)}
                onBlur={(e) => {
                  if (!e.currentTarget.contains(e.relatedTarget as Node)) {
                    setActiveDesktopId(null);
                  }
                }}
                className={`relative overflow-hidden bg-[var(--line)] border ${
                  isExpanded
                    ? 'border-[var(--muted)]'
                    : 'border-[var(--line)]'
                } transition-all duration-700 ease-[cubic-bezier(0.25,1,0.5,1)] ${widthClass} flex flex-col justify-center select-none outline-none focus-visible:border-[var(--muted)]`}
              >
                {/* COLLAPSED STATE: Centered category icon + uppercase Geist Mono label */}
                <div
                  aria-hidden={isExpanded}
                  className={` inset-0 absolute flex flex-col items-center justify-center gap-4 px-4 text-center transition-all duration-500 ease-[cubic-bezier(0.25,1,0.5,1)] ${
                    isExpanded
                      ? 'opacity-0 scale-95 pointer-events-none'
                      : 'opacity-100 scale-100'
                  }`}
                >
                  <CategoryIcon
                    aria-hidden="true"
                    className="w-8 h-8 lg:w-9 lg:h-9 text-[var(--text)] shrink-0"
                  />
                  <span className="font-geist-mono text-xs uppercase tracking-[0.06em] text-[var(--muted)] leading-snug">
                    {category.title}
                  </span>
                </div>

                {/* EXPANDED STATE: Category title in Archivo + wrapped pill tags */}
                <div
                  aria-hidden={!isExpanded}
                  className={`w-full h-full flex flex-col justify-between p-6 lg:p-8 transition-all duration-700 ease-[cubic-bezier(0.25,1,0.5,1)] ${
                    isExpanded
                      ? 'opacity-100 translate-y-0 pointer-events-auto'
                      : 'opacity-0 translate-y-3 pointer-events-none'
                  }`}
                >
                  <div className="flex items-center justify-between gap-3">
                    <h3 className="font-archivo-service-title text-[var(--text)] text-[clamp(1.35rem,2vw,2rem)] leading-[1.1] m-0 whitespace-nowrap">
                      {category.title}
                    </h3>
                    <CategoryIcon
                      aria-hidden="true"
                      className="w-6 h-6 text-[var(--muted)] shrink-0"
                    />
                  </div>

                  <ul
                    aria-label={`${category.title} technologies`}
                    className="list-none m-0 p-0 flex flex-wrap gap-2.5 lg:gap-3"
                  >
                    {category.items.map((item) => {
                      const ItemIcon = item.icon;
                      return (
                        <li
                          key={item.name}
                          className="border border-[var(--muted)] rounded-[999px] py-[12px] px-[22px] font-geist font-normal text-[15px] sm:text-[16px] leading-none text-[var(--muted)] bg-transparent inline-flex items-center gap-2 whitespace-nowrap"
                        >
                          {ItemIcon && (
                            <ItemIcon
                              aria-hidden="true"
                              className="w-4 h-4 text-[var(--text)] shrink-0"
                            />
                          )}
                          <span>{item.name}</span>
                        </li>
                      );
                    })}
                  </ul>
                </div>
              </div>
            );
          })}
        </div>

        {/* MOBILE (< 768px): Simple tappable accordion list */}
        <div className="md:hidden pt-6 divide-y divide-[var(--rule)] hairline-b">
          {TECH_STACK_CATEGORIES.map((category) => {
            const CategoryIcon = category.icon;
            const isOpen = openMobileId === category.id;

            return (
              <div key={category.id} className="w-full">
                <button
                  type="button"
                  aria-expanded={isOpen}
                  aria-controls={`tech-panel-${category.id}`}
                  onClick={() => handleMobileToggle(category.id)}
                  className="w-full py-5 flex items-center justify-between gap-4 bg-transparent border-0 text-left cursor-pointer"
                >
                  <span className="flex items-center gap-3.5">
                    <CategoryIcon
                      aria-hidden="true"
                      className="w-5 h-5 text-[var(--text)] shrink-0"
                    />
                    <span className="font-archivo-service-title text-[var(--text)] text-xl leading-[1.15]">
                      {category.title}
                    </span>
                  </span>

                  <span
                    aria-hidden="true"
                    className="font-geist-mono text-sm text-[var(--muted)] select-none"
                  >
                    {isOpen ? '−' : '+'}
                  </span>
                </button>

                <div
                  id={`tech-panel-${category.id}`}
                  role="region"
                  aria-label={category.title}
                  className={`grid transition-all duration-500 ease-[cubic-bezier(0.25,1,0.5,1)] ${
                    isOpen
                      ? 'grid-rows-[1fr] opacity-100 pb-6'
                      : 'grid-rows-[0fr] opacity-0 pb-0'
                  }`}
                >
                  <div className="overflow-hidden">
                    <ul
                      aria-label={`${category.title} technologies`}
                      className="list-none m-0 p-0 pt-1 flex flex-wrap gap-2.5"
                    >
                      {category.items.map((item) => {
                        const ItemIcon = item.icon;
                        return (
                          <li
                            key={item.name}
                            className="border border-[var(--muted)] rounded-[999px] py-[12px] px-[22px] font-geist font-normal text-[15px] leading-none text-[var(--muted)] bg-transparent inline-flex items-center gap-2 whitespace-nowrap"
                          >
                            {ItemIcon && (
                              <ItemIcon
                                aria-hidden="true"
                                className="w-4 h-4 text-[var(--text)] shrink-0"
                              />
                            )}
                            <span>{item.name}</span>
                          </li>
                        );
                      })}
                    </ul>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
