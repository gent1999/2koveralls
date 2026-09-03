import { Link } from 'react-router-dom';
import { CATEGORY_LABELS } from './ArticleCard';

const formatDate = (dateString) =>
  new Date(dateString).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });

// Full-bleed image card with overlaid text for the smaller stories next to
// the featured article in "The Latest" — a dedicated component (not the
// shared ArticleCard) so this section's sizing doesn't bleed into the News
// page or Related Coverage.
export default function LatestSideCard({ article, to, author }) {
  const image = article.thumbnail_url || article.image_url;
  const categoryLabel = CATEGORY_LABELS[article.category] || 'Article';

  return (
    <Link
      to={to}
      className="group relative flex-1 aspect-[16/9] overflow-hidden border border-ink-line transition-all duration-300 hover:-translate-y-0.5 hover:border-brand lg:aspect-auto lg:min-h-[180px]"
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
      <div className="absolute inset-0 bg-gradient-to-t from-black via-black/60 to-black/10" />
      <div className="absolute bottom-0 left-0 right-0 p-3">
        <span className="text-[10px] font-bold uppercase tracking-wider text-brand">{categoryLabel}</span>
        <h3 className="mt-1 text-sm font-bold uppercase leading-snug text-bone drop-shadow-md line-clamp-2 transition-colors group-hover:text-brand">
          {article.title}
        </h3>
        <p className="mt-1 text-xs text-bone-dim">
          By {article.author || author} · {formatDate(article.created_at)}
        </p>
      </div>
    </Link>
  );
}
