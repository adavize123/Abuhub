/**
 * Blog Admin Management Page
 * Create, read, update, and delete blog posts
 */

'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useForm, Controller } from 'react-hook-form';
import { toast } from 'react-toastify';
import Link from 'next/link';
import {
  fetchBlogPosts,
  createBlogPost,
  updateBlogPost,
  deleteBlogPost,
} from '@/lib/api/client';
import ProtectedRoute from '@/components/ProtectedRoute';
import AdminTabs from '@/components/AdminTabs';
import { useAuth } from '@/context/AuthContext';

const containerVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.08, delayChildren: 0.1 } },
};

const itemVariants = {
  hidden: { opacity: 0, y: 16 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.4 } },
};

function statusBadgeClasses(status) {
  switch (status) {
    case 'published':
      return 'bg-brand-500/15 text-brand-300 border border-brand-400/30';
    case 'draft':
      return 'bg-amber-500/15 text-amber-300 border border-amber-400/30';
    default:
      return 'bg-white/10 text-cream-100/60 border border-white/15';
  }
}

function AdminBlogPageContent() {
  const { user } = useAuth();
  const [posts, setPosts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [editingId, setEditingId] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [imagePreview, setImagePreview] = useState(null);

  const { register, handleSubmit, reset, control, watch, setValue } = useForm({
    defaultValues: {
      title: '',
      content: '',
      category: 'Others',
      tags: '',
      excerpt: '',
      author: user?.name || 'ABUHUB Team',
    },
  });

  const imageFile = watch('image');

  // Load posts
  useEffect(() => {
    const getPosts = async () => {
      try {
        setIsLoading(true);
        const data = await fetchBlogPosts({ status: 'all', limit: 100 });
        setPosts(data);
      } catch (error) {
        console.error('Failed to fetch posts:', error);
        toast.error('Failed to load posts');
      } finally {
        setIsLoading(false);
      }
    };

    getPosts();
  }, []);

  // Handle form submission
  const onSubmit = async (data) => {
    try {
      const formData = new FormData();
      formData.append('title', data.title);
      formData.append('content', data.content);
      formData.append('category', data.category);
      formData.append('tags', data.tags);
      formData.append('excerpt', data.excerpt);
      formData.append('author', data.author);

      if (data.image && data.image[0]) {
        formData.append('image', data.image[0]);
      }

      if (editingId) {
        // Update existing post
        await updateBlogPost(editingId, formData);
        toast.success('Post updated successfully!');
        setEditingId(null);
      } else {
        // Create new post
        await createBlogPost(formData);
        toast.success('Post created successfully!');
      }

      // Reload posts
      const updatedPosts = await fetchBlogPosts({ status: 'all', limit: 100 });
      setPosts(updatedPosts);

      reset();
      setShowForm(false);
      setImagePreview(null);
    } catch (error) {
      console.error('Error saving post:', error);
      toast.error('Failed to save post');
    }
  };

  // Handle edit
  const handleEdit = (post) => {
    setEditingId(post.id);
    setValue('title', post.title);
    setValue('content', post.content);
    setValue('category', post.category);
    setValue('tags', post.tags?.join(', ') || '');
    setValue('excerpt', post.excerpt || '');
    setValue('author', post.author);
    if (post.imageUrl) {
      setImagePreview(post.imageUrl);
    }
    setShowForm(true);
  };

  // Handle delete
  const handleDelete = async (postId) => {
    if (!confirm('Are you sure you want to delete this post?')) return;

    try {
      await deleteBlogPost(postId);
      toast.success('Post deleted successfully!');
      setPosts(posts.filter((p) => p.id !== postId));
    } catch (error) {
      console.error('Error deleting post:', error);
      toast.error('Failed to delete post');
    }
  };

  // Handle cancel
  const handleCancel = () => {
    setShowForm(false);
    setEditingId(null);
    reset();
    setImagePreview(null);
  };

  return (
    <div className="min-h-screen pt-24 pb-12">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <AdminTabs />

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4 mb-8">
            <div>
              <span className="eyebrow-studio">Content</span>
              <h1 className="text-4xl font-bold font-poppins mt-3 text-white">
                Blog Management
              </h1>
              <p className="text-cream-100/60 mt-2">Create, edit, and manage blog posts</p>
            </div>
            {!showForm && (
              <button
                onClick={() => setShowForm(true)}
                className="btn-pill-brand self-start sm:self-auto"
              >
                + New Post
              </button>
            )}
          </div>
        </motion.div>

        {/* Form Section */}
        <AnimatePresence>
          {showForm && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="card-studio p-6 sm:p-8 mb-12 overflow-hidden"
            >
              <h2 className="text-2xl font-bold font-poppins mb-6 text-white">
                {editingId ? 'Edit Post' : 'Create New Post'}
              </h2>

              <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                {/* Title */}
                <div>
                  <label className="label-studio">Title *</label>
                  <input
                    type="text"
                    {...register('title', { required: 'Title is required' })}
                    placeholder="Post title"
                    className="input-studio"
                  />
                </div>

                {/* Author */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="label-studio">Author</label>
                    <input
                      type="text"
                      {...register('author')}
                      value={user?.name || 'ABUHUB Team'}
                      disabled
                      className="input-studio opacity-60 cursor-not-allowed"
                    />
                    <p className="text-cream-100/40 text-xs mt-1">Auto-filled from your profile</p>
                  </div>

                  {/* Category */}
                  <div>
                    <label className="label-studio">Category</label>
                    <select {...register('category')} className="input-studio">
                      <option value="Web Development" className="bg-ink-900">Web Development</option>
                      <option value="App Development" className="bg-ink-900">App Development</option>
                      <option value="Data Analysis" className="bg-ink-900">Data Analysis</option>
                      <option value="AI Training" className="bg-ink-900">AI Training</option>
                      <option value="Business Support" className="bg-ink-900">Business Support</option>
                      <option value="Others" className="bg-ink-900">Others</option>
                    </select>
                  </div>
                </div>

                {/* Excerpt */}
                <div>
                  <label className="label-studio">Excerpt</label>
                  <textarea
                    {...register('excerpt')}
                    placeholder="Short description (optional)"
                    rows={2}
                    className="input-studio resize-none"
                  />
                </div>

                {/* Content */}
                <div>
                  <label className="label-studio">Content *</label>
                  <textarea
                    {...register('content', { required: 'Content is required' })}
                    placeholder="Post content"
                    rows={8}
                    className="input-studio resize-none font-mono text-sm"
                  />
                </div>

                {/* Tags */}
                <div>
                  <label className="label-studio">Tags</label>
                  <input
                    type="text"
                    {...register('tags')}
                    placeholder="Comma-separated tags (e.g. React, JavaScript, Web)"
                    className="input-studio"
                  />
                </div>

                {/* Image */}
                <div>
                  <label className="label-studio">Featured Image</label>
                  <input
                    type="file"
                    {...register('image')}
                    accept="image/*"
                    className="w-full text-sm text-cream-100/70 file:mr-4 file:py-2.5 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-brand-gradient file:text-white hover:file:opacity-90 file:cursor-pointer cursor-pointer"
                    onChange={(e) => {
                      if (e.target.files?.[0]) {
                        const reader = new FileReader();
                        reader.onloadend = () => {
                          setImagePreview(reader.result);
                        };
                        reader.readAsDataURL(e.target.files[0]);
                      }
                    }}
                  />
                  {imagePreview && (
                    <div className="mt-4">
                      <img
                        src={imagePreview}
                        alt="Preview"
                        className="max-w-xs h-40 object-cover rounded-xl border border-white/10"
                      />
                    </div>
                  )}
                </div>

                {/* Buttons */}
                <div className="flex gap-4">
                  <button
                    type="submit"
                    className="btn-pill-brand flex-1"
                  >
                    {editingId ? 'Update Post' : 'Publish Post'}
                  </button>
                  <button
                    type="button"
                    onClick={handleCancel}
                    className="btn-pill-ghost flex-1"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Posts List */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
        >
          <h2 className="text-2xl font-bold font-poppins mb-6 text-white">All Posts</h2>

          {isLoading ? (
            <div className="space-y-4">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="card-studio p-6 animate-pulse h-24" />
              ))}
            </div>
          ) : posts.length === 0 ? (
            <div className="card-studio text-center py-12">
              <p className="text-cream-100/50">No posts yet. Create your first post!</p>
            </div>
          ) : (
            <motion.div
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              className="space-y-4"
            >
              {posts.map((post) => (
                <motion.div
                  key={post.id}
                  variants={itemVariants}
                  layout
                  className="card-studio p-6 flex flex-col sm:flex-row justify-between items-start gap-4 group hover:bg-white/5 transition-all duration-300"
                >
                  <div className="flex-grow min-w-0">
                    <h3 className="text-lg font-semibold mb-2 text-white group-hover:text-brand-300 transition-colors">
                      {post.title}
                    </h3>
                    <div className="flex flex-wrap items-center gap-3 text-sm text-cream-100/60">
                      <span className="px-2.5 py-1 bg-white/5 border border-white/10 rounded-full text-xs">
                        {post.category}
                      </span>
                      <span>
                        {new Date(post.createdAt).toLocaleDateString()}
                      </span>
                      <span>👁️ {post.readCount} views</span>
                      <span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${statusBadgeClasses(post.status)}`}>
                        {post.status}
                      </span>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex gap-2 shrink-0">
                    <button
                      onClick={() => handleEdit(post)}
                      className="px-3 py-1.5 rounded-full bg-brand-500/15 text-brand-300 border border-brand-400/30 hover:bg-brand-500/25 transition-all text-sm font-semibold"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(post.id)}
                      className="px-3 py-1.5 rounded-full bg-red-500/10 text-red-400 border border-red-500/30 hover:bg-red-500/20 transition-all text-sm font-semibold"
                    >
                      Delete
                    </button>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          )}
        </motion.div>
      </div>
    </div>
  );
}

export default function AdminBlogPage() {
  const { user, isLoading, isAdmin } = useAuth();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <motion.div animate={{ opacity: [0.5, 1, 0.5] }} transition={{ duration: 1.5, repeat: Infinity }}>
          <p className="text-white text-lg">Loading...</p>
        </motion.div>
      </div>
    );
  }
  if (!isAdmin()) {
    return (
      <ProtectedRoute>
        <div className="min-h-screen flex items-center justify-center pt-28">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center"
          >
            <h1 className="text-4xl font-bold text-red-400 mb-4">Access Denied</h1>
            <p className="text-cream-100/60 mb-8">You don't have permission to access the admin panel.</p>
            <Link href="/" className="btn-pill-brand inline-flex">
              Go Home
            </Link>
          </motion.div>
        </div>
      </ProtectedRoute>
    );
  }

  return (
    <ProtectedRoute>
      <AdminBlogPageContent />
    </ProtectedRoute>
  );
}
