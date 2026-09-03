import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import AdminLayout from '../../components/admin/AdminLayout';
import { Pill, Icon } from '../../components/admin/ui';

function OverallsList() {
  const [overalls, setOveralls] = useState([]);
  const [admin, setAdmin] = useState(null);
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
    const adminInfo = localStorage.getItem('adminInfo');
    if (adminInfo) setAdmin(JSON.parse(adminInfo));
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
    localStorage.removeItem('adminInfo');
    navigate('/admin/login');
  };

  const squareFeaturedCount = overalls.filter(o => o.is_square_featured).length;

  return (
    <AdminLayout
      admin={admin}
      onLogout={handleLogout}
      title="All Overalls"
      subtitle={`${overalls.length} artist${overalls.length === 1 ? '' : 's'} rated`}
      actions={
        <button
          onClick={() => navigate('/admin/overalls/create')}
          className="flex items-center gap-2 border border-brand bg-brand px-4 py-2 text-xs font-bold uppercase tracking-wider text-ink transition-colors hover:bg-brand-dim"
        >
          <Icon name="add" size={15} /> New Overall
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

          {overalls.length === 0 ? (
            <div className="border border-ink-line bg-ink-soft py-16 text-center text-sm text-bone-dim">
              No overalls yet. Create your first one!
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3">
              {overalls.map((overall) => (
                <div key={overall.id} className="relative border border-ink-line bg-ink-soft">
                  {/* Featured badges */}
                  <div className="absolute right-2 top-2 z-10 flex gap-1">
                    {overall.is_hero_featured && <Pill tone="brand">HERO</Pill>}
                    {overall.is_square_featured && <Pill tone="slate">SQUARE</Pill>}
                  </div>

                  <img
                    src={overall.image_url}
                    alt={overall.title}
                    className="h-48 w-full object-cover"
                  />
                  <div className="p-4">
                    <div className="mb-2 flex items-center gap-2">
                      <h3 className="text-lg font-semibold text-bone">
                        {overall.title}
                      </h3>
                      {overall.artist_tier && <Pill tone="brand">{overall.artist_tier}</Pill>}
                    </div>
                    <p className="mb-3 line-clamp-2 text-sm text-bone-dim">
                      {overall.content.substring(0, 100)}...
                    </p>

                    {/* Featured controls */}
                    <div className="mb-3 flex gap-2">
                      <button
                        onClick={() => handleHeroFeature(overall)}
                        className={`flex-1 border py-1.5 px-2 text-xs font-semibold transition-colors ${
                          overall.is_hero_featured
                            ? 'border-brand bg-brand text-ink hover:bg-brand-dim'
                            : 'border-ink-line text-bone-dim hover:border-brand hover:text-brand'
                        }`}
                      >
                        {overall.is_hero_featured ? 'Remove Hero' : 'Set Hero'}
                      </button>
                      <button
                        onClick={() => handleSquareFeature(overall)}
                        className={`flex-1 border py-1.5 px-2 text-xs font-semibold transition-colors ${
                          overall.is_square_featured
                            ? 'border-bone bg-bone text-ink hover:bg-bone-dim'
                            : 'border-ink-line text-bone-dim hover:border-bone hover:text-bone'
                        }`}
                      >
                        {overall.is_square_featured ? 'Remove Square' : `Set Square (${squareFeaturedCount}/3)`}
                      </button>
                    </div>

                    {/* Crop adjust buttons - only show if featured */}
                    {overall.is_hero_featured && (
                      <button
                        onClick={() => openHeroCropEditor(overall)}
                        className="mb-1 w-full border border-ink-line py-1.5 px-2 text-xs font-semibold text-bone-dim transition-colors hover:border-brand hover:text-brand"
                      >
                        Adjust Hero Crop (Left)
                      </button>
                    )}
                    {overall.is_square_featured && (
                      <button
                        onClick={() => openCropEditor(overall)}
                        className="mb-3 w-full border border-ink-line py-1.5 px-2 text-xs font-semibold text-bone-dim transition-colors hover:border-bone hover:text-bone"
                      >
                        Adjust Square Crop
                      </button>
                    )}

                    <div className="flex items-center justify-between border-t border-ink-line pt-3">
                      <button
                        onClick={() => navigate(`/admin/overalls/edit/${overall.id}`)}
                        className="text-sm font-medium text-brand hover:text-bone"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(overall.id)}
                        className="text-sm font-medium text-down hover:text-bone"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </>
      )}

      {/* Hero Crop Adjustment Modal */}
      {heroCropModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4">
          <div className="w-full max-w-lg border border-ink-line bg-ink-soft p-6">
            <h3 className="mb-1 text-lg font-bold text-bone">
              Adjust Hero Crop — {heroCropModal.overall.title}
            </h3>
            <p className="mb-4 text-xs text-bone-dim">
              Controls how the image appears in the large featured panel on the left of the homepage.
            </p>

            {/* Live Preview — portrait ratio to match actual hero layout */}
            <div className="mx-auto mb-4 border border-brand/40 overflow-hidden" style={{ maxWidth: '200px' }}>
              <div className="relative overflow-hidden" style={{ aspectRatio: '10 / 11' }}>
                <img
                  src={heroCropModal.overall.image_url}
                  alt={heroCropModal.overall.title}
                  className="h-full w-full object-cover"
                  style={{
                    objectPosition: `${heroCropValues.hero_crop_x}% ${heroCropValues.hero_crop_y}%`,
                    transform: `scale(${heroCropValues.hero_crop_zoom / 100})`,
                    transformOrigin: `${heroCropValues.hero_crop_x}% ${heroCropValues.hero_crop_y}%`,
                  }}
                />
              </div>
              <div className="bg-brand/10 py-1 text-center text-[10px] font-semibold text-brand">
                Hero Preview (Left Panel)
              </div>
            </div>

            {/* Sliders */}
            <div className="mb-6 space-y-4">
              <div>
                <label className="mb-1 block text-sm font-medium text-bone-dim">
                  Horizontal Position: {heroCropValues.hero_crop_x}%
                </label>
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={heroCropValues.hero_crop_x}
                  onChange={(e) => setHeroCropValues({ ...heroCropValues, hero_crop_x: parseInt(e.target.value) })}
                  className="w-full accent-brand"
                />
                <div className="flex justify-between text-[10px] text-bone-dim">
                  <span>Left</span>
                  <span>Center</span>
                  <span>Right</span>
                </div>
              </div>

              <div>
                <label className="mb-1 block text-sm font-medium text-bone-dim">
                  Vertical Position: {heroCropValues.hero_crop_y}%
                </label>
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={heroCropValues.hero_crop_y}
                  onChange={(e) => setHeroCropValues({ ...heroCropValues, hero_crop_y: parseInt(e.target.value) })}
                  className="w-full accent-brand"
                />
                <div className="flex justify-between text-[10px] text-bone-dim">
                  <span>Top</span>
                  <span>Center</span>
                  <span>Bottom</span>
                </div>
              </div>

              <div>
                <label className="mb-1 block text-sm font-medium text-bone-dim">
                  Zoom: {heroCropValues.hero_crop_zoom}%
                </label>
                <input
                  type="range"
                  min="100"
                  max="200"
                  value={heroCropValues.hero_crop_zoom}
                  onChange={(e) => setHeroCropValues({ ...heroCropValues, hero_crop_zoom: parseInt(e.target.value) })}
                  className="w-full accent-brand"
                />
                <div className="flex justify-between text-[10px] text-bone-dim">
                  <span>Normal</span>
                  <span>2x Zoom</span>
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="flex gap-3">
              <button
                onClick={() => setHeroCropModal(null)}
                className="flex-1 border border-ink-line py-2 px-4 font-semibold text-bone-dim transition-colors hover:border-bone hover:text-bone"
              >
                Cancel
              </button>
              <button
                onClick={handleHeroCropSave}
                className="flex-1 border border-brand bg-brand py-2 px-4 font-semibold text-ink transition-colors hover:bg-brand-dim"
              >
                Save Hero Crop
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Square Crop Adjustment Modal */}
      {cropModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4">
          <div className="w-full max-w-lg border border-ink-line bg-ink-soft p-6">
            <h3 className="mb-1 text-lg font-bold text-bone">
              Adjust Square Crop — {cropModal.overall.title}
            </h3>
            <p className="mb-4 text-xs text-bone-dim">
              Controls how the image appears in the small square panels on the home page.
            </p>

            {/* Live Preview */}
            <div className="mb-4 border border-ink-line overflow-hidden">
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
                  className="h-full w-full object-cover"
                  style={{
                    objectPosition: `${cropValues.crop_x}% ${cropValues.crop_y}%`,
                    transform: `scale(${cropValues.crop_zoom / 100})`,
                    transformOrigin: `${cropValues.crop_x}% ${cropValues.crop_y}%`,
                  }}
                />
              </div>
            </div>

            {/* Sliders */}
            <div className="mb-6 space-y-4">
              <div>
                <label className="mb-1 block text-sm font-medium text-bone-dim">
                  Horizontal Position: {cropValues.crop_x}%
                </label>
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={cropValues.crop_x}
                  onChange={(e) => setCropValues({ ...cropValues, crop_x: parseInt(e.target.value) })}
                  className="w-full accent-brand"
                />
                <div className="flex justify-between text-[10px] text-bone-dim">
                  <span>Left</span>
                  <span>Center</span>
                  <span>Right</span>
                </div>
              </div>

              <div>
                <label className="mb-1 block text-sm font-medium text-bone-dim">
                  Vertical Position: {cropValues.crop_y}%
                </label>
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={cropValues.crop_y}
                  onChange={(e) => setCropValues({ ...cropValues, crop_y: parseInt(e.target.value) })}
                  className="w-full accent-brand"
                />
                <div className="flex justify-between text-[10px] text-bone-dim">
                  <span>Top</span>
                  <span>Center</span>
                  <span>Bottom</span>
                </div>
              </div>

              <div>
                <label className="mb-1 block text-sm font-medium text-bone-dim">
                  Zoom: {cropValues.crop_zoom}%
                </label>
                <input
                  type="range"
                  min="100"
                  max="200"
                  value={cropValues.crop_zoom}
                  onChange={(e) => setCropValues({ ...cropValues, crop_zoom: parseInt(e.target.value) })}
                  className="w-full accent-brand"
                />
                <div className="flex justify-between text-[10px] text-bone-dim">
                  <span>Normal</span>
                  <span>2x Zoom</span>
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="flex gap-3">
              <button
                onClick={() => setCropModal(null)}
                className="flex-1 border border-ink-line py-2 px-4 font-semibold text-bone-dim transition-colors hover:border-bone hover:text-bone"
              >
                Cancel
              </button>
              <button
                onClick={
                  (cropModal.overall.is_hero_featured || cropModal.overall.is_square_featured)
                    ? handleCropOnlySave
                    : handleCropSave
                }
                className="flex-1 border border-brand bg-brand py-2 px-4 font-semibold text-ink transition-colors hover:bg-brand-dim"
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}
    </AdminLayout>
  );
}

export default OverallsList;
