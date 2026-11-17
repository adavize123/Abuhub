/**
 * About Page
 * Company overview — mission, values and approach.
 * Reuses the existing AboutSection/ProcessSection content (no new facts invented,
 * per ABUHUB_WEBSITE_ARCHITECTURE_CLAUDE_CODE.md rule 7).
 */

import AboutSection from '@/components/AboutSection';
import ProcessSection from '@/components/ProcessSection';
import AboutCTA from '@/components/AboutCTA';

export const metadata = {
  title: 'About Abuhub — Build Smarter. Grow Together.',
  description:
    'Abuhub is a technology, data and innovation hub helping founders and operators turn ambitious ideas into products people actually use.',
};

export default function AboutPage() {
  return (
    <div className="min-h-screen">
      {/* Header */}
      <section className="relative px-3 sm:px-6 pt-20 sm:pt-24">
        <div className="hero-card max-w-7xl mx-auto py-16 sm:py-20 px-6 sm:px-10">
          <div className="grain-overlay" aria-hidden="true" />
          <div className="relative max-w-2xl">
            <span className="badge-studio mb-4 inline-flex">About Abuhub</span>
            <h1 className="text-5xl md:text-6xl font-bold font-poppins mb-4 mt-4 text-white">
              Build Smarter. Grow Together.
            </h1>
            <p className="text-white/70 text-lg">
              We&apos;re an independent technology, data &amp; innovation hub — we design
              and engineer web, mobile and AI products, then stay on as a hands-on growth
              partner for the businesses and organizations we work with.
            </p>
          </div>
        </div>
      </section>

      <AboutSection />
      <ProcessSection />
      <AboutCTA />
    </div>
  );
}
