/**
 * Dashboard Page
 * User dashboard with overview and quick access
 */

'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import ProtectedRoute from '@/components/ProtectedRoute';
import TiltCard from '@/components/TiltCard';
import { useScrollAnimation } from '@/lib/hooks/useScrollAnimation';

export default function DashboardPage() {
  const [ref, isVisible] = useScrollAnimation({ threshold: 0.3 });
  const { user } = useAuth();
  const [stats, setStats] = useState({
    blogPosts: 0,
    messages: 0,
    services: 0,
  });

  useEffect(() => {
    // TODO: Fetch user's blog posts and message count from API
    // For now, just set mock data
    setStats({
      blogPosts: 5,
      messages: 12,
      services: 8,
    });
  }, []);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6 },
    },
  };

  const StatCard = ({ title, value, icon }) => (
    <motion.div variants={itemVariants}>
      <TiltCard intensity={6} className="h-full">
        <div className="card-studio card-studio-hover p-6 h-full">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-cream-100/60 text-sm font-medium">{title}</p>
              <p className="text-3xl font-bold font-poppins mt-2 bg-gradient-to-r from-brand-300 to-cream-50 bg-clip-text text-transparent">
                {value}
              </p>
            </div>
            <div className="w-14 h-14 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-2xl flex-shrink-0">
              {icon}
            </div>
          </div>
        </div>
      </TiltCard>
    </motion.div>
  );

  return (
    <ProtectedRoute>
      <div ref={ref} className="min-h-screen pt-28 pb-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Header */}
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="mb-12"
          >
            <motion.div variants={itemVariants}>
              <span className="eyebrow-studio">Dashboard</span>
              <h1 className="text-4xl font-bold font-poppins mt-3 mb-2 text-white">
                Welcome back, <span className="text-brand-400">{user?.name?.split(' ')[0]}</span>!
              </h1>
              <p className="text-cream-100/60">Here&apos;s what&apos;s happening with your account</p>
            </motion.div>
          </motion.div>

          {/* Stats Grid */}
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12"
          >
            <StatCard title="Blog Posts" value={stats.blogPosts} icon="📝" />
            <StatCard title="Messages" value={stats.messages} icon="💬" />
            <StatCard title="Services" value={stats.services} icon="⚙️" />
          </motion.div>

          {/* Quick Actions */}
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12"
          >
            <motion.div variants={itemVariants}>
              <TiltCard intensity={4} className="h-full">
                <div className="card-studio p-8 h-full flex flex-col">
                  <h2 className="text-xl font-bold text-white mb-3 font-poppins">Create New Post</h2>
                  <p className="text-cream-100/60 mb-6 flex-1">Share your latest thoughts with the community</p>
                  <Link href="/admin/blog/new" className="btn-pill-brand self-start">
                    New Blog Post
                  </Link>
                </div>
              </TiltCard>
            </motion.div>

            <motion.div variants={itemVariants}>
              <TiltCard intensity={4} className="h-full">
                <div className="card-studio p-8 h-full flex flex-col">
                  <h2 className="text-xl font-bold text-white mb-3 font-poppins">View Messages</h2>
                  <p className="text-cream-100/60 mb-6 flex-1">See what your audience is saying</p>
                  <Link href="/messages" className="btn-pill-brand self-start">
                    View Messages
                  </Link>
                </div>
              </TiltCard>
            </motion.div>
          </motion.div>

          {/* Admin Section */}
          {String(user?.role || '').toLowerCase() === 'admin' && (
            <motion.div
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              className="card-studio p-8 border-brand-400/30"
            >
              <motion.div variants={itemVariants}>
                <h2 className="text-xl font-bold text-white mb-3 font-poppins flex items-center">
                  <span className="text-2xl mr-3">👑</span>
                  Admin Controls
                </h2>
                <p className="text-cream-100/60 mb-6">You have administrative access to manage the platform</p>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Link href="/admin" className="btn-pill-brand text-center">
                    Go to Admin Panel
                  </Link>
                  <Link href="/admin/users" className="btn-pill-ghost text-center">
                    Manage Users
                  </Link>
                </div>
              </motion.div>
            </motion.div>
          )}
        </div>
      </div>
    </ProtectedRoute>
  );
}
