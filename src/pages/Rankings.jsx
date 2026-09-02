import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import Footer from '../components/Footer';
import MovementBadge from '../components/MovementBadge';

const API_URL = import.meta.env.VITE_API_URL;

const VIEWS = [
  { key: 'top', label: 'Top Overalls' },
  { key: 'rising', label: 'Rising' },
  { key: 'falling', label: 'Falling' },
  { key: 'new', label: 'Newly Rated' },
  { key: 'underground', label: 'Underground' },
  { key: 'legends', label: 'All-Time / Legends' },
];

export default function Rankings() {
  const [view, setView] = useState('top');
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);
  // Views the data actually supports — populated after the initial 'top' + spot checks
  const [supportedViews, setSupportedViews] = useState(new Set(['top']));

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    fetch(`${API_URL}/api/overalls/rankings?view=${view}&limit=100`)
      .then(r => r.json())
      .then(data => {
        if (cancelled) return;
        setRows(Array.isArray(data) ? data : []);
        if (Array.isArray(data) && data.length > 0) {
          setSupportedViews(prev => new Set(prev).add(view));
        }
      })
      .catch(() => !cancelled && setRows([]))
      .finally(() => !cancelled && setLoading(false));
    return () => { cancelled = true; };
  }, [view]);

  // Probe the other views once, quietly, so we know which tabs to show at all
  useEffect(() => {
    VIEWS.filter(v => v.key !== 'top').forEach(({ key }) => {
      fetch(`${API_URL}/api/overalls/rankings?view=${key}&limit=1`)
        .then(r => r.json())
        .then(data => {
          if (Array.isArray(data) && data.length > 0) {
            setSupportedViews(prev => new Set(prev).add(key));
          }
        })
        .catch(() => {});
    });
  }, []);

  return (
    <div className="min-h-screen bg-ink">
      <Helmet>
        <title>Rankings | 2koveralls</title>
        <meta name="description" content="The rap leaderboard — top Overalls, risers, fallers, and legends." />
      </Helmet>

      <div className="mx-auto max-w-5xl px-4 py-12 sm:px-6 lg:px-8">
        <h1 className="font-display text-4xl uppercase text-bone sm:text-5xl">Rankings</h1>
        <p className="mt-2 text-sm text-bone-dim">The board, ranked.</p>

        <div className="scrollbar-none mt-8 flex gap-2 overflow-x-auto border-b border-ink-line pb-4">
          {VIEWS.filter(v => supportedViews.has(v.key)).map((v) => (
            <button
              key={v.key}
              onClick={() => setView(v.key)}
              className={`flex-shrink-0 border px-3 py-1.5 text-xs font-bold uppercase tracking-wide transition-colors ${
                view === v.key ? 'border-brand bg-brand text-ink' : 'border-ink-line text-bone-dim hover:text-brand'
              }`}
            >
              {v.label}
            </button>
          ))}
        </div>

        <div className="mt-6">
          {loading ? (
            <div className="flex justify-center py-16">
              <div className="h-8 w-8 animate-spin rounded-full border-b-2 border-brand" />
            </div>
          ) : rows.length === 0 ? (
            <p className="border border-ink-line bg-ink-soft p-10 text-center text-sm text-bone-dim">
              Nothing to show for this view yet.
            </p>
          ) : (
            <div className="divide-y divide-ink-line border border-ink-line">
              {rows.map((row) => (
                <Link
                  key={row.id}
                  to={`/overalls/${row.slug}`}
                  className="flex items-center gap-4 bg-ink-soft px-3 py-3 transition-colors hover:bg-ink-raised sm:px-4"
                >
                  <span className="w-8 flex-shrink-0 font-display text-lg text-bone-dim">
                    {String(row.rank).padStart(2, '0')}
                  </span>
                  <div className="h-12 w-12 flex-shrink-0 overflow-hidden border border-ink-line">
                    <img src={row.image_url} alt={row.title} loading="lazy" className="h-full w-full object-cover" style={{ objectPosition: `${row.crop_x ?? 50}% ${row.crop_y ?? 50}%` }} />
                  </div>
                  <span className="flex-1 truncate text-sm font-bold uppercase tracking-wide text-bone sm:text-base">
                    {row.title}
                  </span>
                  {typeof row.overall === 'number' && (
                    <span className="font-display text-lg text-brand sm:text-xl">{row.overall} OVR</span>
                  )}
                  <MovementBadge change={row.change} className="w-14 flex-shrink-0 justify-end" />
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>

      <Footer />
    </div>
  );
}
