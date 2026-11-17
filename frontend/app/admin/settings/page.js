/**
 * Admin Settings Page
 * Configure platform settings
 */

'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import ProtectedRoute from '@/components/ProtectedRoute';
import AdminTabs from '@/components/AdminTabs';
import { useAuth } from '@/context/AuthContext';
import { useScrollAnimation } from '@/lib/hooks/useScrollAnimation';

function AdminSettingsContent() {
  const [ref, isVisible] = useScrollAnimation({ threshold: 0.3 });
  const [settings, setSettings] = useState({
    siteName: 'ABUHUB',
    siteDescription: 'Building Digital Solutions for Businesses',
    adminEmail: 'admin@abuhub.com',
    emailNotifications: true,
    maintenanceMode: false,
    allowUserRegistration: true,
    requireEmailVerification: false,
  });

  const [isSaving, setIsSaving] = useState(false);

  const handleSettingChange = (key, value) => {
    setSettings({ ...settings, [key]: value });
  };

  const handleSave = async () => {
    try {
      setIsSaving(true);
      // TODO: Call API to save settings
      console.log('Saving settings:', settings);
      await new Promise((resolve) => setTimeout(resolve, 1000));
      setIsSaving(false);
    } catch (error) {
      console.error('Error saving settings:', error);
      setIsSaving(false);
    }
  };

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

  const SettingSection = ({ title, description, children }) => (
    <motion.div
      variants={itemVariants}
      className="card-studio p-6 mb-6"
    >
      <div className="mb-6">
        <h3 className="text-lg font-bold text-white mb-1">{title}</h3>
        <p className="text-cream-100/60 text-sm">{description}</p>
      </div>
      {children}
    </motion.div>
  );

  return (
    <div ref={ref} className="min-h-screen pt-24 pb-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <AdminTabs />

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-12"
        >
          <span className="eyebrow-studio">Platform</span>
          <h1 className="text-4xl font-bold font-poppins mt-3 mb-2 text-white">
            Settings
          </h1>
          <p className="text-cream-100/60">Configure platform settings and preferences</p>
        </motion.div>

        {/* Settings */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {/* General Settings */}
          <SettingSection
            title="🌐 General Settings"
            description="Basic platform configuration"
          >
            <div className="space-y-4">
              <div>
                <label className="label-studio">
                  Site Name
                </label>
                <input
                  type="text"
                  value={settings.siteName}
                  onChange={(e) =>
                    handleSettingChange('siteName', e.target.value)
                  }
                  className="input-studio"
                />
              </div>

              <div>
                <label className="label-studio">
                  Site Description
                </label>
                <textarea
                  value={settings.siteDescription}
                  onChange={(e) =>
                    handleSettingChange('siteDescription', e.target.value)
                  }
                  rows={3}
                  className="input-studio resize-none"
                />
              </div>

              <div>
                <label className="label-studio">
                  Admin Email
                </label>
                <input
                  type="email"
                  value={settings.adminEmail}
                  onChange={(e) =>
                    handleSettingChange('adminEmail', e.target.value)
                  }
                  className="input-studio"
                />
              </div>
            </div>
          </SettingSection>

          {/* Features */}
          <SettingSection
            title="🎛️ Features"
            description="Enable or disable platform features"
          >
            <div className="space-y-4">
              <label className="flex items-center space-x-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={settings.allowUserRegistration}
                  onChange={(e) =>
                    handleSettingChange('allowUserRegistration', e.target.checked)
                  }
                  className="w-4 h-4 rounded border border-white/20 accent-brand-500"
                />
                <span className="text-white">
                  Allow User Registration
                </span>
              </label>

              <label className="flex items-center space-x-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={settings.requireEmailVerification}
                  onChange={(e) =>
                    handleSettingChange(
                      'requireEmailVerification',
                      e.target.checked
                    )
                  }
                  className="w-4 h-4 rounded border border-white/20 accent-brand-500"
                />
                <span className="text-white">
                  Require Email Verification
                </span>
              </label>

              <label className="flex items-center space-x-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={settings.emailNotifications}
                  onChange={(e) =>
                    handleSettingChange('emailNotifications', e.target.checked)
                  }
                  className="w-4 h-4 rounded border border-white/20 accent-brand-500"
                />
                <span className="text-white">
                  Email Notifications
                </span>
              </label>
            </div>
          </SettingSection>

          {/* Maintenance */}
          <SettingSection
            title="🔧 Maintenance"
            description="Platform maintenance settings"
          >
            <div>
              <label className="flex items-center space-x-3 cursor-pointer mb-4">
                <input
                  type="checkbox"
                  checked={settings.maintenanceMode}
                  onChange={(e) =>
                    handleSettingChange('maintenanceMode', e.target.checked)
                  }
                  className="w-4 h-4 rounded border border-white/20 accent-brand-500"
                />
                <span className="text-white">
                  Maintenance Mode (Disables access for non-admins)
                </span>
              </label>

              {settings.maintenanceMode && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="p-4 bg-amber-500/10 border border-amber-500/30 rounded-xl text-amber-300 text-sm"
                >
                  ⚠️ Maintenance mode is enabled. Regular users will see a maintenance
                  page.
                </motion.div>
              )}
            </div>
          </SettingSection>

          {/* Danger Zone */}
          <motion.div
            variants={itemVariants}
            className="card-studio p-6 mb-6 !border-red-500/20"
          >
            <div className="mb-6">
              <h3 className="text-lg font-bold text-red-400 mb-1">
                ⚠️ Danger Zone
              </h3>
              <p className="text-cream-100/60 text-sm">
                Be careful with these actions
              </p>
            </div>

            <button className="px-6 py-3 rounded-full bg-red-500/10 text-red-400 border border-red-500/30 hover:bg-red-500/20 transition-all font-semibold">
              Clear Cache
            </button>
          </motion.div>

          {/* Save Button */}
          <motion.div
            variants={itemVariants}
            className="flex gap-4"
          >
            <button
              onClick={handleSave}
              disabled={isSaving}
              className="btn-pill-brand flex-1 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSaving ? 'Saving...' : 'Save Settings'}
            </button>
            <Link href="/admin" className="btn-pill-ghost flex-1 text-center">
              Back to Dashboard
            </Link>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
}

export default function AdminSettingsPage() {
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
      <AdminSettingsContent />
    </ProtectedRoute>
  );
}
