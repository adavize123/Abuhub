/**
 * useScrollAnimation Hook
 * Triggers animations when elements come into view
 */

import { useEffect, useRef, useState } from 'react';

export const useScrollAnimation = (options = {}) => {
  const ref = useRef(null);
  const [isVisible, setIsVisible] = useState(false);

  const defaultOptions = {
    threshold: 0.1,
    rootMargin: '0px',
    ...options,
  };

  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        setIsVisible(true);
        // Optional: unobserve after first intersection
        // observer.unobserve(entry.target);
      }
    }, defaultOptions);

    if (ref.current) {
      observer.observe(ref.current);
    }

    return () => {
      if (ref.current) {
        observer.unobserve(ref.current);
      }
    };
  }, [defaultOptions]);

  return [ref, isVisible];
};

export default useScrollAnimation;
