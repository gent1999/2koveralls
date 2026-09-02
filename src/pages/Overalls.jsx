import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import Footer from '../components/Footer';
import OverallCard from '../components/OverallCard';
import { TIER_LABELS } from '../components/TierBadge';

const API_URL = import.meta.env.VITE_API_URL;

const SORTS = [
  { key: 'highest', label: 'Highest Overall' },
  { key: 'lowest', label: 'Lowest Overall' },
  { key: 'newest', label: 'Newest Ratings' },
  { key: 'alpha', label: 'Alphabetical' },
  { key: 'updated', label: 'Recently Updated' },
  { key: 'rising', label: 'Biggest Risers' },
  { key: 'falling', label: 'Biggest Fallers' },
];

export default function Overalls() {
  const [searchParams] = useSearchParams();
  const [overalls, setOveralls] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [sort, setSort] = useState('highest');
  const [tier, setTier] = useState(searchParams.get('tier') || '');
  const [loading, setLoading] = useState(true);
  const [availableSorts, setAvailableSorts] = useState(new Set(['highest', 'lowest', 'newest', 'alpha', 'updated']));

  useEffect(() => {
    // Probe risers/fallers once to know whether history data supports those sorts
    ['rising', 'falling'].forEach((key) => {
      fetch(`${API_URL}/api/overalls?sort=${key}`)
        .then(r => r.json())
        .then(data => {
          if (Array.isArray(data) && data.length > 0) {
            setAvailableSorts(prev => new Set(prev).add(key));
          }
        })
        .catch(() => {});
    });
  }, []);

  useEffect(() => {
    setLoading(true);
    const params = new URLSearchParams();
    if (searchQuery.trim()) params.set('q', searchQuery.trim());
    if (tier) params.set('tier', tier);
    if (sort) params.set('sort', sort);

    const timeout = setTimeout(() => {
      fetch(`${API_URL}/api/overalls?${params.toString()}`)
        .then(r => r.json())
        .then(data => setOveralls(Array.isArray(data) ? data : []))
        .catch(() => setOveralls([]))
        .finally(() => setLoading(false));
    }, searchQuery ? 250 : 0);

    return () => clearTimeout(timeout);
  }, [searchQuery, sort, tier]);

  return (
    <div className="min-h-screen bg-ink">
      <Helmet>
        <title>Overalls | 2koveralls</title>
        <meta name="description" content="Browse every artist Overall rating on 2K Overalls." />
        <meta property="og:title" content="Overalls | 2koveralls" />
        <meta property="og:site_name" content="2koveralls" />
      </Helmet>

      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <h1 className="font-display text-4xl uppercase text-bone sm:text-5xl">Overalls</h1>
        <p className="mt-2 text-sm text-bone-dim">Every artist. Every rating.</p>

        <div className="mt-8 flex flex-col gap-4 sm:flex-row sm:items-center">
          <input
            type="text"
            placeholder="Search by name..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="flex-1 border border-ink-line bg-ink-soft px-4 py-2.5 text-sm text-bone placeholder-bone-dim focus:border-brand focus:outline-none"
          />
          <select
            value={sort}
            onChange={(e) => setSort(e.target.value)}
            className="border border-ink-line bg-ink-soft px-4 py-2.5 text-sm text-bone focus:border-brand focus:outline-none"
          >
            {SORTS.filter(s => availableSorts.has(s.key)).map(s => (
              <option key={s.key} value={s.key}>{s.label}</option>
            ))}
          </select>
        </div>

        <div className="scrollbar-none mt-4 flex gap-2 overflow-x-auto">
          {['', ...Object.keys(TIER_LABELS)].map((t) => (
            <button
              key={t || 'all'}
              onClick={() => setTier(t)}
              className={`flex-shrink-0 border px-3 py-1.5 text-xs font-bold uppercase tracking-wide transition-colors ${
                tier === t ? 'border-brand bg-brand text-ink' : 'border-ink-line text-bone-dim hover:text-brand'
              }`}
            >
              {t ? TIER_LABELS[t] : 'All'}
            </button>
          ))}
        </div>

        <p className="mt-4 text-xs text-bone-dim">
          {overalls.length} {overalls.length === 1 ? 'result' : 'results'}
        </p>

        <div className="mt-4">
          {loading ? (
            <div className="flex justify-center py-16">
              <div className="h-8 w-8 animate-spin rounded-full border-b-2 border-brand" />
            </div>
          ) : overalls.length === 0 ? (
            <p className="border border-ink-line bg-ink-soft p-10 text-center text-sm text-bone-dim">
              {searchQuery ? 'No results found.' : 'No Overalls available yet.'}
            </p>
          ) : (
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
              {overalls.map((o) => (
                <OverallCard key={o.id} overall={o} size="medium" />
              ))}
            </div>
          )}
        </div>
      </div>

      <Footer />
    </div>
  );
}
