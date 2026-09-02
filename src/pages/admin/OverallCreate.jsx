import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import AttributeEditor, { DEFAULT_ATTRIBUTE_ROWS } from '../../components/admin/AttributeEditor';
import ArticleLinker from '../../components/admin/ArticleLinker';

const TIERS = [
  { value: '', label: 'None' },
  { value: 'mainstream', label: 'Mainstream' },
  { value: 'rising', label: 'Rising' },
  { value: 'underground', label: 'Underground' },
  { value: 'legend', label: 'Legend' },
];

function OverallCreate() {
  const [title, setTitle] = useState('');
  const [overall, setOverall] = useState('');
  const [content, setContent] = useState('');
  const [instagramLink, setInstagramLink] = useState('');
  const [artistTier, setArtistTier] = useState('');
  const [location, setLocation] = useState('');
  const [attributeRows, setAttributeRows] = useState(DEFAULT_ATTRIBUTE_ROWS);
  const [linkedArticleIds, setLinkedArticleIds] = useState([]);
  const [image, setImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const API_URL = import.meta.env.VITE_API_URL;

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImage(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    const token = localStorage.getItem('adminToken');
    if (!token) {
      navigate('/admin/login');
      return;
    }

    if (!image) {
      setError('Please select an image');
      setLoading(false);
      return;
    }

    try {
      const formData = new FormData();
      formData.append('title', title);
      formData.append('content', content);
      formData.append('image', image);
      if (overall) {
        formData.append('overall', overall);
      }
      if (instagramLink) {
        formData.append('instagram_link', instagramLink);
      }
      if (artistTier) {
        formData.append('artist_tier', artistTier);
      }
      if (location) {
        formData.append('location', location);
      }
      const attributesObj = Object.fromEntries(
        attributeRows.filter(r => r.label.trim() && r.value !== '').map(r => [r.label.trim(), Number(r.value)])
      );
      if (Object.keys(attributesObj).length > 0) {
        formData.append('attributes', JSON.stringify(attributesObj));
      }
      formData.append('article_ids', linkedArticleIds.join(','));

      const response = await fetch(`${API_URL}/api/overalls`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
        body: formData,
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Failed to create overall');
      }

      navigate('/admin/overalls');
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex justify-between items-center">
            <h1 className="text-2xl font-bold text-gray-900">Create New Overall</h1>
            <Link
              to="/admin/overalls"
              className="bg-gray-600 text-white px-4 py-2 rounded-md hover:bg-gray-700"
            >
              Back to List
            </Link>
          </div>
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {error && (
          <div className="bg-red-50 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="bg-white shadow rounded-lg p-6 space-y-6">
          <div>
            <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-2">
              Title *
            </label>
            <input
              type="text"
              id="title"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
              placeholder="e.g., Kendrick Lamar"
            />
          </div>

          <div>
            <label htmlFor="overall" className="block text-sm font-medium text-gray-700 mb-2">
              Overall Rating
            </label>
            <input
              type="number"
              id="overall"
              value={overall}
              onChange={(e) => setOverall(e.target.value)}
              min="0"
              max="99"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
              placeholder="e.g., 99"
            />
            <p className="mt-1 text-sm text-gray-500">
              Enter the 2K overall rating (0-99)
            </p>
          </div>

          <div>
            <label htmlFor="image" className="block text-sm font-medium text-gray-700 mb-2">
              Overall Image *
            </label>
            <input
              type="file"
              id="image"
              accept="image/*"
              required
              onChange={handleImageChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
            {imagePreview && (
              <div className="mt-4">
                <img
                  src={imagePreview}
                  alt="Preview"
                  className="max-w-sm rounded-lg shadow"
                />
              </div>
            )}
          </div>

          <div>
            <label htmlFor="instagramLink" className="block text-sm font-medium text-gray-700 mb-2">
              Instagram Link
            </label>
            <input
              type="url"
              id="instagramLink"
              value={instagramLink}
              onChange={(e) => setInstagramLink(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
              placeholder="https://www.instagram.com/p/..."
            />
            <p className="mt-1 text-sm text-gray-500">
              Link to the Instagram post for this overall
            </p>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label htmlFor="artistTier" className="block text-sm font-medium text-gray-700 mb-2">
                Artist Tier
              </label>
              <select
                id="artistTier"
                value={artistTier}
                onChange={(e) => setArtistTier(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
              >
                {TIERS.map(t => <option key={t.value} value={t.value}>{t.label}</option>)}
              </select>
              <p className="mt-1 text-sm text-gray-500">
                Powers Board filters, Rookie Class, and Rankings views
              </p>
            </div>
            <div>
              <label htmlFor="location" className="block text-sm font-medium text-gray-700 mb-2">
                Location
              </label>
              <input
                type="text"
                id="location"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                placeholder="e.g., Atlanta, GA"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Attributes
            </label>
            <AttributeEditor rows={attributeRows} onChange={setAttributeRows} />
            <p className="mt-1 text-sm text-gray-500">
              Shown on the hero and Overall detail page. Leave value blank to skip that attribute.
            </p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Related Coverage
            </label>
            <ArticleLinker selectedIds={linkedArticleIds} onChange={setLinkedArticleIds} />
          </div>

          <div>
            <label htmlFor="content" className="block text-sm font-medium text-gray-700 mb-2">
              Content/Explanation *
            </label>
            <textarea
              id="content"
              required
              value={content}
              onChange={(e) => setContent(e.target.value)}
              rows={8}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
              placeholder="Explain the rating and why this artist deserves this overall..."
            />
            <p className="mt-2 text-sm text-gray-500">
              Supports Markdown formatting
            </p>
          </div>

          <div className="flex justify-end space-x-4">
            <Link
              to="/admin/overalls"
              className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
            >
              Cancel
            </Link>
            <button
              type="submit"
              disabled={loading}
              className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 disabled:opacity-50"
            >
              {loading ? 'Creating...' : 'Create Overall'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default OverallCreate;
