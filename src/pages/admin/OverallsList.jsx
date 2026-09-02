import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';

function OverallsList() {
  const [overalls, setOveralls] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [cropModal, setCropModal] = useState(null); // { overall, type: 'hero' | 'square' }
  const [cropValues, setCropValues] = useState({ crop_x: 50, crop_y: 50, crop_zoom: 100 });
  const [heroCropModal, setHeroCropModal] = useState(null); // { overall }
  const [heroCropValues, setHeroCropValues] = useState({ hero_crop_x: 50, hero_crop_y: 50, hero_crop_zoom: 100 });
  const navigate = useNavigate();
  const API_URL = import.meta.env.VITE_API_URL;

  useEffect(() => {
    const token = localStorage.getItem('adminToken');
    if (!token) {
      navigate('/admin/login');
      return;
    }
    fetchOveralls();
  }, [navigate]);

  const fetchOveralls = async () => {
    try {
      const response = await fetch(`${API_URL}/api/overalls`);
      const data = await response.json();
      setOveralls(data);
    } catch (error) {
      setError('Failed to fetch overalls');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm('Are you sure you want to delete this overall?')) return;
    const token = localStorage.getItem('adminToken');
    try {
      const response = await fetch(`${API_URL}/api/overalls/${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` },
      });
      if (response.ok) {
        setOveralls(overalls.filter(o => o.id !== id));
      } else {
        alert('Failed to delete overall');
      }
    } catch (error) {
      console.error('Error deleting overall:', error);
      alert('Failed to delete overall');
    }
  };

  const handleHeroFeature = async (overall) => {
    const token = localStorage.getItem('adminToken');
    try {
      if (overall.is_hero_featured) {
        // Remove hero featured
        await fetch(`${API_URL}/api/overalls/${overall.id}/hero-feature`, {
          method: 'DELETE',
          headers: { 'Authorization': `Bearer ${token}` },
        });
      } else {
        // Set as hero featured - open crop modal
        setCropModal({ overall, type: 'hero' });
        setCropValues({
          crop_x: overall.crop_x ?? 50,
          crop_y: overall.crop_y ?? 50,
          crop_zoom: overall.crop_zoom ?? 100,
        });
        return; // Don't refresh yet, wait for crop save
      }
      await fetchOveralls();
    } catch (error) {
      console.error('Error toggling hero featured:', error);
      alert('Failed to update featured status');
    }
  };

  const handleSquareFeature = async (overall) => {
    const token = localStorage.getItem('adminToken');
    try {
      if (overall.is_square_featured) {
        // Remove square featured
        await fetch(`${API_URL}/api/overalls/${overall.id}/square-feature`, {
          method: 'DELETE',
          headers: { 'Authorization': `Bearer ${token}` },
        });
        await fetchOveralls();
      } else {
        // Check count
        const squareCount = overalls.filter(o => o.is_square_featured).length;
        if (squareCount >= 3) {
          alert('Maximum 3 square featured overalls. Remove one first.');
          return;
        }
        // Open crop modal
        setCropModal({ overall, type: 'square' });
        setCropValues({
          crop_x: overall.crop_x ?? 50,
          crop_y: overall.crop_y ?? 50,
          crop_zoom: overall.crop_zoom ?? 100,
        });
      }
    } catch (error) {
      console.error('Error toggling square featured:', error);
      alert('Failed to update featured status');
    }
  };

  const handleCropSave = async () => {
    if (!cropModal) return;
    const token = localStorage.getItem('adminToken');
    const { overall, type } = cropModal;

    try {
      // First set as featured
      const featureUrl = type === 'hero'
        ? `${API_URL}/api/overalls/${overall.id}/hero-feature`
        : `${API_URL}/api/overalls/${overall.id}/square-feature`;

      const featureRes = await fetch(featureUrl, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (!featureRes.ok) {
        const errData = await featureRes.json();
        alert(errData.error || 'Failed to set featured');
        return;
      }

      // Then save crop settings
      await fetch(`${API_URL}/api/overalls/${overall.id}/crop`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(cropValues),
      });

      setCropModal(null);
      await fetchOveralls();
    } catch (error) {
      console.error('Error saving crop:', error);
      alert('Failed to save');
    }
  };

  const openCropEditor = (overall) => {
    setCropModal({ overall, type: overall.is_hero_featured ? 'hero' : 'square' });
    setCropValues({
      crop_x: overall.crop_x ?? 50,
      crop_y: overall.crop_y ?? 50,
      crop_zoom: overall.crop_zoom ?? 100,
    });
  };

  const handleCropOnlySave = async () => {
    if (!cropModal) return;
    const token = localStorage.getItem('adminToken');
    try {
      await fetch(`${API_URL}/api/overalls/${cropModal.overall.id}/crop`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(cropValues),
      });
      setCropModal(null);
      await fetchOveralls();
    } catch (error) {
      console.error('Error saving crop:', error);
      alert('Failed to save crop');
    }
  };

  const openHeroCropEditor = (overall) => {
    setHeroCropModal({ overall });
    setHeroCropValues({
      hero_crop_x: overall.hero_crop_x ?? overall.crop_x ?? 50,
      hero_crop_y: overall.hero_crop_y ?? overall.crop_y ?? 50,
      hero_crop_zoom: overall.hero_crop_zoom ?? overall.crop_zoom ?? 100,
    });
  };

  const handleHeroCropSave = async () => {
    if (!heroCropModal) return;
    const token = localStorage.getItem('adminToken');
    try {
      await fetch(`${API_URL}/api/overalls/${heroCropModal.overall.id}/hero-crop`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(heroCropValues),
      });
      setHeroCropModal(null);
      await fetchOveralls();
    } catch (error) {
      console.error('Error saving hero crop:', error);
      alert('Failed to save hero crop');
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('adminToken');
    navigate('/admin/login');
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-xl">Loading...</div>
      </div>
    );
  }

  const squareFeaturedCount = overalls.filter(o => o.is_square_featured).length;

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex justify-between items-center">
            <h1 className="text-2xl font-bold text-gray-900">2K Overalls Admin</h1>
            <div className="flex space-x-4">
              <Link
                to="/admin/articles"
                className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700"
              >
                News Articles
              </Link>
              <Link
                to="/admin/spotify"
                className="bg-purple-600 text-white px-4 py-2 rounded-md hover:bg-purple-700"
              >
                Spotify Playlists
              </Link>
              <Link
                to="/admin/overalls/create"
                className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700"
              >
                Create New Overall
              </Link>
              <button
                onClick={handleLogout}
                className="bg-gray-600 text-white px-4 py-2 rounded-md hover:bg-gray-700"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {error && (
          <div className="bg-red-50 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            {error}
          </div>
        )}

        {overalls.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg">No overalls yet. Create your first one!</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {overalls.map((overall) => (
              <div key={overall.id} className="bg-white rounded-lg shadow overflow-hidden relative">
                {/* Featured badges */}
                <div className="absolute top-2 right-2 z-10 flex gap-1">
                  {overall.is_hero_featured && (
                    <span className="bg-orange-500 text-white text-[10px] font-bold px-2 py-0.5 rounded">HERO</span>
                  )}
                  {overall.is_square_featured && (
                    <span className="bg-blue-500 text-white text-[10px] font-bold px-2 py-0.5 rounded">SQUARE</span>
                  )}
                </div>

                <img
                  src={overall.image_url}
                  alt={overall.title}
                  className="w-full h-48 object-cover"
                />
                <div className="p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <h3 className="text-lg font-semibold text-gray-900">
                      {overall.title}
                    </h3>
                    {overall.artist_tier && (
                      <span className="bg-purple-100 text-purple-700 text-[10px] font-bold px-2 py-0.5 rounded uppercase">
                        {overall.artist_tier}
                      </span>
                    )}
                  </div>
                  <p className="text-sm text-gray-600 mb-3 line-clamp-2">
                    {overall.content.substring(0, 100)}...
                  </p>

                  {/* Featured controls */}
                  <div className="flex gap-2 mb-3">
                    <button
                      onClick={() => handleHeroFeature(overall)}
                      className={`flex-1 text-xs font-semibold py-1.5 px-2 rounded transition-colors ${
                        overall.is_hero_featured
                          ? 'bg-orange-500 text-white hover:bg-orange-600'
                          : 'bg-gray-100 text-gray-700 hover:bg-orange-100 hover:text-orange-700'
                      }`}
                    >
                      {overall.is_hero_featured ? 'Remove Hero' : 'Set Hero'}
                    </button>
                    <button
                      onClick={() => handleSquareFeature(overall)}
                      className={`flex-1 text-xs font-semibold py-1.5 px-2 rounded transition-colors ${
                        overall.is_square_featured
                          ? 'bg-blue-500 text-white hover:bg-blue-600'
                          : 'bg-gray-100 text-gray-700 hover:bg-blue-100 hover:text-blue-700'
                      }`}
                    >
                      {overall.is_square_featured ? 'Remove Square' : `Set Square (${squareFeaturedCount}/3)`}
                    </button>
                  </div>

                  {/* Crop adjust buttons - only show if featured */}
                  {overall.is_hero_featured && (
                    <button
                      onClick={() => openHeroCropEditor(overall)}
                      className="w-full text-xs font-semibold py-1.5 px-2 rounded bg-orange-100 text-orange-700 hover:bg-orange-200 transition-colors mb-1"
                    >
                      Adjust Hero Crop (Left)
                    </button>
                  )}
                  {overall.is_square_featured && (
                    <button
                      onClick={() => openCropEditor(overall)}
                      className="w-full text-xs font-semibold py-1.5 px-2 rounded bg-blue-100 text-blue-700 hover:bg-blue-200 transition-colors mb-3"
                    >
                      Adjust Square Crop
                    </button>
                  )}

                  <div className="flex justify-between items-center">
                    <Link
                      to={`/admin/overalls/edit/${overall.id}`}
                      className="text-indigo-600 hover:text-indigo-800 font-medium"
                    >
                      Edit
                    </Link>
                    <button
                      onClick={() => handleDelete(overall.id)}
                      className="text-red-600 hover:text-red-800 font-medium"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Hero Crop Adjustment Modal */}
      {heroCropModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg max-w-lg w-full p-6">
            <h3 className="text-lg font-bold text-gray-900 mb-1">
              Adjust Hero Crop — {heroCropModal.overall.title}
            </h3>
            <p className="text-xs text-gray-500 mb-4">
              Controls how the image appears in the large featured panel on the left of the homepage.
            </p>

            {/* Live Preview — portrait ratio to match actual hero layout */}
            <div className="mb-4 border-2 border-orange-200 rounded overflow-hidden mx-auto" style={{ maxWidth: '200px' }}>
              <div className="relative overflow-hidden" style={{ aspectRatio: '10 / 11' }}>
                <img
                  src={heroCropModal.overall.image_url}
                  alt={heroCropModal.overall.title}
                  className="w-full h-full object-cover"
                  style={{
                    objectPosition: `${heroCropValues.hero_crop_x}% ${heroCropValues.hero_crop_y}%`,
                    transform: `scale(${heroCropValues.hero_crop_zoom / 100})`,
                    transformOrigin: `${heroCropValues.hero_crop_x}% ${heroCropValues.hero_crop_y}%`,
                  }}
                />
              </div>
              <div className="text-center text-[10px] text-orange-600 font-semibold py-1 bg-orange-50">
                Hero Preview (Left Panel)
              </div>
            </div>

            {/* Sliders */}
            <div className="space-y-4 mb-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Horizontal Position: {heroCropValues.hero_crop_x}%
                </label>
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={heroCropValues.hero_crop_x}
                  onChange={(e) => setHeroCropValues({ ...heroCropValues, hero_crop_x: parseInt(e.target.value) })}
                  className="w-full accent-orange-500"
                />
                <div className="flex justify-between text-[10px] text-gray-400">
                  <span>Left</span>
                  <span>Center</span>
                  <span>Right</span>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Vertical Position: {heroCropValues.hero_crop_y}%
                </label>
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={heroCropValues.hero_crop_y}
                  onChange={(e) => setHeroCropValues({ ...heroCropValues, hero_crop_y: parseInt(e.target.value) })}
                  className="w-full accent-orange-500"
                />
                <div className="flex justify-between text-[10px] text-gray-400">
                  <span>Top</span>
                  <span>Center</span>
                  <span>Bottom</span>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Zoom: {heroCropValues.hero_crop_zoom}%
                </label>
                <input
                  type="range"
                  min="100"
                  max="200"
                  value={heroCropValues.hero_crop_zoom}
                  onChange={(e) => setHeroCropValues({ ...heroCropValues, hero_crop_zoom: parseInt(e.target.value) })}
                  className="w-full accent-orange-500"
                />
                <div className="flex justify-between text-[10px] text-gray-400">
                  <span>Normal</span>
                  <span>2x Zoom</span>
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="flex gap-3">
              <button
                onClick={() => setHeroCropModal(null)}
                className="flex-1 py-2 px-4 rounded bg-gray-200 text-gray-700 font-semibold hover:bg-gray-300 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleHeroCropSave}
                className="flex-1 py-2 px-4 rounded bg-orange-500 text-white font-semibold hover:bg-orange-600 transition-colors"
              >
                Save Hero Crop
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Square Crop Adjustment Modal */}
      {cropModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg max-w-lg w-full p-6">
            <h3 className="text-lg font-bold text-gray-900 mb-1">
              Adjust Square Crop — {cropModal.overall.title}
            </h3>
            <p className="text-xs text-gray-500 mb-4">
              Controls how the image appears in the small square panels on the home page.
            </p>

            {/* Live Preview */}
            <div className="mb-4 border-2 border-gray-200 rounded overflow-hidden">
              <div
                className="relative overflow-hidden"
                style={{
                  height: cropModal.type === 'hero' ? '200px' : '200px',
                  aspectRatio: cropModal.type === 'square' ? '1 / 1' : undefined,
                  maxWidth: cropModal.type === 'square' ? '200px' : undefined,
                  margin: cropModal.type === 'square' ? '0 auto' : undefined,
                }}
              >
                <img
                  src={cropModal.overall.image_url}
                  alt={cropModal.overall.title}
                  className="w-full h-full object-cover"
                  style={{
                    objectPosition: `${cropValues.crop_x}% ${cropValues.crop_y}%`,
                    transform: `scale(${cropValues.crop_zoom / 100})`,
                    transformOrigin: `${cropValues.crop_x}% ${cropValues.crop_y}%`,
                  }}
                />
              </div>
            </div>

            {/* Sliders */}
            <div className="space-y-4 mb-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Horizontal Position: {cropValues.crop_x}%
                </label>
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={cropValues.crop_x}
                  onChange={(e) => setCropValues({ ...cropValues, crop_x: parseInt(e.target.value) })}
                  className="w-full accent-orange-500"
                />
                <div className="flex justify-between text-[10px] text-gray-400">
                  <span>Left</span>
                  <span>Center</span>
                  <span>Right</span>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Vertical Position: {cropValues.crop_y}%
                </label>
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={cropValues.crop_y}
                  onChange={(e) => setCropValues({ ...cropValues, crop_y: parseInt(e.target.value) })}
                  className="w-full accent-orange-500"
                />
                <div className="flex justify-between text-[10px] text-gray-400">
                  <span>Top</span>
                  <span>Center</span>
                  <span>Bottom</span>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Zoom: {cropValues.crop_zoom}%
                </label>
                <input
                  type="range"
                  min="100"
                  max="200"
                  value={cropValues.crop_zoom}
                  onChange={(e) => setCropValues({ ...cropValues, crop_zoom: parseInt(e.target.value) })}
                  className="w-full accent-orange-500"
                />
                <div className="flex justify-between text-[10px] text-gray-400">
                  <span>Normal</span>
                  <span>2x Zoom</span>
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="flex gap-3">
              <button
                onClick={() => setCropModal(null)}
                className="flex-1 py-2 px-4 rounded bg-gray-200 text-gray-700 font-semibold hover:bg-gray-300 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={
                  (cropModal.overall.is_hero_featured || cropModal.overall.is_square_featured)
                    ? handleCropOnlySave
                    : handleCropSave
                }
                className="flex-1 py-2 px-4 rounded bg-orange-500 text-white font-semibold hover:bg-orange-600 transition-colors"
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default OverallsList;
