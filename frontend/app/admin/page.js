/**
 * Admin Dashboard Page
 * Main admin panel with overview and management tools
 */

'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import ProtectedRoute from '@/components/ProtectedRoute';
import AdminTabs from '@/components/AdminTabs';
import TiltCard from '@/components/TiltCard';
import { useAuth } from '@/context/AuthContext';
import { useScrollAnimation } from '@/lib/hooks/useScrollAnimation';

function AdminDashboardContent() {
  const [ref, isVisible] = useScrollAnimation({ threshold: 0.3 });

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

  const AdminCard = ({ title, description, icon, href }) => (
    <motion.div variants={itemVariants}>
      <Link href={href}>
        <TiltCard intensity={6}>
          <div className="card-studio card-studio-hover p-8 cursor-pointer">
            <div className="text-5xl mb-4">{icon}</div>
            <h3 className="text-xl font-bold text-white mb-2 font-poppins">{title}</h3>
            <p className="text-cream-100/60 text-sm">{description}</p>
            <div className="mt-6 flex items-center text-brand-400 font-semibold text-sm">
              Manage <span className="ml-2">→</span>
            </div>
          </div>
        </TiltCard>
      </Link>
    </motion.div>
  );

  const StatTile = ({ label, value }) => (
    <motion.div variants={itemVariants}>
      <TiltCard intensity={6}>
        <div className="card-studio p-5 sm:p-6">
          <p className="text-cream-100/50 text-xs sm:text-sm font-medium">{label}</p>
          <p className="text-3xl font-bold font-poppins mt-2 bg-gradient-to-r from-brand-300 to-cream-50 bg-clip-text text-transparent">
            {value}
          </p>
        </div>
      </TiltCard>
    </motion.div>
  );

  return (
    <div ref={ref} className="min-h-screen pt-24 pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <AdminTabs />

        {/* Header */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="mb-12"
        >
          <motion.div variants={itemVariants}>
            <span className="eyebrow-studio">Admin</span>
            <h1 className="text-4xl font-bold font-poppins mb-2 mt-3 text-white">
              Admin Dashboard
            </h1>
            <p className="text-cream-100/60">Manage content, users, and platform settings</p>
          </motion.div>
        </motion.div>

        {/* Management Cards */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12"
        >
          <AdminCard
            title="Blog Posts"
            description="Create, edit, and manage blog posts"
            icon="📝"
            href="/admin/blog"
          />
          <AdminCard
            title="Users"
            description="Manage user accounts and roles"
            icon="👥"
            href="/admin/users"
          />
          <AdminCard
            title="Services"
            description="Manage service offerings"
            icon="⚙️"
            href="/admin/services"
          />
          <AdminCard
            title="Messages"
            description="View and respond to contact messages"
            icon="💬"
            href="/admin/messages"
          />
          <AdminCard
            title="Settings"
            description="Configure platform settings"
            icon="🛠️"
            href="/admin/settings"
          />
          <AdminCard
            title="Analytics"
            description="View platform analytics and statistics"
            icon="📊"
            href="/admin/analytics"
          />
        </motion.div>

        {/* Quick Stats */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          <motion.h2 variants={itemVariants} className="text-2xl font-bold text-white mb-6 font-poppins">
            Platform Overview
          </motion.h2>
          <motion.div
            variants={containerVariants}
            className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6"
          >
            <StatTile label="Total Blog Posts" value="--" />
            <StatTile label="Total Users" value="--" />
            <StatTile label="Pending Messages" value="--" />
            <StatTile label="Active Services" value="--" />
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
}

export default function AdminPage() {
  const { isLoading, isAdmin } = useAuth();

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
      <AdminDashboardContent />
    </ProtectedRoute>
  );
}
