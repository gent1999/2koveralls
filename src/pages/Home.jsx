import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import Footer from '../components/Footer';
import Hero from '../components/Hero';
import OverallCard from '../components/OverallCard';
import BoardCarousel from '../components/BoardCarousel';
import TrendCard from '../components/TrendCard';
import MovementBadge from '../components/MovementBadge';
import { TIER_LABELS } from '../components/TierBadge';
import SectionHeader from '../components/SectionHeader';
import TrendingTicker from '../components/TrendingTicker';
import ArticleCard from '../components/ArticleCard';
import LatestSideCard from '../components/LatestSideCard';
import PlaylistCard from '../components/PlaylistCard';
import SpotifyEmbed from '../components/SpotifyEmbed';
import CommunityCTA from '../components/CommunityCTA';
import { generateNewsUrl } from '../utils/slugify';
import { stripMarkdown } from '../utils/markdownUtils';

const API_URL = import.meta.env.VITE_API_URL;

const TIER_FILTERS = ['mainstream', 'underground', 'rising', 'legend'];

export default function Home() {
  const [hero, setHero] = useState(null);
  const [overalls, setOveralls] = useState([]);
  const [stockWatch, setStockWatch] = useState({ up: [], down: [] });
  const [featuredArticle, setFeaturedArticle] = useState(null);
  const [writeUps, setWriteUps] = useState([]);
  const [trends, setTrends] = useState([]);
  const [playlists, setPlaylists] = useState([]);
  const [boardTier, setBoardTier] = useState('all');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [
          heroRes, overallsRes, stockRes, koverallsFeaturedRes, koverallsWriteUpsRes, trendsRes, playlistsRes,
        ] = await Promise.all([
          fetch(`${API_URL}/api/overalls/featured/hero`).then(r => r.json()).catch(() => null),
          fetch(`${API_URL}/api/overalls`).then(r => r.json()).catch(() => []),
          fetch(`${API_URL}/api/overalls/stock-watch`).then(r => r.json()).catch(() => ({ up: [], down: [] })),
          fetch(`${API_URL}/api/koveralls-articles/featured/article`).then(r => r.json()).catch(() => ({ article: null })),
          fetch(`${API_URL}/api/koveralls-articles`).then(r => r.json()).catch(() => []),
          fetch(`${API_URL}/api/lowkeygrid/articles`).then(r => r.json()).catch(() => []),
          fetch(`${API_URL}/api/spotify-embeds?site=lowkeygrid&page_type=playlist`).then(r => r.json()).catch(() => ({ embeds: [] })),
        ]);

        setHero(heroRes);
        setOveralls(Array.isArray(overallsRes) ? overallsRes : []);
        setStockWatch(stockRes || { up: [], down: [] });
        setTrends(Array.isArray(trendsRes) ? trendsRes : []);
        setPlaylists(playlistsRes?.embeds || []);

        // Native 2koveralls write-ups first; only fall back to Cry808's
        // cross-promoted article/interview content when there's nothing
        // native yet, so "The Latest" is never empty.
        const nativeWriteUps = Array.isArray(koverallsWriteUpsRes) ? koverallsWriteUpsRes : [];
        if (nativeWriteUps.length > 0) {
          setWriteUps(nativeWriteUps);
        } else {
          const fallbackRes = await fetch(`${API_URL}/api/lowkeygrid/articles/writeups`).then(r => r.json()).catch(() => []);
          setWriteUps(Array.isArray(fallbackRes) ? fallbackRes : []);
        }

        // 2koveralls' own featured write-up first; fall back to Cry808's featured article
        if (koverallsFeaturedRes?.article) {
          setFeaturedArticle(koverallsFeaturedRes.article);
        } else {
          // This endpoint returns { articles: [...] } (up to 5 featured, or 3
          // latest as a fallback) — take the first one.
          const cryRes = await fetch(`${API_URL}/api/articles/featured/article`).then(r => r.json()).catch(() => ({ articles: [] }));
          setFeaturedArticle(cryRes?.articles?.[0] || null);
        }
      } catch (error) {
        console.error('Error fetching home data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const availableTiers = TIER_FILTERS.filter(t => overalls.some(o => o.artist_tier === t));

  const boardOveralls = (boardTier === 'all' ? overalls : overalls.filter(o => o.artist_tier === boardTier))
    .slice()
    .sort((a, b) => (b.overall ?? -1) - (a.overall ?? -1))
    .slice(0, 6);

  const boardTrends = trends.slice(0, 4);

  const rookieClass = overalls
    .filter(o => o.artist_tier === 'rising')
    .sort((a, b) => (b.overall ?? -1) - (a.overall ?? -1))
    .slice(0, 8);

  // Trending ticker: real movers from Stock Watch + genuinely new overalls first.
  // No fake data — if there isn't enough movement/new-artist data yet, fall back
  // to recently-updated overalls showing their current OVR (no invented change).
  const movers = [...stockWatch.up, ...stockWatch.down]
    .sort((a, b) => Math.abs(b.change) - Math.abs(a.change))
    .slice(0, 6);
  const usedIds = new Set(movers.map(m => m.id));
  const fourteenDaysAgo = Date.now() - 14 * 24 * 60 * 60 * 1000;
  const newOveralls = overalls
    .filter(o => !usedIds.has(o.id) && new Date(o.created_at).getTime() > fourteenDaysAgo)
    .slice(0, 4)
    .map(o => ({ ...o, isNew: true }));
  newOveralls.forEach(o => usedIds.add(o.id));

  const TICKER_MIN_ITEMS = 6;
  const combined = [...movers, ...newOveralls];
  const recentlyUpdated = combined.length < TICKER_MIN_ITEMS
    ? overalls
      .filter(o => !usedIds.has(o.id))
      .slice()
      .sort((a, b) => new Date(b.updated_at) - new Date(a.updated_at))
      .slice(0, TICKER_MIN_ITEMS - combined.length)
    : [];
  const tickerItems = [...combined, ...recentlyUpdated];

  const topRanked = overalls.slice().sort((a, b) => (b.overall ?? -1) - (a.overall ?? -1))[0];
  const isTopRanked = Boolean(hero && topRanked && hero.id === topRanked.id);

  const otherWriteUps = writeUps.filter(a => a.id !== featuredArticle?.id).slice(0, 2);

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-ink">
        <div className="h-10 w-10 animate-spin rounded-full border-b-2 border-brand" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-ink">
      <Helmet>
        <title>2K Overalls - Rap Has Stats Now</title>
        <meta name="description" content="Objective ratings. Real debates. The culture's board. Artist ratings, rankings, music, and who's moving hip-hop forward." />
      </Helmet>

      {/* HERO */}
      <Hero hero={hero} isTopRanked={isTopRanked} />

      {/* TRENDING NOW */}
      <TrendingTicker items={tickerItems} />

      {/* THE BOARD + TRENDS — two independent, side-by-side sections */}
      <section className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-10 md:grid-cols-2 md:items-start">
          {/* THE BOARD */}
          <div>
            <SectionHeader title="The Board" subtitle="Who's up. Who's falling. Who's next." viewAllTo="/overalls">
              <div className="scrollbar-none flex gap-2 overflow-x-auto">
                {['all', ...availableTiers].map((t) => (
                  <button
                    key={t}
                    onClick={() => setBoardTier(t)}
                    className={`flex-shrink-0 border px-3 py-1.5 text-xs font-bold uppercase tracking-wide transition-colors ${
                      boardTier === t ? 'border-brand bg-brand text-ink' : 'border-ink-line text-bone-dim hover:text-brand'
                    }`}
                  >
                    {t === 'all' ? 'All' : TIER_LABELS[t]}
                  </button>
                ))}
              </div>
            </SectionHeader>

            {boardOveralls.length > 0 ? (
              <BoardCarousel overalls={boardOveralls} />
            ) : (
              <p className="border border-ink-line bg-ink-soft p-10 text-center text-sm text-bone-dim">
                No Overalls in this class yet.
              </p>
            )}
          </div>

          {/* TRENDS: 2x2, each card fixed at 16:9 (matches the admin crop tool
              exactly) so the whole picture shows with no further cropping */}
          {boardTrends.length > 0 && (
            <div>
              <SectionHeader title="Trends" viewAllTo="/news" />
              <div className="grid grid-cols-2 gap-4">
                {boardTrends.map((t) => (
                  <TrendCard key={t.id} article={t} to={generateNewsUrl(t.id, t.title)} />
                ))}
              </div>
            </div>
          )}
        </div>
      </section>

      {/* STOCK WATCH */}
      {(stockWatch.up.length > 0 || stockWatch.down.length > 0) && (
        <section className="border-y border-ink-line bg-ink-soft">
          <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
            <SectionHeader title="Stock Watch" />
            <div className="grid grid-cols-1 gap-8 sm:grid-cols-2">
              <div>
                <p className="mb-3 text-xs font-bold uppercase tracking-wider text-up">Who's Up ▲</p>
                <div className="space-y-2">
                  {stockWatch.up.map((o) => (
                    <Link key={o.id} to={`/overalls/${o.slug}`} className="flex items-center justify-between border border-ink-line bg-ink px-3 py-2 hover:border-up">
                      <span className="text-sm font-bold text-bone">{o.title}</span>
                      <MovementBadge change={o.change} />
                    </Link>
                  ))}
                  {stockWatch.up.length === 0 && <p className="text-xs text-bone-dim">Nothing moving up yet.</p>}
                </div>
              </div>
              <div>
                <p className="mb-3 text-xs font-bold uppercase tracking-wider text-down">Who's Down ▼</p>
                <div className="space-y-2">
                  {stockWatch.down.map((o) => (
                    <Link key={o.id} to={`/overalls/${o.slug}`} className="flex items-center justify-between border border-ink-line bg-ink px-3 py-2 hover:border-down">
                      <span className="text-sm font-bold text-bone">{o.title}</span>
                      <MovementBadge change={o.change} />
                    </Link>
                  ))}
                  {stockWatch.down.length === 0 && <p className="text-xs text-bone-dim">Nothing moving down yet.</p>}
                </div>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* THE LATEST + AUX: PLAYLISTS — two independent, side-by-side sections */}
      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-10 lg:grid-cols-[1fr_340px] lg:items-stretch">
          {/* THE LATEST */}
          <div>
            <SectionHeader
              title="The Latest"
              subtitle="New music, interviews, reviews, and everything moving rap."
              viewAllTo="/news"
            />
            {featuredArticle || otherWriteUps.length > 0 ? (
              <div className="grid grid-cols-1 gap-6 md:grid-cols-[3fr_2fr]">
                {featuredArticle && (
                  <ArticleCard
                    article={featuredArticle}
                    to={generateNewsUrl(featuredArticle.id, featuredArticle.title)}
                    featured
                  />
                )}
                <div className="flex flex-col gap-4">
                  {otherWriteUps.map((a) => (
                    <LatestSideCard key={a.id} article={a} to={generateNewsUrl(a.id, a.title)} />
                  ))}
                </div>
              </div>
            ) : (
              <p className="border border-ink-line bg-ink-soft p-10 text-center text-sm text-bone-dim">
                No coverage yet. Check back soon.
              </p>
            )}
          </div>

          {/* AUX: PLAYLISTS — the real "Home Page" Spotify embed set via the admin's Spotify Manager */}
          <div className="flex flex-col">
            <SectionHeader title="AUX: Playlists" viewAllTo="/playlists" />
            <div className="h-[450px] overflow-hidden border border-ink-line bg-ink-soft lg:h-auto lg:flex-1">
              <SpotifyEmbed pageType="home" />
            </div>
          </div>
        </div>
      </section>

      {/* ROOKIE CLASS */}
      {rookieClass.length > 0 && (
        <section className="border-y border-ink-line bg-ink-soft">
          <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
            <SectionHeader title="Rookie Class" subtitle="New and emerging artists on the rise." viewAllTo="/overalls?tier=rising" />
            <div className="scrollbar-none flex gap-4 overflow-x-auto sm:grid sm:grid-cols-4 sm:overflow-visible lg:grid-cols-6">
              {rookieClass.map((o) => (
                <div key={o.id} className="w-32 flex-shrink-0 sm:w-auto">
                  <OverallCard overall={o} size="small" />
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* AUX / PLAYLISTS */}
      {playlists.length > 0 && (
        <section className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
          <SectionHeader title="AUX" subtitle="What we're playing right now." viewAllTo="/playlists" />
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
            {playlists.slice(0, 4).map((p) => (
              <PlaylistCard key={p.id} playlist={p} />
            ))}
          </div>
        </section>
      )}

      <CommunityCTA thumbnails={overalls.slice(0, 5)} />

      <Footer />
    </div>
  );
}
