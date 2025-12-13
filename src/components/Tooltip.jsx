/**
 * @fileoverview Custom Tooltip Component
 * @description Styled tooltips to replace native title attributes
 * @module components/Tooltip
 */

import { useState, useRef, useEffect } from 'react';
import './Tooltip.css';

/**
 * Tooltip Component
 */
function Tooltip({ children, content, position = 'top', delay = 300 }) {
  const [isVisible, setIsVisible] = useState(false);
  const [coords, setCoords] = useState({ x: 0, y: 0 });
  const timeoutRef = useRef(null);
  const triggerRef = useRef(null);

  const showTooltip = () => {
    timeoutRef.current = setTimeout(() => {
      if (triggerRef.current) {
        const rect = triggerRef.current.getBoundingClientRect();
        setCoords({
          x: rect.left + rect.width / 2,
          y: position === 'top' ? rect.top : rect.bottom
        });
        setIsVisible(true);
      }
    }, delay);
  };

  const hideTooltip = () => {
    clearTimeout(timeoutRef.current);
    setIsVisible(false);
  };

  useEffect(() => {
    return () => clearTimeout(timeoutRef.current);
  }, []);

  if (!content) return children;

  return (
    <>
      <span 
        ref={triggerRef}
        className="tooltip-trigger"
        onMouseEnter={showTooltip}
        onMouseLeave={hideTooltip}
        onFocus={showTooltip}
        onBlur={hideTooltip}
      >
        {children}
      </span>
      {isVisible && (
        <div 
          className={`tooltip tooltip-${position}`}
          style={{
            left: coords.x,
            top: coords.y
          }}
        >
          {content}
          <div className="tooltip-arrow" />
        </div>
      )}
    </>
  );
}

export default Tooltip;
