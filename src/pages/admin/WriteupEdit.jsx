import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import AdminLayout from '../../components/admin/AdminLayout';
import ImageCropper from '../../components/ImageCropper';
import MediaLinksFields from '../../components/admin/MediaLinksFields';

const inputClass = 'w-full border border-ink-line bg-ink px-3 py-2.5 text-sm text-bone placeholder-bone-dim focus:border-brand focus:outline-none';
const labelClass = 'mb-2 block text-xs font-medium uppercase tracking-wide text-bone-dim';

function WriteupEdit() {
  const { id } = useParams();
  const [admin, setAdmin] = useState(null);
  const [title, setTitle] = useState('');
  const [author, setAuthor] = useState('');
  const [content, setContent] = useState('');
  const [tags, setTags] = useState('');
  const [category, setCategory] = useState('article');
  const [instagramLink, setInstagramLink] = useState('');
  const [spotifyUrl, setSpotifyUrl] = useState('');
  const [youtubeUrl, setYoutubeUrl] = useState('');
  const [soundcloudUrl, setSoundcloudUrl] = useState('');
  const [image, setImage] = useState(null);
  const [thumbnail, setThumbnail] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [thumbnailPreview, setThumbnailPreview] = useState(null);
  const [existingImage, setExistingImage] = useState('');
  const [originalImage, setOriginalImage] = useState(null);
  const [showCropper, setShowCropper] = useState(false);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
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

    fetchArticle();
  }, [id, navigate]);

  const fetchArticle = async () => {
    const token = localStorage.getItem('adminToken');

    try {
      const response = await fetch(`${API_URL}/api/koveralls-articles/admin/${id}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });
      const data = await response.json();

      setTitle(data.title);
      setAuthor(data.author || '');
      setContent(data.content);
      setCategory(data.category || 'article');
      setTags(data.tags ? data.tags.join(', ') : '');
      setInstagramLink(data.instagram_link || '');
      setSpotifyUrl(data.spotify_url || '');
      setYoutubeUrl(data.youtube_url || '');
      setSoundcloudUrl(data.soundcloud_url || '');
      setExistingImage(data.image_url || '');
      setImagePreview(data.image_url || '');
      setThumbnailPreview(data.thumbnail_url || '');
    } catch (error) {
      setError('Failed to fetch article');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('adminToken');
    localStorage.removeItem('adminInfo');
    navigate('/admin/login');
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImage(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setOriginalImage(reader.result);
        setImagePreview(reader.result);
        setShowCropper(true);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleCropComplete = (croppedFile, croppedPreview) => {
    setThumbnail(croppedFile);
    setThumbnailPreview(croppedPreview);
    setShowCropper(false);
  };

  const handleCropCancel = () => {
    setShowCropper(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSubmitting(true);

    const token = localStorage.getItem('adminToken');
    if (!token) {
      navigate('/admin/login');
      return;
    }

    try {
      const formData = new FormData();
      formData.append('title', title);
      formData.append('author', author);
      formData.append('content', content);
      formData.append('category', category);
      if (tags) {
        formData.append('tags', tags);
      }
      if (instagramLink) {
        formData.append('instagram_link', instagramLink);
      }
      if (spotifyUrl) {
        formData.append('spotify_url', spotifyUrl);
      }
      if (youtubeUrl) {
        formData.append('youtube_url', youtubeUrl);
      }
      if (soundcloudUrl) {
        formData.append('soundcloud_url', soundcloudUrl);
      }
      if (image) {
        formData.append('image', image);
      }
      if (thumbnail) {
        formData.append('thumbnail', thumbnail);
      }

      const response = await fetch(`${API_URL}/api/koveralls-articles/${id}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
        body: formData,
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Failed to update article');
      }

      navigate('/admin/writeups');
    } catch (error) {
      setError(error.message);
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-ink text-bone-dim">
        Loading...
      </div>
    );
  }

  return (
    <AdminLayout
      admin={admin}
      onLogout={handleLogout}
      title="Edit Article"
      actions={
        <button
          onClick={() => navigate('/admin/writeups')}
          className="border border-ink-line px-4 py-2 text-xs font-bold uppercase tracking-wider text-bone-dim transition-colors hover:border-bone hover:text-bone"
        >
          Back to List
        </button>
      }
    >
      <div className="mx-auto max-w-4xl">
        {error && (
          <div className="mb-4 border border-down/30 bg-down/10 px-4 py-3 text-sm text-down">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6 border border-ink-line bg-ink-soft p-6">
          <div>
            <label htmlFor="title" className={labelClass}>Title *</label>
            <input
              type="text"
              id="title"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className={inputClass}
              placeholder="Article title"
            />
          </div>

          <div>
            <label htmlFor="author" className={labelClass}>Author</label>
            <input
              type="text"
              id="author"
              value={author}
              onChange={(e) => setAuthor(e.target.value)}
              className={inputClass}
              placeholder="Author name"
            />
          </div>

          <div>
            <label htmlFor="category" className={labelClass}>Category *</label>
            <select
              id="category"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className={inputClass}
            >
              <option value="article">Feature</option>
              <option value="interview">Interview</option>
              <option value="review">Review</option>
              <option value="editorial">Editorial</option>
              <option value="rating_update">Rating Update</option>
              <option value="rankings">Rankings</option>
            </select>
            <p className="mt-2 text-xs text-bone-dim">
              Shows up in The Latest on the homepage and can be linked as Related Coverage on an Overall.
            </p>
          </div>

          <div>
            <label htmlFor="image" className={labelClass}>Cover Image</label>
            <input
              type="file"
              id="image"
              accept="image/*"
              onChange={handleImageChange}
              className={`${inputClass} file:mr-3 file:border-0 file:bg-brand file:px-3 file:py-1.5 file:text-xs file:font-bold file:uppercase file:text-ink`}
            />
            <p className="mt-2 text-xs text-bone-dim">
              Leave empty to keep current image
            </p>
            {imagePreview && (
              <div className="mt-4 space-y-4">
                <div>
                  <p className="mb-1 text-xs text-bone-dim">
                    {image ? 'New original (shown on article page):' : 'Current image (shown on article page):'}
                  </p>
                  <img
                    src={imagePreview}
                    alt="Original preview"
                    className="max-w-md border border-ink-line"
                  />
                </div>
                {thumbnailPreview && (
                  <div>
                    <p className="mb-1 text-xs text-bone-dim">Cropped thumbnail (shown on homepage):</p>
                    <img
                      src={thumbnailPreview}
                      alt="Thumbnail preview"
                      className="max-w-md border border-ink-line"
                    />
                  </div>
                )}
                <button
                  type="button"
                  onClick={() => {
                    setOriginalImage(imagePreview);
                    setShowCropper(true);
                  }}
                  className="text-sm font-medium text-brand hover:text-bone"
                >
                  {thumbnailPreview ? 'Re-crop thumbnail' : 'Crop thumbnail for homepage'}
                </button>
              </div>
            )}
          </div>

          <div>
            <label htmlFor="tags" className={labelClass}>Tags</label>
            <input
              type="text"
              id="tags"
              value={tags}
              onChange={(e) => setTags(e.target.value)}
              className={inputClass}
              placeholder="hip-hop, rap, news (comma separated)"
            />
            <p className="mt-1 text-xs text-bone-dim">
              Separate tags with commas
            </p>
          </div>

          <div>
            <label htmlFor="instagramLink" className={labelClass}>Instagram Link</label>
            <input
              type="url"
              id="instagramLink"
              value={instagramLink}
              onChange={(e) => setInstagramLink(e.target.value)}
              className={inputClass}
              placeholder="https://www.instagram.com/p/..."
            />
            <p className="mt-1 text-xs text-bone-dim">
              Link to the Instagram post for this article
            </p>
          </div>

          <div>
            <label className={labelClass}>Media Embeds</label>
            <MediaLinksFields
              spotifyUrl={spotifyUrl}
              onSpotifyUrlChange={setSpotifyUrl}
              youtubeUrl={youtubeUrl}
              onYoutubeUrlChange={setYoutubeUrl}
              soundcloudUrl={soundcloudUrl}
              onSoundcloudUrlChange={setSoundcloudUrl}
            />
            <p className="mt-1 text-xs text-bone-dim">
              Any of these will render as an embedded player on the article page.
            </p>
          </div>

          <div>
            <label htmlFor="content" className={labelClass}>Content *</label>
            <textarea
              id="content"
              required
              value={content}
              onChange={(e) => setContent(e.target.value)}
              rows={12}
              className={inputClass}
              placeholder="Article content (supports Markdown)..."
            />
            <p className="mt-2 text-xs text-bone-dim">
              Supports Markdown formatting
            </p>
          </div>

          <div className="flex justify-end gap-3">
            <button
              type="button"
              onClick={() => navigate('/admin/writeups')}
              className="border border-ink-line px-4 py-2 text-xs font-bold uppercase tracking-wider text-bone-dim transition-colors hover:border-bone hover:text-bone"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="border border-brand bg-brand px-4 py-2 text-xs font-bold uppercase tracking-wider text-ink transition-colors hover:bg-brand-dim disabled:opacity-50"
            >
              {submitting ? 'Updating...' : 'Update Article'}
            </button>
          </div>
        </form>
      </div>

      {/* Image Cropper Modal */}
      {showCropper && originalImage && (
        <ImageCropper
          imageSrc={originalImage}
          onCropComplete={handleCropComplete}
          onCancel={handleCropCancel}
          aspectRatio={16 / 9}
        />
      )}
    </AdminLayout>
  );
}

export default WriteupEdit;
