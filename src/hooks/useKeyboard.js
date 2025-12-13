import { useState, useEffect, useCallback } from 'react';

/**
 * Custom hook for keyboard input handling
 * Tracks the state of pressed keys
 * 
 * @returns {Object} Object with key states (true if pressed)
 */
export function useKeyboard() {
  const [keys, setKeys] = useState({});

  const handleKeyDown = useCallback((event) => {
    // Prevent default for arrow keys to avoid page scrolling
    if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'Space'].includes(event.code)) {
      event.preventDefault();
    }

    setKeys(prev => ({
      ...prev,
      [event.code]: true,
      [event.key]: true,
    }));
  }, []);

  const handleKeyUp = useCallback((event) => {
    setKeys(prev => ({
      ...prev,
      [event.code]: false,
      [event.key]: false,
    }));
  }, []);

  // Reset keys when window loses focus
  const handleBlur = useCallback(() => {
    setKeys({});
  }, []);

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);
    window.addEventListener('blur', handleBlur);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
      window.removeEventListener('blur', handleBlur);
    };
  }, [handleKeyDown, handleKeyUp, handleBlur]);

  return keys;
}

export default useKeyboard;
