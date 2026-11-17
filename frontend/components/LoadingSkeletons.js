/**
 * Loading Skeleton Components
 * Shimmer loading effects for content placeholders
 */

'use client';

export function BlogPostSkeleton() {
  return (
    <div className="glassmorphism rounded-xl overflow-hidden h-full">
      {/* Image Skeleton */}
      <div className="h-48 bg-dark-surface/50 loading-shimmer" />

      {/* Content */}
      <div className="p-6">
        {/* Category */}
        <div className="h-6 w-24 bg-dark-surface/50 loading-shimmer rounded-full mb-4" />

        {/* Title */}
        <div className="h-6 bg-dark-surface/50 loading-shimmer rounded mb-2" />
        <div className="h-6 bg-dark-surface/50 loading-shimmer rounded w-3/4 mb-4" />

        {/* Excerpt */}
        <div className="space-y-2 mb-4">
          <div className="h-4 bg-dark-surface/50 loading-shimmer rounded" />
          <div className="h-4 bg-dark-surface/50 loading-shimmer rounded w-5/6" />
        </div>

        {/* Meta */}
        <div className="h-4 bg-dark-surface/50 loading-shimmer rounded w-1/3" />
      </div>
    </div>
  );
}

export function ContactFormSkeleton() {
  return (
    <div className="space-y-6">
      {/* Field 1 */}
      <div>
        <div className="h-4 bg-dark-surface/50 loading-shimmer rounded w-20 mb-2" />
        <div className="h-10 bg-dark-surface/50 loading-shimmer rounded" />
      </div>

      {/* Field 2 */}
      <div>
        <div className="h-4 bg-dark-surface/50 loading-shimmer rounded w-20 mb-2" />
        <div className="h-10 bg-dark-surface/50 loading-shimmer rounded" />
      </div>

      {/* Field 3 */}
      <div>
        <div className="h-4 bg-dark-surface/50 loading-shimmer rounded w-20 mb-2" />
        <div className="h-32 bg-dark-surface/50 loading-shimmer rounded" />
      </div>

      {/* Button */}
      <div className="h-10 bg-accent-cyan/20 loading-shimmer rounded" />
    </div>
  );
}

export function ServiceCardSkeleton() {
  return (
    <div className="glassmorphism p-8 rounded-xl">
      {/* Icon */}
      <div className="text-5xl mb-4">
        <div className="h-12 w-12 bg-dark-surface/50 loading-shimmer rounded" />
      </div>

      {/* Title */}
      <div className="h-6 bg-dark-surface/50 loading-shimmer rounded mb-3" />

      {/* Description */}
      <div className="space-y-2 mb-4">
        <div className="h-4 bg-dark-surface/50 loading-shimmer rounded" />
        <div className="h-4 bg-dark-surface/50 loading-shimmer rounded w-5/6" />
      </div>

      {/* Footer */}
      <div className="h-4 bg-dark-surface/50 loading-shimmer rounded w-1/3" />
    </div>
  );
}

export default { BlogPostSkeleton, ContactFormSkeleton, ServiceCardSkeleton };
