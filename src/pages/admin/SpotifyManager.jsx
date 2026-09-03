import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import AdminLayout from '../../components/admin/AdminLayout';
import { Panel, Pill } from '../../components/admin/ui';

const inputClass = 'w-full border border-ink-line bg-ink px-3 py-2.5 text-sm text-bone placeholder-bone-dim focus:border-brand focus:outline-none';
const labelClass = 'mb-2 block text-xs font-medium uppercase tracking-wide text-bone-dim';

const SpotifyManager = () => {
  const navigate = useNavigate();
  const [admin, setAdmin] = useState(null);
  const [embeds, setEmbeds] = useState([]);
  const [loading, setLoading] = useState(true);
  const [spotifyUrl, setSpotifyUrl] = useState('');
  const [pageType, setPageType] = useState('home');
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [coverImage, setCoverImage] = useState(null);
  const [coverPreview, setCoverPreview] = useState(null);
  const [isFeatured, setIsFeatured] = useState(false);
  const [message, setMessage] = useState({ text: '', type: '' });

  const API_URL = import.meta.env.VITE_API_URL;
  const token = localStorage.getItem('adminToken');

  useEffect(() => {
    if (!token) {
      navigate('/admin/login');
      return;
    }
    const adminInfo = localStorage.getItem('adminInfo');
    if (adminInfo) setAdmin(JSON.parse(adminInfo));
    fetchEmbeds();
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('adminToken');
    localStorage.removeItem('adminInfo');
    navigate('/admin/login');
  };

  const fetchEmbeds = async () => {
    try {
      const response = await fetch(`${API_URL}/api/spotify-embeds/all?site=lowkeygrid`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      const data = await response.json();
      setEmbeds(data.embeds || []);
    } catch (error) {
      console.error('Error fetching embeds:', error);
      showMessage('Failed to fetch Spotify embeds', 'error');
    } finally {
      setLoading(false);
    }
  };

  const showMessage = (text, type) => {
    setMessage({ text, type });
    setTimeout(() => setMessage({ text: '', type: '' }), 3000);
  };

  const handleCoverChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setCoverImage(file);
      const reader = new FileReader();
      reader.onloadend = () => setCoverPreview(reader.result);
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!spotifyUrl) {
      showMessage('Please enter a Spotify URL', 'error');
      return;
    }

    try {
      const formData = new FormData();
      formData.append('spotify_url', spotifyUrl);
      formData.append('page_type', pageType);
      formData.append('site', 'lowkeygrid');
      if (title) formData.append('title', title);
      if (description) formData.append('description', description);
      formData.append('is_featured', isFeatured);
      if (coverImage) formData.append('cover_image', coverImage);

      const response = await fetch(`${API_URL}/api/spotify-embeds`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
        },
        body: formData
      });

      const data = await response.json();

      if (response.ok) {
        showMessage(data.message, 'success');
        fetchEmbeds();
        setSpotifyUrl('');
        setPageType('home');
        setTitle('');
        setDescription('');
        setCoverImage(null);
        setCoverPreview(null);
        setIsFeatured(false);
      } else {
        showMessage(data.message || 'Error saving embed', 'error');
      }
    } catch (error) {
      console.error('Error saving embed:', error);
      showMessage('Failed to save Spotify embed', 'error');
    }
  };

  const handleDelete = async (id) => {
    if (!confirm('Are you sure you want to delete this Spotify embed?')) return;

    try {
      const response = await fetch(`${API_URL}/api/spotify-embeds/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      const data = await response.json();

      if (response.ok) {
        showMessage(data.message, 'success');
        fetchEmbeds();
      } else {
        showMessage(data.message || 'Error deleting embed', 'error');
      }
    } catch (error) {
      console.error('Error deleting embed:', error);
      showMessage('Failed to delete Spotify embed', 'error');
    }
  };

  const pageTypeLabel = (pt) => {
    if (pt === 'article') return 'Article Page';
    if (pt === 'playlist') return 'AUX Playlist';
    return 'Home Page';
  };

  return (
    <AdminLayout admin={admin} onLogout={handleLogout} title="Spotify Manager" subtitle="Manage embeds and AUX playlists">
      {loading ? (
        <div className="py-16 text-center text-sm text-bone-dim">Loading Spotify embeds...</div>
      ) : (
        <div className="space-y-8">
          {message.text && (
            <div className={`border px-4 py-3 text-sm ${
              message.type === 'success' ? 'border-up/30 bg-up/10 text-up' : 'border-down/30 bg-down/10 text-down'
            }`}>
              {message.text}
            </div>
          )}

          {/* Form */}
          <Panel title="Add Spotify Embed / Playlist" icon="spotify">
            <form onSubmit={handleSubmit} className="space-y-4 p-5">
              <div>
                <label className={labelClass}>Page Type</label>
                <select
                  value={pageType}
                  onChange={(e) => setPageType(e.target.value)}
                  className={inputClass}
                >
                  <option value="home">Home Page (sidebar embed)</option>
                  <option value="article">Article Page (sidebar embed)</option>
                  <option value="playlist">AUX Playlist (branded card, shown on homepage + /playlists)</option>
                </select>
              </div>

              <div>
                <label className={labelClass}>Paste Spotify Link</label>
                <input
                  type="text"
                  value={spotifyUrl}
                  onChange={(e) => setSpotifyUrl(e.target.value)}
                  className={inputClass}
                  placeholder="https://open.spotify.com/playlist/... or https://open.spotify.com/album/..."
                  required
                />
              </div>

              {pageType === 'playlist' && (
                <>
                  <div>
                    <label className={labelClass}>Title</label>
                    <input
                      type="text"
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                      className={inputClass}
                      placeholder="e.g., ROTATION"
                    />
                  </div>
                  <div>
                    <label className={labelClass}>Description</label>
                    <input
                      type="text"
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                      className={inputClass}
                      placeholder="e.g., Current rap we're playing"
                    />
                  </div>
                  <div>
                    <label className={labelClass}>Cover Image</label>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleCoverChange}
                      className={`${inputClass} file:mr-3 file:border-0 file:bg-brand file:px-3 file:py-1.5 file:text-xs file:font-bold file:uppercase file:text-ink`}
                    />
                    {coverPreview && (
                      <img src={coverPreview} alt="Cover preview" className="mt-3 h-32 w-32 border border-ink-line object-cover" />
                    )}
                  </div>
                  <label className="flex items-center gap-2 text-sm font-medium text-bone-dim">
                    <input type="checkbox" checked={isFeatured} onChange={(e) => setIsFeatured(e.target.checked)} className="accent-brand" />
                    Featured (highlighted in AUX)
                  </label>
                </>
              )}

              <button
                type="submit"
                className="border border-brand bg-brand px-6 py-2.5 text-xs font-bold uppercase tracking-wider text-ink transition-colors hover:bg-brand-dim"
              >
                Add
              </button>
            </form>
          </Panel>

          {/* List of Embeds */}
          <Panel title="Existing Embeds" icon="list">
            <div className="p-5">
              {embeds.length === 0 ? (
                <p className="text-sm text-bone-dim">No Spotify embeds yet. Add one above!</p>
              ) : (
                <div className="space-y-3">
                  {embeds.map((embed) => (
                    <div
                      key={embed.id}
                      className="flex items-start justify-between gap-4 border border-ink-line bg-ink p-4"
                    >
                      <div className="flex flex-1 items-start gap-4">
                        {embed.cover_image_url && (
                          <img src={embed.cover_image_url} alt={embed.title} className="h-16 w-16 border border-ink-line object-cover" />
                        )}
                        <div className="flex-1">
                          <div className="mb-2 flex flex-wrap items-center gap-2">
                            <h4 className="font-semibold text-bone">{embed.title}</h4>
                            <Pill tone={embed.is_active ? 'up' : 'down'}>{embed.is_active ? 'Active' : 'Inactive'}</Pill>
                            <Pill tone="brand">{embed.embed_type}</Pill>
                            <Pill tone="slate">{pageTypeLabel(embed.page_type)}</Pill>
                            {embed.is_featured && <Pill tone="brand">Featured</Pill>}
                            <span className="text-xs text-bone-dim">Order: {embed.display_order}</span>
                          </div>
                          {embed.description && <p className="mb-1 text-sm text-bone-dim">{embed.description}</p>}
                          <p className="truncate text-sm text-bone-dim">{embed.spotify_url}</p>
                        </div>
                      </div>
                      <button
                        onClick={() => handleDelete(embed.id)}
                        className="flex-shrink-0 border border-down/30 px-4 py-2 text-sm text-down transition-colors hover:bg-down/10"
                      >
                        Delete
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </Panel>
        </div>
      )}
    </AdminLayout>
  );
};

export default SpotifyManager;
