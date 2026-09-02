import { Link } from 'react-router-dom';

export default function SectionHeader({ title, subtitle, viewAllTo, children }) {
  return (
    <div className="mb-6 flex flex-wrap items-end justify-between gap-4 border-b border-ink-line pb-4">
      <div>
        <h2 className="font-display text-3xl uppercase tracking-wide text-bone sm:text-4xl">
          {title}
        </h2>
        {subtitle && <p className="mt-1 text-sm text-bone-dim">{subtitle}</p>}
      </div>
      <div className="flex items-center gap-4">
        {children}
        {viewAllTo && (
          <Link
            to={viewAllTo}
            className="text-sm font-bold uppercase tracking-wide text-brand transition-colors hover:text-bone"
          >
            View All →
          </Link>
        )}
      </div>
    </div>
  );
}
