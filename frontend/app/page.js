/**
 * Home Page
 * Main landing page — hero, services, story, process, proof and contact
 */

import HeroSection from '../components/HeroSection';
import ImpactStrip from '../components/ImpactStrip';
import ServicesSection from '../components/ServicesSection';
import AboutSection from '../components/AboutSection';
import ProcessSection from '../components/ProcessSection';
import Testimonials from '../components/Testimonials';
import StatsCTASection from '../components/StatsCTASection';
import ContactSection from '../components/ContactSection';

export const metadata = {
  title: 'Abuhub — Build Smarter. Grow Together.',
  description:
    'Abuhub is a technology, data and innovation hub helping ambitious businesses ship modern web & mobile products, unlock AI, and scale with confidence.',
};

export default function HomePage() {
  return (
    <>
      <HeroSection />
      <ImpactStrip />
      <ServicesSection />
      <AboutSection />
      <ProcessSection />
      <Testimonials />
      <StatsCTASection />
      <ContactSection />
    </>
  );
}
