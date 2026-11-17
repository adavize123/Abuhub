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

const WHATSAPP_NUMBER = '2349016879145'; // 09016879145 in international format, no leading 0
const WHATSAPP_LINK = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent("Hi Abuhub, I'd like to talk about a project.")}`;

const contactPoints = [
  { icon: '✉️', label: 'Email us', value: 'abuhubtech@outlook.com', href: 'mailto:abuhubtech@outlook.com' },
  { icon: '📞', label: 'Call / WhatsApp', value: '0901 687 9145', href: 'tel:+2349016879145' },
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
              <div className="space-y-5 mb-8">
                {contactPoints.map((c) => {
                  const Wrapper = c.href ? 'a' : 'div';
                  return (
                    <Wrapper
                      key={c.label}
                      {...(c.href ? { href: c.href } : {})}
                      className={`flex items-start gap-3 ${c.href ? 'group -m-2 p-2 rounded-xl hover:bg-white/5 transition-colors' : ''}`}
                    >
                      <span className="w-10 h-10 rounded-xl bg-white/15 flex items-center justify-center text-lg flex-shrink-0">
                        {c.icon}
                      </span>
                      <div>
                        <p className="text-white/50 text-xs uppercase tracking-wider">{c.label}</p>
                        <p className={`text-white font-medium ${c.href ? 'group-hover:text-brand-300 transition-colors' : ''}`}>
                          {c.value}
                        </p>
                      </div>
                    </Wrapper>
                  );
                })}
              </div>

              {/* WhatsApp CTA */}
              <a
                href={WHATSAPP_LINK}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 w-full px-5 py-3 rounded-full font-semibold text-white bg-[#25D366] hover:bg-[#1fbd5a] transition-all duration-300 hover:scale-[1.02] active:scale-95"
              >
                <svg viewBox="0 0 24 24" className="w-5 h-5 fill-current" aria-hidden="true">
                  <path d="M12.04 2c-5.52 0-10 4.48-10 10 0 1.77.46 3.5 1.33 5.02L2 22l5.1-1.34A9.95 9.95 0 0012.04 22c5.52 0 10-4.48 10-10s-4.48-10-10-10zm0 18.17c-1.6 0-3.17-.43-4.54-1.24l-.33-.19-3.03.8.81-2.95-.21-.3A8.17 8.17 0 013.87 12c0-4.5 3.66-8.17 8.17-8.17S20.21 7.5 20.21 12s-3.66 8.17-8.17 8.17zm4.48-6.12c-.25-.12-1.46-.72-1.68-.8-.23-.08-.39-.12-.56.12-.17.25-.64.8-.78.96-.14.17-.29.19-.53.06-.25-.12-1.03-.38-1.96-1.21-.72-.65-1.21-1.44-1.35-1.69-.14-.25-.02-.38.11-.5.11-.11.25-.29.37-.43.12-.14.17-.25.25-.41.08-.17.04-.31-.02-.43-.06-.12-.56-1.36-.77-1.86-.2-.49-.41-.42-.56-.43-.14-.01-.31-.01-.47-.01-.17 0-.43.06-.66.31-.23.25-.86.84-.86 2.05 0 1.21.88 2.38 1 2.54.12 .17 1.73 2.64 4.19 3.71.59.25 1.04.4 1.4.52.59.19 1.12.16 1.54.1.47-.07 1.46-.6 1.66-1.18.21-.58.21-1.08.14-1.18-.06-.1-.23-.16-.48-.28z" />
                </svg>
                Chat on WhatsApp
              </a>
            </div>
            <div className="relative divider-fade-light my-8" />
            <p className="relative text-white/50 text-sm">
              Prefer async? Reach us by email any time — we typically respond within one business day.
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
