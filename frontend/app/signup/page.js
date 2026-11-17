/**
 * Signup Page
 * User registration page
 */

'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { useForm } from 'react-hook-form';
import Link from 'next/link';
import Image from 'next/image';
import { authApi } from '@/lib/api/authApi';
import { useAuth } from '@/context/AuthContext';

export default function SignupPage() {
  const router = useRouter();
  const { login } = useAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [apiError, setApiError] = useState(null);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm({
    mode: 'onBlur',
  });

  const password = watch('password');

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

      const result = await authApi.signup(data.email, data.password, data.firstName, data.lastName);
      login(result.user, result.tokens);
      router.push('/dashboard');
    } catch (error) {
      setApiError(error.message || 'Signup failed. Please try again.');
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

      {/* Signup Form */}
      <motion.div variants={containerVariants} initial="hidden" animate="visible" className="relative z-10 w-full max-w-md">
        {/* Header */}
        <motion.div variants={itemVariants} className="text-center mb-8">
          <div className="relative w-14 h-14 mx-auto mb-4 rounded-2xl overflow-hidden ring-1 ring-white/15 bg-cream-50">
            <Image src="/images/logo.png" alt="Abuhub" fill className="object-cover" />
          </div>
          <h1 className="text-4xl font-bold font-poppins mb-2 text-white">Create Account</h1>
          <p className="text-cream-100/60">Join the Abuhub community</p>
        </motion.div>

        {/* Form */}
        <motion.form variants={itemVariants} onSubmit={handleSubmit(onSubmit)} className="card-studio p-8 space-y-4">
          {apiError && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-red-500/10 border border-red-500/30 text-red-400 px-4 py-3 rounded-lg text-sm"
            >
              {apiError}
            </motion.div>
          )}

          {/* First / Last Name */}
          <div className="grid grid-cols-2 gap-4">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.1 }}>
              <label className="label-studio">First Name</label>
              <input
                type="text"
                {...register('firstName', { required: 'Required', minLength: { value: 2, message: 'Min 2 characters' } })}
                placeholder="John"
                className={`input-studio !py-2.5 ${errors.firstName ? '!border-red-400/50' : ''}`}
              />
              {errors.firstName && <p className="text-red-400 text-xs mt-1">{errors.firstName.message}</p>}
            </motion.div>

            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.15 }}>
              <label className="label-studio">Last Name</label>
              <input
                type="text"
                {...register('lastName', { required: 'Required', minLength: { value: 2, message: 'Min 2 characters' } })}
                placeholder="Doe"
                className={`input-studio !py-2.5 ${errors.lastName ? '!border-red-400/50' : ''}`}
              />
              {errors.lastName && <p className="text-red-400 text-xs mt-1">{errors.lastName.message}</p>}
            </motion.div>
          </div>

          {/* Email Field */}
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }}>
            <label className="label-studio">Email</label>
            <input
              type="email"
              {...register('email', {
                required: 'Email is required',
                pattern: { value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i, message: 'Invalid email address' },
              })}
              placeholder="your@email.com"
              className={`input-studio !py-2.5 ${errors.email ? '!border-red-400/50' : ''}`}
            />
            {errors.email && <p className="text-red-400 text-xs mt-1">{errors.email.message}</p>}
          </motion.div>

          {/* Password Field */}
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.25 }}>
            <label className="label-studio">Password</label>
            <input
              type="password"
              {...register('password', {
                required: 'Password is required',
                minLength: { value: 6, message: 'Password must be at least 6 characters' },
              })}
              placeholder="••••••••"
              className={`input-studio !py-2.5 ${errors.password ? '!border-red-400/50' : ''}`}
            />
            {errors.password && <p className="text-red-400 text-xs mt-1">{errors.password.message}</p>}
          </motion.div>

          {/* Confirm Password Field */}
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }}>
            <label className="label-studio">Confirm Password</label>
            <input
              type="password"
              {...register('confirmPassword', {
                required: 'Please confirm your password',
                validate: (value) => value === password || 'Passwords do not match',
              })}
              placeholder="••••••••"
              className={`input-studio !py-2.5 ${errors.confirmPassword ? '!border-red-400/50' : ''}`}
            />
            {errors.confirmPassword && <p className="text-red-400 text-xs mt-1">{errors.confirmPassword.message}</p>}
          </motion.div>

          {/* Terms Checkbox */}
          <motion.label
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.35 }}
            className="flex items-start gap-3 cursor-pointer"
          >
            <input
              type="checkbox"
              {...register('terms', { required: 'You must agree to the terms' })}
              className="w-4 h-4 mt-1 rounded border border-white/20 accent-brand-500"
            />
            <span className="text-sm text-cream-100/60">
              I agree to the{' '}
              <Link href="#" className="text-brand-400 hover:underline">
                Terms of Service
              </Link>{' '}
              and{' '}
              <Link href="#" className="text-brand-400 hover:underline">
                Privacy Policy
              </Link>
            </span>
          </motion.label>
          {errors.terms && <p className="text-red-400 text-xs mt-1">{errors.terms.message}</p>}

          {/* Submit Button */}
          <motion.button
            type="submit"
            disabled={isSubmitting}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            whileHover={{ scale: 1.01 }}
            whileTap={{ scale: 0.97 }}
            className="w-full btn-pill-brand !rounded-xl disabled:opacity-50 disabled:cursor-not-allowed mt-2"
          >
            {isSubmitting ? 'Creating account...' : 'Create Account'}
          </motion.button>
        </motion.form>

        {/* Login Link */}
        <motion.p variants={itemVariants} className="text-center mt-6 text-cream-100/60">
          Already have an account?{' '}
          <Link href="/login" className="text-brand-400 hover:text-brand-300 font-semibold transition-colors">
            Sign in
          </Link>
        </motion.p>
      </motion.div>
    </div>
  );
}
