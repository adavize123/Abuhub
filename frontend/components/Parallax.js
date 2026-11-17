/**
 * Parallax Background Component
 * Creates parallax scrolling effect for background elements
 */

'use client';

import { motion } from 'framer-motion';
import { useParallax } from '../lib/hooks/useParallax';

export function ParallaxOrb({ delay = 0, color = 'purple', speed = 0.5 }) {
  const [ref, offset] = useParallax(speed);

  const sizeVariants = {
    small: 'w-72 h-72',
    medium: 'w-96 h-96',
    large: 'w-full h-96',
  };

  const colorVariants = {
    purple: 'bg-accent-purple opacity-20',
    cyan: 'bg-accent-cyan opacity-10',
    mixed: 'bg-gradient-to-br from-accent-purple to-accent-cyan opacity-15',
  };

  return (
    <motion.div
      ref={ref}
      className={`absolute rounded-full blur-3xl ${sizeVariants.medium} ${colorVariants[color]}`}
      style={{
        transform: `translateY(${offset}px)`,
      }}
      animate={{
        x: [0, 100, -50, 0],
        y: [0, 50, 100, 0],
      }}
      transition={{
        duration: 20 + delay,
        repeat: Infinity,
        ease: 'linear',
      }}
    />
  );
}

export function ParallaxFloat({ children, speed = 0.3 }) {
  const [ref, offset] = useParallax(speed);

  return (
    <motion.div
      ref={ref}
      style={{
        y: offset,
      }}
    >
      {children}
    </motion.div>
  );
}

export default { ParallaxOrb, ParallaxFloat };
