/**
 * Impact Strip
 * Slim stats row sitting on the dark canvas just below the hero card
 */

'use client';

import { motion, useReducedMotion } from 'framer-motion';

const stats = [
  { label: 'Projects Shipped', value: '50+' },
  { label: 'Businesses Served', value: '30+' },
  { label: 'Specialists on Team', value: '12+' },
  { label: 'Avg. Client Rating', value: '4.9/5' },
];

export default function ImpactStrip() {
  const reduceMotion = useReducedMotion();

  return (
    <div className="relative px-3 sm:px-6 pt-16 sm:pt-24 pb-4">
      <motion.div
        initial={reduceMotion ? { opacity: 1 } : { opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.4 }}
        transition={{ duration: 0.6 }}
        className="max-w-7xl mx-auto grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4"
      >
        {stats.map((stat, i) => (
          <motion.div
            key={stat.label}
            whileHover={reduceMotion ? {} : { y: -6, borderColor: 'rgba(56,181,105,0.4)' }}
            initial={reduceMotion ? { opacity: 1 } : { opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.08, duration: 0.5 }}
            className="card-studio p-5 sm:p-6 text-center"
          >
            <p className="text-2xl sm:text-3xl font-bold font-poppins bg-gradient-to-r from-brand-300 to-cream-50 bg-clip-text text-transparent mb-1">
              {stat.value}
            </p>
            <p className="text-cream-100/50 text-xs sm:text-sm font-medium">{stat.label}</p>
          </motion.div>
        ))}
      </motion.div>
    </div>
  );
}
