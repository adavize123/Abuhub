/**
 * Page Transition Component
 * Smooth page transitions with animations
 */

'use client';

import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';

export function PageTransition({ children }) {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setIsLoading(false);
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.5 }}
    >
      {children}
    </motion.div>
  );
}

export default PageTransition;
