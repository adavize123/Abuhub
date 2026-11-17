/**
 * Blog Post Model
 * Defines the schema for blog posts stored in MongoDB
 */

import mongoose from 'mongoose';
import { v4 as uuidv4 } from 'uuid';

const blogPostSchema = new mongoose.Schema(
  {
    // Unique identifier for the post
    id: {
      type: String,
      default: uuidv4,
      unique: true,
      primaryKey: true,
    },
    
    // Post title (required)
    title: {
      type: String,
      required: [true, 'Please provide a title'],
      trim: true,
      maxlength: [200, 'Title cannot exceed 200 characters'],
    },
    
    // Post slug for URL-friendly identifier
    slug: {
      type: String,
      unique: true,
      lowercase: true,
      trim: true,
    },
    
    // Main content of the blog post
    content: {
      type: String,
      required: [true, 'Please provide content'],
    },
    
    // Featured image URL from Cloudinary
    imageUrl: {
      type: String,
      default: null,
    },
    
    // Cloudinary public ID for image management
    imagePublicId: {
      type: String,
      default: null,
    },
    
    // Category/tags for blog organization
    category: {
      type: String,
      enum: [
        'Web Development',
        'App Development',
        'Data Analysis',
        'AI Training',
        'Business Support',
        'UI/UX Design',
        'Digital Marketing',
        'Others',
      ],
      default: 'Others',
    },
    
    // Post status
    status: {
      type: String,
      enum: ['draft', 'published'],
      default: 'draft',
    },
    
    // Author name
    author: {
      type: String,
      default: 'Abuhub Team',
    },
    
    // Short excerpt/summary of the post
    excerpt: {
      type: String,
      maxlength: [500, 'Excerpt cannot exceed 500 characters'],
    },
    
    // Tags for better searchability
    tags: {
      type: [String],
      default: [],
    },
    
    // Read count
    readCount: {
      type: Number,
      default: 0,
    },
  },
  {
    // Automatically add createdAt and updatedAt timestamps
    timestamps: true,
  }
);

/**
 * Middleware: Auto-generate slug from title before saving
 */
blogPostSchema.pre('save', function (next) {
  if (this.isModified('title')) {
    // Convert title to slug format (lowercase, replace spaces with hyphens)
    this.slug = this.title
      .toLowerCase()
      .replace(/\s+/g, '-')
      .replace(/[^\w\-]/g, '')
      .replace(/\-+/g, '-');
  }
  next();
});

/**
 * Index for faster queries
 */
blogPostSchema.index({ slug: 1 });
blogPostSchema.index({ status: 1 });
blogPostSchema.index({ category: 1 });
blogPostSchema.index({ createdAt: -1 });

const BlogPost = mongoose.model('BlogPost', blogPostSchema);

export default BlogPost;
