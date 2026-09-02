import { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import Footer from '../components/Footer';
import ArticleCard from '../components/ArticleCard';
import { generateNewsUrl } from '../utils/slugify';

function News() {
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const API_URL = import.meta.env.VITE_API_URL;

  useEffect(() => {
    fetchArticles();
  }, []);

  const fetchArticles = async () => {
    try {
      const response = await fetch(`${API_URL}/api/lowkeygrid/articles`);
      const data = await response.json();
      setArticles(data);
    } catch (error) {
      setError('Failed to fetch articles');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-ink">
      <Helmet>
        <title>Articles | 2koveralls</title>
        <meta name="description" content="Stay updated with the latest in hip-hop and music culture." />
        <meta property="og:title" content="Articles | 2koveralls" />
        <meta property="og:site_name" content="2koveralls" />
      </Helmet>

      <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6 lg:px-8">
        <h1 className="font-display text-4xl uppercase text-bone sm:text-5xl">Articles</h1>
        <p className="mt-2 text-sm text-bone-dim">News, rating updates, and rap culture coverage.</p>

        {loading ? (
          <div className="flex justify-center py-16">
            <div className="h-8 w-8 animate-spin rounded-full border-b-2 border-brand" />
          </div>
        ) : error ? (
          <p className="mt-8 border border-down bg-ink-soft p-4 text-sm text-down">{error}</p>
        ) : articles.length === 0 ? (
          <p className="mt-8 border border-ink-line bg-ink-soft p-10 text-center text-sm text-bone-dim">
            No articles yet. Check back soon!
          </p>
        ) : (
          <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2">
            {articles.map((article) => (
              <ArticleCard key={article.id} article={article} to={generateNewsUrl(article.id, article.title)} />
            ))}
          </div>
        )}
      </div>

      <Footer />
    </div>
  );
}

export default News;
