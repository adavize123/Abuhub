/**
 * Testimonials Section
 * Client quotes in the dark studio theme
 */

"use client";

import { useEffect, useState } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { fetchTestimonials } from '../lib/api/client';
import TiltCard from './TiltCard';

const fallback = [
  {
    id: 't1',
    name: 'Mariam Ali',
    role: 'Founder, StartupX',
    quote: 'Abuhub built our MVP in record time — excellent communication and quality that felt like an in-house team.',
  },
  {
    id: 't2',
    name: 'Omar Hassan',
    role: 'CTO, FinServe',
    quote: 'Their team delivered a polished product our customers love, and the data dashboards keep us focused.',
  },
  {
    id: 't3',
    name: 'Leila N.',
    role: 'Head of Product, RetailCo',
    quote: 'Professional, fast, and highly skilled. Abuhub feels like a growth partner, not just a vendor.',
  },
];

export default function Testimonials() {
  const [items, setItems] = useState(fallback);
  const reduceMotion = useReducedMotion();

  useEffect(() => {
    let mounted = true;
    fetchTestimonials()
      .then((data) => {
        if (mounted && Array.isArray(data) && data.length > 0) setItems(data);
      })
      .catch(() => {
        /* keep fallback */
      });
    return () => (mounted = false);
  }, []);

  const container = { hidden: {}, visible: { transition: { staggerChildren: 0.12 } } };
  const item = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: reduceMotion ? 0 : 0.5 } },
  };

  return (
    <section id="testimonials" aria-labelledby="testimonials-title" className="py-24 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-16">
          <span className="eyebrow-studio">Client voices</span>
          <h2 id="testimonials-title" className="text-4xl md:text-5xl font-bold font-poppins mt-4 mb-4 text-white">
            What our partners say
          </h2>
          <p className="text-cream-100/60 text-lg">Real feedback from businesses who trust Abuhub</p>
        </div>
        <motion.div
          variants={container}
          initial={reduceMotion ? 'visible' : 'hidden'}
          whileInView="visible"
          viewport={{ once: true }}
          className="grid grid-cols-1 md:grid-cols-3 gap-6"
        >
          {items.map((t) => (
            <motion.div key={t.id} variants={item}>
              <TiltCard intensity={5}>
                <blockquote className="card-studio card-studio-hover p-7 flex flex-col h-full" aria-label={`Testimonial from ${t.name}`}>
                  <div className="text-brand-400 text-4xl font-serif leading-none mb-3" aria-hidden="true">
                    &ldquo;
                  </div>
                  <p className="text-cream-100/75 mb-6 leading-relaxed flex-1">{t.quote}</p>
                  <footer className="flex items-center gap-3 pt-4 border-t border-white/10">
                    <span className="w-10 h-10 rounded-full bg-brand-gradient flex items-center justify-center text-white font-semibold text-sm flex-shrink-0">
                      {t.name?.charAt(0) || '•'}
                    </span>
                    <span className="text-sm">
                      <span className="block text-white font-semibold">{t.name}</span>
                      {t.role && <span className="text-cream-100/40">{t.role}</span>}
                    </span>
                  </footer>
                </blockquote>
              </TiltCard>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
