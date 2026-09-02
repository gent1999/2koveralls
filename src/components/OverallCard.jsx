import { Link } from 'react-router-dom';
import MovementBadge from './MovementBadge';
import TierBadge from './TierBadge';

const SIZES = {
  small: { aspect: 'aspect-square', title: 'text-xs', ovr: 'text-lg' },
  medium: { aspect: 'aspect-[3/4]', title: 'text-sm', ovr: 'text-2xl' },
  large: { aspect: 'aspect-[3/4]', title: 'text-base', ovr: 'text-3xl' },
};

// The star component — a collectible-card presentation of an artist's Overall rating.
// Reused across the Board, Directory, Rankings thumbnails, and Related sections.
export default function OverallCard({ overall, size = 'medium', rank }) {
  const s = SIZES[size] || SIZES.medium;

  return (
    <Link
      to={`/overalls/${overall.slug}`}
      className="group relative block overflow-hidden border border-ink-line bg-ink-soft transition-colors hover:border-brand"
    >
      <div className={`relative ${s.aspect} overflow-hidden`}>
        <img
          src={overall.image_url}
          alt={overall.title}
          loading="lazy"
          className="absolute inset-0 h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
          style={{ objectPosition: `${overall.crop_x ?? 50}% ${overall.crop_y ?? 50}%` }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/10 to-transparent" />

        {rank && (
          <div className="absolute left-0 top-0 bg-black/70 px-2 py-1 font-display text-sm text-bone">
            #{rank}
          </div>
        )}

        {typeof overall.overall === 'number' && (
          <div className={`absolute right-0 top-0 bg-brand px-2 py-1 font-display leading-none text-ink ${s.ovr}`}>
            {overall.overall}
          </div>
        )}

        <div className="absolute bottom-0 left-0 right-0 p-2">
          <h3 className={`${s.title} font-bold uppercase tracking-wide text-bone line-clamp-1 drop-shadow-md`}>
            {overall.title}
          </h3>
          <div className="mt-1 flex items-center gap-2">
            {overall.artist_tier && <TierBadge tier={overall.artist_tier} />}
            <MovementBadge change={overall.change} />
          </div>
        </div>
      </div>
    </Link>
  );
}
