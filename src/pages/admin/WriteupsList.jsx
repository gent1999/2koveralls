import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import AdminLayout from '../../components/admin/AdminLayout';
import { Pill, Icon } from '../../components/admin/ui';

const CATEGORY_LABELS = {
  article: 'Feature',
  interview: 'Interview',
  review: 'Review',
  editorial: 'Editorial',
  rating_update: 'Rating Update',
  rankings: 'Rankings',
};

function WriteupsList() {
  const [articles, setArticles] = useState([]);
  const [admin, setAdmin] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const API_URL = import.meta.env.VITE_API_URL;

  useEffect(() => {
    const token = localStorage.getItem('adminToken');
    if (!token) {
      navigate('/admin/login');
      return;
    }
    const adminInfo = localStorage.getItem('adminInfo');
    if (adminInfo) setAdmin(JSON.parse(adminInfo));

    fetchArticles();
  }, [navigate]);

  const fetchArticles = async () => {
    const token = localStorage.getItem('adminToken');

    try {
      const response = await fetch(`${API_URL}/api/koveralls-articles/admin/all`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });
      const data = await response.json();
      setArticles(data);
    } catch (error) {
      setError('Failed to fetch articles');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm('Are you sure you want to delete this article?')) {
      return;
    }

    const token = localStorage.getItem('adminToken');

    try {
      const response = await fetch(`${API_URL}/api/koveralls-articles/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (response.ok) {
        setArticles(articles.filter(article => article.id !== id));
      } else {
        alert('Failed to delete article');
      }
    } catch (error) {
      console.error('Error deleting article:', error);
      alert('Failed to delete article');
    }
  };

  const handleToggleFeature = async (article) => {
    const token = localStorage.getItem('adminToken');
    try {
      const response = await fetch(`${API_URL}/api/koveralls-articles/${article.id}/feature`, {
        method: article.is_featured ? 'DELETE' : 'PUT',
        headers: { 'Authorization': `Bearer ${token}` },
      });
      if (response.ok) {
        fetchArticles();
      } else {
        alert('Failed to update featured status');
      }
    } catch (error) {
      console.error('Error toggling featured status:', error);
      alert('Failed to update featured status');
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('adminToken');
    localStorage.removeItem('adminInfo');
    navigate('/admin/login');
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  return (
    <AdminLayout
      admin={admin}
      onLogout={handleLogout}
      title="All Articles"
      subtitle={`${articles.length} write-up${articles.length === 1 ? '' : 's'} · shown in "The Latest" on the homepage`}
      actions={
        <button
          onClick={() => navigate('/admin/writeups/create')}
          className="flex items-center gap-2 border border-brand bg-brand px-4 py-2 text-xs font-bold uppercase tracking-wider text-ink transition-colors hover:bg-brand-dim"
        >
          <Icon name="add" size={15} /> New Article
        </button>
      }
    >
      {loading ? (
        <div className="py-16 text-center text-sm text-bone-dim">Loading...</div>
      ) : (
        <>
          {error && (
            <div className="mb-4 border border-down/30 bg-down/10 px-4 py-3 text-sm text-down">
              {error}
            </div>
          )}

          {articles.length === 0 ? (
            <div className="border border-ink-line bg-ink-soft py-16 text-center text-sm text-bone-dim">
              No articles yet. Create your first one!
            </div>
          ) : (
            <div className="divide-y divide-ink-line border border-ink-line bg-ink-soft">
              {articles.map((article) => (
                <div key={article.id} className="flex items-center gap-4 px-5 py-4 transition-colors hover:bg-ink">
                  {article.image_url && (
                    <img
                      src={article.image_url}
                      alt={article.title}
                      className="h-20 w-20 flex-shrink-0 border border-ink-line object-cover"
                    />
                  )}
                  <div className="min-w-0 flex-1">
                    <div className="mb-2 flex items-center gap-2">
                      <h3 className="truncate text-lg font-semibold text-bone">
                        {article.title}
                      </h3>
                      <Pill tone="slate">{CATEGORY_LABELS[article.category] || article.category}</Pill>
                      {article.is_featured && <Pill tone="brand">Featured</Pill>}
                    </div>
                    <p className="text-sm text-bone-dim">
                      By {article.author || 'Unknown'} • {formatDate(article.created_at)}
                    </p>
                    {article.tags && article.tags.length > 0 && (
                      <div className="mt-2 flex flex-wrap gap-2">
                        {article.tags.map((tag, index) => (
                          <span key={index} className="border border-ink-line px-2 py-0.5 text-xs text-bone-dim">
                            {tag}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                  <div className="flex flex-shrink-0 gap-4">
                    <button
                      onClick={() => handleToggleFeature(article)}
                      className={`text-sm font-medium ${article.is_featured ? 'text-brand hover:text-bone' : 'text-bone-dim hover:text-bone'}`}
                    >
                      {article.is_featured ? 'Unfeature' : 'Feature'}
                    </button>
                    <button
                      onClick={() => navigate(`/admin/writeups/edit/${article.id}`)}
                      className="text-sm font-medium text-brand hover:text-bone"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(article.id)}
                      className="text-sm font-medium text-down hover:text-bone"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </>
      )}
    </AdminLayout>
  );
}

export default WriteupsList;
