/**
 * useMouseMove Hook
 * Tracks mouse position for interactive effects
 */

import { useEffect, useRef, useState } from 'react';

export const useMouseMove = () => {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [isMouseMoving, setIsMouseMoving] = useState(false);

  useEffect(() => {
    let timeoutId;

    const handleMouseMove = (e) => {
      setMousePosition({
        x: e.clientX,
        y: e.clientY,
      });
      setIsMouseMoving(true);

      // Stop after 1 second of no movement
      clearTimeout(timeoutId);
      timeoutId = setTimeout(() => setIsMouseMoving(false), 1000);
    };

    window.addEventListener('mousemove', handleMouseMove, { passive: true });

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      clearTimeout(timeoutId);
    };
  }, []);

  return { mousePosition, isMouseMoving };
};

export default useMouseMove;
