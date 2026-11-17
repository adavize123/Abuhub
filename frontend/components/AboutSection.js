/**
 * About / Why Abuhub Section
 * Value proposition grid explaining the business, dark studio theme
 */

'use client';

import { motion, useReducedMotion } from 'framer-motion';
import Image from 'next/image';
import { useScrollAnimation } from '../lib/hooks/useScrollAnimation';
import TiltCard from './TiltCard';

const values = [
  {
    icon: '🧩',
    title: 'Full-stack under one roof',
    description:
      'Web, mobile, AI, data and design work together in one team — no hand-offs, no lost context, no finger-pointing.',
  },
  {
    icon: '📈',
    title: 'Data-informed decisions',
    description:
      'Every build is instrumented from day one, so you know what is working and can prove ROI to your stakeholders.',
  },
  {
    icon: '⚡',
    title: 'Speed without shortcuts',
    description:
      'Agile sprints, weekly demos and transparent timelines — you always know exactly where your project stands.',
  },
  {
    icon: '🤝',
    title: 'Partnership beyond launch',
    description:
      'We stay close after go-live with support retainers, training and strategic guidance to help you keep growing.',
  },
];

export default function AboutSection() {
  const reduceMotion = useReducedMotion();
  const [ref, isVisible] = useScrollAnimation({ threshold: 0.2 });

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.12, delayChildren: 0.1 } },
  };
  const itemVariants = {
    hidden: { opacity: 0, y: 24 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6 } },
  };

  return (
    <section id="why-us" ref={ref} className="py-24 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      <div className="max-w-6xl mx-auto">
        <div className="grid lg:grid-cols-[0.85fr,1.15fr] gap-14 items-start">
          {/* Left: framing copy */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="lg:sticky lg:top-28"
          >
            <span className="eyebrow-studio">Why Abuhub</span>
            <h2 className="text-4xl md:text-5xl font-bold font-poppins mt-4 mb-6 text-white leading-tight">
              We build like it&apos;s our own business on the line
            </h2>
            <p className="text-cream-100/60 text-lg leading-relaxed mb-8">
              Abuhub started with a simple belief: growing businesses deserve technology
              partners who understand strategy, not just syntax. Today we help founders,
              operators and public-good organizations turn ambitious ideas into products
              people actually use.
            </p>
            <div className="flex items-center gap-4">
              <div className="relative w-14 h-14 rounded-2xl overflow-hidden ring-1 ring-white/15 flex-shrink-0">
                <Image src="/images/logo.png" alt="Abuhub" fill className="object-cover" />
              </div>
              <p className="text-cream-100 font-semibold">
                Build Smarter. Grow Together.
                <span className="block text-cream-100/40 font-normal text-sm">— The Abuhub team</span>
              </p>
            </div>
          </motion.div>

          {/* Right: value grid */}
          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView={isVisible ? 'visible' : 'hidden'}
            viewport={{ once: true, amount: 0.2 }}
            className="grid sm:grid-cols-2 gap-5"
          >
            {values.map((v) => (
              <motion.div key={v.title} variants={itemVariants}>
                <TiltCard intensity={5}>
                  <div className="card-studio card-studio-hover p-6">
                    <div className="w-12 h-12 rounded-xl bg-brand-500/10 border border-brand-400/20 flex items-center justify-center text-2xl mb-4">
                      {v.icon}
                    </div>
                    <h3 className="font-bold font-poppins text-white mb-2">{v.title}</h3>
                    <p className="text-cream-100/55 text-sm leading-relaxed">{v.description}</p>
                  </div>
                </TiltCard>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  );
}
