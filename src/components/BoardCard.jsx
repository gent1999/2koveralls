import { Link } from 'react-router-dom';
import MovementBadge from './MovementBadge';

// Dedicated card for THE BOARD — a real leaderboard position (not a duplicate
// OVR badge, the artwork already carries the rating), plus a footer with the
// artist name, current OVR, and real movement if history exists. The #1 spot
// gets a stronger orange treatment; everything else stays on a muted border.
export default function BoardCard({ overall, rank }) {
  const isTop = rank === 1;

  return (
    <Link
      to={`/overalls/${overall.slug}`}
      className={`group relative block flex-shrink-0 border bg-ink-soft transition-all duration-200 md:hover:-translate-y-1 ${
        isTop
          ? 'border-brand shadow-[0_0_22px_-8px_rgba(249,115,22,0.55)]'
          : 'border-ink-line md:hover:border-brand md:hover:shadow-[0_0_18px_-9px_rgba(249,115,22,0.45)]'
      }`}
    >
      <div className="relative aspect-[3/4] overflow-hidden">
        <img
          src={overall.image_url}
          alt={overall.title}
          loading="lazy"
          className="absolute inset-0 h-full w-full object-cover transition-transform duration-300 md:group-hover:scale-[1.03]"
          style={{ objectPosition: `${overall.crop_x ?? 50}% ${overall.crop_y ?? 50}%` }}
        />

        {rank && (
          <div
            className={`absolute right-0 top-0 px-2.5 py-1 font-display text-sm leading-none ${
              isTop ? 'bg-brand text-black' : 'bg-black/70 text-bone'
            }`}
          >
            #{rank}
          </div>
        )}
      </div>

      <div className="border-t border-ink-line px-3 py-2.5">
        <h3 className="truncate text-sm font-bold uppercase tracking-wide text-bone">
          {overall.title}
        </h3>
        {(typeof overall.overall === 'number' || overall.change) && (
          <div className="mt-1 flex items-center gap-2">
            {typeof overall.overall === 'number' && (
              <span className="font-display text-base leading-none text-brand">{overall.overall} OVR</span>
            )}
            <MovementBadge change={overall.change} />
          </div>
        )}
      </div>
    </Link>
  );
}
