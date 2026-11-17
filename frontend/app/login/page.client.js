"use client";

/**
 * Login Page (client)
 * Moved into a client-only module to avoid prerendering issues with useSearchParams
 */

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useSearchParams } from 'next/navigation';
import { motion } from 'framer-motion';
import { useForm } from 'react-hook-form';
import Link from 'next/link';
import Image from 'next/image';
import { authApi } from '@/lib/api/authApi';
import { useAuth } from '@/context/AuthContext';

export default function LoginPageClient() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { login } = useAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [apiError, setApiError] = useState(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    mode: 'onBlur',
  });

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.1, delayChildren: 0.2 } },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6 } },
  };

  const onSubmit = async (data) => {
    try {
      setIsSubmitting(true);
      setApiError(null);

      const result = await authApi.login(data.email, data.password);
      login(result.user, result.tokens);

      const redirectTo = searchParams.get('redirect') || '/dashboard';
      router.push(redirectTo);
    } catch (error) {
      setApiError(error.message || 'Login failed. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="relative min-h-screen flex items-center justify-center px-4 pt-24 pb-16 overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0 z-0 overflow-hidden" aria-hidden="true">
        <div className="brand-blob w-80 h-80 bg-brand-700/20 top-20 -left-10" />
        <div className="brand-blob w-96 h-96 bg-brand-600/15 bottom-10 -right-10" style={{ animationDelay: '3s' }} />
      </div>

      {/* Login Form */}
      <motion.div variants={containerVariants} initial="hidden" animate="visible" className="relative z-10 w-full max-w-md">
        {/* Header */}
        <motion.div variants={itemVariants} className="text-center mb-8">
          <div className="relative w-14 h-14 mx-auto mb-4 rounded-2xl overflow-hidden ring-1 ring-white/15 bg-cream-50">
            <Image src="/images/logo.png" alt="Abuhub" fill className="object-cover" />
          </div>
          <h1 className="text-4xl font-bold font-poppins mb-2 text-white">Welcome Back</h1>
          <p className="text-cream-100/60">Sign in to your Abuhub account</p>
        </motion.div>

        {/* Form */}
        <motion.form variants={itemVariants} onSubmit={handleSubmit(onSubmit)} className="card-studio p-8 space-y-6">
          {apiError && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-red-500/10 border border-red-500/30 text-red-400 px-4 py-3 rounded-lg text-sm"
            >
              {apiError}
            </motion.div>
          )}

          {/* Email Field */}
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.1 }}>
            <label className="label-studio">Email</label>
            <input
              type="email"
              {...register('email', {
                required: 'Email is required',
                pattern: {
                  value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                  message: 'Invalid email address',
                },
              })}
              placeholder="your@email.com"
              className={`input-studio ${errors.email ? '!border-red-400/50' : ''}`}
            />
            {errors.email && <p className="text-red-400 text-xs mt-2">{errors.email.message}</p>}
          </motion.div>

          {/* Password Field */}
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.15 }}>
            <label className="label-studio">Password</label>
            <input
              type="password"
              {...register('password', {
                required: 'Password is required',
                minLength: { value: 6, message: 'Password must be at least 6 characters' },
              })}
              placeholder="••••••••"
              className={`input-studio ${errors.password ? '!border-red-400/50' : ''}`}
            />
            {errors.password && <p className="text-red-400 text-xs mt-2">{errors.password.message}</p>}
          </motion.div>

          {/* Remember Me & Forgot Password */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="flex justify-between items-center"
          >
            <label className="flex items-center gap-2 cursor-pointer">
              <input type="checkbox" className="w-4 h-4 rounded border border-white/20 accent-brand-500" />
              <span className="text-sm text-cream-100/60">Remember me</span>
            </label>
            <Link href="#" className="text-sm text-brand-400 hover:text-brand-300 transition-colors font-medium">
              Forgot password?
            </Link>
          </motion.div>

          {/* Submit Button */}
          <motion.button
            type="submit"
            disabled={isSubmitting}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.25 }}
            whileHover={{ scale: 1.01 }}
            whileTap={{ scale: 0.97 }}
            className="w-full btn-pill-brand !rounded-xl disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSubmitting ? 'Signing in...' : 'Sign In'}
          </motion.button>
        </motion.form>

        {/* Sign Up Link */}
        <motion.p variants={itemVariants} className="text-center mt-6 text-cream-100/60">
          Don&apos;t have an account?{' '}
          <Link href="/signup" className="text-brand-400 hover:text-brand-300 font-semibold transition-colors">
            Sign up
          </Link>
        </motion.p>
      </motion.div>
    </div>
  );
}
