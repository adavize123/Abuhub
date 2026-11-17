/**
 * Single Blog Post Page
 * Displays full blog post content
 */

'use client';

import { useParams } from 'next/navigation';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { fetchBlogPostById } from '@/lib/api/client';
import { toast } from 'react-toastify';

export default function BlogPostPage() {
  const params = useParams();
  const [post, setPost] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const getPost = async () => {
      try {
        setIsLoading(true);
        const data = await fetchBlogPostById(params.id);
        setPost(data);
      } catch (error) {
        console.error('Failed to fetch post:', error);
        toast.error('Failed to load blog post');
      } finally {
        setIsLoading(false);
      }
    };

    if (params.id) {
      getPost();
    }
  }, [params.id]);

  if (isLoading) {
    return (
      <div className="min-h-screen pt-32 flex items-center justify-center">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1.2, repeat: Infinity, ease: 'linear' }}
          className="w-12 h-12 border-4 border-brand-500/20 border-t-brand-400 rounded-full"
        />
      </div>
    );
  }

  if (!post) {
    return (
      <div className="min-h-screen pt-32 px-4">
        <div className="max-w-3xl mx-auto text-center py-20">
          <h1 className="text-3xl font-bold mb-4 text-white font-poppins">Post Not Found</h1>
          <p className="text-cream-100/60 mb-8">The post you&apos;re looking for doesn&apos;t exist.</p>
          <Link href="/blog" className="btn-pill-brand">
            Back to Blog
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-28 sm:pt-32">
      {/* Featured Image */}
      {post.imageUrl && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6 }}
          className="relative h-72 md:h-[26rem] overflow-hidden mx-3 sm:mx-6 rounded-[1.75rem] sm:rounded-[2.5rem]"
        >
          <img src={post.imageUrl} alt={post.title} className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-ink-950 via-transparent to-transparent" />
        </motion.div>
      )}

      {/* Content */}
      <article className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }} className="mb-8">
          <span className="badge-studio mb-4">{post.category}</span>

          <h1 className="text-4xl md:text-5xl font-bold font-poppins mt-4 mb-4 text-white">{post.title}</h1>

          <div className="flex flex-wrap items-center gap-6 text-cream-100/40 text-sm">
            <span>By {post.author || 'Abuhub Team'}</span>
            <span>
              {new Date(post.createdAt).toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
              })}
            </span>
            <span>📖 {Math.ceil(post.content.split(' ').length / 200)} min read</span>
            <span>👁️ {post.readCount || 0} views</span>
          </div>
        </motion.div>

        <div className="studio-divider my-8" />

        {/* Content */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="prose prose-invert max-w-none mb-12"
        >
          <div
            className="text-cream-100/80 leading-relaxed text-lg space-y-4"
            dangerouslySetInnerHTML={{
              __html: post.content
                .split('\n')
                .map((paragraph) => `<p>${paragraph}</p>`)
                .join(''),
            }}
          />
        </motion.div>

        {/* Tags */}
        {post.tags && post.tags.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="flex flex-wrap gap-2 mb-12 pt-8 border-t border-white/10"
          >
            {post.tags.map((tag, index) => (
              <span
                key={index}
                className="px-3 py-1 rounded-full bg-white/5 border border-white/10 text-cream-100/70 text-sm hover:border-brand-400/40 hover:text-brand-300 transition-colors cursor-pointer"
              >
                #{tag}
              </span>
            ))}
          </motion.div>
        )}

        {/* Back Button */}
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.6, delay: 0.6 }}>
          <Link href="/blog" className="btn-pill-ghost inline-flex">
            ← Back to Blog
          </Link>
        </motion.div>
      </article>

      {/* Related Posts Section */}
      <div className="py-12 mt-4 px-4 sm:px-6">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-2xl font-bold font-poppins mb-8 text-white">More Articles</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {[1, 2].map((i) => (
              <Link key={i} href="/blog" className="group">
                <div className="card-studio card-studio-hover p-6">
                  <h3 className="font-semibold text-cream-100/80 group-hover:text-brand-300 transition-colors">
                    Read more from our blog →
                  </h3>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
