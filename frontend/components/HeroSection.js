/**
 * Hero Section Component
 * Studio-format hero — a big rounded gradient "hero card" with a floating pill
 * nav overhead, an availability badge, a tilted work collage, and a ticker.
 */

"use client";

import { motion, useReducedMotion } from 'framer-motion';
import Link from 'next/link';

const collage = [
  { label: 'Web', icon: '🌐', from: '#38BDF8', to: '#0369A1', tilt: -8, y: 6 },
  { label: 'App', icon: '📱', from: '#A78BFA', to: '#5B21B6', tilt: 5, y: -10 },
  { label: 'AI', icon: '🤖', from: '#FBBF24', to: '#B45309', tilt: -4, y: 2 },
  { label: 'Design', icon: '🎨', from: '#FB7185', to: '#9D174D', tilt: 7, y: -6 },
  { label: 'Data', icon: '📊', from: '#63CC8B', to: '#136437', tilt: -9, y: 10 },
];

const tickerItems = [
  'Web Development',
  'App Development',
  'AI Integration',
  'Data Analysis',
  'UI/UX Design',
  'Business Support',
];

const avatars = [
  { initials: 'JD', from: '#38BDF8', to: '#0369A1' },
  { initials: 'MA', from: '#FB7185', to: '#9D174D' },
  { initials: 'OH', from: '#FBBF24', to: '#B45309' },
];

export default function HeroSection() {
  const reduceMotion = useReducedMotion();

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.12, delayChildren: 0.15 } },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 22 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.7, ease: [0.22, 1, 0.36, 1] } },
  };

  return (
    <section role="region" aria-label="Hero" className="relative px-3 sm:px-6 pt-3 sm:pt-5">
      <div className="hero-card max-w-7xl mx-auto pt-24 sm:pt-28 pb-20 sm:pb-28 px-5 sm:px-10">
        <div className="grain-overlay" aria-hidden="true" />

        <motion.div
          variants={containerVariants}
          initial={reduceMotion ? 'visible' : 'hidden'}
          animate="visible"
          className="relative z-10 max-w-3xl"
        >
          {/* Availability badge */}
          <motion.div variants={itemVariants} className="mb-7">
            <span className="badge-studio">
              <span className="avatar-stack" aria-hidden="true">
                {avatars.map((a) => (
                  <span
                    key={a.initials}
                    className="avatar-chip"
                    style={{ background: `linear-gradient(135deg, ${a.from}, ${a.to})` }}
                  >
                    {a.initials}
                  </span>
                ))}
              </span>
              Taking on 2 new builds this quarter
            </span>
          </motion.div>

          {/* Headline */}
          <motion.h1
            variants={itemVariants}
            className="text-5xl sm:text-6xl md:text-7xl font-bold font-poppins leading-[1.03] tracking-tight text-white mb-6"
          >
            Build Smarter.
            <br />
            <span className="text-white/60">Grow Together.</span>
          </motion.h1>

          {/* Subheading */}
          <motion.p
            variants={itemVariants}
            className="text-base sm:text-lg text-white/70 max-w-xl leading-relaxed mb-9"
          >
            Abuhub is an independent technology, data &amp; innovation hub — we design and
            engineer web, mobile and AI products, then stay on as a hands-on growth partner.
          </motion.p>

          {/* CTAs */}
          <motion.div variants={itemVariants} className="flex flex-wrap items-center gap-3 sm:gap-4">
            <Link href="#contact">
              <motion.button
                whileHover={reduceMotion ? {} : { scale: 1.04 }}
                whileTap={reduceMotion ? {} : { scale: 0.96 }}
                className="btn-pill-solid"
              >
                Start a project
                <span aria-hidden="true">→</span>
              </motion.button>
            </Link>
            <Link href="#work">
              <motion.button
                whileHover={reduceMotion ? {} : { scale: 1.03 }}
                whileTap={reduceMotion ? {} : { scale: 0.96 }}
                className="btn-pill-outline"
              >
                See our work
              </motion.button>
            </Link>
          </motion.div>
        </motion.div>

        {/* Tilted work collage */}
        <motion.div
          initial={reduceMotion ? { opacity: 1 } : { opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6, duration: 0.8 }}
          id="work"
          className="relative z-10 mt-14 sm:mt-20 -mb-10 sm:-mb-16 flex justify-center sm:justify-end gap-3 sm:gap-4 flex-wrap px-2"
        >
          {collage.map((tile, i) => (
            <motion.div
              key={tile.label}
              style={{ rotate: tile.tilt }}
              initial={reduceMotion ? { opacity: 1 } : { opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: [0, tile.y, 0] }}
              transition={{
                opacity: { delay: 0.7 + i * 0.08, duration: 0.6 },
                y: { delay: 1.2 + i * 0.3, duration: 5 + i, repeat: Infinity, ease: 'easeInOut' },
              }}
              whileHover={reduceMotion ? {} : { rotate: 0, scale: 1.12, y: -18, zIndex: 20 }}
              className="w-20 h-24 sm:w-28 sm:h-36 rounded-2xl sm:rounded-3xl border border-white/15 shadow-[0_20px_50px_-12px_rgba(0,0,0,0.5)] flex flex-col items-center justify-center gap-2 cursor-default select-none backdrop-blur-sm"
              data-tile
              aria-hidden="true"
            >
              <div
                className="absolute inset-0 rounded-2xl sm:rounded-3xl opacity-90"
                style={{ background: `linear-gradient(145deg, ${tile.from}, ${tile.to})` }}
              />
              <span className="relative text-2xl sm:text-3xl">{tile.icon}</span>
              <span className="relative text-[10px] sm:text-xs font-bold uppercase tracking-wider text-white/90">
                {tile.label}
              </span>
            </motion.div>
          ))}
        </motion.div>
      </div>

      {/* Ticker */}
      <div className="max-w-7xl mx-auto mt-6 sm:mt-8 overflow-hidden marquee-mask">
        <div className="marquee-row">
          {[...tickerItems, ...tickerItems, ...tickerItems].map((item, i) => (
            <span key={i} className="flex items-center gap-8 text-sm sm:text-base font-semibold text-cream-100/40">
              {item}
              <span className="text-brand-500" aria-hidden="true">
                ●
              </span>
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}
