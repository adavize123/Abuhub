/**
 * AdminTabs
 * Pill-style sub-navigation for the admin section, in the studio design language.
 * Sits below the global floating nav and gives every admin page the same shell.
 */

'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion } from 'framer-motion';

const ADMIN_TABS = [
  { name: 'Dashboard', href: '/admin' },
  { name: 'Blog', href: '/admin/blog' },
  { name: 'Users', href: '/admin/users' },
  { name: 'Messages', href: '/admin/messages' },
  { name: 'Services', href: '/admin/services' },
  { name: 'Projects', href: '/admin/projects' },
  { name: 'Testimonials', href: '/admin/testimonials' },
  { name: 'Analytics', href: '/admin/analytics' },
  { name: 'Settings', href: '/admin/settings' },
];

export default function AdminTabs() {
  const pathname = usePathname();

  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="flex items-center gap-2 overflow-x-auto pb-2 mb-8 -mx-1 px-1"
      style={{ scrollbarWidth: 'none' }}
    >
      {ADMIN_TABS.map((tab) => {
        const isActive = tab.href === '/admin' ? pathname === '/admin' : pathname?.startsWith(tab.href);
        return (
          <Link
            key={tab.href}
            href={tab.href}
            className={`shrink-0 px-4 py-2 rounded-full text-sm font-semibold border transition-all duration-300 ${
              isActive
                ? 'bg-brand-gradient border-transparent text-white'
                : 'bg-white/5 border-white/10 text-cream-100/60 hover:text-white hover:border-white/25'
            }`}
          >
            {tab.name}
          </Link>
        );
      })}
    </motion.div>
  );
}
