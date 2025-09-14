const express = require('express');
const Post = require('../models/Post');
const { auth, adminAuth } = require('../middleware/auth');

const router = express.Router();

// Get all posts with pagination and filtering
router.get('/', async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const category = req.query.category;
    const search = req.query.search;
    const tags = req.query.tags ? req.query.tags.split(',') : [];

    const filters = { category, search, tags };
    const result = await Post.getPosts(page, limit, filters);

    res.json({
      success: true,
      data: result
    });
  } catch (error) {
    console.error('Get posts error:', error);
    res.status(500).json({ message: 'Server error while fetching posts' });
  }
});

// Get single post by ID
router.get('/:id', async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    
    if (!post) {
      return res.status(404).json({ message: 'Post not found' });
    }

    // Increment view count
    post.views += 1;
    await post.save();

    res.json({
      success: true,
      data: post
    });
  } catch (error) {
    console.error('Get post error:', error);
    res.status(500).json({ message: 'Server error while fetching post' });
  }
});

// Create new post
router.post('/', auth, async (req, res) => {
  try {
    const { title, content, category, tags, featured, imageUrl } = req.body;

    const post = new Post({
      title,
      content,
      category: category || 'general',
      tags: tags || [],
      featured: featured || false,
      imageUrl: imageUrl || '',
      author: req.user.name
    });

    await post.save();

    res.status(201).json({
      success: true,
      message: 'Post created successfully',
      data: post
    });
  } catch (error) {
    console.error('Create post error:', error);
    res.status(500).json({ message: 'Server error while creating post' });
  }
});

// Update post
router.put('/:id', auth, async (req, res) => {
  try {
    const { title, content, category, tags, featured, imageUrl, published } = req.body;

    const post = await Post.findById(req.params.id);
    if (!post) {
      return res.status(404).json({ message: 'Post not found' });
    }

    // Check if user is author or admin
    if (post.author !== req.user.name && req.user.role !== 'admin' && req.user.role !== 'moderator') {
      return res.status(403).json({ message: 'Not authorized to update this post' });
    }

    // Update fields
    if (title) post.title = title;
    if (content) post.content = content;
    if (category) post.category = category;
    if (tags) post.tags = tags;
    if (featured !== undefined) post.featured = featured;
    if (imageUrl !== undefined) post.imageUrl = imageUrl;
    if (published !== undefined) post.published = published;

    await post.save();

    res.json({
      success: true,
      message: 'Post updated successfully',
      data: post
    });
  } catch (error) {
    console.error('Update post error:', error);
    res.status(500).json({ message: 'Server error while updating post' });
  }
});

// Delete post
router.delete('/:id', auth, async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) {
      return res.status(404).json({ message: 'Post not found' });
    }

    // Check if user is author or admin
    if (post.author !== req.user.name && req.user.role !== 'admin' && req.user.role !== 'moderator') {
      return res.status(403).json({ message: 'Not authorized to delete this post' });
    }

    await Post.findByIdAndDelete(req.params.id);

    res.json({
      success: true,
      message: 'Post deleted successfully'
    });
  } catch (error) {
    console.error('Delete post error:', error);
    res.status(500).json({ message: 'Server error while deleting post' });
  }
});

// Like post
router.post('/:id/like', auth, async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) {
      return res.status(404).json({ message: 'Post not found' });
    }

    post.likes += 1;
    await post.save();

    res.json({
      success: true,
      message: 'Post liked successfully',
      likes: post.likes
    });
  } catch (error) {
    console.error('Like post error:', error);
    res.status(500).json({ message: 'Server error while liking post' });
  }
});

// Get featured posts
router.get('/featured/list', async (req, res) => {
  try {
    const posts = await Post.find({ featured: true, published: true })
      .sort({ updatedAt: -1 })
      .limit(5)
      .select('-content');

    res.json({
      success: true,
      data: posts
    });
  } catch (error) {
    console.error('Get featured posts error:', error);
    res.status(500).json({ message: 'Server error while fetching featured posts' });
  }
});

// Get posts by category
router.get('/category/:category', async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const category = req.params.category;

    const filters = { category };
    const result = await Post.getPosts(page, limit, filters);

    res.json({
      success: true,
      data: result
    });
  } catch (error) {
    console.error('Get posts by category error:', error);
    res.status(500).json({ message: 'Server error while fetching posts by category' });
  }
});

// Search posts
router.get('/search/:query', async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const search = req.params.query;

    const filters = { search };
    const result = await Post.getPosts(page, limit, filters);

    res.json({
      success: true,
      data: result
    });
  } catch (error) {
    console.error('Search posts error:', error);
    res.status(500).json({ message: 'Server error while searching posts' });
  }
});

module.exports = router;
