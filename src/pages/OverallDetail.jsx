import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import SpotifyEmbed from '../components/SpotifyEmbed';
import HilltopMultiBanner from '../components/HilltopMultiBanner';
import HilltopMobileBanner from '../components/HilltopMobileBanner';
import Footer from '../components/Footer';
import OverallCard from '../components/OverallCard';
import ArticleCard from '../components/ArticleCard';
import MovementBadge from '../components/MovementBadge';
import TierBadge from '../components/TierBadge';
import RatingHistoryChart from '../components/RatingHistoryChart';
import { stripMarkdown } from '../utils/markdownUtils';
import { generateNewsUrl } from '../utils/slugify';

function OverallDetail() {
  const { slug } = useParams();
  const [overall, setOverall] = useState(null);
  const [history, setHistory] = useState(null);
  const [related, setRelated] = useState({ articles: [], artists: [] });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const API_URL = import.meta.env.VITE_API_URL;

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setError('');

    const fetchAll = async () => {
      try {
        const res = await fetch(`${API_URL}/api/overalls/slug/${slug}`);
        if (!res.ok) throw new Error('Overall not found');
        const data = await res.json();
        if (cancelled) return;
        setOverall(data);

        const [historyData, relatedData] = await Promise.all([
          fetch(`${API_URL}/api/overalls/slug/${slug}/history`).then(r => r.json()).catch(() => null),
          fetch(`${API_URL}/api/overalls/slug/${slug}/related`).then(r => r.json()).catch(() => ({ articles: [], artists: [] })),
        ]);
        if (cancelled) return;
        setHistory(historyData);
        setRelated(relatedData || { articles: [], artists: [] });
      } catch (err) {
        if (!cancelled) setError(err.message);
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    fetchAll();
    return () => { cancelled = true; };
  }, [slug]);

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-ink">
        <div className="h-10 w-10 animate-spin rounded-full border-b-2 border-brand" />
      </div>
    );
  }

  if (error || !overall) {
    return (
      <div className="mx-auto max-w-4xl px-4 py-12 text-center sm:px-6 lg:px-8">
        <p className="text-bone">{error || 'Overall not found'}</p>
        <Link to="/" className="mt-4 inline-block text-brand hover:text-bone">← Back to Home</Link>
      </div>
    );
  }

  const formatDate = (dateString) =>
    new Date(dateString).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });

  const overallDescription = stripMarkdown(overall.content).substring(0, 160) + '...';
  const overallUrl = typeof window !== 'undefined' ? window.location.href : '';
  const attributes = overall.attributes && typeof overall.attributes === 'object' ? Object.entries(overall.attributes) : [];

  return (
    <div className="min-h-screen bg-ink">
      <Helmet>
        <title>{overall.title} Overall Rating | 2koveralls</title>
        <meta name="description" content={overallDescription} />
        <link rel="canonical" href={overallUrl} />
        <meta property="og:type" content="article" />
        <meta property="og:url" content={overallUrl} />
        <meta property="og:title" content={`${overall.title} Overall Rating | 2koveralls`} />
        <meta property="og:description" content={overallDescription} />
        {overall.image_url && <meta property="og:image" content={overall.image_url} />}
        <meta property="og:site_name" content="2koveralls" />
        <meta property="article:published_time" content={overall.created_at} />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:url" content={overallUrl} />
        <meta name="twitter:title" content={`${overall.title} Overall Rating | 2koveralls`} />
        <meta name="twitter:description" content={overallDescription} />
        {overall.image_url && <meta name="twitter:image" content={overall.image_url} />}
      </Helmet>

      <div className="mx-auto max-w-6xl px-4 pt-8 sm:px-6 lg:px-8">
        <Link to="/overalls" className="inline-flex items-center text-sm text-bone-dim hover:text-brand">
          <svg className="mr-2 h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          Back to Overalls
        </Link>

        <HilltopMobileBanner />

        {/* Card + stat row */}
        <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-[320px_1fr]">
          <div className="border border-ink-line bg-ink-soft">
            <div className="relative aspect-square overflow-hidden">
              <img src={overall.image_url} alt={overall.title} className="absolute inset-0 h-full w-full object-cover" />
              {typeof overall.overall === 'number' && (
                <div className="absolute right-0 top-0 bg-brand px-3 py-1.5 font-display text-3xl leading-none text-ink">
                  {overall.overall}
                </div>
              )}
            </div>
          </div>

          <div>
            <h1 className="font-display text-4xl uppercase leading-none text-bone sm:text-5xl">{overall.title}</h1>
            <div className="mt-2 flex flex-wrap items-center gap-3 text-sm text-bone-dim">
              {overall.artist_tier && <TierBadge tier={overall.artist_tier} />}
              {overall.location && <span>{overall.location}</span>}
              <span>Rated {formatDate(overall.created_at)}</span>
            </div>

            {history && (history.current !== null || history.peak !== null) && (
              <div className="mt-6 grid grid-cols-2 gap-px border border-ink-line bg-ink-line sm:grid-cols-4">
                {[
                  ['Current', history.current],
                  ['Previous', history.previous],
                  ['Peak', history.peak],
                  ['Trend', history.change !== null ? <MovementBadge change={history.change} /> : '—'],
                ].map(([label, value]) => (
                  <div key={label} className="bg-ink-soft p-4">
                    <p className="text-[10px] font-bold uppercase tracking-wider text-bone-dim">{label}</p>
                    <p className="mt-1 font-display text-2xl text-bone">{value ?? '—'}</p>
                  </div>
                ))}
              </div>
            )}

            {overall.instagram_link && (
              <a
                href={overall.instagram_link}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-6 inline-flex items-center border border-brand px-4 py-2 text-sm font-bold uppercase tracking-wide text-brand hover:bg-brand hover:text-ink"
              >
                View on Instagram
              </a>
            )}
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="flex flex-col gap-12 lg:flex-row">
          <div className="min-w-0 flex-1 space-y-12">
            {/* WHY */}
            <div id="why" className="scroll-mt-24">
              <h2 className="font-display text-2xl uppercase text-bone">Why {overall.overall ?? ''}?</h2>
              <div className="mt-4 max-w-none">
                <ReactMarkdown
                  remarkPlugins={[remarkGfm]}
                  components={{
                    h1: ({node, ...props}) => <h1 {...props} className="mt-8 mb-4 border-b border-brand pb-2 text-2xl font-bold text-bone" />,
                    h2: ({node, ...props}) => <h2 {...props} className="mt-6 mb-3 text-xl font-bold text-bone" />,
                    h3: ({node, ...props}) => <h3 {...props} className="mt-5 mb-2 text-lg font-bold text-bone" />,
                    p: ({node, ...props}) => <p {...props} className="mb-4 leading-relaxed text-bone-dim" />,
                    a: ({node, ...props}) => <a {...props} target="_blank" rel="noopener noreferrer" className="font-medium text-brand underline underline-offset-2" />,
                    ul: ({node, ...props}) => <ul {...props} className="mb-4 list-disc space-y-1 pl-6 text-bone-dim" />,
                    ol: ({node, ...props}) => <ol {...props} className="mb-4 list-decimal space-y-1 pl-6 text-bone-dim" />,
                    blockquote: ({node, ...props}) => <blockquote {...props} className="my-4 border-l-4 border-brand bg-ink-soft py-1 pl-4 italic text-bone-dim" />,
                    strong: ({node, ...props}) => <strong {...props} className="font-bold text-bone" />,
                    img: ({node, ...props}) => <img {...props} className="my-4 w-full" />,
                  }}
                >
                  {overall.content}
                </ReactMarkdown>
              </div>
            </div>

            {/* ATTRIBUTES */}
            {attributes.length > 0 && (
              <div>
                <h2 className="font-display text-2xl uppercase text-bone">Attributes</h2>
                <div className="mt-4 space-y-3">
                  {attributes.map(([label, value]) => (
                    <div key={label}>
                      <div className="flex items-center justify-between text-sm">
                        <span className="font-bold uppercase tracking-wide text-bone-dim">{label}</span>
                        <span className="font-display text-lg text-bone">{value}</span>
                      </div>
                      <div className="mt-1 h-1.5 w-full bg-ink-line">
                        <div className="h-full bg-brand" style={{ width: `${Math.min(100, Math.max(0, value))}%` }} />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* RATING HISTORY */}
            {history?.timeline?.length > 1 && (
              <div>
                <h2 className="font-display text-2xl uppercase text-bone">Rating History</h2>
                <div className="mt-4 border border-ink-line bg-ink-soft p-4">
                  <RatingHistoryChart timeline={history.timeline} />
                </div>
              </div>
            )}

            {/* RELATED COVERAGE */}
            {related.articles.length > 0 && (
              <div>
                <h2 className="font-display text-2xl uppercase text-bone">Related Coverage</h2>
                <div className="mt-4 flex flex-col gap-3">
                  {related.articles.map((a) => (
                    <ArticleCard key={a.id} article={a} to={generateNewsUrl(a.id, a.title)} />
                  ))}
                </div>
              </div>
            )}

            {/* RELATED ARTISTS */}
            {related.artists.length > 0 && (
              <div>
                <h2 className="font-display text-2xl uppercase text-bone">Related Artists</h2>
                <div className="mt-4 grid grid-cols-2 gap-4 sm:grid-cols-3">
                  {related.artists.map((o) => (
                    <OverallCard key={o.id} overall={o} size="small" />
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Ad Sidebar */}
          <div className="hidden w-72 flex-shrink-0 lg:block">
            <div className="sticky top-24 space-y-4">
              <HilltopMultiBanner />
              <div className="h-[352px] overflow-hidden">
                <SpotifyEmbed pageType="article" />
              </div>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}

export default OverallDetail;
