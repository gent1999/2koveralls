import { Link } from 'react-router-dom';
import MovementBadge from './MovementBadge';

// Horizontal "TRENDING NOW" strip. Renders nothing if there's nothing to show —
// no fake permanent data, no placeholder movement.
export default function TrendingTicker({ items }) {
  if (!items || items.length === 0) return null;

  // Duplicate the list so the CSS marquee can loop seamlessly on desktop
  const loop = [...items, ...items];

  const Item = ({ item }) => (
    <Link
      to={`/overalls/${item.slug}`}
      className="flex flex-shrink-0 items-center gap-2 border-r border-ink-line px-4 py-3 text-sm hover:text-brand"
    >
      <span className="font-bold uppercase tracking-wide text-bone">{item.title}</span>
      {typeof item.overall === 'number' && (
        <span className="text-bone-dim">{item.overall} OVR</span>
      )}
      <MovementBadge change={item.change} isNew={item.isNew} />
    </Link>
  );

  return (
    <div className="border-y border-ink-line bg-ink-soft">
      <div className="mx-auto flex max-w-7xl items-stretch">
        <div className="flex flex-shrink-0 items-center bg-brand px-4 py-3 text-xs font-bold uppercase tracking-wider text-ink">
          Trending Now
        </div>
        <div className="scrollbar-none flex flex-1 overflow-x-auto sm:overflow-hidden">
          <div className="flex flex-shrink-0 sm:animate-ticker">
            {(items.length > 4 ? loop : items).map((item, i) => (
              <Item key={`${item.id}-${i}`} item={item} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
