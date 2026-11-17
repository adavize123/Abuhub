/**
 * Admin Projects Management Page
 * Real CRUD against /api/projects (unlike some sibling admin pages, this one
 * is wired to the live API from the start — no mock data).
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
import { fetchProjects, createProject, updateProject, deleteProject, fetchServices } from '@/lib/api/client';
import { toast } from 'react-toastify';

const STATUS_BADGE = {
  published: 'bg-brand-500/15 text-brand-300 border-brand-400/30',
  draft: 'bg-amber-500/15 text-amber-300 border-amber-400/30',
  archived: 'bg-white/10 text-cream-100/60 border-white/15',
};

function AdminProjectsContent() {
  const [ref] = useScrollAnimation({ threshold: 0.3 });
  const [projects, setProjects] = useState([]);
  const [services, setServices] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [editingId, setEditingId] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const { register, handleSubmit, reset, setValue, watch } = useForm({
    defaultValues: {
      title: '',
      summary: '',
      challenge: '',
      solution: '',
      deliverables: '',
      coverImageUrl: '',
      projectStatus: 'concept',
      publicationStatus: 'draft',
      isFeatured: false,
      serviceIds: [],
    },
  });

  const loadProjects = async () => {
    try {
      setIsLoading(true);
      const data = await fetchProjects({ publicationStatus: 'all' });
      setProjects(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error('Error loading projects:', error);
      toast.error('Failed to load projects');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadProjects();
    fetchServices({ isActive: 'all' })
      .then((data) => setServices(data || []))
      .catch(() => setServices([]));
  }, []);

  const onSubmit = async (data) => {
    try {
      setIsSaving(true);
      const payload = {
        ...data,
        isFeatured: !!data.isFeatured,
        serviceIds: Array.isArray(data.serviceIds) ? data.serviceIds : [data.serviceIds].filter(Boolean),
      };

      if (editingId) {
        await updateProject(editingId, payload);
        toast.success('Project updated');
      } else {
        await createProject(payload);
        toast.success('Project created');
      }

      reset();
      setShowForm(false);
      setEditingId(null);
      await loadProjects();
    } catch (error) {
      console.error('Error saving project:', error);
      toast.error(error.response?.data?.message || 'Failed to save project');
    } finally {
      setIsSaving(false);
    }
  };

  const handleEdit = (project) => {
    setEditingId(project.id);
    setValue('title', project.title);
    setValue('summary', project.summary);
    setValue('challenge', project.challenge || '');
    setValue('solution', project.solution || '');
    setValue('deliverables', project.deliverables || '');
    setValue('coverImageUrl', project.coverImageUrl || '');
    setValue('projectStatus', project.projectStatus);
    setValue('publicationStatus', project.publicationStatus);
    setValue('isFeatured', project.isFeatured);
    setValue('serviceIds', project.services?.map((ps) => ps.serviceId) || []);
    setShowForm(true);
  };

  const handleDelete = async (projectId) => {
    if (!confirm('Delete this project? This cannot be undone.')) return;
    try {
      await deleteProject(projectId);
      toast.success('Project deleted');
      await loadProjects();
    } catch (error) {
      console.error('Error deleting project:', error);
      toast.error('Failed to delete project');
    }
  };

  const handleCancel = () => {
    setShowForm(false);
    setEditingId(null);
    reset();
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.08, delayChildren: 0.1 } },
  };
  const itemVariants = {
    hidden: { opacity: 0, y: 16 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.4 } },
  };

  return (
    <div ref={ref} className="min-h-screen pt-24 pb-12">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <AdminTabs />

        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8 flex flex-col sm:flex-row justify-between sm:items-center gap-4"
        >
          <div>
            <span className="eyebrow-studio">Portfolio</span>
            <h1 className="text-4xl font-bold font-poppins mt-3 mb-2 text-white">Projects Management</h1>
            <p className="text-cream-100/60">Create and publish case studies for the public /projects page</p>
          </div>
          {!showForm && (
            <button onClick={() => setShowForm(true)} className="btn-pill-brand self-start sm:self-auto">
              + New Project
            </button>
          )}
        </motion.div>

        <AnimatePresence>
          {showForm && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="card-studio p-6 sm:p-8 mb-12 overflow-hidden"
            >
              <h2 className="text-2xl font-bold font-poppins mb-6 text-white">
                {editingId ? 'Edit Project' : 'Create New Project'}
              </h2>

              <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                <div>
                  <label className="label-studio">Title *</label>
                  <input
                    type="text"
                    {...register('title', { required: true })}
                    placeholder="Project title"
                    className="input-studio"
                  />
                </div>

                <div>
                  <label className="label-studio">Summary *</label>
                  <textarea
                    {...register('summary', { required: true })}
                    placeholder="One or two sentences — this is what shows on the projects grid"
                    rows={2}
                    className="input-studio resize-none"
                  />
                </div>

                <div className="grid sm:grid-cols-3 gap-6">
                  <div>
                    <label className="label-studio">Challenge</label>
                    <textarea {...register('challenge')} rows={4} className="input-studio resize-none" />
                  </div>
                  <div>
                    <label className="label-studio">Solution</label>
                    <textarea {...register('solution')} rows={4} className="input-studio resize-none" />
                  </div>
                  <div>
                    <label className="label-studio">Deliverables</label>
                    <textarea {...register('deliverables')} rows={4} className="input-studio resize-none" />
                  </div>
                </div>

                <div>
                  <label className="label-studio">Cover Image URL</label>
                  <input type="text" {...register('coverImageUrl')} placeholder="https://..." className="input-studio" />
                </div>

                <div>
                  <label className="label-studio">Related Services</label>
                  <div className="flex flex-wrap gap-3">
                    {services.map((s) => (
                      <label
                        key={s.id}
                        className="flex items-center gap-2 px-3 py-2 rounded-xl bg-white/5 border border-white/10 cursor-pointer text-sm text-cream-100/80 hover:border-brand-400/40"
                      >
                        <input type="checkbox" value={s.id} {...register('serviceIds')} className="accent-brand-500" />
                        {s.serviceName}
                      </label>
                    ))}
                  </div>
                </div>

                <div className="grid sm:grid-cols-3 gap-6">
                  <div>
                    <label className="label-studio">Project Status</label>
                    <select {...register('projectStatus')} className="input-studio">
                      <option value="concept" className="bg-ink-900">Concept</option>
                      <option value="in_progress" className="bg-ink-900">In Progress</option>
                      <option value="completed" className="bg-ink-900">Completed</option>
                    </select>
                  </div>
                  <div>
                    <label className="label-studio">Publication Status</label>
                    <select {...register('publicationStatus')} className="input-studio">
                      <option value="draft" className="bg-ink-900">Draft</option>
                      <option value="published" className="bg-ink-900">Published</option>
                      <option value="archived" className="bg-ink-900">Archived</option>
                    </select>
                  </div>
                  <div className="flex items-end">
                    <label className="flex items-center gap-2 cursor-pointer text-cream-100/80">
                      <input type="checkbox" {...register('isFeatured')} className="w-4 h-4 accent-brand-500" />
                      Featured
                    </label>
                  </div>
                </div>

                <div className="flex gap-4">
                  <button type="submit" disabled={isSaving} className="btn-pill-brand flex-1 disabled:opacity-50">
                    {isSaving ? 'Saving...' : editingId ? 'Update Project' : 'Create Project'}
                  </button>
                  <button type="button" onClick={handleCancel} className="btn-pill-ghost flex-1">
                    Cancel
                  </button>
                </div>
              </form>
            </motion.div>
          )}
        </AnimatePresence>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <h2 className="text-2xl font-bold font-poppins mb-6 text-white">All Projects ({projects.length})</h2>

          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="card-studio p-6 h-48 animate-pulse" />
              ))}
            </div>
          ) : projects.length === 0 ? (
            <div className="card-studio text-center py-12">
              <p className="text-cream-100/50">No projects yet. Create your first one!</p>
            </div>
          ) : (
            <motion.div
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
            >
              {projects.map((project) => (
                <motion.div key={project.id} variants={itemVariants} layout>
                  <TiltCard intensity={5}>
                    <div className="card-studio card-studio-hover p-6 group h-full flex flex-col">
                      <div className="flex items-start justify-between mb-4 gap-2">
                        <span
                          className={`px-2.5 py-1 rounded-full text-xs font-semibold border ${STATUS_BADGE[project.publicationStatus] || STATUS_BADGE.draft}`}
                        >
                          {project.publicationStatus}
                        </span>
                        <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                          <button
                            onClick={() => handleEdit(project)}
                            className="px-3 py-1 rounded-full bg-brand-500/15 text-brand-300 border border-brand-400/30 hover:bg-brand-500/25 transition-all text-sm font-semibold"
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => handleDelete(project.id)}
                            className="px-3 py-1 rounded-full bg-red-500/10 text-red-400 border border-red-500/30 hover:bg-red-500/20 transition-all text-sm font-semibold"
                          >
                            Delete
                          </button>
                        </div>
                      </div>

                      <h3 className="text-lg font-semibold text-white mb-2">{project.title}</h3>
                      <p className="text-cream-100/60 text-sm mb-4 line-clamp-2 flex-1">{project.summary}</p>

                      <div className="flex items-center justify-between pt-3 border-t border-white/10 text-xs text-cream-100/40">
                        <span>{project.projectStatus.replace('_', ' ')}</span>
                        {project.publicationStatus === 'published' && (
                          <Link href={`/projects/${project.slug}`} className="text-brand-400 hover:text-brand-300">
                            View live →
                          </Link>
                        )}
                      </div>
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

export default function AdminProjectsPage() {
  const { isLoading, isAdmin } = useAuth();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <motion.div animate={{ opacity: [0.5, 1, 0.5] }} transition={{ duration: 1.5, repeat: Infinity }}>
          <p className="text-white text-lg">Loading...</p>
        </motion.div>
      </div>
    );
  }

  if (!isAdmin()) {
    return (
      <ProtectedRoute>
        <div className="min-h-screen flex items-center justify-center pt-28">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center">
            <h1 className="text-4xl font-bold text-red-400 mb-4">Access Denied</h1>
            <p className="text-cream-100/60 mb-8">You don&apos;t have permission to access this page.</p>
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
      <AdminProjectsContent />
    </ProtectedRoute>
  );
}
