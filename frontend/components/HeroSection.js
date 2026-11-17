/**
 * Hero Section Component
 * v3 — near-black canvas with a soft diagonal light-sweep (à la
 * tryprofound.com/careers) and an asymmetric floating mockup cluster
 * joined by a dashed connector (à la logiaweb.net), closing with a giant
 * barely-visible background wordmark. Replaces the loud saturated
 * gradient hero-card with something calmer and more editorial.
 */

"use client";

import { motion, useReducedMotion } from 'framer-motion';
import Link from 'next/link';

const capabilities = ['Web', 'App', 'AI & Automation', 'Data', 'Design', 'Business Support'];

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
    <section role="region" aria-label="Hero" className="relative overflow-hidden pt-32 sm:pt-40 pb-24">
      {/* Background treatment */}
      <div className="absolute inset-0 overflow-hidden" aria-hidden="true">
        <div className="light-sweep-layer" />
        <div className="grain-overlay" />
        <div className="absolute w-[32rem] h-[32rem] rounded-full blur-3xl bg-brand-600/10 -top-40 -left-40" />
        <div className="bg-wordmark">ABUHUB</div>
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-[1.05fr,0.95fr] gap-16 items-center">
          {/* Left: copy */}
          <motion.div
            variants={containerVariants}
            initial={reduceMotion ? 'visible' : 'hidden'}
            animate="visible"
          >
            <motion.div variants={itemVariants} className="mb-7">
              <span className="badge-studio">🌿 Tech · Data · Innovation · Support</span>
            </motion.div>

            <motion.h1
              variants={itemVariants}
              className="text-5xl sm:text-6xl md:text-7xl font-bold font-poppins leading-[1.03] tracking-tight text-white mb-7"
            >
              Build Smarter.
              <br />
              <span className="text-brand-400">Grow</span> Together.
            </motion.h1>

            <motion.p
              variants={itemVariants}
              className="text-base sm:text-lg text-cream-100/55 max-w-xl leading-relaxed mb-10"
            >
              Abuhub is an independent technology, data &amp; innovation hub — we design
              and engineer web, mobile and AI products, then stay on as a hands-on growth
              partner for the businesses and organizations we work with.
            </motion.p>

            <motion.div variants={itemVariants} className="flex flex-wrap items-center gap-4 mb-12">
              <Link href="#contact">
                <motion.button
                  whileHover={reduceMotion ? {} : { scale: 1.03 }}
                  whileTap={reduceMotion ? {} : { scale: 0.97 }}
                  className="btn-pill-solid"
                >
                  Start a project
                  <span aria-hidden="true">→</span>
                </motion.button>
              </Link>
              <Link href="#services">
                <motion.button
                  whileHover={reduceMotion ? {} : { scale: 1.02 }}
                  whileTap={reduceMotion ? {} : { scale: 0.97 }}
                  className="btn-pill-ghost"
                >
                  See our work
                </motion.button>
              </Link>
            </motion.div>

            {/* Capability row — Abuhub's own services, not fabricated client logos */}
            <motion.div variants={itemVariants}>
              <p className="text-xs font-bold uppercase tracking-[0.2em] text-cream-100/30 mb-4">
                What we build
              </p>
              <div className="flex flex-wrap gap-2.5">
                {capabilities.map((c) => (
                  <span key={c} className="pill-chip-muted">
                    {c}
                  </span>
                ))}
              </div>
            </motion.div>
          </motion.div>

          {/* Right: floating mockup cluster */}
          <motion.div
            initial={reduceMotion ? { opacity: 1 } : { opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5, duration: 0.8 }}
            className="relative h-[22rem] sm:h-[26rem] hidden sm:block"
          >
            {/* Dashed connector */}
            <svg className="absolute inset-0 w-full h-full overflow-visible" aria-hidden="true">
              <path
                d="M 70 240 C 160 180, 220 300, 320 120"
                fill="none"
                stroke="rgba(255,255,255,0.15)"
                strokeWidth="1.5"
                strokeDasharray="5 6"
              />
            </svg>
            <span className="connector-dot" style={{ left: '64px', top: '234px' }} />
            <span className="connector-dot" style={{ left: '314px', top: '114px' }} />

            {/* Dashboard-style mockup */}
            <motion.div
              className="mockup-card w-60 sm:w-72 p-4"
              style={{ top: '0px', right: '0px' }}
              animate={reduceMotion ? undefined : { y: [0, -14, 0] }}
              transition={reduceMotion ? undefined : { duration: 6, repeat: Infinity, ease: 'easeInOut' }}
            >
              <div className="flex items-center gap-1.5 mb-4">
                <span className="w-2.5 h-2.5 rounded-full bg-white/15" />
                <span className="w-2.5 h-2.5 rounded-full bg-white/15" />
                <span className="w-2.5 h-2.5 rounded-full bg-white/15" />
              </div>
              <div className="flex items-end gap-2 h-20 mb-4">
                {[40, 65, 50, 85, 60, 95, 70].map((h, i) => (
                  <div
                    key={i}
                    className="flex-1 rounded-t-sm bg-gradient-to-t from-brand-500/70 to-brand-300/40"
                    style={{ height: `${h}%` }}
                  />
                ))}
              </div>
              <div className="h-2 rounded-full bg-white/10 w-3/4 mb-2" />
              <div className="h-2 rounded-full bg-white/[0.06] w-1/2" />
            </motion.div>

            {/* Mobile-app-style mockup */}
            <motion.div
              className="mockup-card w-40 sm:w-48 p-4"
              style={{ bottom: '0px', left: '20px' }}
              animate={reduceMotion ? undefined : { y: [0, 12, 0] }}
              transition={reduceMotion ? undefined : { duration: 7, repeat: Infinity, ease: 'easeInOut', delay: 1 }}
            >
              <div className="w-8 h-8 rounded-full bg-brand-gradient mb-3" />
              <div className="space-y-2">
                <div className="h-2 rounded-full bg-white/10 w-full" />
                <div className="h-2 rounded-full bg-white/[0.06] w-5/6" />
                <div className="h-2 rounded-full bg-white/[0.06] w-2/3" />
              </div>
              <div className="mt-4 h-8 rounded-lg bg-white/[0.05] flex items-center justify-center">
                <div className="w-16 h-2 rounded-full bg-brand-400/50" />
              </div>
            </motion.div>

            {/* Small floating accent chip */}
            <motion.div
              className="mockup-card px-4 py-3 flex items-center gap-2"
              style={{ top: '40%', right: '20%' }}
              animate={reduceMotion ? undefined : { y: [0, -8, 0] }}
              transition={reduceMotion ? undefined : { duration: 5, repeat: Infinity, ease: 'easeInOut', delay: 0.5 }}
            >
              <span className="w-2 h-2 rounded-full bg-brand-400 animate-pulse" />
              <span className="text-xs font-semibold text-cream-100/70">Live build</span>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
