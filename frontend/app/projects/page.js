/**
 * Projects Listing Page
 * Public projects portfolio — only publicationStatus=published records are shown.
 * No seed/sample projects are invented here (ABUHUB_WEBSITE_ARCHITECTURE_CLAUDE_CODE.md
 * rule 7) — if nothing is published yet, an honest empty state invites contact instead.
 */

'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { fetchProjects } from '@/lib/api/client';
import { useScrollAnimation } from '@/lib/hooks/useScrollAnimation';
import TiltCard from '@/components/TiltCard';

function ProjectCardSkeleton() {
  return (
    <div className="card-studio overflow-hidden animate-pulse">
      <div className="h-48 bg-white/5" />
      <div className="p-6">
        <div className="h-5 bg-white/5 rounded mb-2" />
        <div className="h-5 bg-white/5 rounded w-3/4 mb-4" />
        <div className="space-y-2">
          <div className="h-3 bg-white/5 rounded" />
          <div className="h-3 bg-white/5 rounded w-5/6" />
        </div>
      </div>
    </div>
  );
}

export default function ProjectsPage() {
  const [projects, setProjects] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [ref, isVisible] = useScrollAnimation({ threshold: 0.2 });

  useEffect(() => {
    const getProjects = async () => {
      try {
        setIsLoading(true);
        const data = await fetchProjects({ publicationStatus: 'published' });
        setProjects(data || []);
      } catch (error) {
        console.error('Failed to fetch projects:', error);
        setProjects([]);
      } finally {
        setIsLoading(false);
      }
    };
    getProjects();
  }, []);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.1 } },
  };
  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5, type: 'spring', stiffness: 100 } },
  };

  return (
    <div className="min-h-screen">
      {/* Header */}
      <section className="relative px-3 sm:px-6 pt-20 sm:pt-24">
        <div className="hero-card max-w-7xl mx-auto py-16 sm:py-20 px-6 sm:px-10">
          <div className="grain-overlay" aria-hidden="true" />
          <div className="relative max-w-2xl">
            <span className="badge-studio mb-4 inline-flex">Our Work</span>
            <h1 className="text-5xl md:text-6xl font-bold font-poppins mb-4 mt-4 text-white">
              Projects
            </h1>
            <p className="text-white/70 text-lg">
              A look at what we&apos;ve shipped — real builds, real outcomes, shared with
              client permission.
            </p>
          </div>
        </div>
      </section>

      <div ref={ref} className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[...Array(3)].map((_, i) => (
              <ProjectCardSkeleton key={i} />
            ))}
          </div>
        ) : projects.length === 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="card-studio max-w-xl mx-auto p-10 text-center"
          >
            <p className="text-4xl mb-4">🚧</p>
            <h2 className="text-2xl font-bold font-poppins text-white mb-3">
              Our case studies are coming soon
            </h2>
            <p className="text-cream-100/60 mb-8 leading-relaxed">
              We&apos;re putting together write-ups of recent work. In the meantime, tell
              us about your project and we&apos;ll show you examples relevant to it directly.
            </p>
            <Link href="/#contact" className="btn-pill-brand inline-flex">
              Start a Conversation
            </Link>
          </motion.div>
        ) : (
          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView={isVisible ? 'visible' : 'hidden'}
            viewport={{ once: true, amount: 0.2 }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
          >
            {projects.map((project) => (
              <motion.div key={project.id} variants={itemVariants}>
                <Link href={`/projects/${project.slug || project.id}`}>
                  <TiltCard intensity={5}>
                    <div className="group card-studio card-studio-hover overflow-hidden h-full flex flex-col">
                      {project.coverImageUrl ? (
                        <div className="relative h-48 overflow-hidden bg-white/5">
                          <motion.img
                            src={project.coverImageUrl}
                            alt={project.title}
                            className="w-full h-full object-cover"
                            whileHover={{ scale: 1.08 }}
                            transition={{ duration: 0.4 }}
                          />
                        </div>
                      ) : (
                        <div className="h-48 bg-gradient-to-br from-brand-900/60 to-ink-800 flex items-center justify-center text-4xl">
                          🗂️
                        </div>
                      )}

                      <div className="p-6 flex flex-col justify-between flex-1">
                        <div>
                          {project.services?.length > 0 && (
                            <span className="badge-studio mb-3 !py-1 !text-xs">
                              {project.services[0].service?.serviceName}
                            </span>
                          )}
                          <h3 className="text-xl font-bold font-poppins mt-3 mb-2 text-white group-hover:text-brand-300 transition-colors duration-300 line-clamp-2">
                            {project.title}
                          </h3>
                          <p className="text-cream-100/55 text-sm mb-4 line-clamp-3">
                            {project.summary}
                          </p>
                        </div>
                        <div className="mt-4 text-brand-400 font-semibold flex items-center gap-2 text-sm">
                          View Project <span aria-hidden="true">→</span>
                        </div>
                      </div>
                    </div>
                  </TiltCard>
                </Link>
              </motion.div>
            ))}
          </motion.div>
        )}
      </div>
    </div>
  );
}
