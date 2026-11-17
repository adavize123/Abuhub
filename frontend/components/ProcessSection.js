/**
 * Process Section
 * "How we work" timeline — dark studio theme
 */

'use client';

import { motion, useReducedMotion } from 'framer-motion';
import { useScrollAnimation } from '../lib/hooks/useScrollAnimation';
import TiltCard from './TiltCard';

const steps = [
  {
    number: '01',
    title: 'Discover',
    description: 'We dig into your goals, users and constraints to scope a plan that fits your budget and timeline.',
    icon: '🔍',
  },
  {
    number: '02',
    title: 'Design',
    description: 'Wireframes and prototypes that we validate with you before a single line of production code is written.',
    icon: '✏️',
  },
  {
    number: '03',
    title: 'Build',
    description: 'Agile sprints with weekly demos — you see progress continuously, not just at the finish line.',
    icon: '🛠️',
  },
  {
    number: '04',
    title: 'Grow',
    description: 'Launch, then iterate. We monitor real usage data and keep improving with you post-launch.',
    icon: '🚀',
  },
];

export default function ProcessSection() {
  const reduceMotion = useReducedMotion();
  const [ref, isVisible] = useScrollAnimation({ threshold: 0.2 });

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.15, delayChildren: 0.1 } },
  };
  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6, type: 'spring', stiffness: 90 } },
  };

  return (
    <section ref={ref} className="py-24 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      <div className="absolute inset-0 pointer-events-none" aria-hidden="true">
        <div className="brand-blob w-[24rem] h-[24rem] bg-brand-600/[0.06] top-0 right-0" />
      </div>

      <div className="relative max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <span className="eyebrow-studio">How we work</span>
          <h2 className="text-4xl md:text-5xl font-bold font-poppins mt-4 mb-4 text-white">
            A process built for clarity, not chaos
          </h2>
          <p className="text-cream-100/60 text-lg max-w-2xl mx-auto">
            No black boxes. Every engagement follows the same transparent four-stage path.
          </p>
        </motion.div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView={isVisible ? 'visible' : 'hidden'}
          viewport={{ once: true, amount: 0.2 }}
          className="relative grid sm:grid-cols-2 lg:grid-cols-4 gap-6"
        >
          <div className="hidden lg:block absolute top-16 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/15 to-transparent" />

          {steps.map((step) => (
            <motion.div key={step.number} variants={itemVariants}>
              <TiltCard intensity={5}>
                <div className="card-studio card-studio-hover p-6 pt-8 relative">
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-3xl">{step.icon}</span>
                    <span className="text-4xl font-bold font-poppins text-white/10 select-none">
                      {step.number}
                    </span>
                  </div>
                  <h3 className="font-bold font-poppins text-lg text-white mb-2">{step.title}</h3>
                  <p className="text-cream-100/55 text-sm leading-relaxed">{step.description}</p>
                </div>
              </TiltCard>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
