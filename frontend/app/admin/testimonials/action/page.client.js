'use client';

import Link from 'next/link';
import { useMemo, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { motion } from 'framer-motion';
import { useAuth } from '@/context/AuthContext';

export default function TestimonialActionClient() {
  const params = useSearchParams();
  const { isAuthenticated, isLoading, isModerator, getAccessToken } = useAuth();

  const token = params.get('token') || '';
  const action = params.get('action') || 'review';
  const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

  const [submitting, setSubmitting] = useState(false);
  const [result, setResult] = useState(null);

  const loginRedirect = useMemo(() => {
    const callback = `/admin/testimonials/action?token=${encodeURIComponent(token)}&action=${encodeURIComponent(action)}`;
    return `/login?redirect=${encodeURIComponent(callback)}`;
  }, [token, action]);

  const submitAction = async () => {
    setSubmitting(true);
    setResult(null);
    try {
      const accessToken = getAccessToken();
      const res = await fetch(`${API_BASE}/api/testimonials/action?token=${encodeURIComponent(token)}&format=json`, {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${accessToken}`,
          Accept: 'application/json',
        },
      });
      const body = await res.json();
      if (!res.ok || !body.success) {
        throw new Error(body.message || 'Action failed');
      }
      setResult({ ok: true, message: body.message || 'Action completed successfully' });
    } catch (err) {
      setResult({ ok: false, message: err.message || 'Action failed' });
    } finally {
      setSubmitting(false);
    }
  };

  if (!token) {
    return (
      <div className="min-h-screen pt-28 pb-12">
        <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="card-studio p-8">
            <h1 className="text-2xl font-bold font-poppins mb-3 text-white">Invalid action link</h1>
            <p className="text-cream-100/60 mb-6">Missing token in URL.</p>
            <Link className="btn-pill-brand inline-flex" href="/admin/testimonials">Back to moderation</Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-28 pb-12">
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="card-studio p-8"
        >
          <span className="eyebrow-studio">Moderation</span>
          <h1 className="text-3xl font-bold font-poppins mt-3 mb-3 text-white">Moderation action</h1>
          <p className="text-cream-100/70 mb-2">
            Requested action: <strong className="text-white">{action}</strong>
          </p>
          <p className="text-cream-100/50 mb-6 text-sm">For security, this requires an authenticated moderator/admin session.</p>

          {isLoading ? (
            <div className="text-cream-100/60">Checking authentication...</div>
          ) : !isAuthenticated ? (
            <div className="space-y-4">
              <div className="text-amber-300">You need to sign in first.</div>
              <Link className="btn-pill-brand inline-flex" href={loginRedirect}>Login to continue</Link>
            </div>
          ) : !isModerator() ? (
            <div className="text-red-400">Your account does not have moderator permissions.</div>
          ) : (
            <div className="space-y-4">
              <button
                onClick={submitAction}
                disabled={submitting}
                className="btn-pill-brand disabled:opacity-60 disabled:cursor-not-allowed"
              >
                {submitting ? 'Applying action...' : `Confirm ${action}`}
              </button>

              {result && (
                <div className={result.ok ? 'text-brand-300' : 'text-red-400'}>{result.message}</div>
              )}

              <div>
                <Link className="btn-pill-ghost inline-flex" href="/admin/testimonials">Open moderation dashboard</Link>
              </div>
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
}
