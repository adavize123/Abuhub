/**
 * Layout Component
 * Main layout wrapper with page transition animations
 */

'use client';

import Navigation from './Navigation';
import Footer from './Footer';
import { motion, AnimatePresence } from 'framer-motion';
import { useEffect, useState } from 'react';
import { AuthProvider } from '../context/AuthContext';

export default function Layout({ children }) {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  const pageVariants = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -20 },
  };

  const pageTransition = {
    duration: 0.5,
    ease: [0.43, 0.13, 0.23, 0.96],
  };

  return (
    <AuthProvider>
      <div className="min-h-screen flex flex-col bg-canvas-gradient">
        {/* Skip link for keyboard users */}
        <a href="#main-content" className="skip-link">Skip to main content</a>

        {/* Navigation */}
        <Navigation />

        {/* Main Content with Page Transitions */}
        <main id="main-content" className="flex-grow">
          {isClient && (
            <AnimatePresence mode="wait">
              <motion.div
                key={typeof window !== 'undefined' ? window.location.pathname : 'page'}
                variants={pageVariants}
                initial="initial"
                animate="animate"
                exit="exit"
                transition={pageTransition}
              >
                {children}
              </motion.div>
            </AnimatePresence>
          )}
          {!isClient && children}
        </main>

        {/* Footer */}
        <Footer />
      </div>
    </AuthProvider>
  );
}
