import { useState, useEffect } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import ImageCropper from '../../components/ImageCropper';

function ArticleEdit() {
  const { id } = useParams();
  const [title, setTitle] = useState('');
  const [author, setAuthor] = useState('');
  const [content, setContent] = useState('');
  const [tags, setTags] = useState('');
  const [category, setCategory] = useState('trends');
  const [instagramLink, setInstagramLink] = useState('');
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

    fetchArticle();
  }, [id, navigate]);

  const fetchArticle = async () => {
    const token = localStorage.getItem('adminToken');

    try {
      const response = await fetch(`${API_URL}/api/lowkeygrid/articles/admin/${id}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });
      const data = await response.json();

      setTitle(data.title);
      setAuthor(data.author);
      setContent(data.content);
      setCategory(data.category || 'trends');
      setTags(data.tags ? data.tags.join(', ') : '');
      setInstagramLink(data.instagram_link || '');
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
      if (image) {
        formData.append('image', image);
      }
      if (thumbnail) {
        formData.append('thumbnail', thumbnail);
      }

      const response = await fetch(`${API_URL}/api/lowkeygrid/articles/${id}`, {
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

      navigate('/admin/articles');
    } catch (error) {
      setError(error.message);
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-xl">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex justify-between items-center">
            <h1 className="text-2xl font-bold text-gray-900">Edit Article</h1>
            <Link
              to="/admin/articles"
              className="bg-gray-600 text-white px-4 py-2 rounded-md hover:bg-gray-700"
            >
              Back to List
            </Link>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
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
              placeholder="Article title"
            />
          </div>

          <div>
            <label htmlFor="author" className="block text-sm font-medium text-gray-700 mb-2">
              Author *
            </label>
            <input
              type="text"
              id="author"
              required
              value={author}
              onChange={(e) => setAuthor(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
              placeholder="Author name"
            />
          </div>

          <div>
            <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-2">
              Category *
            </label>
            <select
              id="category"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              <option value="trends">Trends (News list on 2koveralls)</option>
              <option value="article">Article (Shared with Cry808)</option>
              <option value="interview">Interview (Shared with Cry808)</option>
              <option value="review">Review</option>
              <option value="editorial">Editorial</option>
              <option value="rating_update">Rating Update</option>
              <option value="rankings">Rankings</option>
            </select>
            <p className="mt-2 text-sm text-gray-500">
              'Trends' appears on the /news list. All categories show up in The Latest / Related Coverage and have their own detail page.
            </p>
          </div>

          <div>
            <label htmlFor="image" className="block text-sm font-medium text-gray-700 mb-2">
              Cover Image
            </label>
            <input
              type="file"
              id="image"
              accept="image/*"
              onChange={handleImageChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
            <p className="mt-2 text-sm text-gray-500">
              Leave empty to keep current image
            </p>
            {imagePreview && (
              <div className="mt-4 space-y-4">
                <div>
                  <p className="text-sm text-gray-600 mb-1">
                    {image ? 'New original (shown on article page):' : 'Current image (shown on article page):'}
                  </p>
                  <img
                    src={imagePreview}
                    alt="Original preview"
                    className="max-w-md rounded-lg shadow"
                  />
                </div>
                {thumbnailPreview && (
                  <div>
                    <p className="text-sm text-gray-600 mb-1">Cropped thumbnail (shown on homepage):</p>
                    <img
                      src={thumbnailPreview}
                      alt="Thumbnail preview"
                      className="max-w-md rounded-lg shadow"
                    />
                  </div>
                )}
                <button
                  type="button"
                  onClick={() => {
                    setOriginalImage(imagePreview);
                    setShowCropper(true);
                  }}
                  className="text-sm text-orange-600 hover:text-orange-700 font-medium"
                >
                  {thumbnailPreview ? 'Re-crop thumbnail' : 'Crop thumbnail for homepage'}
                </button>
              </div>
            )}
          </div>

          <div>
            <label htmlFor="tags" className="block text-sm font-medium text-gray-700 mb-2">
              Tags
            </label>
            <input
              type="text"
              id="tags"
              value={tags}
              onChange={(e) => setTags(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
              placeholder="hip-hop, rap, news (comma separated)"
            />
            <p className="mt-1 text-sm text-gray-500">
              Separate tags with commas
            </p>
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
              Link to the Instagram post for this article
            </p>
          </div>

          <div>
            <label htmlFor="content" className="block text-sm font-medium text-gray-700 mb-2">
              Content *
            </label>
            <textarea
              id="content"
              required
              value={content}
              onChange={(e) => setContent(e.target.value)}
              rows={12}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
              placeholder="Article content (supports Markdown)..."
            />
            <p className="mt-2 text-sm text-gray-500">
              Supports Markdown formatting
            </p>
          </div>

          <div className="flex justify-end space-x-4">
            <Link
              to="/admin/articles"
              className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
            >
              Cancel
            </Link>
            <button
              type="submit"
              disabled={submitting}
              className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 disabled:opacity-50"
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
    </div>
  );
}

export default ArticleEdit;
