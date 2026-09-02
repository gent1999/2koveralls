import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import SpotifyEmbed from '../components/SpotifyEmbed';
import HilltopMultiBanner from '../components/HilltopMultiBanner';
import HilltopMobileBanner from '../components/HilltopMobileBanner';
import Footer from '../components/Footer';
import { CATEGORY_LABELS } from '../components/ArticleCard';
import { generateNewsUrl } from '../utils/slugify';
import { stripMarkdown } from '../utils/markdownUtils';

function NewsDetail() {
  const { id: urlId } = useParams();
  const [article, setArticle] = useState(null);
  const [moreArticles, setMoreArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const API_URL = import.meta.env.VITE_API_URL;

  // Extract numeric ID from URL (e.g., "170-drake-new-album" -> "170")
  const id = urlId.split('-')[0];

  useEffect(() => {
    fetchArticle();
    fetchMoreArticles();
  }, [id]);

  const fetchArticle = async () => {
    try {
      const response = await fetch(`${API_URL}/api/lowkeygrid/articles/${id}`);
      if (!response.ok) throw new Error('Article not found');
      const data = await response.json();
      setArticle(data);
    } catch (error) {
      setError(error.message);
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const fetchMoreArticles = async () => {
    try {
      const response = await fetch(`${API_URL}/api/lowkeygrid/articles/writeups`);
      if (response.ok) {
        const data = await response.json();
        const others = data.filter(a => a.id !== parseInt(id));
        const shuffled = others.sort(() => 0.5 - Math.random());
        setMoreArticles(shuffled.slice(0, 3));
      }
    } catch (err) {
      console.error('Failed to fetch more articles:', err);
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-ink">
        <div className="h-10 w-10 animate-spin rounded-full border-b-2 border-brand" />
      </div>
    );
  }

  if (error || !article) {
    return (
      <div className="mx-auto max-w-4xl px-4 py-12 text-center sm:px-6 lg:px-8">
        <p className="text-bone">{error || 'Article not found'}</p>
        <Link to="/" className="mt-4 inline-block text-brand hover:text-bone">← Back to Home</Link>
      </div>
    );
  }

  const formatDate = (dateString) =>
    new Date(dateString).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });

  const articleDescription = stripMarkdown(article.content).substring(0, 160) + '...';
  const articleUrl = typeof window !== 'undefined' ? window.location.href : '';
  const categoryLabel = CATEGORY_LABELS[article.category] || 'Article';

  return (
    <div className="min-h-screen bg-ink">
      <Helmet>
        <title>{article.title} | 2koveralls</title>
        <meta name="description" content={articleDescription} />
        <link rel="canonical" href={articleUrl} />
        <meta property="og:type" content="article" />
        <meta property="og:url" content={articleUrl} />
        <meta property="og:title" content={article.title} />
        <meta property="og:description" content={articleDescription} />
        {article.image_url && <meta property="og:image" content={article.image_url} />}
        <meta property="og:site_name" content="2koveralls" />
        <meta property="article:published_time" content={article.created_at} />
        <meta property="article:author" content={article.author} />
        {article.tags && article.tags.map((tag, index) => (
          <meta key={index} property="article:tag" content={tag} />
        ))}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:url" content={articleUrl} />
        <meta name="twitter:title" content={article.title} />
        <meta name="twitter:description" content={articleDescription} />
        {article.image_url && <meta name="twitter:image" content={article.image_url} />}
      </Helmet>

      <div className="mx-auto max-w-6xl px-4 pt-12 sm:px-6 lg:px-8">
        <Link to="/" className="mb-6 inline-flex items-center text-sm text-bone-dim hover:text-brand">
          <svg className="mr-2 h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          Back to Home
        </Link>

        <HilltopMobileBanner />

        <span className="text-xs font-bold uppercase tracking-wider text-brand">{categoryLabel}</span>
        <h1 className="mt-2 font-display text-4xl uppercase leading-tight text-bone sm:text-5xl">{article.title}</h1>

        <div className="mb-8 mt-4 flex items-center gap-4 text-sm">
          <p className="text-bone-dim">By <span className="font-medium text-bone">{article.author}</span></p>
          <span className="text-ink-line">•</span>
          <p className="text-bone-dim">{formatDate(article.created_at)}</p>
        </div>

        {article.tags && article.tags.length > 0 && (
          <div className="mb-8 flex flex-wrap gap-2">
            {article.tags.map((tag, index) => (
              <span key={index} className="border border-ink-line px-3 py-1 text-xs font-medium text-bone-dim">
                #{tag}
              </span>
            ))}
          </div>
        )}

        {article.instagram_link && (
          <div className="mb-8">
            <a
              href={article.instagram_link}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center border border-brand px-4 py-2 text-sm font-bold uppercase tracking-wide text-brand hover:bg-brand hover:text-ink"
            >
              <svg className="mr-2 h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
              </svg>
              View on Instagram
            </a>
          </div>
        )}
      </div>

      <div className="mx-auto flex max-w-6xl justify-center gap-8 px-4 pb-12 sm:px-6 lg:px-8">
        <article className="min-w-0 flex-1">
          <div className="mb-8">
            {article.image_url && (
              <img
                src={article.image_url}
                alt={article.title}
                className="mb-4 w-full border border-ink-line sm:float-left sm:mr-8 sm:w-2/5"
              />
            )}

            <div className="max-w-none">
              <ReactMarkdown
                remarkPlugins={[remarkGfm]}
                components={{
                  h1: ({node, ...props}) => <h1 {...props} className="mt-8 mb-4 border-b border-brand pb-2 text-3xl font-bold text-bone" />,
                  h2: ({node, ...props}) => <h2 {...props} className="mt-6 mb-3 text-2xl font-bold text-bone" />,
                  h3: ({node, ...props}) => <h3 {...props} className="mt-5 mb-2 text-xl font-bold text-bone" />,
                  h4: ({node, ...props}) => <h4 {...props} className="mt-4 mb-2 text-lg font-semibold text-bone" />,
                  p: ({node, ...props}) => <p {...props} className="mb-4 leading-relaxed text-bone-dim" />,
                  a: ({node, ...props}) => <a {...props} target="_blank" rel="noopener noreferrer" className="font-medium text-brand underline underline-offset-2" />,
                  ul: ({node, ...props}) => <ul {...props} className="mb-4 list-disc space-y-1 pl-6 text-bone-dim" />,
                  ol: ({node, ...props}) => <ol {...props} className="mb-4 list-decimal space-y-1 pl-6 text-bone-dim" />,
                  li: ({node, ...props}) => <li {...props} className="leading-relaxed" />,
                  blockquote: ({node, ...props}) => <blockquote {...props} className="my-4 border-l-4 border-brand bg-ink-soft py-1 pl-4 italic text-bone-dim" />,
                  strong: ({node, ...props}) => <strong {...props} className="font-bold text-bone" />,
                  em: ({node, ...props}) => <em {...props} className="italic text-bone-dim" />,
                  hr: ({node, ...props}) => <hr {...props} className="my-6 border-ink-line" />,
                  img: ({node, ...props}) => <img {...props} className="my-4 w-full" />,
                  code: ({node, inline, ...props}) => inline
                    ? <code {...props} className="border border-brand/40 bg-ink-soft px-1.5 py-0.5 font-mono text-sm text-brand" />
                    : <code {...props} className="block overflow-x-auto bg-black p-4 font-mono text-sm text-up" />,
                  pre: ({node, ...props}) => <pre {...props} className="my-4 overflow-x-auto bg-black" />,
                }}
              >
                {article.content}
              </ReactMarkdown>
            </div>
            <div className="clear-both" />
          </div>

          {article.spotify_url && (
            <div className="mt-8">
              <h2 className="mb-4 font-display text-2xl uppercase text-bone">Listen on Spotify</h2>
              <div className="overflow-hidden">
                <iframe
                  src={article.spotify_url.replace('open.spotify.com', 'open.spotify.com/embed')}
                  width="100%"
                  height="352"
                  frameBorder="0"
                  allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
                  loading="lazy"
                ></iframe>
              </div>
            </div>
          )}

          {article.youtube_url && (
            <div className="mt-8">
              <h2 className="mb-4 font-display text-2xl uppercase text-bone">Watch on YouTube</h2>
              <div className="aspect-video overflow-hidden">
                <iframe
                  src={article.youtube_url.replace('watch?v=', 'embed/').replace('youtu.be/', 'youtube.com/embed/')}
                  width="100%"
                  height="100%"
                  frameBorder="0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                  loading="lazy"
                ></iframe>
              </div>
            </div>
          )}

          {article.soundcloud_url && (
            <div className="mt-8">
              <h2 className="mb-4 font-display text-2xl uppercase text-bone">Listen on SoundCloud</h2>
              <div className="overflow-hidden">
                <iframe
                  width="100%"
                  height="166"
                  scrolling="no"
                  frameBorder="no"
                  allow="autoplay"
                  src={`https://w.soundcloud.com/player/?url=${encodeURIComponent(article.soundcloud_url)}&color=%23f97316&auto_play=false&hide_related=false&show_comments=true&show_user=true&show_reposts=false&show_teaser=true`}
                  loading="lazy"
                ></iframe>
              </div>
            </div>
          )}

          <div className="mt-12 border-t border-ink-line pt-8">
            <Link
              to="/"
              className="inline-block border border-brand bg-brand px-6 py-3 text-sm font-bold uppercase tracking-wide text-ink hover:bg-transparent hover:text-brand"
            >
              Back to Home
            </Link>
          </div>
        </article>

        <div className="hidden w-72 flex-shrink-0 lg:block">
          <div className="sticky top-24 space-y-4">
            <HilltopMultiBanner />
            <div className="h-[352px] overflow-hidden">
              <SpotifyEmbed pageType="article" />
            </div>
          </div>
        </div>
      </div>

      {moreArticles.length > 0 && (
        <div className="mx-auto max-w-6xl border-t border-ink-line px-4 py-16 sm:px-6 lg:px-8">
          <h2 className="mb-8 font-display text-3xl uppercase text-bone">More Coverage</h2>
          <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
            {moreArticles.map((a) => (
              <Link
                key={a.id}
                to={generateNewsUrl(a.id, a.title)}
                className="group overflow-hidden border border-ink-line bg-ink-soft transition-colors hover:border-brand"
              >
                {(a.thumbnail_url || a.image_url) && (
                  <div className="relative h-48 overflow-hidden">
                    <img
                      src={a.thumbnail_url || a.image_url}
                      alt={a.title}
                      loading="lazy"
                      className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                    />
                  </div>
                )}
                <div className="p-4">
                  <h3 className="mb-1 line-clamp-2 text-base font-bold uppercase text-bone group-hover:text-brand">
                    {a.title}
                  </h3>
                  <p className="text-xs text-bone-dim">By {a.author} · {formatDate(a.created_at)}</p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
}

export default NewsDetail;
