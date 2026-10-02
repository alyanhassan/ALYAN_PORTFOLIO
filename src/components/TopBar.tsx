import React from 'react';

interface TopBarProps {
  currentPath: string;
  onNavigate: (path: string, hash?: string) => void;
}

export function TopBar({ currentPath, onNavigate }: TopBarProps) {
  const handleHomeClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    if (currentPath !== '/') {
      onNavigate('/');
    } else {
      window.scrollTo({ top: 0 });
    }
  };

  const handleLetsTalkClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    if (currentPath !== '/') {
      onNavigate('/', '#contact');
    } else {
      const contactEl = document.getElementById('contact');
      if (contactEl) {
        contactEl.scrollIntoView();
      }
    }
  };

  return (
    <header id="top-bar" className="w-full hairline-b">
      <div className="layout-container flex items-center justify-between min-h-[64px] py-2">
        <a
          href="/"
          onClick={handleHomeClick}
          className="inline-flex items-center gap-2.5 min-h-[44px] min-w-[44px] text-[var(--text)] hover:text-[var(--accent)] font-archivo-wide font-bold text-lg tracking-tight"
        >
          <span>Alyan</span>
          <span
            aria-hidden="true"
            className="inline-block w-[10px] h-[10px] rounded-full bg-[var(--text)] shrink-0"
          />
        </a>

        <nav aria-label="Primary navigation" className="flex items-center">
          <a
            href="#contact"
            onClick={handleLetsTalkClick}
            className="btn-lets-talk inline-flex items-center justify-center min-h-[44px] px-4 text-sm whitespace-nowrap"
          >
            Let&apos;s talk
          </a>
        </nav>
      </div>
    </header>
  );
}
