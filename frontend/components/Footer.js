/**
 * Footer Component
 * Dark "ink" footer with logo, links and social icons
 */

'use client';

import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { useScrollAnimation } from '../lib/hooks/useScrollAnimation';

export default function Footer() {
  const currentYear = new Date().getFullYear();
  const [ref, isVisible] = useScrollAnimation({ threshold: 0.5 });

  const quickLinks = [
    { name: 'Home', href: '/' },
    { name: 'About', href: '/about' },
    { name: 'Services', href: '/#services' },
    { name: 'Projects', href: '/projects' },
    { name: 'Blog', href: '/blog' },
    { name: 'Contact', href: '/#contact' },
  ];

  const services = ['Web Development', 'App Development', 'AI Training', 'Data Analysis', 'Business Support', 'UI/UX Design'];

  const socialLinks = [
    { name: 'Twitter', icon: '𝕏', href: 'https://twitter.com' },
    { name: 'LinkedIn', icon: 'in', href: 'https://linkedin.com' },
    { name: 'GitHub', icon: '⌥', href: 'https://github.com' },
    { name: 'Facebook', icon: 'f', href: 'https://facebook.com' },
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.1, delayChildren: 0.1 } },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6, type: 'spring', stiffness: 100 } },
  };

  const socialIconVariants = {
    initial: { scale: 1 },
    hover: { scale: 1.15, rotate: 8 },
    tap: { scale: 0.95 },
  };

  return (
    <footer ref={ref} className="relative section-ink overflow-hidden">
      <div className="grain-overlay" aria-hidden="true" />
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView={isVisible ? 'visible' : 'hidden'}
          viewport={{ once: true, amount: 0.5 }}
          className="grid grid-cols-1 md:grid-cols-4 gap-10 mb-12"
        >
          {/* Brand */}
          <motion.div variants={itemVariants} className="md:col-span-1">
            <Link href="/" className="flex items-center gap-3 mb-4 group">
              <span className="relative w-11 h-11 rounded-xl overflow-hidden bg-cream-50 flex-shrink-0 shadow-card">
                <Image src="/images/logo.png" alt="Abuhub logo" fill sizes="44px" className="object-cover" />
              </span>
              <span className="text-xl font-bold font-poppins text-cream-50">Abuhub</span>
            </Link>
            <p className="text-cream-100/60 text-sm leading-relaxed">
              Tech, data &amp; innovation hub — building digital solutions for businesses that
              want to build smarter and grow together.
            </p>
          </motion.div>

          {/* Quick Links */}
          <motion.div variants={itemVariants}>
            <h4 className="font-semibold text-cream-50 mb-4">Quick Links</h4>
            <ul className="space-y-2.5">
              {quickLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-cream-100/60 hover:text-brand-400 transition-colors duration-300 inline-flex items-center gap-2 group text-sm"
                  >
                    <span className="opacity-0 group-hover:opacity-100 transition-opacity">→</span>
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </motion.div>

          {/* Services */}
          <motion.div variants={itemVariants}>
            <h4 className="font-semibold text-cream-50 mb-4">Services</h4>
            <ul className="space-y-2.5 text-sm">
              {services.map((service) => (
                <li key={service} className="text-cream-100/60 hover:text-brand-400 transition-colors duration-300 cursor-default">
                  {service}
                </li>
              ))}
            </ul>
          </motion.div>

          {/* Social + newsletter hint */}
          <motion.div variants={itemVariants}>
            <h4 className="font-semibold text-cream-50 mb-4">Follow Us</h4>
            <div className="flex space-x-3 mb-6">
              {socialLinks.map((social) => (
                <motion.a
                  key={social.href}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 rounded-full bg-white/8 flex items-center justify-center text-cream-50 hover:bg-brand-gradient transition-all duration-300 text-sm font-semibold"
                  title={social.name}
                  aria-label={`Visit our ${social.name}`}
                  variants={socialIconVariants}
                  initial="initial"
                  whileHover="hover"
                  whileTap="tap"
                >
                  <span aria-hidden="true">{social.icon}</span>
                </motion.a>
              ))}
            </div>
            <p className="text-cream-100/50 text-xs leading-relaxed space-y-1">
              <a href="mailto:abuhubtech@outlook.com" className="block hover:text-brand-400 transition-colors">
                abuhubtech@outlook.com
              </a>
              <a
                href="https://wa.me/2349016879145"
                target="_blank"
                rel="noopener noreferrer"
                className="block hover:text-brand-400 transition-colors"
              >
                0901 687 9145 (WhatsApp)
              </a>
              <span className="block">Abuja, Nigeria</span>
            </p>
          </motion.div>
        </motion.div>

        <div className="divider-fade-light mb-8" />

        {/* Bottom Footer */}
        <motion.div
          variants={itemVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="flex flex-col md:flex-row justify-between items-center text-cream-100/50 text-sm gap-4"
        >
          <p>&copy; {currentYear} Abuhub. All rights reserved.</p>

          <div className="flex items-center gap-6">
            <div className="flex space-x-6">
              {['Privacy Policy', 'Terms of Service', 'Contact'].map((link) => (
                <Link
                  key={link}
                  href={link === 'Contact' ? '/#contact' : '#'}
                  className="hover:text-brand-400 transition-colors duration-300"
                >
                  {link}
                </Link>
              ))}
            </div>

            <button
              onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
              className="px-3 py-2 bg-white/8 text-cream-50 rounded-md hover:bg-brand-gradient transition-all"
              aria-label="Back to top"
            >
              ↑ Top
            </button>
          </div>
        </motion.div>
      </div>
    </footer>
  );
}
