import { useRef, useEffect, useCallback } from 'react';

/**
 * Custom hook for animation frame loop
 * Provides a smooth animation loop using requestAnimationFrame
 * 
 * @param {Function} callback - Function to call on each frame
 * @param {boolean} isActive - Whether the animation should be running
 */
export function useAnimationFrame(callback, isActive = true) {
  const requestRef = useRef(null);
  const previousTimeRef = useRef(null);
  const callbackRef = useRef(callback);

  // Update callback ref when it changes
  useEffect(() => {
    callbackRef.current = callback;
  }, [callback]);

  const animate = useCallback((time) => {
    if (previousTimeRef.current !== null) {
      const deltaTime = time - previousTimeRef.current;
      callbackRef.current(deltaTime);
    }
    previousTimeRef.current = time;
    requestRef.current = requestAnimationFrame(animate);
  }, []);

  useEffect(() => {
    if (isActive) {
      requestRef.current = requestAnimationFrame(animate);
    }
    
    return () => {
      if (requestRef.current) {
        cancelAnimationFrame(requestRef.current);
      }
    };
  }, [isActive, animate]);
}

export default useAnimationFrame;
