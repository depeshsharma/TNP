const mongoose = require('mongoose');

const postSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Title is required'],
    trim: true,
    maxlength: [200, 'Title cannot exceed 200 characters']
  },
  content: {
    type: String,
    required: [true, 'Content is required'],
    minlength: [10, 'Content must be at least 10 characters long']
  },
  excerpt: {
    type: String,
    maxlength: [300, 'Excerpt cannot exceed 300 characters']
  },
  author: {
    type: String,
    required: [true, 'Author is required'],
    trim: true
  },
  category: {
    type: String,
    enum: ['job', 'internship', 'training', 'placement', 'announcement', 'general'],
    default: 'general'
  },
  tags: [{
    type: String,
    trim: true
  }],
  featured: {
    type: Boolean,
    default: false
  },
  published: {
    type: Boolean,
    default: true
  },
  views: {
    type: Number,
    default: 0
  },
  likes: {
    type: Number,
    default: 0
  },
  imageUrl: {
    type: String,
    default: ''
  },
  attachments: [{
    name: String,
    url: String,
    size: Number,
    type: String
  }]
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Index for better query performance
postSchema.index({ createdAt: -1 });
postSchema.index({ category: 1, published: 1 });
postSchema.index({ tags: 1 });
postSchema.index({ title: 'text', content: 'text', excerpt: 'text' });

// Virtual for formatted date
postSchema.virtual('formattedDate').get(function() {
  return this.createdAt.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
});

// Virtual for reading time estimation
// postSchema.virtual('readingTime').get(function() {
//   const wordsPerMinute = 200;
//   const wordCount = this.content.split(/\s+/).length;
//   return Math.ceil(wordCount / wordsPerMinute);
// });


postSchema.virtual('readingTime').get(function() {
  const wordsPerMinute = 200;
  const text = this.content || "";
  const wordCount = text.split(/\s+/).filter(Boolean).length;
  return Math.ceil(wordCount / wordsPerMinute) || 1;
});

// PostSchema.virtual("tagsArray").get(function () {
//   return this.tags ? this.tags.split(",") : []; // return empty array if no tags
// });


// Pre-save middleware to generate excerpt
// postSchema.pre('save', function(next) {
//   if (this.isModified('content') && !this.excerpt) {
//     // Strip HTML tags and create excerpt
//     const plainText = this.content.replace(/<[^>]*>/g, '');
//     this.excerpt = plainText.substring(0, 300) + (plainText.length > 300 ? '...' : '');
//   }
//   next();
// });

postSchema.pre('save', function(next) {
  if (this.isModified('content') && !this.excerpt) {
    const plainText = (this.content || "").replace(/<[^>]*>/g, '');
    this.excerpt =
      plainText.substring(0, 300) +
      (plainText.length > 300 ? '...' : '');
  }
  next();
});

// Static method to get posts with pagination
postSchema.statics.getPosts = async function(page = 1, limit = 10, filters = {}) {
  const skip = (page - 1) * limit;
  const query = { published: true };
  
  if (filters.category) {
    query.category = filters.category;
  }
  
  if (filters.search) {
    query.$text = { $search: filters.search };
  }
  
  if (filters.tags && filters.tags.length > 0) {
    query.tags = { $in: filters.tags };
  }
  
  const posts = await this.find(query)
    .sort({ updatedAt: -1 })
    .skip(skip)
    .limit(limit)
    .select('-content'); // Exclude full content for list view
  
  const total = await this.countDocuments(query);
  
  return {
    posts,
    pagination: {
      current: page,
      pages: Math.ceil(total / limit),
      total,
      hasNext: page < Math.ceil(total / limit),
      hasPrev: page > 1
    }
  };
};

module.exports = mongoose.model('Post', postSchema);
