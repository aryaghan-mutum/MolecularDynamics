/**
 * @fileoverview Theme Toggle Component
 * @description Button to switch between dark and light modes
 * @module components/ThemeToggle
 */

import { useTheme } from '../context/ThemeContext';
import './ThemeToggle.css';

/**
 * Theme Toggle Component
 */
function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();

  return (
    <button 
      className="theme-toggle"
      onClick={toggleTheme}
      title={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
      aria-label={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
    >
      <span className="theme-icon">
        {theme === 'dark' ? '☀️' : '🌙'}
      </span>
    </button>
  );
}

export default ThemeToggle;
