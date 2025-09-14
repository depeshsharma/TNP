import { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { usePosts } from '../context/PostContext';
import PostCard from '../components/PostCard';
import SearchBar from '../components/SearchBar';
import FilterBar from '../components/FilterBar';
import LoadingSpinner from '../components/LoadingSpinner';

const Home = () => {
  const { posts, loading, pagination, fetchPosts, searchPosts, getFeaturedPosts } = usePosts();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [featuredPosts, setFeaturedPosts] = useState([]);
  const [showFeatured, setShowFeatured] = useState(true);

  // Load initial posts and featured posts
  useEffect(() => {
    fetchPosts(1, { category: selectedCategory });
    loadFeaturedPosts();
  }, [selectedCategory]);

  const loadFeaturedPosts = async () => {
    const featured = await getFeaturedPosts();
    setFeaturedPosts(featured);
  };

  // Infinite scroll handler
  const handleScroll = useCallback(() => {
    if (
      window.innerHeight + document.documentElement.scrollTop >=
      document.documentElement.offsetHeight - 1000
    ) {
      if (!loading && pagination.hasNext) {
        const nextPage = pagination.current + 1;
        if (searchQuery) {
          searchPosts(searchQuery, nextPage);
        } else {
          fetchPosts(nextPage, { category: selectedCategory });
        }
      }
    }
  }, [loading, pagination, searchQuery, selectedCategory, fetchPosts, searchPosts]);

  useEffect(() => {
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [handleScroll]);

  const handleSearch = (query) => {
    setSearchQuery(query);
    if (query.trim()) {
      searchPosts(query, 1);
    } else {
      fetchPosts(1, { category: selectedCategory });
    }
  };

  const handleCategoryFilter = (category) => {
    setSelectedCategory(category);
    setSearchQuery('');
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  return (
    <div className="max-w-6xl mx-auto">
      {/* Hero Section */}
      <div className="text-center mb-12">
        <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
          Welcome to <span className="gradient-text">T&P Portal</span>
        </h1>
        <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
          Discover opportunities, share experiences, and connect with the Training & Placement community
        </p>
        
        {/* Search Bar */}
        <SearchBar onSearch={handleSearch} />
      </div>

      {/* Featured Posts Section */}
      {showFeatured && featuredPosts.length > 0 && (
        <div className="mb-12">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-gray-900">Featured Posts</h2>
            <button
              onClick={() => setShowFeatured(false)}
              className="text-gray-500 hover:text-gray-700 transition-colors duration-200"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {featuredPosts.map((post) => (
              <div key={post._id} className="card card-hover bg-gradient-to-br from-blue-50 to-purple-50 border-blue-200">
                <div className="flex items-center justify-between mb-3">
                  <span className="category-badge category-featured bg-gradient-to-r from-yellow-400 to-orange-500 text-white">
                    Featured
                  </span>
                  <span className="text-sm text-gray-500">{formatDate(post.createdAt)}</span>
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2 line-clamp-2">
                  {post.title}
                </h3>
                <p className="text-gray-600 text-sm mb-4 line-clamp-3">
                  {post.excerpt}
                </p>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-500">By {post.author}</span>
                  <Link
                    to={`/post/${post._id}`}
                    className="text-blue-600 hover:text-blue-700 font-medium text-sm transition-colors duration-200"
                  >
                    Read more →
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Filter Bar */}
      <FilterBar 
        selectedCategory={selectedCategory}
        onCategorySelect={handleCategoryFilter}
      />

      {/* Posts Grid */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-gray-900">
            {searchQuery ? `Search Results for "${searchQuery}"` : 
             selectedCategory ? `${selectedCategory.charAt(0).toUpperCase() + selectedCategory.slice(1)} Posts` : 
             'All Posts'}
          </h2>
          <div className="text-sm text-gray-500">
            {pagination.total} posts found
          </div>
        </div>

        {loading && posts.length === 0 ? (
          <div className="flex justify-center py-12">
            <LoadingSpinner />
          </div>
        ) : posts.length === 0 ? (
          <div className="text-center py-12">
            <div className="w-24 h-24 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
              <svg className="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">No posts found</h3>
            <p className="text-gray-500 mb-4">
              {searchQuery ? 'Try adjusting your search terms' : 'Be the first to create a post!'}
            </p>
            <Link
              to="/create-post"
              className="btn-gradient px-6 py-2 rounded-lg font-medium transition-all duration-200 hover:shadow-lg"
            >
              Create Post
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {posts.map((post) => (
              <PostCard key={post._id} post={post} />
            ))}
          </div>
        )}

        {/* Loading indicator for infinite scroll */}
        {loading && posts.length > 0 && (
          <div className="flex justify-center py-8">
            <LoadingSpinner />
          </div>
        )}

        {/* End of results indicator */}
        {!loading && !pagination.hasNext && posts.length > 0 && (
          <div className="text-center py-8 text-gray-500">
            <p>You've reached the end of the posts</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Home;
