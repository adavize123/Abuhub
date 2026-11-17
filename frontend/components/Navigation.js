/**
 * Navigation Component
 * Floating pill nav — fixed, glassy, always centered above the page
 */

'use client';

import { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../context/AuthContext';

export default function Navigation() {
  const [isOpen, setIsOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const userMenuRef = useRef(null);
  const router = useRouter();
  const { isAuthenticated, user, logout, isLoading } = useAuth();

  const navLinks = [
    { name: 'Work', href: '#work' },
    { name: 'Services', href: '#services' },
    { name: 'Why Us', href: '#why-us' },
    { name: 'Blog', href: '/blog' },
  ];

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (userMenuRef.current && !userMenuRef.current.contains(event.target)) {
        setIsUserMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    const handleKey = (e) => {
      if (e.key === 'Escape') {
        setIsUserMenuOpen(false);
        setIsOpen(false);
      }
    };
    document.addEventListener('keydown', handleKey);
    return () => document.removeEventListener('keydown', handleKey);
  }, []);

  const handleLogout = async () => {
    await logout();
    setIsUserMenuOpen(false);
    router.push('/');
  };

  return (
    <div className="fixed top-3 sm:top-5 inset-x-0 z-50 px-3 sm:px-6">
      <motion.nav
        role="navigation"
        aria-label="Main navigation"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        className="pill-nav max-w-5xl mx-auto"
      >
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 pl-1 pr-3 shrink-0 group">
          <span className="relative w-8 h-8 sm:w-9 sm:h-9 rounded-full overflow-hidden bg-cream-50 ring-1 ring-white/20 flex-shrink-0">
            <Image src="/images/logo.png" alt="Abuhub" fill sizes="36px" className="object-cover" priority />
          </span>
          <span className="text-sm sm:text-base font-bold font-poppins text-white group-hover:text-brand-300 transition-colors">
            Abuhub
          </span>
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center gap-1">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="px-4 py-2 rounded-full text-sm font-medium text-cream-100/70 hover:text-white hover:bg-white/10 transition-all duration-300"
            >
              {link.name}
            </Link>
          ))}
        </div>

        {/* Auth Section - Desktop */}
        <div className="hidden md:flex items-center gap-2 pr-1">
          {!isLoading && !isAuthenticated ? (
            <>
              <Link
                href="/login"
                className="px-4 py-2 text-sm font-medium text-cream-100/70 hover:text-white transition-colors"
              >
                Sign In
              </Link>
              <Link href="/signup" className="btn-pill-brand !px-5 !py-2 text-sm">
                Start a project
              </Link>
            </>
          ) : (
            <div ref={userMenuRef} className="relative">
              <button
                onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                className="flex items-center gap-2 pl-1 pr-3 py-1 rounded-full hover:bg-white/10 transition-all"
                aria-haspopup="true"
                aria-expanded={isUserMenuOpen}
              >
                <div className="w-7 h-7 rounded-full bg-brand-gradient flex items-center justify-center text-white font-semibold text-xs">
                  {user?.name?.charAt(0)?.toUpperCase() || 'U'}
                </div>
                <span className="text-cream-100/80 text-sm font-medium">
                  {user?.name?.split(' ')[0] || 'User'}
                </span>
              </button>

              <AnimatePresence>
                {isUserMenuOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.2 }}
                    className="absolute right-0 mt-3 w-52 bg-ink-900 rounded-2xl border border-white/10 overflow-hidden shadow-2xl"
                  >
                    <div className="px-4 py-3 border-b border-white/10">
                      <p className="text-white font-semibold text-sm">{user?.name}</p>
                      <p className="text-cream-100/40 text-xs">{user?.email}</p>
                    </div>
                    <div className="py-2">
                      <Link
                        href="/dashboard"
                        className="block px-4 py-2 text-cream-100/70 hover:text-brand-300 hover:bg-white/5 transition-all text-sm"
                        onClick={() => setIsUserMenuOpen(false)}
                      >
                        Dashboard
                      </Link>
                      <Link
                        href="/profile"
                        className="block px-4 py-2 text-cream-100/70 hover:text-brand-300 hover:bg-white/5 transition-all text-sm"
                        onClick={() => setIsUserMenuOpen(false)}
                      >
                        Profile
                      </Link>
                      {String(user?.role || '').toLowerCase() === 'admin' && (
                        <Link
                          href="/admin"
                          className="block px-4 py-2 text-cream-100/70 hover:text-brand-300 hover:bg-white/5 transition-all text-sm"
                          onClick={() => setIsUserMenuOpen(false)}
                        >
                          Admin Panel
                        </Link>
                      )}
                    </div>
                    <div className="border-t border-white/10 py-2">
                      <button
                        onClick={handleLogout}
                        className="w-full text-left px-4 py-2 text-red-400 hover:bg-white/5 transition-all text-sm"
                      >
                        Logout
                      </button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          )}
        </div>

        {/* Mobile Menu Button */}
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="md:hidden flex flex-col space-y-1.5 p-2.5 mr-1"
          aria-expanded={isOpen}
          aria-controls="mobile-menu"
          aria-label="Toggle navigation menu"
        >
          <span className={`h-0.5 w-5 bg-white transition-transform duration-300 ${isOpen ? 'rotate-45 translate-y-2' : ''}`} />
          <span className={`h-0.5 w-5 bg-white transition-opacity duration-300 ${isOpen ? 'opacity-0' : ''}`} />
          <span className={`h-0.5 w-5 bg-white transition-transform duration-300 ${isOpen ? '-rotate-45 -translate-y-2' : ''}`} />
        </button>
      </motion.nav>

      {/* Mobile Navigation */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            id="mobile-menu"
            initial={{ opacity: 0, y: -10, height: 0 }}
            animate={{ opacity: 1, y: 0, height: 'auto' }}
            exit={{ opacity: 0, y: -10, height: 0 }}
            className="md:hidden max-w-5xl mx-auto mt-2 rounded-3xl bg-ink-900/95 border border-white/10 backdrop-blur-2xl overflow-hidden"
          >
            <div className="p-3 space-y-1">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="block px-4 py-2.5 text-cream-100/80 hover:text-white rounded-xl hover:bg-white/5 transition-all font-medium"
                  onClick={() => setIsOpen(false)}
                >
                  {link.name}
                </Link>
              ))}
              <div className="border-t border-white/10 pt-3 mt-3 space-y-2">
                {!isLoading && !isAuthenticated ? (
                  <>
                    <Link
                      href="/login"
                      className="block px-4 py-2.5 text-cream-100/80 hover:text-white rounded-xl hover:bg-white/5 transition-all font-medium"
                      onClick={() => setIsOpen(false)}
                    >
                      Sign In
                    </Link>
                    <Link
                      href="/signup"
                      className="block px-4 py-3 btn-pill-brand text-center"
                      onClick={() => setIsOpen(false)}
                    >
                      Start a project
                    </Link>
                  </>
                ) : (
                  <>
                    <Link
                      href="/dashboard"
                      className="block px-4 py-2.5 text-cream-100/80 hover:text-white rounded-xl hover:bg-white/5 transition-all"
                      onClick={() => setIsOpen(false)}
                    >
                      Dashboard
                    </Link>
                    <Link
                      href="/profile"
                      className="block px-4 py-2.5 text-cream-100/80 hover:text-white rounded-xl hover:bg-white/5 transition-all"
                      onClick={() => setIsOpen(false)}
                    >
                      Profile
                    </Link>
                    {String(user?.role || '').toLowerCase() === 'admin' && (
                      <Link
                        href="/admin"
                        className="block px-4 py-2.5 text-cream-100/80 hover:text-white rounded-xl hover:bg-white/5 transition-all"
                        onClick={() => setIsOpen(false)}
                      >
                        Admin Panel
                      </Link>
                    )}
                    <button
                      onClick={() => {
                        handleLogout();
                        setIsOpen(false);
                      }}
                      className="w-full text-left px-4 py-2.5 text-red-400 rounded-xl hover:bg-white/5 transition-all"
                    >
                      Logout
                    </button>
                  </>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
