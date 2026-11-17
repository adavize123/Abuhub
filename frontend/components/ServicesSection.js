/**
 * Services Section Component
 * Dark glass cards with interactive tilt, on the studio canvas
 */

"use client";

import { motion, useReducedMotion } from 'framer-motion';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { fetchServices } from '../lib/api/client';
import { useScrollAnimation } from '../lib/hooks/useScrollAnimation';
import TiltCard from './TiltCard';

function ServiceCardSkeletonDark() {
  return (
    <div className="card-studio p-8 animate-pulse">
      <div className="w-16 h-16 rounded-2xl bg-white/5 mb-6" />
      <div className="h-5 bg-white/5 rounded mb-3 w-2/3" />
      <div className="space-y-2 mb-6">
        <div className="h-3 bg-white/5 rounded" />
        <div className="h-3 bg-white/5 rounded w-5/6" />
      </div>
      <div className="h-4 bg-white/5 rounded w-1/3" />
    </div>
  );
}

export default function ServicesSection() {
  const [services, setServices] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [ref, isVisible] = useScrollAnimation({ threshold: 0.2 });

  useEffect(() => {
    const getServices = async () => {
      try {
        const data = await fetchServices({ isActive: true });
        if (!data || data.length === 0) {
          setServices(defaultServices);
        } else {
          setServices(data);
        }
      } catch (error) {
        console.error('Failed to fetch services:', error);
        setServices(defaultServices);
      } finally {
        setIsLoading(false);
      }
    };

    getServices();
  }, []);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.12, delayChildren: 0.1 } },
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 30, scale: 0.96 },
    visible: { opacity: 1, y: 0, scale: 1, transition: { duration: 0.5, type: 'spring', stiffness: 100 } },
  };

  const reduceMotion = useReducedMotion();

  return (
    <section ref={ref} id="services" className="py-24 px-4 sm:px-6 lg:px-8 relative">
      <div className="max-w-6xl mx-auto">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mb-16 max-w-2xl"
        >
          <span className="eyebrow-studio">What we do</span>
          <h2 className="text-4xl md:text-5xl font-bold font-poppins mt-4 mb-4 text-white">
            Services built to move your business forward
          </h2>
          <p className="text-cream-100/60 text-lg">
            From first sketch to shipped product — full-stack digital solutions, backed by
            data and delivered with real business context.
          </p>
        </motion.div>

        {/* Services Grid */}
        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
            {[...Array(6)].map((_, i) => (
              <ServiceCardSkeletonDark key={i} />
            ))}
          </div>
        ) : (
          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView={isVisible ? 'visible' : 'hidden'}
            viewport={{ once: true, amount: 0.2 }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8"
          >
            {services.map((service, index) => (
              <motion.div key={service.id} variants={cardVariants} className="group h-full">
                <TiltCard intensity={6} className="h-full">
                  <div className="card-studio card-studio-hover p-7 sm:p-8 h-full flex flex-col justify-between cursor-pointer">
                    {/* Icon */}
                    <div className="w-16 h-16 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-3xl mb-6 group-hover:bg-brand-500/10 group-hover:border-brand-400/30 transition-colors duration-300">
                      <motion.span
                        className="block"
                        aria-hidden="true"
                        animate={reduceMotion ? undefined : { y: [0, -6, 0] }}
                        transition={reduceMotion ? undefined : { duration: 3, repeat: Infinity, delay: index * 0.15 }}
                      >
                        {service.icon || '⚙️'}
                      </motion.span>
                    </div>

                    {/* Content */}
                    <div className="flex-1">
                      <h3 className="text-xl font-bold font-poppins mb-3 text-white group-hover:text-brand-300 transition-colors duration-300">
                        {service.serviceName}
                      </h3>
                      <p className="text-cream-100/55 mb-6 line-clamp-3 leading-relaxed">
                        {service.shortDescription || service.description}
                      </p>
                    </div>

                    {/* Footer */}
                    <div className="flex justify-between items-center pt-5 border-t border-white/10">
                      <span className="text-brand-400 font-semibold text-sm">
                        {service.pricing || 'Contact for pricing'}
                      </span>
                      <Link href="#contact">
                        <motion.span
                          className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-white/10 text-white text-sm font-semibold group-hover:bg-brand-gradient transition-all duration-300"
                          whileHover={reduceMotion ? {} : { x: 3 }}
                          whileTap={reduceMotion ? {} : { scale: 0.97 }}
                          aria-label={`Enquire about ${service.serviceName}`}
                        >
                          Enquire
                          <span aria-hidden="true">→</span>
                        </motion.span>
                      </Link>
                    </div>
                  </div>
                </TiltCard>
              </motion.div>
            ))}
          </motion.div>
        )}
      </div>
    </section>
  );
}

const defaultServices = [
  {
    id: '1',
    serviceName: 'Web Development',
    shortDescription:
      'Fast, accessible, conversion-focused websites and web apps — from marketing sites to full SaaS platforms.',
    icon: '🌐',
    pricing: 'Custom Quote',
  },
  {
    id: '2',
    serviceName: 'App Development',
    shortDescription: 'Native and cross-platform mobile apps designed for retention and built for scale.',
    icon: '📱',
    pricing: 'Custom Quote',
  },
  {
    id: '3',
    serviceName: 'AI Training & Integration',
    shortDescription: 'Practical AI adoption — from staff training to embedding AI features in your product.',
    icon: '🤖',
    pricing: 'Contact us',
  },
  {
    id: '4',
    serviceName: 'Data Analysis',
    shortDescription: 'Turn scattered data into dashboards and decisions your leadership team can act on.',
    icon: '📊',
    pricing: 'Custom Quote',
  },
  {
    id: '5',
    serviceName: 'Business Support',
    shortDescription: 'Strategy, process and operations guidance to help your business scale sustainably.',
    icon: '💼',
    pricing: 'Contact us',
  },
  {
    id: '6',
    serviceName: 'UI/UX Design',
    shortDescription: 'Research-led product design that makes your digital experience feel effortless.',
    icon: '🎨',
    pricing: 'Custom Quote',
  },
];
