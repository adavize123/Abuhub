/**
 * Single Service Detail Page
 * (ABUHUB_WEBSITE_ARCHITECTURE_CLAUDE_CODE.md Part B §6: /services/[slug])
 * Uses the Service model's id as the route param — Service has no slug column,
 * matching the simplest safe option (no schema change for a Phase 2 detail page).
 */

'use client';

import { useParams } from 'next/navigation';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { fetchServiceById, fetchProjects } from '@/lib/api/client';
import { getServiceIcon } from '@/lib/serviceIcons';
import { toast } from 'react-toastify';

export default function ServiceDetailPage() {
  const params = useParams();
  const [service, setService] = useState(null);
  const [relatedProjects, setRelatedProjects] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        setIsLoading(true);
        const data = await fetchServiceById(params.id);
        setService(data);
        try {
          const projects = await fetchProjects({ publicationStatus: 'published', serviceId: data.id });
          setRelatedProjects(projects || []);
        } catch {
          setRelatedProjects([]);
        }
      } catch (error) {
        console.error('Failed to fetch service:', error);
        toast.error('Failed to load service');
      } finally {
        setIsLoading(false);
      }
    };
    if (params.id) load();
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

  if (!service) {
    return (
      <div className="min-h-screen pt-32 px-4">
        <div className="max-w-3xl mx-auto text-center py-20">
          <h1 className="text-3xl font-bold mb-4 text-white font-poppins">Service Not Found</h1>
          <Link href="/#services" className="btn-pill-brand">
            Back to Services
          </Link>
        </div>
      </div>
    );
  }

  const ServiceIcon = getServiceIcon(service.serviceName);

  return (
    <div className="min-h-screen pt-28 sm:pt-32 pb-16">
      <section className="relative px-3 sm:px-6">
        <div className="hero-card max-w-5xl mx-auto py-16 sm:py-20 px-6 sm:px-10">
          <div className="grain-overlay" aria-hidden="true" />
          <div className="relative">
            <div className="w-16 h-16 rounded-2xl bg-white/10 border border-white/15 flex items-center justify-center mb-6">
              <ServiceIcon className="w-7 h-7 text-brand-400" strokeWidth={1.75} />
            </div>
            <h1 className="text-4xl md:text-5xl font-bold font-poppins mb-4 text-white">
              {service.serviceName}
            </h1>
            <p className="text-white/80 text-lg leading-relaxed max-w-2xl">{service.description}</p>
          </div>
        </div>
      </section>

      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="card-studio p-8 mb-10 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6"
        >
          <div>
            <p className="text-cream-100/50 text-xs uppercase tracking-wider mb-1">Pricing</p>
            <p className="text-white font-semibold text-lg">{service.pricing || 'Contact for pricing'}</p>
          </div>
          <Link href="/#contact" className="btn-pill-brand inline-flex">
            Enquire About This Service
          </Link>
        </motion.div>

        {relatedProjects.length > 0 && (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
            <h2 className="text-xl font-bold font-poppins text-white mb-5">Related Work</h2>
            <div className="grid sm:grid-cols-2 gap-5">
              {relatedProjects.map((p) => (
                <Link key={p.id} href={`/projects/${p.slug || p.id}`} className="group">
                  <div className="card-studio card-studio-hover p-5">
                    <h3 className="font-semibold text-white group-hover:text-brand-300 transition-colors">
                      {p.title}
                    </h3>
                    <p className="text-cream-100/55 text-sm mt-1 line-clamp-2">{p.summary}</p>
                  </div>
                </Link>
              ))}
            </div>
          </motion.div>
        )}

        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }} className="mt-10">
          <Link href="/#services" className="btn-pill-ghost inline-flex">
            ← Back to Services
          </Link>
        </motion.div>
      </div>
    </div>
  );
}
