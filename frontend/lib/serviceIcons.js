/**
 * Service Icon Resolver
 * Maps a service name to a real Lucide icon component instead of rendering
 * the emoji stored in Service.icon directly — emoji render inconsistently
 * across platforms and read as a generic/AI-placeholder choice. The admin
 * can still store whatever emoji it likes in the DB (unchanged), this is a
 * presentation-layer override for the public-facing cards only.
 */

import { Globe, Smartphone, Bot, BarChart3, Briefcase, Palette, Sparkles } from 'lucide-react';

const ICON_MAP = {
  'web development': Globe,
  'app development': Smartphone,
  'mobile app development': Smartphone,
  'ai training': Bot,
  'ai training & integration': Bot,
  'ai & automation': Bot,
  'data analysis': BarChart3,
  'data analytics': BarChart3,
  'business support': Briefcase,
  'ui/ux design': Palette,
  'ui & ux design': Palette,
};

/**
 * @param {string} serviceName
 * @returns {React.ComponentType} a Lucide icon component
 */
export function getServiceIcon(serviceName) {
  const key = (serviceName || '').trim().toLowerCase();
  return ICON_MAP[key] || Sparkles;
}

export default getServiceIcon;
