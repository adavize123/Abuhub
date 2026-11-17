/**
 * Blog Listing Page
 * Displays all published blog posts with filtering and animations
 */

'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { fetchBlogPosts } from '@/lib/api/client';
import { useScrollAnimation } from '@/lib/hooks/useScrollAnimation';
import TiltCard from '@/components/TiltCard';

function BlogPostSkeletonDark() {
  return (
    <div className="card-studio overflow-hidden animate-pulse">
      <div className="h-48 bg-white/5" />
      <div className="p-6">
        <div className="h-5 w-24 bg-white/5 rounded-full mb-4" />
        <div className="h-5 bg-white/5 rounded mb-2" />
        <div className="h-5 bg-white/5 rounded w-3/4 mb-4" />
        <div className="space-y-2 mb-4">
          <div className="h-3 bg-white/5 rounded" />
          <div className="h-3 bg-white/5 rounded w-5/6" />
        </div>
      </div>
    </div>
  );
}

export default function BlogPage() {
  const [posts, setPosts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [sortOrder, setSortOrder] = useState('desc');
  const [ref, isVisible] = useScrollAnimation({ threshold: 0.2 });

  useEffect(() => {
    const getPosts = async () => {
      try {
        setIsLoading(true);
        const params = {
          status: 'published',
          sort: sortOrder,
          limit: 20,
        };
        if (selectedCategory !== 'all') {
          params.category = selectedCategory;
        }
        const data = await fetchBlogPosts(params);
        setPosts(data);
      } catch (error) {
        console.error('Failed to fetch posts:', error);
        setPosts([]);
      } finally {
        setIsLoading(false);
      }
    };

    getPosts();
  }, [selectedCategory, sortOrder]);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.1 } },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5, type: 'spring', stiffness: 100 } },
  };

  return (
    <div className="min-h-screen">
      {/* Header */}
      <section className="relative px-3 sm:px-6 pt-20 sm:pt-24">
        <div className="hero-card max-w-7xl mx-auto py-16 sm:py-20 px-6 sm:px-10">
          <div className="grain-overlay" aria-hidden="true" />
          <div className="relative max-w-2xl">
            <motion.span
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="badge-studio mb-4 inline-flex"
            >
              Insights
            </motion.span>
            <motion.h1
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="text-5xl md:text-6xl font-bold font-poppins mb-4 mt-4 text-white"
            >
              Blog &amp; Insights
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.6 }}
              className="text-white/70 text-lg"
            >
              Practical articles on web, AI, data and building better digital products.
            </motion.p>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <div ref={ref} className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {/* Filters */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="flex flex-col md:flex-row gap-4 justify-between items-start md:items-center mb-12"
        >
          <div className="flex gap-2 flex-wrap">
            {['all', 'Web Development', 'App Development', 'Data Analysis', 'AI Training'].map((cat) => (
              <motion.button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className={`px-4 py-2 rounded-full transition-all duration-300 text-sm font-semibold border ${
                  selectedCategory === cat
                    ? 'bg-brand-gradient border-transparent text-white'
                    : 'bg-white/5 border-white/10 text-cream-100/60 hover:text-white hover:border-white/25'
                }`}
              >
                {cat === 'all' ? 'All Posts' : cat}
              </motion.button>
            ))}
          </div>

          <select
            value={sortOrder}
            onChange={(e) => setSortOrder(e.target.value)}
            className="input-studio !w-auto text-sm !py-2.5"
          >
            <option value="desc" className="bg-ink-900">Newest First</option>
            <option value="asc" className="bg-ink-900">Oldest First</option>
          </select>
        </motion.div>

        {/* Posts Grid */}
        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[...Array(6)].map((_, i) => (
              <BlogPostSkeletonDark key={i} />
            ))}
          </div>
        ) : posts.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-cream-100/40 text-lg">No posts found in this category yet — check back soon.</p>
          </div>
        ) : (
          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView={isVisible ? 'visible' : 'hidden'}
            viewport={{ once: true, amount: 0.2 }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
          >
            {posts.map((post) => (
              <motion.div key={post.id} variants={itemVariants}>
                <Link href={`/blog/${post.slug || post.id}`}>
                  <TiltCard intensity={5}>
                    <div className="group card-studio card-studio-hover overflow-hidden h-full flex flex-col">
                      {post.imageUrl ? (
                        <div className="relative h-48 overflow-hidden bg-white/5">
                          <motion.img
                            src={post.imageUrl}
                            alt={post.title}
                            className="w-full h-full object-cover"
                            whileHover={{ scale: 1.08 }}
                            transition={{ duration: 0.4 }}
                          />
                        </div>
                      ) : (
                        <div className="h-48 bg-gradient-to-br from-brand-900/60 to-ink-800 flex items-center justify-center text-4xl">
                          📝
                        </div>
                      )}

                      <div className="p-6 flex flex-col justify-between flex-1">
                        <div>
                          <span className="badge-studio mb-3 !py-1 !text-xs">{post.category}</span>

                          <h3 className="text-xl font-bold font-poppins mt-3 mb-2 text-white group-hover:text-brand-300 transition-colors duration-300 line-clamp-2">
                            {post.title}
                          </h3>

                          <p className="text-cream-100/55 text-sm mb-4 line-clamp-2">
                            {post.excerpt || post.content.substring(0, 100)}
                          </p>
                        </div>

                        <div>
                          <div className="flex justify-between items-center pt-4 border-t border-white/10 text-xs text-cream-100/40">
                            <span>{post.author || 'Abuhub'}</span>
                            <span>
                              {new Date(post.createdAt).toLocaleDateString('en-US', {
                                year: 'numeric',
                                month: 'short',
                                day: 'numeric',
                              })}
                            </span>
                          </div>

                          <div className="mt-4 text-brand-400 font-semibold flex items-center gap-2 text-sm">
                            Read More <span aria-hidden="true">→</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </TiltCard>
                </Link>
              </motion.div>
            ))}
          </motion.div>
        )}
      </div>
    </div>
  );
}
