import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import MovementBadge from './MovementBadge';

const TrendIcon = () => (
  <svg className="h-3.5 w-3.5 flex-shrink-0 text-brand" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M3 16l6-6 4 4 7-7" />
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M14 7h6v6" />
  </svg>
);

function TickerItem({ item }) {
  return (
    <Link
      to={`/overalls/${item.slug}`}
      className="flex h-full flex-shrink-0 items-center gap-2 border-r border-ink-line px-4 outline-none transition-colors hover:bg-ink-soft focus-visible:bg-ink-soft focus-visible:ring-1 focus-visible:ring-inset focus-visible:ring-brand"
    >
      {item.image_url && (
        <img
          src={item.image_url}
          alt=""
          aria-hidden="true"
          loading="lazy"
          className="h-5 w-5 flex-shrink-0 rounded-full border border-ink-line object-cover"
          style={{ objectPosition: `${item.crop_x ?? 50}% ${item.crop_y ?? 50}%` }}
        />
      )}
      <span className="text-sm font-bold uppercase tracking-wide text-bone">{item.title}</span>
      {item.isNew || item.change ? (
        <MovementBadge change={item.change} isNew={item.isNew} />
      ) : typeof item.overall === 'number' ? (
        <span className="text-xs font-bold text-brand">{item.overall} OVR</span>
      ) : null}
    </Link>
  );
}

// Compact "TRENDING NOW" strip, sports-ticker style. Renders nothing if there's
// nothing to show — no fake permanent data, no placeholder movement.
export default function TrendingTicker({ items }) {
  const [marquee, setMarquee] = useState(false);

  useEffect(() => {
    const mqMotion = window.matchMedia('(prefers-reduced-motion: no-preference)');
    const mqWidth = window.matchMedia('(min-width: 768px)');
    const update = () => setMarquee(mqMotion.matches && mqWidth.matches);
    update();
    mqMotion.addEventListener('change', update);
    mqWidth.addEventListener('change', update);
    return () => {
      mqMotion.removeEventListener('change', update);
      mqWidth.removeEventListener('change', update);
    };
  }, []);

  if (!items || items.length === 0) return null;

  // Only duplicate for the seamless marquee loop — never for the static/scrollable
  // (mobile or reduced-motion) view, where a repeat would just look like duplicate data.
  const displayItems = marquee && items.length > 3 ? [...items, ...items] : items;

  return (
    <div className="flex h-16 items-stretch border-y border-ink-line bg-black">
      <div className="mx-auto flex w-full max-w-7xl items-stretch">
        <div className="flex h-full flex-shrink-0 items-center gap-2 border-r border-ink-line px-4 text-xs font-bold uppercase tracking-wider text-brand">
          <TrendIcon />
          <span>Trending Now</span>
        </div>
        <div className="scrollbar-none flex flex-1 items-stretch overflow-x-auto motion-safe:md:overflow-hidden">
          <div className="flex h-full flex-shrink-0 items-stretch motion-safe:md:animate-ticker motion-safe:md:hover:[animation-play-state:paused]">
            {displayItems.map((item, i) => (
              <TickerItem key={`${item.id}-${i}`} item={item} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
