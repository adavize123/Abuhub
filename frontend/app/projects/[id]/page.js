/**
 * Single Project Page
 * Displays full project case study: challenge, solution, deliverables.
 * Only published projects are reachable here (backend enforces nothing beyond
 * that today — see docs/ASSUMPTIONS.md on authorization gaps still open).
 */

'use client';

import { useParams } from 'next/navigation';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { fetchProjectById } from '@/lib/api/client';
import { toast } from 'react-toastify';

export default function ProjectDetailPage() {
  const params = useParams();
  const [project, setProject] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const getProject = async () => {
      try {
        setIsLoading(true);
        const data = await fetchProjectById(params.id);
        setProject(data);
      } catch (error) {
        console.error('Failed to fetch project:', error);
        toast.error('Failed to load project');
      } finally {
        setIsLoading(false);
      }
    };
    if (params.id) getProject();
  }, [params.id]);

  if (isLoading) {
    return (
      <div className="min-h-screen pt-32 flex items-center justify-center">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1.2, repeat: Infinity, ease: 'linear' }}
          className="w-12 h-12 border-4 border-brand-500/20 border-t-brand-400 rounded-full"
        />
      </div>
    );
  }

  if (!project || project.publicationStatus !== 'published') {
    return (
      <div className="min-h-screen pt-32 px-4">
        <div className="max-w-3xl mx-auto text-center py-20">
          <h1 className="text-3xl font-bold mb-4 text-white font-poppins">Project Not Found</h1>
          <p className="text-cream-100/60 mb-8">This project doesn&apos;t exist or isn&apos;t published yet.</p>
          <Link href="/projects" className="btn-pill-brand">
            Back to Projects
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-28 sm:pt-32">
      {project.coverImageUrl && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6 }}
          className="relative h-72 md:h-[26rem] overflow-hidden mx-3 sm:mx-6 rounded-[1.75rem] sm:rounded-[2.5rem]"
        >
          <img src={project.coverImageUrl} alt={project.title} className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-ink-950 via-transparent to-transparent" />
        </motion.div>
      )}

      <article className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }} className="mb-8">
          <div className="flex flex-wrap gap-2 mb-4">
            {project.services?.map((ps) => (
              <span key={ps.serviceId} className="badge-studio">
                {ps.service?.serviceName}
              </span>
            ))}
          </div>
          <h1 className="text-4xl md:text-5xl font-bold font-poppins mt-4 mb-4 text-white">{project.title}</h1>
          <p className="text-cream-100/70 text-lg leading-relaxed">{project.summary}</p>
        </motion.div>

        <div className="studio-divider my-8" />

        {project.challenge && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="mb-10"
          >
            <h2 className="text-xl font-bold font-poppins text-white mb-3">The Challenge</h2>
            <p className="text-cream-100/70 leading-relaxed">{project.challenge}</p>
          </motion.div>
        )}

        {project.solution && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="mb-10"
          >
            <h2 className="text-xl font-bold font-poppins text-white mb-3">The Solution</h2>
            <p className="text-cream-100/70 leading-relaxed">{project.solution}</p>
          </motion.div>
        )}

        {project.deliverables && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="mb-10"
          >
            <h2 className="text-xl font-bold font-poppins text-white mb-3">Deliverables</h2>
            <p className="text-cream-100/70 leading-relaxed">{project.deliverables}</p>
          </motion.div>
        )}

        {project.verifiedOutcomes && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="card-studio p-6 mb-10"
          >
            <h2 className="text-sm font-bold uppercase tracking-wider text-brand-400 mb-3">
              Verified Outcome
            </h2>
            <p className="text-cream-100/80 leading-relaxed">{project.verifiedOutcomes}</p>
          </motion.div>
        )}

        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.6, delay: 0.5 }}>
          <Link href="/projects" className="btn-pill-ghost inline-flex">
            ← Back to Projects
          </Link>
        </motion.div>
      </article>
    </div>
  );
}
