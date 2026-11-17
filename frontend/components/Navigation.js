/**
 * Navigation Component
 * v3 — flat, minimal top bar (not a floating glass pill), inspired by
 * tryprofound.com's restrained editorial header: small logo mark, plain
 * text links, a ghost "Sign In" and a solid white primary CTA.
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
  const [showLogoutPrompt, setShowLogoutPrompt] = useState(false);
  const userMenuRef = useRef(null);
  const router = useRouter();
  const { isAuthenticated, user, logout, isLoading } = useAuth();

  const navLinks = [
    { name: 'Services', href: '#services' },
    { name: 'Projects', href: '/projects' },
    { name: 'About', href: '/about' },
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
        setShowLogoutPrompt(false);
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

  // Clicking the logo while signed in asks whether to log out first, instead
  // of silently taking an authenticated user back to the public homepage.
  const handleLogoClick = (e) => {
    if (isAuthenticated) {
      e.preventDefault();
      setShowLogoutPrompt(true);
    }
  };

  const confirmLogoutAndGoHome = async () => {
    setShowLogoutPrompt(false);
    await logout();
    router.push('/');
  };

  const stayLoggedInAndGoHome = () => {
    setShowLogoutPrompt(false);
    router.push('/');
  };

  return (
    <motion.header
      initial={{ opacity: 0, y: -12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
      className="fixed top-0 inset-x-0 z-50"
    >
      <nav role="navigation" aria-label="Main navigation" className="nav-flat">
        {/* Logo */}
        <Link href="/" onClick={handleLogoClick} className="flex items-center gap-2.5 shrink-0 group">
          <span className="relative w-7 h-7 rounded-lg overflow-hidden bg-cream-50 ring-1 ring-white/15 flex-shrink-0">
            <Image src="/images/logo.png" alt="Abuhub" fill sizes="28px" className="object-cover" priority />
          </span>
          <span className="text-[15px] font-bold font-poppins text-white tracking-tight">
            Abuhub
          </span>
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center gap-7">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="relative text-sm font-medium text-cream-100/55 hover:text-white transition-colors duration-200 group"
            >
              {link.name}
              <span className="absolute -bottom-1.5 left-0 right-0 h-px bg-white scale-x-0 group-hover:scale-x-100 transition-transform duration-200 origin-left" />
            </Link>
          ))}
        </div>

        {/* Auth Section - Desktop */}
        <div className="hidden md:flex items-center gap-5">
          {!isLoading && !isAuthenticated ? (
            <>
              <Link
                href="/login"
                className="text-sm font-medium text-cream-100/55 hover:text-white transition-colors"
              >
                Sign In
              </Link>
              <Link href="/signup" className="btn-pill-solid !px-5 !py-2 text-sm">
                Start a project
              </Link>
            </>
          ) : (
            <div ref={userMenuRef} className="relative">
              <button
                onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                className="flex items-center gap-2 pl-1 pr-3 py-1 rounded-full hover:bg-white/5 transition-all"
                aria-haspopup="true"
                aria-expanded={isUserMenuOpen}
              >
                <div className="w-7 h-7 rounded-full bg-brand-gradient flex items-center justify-center text-white font-semibold text-xs">
                  {user?.name?.charAt(0)?.toUpperCase() || 'U'}
                </div>
                <span className="text-cream-100/70 text-sm font-medium">
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
          className="md:hidden flex flex-col space-y-1.5 p-2"
          aria-expanded={isOpen}
          aria-controls="mobile-menu"
          aria-label="Toggle navigation menu"
        >
          <span className={`h-0.5 w-5 bg-white transition-transform duration-300 ${isOpen ? 'rotate-45 translate-y-2' : ''}`} />
          <span className={`h-0.5 w-5 bg-white transition-opacity duration-300 ${isOpen ? 'opacity-0' : ''}`} />
          <span className={`h-0.5 w-5 bg-white transition-transform duration-300 ${isOpen ? '-rotate-45 -translate-y-2' : ''}`} />
        </button>
      </nav>

      {/* Mobile Navigation */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            id="mobile-menu"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden bg-ink-950/98 border-b border-white/10 backdrop-blur-2xl overflow-hidden"
          >
            <div className="p-4 space-y-1">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="block px-3 py-2.5 text-cream-100/80 hover:text-white rounded-xl hover:bg-white/5 transition-all font-medium"
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
                      className="block px-3 py-2.5 text-cream-100/80 hover:text-white rounded-xl hover:bg-white/5 transition-all font-medium"
                      onClick={() => setIsOpen(false)}
                    >
                      Sign In
                    </Link>
                    <Link
                      href="/signup"
                      className="block px-4 py-3 btn-pill-solid text-center"
                      onClick={() => setIsOpen(false)}
                    >
                      Start a project
                    </Link>
                  </>
                ) : (
                  <>
                    <Link
                      href="/dashboard"
                      className="block px-3 py-2.5 text-cream-100/80 hover:text-white rounded-xl hover:bg-white/5 transition-all"
                      onClick={() => setIsOpen(false)}
                    >
                      Dashboard
                    </Link>
                    <Link
                      href="/profile"
                      className="block px-3 py-2.5 text-cream-100/80 hover:text-white rounded-xl hover:bg-white/5 transition-all"
                      onClick={() => setIsOpen(false)}
                    >
                      Profile
                    </Link>
                    {String(user?.role || '').toLowerCase() === 'admin' && (
                      <Link
                        href="/admin"
                        className="block px-3 py-2.5 text-cream-100/80 hover:text-white rounded-xl hover:bg-white/5 transition-all"
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
                      className="w-full text-left px-3 py-2.5 text-red-400 rounded-xl hover:bg-white/5 transition-all"
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

      {/* Logout confirmation — shown when a signed-in user clicks the logo */}
      <AnimatePresence>
        {showLogoutPrompt && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-[60] flex items-center justify-center bg-black/70 backdrop-blur-sm px-4"
            onClick={() => setShowLogoutPrompt(false)}
            role="dialog"
            aria-modal="true"
            aria-labelledby="logout-prompt-title"
          >
            <motion.div
              initial={{ opacity: 0, y: 16, scale: 0.97 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 16, scale: 0.97 }}
              transition={{ duration: 0.2, ease: [0.22, 1, 0.36, 1] }}
              onClick={(e) => e.stopPropagation()}
              className="card-studio w-full max-w-sm p-6 sm:p-7 text-center"
            >
              <div className="w-12 h-12 rounded-full bg-brand-500/15 border border-brand-400/30 flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl" aria-hidden="true">👋</span>
              </div>
              <h2 id="logout-prompt-title" className="text-lg font-bold font-poppins text-white mb-2">
                Heading back home?
              </h2>
              <p className="text-cream-100/60 text-sm mb-6">
                Would you like to log out of your Abuhub account, {user?.name?.split(' ')[0] || 'friend'}, or stay signed in?
              </p>
              <div className="flex flex-col gap-2.5">
                <button onClick={confirmLogoutAndGoHome} className="btn-pill-ghost w-full !border-red-500/30 !text-red-400 hover:!bg-red-500/10">
                  Log out
                </button>
                <button onClick={stayLoggedInAndGoHome} className="btn-pill-solid w-full">
                  Stay signed in
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.header>
  );
}
