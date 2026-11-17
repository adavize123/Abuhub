/**
 * Admin Analytics Page
 * View platform analytics and statistics
 */

'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import ProtectedRoute from '@/components/ProtectedRoute';
import AdminTabs from '@/components/AdminTabs';
import TiltCard from '@/components/TiltCard';
import { useAuth } from '@/context/AuthContext';
import { useScrollAnimation } from '@/lib/hooks/useScrollAnimation';

function AdminAnalyticsContent() {
  const [ref, isVisible] = useScrollAnimation({ threshold: 0.3 });
  const [analytics, setAnalytics] = useState({
    totalUsers: 156,
    totalBlogPosts: 42,
    totalMessages: 89,
    totalServices: 6,
    activeUsers: 48,
    messagesSent: 234,
    avgPostLength: 1200,
    topCategories: [
      { name: 'Web Development', count: 18 },
      { name: 'App Development', count: 12 },
      { name: 'AI Training', count: 7 },
      { name: 'Others', count: 5 },
    ],
  });

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.08, delayChildren: 0.1 },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
  };

  const StatCard = ({ title, value, icon, trend }) => (
    <motion.div variants={itemVariants}>
      <TiltCard intensity={6}>
        <div className="card-studio p-6">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-cream-100/50 text-sm font-medium">{title}</p>
              <p className="text-4xl font-bold font-poppins mt-3 bg-gradient-to-r from-brand-300 to-cream-50 bg-clip-text text-transparent">
                {value}
              </p>
              {trend && (
                <p className="text-brand-400 text-xs mt-2">
                  ↑ {trend}% from last month
                </p>
              )}
            </div>
            <div className="text-4xl opacity-30">{icon}</div>
          </div>
        </div>
      </TiltCard>
    </motion.div>
  );

  return (
    <div ref={ref} className="min-h-screen pt-24 pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <AdminTabs />

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-12"
        >
          <span className="eyebrow-studio">Insights</span>
          <h1 className="text-4xl font-bold font-poppins mt-3 mb-2 text-white">
            Analytics
          </h1>
          <p className="text-cream-100/60">
            Platform statistics and performance metrics
          </p>
        </motion.div>

        {/* Main Stats */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12"
        >
          <StatCard
            title="Total Users"
            value={analytics.totalUsers}
            icon="👥"
            trend={12}
          />
          <StatCard
            title="Blog Posts"
            value={analytics.totalBlogPosts}
            icon="📝"
            trend={8}
          />
          <StatCard
            title="Messages"
            value={analytics.totalMessages}
            icon="💬"
            trend={5}
          />
          <StatCard
            title="Services"
            value={analytics.totalServices}
            icon="⚙️"
          />
        </motion.div>

        {/* Secondary Stats */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12"
        >
          <StatCard
            title="Active Users"
            value={analytics.activeUsers}
            icon="🟢"
            trend={3}
          />
          <StatCard
            title="Messages This Month"
            value={analytics.messagesSent}
            icon="📧"
            trend={15}
          />
          <StatCard
            title="Avg Post Length"
            value={`${Math.round(analytics.avgPostLength / 100)}00`}
            icon="📊"
          />
        </motion.div>

        {/* Top Categories */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="card-studio p-8"
        >
          <motion.h2
            variants={itemVariants}
            className="text-2xl font-bold text-white mb-6 font-poppins"
          >
            Blog Posts by Category
          </motion.h2>

          <motion.div variants={containerVariants} className="space-y-4">
            {analytics.topCategories.map((category, index) => {
              const percentage = (category.count / analytics.totalBlogPosts) * 100;
              return (
                <motion.div key={index} variants={itemVariants}>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-white font-semibold">{category.name}</span>
                    <span className="text-cream-100/50 text-sm">
                      {category.count} posts ({percentage.toFixed(1)}%)
                    </span>
                  </div>
                  <div className="w-full bg-white/5 rounded-full h-2 overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${percentage}%` }}
                      transition={{ duration: 0.8, ease: 'easeOut' }}
                      className="h-full bg-brand-gradient"
                    />
                  </div>
                </motion.div>
              );
            })}
          </motion.div>
        </motion.div>

        {/* Info Cards */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-12"
        >
          <motion.div
            variants={itemVariants}
            className="card-studio p-8"
          >
            <h3 className="text-lg font-bold text-white mb-4 font-poppins">
              📈 Growth Trends
            </h3>
            <ul className="space-y-3">
              <li className="flex items-center justify-between">
                <span className="text-cream-100/70">New Users This Month</span>
                <span className="text-brand-400 font-semibold">+24</span>
              </li>
              <li className="flex items-center justify-between">
                <span className="text-cream-100/70">New Blog Posts</span>
                <span className="text-brand-400 font-semibold">+8</span>
              </li>
              <li className="flex items-center justify-between">
                <span className="text-cream-100/70">Contact Messages</span>
                <span className="text-brand-400 font-semibold">+23</span>
              </li>
            </ul>
          </motion.div>

          <motion.div
            variants={itemVariants}
            className="card-studio p-8"
          >
            <h3 className="text-lg font-bold text-white mb-4 font-poppins">
              📊 Quick Insights
            </h3>
            <ul className="space-y-3">
              <li className="flex items-center justify-between">
                <span className="text-cream-100/70">Engagement Rate</span>
                <span className="text-brand-400 font-semibold">73%</span>
              </li>
              <li className="flex items-center justify-between">
                <span className="text-cream-100/70">Avg Session Duration</span>
                <span className="text-brand-400 font-semibold">4m 32s</span>
              </li>
              <li className="flex items-center justify-between">
                <span className="text-cream-100/70">Bounce Rate</span>
                <span className="text-brand-400 font-semibold">27%</span>
              </li>
            </ul>
          </motion.div>
        </motion.div>

        {/* Note */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="mt-12 p-6 bg-brand-500/10 border border-brand-400/30 rounded-2xl text-center"
        >
          <p className="text-brand-300 text-sm">
            💡 <strong>Note:</strong> Analytics are currently showing mock data.
            Connect to your backend API to see real-time statistics.
          </p>
        </motion.div>
      </div>
    </div>
  );
}

export default function AdminAnalyticsPage() {
  const { isLoading, isAdmin } = useAuth();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <motion.div
          animate={{ opacity: [0.5, 1, 0.5] }}
          transition={{ duration: 1.5, repeat: Infinity }}
        >
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
            <p className="text-cream-100/60 mb-8">
              You don't have permission to access this page.
            </p>
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
      <AdminAnalyticsContent />
    </ProtectedRoute>
  );
}
