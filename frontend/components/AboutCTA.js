/**
 * About Page CTA
 * Closing call-to-action for the /about page (links cross-page to the
 * homepage contact section, since /about has no #contact anchor of its own)
 */

'use client';

import { motion, useReducedMotion } from 'framer-motion';
import Link from 'next/link';

export default function AboutCTA() {
  const reduceMotion = useReducedMotion();

  return (
    <section className="relative px-3 sm:px-6 py-6 mb-6">
      <div className="hero-card max-w-6xl mx-auto py-16 sm:py-20 px-6 sm:px-14 text-center">
        <div className="grain-overlay" aria-hidden="true" />
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
          className="relative z-10 max-w-2xl mx-auto"
        >
          <span className="badge-studio mb-6 inline-flex !pl-4">Let&apos;s talk</span>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold font-poppins text-white mt-6 mb-5 leading-tight">
            Want to work with us?
          </h2>
          <p className="text-white/70 text-lg mb-10">
            Tell us about your project and we&apos;ll get back to you within one business day.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/#contact">
              <motion.button
                whileHover={reduceMotion ? {} : { scale: 1.04 }}
                whileTap={reduceMotion ? {} : { scale: 0.96 }}
                className="btn-pill-solid w-full sm:w-auto"
              >
                Get in Touch
              </motion.button>
            </Link>
            <Link href="/signup">
              <motion.button
                whileHover={reduceMotion ? {} : { scale: 1.03 }}
                whileTap={reduceMotion ? {} : { scale: 0.96 }}
                className="btn-pill-outline w-full sm:w-auto"
              >
                Create an Account
              </motion.button>
            </Link>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
