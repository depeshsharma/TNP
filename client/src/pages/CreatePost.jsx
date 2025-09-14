import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { usePosts } from '../context/PostContext';
// Simple textarea editor instead of ReactQuill
import LoadingSpinner from '../components/LoadingSpinner';

const CreatePost = () => {
  const navigate = useNavigate();
  const { isAuthenticated, user } = useAuth();
  const { createPost } = usePosts();
  
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    category: 'general',
    tags: '',
    featured: false,
    imageUrl: ''
  });
  
  const [loading, setLoading] = useState(false);
  const [preview, setPreview] = useState(false);

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
    }
  }, [isAuthenticated, navigate]);

  const handleChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.title.trim() || !formData.content.trim()) {
      alert('Please fill in all required fields');
      return;
    }

    try {
      setLoading(true);
      
      const tagsArray = formData.tags
        .split(',')
        .map(tag => tag.trim())
        .filter(tag => tag.length > 0);

      const postData = {
        ...formData,
        tags: tagsArray
      };

      const result = await createPost(postData);
      
      if (result.success) {
        navigate(`/post/${result.post._id}`);
      } else {
        alert(result.message || 'Failed to create post');
      }
    } catch (error) {
      console.error('Error creating post:', error);
      alert('Failed to create post');
    } finally {
      setLoading(false);
    }
  };

  // Simple textarea editor - no complex configuration needed

  if (!isAuthenticated) {
    return (
      <div className="max-w-4xl mx-auto">
        <div className="text-center py-12">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Please login to create a post</h1>
          <button
            onClick={() => navigate('/login')}
            className="btn-gradient px-6 py-2 rounded-lg font-medium transition-all duration-200 hover:shadow-lg"
          >
            Login
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Create New Post</h1>
        <p className="text-gray-600">Share your thoughts, opportunities, or experiences with the community</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Title */}
        <div>
          <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-2">
            Title *
          </label>
          <input
            type="text"
            id="title"
            value={formData.title}
            onChange={(e) => handleChange('title', e.target.value)}
            placeholder="Enter a compelling title for your post"
            className="input text-lg"
            required
          />
        </div>

        {/* Category and Featured */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-2">
              Category
            </label>
            <select
              id="category"
              value={formData.category}
              onChange={(e) => handleChange('category', e.target.value)}
              className="input"
            >
              <option value="general">General</option>
              <option value="job">Job</option>
              <option value="internship">Internship</option>
              <option value="training">Training</option>
              <option value="placement">Placement</option>
              <option value="announcement">Announcement</option>
            </select>
          </div>

          <div className="flex items-center space-x-3">
            <input
              type="checkbox"
              id="featured"
              checked={formData.featured}
              onChange={(e) => handleChange('featured', e.target.checked)}
              className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
            />
            <label htmlFor="featured" className="text-sm font-medium text-gray-700">
              Mark as featured post
            </label>
          </div>
        </div>

        {/* Image URL */}
        <div>
          <label htmlFor="imageUrl" className="block text-sm font-medium text-gray-700 mb-2">
            Featured Image URL (optional)
          </label>
          <input
            type="url"
            id="imageUrl"
            value={formData.imageUrl}
            onChange={(e) => handleChange('imageUrl', e.target.value)}
            placeholder="https://example.com/image.jpg"
            className="input"
          />
        </div>

        {/* Tags */}
        <div>
          <label htmlFor="tags" className="block text-sm font-medium text-gray-700 mb-2">
            Tags (comma-separated)
          </label>
          <input
            type="text"
            id="tags"
            value={formData.tags}
            onChange={(e) => handleChange('tags', e.target.value)}
            placeholder="e.g., javascript, react, internship, 2024"
            className="input"
          />
        </div>

        {/* Content Editor */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Content *
          </label>
          <textarea
            value={formData.content}
            onChange={(e) => handleChange('content', e.target.value)}
            placeholder="Write your post content here... You can use basic HTML tags like &lt;b&gt;, &lt;i&gt;, &lt;p&gt;, &lt;br&gt;, &lt;ul&gt;, &lt;li&gt; etc."
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            rows={12}
          />
          <p className="text-sm text-gray-500 mt-1">
            You can use basic HTML tags for formatting: &lt;b&gt;bold&lt;/b&gt;, &lt;i&gt;italic&lt;/i&gt;, &lt;br&gt; for line breaks, &lt;ul&gt;&lt;li&gt; for lists
          </p>
        </div>

        {/* Preview Toggle */}
        <div className="flex items-center space-x-3">
          <input
            type="checkbox"
            id="preview"
            checked={preview}
            onChange={(e) => setPreview(e.target.checked)}
            className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
          />
          <label htmlFor="preview" className="text-sm font-medium text-gray-700">
            Preview post before publishing
          </label>
        </div>

        {/* Preview */}
        {preview && (
          <div className="border border-gray-300 rounded-lg p-6 bg-gray-50">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Preview</h3>
            <div className="prose max-w-none">
              <h1 className="text-2xl font-bold text-gray-900 mb-4">{formData.title}</h1>
              <div dangerouslySetInnerHTML={{ __html: formData.content }} />
            </div>
          </div>
        )}

        {/* Submit Buttons */}
        <div className="flex items-center justify-between pt-6 border-t border-gray-200">
          <button
            type="button"
            onClick={() => navigate('/')}
            className="btn-secondary"
          >
            Cancel
          </button>
          
          <div className="flex items-center space-x-4">
            <button
              type="button"
              onClick={() => setPreview(!preview)}
              className="btn-secondary"
            >
              {preview ? 'Hide Preview' : 'Preview'}
            </button>
            
            <button
              type="submit"
              disabled={loading}
              className="btn-gradient disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <div className="flex items-center space-x-2">
                  <LoadingSpinner size="small" text="" />
                  <span>Creating...</span>
                </div>
              ) : (
                'Create Post'
              )}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default CreatePost;
