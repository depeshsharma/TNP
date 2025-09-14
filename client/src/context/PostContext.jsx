import { createContext, useContext, useState } from 'react';
import axios from 'axios';

const PostContext = createContext();

export const usePosts = () => {
  const context = useContext(PostContext);
  if (!context) {
    throw new Error('usePosts must be used within a PostProvider');
  }
  return context;
};

export const PostProvider = ({ children }) => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [pagination, setPagination] = useState({
    current: 1,
    pages: 1,
    total: 0,
    hasNext: false,
    hasPrev: false
  });

  const fetchPosts = async (page = 1, filters = {}) => {
    setLoading(true);
    try {
      const params = new URLSearchParams({
        page: page.toString(),
        limit: '10',
        ...filters
      });

      const response = await axios.get(`http://localhost:5000/api/posts?${params}`);
      const { posts: newPosts, pagination: newPagination } = response.data.data;

      if (page === 1) {
        setPosts(newPosts);
      } else {
        setPosts(prev => [...prev, ...newPosts]);
      }
      
      setPagination(newPagination);
    } catch (error) {
      console.error('Error fetching posts:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchPost = async (id) => {
    try {
      const response = await axios.get(`http://localhost:5000/api/posts/${id}`);
      return response.data.data;
    } catch (error) {
      console.error('Error fetching post:', error);
      throw error;
    }
  };

  const createPost = async (postData) => {
    try {
      const response = await axios.post('http://localhost:5000/api/posts', postData);
      const newPost = response.data.data;
      
      setPosts(prev => [newPost, ...prev]);
      return { success: true, post: newPost };
    } catch (error) {
      console.error('Error creating post:', error);
      return { 
        success: false, 
        message: error.response?.data?.message || 'Failed to create post' 
      };
    }
  };

  const updatePost = async (id, postData) => {
    try {
      const response = await axios.put(`http://localhost:5000/api/posts/${id}`, postData);
      const updatedPost = response.data.data;
      
      setPosts(prev => 
        prev.map(post => post._id === id ? updatedPost : post)
      );
      
      return { success: true, post: updatedPost };
    } catch (error) {
      console.error('Error updating post:', error);
      return { 
        success: false, 
        message: error.response?.data?.message || 'Failed to update post' 
      };
    }
  };

  const deletePost = async (id) => {
    try {
      await axios.delete(`http://localhost:5000/api/posts/${id}`);
      
      setPosts(prev => prev.filter(post => post._id !== id));
      return { success: true };
    } catch (error) {
      console.error('Error deleting post:', error);
      return { 
        success: false, 
        message: error.response?.data?.message || 'Failed to delete post' 
      };
    }
  };

  const likePost = async (id) => {
    try {
      const response = await axios.post(`http://localhost:5000/api/posts/${id}/like`);
      const { likes } = response.data;
      
      setPosts(prev => 
        prev.map(post => 
          post._id === id ? { ...post, likes } : post
        )
      );
      
      return { success: true, likes };
    } catch (error) {
      console.error('Error liking post:', error);
      return { 
        success: false, 
        message: error.response?.data?.message || 'Failed to like post' 
      };
    }
  };

  const searchPosts = async (query, page = 1) => {
    setLoading(true);
    try {
      const response = await axios.get(`http://localhost:5000/api/posts/search/${query}?page=${page}&limit=10`);
      const { posts: searchResults, pagination: searchPagination } = response.data.data;

      if (page === 1) {
        setPosts(searchResults);
      } else {
        setPosts(prev => [...prev, ...searchResults]);
      }
      
      setPagination(searchPagination);
    } catch (error) {
      console.error('Error searching posts:', error);
    } finally {
      setLoading(false);
    }
  };

  const getFeaturedPosts = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/posts/featured/list');
      return response.data.data;
    } catch (error) {
      console.error('Error fetching featured posts:', error);
      return [];
    }
  };

  const getPostsByCategory = async (category, page = 1) => {
    setLoading(true);
    try {
      const response = await axios.get(`http://localhost:5000/api/posts/category/${category}?page=${page}&limit=10`);
      const { posts: categoryPosts, pagination: categoryPagination } = response.data.data;

      if (page === 1) {
        setPosts(categoryPosts);
      } else {
        setPosts(prev => [...prev, ...categoryPosts]);
      }
      
      setPagination(categoryPagination);
    } catch (error) {
      console.error('Error fetching posts by category:', error);
    } finally {
      setLoading(false);
    }
  };

  const value = {
    posts,
    loading,
    pagination,
    fetchPosts,
    fetchPost,
    createPost,
    updatePost,
    deletePost,
    likePost,
    searchPosts,
    getFeaturedPosts,
    getPostsByCategory
  };

  return (
    <PostContext.Provider value={value}>
      {children}
    </PostContext.Provider>
  );
};
