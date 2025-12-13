/**
 * @fileoverview Fullscreen Button Component
 * @description Toggle fullscreen mode for canvas
 * @module components/FullscreenButton
 */

import { useState, useEffect, useCallback } from 'react';
import './FullscreenButton.css';

/**
 * Fullscreen Button Component
 */
function FullscreenButton({ targetRef }) {
  const [isFullscreen, setIsFullscreen] = useState(false);

  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };

    document.addEventListener('fullscreenchange', handleFullscreenChange);
    return () => document.removeEventListener('fullscreenchange', handleFullscreenChange);
  }, []);

  const toggleFullscreen = useCallback(async () => {
    try {
      if (!document.fullscreenElement) {
        const element = targetRef?.current || document.querySelector('.simulation-container');
        if (element) {
          await element.requestFullscreen();
        }
      } else {
        await document.exitFullscreen();
      }
    } catch (error) {
      console.error('Fullscreen error:', error);
    }
  }, [targetRef]);

  return (
    <button 
      className="fullscreen-button"
      onClick={toggleFullscreen}
      title={isFullscreen ? 'Exit fullscreen (F11)' : 'Enter fullscreen (F11)'}
      aria-label={isFullscreen ? 'Exit fullscreen' : 'Enter fullscreen'}
    >
      <span className="fullscreen-icon">
        {isFullscreen ? '⤓' : '⤢'}
      </span>
    </button>
  );
}

export default FullscreenButton;
