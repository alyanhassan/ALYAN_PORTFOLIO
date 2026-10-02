import React, { useEffect, useRef, useState, useCallback } from 'react';
import { motion } from 'motion/react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface CarouselProps<T> {
  items: T[];
  renderItem: (item: T, index: number) => React.ReactNode;
  alwaysShow?: boolean;
  className?: string;
  ariaLabel?: string;
}

export function Carousel<T>({
  items,
  renderItem,
  alwaysShow = false,
  className = '',
  ariaLabel = 'Project carousel',
}: CarouselProps<T>) {
  const containerRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [containerWidth, setContainerWidth] = useState(0);
  const [cardWidth, setCardWidth] = useState(0);
  const [gap, setGap] = useState(24);
  const [isTouchDevice, setIsTouchDevice] = useState(false);
  const isDraggingRef = useRef(false);

  // Detect touch capability for showing arrows on touch devices
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const isTouch =
        'ontouchstart' in window ||
        navigator.maxTouchPoints > 0 ||
        window.matchMedia('(pointer: coarse)').matches;
      setIsTouchDevice(isTouch);
    }
  }, []);

  // Measure container and card widths
  const updateDimensions = useCallback(() => {
    if (!containerRef.current) return;
    const contW = containerRef.current.offsetWidth;
    setContainerWidth(contW);

    // Responsive gap: 16px on mobile (<640px), 24px on sm+
    const currentGap = window.innerWidth < 640 ? 16 : 24;
    setGap(currentGap);

    if (trackRef.current && trackRef.current.children.length > 0) {
      const firstCard = trackRef.current.children[0] as HTMLElement;
      if (firstCard) {
        setCardWidth(firstCard.offsetWidth);
      }
    }
  }, []);

  useEffect(() => {
    updateDimensions();

    const containerEl = containerRef.current;
    if (!containerEl) return;

    const observer = new ResizeObserver(() => {
      updateDimensions();
    });
    observer.observe(containerEl);

    window.addEventListener('resize', updateDimensions);
    return () => {
      observer.disconnect();
      window.removeEventListener('resize', updateDimensions);
    };
  }, [updateDimensions, items]);

  const totalItems = items.length;
  const step = cardWidth > 0 ? cardWidth + gap : 0;
  const totalTrackWidth =
    totalItems > 0 && cardWidth > 0
      ? totalItems * cardWidth + (totalItems - 1) * gap
      : 0;
  const maxTranslate = Math.max(0, totalTrackWidth - containerWidth);

  // Calculate max allowable index so we don't scroll into empty space
  const maxIndex =
    step > 0 && maxTranslate > 0
      ? Math.min(totalItems - 1, Math.ceil(maxTranslate / step))
      : 0;

  const currentTranslate = Math.min(maxTranslate, currentIndex * step);

  const handlePrev = () => {
    setCurrentIndex((prev) => Math.max(0, prev - 1));
  };

  const handleNext = () => {
    setCurrentIndex((prev) => Math.min(maxIndex, prev + 1));
  };

  const handleDotClick = (idx: number) => {
    setCurrentIndex(Math.min(maxIndex, idx));
  };

  // Nav arrow visibility: always on touch devices or when alwaysShow is true; otherwise on hover
  const showControls = alwaysShow || isTouchDevice;

  return (
    <div
      className={`group relative w-full select-none ${className}`}
      aria-label={ariaLabel}
    >
      {/* Overflow-hidden track container */}
      <div ref={containerRef} className="w-full overflow-hidden relative">
        <motion.div
          ref={trackRef}
          drag="x"
          dragConstraints={{ left: -maxTranslate, right: 0 }}
          dragElastic={0.12}
          onDragStart={() => {
            isDraggingRef.current = true;
          }}
          onDragEnd={(_e, info) => {
            const offset = info.offset.x;
            const velocity = info.velocity.x;

            if (offset < -35 || velocity < -200) {
              setCurrentIndex((prev) => Math.min(maxIndex, prev + 1));
            } else if (offset > 35 || velocity > 200) {
              setCurrentIndex((prev) => Math.max(0, prev - 1));
            }

            window.setTimeout(() => {
              isDraggingRef.current = false;
            }, 60);
          }}
          onClickCapture={(e) => {
            // Prevent accidental click on links if user was dragging
            if (isDraggingRef.current) {
              e.stopPropagation();
              e.preventDefault();
            }
          }}
          animate={{ x: -currentTranslate }}
          transition={{ type: 'spring', stiffness: 280, damping: 28 }}
          className="flex cursor-grab active:cursor-grabbing will-change-transform py-1"
          style={{ gap: `${gap}px` }}
        >
          {items.map((item, index) => (
            <div
              key={index}
              className="w-[84%] sm:w-[48%] md:w-[38%] lg:w-[31.5%] shrink-0"
            >
              {renderItem(item, index)}
            </div>
          ))}
        </motion.div>
      </div>

      {/* Nav arrow buttons (prev/next) */}
      {totalItems > 1 && maxIndex > 0 && (
        <>
          {/* Previous Arrow */}
          <button
            type="button"
            aria-label="Previous slide"
            disabled={currentIndex === 0}
            onClick={handlePrev}
            className={`absolute left-2 top-[32%] -translate-y-1/2 z-20 w-9 h-9 sm:w-10 sm:h-10 rounded-full flex items-center justify-center bg-[var(--bg)] border border-[var(--line)] text-[var(--text)] hover:border-[var(--muted)] transition-all duration-150 disabled:opacity-20 disabled:pointer-events-none cursor-pointer ${
              showControls ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'
            }`}
          >
            <ChevronLeft size={18} aria-hidden="true" />
          </button>

          {/* Next Arrow */}
          <button
            type="button"
            aria-label="Next slide"
            disabled={currentIndex >= maxIndex}
            onClick={handleNext}
            className={`absolute right-2 top-[32%] -translate-y-1/2 z-20 w-9 h-9 sm:w-10 sm:h-10 rounded-full flex items-center justify-center bg-[var(--bg)] border border-[var(--line)] text-[var(--text)] hover:border-[var(--muted)] transition-all duration-150 disabled:opacity-20 disabled:pointer-events-none cursor-pointer ${
              showControls ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'
            }`}
          >
            <ChevronRight size={18} aria-hidden="true" />
          </button>
        </>
      )}

      {/* Indicator dots */}
      {totalItems > 1 && maxIndex > 0 && (
        <div
          role="tablist"
          aria-label="Slide indicators"
          className="flex items-center justify-center gap-2 pt-6 pb-2"
        >
          {items.map((_, idx) => (
            <button
              key={idx}
              type="button"
              role="tab"
              aria-selected={idx === currentIndex}
              aria-label={`Go to slide ${idx + 1}`}
              onClick={() => handleDotClick(idx)}
              className={`h-2 rounded-full transition-all duration-200 cursor-pointer ${
                idx === currentIndex
                  ? 'w-5 bg-[var(--text)]'
                  : 'w-2 bg-[var(--muted)]/25 hover:bg-[var(--muted)]/50'
              }`}
            />
          ))}
        </div>
      )}
    </div>
  );
}
