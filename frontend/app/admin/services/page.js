/**
 * Admin Services Management Page
 * Create, read, update, and delete services
 */

'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useForm } from 'react-hook-form';
import Link from 'next/link';
import ProtectedRoute from '@/components/ProtectedRoute';
import AdminTabs from '@/components/AdminTabs';
import TiltCard from '@/components/TiltCard';
import { useAuth } from '@/context/AuthContext';
import { useScrollAnimation } from '@/lib/hooks/useScrollAnimation';

function AdminServicesContent() {
  const [ref, isVisible] = useScrollAnimation({ threshold: 0.3 });
  const [services, setServices] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [editingId, setEditingId] = useState(null);
  const [showForm, setShowForm] = useState(false);

  const { register, handleSubmit, reset, setValue } = useForm({
    defaultValues: {
      title: '',
      description: '',
      icon: '💼',
      features: '',
    },
  });

  useEffect(() => {
    // TODO: Fetch services from API
    const mockServices = [
      {
        id: '1',
        title: 'Web Development',
        description: 'Custom website and web application development',
        icon: '💻',
        features: ['Responsive Design', 'SEO Optimized', 'Fast Performance'],
      },
      {
        id: '2',
        title: 'App Development',
        description: 'Native and cross-platform mobile applications',
        icon: '📱',
        features: ['iOS & Android', 'User Friendly', 'Secure'],
      },
      {
        id: '3',
        title: 'AI Training',
        description: 'Machine learning and AI model development',
        icon: '🤖',
        features: ['Data Analysis', 'Model Training', 'API Integration'],
      },
    ];
    setServices(mockServices);
    setIsLoading(false);
  }, []);

  const onSubmit = async (data) => {
    try {
      const features = data.features
        .split(',')
        .map((f) => f.trim())
        .filter((f) => f.length > 0);

      if (editingId) {
        // TODO: Call API to update service
        setServices(
          services.map((s) =>
            s.id === editingId
              ? {
                  ...s,
                  title: data.title,
                  description: data.description,
                  icon: data.icon,
                  features,
                }
              : s
          )
        );
      } else {
        // TODO: Call API to create service
        const newService = {
          id: Date.now().toString(),
          title: data.title,
          description: data.description,
          icon: data.icon,
          features,
        };
        setServices([...services, newService]);
      }

      reset();
      setShowForm(false);
      setEditingId(null);
    } catch (error) {
      console.error('Error saving service:', error);
    }
  };

  const handleEdit = (service) => {
    setEditingId(service.id);
    setValue('title', service.title);
    setValue('description', service.description);
    setValue('icon', service.icon);
    setValue('features', service.features.join(', '));
    setShowForm(true);
  };

  const handleDelete = async (serviceId) => {
    if (!confirm('Delete this service?')) return;

    try {
      // TODO: Call API to delete service
      setServices(services.filter((s) => s.id !== serviceId));
    } catch (error) {
      console.error('Error deleting service:', error);
    }
  };

  const handleCancel = () => {
    setShowForm(false);
    setEditingId(null);
    reset();
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
          className="mb-8 flex flex-col sm:flex-row justify-between sm:items-center gap-4"
        >
          <div>
            <span className="eyebrow-studio">Offerings</span>
            <h1 className="text-4xl font-bold font-poppins mt-3 mb-2 text-white">
              Services Management
            </h1>
            <p className="text-cream-100/60">Create and manage service offerings</p>
          </div>
          {!showForm && (
            <button onClick={() => setShowForm(true)} className="btn-pill-brand self-start sm:self-auto">
              + New Service
            </button>
          )}
        </motion.div>

        {/* Form Section */}
        <AnimatePresence>
          {showForm && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="card-studio p-6 sm:p-8 mb-12 overflow-hidden"
            >
              <h2 className="text-2xl font-bold font-poppins mb-6 text-white">
                {editingId ? 'Edit Service' : 'Create New Service'}
              </h2>

              <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                {/* Title */}
                <div>
                  <label className="label-studio">
                    Title *
                  </label>
                  <input
                    type="text"
                    {...register('title', { required: 'Title is required' })}
                    placeholder="Service title"
                    className="input-studio"
                  />
                </div>

                {/* Description */}
                <div>
                  <label className="label-studio">
                    Description *
                  </label>
                  <textarea
                    {...register('description', {
                      required: 'Description is required',
                    })}
                    placeholder="Service description"
                    rows={4}
                    className="input-studio resize-none"
                  />
                </div>

                {/* Icon */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="label-studio">Icon</label>
                    <input
                      type="text"
                      {...register('icon')}
                      placeholder="Service icon emoji"
                      className="input-studio"
                    />
                  </div>
                </div>

                {/* Features */}
                <div>
                  <label className="label-studio">
                    Features (comma-separated)
                  </label>
                  <textarea
                    {...register('features')}
                    placeholder="Feature 1, Feature 2, Feature 3"
                    rows={3}
                    className="input-studio resize-none"
                  />
                </div>

                {/* Buttons */}
                <div className="flex gap-4">
                  <button type="submit" className="btn-pill-brand flex-1">
                    {editingId ? 'Update Service' : 'Create Service'}
                  </button>
                  <button
                    type="button"
                    onClick={handleCancel}
                    className="btn-pill-ghost flex-1"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Services Grid */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <h2 className="text-2xl font-bold font-poppins mb-6 text-white">
            All Services ({services.length})
          </h2>

          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="card-studio p-6 h-48 animate-pulse" />
              ))}
            </div>
          ) : services.length === 0 ? (
            <div className="card-studio text-center py-12">
              <p className="text-cream-100/50">No services yet. Create your first service!</p>
            </div>
          ) : (
            <motion.div
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
            >
              {services.map((service) => (
                <motion.div key={service.id} variants={itemVariants} layout>
                  <TiltCard intensity={5}>
                    <div className="card-studio card-studio-hover p-6 group h-full">
                      <div className="flex items-start justify-between mb-4">
                        <div className="text-4xl">{service.icon}</div>
                        <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                          <button
                            onClick={() => handleEdit(service)}
                            className="px-3 py-1 rounded-full bg-brand-500/15 text-brand-300 border border-brand-400/30 hover:bg-brand-500/25 transition-all text-sm font-semibold"
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => handleDelete(service.id)}
                            className="px-3 py-1 rounded-full bg-red-500/10 text-red-400 border border-red-500/30 hover:bg-red-500/20 transition-all text-sm font-semibold"
                          >
                            Delete
                          </button>
                        </div>
                      </div>

                      <h3 className="text-lg font-semibold text-white mb-2">
                        {service.title}
                      </h3>
                      <p className="text-cream-100/60 text-sm mb-4 line-clamp-2">
                        {service.description}
                      </p>

                      {service.features && service.features.length > 0 && (
                        <div className="space-y-2">
                          {service.features.map((feature, idx) => (
                            <div key={idx} className="flex items-center gap-2">
                              <span className="text-brand-400">✓</span>
                              <span className="text-cream-100/70 text-sm">{feature}</span>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </TiltCard>
                </motion.div>
              ))}
            </motion.div>
          )}
        </motion.div>
      </div>
    </div>
  );
}

export default function AdminServicesPage() {
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
      <AdminServicesContent />
    </ProtectedRoute>
  );
}
