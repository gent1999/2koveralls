import { useState, useEffect, useRef, useCallback } from 'react';
import BoardCard from './BoardCard';

const ROTATE_MS = 3500;

const prefersReducedMotion = () =>
  typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

// A real horizontally-scrollable, snap row (native smooth scroll gives the
// right-to-left pan for free) — native scrollbar hidden via .scrollbar-none,
// with matching prev/next arrows. Auto-advances one card at a time through
// the whole board (not a full page of 3), wrapping back to #1 once it runs
// out of overalls, and keeps the real rank per card the whole way through.
export default function BoardCarousel({ overalls }) {
  const scrollRef = useRef(null);
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);

  const count = overalls.length;

  const goToIndex = useCallback((target) => {
    const el = scrollRef.current;
    if (!el || count === 0) return;
    const clamped = ((target % count) + count) % count;
    const cardStep = el.scrollWidth / count;
    el.scrollTo({ left: clamped * cardStep, behavior: prefersReducedMotion() ? 'auto' : 'smooth' });
    setIndex(clamped);
  }, [count]);

  useEffect(() => {
    if (paused || count <= 1) return;
    const id = setInterval(() => goToIndex(index + 1), ROTATE_MS);
    return () => clearInterval(id);
  }, [paused, count, index, goToIndex]);

  if (count === 0) return null;

  return (
    <div className="relative" onMouseEnter={() => setPaused(true)} onMouseLeave={() => setPaused(false)}>
      <div
        ref={scrollRef}
        className="scrollbar-none flex snap-x snap-mandatory gap-5 overflow-x-auto motion-safe:scroll-smooth sm:gap-6"
      >
        {overalls.map((o, i) => (
          <div key={o.id} className="w-full flex-shrink-0 snap-start sm:w-[calc((100%-3rem)/3)]">
            <BoardCard overall={o} rank={i + 1} />
          </div>
        ))}
      </div>

      {count > 1 && (
        <>
          <button
            onClick={() => goToIndex(index - 1)}
            aria-label="Previous rank"
            className="absolute left-1 top-1/2 z-10 flex h-8 w-8 -translate-y-1/2 items-center justify-center border border-ink-line bg-ink/90 text-bone transition-colors hover:border-brand hover:text-brand"
          >
            <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <button
            onClick={() => goToIndex(index + 1)}
            aria-label="Next rank"
            className="absolute right-1 top-1/2 z-10 flex h-8 w-8 -translate-y-1/2 items-center justify-center border border-ink-line bg-ink/90 text-bone transition-colors hover:border-brand hover:text-brand"
          >
            <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </>
      )}
    </div>
  );
}
