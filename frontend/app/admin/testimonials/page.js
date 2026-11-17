'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import ProtectedRoute from '@/components/ProtectedRoute';
import AdminTabs from '@/components/AdminTabs';
import { useAuth } from '@/context/AuthContext';

const containerVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.08, delayChildren: 0.1 } },
};

const itemVariants = {
  hidden: { opacity: 0, y: 16 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.4 } },
};

export default function AdminTestimonialsPage() {
  const { tokens, getAccessToken, logout, isLoading, isAuthenticated, isModerator } = useAuth();
  const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const fetchAdmin = async () => {
    setLoading(true);
    try {
      const token = getAccessToken();
      const res = await fetch(`${API_BASE}/api/testimonials/admin/all`, { headers: { Authorization: `Bearer ${token}` } });
      const body = await res.json();
      if (body.success) setItems(body.data || []);
      else setError(body.message || 'Failed to fetch');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!isLoading && isAuthenticated) fetchAdmin();
  }, [isLoading, isAuthenticated, tokens]);

  const togglePublish = async (id, publish) => {
    try {
      const token = getAccessToken();
      const res = await fetch(`${API_BASE}/api/testimonials/${id}`, { method: 'PUT', headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` }, body: JSON.stringify({ isPublished: publish }) });
      const body = await res.json();
      if (body.success) fetchAdmin();
      else setError(body.message || 'Failed to update');
    } catch (err) {
      setError(err.message);
    }
  };

  const remove = async (id) => {
    try {
      if (!confirm('Are you sure you want to delete this testimonial?')) return;
      const token = getAccessToken();
      const res = await fetch(`${API_BASE}/api/testimonials/${id}`, { method: 'DELETE', headers: { Authorization: `Bearer ${token}` } });
      const body = await res.json();
      if (body.success) fetchAdmin();
      else setError(body.message || 'Failed to delete');
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <ProtectedRoute>
      <div className="min-h-screen pt-24 pb-12">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <AdminTabs />

          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8 flex flex-col sm:flex-row justify-between sm:items-center gap-4"
          >
            <div>
              <span className="eyebrow-studio">Moderation</span>
              <h1 className="text-4xl font-bold font-poppins mt-3 mb-2 text-white">
                Testimonials
              </h1>
              <p className="text-cream-100/60">Review, publish, and manage client testimonials</p>
            </div>
            <div className="flex gap-3 self-start sm:self-auto">
              <button
                className="btn-pill-ghost !px-5 !py-2 text-sm"
                onClick={() => { logout(); setItems([]); }}
              >
                Logout
              </button>
              <button
                className="btn-pill-brand !px-5 !py-2 text-sm"
                onClick={() => fetchAdmin()}
              >
                Refresh
              </button>
            </div>
          </motion.div>

          {error && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-red-500/10 border border-red-500/30 text-red-400 px-4 py-3 rounded-xl text-sm mb-6"
            >
              {error}
            </motion.div>
          )}

          {loading ? (
            <div className="space-y-4">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="card-studio p-6 h-28 animate-pulse" />
              ))}
            </div>
          ) : (
            <div>
              {!isModerator() && (
                <div className="bg-red-500/10 border border-red-500/30 text-red-400 px-4 py-3 rounded-xl text-sm mb-6">
                  You do not have moderator permissions to manage testimonials.
                </div>
              )}
              {items.length === 0 ? (
                <div className="card-studio text-center py-12">
                  <p className="text-cream-100/50">No testimonials</p>
                </div>
              ) : (
                <motion.ul
                  variants={containerVariants}
                  initial="hidden"
                  animate="visible"
                  className="space-y-4"
                >
                  {items.map((t) => (
                    <motion.li key={t.id} variants={itemVariants} className="card-studio p-6">
                      <div className="flex justify-between items-start gap-4 flex-wrap">
                        <div>
                          <div className="flex items-center gap-3 flex-wrap">
                            <span className="font-semibold text-white">
                              {t.name} {t.role ? `— ${t.role}` : ''}
                            </span>
                            <span
                              className={`px-2.5 py-1 rounded-full text-xs font-semibold ${
                                t.isPublished
                                  ? 'bg-brand-500/15 text-brand-300 border border-brand-400/30'
                                  : 'bg-amber-500/15 text-amber-300 border border-amber-400/30'
                              }`}
                            >
                              {t.isPublished ? 'Published' : 'Unpublished'}
                            </span>
                          </div>
                          <div className="text-sm text-cream-100/40 mt-1">
                            {new Date(t.createdAt).toLocaleString()}
                          </div>
                        </div>
                        <div className="flex gap-2 shrink-0">
                          <button
                            onClick={() => togglePublish(t.id, !t.isPublished)}
                            className="px-3 py-1.5 rounded-full bg-brand-500/15 text-brand-300 border border-brand-400/30 hover:bg-brand-500/25 transition-all text-sm font-semibold"
                          >
                            {t.isPublished ? 'Unpublish' : 'Publish'}
                          </button>
                          <button
                            onClick={() => remove(t.id)}
                            className="px-3 py-1.5 rounded-full bg-red-500/10 text-red-400 border border-red-500/30 hover:bg-red-500/20 transition-all text-sm font-semibold"
                          >
                            Delete
                          </button>
                        </div>
                      </div>
                      <p className="mt-3 text-cream-100/70 leading-relaxed">{t.quote}</p>
                    </motion.li>
                  ))}
                </motion.ul>
              )}
            </div>
          )}
        </div>
      </div>
    </ProtectedRoute>
  );
}
