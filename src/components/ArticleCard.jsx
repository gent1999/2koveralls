import { Link } from 'react-router-dom';

const CATEGORY_LABELS = {
  trends: 'News',
  article: 'Feature',
  interview: 'Interview',
  review: 'Review',
  editorial: 'Editorial',
  rating_update: 'Rating Update',
  rankings: 'Rankings',
};

export { CATEGORY_LABELS };

const formatDate = (dateString) =>
  new Date(dateString).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });

export default function ArticleCard({ article, to, featured = false, author }) {
  const image = article.thumbnail_url || article.image_url;
  const categoryLabel = CATEGORY_LABELS[article.category] || 'Article';

  if (featured) {
    return (
      <Link to={to} className="group relative block aspect-[16/10] overflow-hidden border border-ink-line sm:aspect-[16/9]">
        {image && (
          <img
            src={image}
            alt={article.title}
            loading="lazy"
            className="absolute inset-0 h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
          />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/60 to-black/10" />
        <div className="absolute left-0 top-0 bg-brand px-3 py-1 text-xs font-bold uppercase tracking-wider text-ink">
          {categoryLabel}
        </div>
        <div className="absolute bottom-0 left-0 right-0 p-5 sm:p-6">
          <h2 className="font-display text-2xl uppercase leading-tight text-bone drop-shadow-lg sm:text-3xl line-clamp-3">
            {article.title}
          </h2>
          <p className="mt-2 text-xs text-bone-dim">
            By {article.author || author} · {formatDate(article.created_at)}
          </p>
        </div>
      </Link>
    );
  }

  return (
    <Link to={to} className="group flex gap-4 border border-ink-line bg-ink-soft transition-colors hover:border-brand">
      {image ? (
        <div className="relative w-28 flex-shrink-0 self-stretch overflow-hidden sm:w-36">
          <img
            src={image}
            alt={article.title}
            loading="lazy"
            className="absolute inset-0 h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
          />
        </div>
      ) : (
        <div className="w-28 flex-shrink-0 bg-ink-raised sm:w-36" />
      )}
      <div className="flex-1 py-3 pr-3">
        <span className="text-[10px] font-bold uppercase tracking-wider text-brand">{categoryLabel}</span>
        <h3 className="mt-1 text-sm font-bold uppercase leading-snug text-bone line-clamp-2 group-hover:text-brand sm:text-base">
          {article.title}
        </h3>
        <p className="mt-1 text-xs text-bone-dim">
          By {article.author || author} · {formatDate(article.created_at)}
        </p>
      </div>
    </Link>
  );
}
