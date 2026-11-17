/**
 * Blog Post Controller
 * Handles all blog post CRUD operations
 */

import prisma from '../config/prismaClient.js';
import { uploadImage, deleteImage } from '../config/cloudinary.js';
import fs from 'fs';

/**
 * Get all blog posts
 * Query parameters:
 * - status: filter by 'published' or 'draft'
 * - category: filter by category
 * - sort: 'asc' or 'desc' (default: 'desc' by createdAt)
 */
export const getAllPosts = async (req, res) => {
  try {
    const { status, category, sort = 'desc', page = 1, limit = 10 } = req.query;

    // Build filter object
    let where = {};
    if (status) where.status = status;
    if (category) where.category = category;

    // Default: only published posts
    if (!status) where.status = 'published';

    // Calculate pagination
    const skip = (page - 1) * limit;

    // Fetch posts with pagination
    const posts = await prisma.blogPost.findMany({
      where,
      orderBy: { createdAt: sort === 'asc' ? 'asc' : 'desc' },
      skip: parseInt(skip),
      take: parseInt(limit),
    });

    // Parse tags JSON string into arrays
    const parsedPosts = posts.map((p) => ({ ...p, tags: p.tags ? JSON.parse(p.tags) : [] }));

    // Get total count for pagination
    const total = await prisma.blogPost.count({ where });

    res.status(200).json({
      success: true,
      message: 'Posts fetched successfully',
      data: parsedPosts,
      pagination: {
        total,
        pages: Math.ceil(total / limit),
        currentPage: parseInt(page),
        limit: parseInt(limit),
      },
    });
  } catch (error) {
    console.error('Error fetching posts:', error.message);
    res.status(500).json({
      success: false,
      message: 'Error fetching posts',
      error: error.message,
    });
  }
};

/**
 * Get single blog post by ID or slug
 */
export const getPostById = async (req, res) => {
  try {
    const { id } = req.params;
    
    // Try to find by ID first, then by slug

    let post = await prisma.blogPost.findFirst({ where: { OR: [{ id }, { slug: id }] } });

    if (!post) {
      return res.status(404).json({
        success: false,
        message: 'Post not found',
      });
    }

    // Increment read count
    await prisma.blogPost.update({ where: { id: post.id }, data: { readCount: { increment: 1 } } });

    // Refresh post object after increment
    post = await prisma.blogPost.findUnique({ where: { id: post.id } });
    post.tags = post.tags ? JSON.parse(post.tags) : [];

    res.status(200).json({
      success: true,
      message: 'Post fetched successfully',
      data: post,
    });
  } catch (error) {
    console.error('Error fetching post:', error.message);
    res.status(500).json({
      success: false,
      message: 'Error fetching post',
      error: error.message,
    });
  }
};

/**
 * Create new blog post
 * Expects multipart/form-data with:
 * - title (required)
 * - content (required)
 * - category (optional)
 * - tags (optional, comma-separated)
 * - image (optional file)
 */
export const createPost = async (req, res) => {
  try {
    const { title, content, category, tags, author, excerpt } = req.body;

    // Validate required fields
    if (!title || !content) {
      return res.status(400).json({
        success: false,
        message: 'Title and content are required',
      });
    }

    let imageUrl = null;
    let imagePublicId = null;

    // Handle image upload if provided
    if (req.file) {
      try {
        const uploadResult = await uploadImage(req.file.path, 'abuhub/blog');
        imageUrl = uploadResult.secure_url;
        imagePublicId = uploadResult.public_id;
        
        // Delete temporary file
        fs.unlinkSync(req.file.path);
      } catch (uploadError) {
        console.error('Image upload error:', uploadError.message);
        // Continue without image if upload fails
      }
    }

    // Parse tags if provided
    const tagsArray = tags ? tags.split(',').map((tag) => tag.trim()) : [];

    // Generate slug from title
    const slug = title
      .toLowerCase()
      .replace(/\s+/g, '-')
      .replace(/[^\w\-]/g, '')
      .replace(/\-+/g, '-');

    // Create new post
    const newPost = await prisma.blogPost.create({
      data: {
        title,
        slug,
        content,
        category: category || 'Others',
        tags: tagsArray.length ? JSON.stringify(tagsArray) : undefined,
        imageUrl,
        imagePublicId,
        author: author || 'Abuhub Team',
        excerpt,
        status: 'published',
      },
    });

    newPost.tags = newPost.tags ? JSON.parse(newPost.tags) : [];

    res.status(201).json({
      success: true,
      message: 'Post created successfully',
      data: newPost,
    });
  } catch (error) {
    console.error('Error creating post:', error.message);
    
    // Clean up uploaded file if error occurs
    if (req.file && fs.existsSync(req.file.path)) {
      fs.unlinkSync(req.file.path);
    }

    res.status(500).json({
      success: false,
      message: 'Error creating post',
      error: error.message,
    });
  }
};

/**
 * Update blog post
 */
export const updatePost = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, content, category, tags, author, excerpt } = req.body;

    // Find post
    let post = await prisma.blogPost.findFirst({ where: { OR: [{ id }, { slug: id }] } });

    if (!post) {
      return res.status(404).json({
        success: false,
        message: 'Post not found',
      });
    }

    // Update fields
    if (title) post.title = title;
    if (content) post.content = content;
    if (category) post.category = category;
    if (author) post.author = author;
    if (excerpt) post.excerpt = excerpt;
    if (tags) {
      post.tags = tags.split(',').map((tag) => tag.trim());
    }

    // Handle image update if new image provided
    if (req.file) {
      try {
        // Delete old image if exists
        if (post.imagePublicId) {
          await deleteImage(post.imagePublicId);
        }

        // Upload new image
        const uploadResult = await uploadImage(req.file.path, 'abuhub/blog');
        imageUrl = uploadResult.secure_url;
        imagePublicId = uploadResult.public_id;

        // Delete temporary file
        fs.unlinkSync(req.file.path);
      } catch (uploadError) {
        console.error('Image upload error:', uploadError.message);
      }
    }

    const updateData = {};
    if (title) updateData.title = title;
    if (content) updateData.content = content;
    if (category) updateData.category = category;
    if (author) updateData.author = author;
    if (excerpt) updateData.excerpt = excerpt;
    if (tags) updateData.tags = JSON.stringify(tags.split(',').map((t) => t.trim()));
    if (imageUrl !== undefined) updateData.imageUrl = imageUrl;
    if (imagePublicId !== undefined) updateData.imagePublicId = imagePublicId;

    const updated = await prisma.blogPost.update({ where: { id: post.id }, data: updateData });
    updated.tags = updated.tags ? JSON.parse(updated.tags) : [];

    res.status(200).json({
      success: true,
      message: 'Post updated successfully',
      data: post,
    });
  } catch (error) {
    console.error('Error updating post:', error.message);

    if (req.file && fs.existsSync(req.file.path)) {
      fs.unlinkSync(req.file.path);
    }

    res.status(500).json({
      success: false,
      message: 'Error updating post',
      error: error.message,
    });
  }
};

/**
 * Delete blog post
 */
export const deletePost = async (req, res) => {
  try {
    const { id } = req.params;

    const post = await prisma.blogPost.findFirst({ where: { OR: [{ id }, { slug: id }] } });

    if (!post) {
      return res.status(404).json({
        success: false,
        message: 'Post not found',
      });
    }

    // Delete image from Cloudinary if exists
    if (post.imagePublicId) {
      try {
        await deleteImage(post.imagePublicId);
      } catch (deleteError) {
        console.error('Image deletion error:', deleteError.message);
      }
    }

    // Delete post from database
    await prisma.blogPost.delete({ where: { id: post.id } });

    res.status(200).json({
      success: true,
      message: 'Post deleted successfully',
    });
  } catch (error) {
    console.error('Error deleting post:', error.message);
    res.status(500).json({
      success: false,
      message: 'Error deleting post',
      error: error.message,
    });
  }
};

/**
 * Get blog statistics
 */
export const getBlogStats = async (req, res) => {
  try {
    const totalPosts = await prisma.blogPost.count({ where: { status: 'published' } });
    const totalViewsAgg = await prisma.blogPost.aggregate({ _sum: { readCount: true }, where: { status: 'published' } });
    const totalViews = totalViewsAgg._sum.readCount || 0;

    const categoriesGroup = await prisma.blogPost.groupBy({ by: ['category'], where: { status: 'published' }, _count: { category: true } });
    const categories = categoriesGroup.map((c) => ({ category: c.category, count: c._count.category }));

    res.status(200).json({
      success: true,
      data: {
        totalPosts,
        totalViews,
        categories,
      },
    });
  } catch (error) {
    console.error('Error fetching stats:', error.message);
    res.status(500).json({
      success: false,
      message: 'Error fetching statistics',
      error: error.message,
    });
  }
};

export default {
  getAllPosts,
  getPostById,
  createPost,
  updatePost,
  deletePost,
  getBlogStats,
};
