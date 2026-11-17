/**
 * User Profile Page
 * Edit user profile information
 */

'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { useForm } from 'react-hook-form';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import ProtectedRoute from '@/components/ProtectedRoute';
import { useScrollAnimation } from '@/lib/hooks/useScrollAnimation';

function ProfileContent() {
  const [ref, isVisible] = useScrollAnimation({ threshold: 0.3 });
  const { user } = useAuth();
  const router = useRouter();
  const [isEditing, setIsEditing] = useState(false);
  const [isChangingPassword, setIsChangingPassword] = useState(false);

  const {
    register: registerProfile,
    handleSubmit: handleSubmitProfile,
    formState: { errors: profileErrors },
  } = useForm({
    defaultValues: {
      name: user?.name || '',
      email: user?.email || '',
      bio: user?.profile?.bio || '',
    },
  });

  const {
    register: registerPassword,
    handleSubmit: handleSubmitPassword,
    watch: watchPassword,
    formState: { errors: passwordErrors },
  } = useForm({
    mode: 'onBlur',
  });

  const newPassword = watchPassword('newPassword');

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

  const onSubmitProfile = async (data) => {
    try {
      // TODO: Call API to update profile
      console.log('Profile update:', data);
      setIsEditing(false);
    } catch (error) {
      console.error('Error updating profile:', error);
    }
  };

  const onSubmitPassword = async (data) => {
    try {
      // TODO: Call API to change password
      console.log('Password change:', data);
      setIsChangingPassword(false);
    } catch (error) {
      console.error('Error changing password:', error);
    }
  };

  return (
    <div ref={ref} className="min-h-screen pt-28 pb-20">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="mb-12"
        >
          <motion.div variants={itemVariants}>
            <span className="eyebrow-studio">Account</span>
            <h1 className="text-4xl font-bold font-poppins mt-3 mb-2 text-white">
              Profile <span className="text-brand-400">Settings</span>
            </h1>
            <p className="text-cream-100/60">Manage your account and preferences</p>
          </motion.div>
        </motion.div>

        {/* Profile Information */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="space-y-6"
        >
          {/* Profile Card */}
          <motion.div variants={itemVariants} className="card-studio p-8">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-white font-poppins">Profile Information</h2>
              {!isEditing && (
                <button
                  onClick={() => setIsEditing(true)}
                  className="btn-pill-brand !px-5 !py-2 text-sm"
                >
                  Edit Profile
                </button>
              )}
            </div>

            {isEditing ? (
              <form onSubmit={handleSubmitProfile(onSubmitProfile)} className="space-y-6">
                {/* Name Field */}
                <div>
                  <label className="label-studio">Full Name</label>
                  <input
                    type="text"
                    {...registerProfile('name', {
                      required: 'Name is required',
                    })}
                    className={`input-studio ${profileErrors.name ? '!border-red-500/50' : ''}`}
                  />
                  {profileErrors.name && (
                    <p className="text-red-400 text-xs mt-2">{profileErrors.name.message}</p>
                  )}
                </div>

                {/* Email Field (Read-only) */}
                <div>
                  <label className="label-studio">Email</label>
                  <input
                    type="email"
                    {...registerProfile('email')}
                    disabled
                    className="input-studio opacity-50 cursor-not-allowed"
                  />
                  <p className="text-cream-100/40 text-xs mt-2">Email cannot be changed</p>
                </div>

                {/* Bio Field */}
                <div>
                  <label className="label-studio">Bio</label>
                  <textarea
                    {...registerProfile('bio')}
                    placeholder="Tell us about yourself"
                    rows={4}
                    className="input-studio resize-none"
                  />
                </div>

                {/* Buttons */}
                <div className="flex gap-4">
                  <button type="submit" className="btn-pill-brand flex-1">
                    Save Changes
                  </button>
                  <button
                    type="button"
                    onClick={() => setIsEditing(false)}
                    className="btn-pill-ghost flex-1"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            ) : (
              <div className="space-y-6">
                <div>
                  <p className="text-cream-100/60 text-sm">Full Name</p>
                  <p className="text-white text-lg font-semibold mt-1">{user?.name}</p>
                </div>
                <div>
                  <p className="text-cream-100/60 text-sm">Email</p>
                  <p className="text-white text-lg font-semibold mt-1">{user?.email}</p>
                </div>
                <div>
                  <p className="text-cream-100/60 text-sm">Account Role</p>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="text-white text-lg font-semibold">{user?.role}</span>
                    {String(user?.role || '').toLowerCase() === 'admin' && (
                      <span className="px-3 py-1 bg-brand-500/15 text-brand-300 border border-brand-400/20 text-xs rounded-full font-semibold">
                        Administrator
                      </span>
                    )}
                  </div>
                </div>
                {user?.profile?.bio && (
                  <div>
                    <p className="text-cream-100/60 text-sm">Bio</p>
                    <p className="text-white text-lg mt-1">{user.profile.bio}</p>
                  </div>
                )}
              </div>
            )}
          </motion.div>

          {/* Change Password Card */}
          <motion.div variants={itemVariants} className="card-studio p-8">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-white font-poppins">Security</h2>
              {!isChangingPassword && (
                <button
                  onClick={() => setIsChangingPassword(true)}
                  className="btn-pill-brand !px-5 !py-2 text-sm"
                >
                  Change Password
                </button>
              )}
            </div>

            {isChangingPassword ? (
              <form onSubmit={handleSubmitPassword(onSubmitPassword)} className="space-y-6">
                {/* Current Password */}
                <div>
                  <label className="label-studio">Current Password</label>
                  <input
                    type="password"
                    {...registerPassword('currentPassword', {
                      required: 'Current password is required',
                    })}
                    placeholder="••••••••"
                    className={`input-studio ${passwordErrors.currentPassword ? '!border-red-500/50' : ''}`}
                  />
                  {passwordErrors.currentPassword && (
                    <p className="text-red-400 text-xs mt-2">{passwordErrors.currentPassword.message}</p>
                  )}
                </div>

                {/* New Password */}
                <div>
                  <label className="label-studio">New Password</label>
                  <input
                    type="password"
                    {...registerPassword('newPassword', {
                      required: 'New password is required',
                      minLength: { value: 6, message: 'Password must be at least 6 characters' },
                    })}
                    placeholder="••••••••"
                    className={`input-studio ${passwordErrors.newPassword ? '!border-red-500/50' : ''}`}
                  />
                  {passwordErrors.newPassword && (
                    <p className="text-red-400 text-xs mt-2">{passwordErrors.newPassword.message}</p>
                  )}
                </div>

                {/* Confirm Password */}
                <div>
                  <label className="label-studio">Confirm Password</label>
                  <input
                    type="password"
                    {...registerPassword('confirmPassword', {
                      required: 'Please confirm your password',
                      validate: (value) => value === newPassword || 'Passwords do not match',
                    })}
                    placeholder="••••••••"
                    className={`input-studio ${passwordErrors.confirmPassword ? '!border-red-500/50' : ''}`}
                  />
                  {passwordErrors.confirmPassword && (
                    <p className="text-red-400 text-xs mt-2">{passwordErrors.confirmPassword.message}</p>
                  )}
                </div>

                {/* Buttons */}
                <div className="flex gap-4">
                  <button type="submit" className="btn-pill-brand flex-1">
                    Change Password
                  </button>
                  <button
                    type="button"
                    onClick={() => setIsChangingPassword(false)}
                    className="btn-pill-ghost flex-1"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            ) : (
              <p className="text-cream-100/60">Keep your account secure with a strong password.</p>
            )}
          </motion.div>

          {/* Danger Zone */}
          <motion.div variants={itemVariants} className="card-studio p-8 border-red-500/20">
            <h2 className="text-2xl font-bold text-red-400 mb-4 font-poppins">Danger Zone</h2>
            <p className="text-cream-100/60 mb-6">Be careful with these actions. They cannot be undone.</p>
            <button className="px-6 py-3 bg-red-500/10 text-red-400 border border-red-500/30 rounded-full hover:bg-red-500/20 transition-all font-semibold">
              Delete Account
            </button>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
}

export default function ProfilePage() {
  return (
    <ProtectedRoute>
      <ProfileContent />
    </ProtectedRoute>
  );
}
