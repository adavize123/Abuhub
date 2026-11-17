/**
 * Contact Section Component
 * Contact form with validation, dark studio theme
 */

'use client';

import { motion } from 'framer-motion';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { submitContactForm } from '../lib/api/client';
import { useScrollAnimation } from '../lib/hooks/useScrollAnimation';

const contactPoints = [
  { icon: '✉️', label: 'Email us', value: 'hello@abuhub.com' },
  { icon: '📞', label: 'Call us', value: '+234 800 000 0000' },
  { icon: '📍', label: 'Based in', value: 'Abuja, Nigeria — working worldwide' },
];

export default function ContactSection() {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm({ mode: 'onBlur' });

  const [isSuccess, setIsSuccess] = useState(false);
  const [ref, isVisible] = useScrollAnimation({ threshold: 0.3 });

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.08, delayChildren: 0.1 } },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 16 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
  };

  const onSubmit = async (data) => {
    try {
      await submitContactForm(data);
      setIsSuccess(true);
      reset();
      setTimeout(() => setIsSuccess(false), 4000);
    } catch (error) {
      console.error('Failed to submit contact form:', error);
    }
  };

  return (
    <section ref={ref} id="contact" className="py-24 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <span className="eyebrow-studio">Let&apos;s talk</span>
          <h2 className="text-4xl md:text-5xl font-bold font-poppins mt-4 mb-4 text-white">
            Get in touch
          </h2>
          <p className="text-cream-100/60 text-lg max-w-2xl mx-auto">
            Have a project in mind? Tell us about it and we&apos;ll reply within one business day.
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-[0.8fr,1.2fr] gap-8">
          {/* Contact info panel */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="hero-card !rounded-3xl p-8 flex flex-col justify-between"
          >
            <div className="relative">
              <h3 className="text-2xl font-bold font-poppins mb-3 text-white">Let&apos;s build together</h3>
              <p className="text-white/70 mb-8 leading-relaxed">
                Whether you have a full brief or just an idea on a napkin, our team is ready
                to help you shape it into a plan.
              </p>
              <div className="space-y-5">
                {contactPoints.map((c) => (
                  <div key={c.label} className="flex items-start gap-3">
                    <span className="w-10 h-10 rounded-xl bg-white/15 flex items-center justify-center text-lg flex-shrink-0">
                      {c.icon}
                    </span>
                    <div>
                      <p className="text-white/50 text-xs uppercase tracking-wider">{c.label}</p>
                      <p className="text-white font-medium">{c.value}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div className="relative divider-fade-light my-8" />
            <p className="relative text-white/50 text-sm">
              Prefer async? Reach the team any time — we typically respond within one business day.
            </p>
          </motion.div>

          {/* Form */}
          <motion.form
            variants={containerVariants}
            initial="hidden"
            whileInView={isVisible ? 'visible' : 'hidden'}
            viewport={{ once: true, amount: 0.2 }}
            onSubmit={handleSubmit(onSubmit)}
            className="card-studio p-8 md:p-10 space-y-5"
          >
            {isSuccess && (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="bg-brand-500/10 border border-brand-400/30 rounded-xl p-4 text-center"
              >
                <p className="text-brand-300 font-semibold">✓ Message sent successfully! We&apos;ll be in touch soon.</p>
              </motion.div>
            )}

            <div className="grid sm:grid-cols-2 gap-5">
              <motion.div variants={itemVariants}>
                <label className="label-studio">Name</label>
                <input
                  type="text"
                  {...register('name', {
                    required: 'Name is required',
                    minLength: { value: 2, message: 'Name must be at least 2 characters' },
                  })}
                  className="input-studio"
                  placeholder="Your name"
                />
                {errors.name && <p className="text-red-400 text-xs mt-2">{errors.name.message}</p>}
              </motion.div>

              <motion.div variants={itemVariants}>
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
                  className="input-studio"
                  placeholder="your@email.com"
                />
                {errors.email && <p className="text-red-400 text-xs mt-2">{errors.email.message}</p>}
              </motion.div>
            </div>

            <motion.div variants={itemVariants}>
              <label className="label-studio">Service Interest</label>
              <select {...register('serviceInterested')} className="input-studio">
                <option value="" className="bg-ink-900">Select a service</option>
                <option value="web_development" className="bg-ink-900">Web Development</option>
                <option value="app_development" className="bg-ink-900">App Development</option>
                <option value="ai_training" className="bg-ink-900">AI Training</option>
                <option value="data_analysis" className="bg-ink-900">Data Analysis</option>
                <option value="business_support" className="bg-ink-900">Business Support</option>
                <option value="ui_ux_design" className="bg-ink-900">UI/UX Design</option>
                <option value="other" className="bg-ink-900">Other</option>
              </select>
            </motion.div>

            <motion.div variants={itemVariants}>
              <label className="label-studio">Message</label>
              <textarea
                {...register('message', {
                  required: 'Message is required',
                  minLength: { value: 10, message: 'Message must be at least 10 characters' },
                })}
                rows="5"
                className="input-studio resize-none"
                placeholder="Tell us about your project..."
              />
              {errors.message && <p className="text-red-400 text-xs mt-2">{errors.message.message}</p>}
            </motion.div>

            <motion.button
              type="submit"
              disabled={isSubmitting}
              variants={itemVariants}
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.98 }}
              className="w-full btn-pill-brand !rounded-xl disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? 'Sending...' : 'Send Message'}
            </motion.button>
          </motion.form>
        </div>
      </div>
    </section>
  );
}
