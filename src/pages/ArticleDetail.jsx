import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import Footer from '../components/Footer';
import AmazonWidget from '../components/AmazonWidget';
import { generateArticleUrl } from '../utils/slugify';
import { stripMarkdown } from '../utils/markdownUtils';

const API_URL = import.meta.env.VITE_API_URL;

const ArticleDetail = () => {
  const { id: urlId } = useParams();
  const navigate = useNavigate();
  const [article, setArticle] = useState(null);
  const [moreArticles, setMoreArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Extract numeric ID from URL (e.g., "123-drake-new-album" -> "123")
  const id = urlId.split('-')[0];

  useEffect(() => {
    const fetchArticle = async () => {
      try {
        const response = await fetch(`${API_URL}/api/articles/${id}`);

        if (!response.ok) {
          throw new Error('Article not found');
        }

        const data = await response.json();
        setArticle(data.article);
      } catch (err) {
        setError(err.message || 'Failed to load article');
      } finally {
        setLoading(false);
      }
    };

    const fetchMoreArticles = async () => {
      try {
        const response = await fetch(`${API_URL}/api/articles`);
        if (response.ok) {
          const data = await response.json();
          // Filter out current article and get 3 random articles
          const otherArticles = data.articles.filter(article => article.id !== parseInt(id));
          const shuffled = otherArticles.sort(() => 0.5 - Math.random());
          setMoreArticles(shuffled.slice(0, 3));
        }
      } catch (err) {
        console.error('Failed to fetch more articles:', err);
      }
    };

    fetchArticle();
    fetchMoreArticles();
  }, [id]);

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-ink">
        <div className="h-10 w-10 animate-spin rounded-full border-b-2 border-brand" />
      </div>
    );
  }

  if (error || !article) {
    return (
      <div className="min-h-screen bg-ink">
        <div className="flex flex-1 items-center justify-center py-20">
          <div className="text-center">
            <div className="mb-4 text-xl text-down">{error || 'Article not found'}</div>
            <button
              onClick={() => navigate('/')}
              className="border border-brand bg-brand px-6 py-3 text-sm font-bold uppercase tracking-wide text-ink transition-colors hover:bg-transparent hover:text-brand"
            >
              Back to Home
            </button>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  const handleCopyLink = () => {
    navigator.clipboard.writeText(window.location.href);
  };

  const handleEmailShare = () => {
    window.location.href = `mailto:?subject=${encodeURIComponent(article.title)}&body=${encodeURIComponent(window.location.href)}`;
  };

  const handleTweet = () => {
    window.open(`https://twitter.com/intent/tweet?url=${encodeURIComponent(window.location.href)}&text=${encodeURIComponent(article.title)}`, '_blank');
  };

  // Generate description from article content
  const articleDescription = article ? stripMarkdown(article.content).substring(0, 160) + '...' : '';
  const articleUrl = typeof window !== 'undefined' ? window.location.href : '';

  return (
    <div className="min-h-screen bg-ink">
      {/* SEO Meta Tags */}
      <Helmet>
        <title>{article.title} | 2koveralls</title>
        <meta name="description" content={articleDescription} />
        <link rel="canonical" href={articleUrl} />

        {/* Open Graph / Facebook */}
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

        {/* Twitter */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:url" content={articleUrl} />
        <meta name="twitter:title" content={article.title} />
        <meta name="twitter:description" content={articleDescription} />
        {article.image_url && <meta name="twitter:image" content={article.image_url} />}
      </Helmet>

      <div className="relative">
        {/* Share Sidebar - Fixed to far left */}
        <div className="fixed left-8 top-1/3 z-50 hidden flex-col items-center gap-4 lg:flex">
          <button
            onClick={handleCopyLink}
            className="flex h-12 w-12 items-center justify-center border border-ink-line bg-ink-soft text-bone-dim transition-colors hover:border-brand hover:text-brand"
            title="Copy link"
          >
            <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
            </svg>
          </button>
          <button
            onClick={handleEmailShare}
            className="flex h-12 w-12 items-center justify-center border border-ink-line bg-ink-soft text-bone-dim transition-colors hover:border-brand hover:text-brand"
            title="Share via email"
          >
            <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
            </svg>
          </button>
          <button
            onClick={handleTweet}
            className="flex h-12 w-12 items-center justify-center border border-ink-line bg-ink-soft text-bone-dim transition-colors hover:border-brand hover:text-brand"
            title="Share on Twitter"
          >
            <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
              <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
            </svg>
          </button>
        </div>

        {/* Main Content with Ad Sidebar */}
        <div className="mx-auto flex max-w-6xl justify-center gap-8 px-4 py-12 sm:px-6 lg:px-8">
          <div className="max-w-4xl flex-1">
            {/* Back Button */}
            <button
              onClick={() => navigate('/')}
              className="mb-6 flex items-center gap-2 text-sm text-bone-dim transition-colors hover:text-brand"
            >
              <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              Back to Home
            </button>

            <div className="overflow-hidden border border-ink-line bg-ink-soft">
              {/* Article Image */}
              {article.image_url && (
                <div className="overflow-hidden">
                  <img
                    src={article.image_url}
                    alt={article.title}
                    className="h-96 w-full object-cover"
                  />
                </div>
              )}

              {/* Article Content Container */}
              <div className="p-8 md:p-12">
                {/* Article Header */}
                <div className="mb-8">
                  <h1 className="mb-4 font-display text-4xl uppercase leading-tight text-bone md:text-5xl">{article.title}</h1>

                  <div className="mb-6 flex items-center gap-4 text-sm text-bone-dim">
                    <span>By {article.author}</span>
                    <span>•</span>
                    <span>{new Date(article.created_at).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric'
                    })}</span>
                  </div>

                  {/* Tags */}
                  {article.tags && article.tags.length > 0 && (
                    <div className="flex flex-wrap gap-2">
                      {article.tags.map((tag, index) => (
                        <span
                          key={index}
                          className="border border-brand/40 bg-ink px-3 py-1 text-sm text-brand"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  )}
                </div>

                {/* Article Content */}
                <div className="max-w-none">
                  <ReactMarkdown
                    remarkPlugins={[remarkGfm]}
                    components={{
                      a: ({ node, ...props }) => (
                        <a
                          {...props}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-brand underline hover:text-bone"
                        />
                      ),
                      h1: ({ node, ...props }) => (
                        <h1 {...props} className="mt-8 mb-4 text-3xl font-bold text-bone" />
                      ),
                      h2: ({ node, ...props }) => (
                        <h2 {...props} className="mt-6 mb-3 text-2xl font-bold text-bone" />
                      ),
                      h3: ({ node, ...props }) => (
                        <h3 {...props} className="mt-4 mb-2 text-xl font-bold text-bone" />
                      ),
                      p: ({ node, ...props }) => (
                        <p {...props} className="mb-4 leading-relaxed text-bone-dim" />
                      ),
                      ul: ({ node, ...props }) => (
                        <ul {...props} className="mb-4 list-inside list-disc text-bone-dim" />
                      ),
                      ol: ({ node, ...props }) => (
                        <ol {...props} className="mb-4 list-inside list-decimal text-bone-dim" />
                      ),
                      blockquote: ({ node, ...props }) => (
                        <blockquote {...props} className="my-4 border-l-4 border-brand pl-4 italic text-bone-dim" />
                      ),
                      code: ({ node, inline, ...props }) => (
                        inline ?
                          <code {...props} className="bg-ink px-1 py-0.5 text-brand" /> :
                          <code {...props} className="block overflow-x-auto bg-ink p-4 text-brand" />
                      ),
                    }}
                  >
                    {article.content}
                  </ReactMarkdown>
                </div>

                {/* Spotify Embed */}
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

                {/* YouTube Embed */}
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

                {/* SoundCloud Embed */}
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

                {/* Back Button Section */}
                <div className="mt-8 border-t border-ink-line pt-8">
                  <button
                    onClick={() => navigate('/')}
                    className="border border-brand bg-brand px-6 py-3 text-sm font-bold uppercase tracking-wide text-ink transition-colors hover:bg-transparent hover:text-brand"
                  >
                    Back to Home
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="hidden w-80 flex-shrink-0 lg:block">
            <div className="sticky top-24 space-y-6">
              <AmazonWidget page="article" />
            </div>
          </div>
        </div>
      </div>

      {/* More Articles Section */}
      {moreArticles.length > 0 && (
        <div className="mx-auto max-w-6xl border-t border-ink-line px-4 py-16 sm:px-6 lg:px-8">
          <h2 className="mb-8 font-display text-3xl uppercase text-bone">More Articles</h2>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {moreArticles.map((article) => (
              <div
                key={article.id}
                onClick={() => window.location.href = generateArticleUrl(article.id, article.title)}
                className="cursor-pointer overflow-hidden border border-ink-line bg-ink-soft transition-colors hover:border-brand"
              >
                {/* Article Image */}
                {article.image_url && (
                  <div className="h-48 overflow-hidden">
                    <img
                      src={article.image_url}
                      alt={article.title}
                      className="h-full w-full object-cover"
                    />
                  </div>
                )}

                {/* Article Content */}
                <div className="p-6">
                  <h3 className="mb-2 line-clamp-2 text-xl font-semibold text-bone transition-colors hover:text-brand">
                    {article.title}
                  </h3>

                  <p className="mb-3 text-xs text-bone-dim">
                    By {article.author} • {new Date(article.created_at).toLocaleDateString()}
                  </p>

                  <p className="mb-4 line-clamp-3 text-sm text-bone-dim">
                    {article.content.substring(0, 150)}...
                  </p>

                  {/* Tags */}
                  {article.tags && article.tags.length > 0 && (
                    <div className="flex flex-wrap gap-2">
                      {article.tags.slice(0, 3).map((tag, index) => (
                        <span
                          key={index}
                          className="bg-ink px-2 py-1 text-xs text-brand"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
};

export default ArticleDetail;
