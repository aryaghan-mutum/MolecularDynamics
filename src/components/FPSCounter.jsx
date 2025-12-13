/**
 * @fileoverview FPS Counter Component
 * @description Displays real-time frames per second
 * @module components/FPSCounter
 */

import { useState, useEffect, useRef } from 'react';
import './FPSCounter.css';

/**
 * FPS Counter Component
 */
function FPSCounter() {
  const [fps, setFps] = useState(0);
  const [isVisible, setIsVisible] = useState(true);
  const frameCountRef = useRef(0);
  const lastTimeRef = useRef(performance.now());

  useEffect(() => {
    let animationId;

    const updateFPS = () => {
      frameCountRef.current++;
      const now = performance.now();
      const delta = now - lastTimeRef.current;

      if (delta >= 1000) {
        setFps(Math.round((frameCountRef.current * 1000) / delta));
        frameCountRef.current = 0;
        lastTimeRef.current = now;
      }

      animationId = requestAnimationFrame(updateFPS);
    };

    animationId = requestAnimationFrame(updateFPS);
    return () => cancelAnimationFrame(animationId);
  }, []);

  if (!isVisible) return null;

  const fpsColor = fps >= 50 ? '#10b981' : fps >= 30 ? '#f59e0b' : '#ef4444';

  return (
    <div className="fps-counter" onClick={() => setIsVisible(false)} title="Click to hide">
      <span className="fps-value" style={{ color: fpsColor }}>{fps}</span>
      <span className="fps-label">FPS</span>
    </div>
  );
}

export default FPSCounter;
