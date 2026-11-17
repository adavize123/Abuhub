/**
 * Admin Users Management Page
 * Manage user accounts and roles
 */

'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import ProtectedRoute from '@/components/ProtectedRoute';
import AdminTabs from '@/components/AdminTabs';
import { useAuth } from '@/context/AuthContext';
import { useScrollAnimation } from '@/lib/hooks/useScrollAnimation';

function AdminUsersContent() {
  const [ref, isVisible] = useScrollAnimation({ threshold: 0.3 });
  const [users, setUsers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedUser, setSelectedUser] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [newRole, setNewRole] = useState('user');

  useEffect(() => {
    // TODO: Fetch users from API
    // For now, mock data
    const mockUsers = [
      {
        id: '1',
        email: 'user1@example.com',
        name: 'John Doe',
        role: 'user',
        createdAt: new Date('2025-01-15'),
        isEmailVerified: true,
      },
      {
        id: '2',
        email: 'user2@example.com',
        name: 'Jane Smith',
        role: 'user',
        createdAt: new Date('2025-02-20'),
        isEmailVerified: false,
      },
      {
        id: '3',
        email: 'admin@example.com',
        name: 'Admin User',
        role: 'admin',
        createdAt: new Date('2024-12-01'),
        isEmailVerified: true,
      },
    ];
    setUsers(mockUsers);
    setIsLoading(false);
  }, []);

  const handleChangeRole = async (userId, newRole) => {
    try {
      // TODO: Call API to update user role
      console.log(`Changing user ${userId} role to ${newRole}`);
      setUsers(
        users.map((u) =>
          u.id === userId ? { ...u, role: newRole } : u
        )
      );
      setShowModal(false);
    } catch (error) {
      console.error('Error updating user:', error);
    }
  };

  const handleDeleteUser = async (userId) => {
    if (!confirm('Are you sure you want to delete this user?')) return;

    try {
      // TODO: Call API to delete user
      console.log(`Deleting user ${userId}`);
      setUsers(users.filter((u) => u.id !== userId));
    } catch (error) {
      console.error('Error deleting user:', error);
    }
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.06, delayChildren: 0.1 },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 14 },
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
          <span className="eyebrow-studio">Accounts</span>
          <h1 className="text-4xl font-bold font-poppins mt-3 mb-2 text-white">
            User Management
          </h1>
          <p className="text-cream-100/60">
            Manage user accounts, roles, and permissions
          </p>
        </motion.div>

        {/* Users Table */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="card-studio p-6 overflow-x-auto"
        >
          <h2 className="text-2xl font-bold font-poppins mb-6 text-white">
            All Users ({users.length})
          </h2>

          {isLoading ? (
            <div className="space-y-3">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="h-14 bg-white/5 rounded-xl animate-pulse" />
              ))}
            </div>
          ) : users.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-cream-100/50">No users found</p>
            </div>
          ) : (
            <table className="w-full">
              <thead>
                <tr className="border-b border-white/10">
                  <th className="text-left px-4 py-3 text-cream-100/50 font-semibold text-sm">
                    Name
                  </th>
                  <th className="text-left px-4 py-3 text-cream-100/50 font-semibold text-sm">
                    Email
                  </th>
                  <th className="text-left px-4 py-3 text-cream-100/50 font-semibold text-sm">
                    Role
                  </th>
                  <th className="text-left px-4 py-3 text-cream-100/50 font-semibold text-sm">
                    Status
                  </th>
                  <th className="text-left px-4 py-3 text-cream-100/50 font-semibold text-sm">
                    Joined
                  </th>
                  <th className="text-left px-4 py-3 text-cream-100/50 font-semibold text-sm">
                    Actions
                  </th>
                </tr>
              </thead>
              <motion.tbody variants={containerVariants} initial="hidden" animate="visible">
                {users.map((user) => (
                  <motion.tr
                    key={user.id}
                    variants={itemVariants}
                    layout
                    className="border-b border-white/5 hover:bg-white/5 transition-all"
                  >
                    <td className="px-4 py-4 text-white font-semibold">
                      {user.name}
                    </td>
                    <td className="px-4 py-4 text-cream-100/70">{user.email}</td>
                    <td className="px-4 py-4">
                      <span
                        className={`px-2.5 py-1 rounded-full text-xs font-semibold ${
                          String(user.role || '').toLowerCase() === 'admin'
                            ? 'bg-brand-500/15 text-brand-300 border border-brand-400/30'
                            : 'bg-white/10 text-cream-100/70 border border-white/15'
                        }`}
                      >
                        {user.role}
                      </span>
                    </td>
                    <td className="px-4 py-4">
                      <span
                        className={`px-2.5 py-1 rounded-full text-xs font-semibold ${
                          user.isEmailVerified
                            ? 'bg-brand-500/15 text-brand-300 border border-brand-400/30'
                            : 'bg-amber-500/15 text-amber-300 border border-amber-400/30'
                        }`}
                      >
                        {user.isEmailVerified ? 'Verified' : 'Unverified'}
                      </span>
                    </td>
                    <td className="px-4 py-4 text-cream-100/50 text-sm">
                      {new Date(user.createdAt).toLocaleDateString()}
                    </td>
                    <td className="px-4 py-4">
                      <div className="flex gap-2">
                        <button
                          onClick={() => {
                            setSelectedUser(user);
                            setNewRole(user.role);
                            setShowModal(true);
                          }}
                          className="px-3 py-1.5 rounded-full bg-brand-500/15 text-brand-300 border border-brand-400/30 hover:bg-brand-500/25 transition-all text-sm font-semibold"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDeleteUser(user.id)}
                          className="px-3 py-1.5 rounded-full bg-red-500/10 text-red-400 border border-red-500/30 hover:bg-red-500/20 transition-all text-sm font-semibold"
                        >
                          Delete
                        </button>
                      </div>
                    </td>
                  </motion.tr>
                ))}
              </motion.tbody>
            </table>
          )}
        </motion.div>

        {/* Edit Role Modal */}
        <AnimatePresence>
          {showModal && selectedUser && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-ink-950/70 backdrop-blur-sm flex items-center justify-center z-50 p-4"
              onClick={() => setShowModal(false)}
            >
              <motion.div
                initial={{ scale: 0.95, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.95, opacity: 0 }}
                onClick={(e) => e.stopPropagation()}
                className="card-studio p-8 max-w-md w-full"
              >
                <h2 className="text-2xl font-bold text-white mb-4 font-poppins">
                  Change User Role
                </h2>
                <p className="text-cream-100/60 mb-6">
                  Changing role for: <span className="text-white">{selectedUser.name}</span>
                </p>

                <div className="mb-6">
                  <label className="label-studio">
                    New Role
                  </label>
                  <select
                    value={newRole}
                    onChange={(e) => setNewRole(e.target.value)}
                    className="input-studio"
                  >
                    <option value="user" className="bg-ink-900">User</option>
                    <option value="admin" className="bg-ink-900">Admin</option>
                  </select>
                </div>

                <div className="flex gap-4">
                  <button
                    onClick={() =>
                      handleChangeRole(selectedUser.id, newRole)
                    }
                    className="flex-1 btn-pill-brand"
                  >
                    Update Role
                  </button>
                  <button
                    onClick={() => setShowModal(false)}
                    className="flex-1 btn-pill-ghost"
                  >
                    Cancel
                  </button>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

export default function AdminUsersPage() {
  const { user, isLoading, isAdmin } = useAuth();

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
      <AdminUsersContent />
    </ProtectedRoute>
  );
}
