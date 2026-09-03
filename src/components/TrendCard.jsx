import { Link } from 'react-router-dom';

// Compact trend-article card. Admin's crop tool already saves thumbnail_url
// at a fixed 16:9 (confirmed 1080x607 in Cloudinary) — using that same ratio
// here means the card shows the whole cropped picture with no further cropping.
export default function TrendCard({ article, to }) {
  const image = article.thumbnail_url || article.image_url;

  return (
    <Link
      to={to}
      className="group relative block aspect-video overflow-hidden border border-ink-line bg-ink-soft transition-colors hover:border-brand"
    >
      {image ? (
        <img
          src={image}
          alt={article.title}
          loading="lazy"
          className="absolute inset-0 h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
        />
      ) : (
        <div className="absolute inset-0 bg-ink-raised" />
      )}
      <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-black/10" />
      <div className="absolute bottom-0 left-0 right-0 p-2.5">
        <h3 className="text-xs font-bold uppercase leading-snug text-bone drop-shadow-md line-clamp-3 sm:text-sm">
          {article.title}
        </h3>
      </div>
    </Link>
  );
}
