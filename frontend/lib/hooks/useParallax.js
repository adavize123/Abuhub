/**
 * useParallax Hook
 * Creates parallax scrolling effect
 */

import { useEffect, useRef, useState } from 'react';

export const useParallax = (speed = 0.5) => {
  const ref = useRef(null);
  const [offset, setOffset] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      if (ref.current) {
        const rect = ref.current.getBoundingClientRect();
        const elementTop = rect.top;
        const windowHeight = window.innerHeight;

        // Calculate parallax offset
        const distance = elementTop - windowHeight;
        setOffset(distance * speed);
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, [speed]);

  return [ref, offset];
};

export default useParallax;
