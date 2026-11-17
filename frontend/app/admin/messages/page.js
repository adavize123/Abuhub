/**
 * Admin Messages Management Page
 * View and manage contact form submissions
 */

'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import ProtectedRoute from '@/components/ProtectedRoute';
import AdminTabs from '@/components/AdminTabs';
import { useAuth } from '@/context/AuthContext';
import { useScrollAnimation } from '@/lib/hooks/useScrollAnimation';

function AdminMessagesContent() {
  const [ref, isVisible] = useScrollAnimation({ threshold: 0.3 });
  const [messages, setMessages] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedMessage, setSelectedMessage] = useState(null);
  const [filter, setFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    // TODO: Fetch messages from API
    // Mock data
    const mockMessages = [
      {
        id: '1',
        name: 'John Doe',
        email: 'john@example.com',
        subject: 'Website Inquiry',
        message: 'I am interested in your web development services.',
        status: 'new',
        createdAt: new Date('2025-05-07'),
      },
      {
        id: '2',
        name: 'Jane Smith',
        email: 'jane@example.com',
        subject: 'Partnership Proposal',
        message: 'Would like to discuss a potential partnership.',
        status: 'read',
        createdAt: new Date('2025-05-06'),
      },
      {
        id: '3',
        name: 'Bob Wilson',
        email: 'bob@example.com',
        subject: 'App Development',
        message: 'Need help with mobile app development.',
        status: 'replied',
        createdAt: new Date('2025-05-05'),
      },
    ];
    setMessages(mockMessages);
    setIsLoading(false);
  }, []);

  const handleMarkAsRead = (messageId) => {
    setMessages(
      messages.map((m) =>
        m.id === messageId ? { ...m, status: 'read' } : m
      )
    );
  };

  const handleMarkAsReplied = (messageId) => {
    setMessages(
      messages.map((m) =>
        m.id === messageId ? { ...m, status: 'replied' } : m
      )
    );
  };

  const handleDeleteMessage = (messageId) => {
    if (!confirm('Delete this message?')) return;
    setMessages(messages.filter((m) => m.id !== messageId));
    setSelectedMessage(null);
  };

  const filteredMessages = messages
    .filter((m) => (filter === 'all' ? true : m.status === filter))
    .filter((m) =>
      searchTerm === ''
        ? true
        : m.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          m.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
          m.subject.toLowerCase().includes(searchTerm.toLowerCase())
    );

  const getStatusColor = (status) => {
    switch (status) {
      case 'new':
        return 'bg-amber-500/15 text-amber-300 border border-amber-400/30';
      case 'read':
        return 'bg-white/10 text-cream-100/70 border border-white/15';
      case 'replied':
        return 'bg-brand-500/15 text-brand-300 border border-brand-400/30';
      default:
        return 'bg-white/10 text-white border border-white/15';
    }
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.08, delayChildren: 0.1 },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 16 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.4 } },
  };

  return (
    <div ref={ref} className="min-h-screen pt-24 pb-12">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <AdminTabs />

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <span className="eyebrow-studio">Inbox</span>
          <h1 className="text-4xl font-bold font-poppins mt-3 mb-2 text-white">
            Messages
          </h1>
          <p className="text-cream-100/60">
            View and manage contact form submissions
          </p>
        </motion.div>

        {/* Filters and Search */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="card-studio p-6 mb-8"
        >
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Search */}
            <input
              type="text"
              placeholder="Search by name, email, or subject..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="col-span-1 md:col-span-2 input-studio"
            />

            {/* Filter */}
            <select
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              className="input-studio"
            >
              <option value="all" className="bg-ink-900">All Messages</option>
              <option value="new" className="bg-ink-900">New</option>
              <option value="read" className="bg-ink-900">Read</option>
              <option value="replied" className="bg-ink-900">Replied</option>
            </select>
          </div>
        </motion.div>

        {/* Messages Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Messages List */}
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="lg:col-span-1 space-y-4"
          >
            <h2 className="text-xl font-bold text-white font-poppins mb-4">
              Messages ({filteredMessages.length})
            </h2>

            {isLoading ? (
              <div className="space-y-3">
                {[...Array(3)].map((_, i) => (
                  <div key={i} className="h-20 bg-white/5 rounded-2xl animate-pulse" />
                ))}
              </div>
            ) : filteredMessages.length === 0 ? (
              <div className="card-studio text-center py-8">
                <p className="text-cream-100/50">No messages found</p>
              </div>
            ) : (
              <div className="space-y-2">
                {filteredMessages.map((msg) => (
                  <motion.button
                    key={msg.id}
                    variants={itemVariants}
                    onClick={() => setSelectedMessage(msg)}
                    className={`w-full text-left card-studio p-4 transition-all duration-300 ${
                      selectedMessage?.id === msg.id
                        ? 'border-brand-400/50 bg-white/5'
                        : 'hover:bg-white/5'
                    }`}
                  >
                    <div className="flex items-start justify-between mb-2 gap-2">
                      <h3 className="font-semibold text-white truncate flex-1">
                        {msg.name}
                      </h3>
                      <span
                        className={`px-2.5 py-1 rounded-full text-xs font-semibold whitespace-nowrap ${getStatusColor(
                          msg.status
                        )}`}
                      >
                        {msg.status}
                      </span>
                    </div>
                    <p className="text-cream-100/60 text-sm truncate mb-1">
                      {msg.subject}
                    </p>
                    <p className="text-cream-100/40 text-xs">
                      {new Date(msg.createdAt).toLocaleDateString()}
                    </p>
                  </motion.button>
                ))}
              </div>
            )}
          </motion.div>

          {/* Message Detail */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="lg:col-span-2"
          >
            <AnimatePresence mode="wait">
              {selectedMessage ? (
                <motion.div
                  key={selectedMessage.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  className="card-studio p-8"
                >
                  {/* Header */}
                  <div className="mb-6 pb-6 border-b border-white/10">
                    <h2 className="text-2xl font-bold text-white mb-2 font-poppins">
                      {selectedMessage.subject}
                    </h2>
                    <div className="flex items-center justify-between flex-wrap gap-3">
                      <div>
                        <p className="text-cream-100/50 text-sm">From:</p>
                        <p className="text-white font-semibold">
                          {selectedMessage.name}
                        </p>
                        <a
                          href={`mailto:${selectedMessage.email}`}
                          className="text-brand-400 hover:text-brand-300 hover:underline text-sm transition-colors"
                        >
                          {selectedMessage.email}
                        </a>
                      </div>
                      <span
                        className={`px-4 py-2 rounded-full font-semibold text-sm ${getStatusColor(
                          selectedMessage.status
                        )}`}
                      >
                        {selectedMessage.status}
                      </span>
                    </div>
                    <p className="text-cream-100/40 text-xs mt-4">
                      {new Date(selectedMessage.createdAt).toLocaleString()}
                    </p>
                  </div>

                  {/* Message Body */}
                  <div className="mb-8">
                    <p className="text-cream-100/80 whitespace-pre-wrap leading-relaxed">
                      {selectedMessage.message}
                    </p>
                  </div>

                  {/* Actions */}
                  <div className="flex gap-3 flex-wrap items-center">
                    {selectedMessage.status !== 'read' && (
                      <button
                        onClick={() => handleMarkAsRead(selectedMessage.id)}
                        className="btn-pill-ghost !px-5 !py-2 text-sm"
                      >
                        Mark as Read
                      </button>
                    )}

                    {selectedMessage.status !== 'replied' && (
                      <button
                        onClick={() => handleMarkAsReplied(selectedMessage.id)}
                        className="btn-pill-brand !px-5 !py-2 text-sm"
                      >
                        Mark as Replied
                      </button>
                    )}

                    <a
                      href={`mailto:${selectedMessage.email}`}
                      className="btn-pill-outline !px-5 !py-2 text-sm !text-cream-100 !border-white/20 hover:!bg-white/10 hover:!text-white"
                    >
                      Reply via Email
                    </a>

                    <button
                      onClick={() => handleDeleteMessage(selectedMessage.id)}
                      className="ml-auto px-5 py-2 rounded-full bg-red-500/10 text-red-400 border border-red-500/30 hover:bg-red-500/20 transition-all font-semibold text-sm"
                    >
                      Delete
                    </button>
                  </div>
                </motion.div>
              ) : (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="card-studio p-8 flex items-center justify-center h-96"
                >
                  <p className="text-cream-100/50 text-center">
                    Select a message to view details
                  </p>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        </div>
      </div>
    </div>
  );
}

export default function AdminMessagesPage() {
  const { isLoading, isAdmin } = useAuth();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <motion.div
          animate={{ opacity: [0.5, 1, 0.5] }}
          transition={{ duration: 1.5, repeat: Infinity }}
        >
          <p className="text-white text-lg">Loading...</p>
        </motion.div>
      </div>
    );
  }

  if (!isAdmin()) {
    return (
      <ProtectedRoute>
        <div className="min-h-screen flex items-center justify-center pt-28">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center"
          >
            <h1 className="text-4xl font-bold text-red-400 mb-4">Access Denied</h1>
            <p className="text-cream-100/60 mb-8">
              You don't have permission to access this page.
            </p>
            <Link href="/" className="btn-pill-brand inline-flex">
              Go Home
            </Link>
          </motion.div>
        </div>
      </ProtectedRoute>
    );
  }

  return (
    <ProtectedRoute>
      <AdminMessagesContent />
    </ProtectedRoute>
  );
}
