/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useCallback, useEffect, useState } from 'react';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { MotionConfig } from 'motion/react';
import { About } from './components/About';
import { Contact } from './components/Contact';
import { Footer } from './components/Footer';
import { Hero } from './components/Hero';
import {
  hasSeenPreloaderInSession,
  Preloader,
} from './components/Preloader';
import { SelectedWork } from './components/SelectedWork';
import { Services } from './components/Services';
import { TechStack } from './components/TechStack';
import { TopBar } from './components/TopBar';
import { WorkPage } from './components/WorkPage';
import {
  immediateScrollToTop,
  initLenisSmoothScroll,
  smoothScrollToHash,
} from './lib/scrollAndMotion';

function normalizePath(pathname: string): '/' | '/work' {
  if (pathname === '/work' || pathname.startsWith('/work/')) {
    return '/work';
  }
  return '/';
}

export default function App() {
  const [currentPath, setCurrentPath] = useState<'/' | '/work'>(() =>
    normalizePath(window.location.pathname)
  );
  const [showPreloader, setShowPreloader] = useState<boolean>(
    () => !hasSeenPreloaderInSession()
  );

  const handlePreloaderComplete = useCallback(() => {
    setShowPreloader(false);
  }, []);

  useEffect(() => {
    if (!showPreloader) {
      const rafId = requestAnimationFrame(() => {
        ScrollTrigger.refresh();
      });
      const timerId = window.setTimeout(() => {
        ScrollTrigger.refresh();
      }, 150);
      return () => {
        cancelAnimationFrame(rafId);
        window.clearTimeout(timerId);
      };
    }
  }, [showPreloader, currentPath]);

  useEffect(() => {
    const cleanupLenis = initLenisSmoothScroll();
    return cleanupLenis;
  }, []);

  useEffect(() => {
    const handlePopState = () => {
      setCurrentPath(normalizePath(window.location.pathname));
      immediateScrollToTop();
    };
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  const handleNavigate = (path: string, hash?: string) => {
    const targetPath = normalizePath(path);
    const isSamePage = targetPath === currentPath;
    const nextUrl = hash ? `${targetPath}${hash}` : targetPath;
    window.history.pushState({}, '', nextUrl);
    setCurrentPath(targetPath);

    if (hash) {
      if (!isSamePage) {
        immediateScrollToTop();
      }
      requestAnimationFrame(() => {
        smoothScrollToHash(hash);
      });
    } else {
      immediateScrollToTop();
    }
  };

  return (
    <MotionConfig reducedMotion="user">
      {showPreloader && <Preloader onComplete={handlePreloaderComplete} />}

      <div className="min-h-screen flex flex-col bg-[var(--bg)] text-[var(--text)]">
        <TopBar currentPath={currentPath} onNavigate={handleNavigate} />

        <main id="main-content" className="flex-1">
          {currentPath === '/work' ? (
            <WorkPage />
          ) : (
            <>
              <Hero isReady={!showPreloader} />
              <SelectedWork onNavigate={handleNavigate} />
              <Services />
              <TechStack />
              <About />
              <Contact />
            </>
          )}
        </main>

        <Footer />
      </div>
    </MotionConfig>
  );
}
