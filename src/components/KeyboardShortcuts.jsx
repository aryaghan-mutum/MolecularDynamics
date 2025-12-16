/**
 * @fileoverview Keyboard Shortcuts Overlay Component
 * @description Shows all available keyboard shortcuts when pressing ?
 * @module components/KeyboardShortcuts
 */

import { useState, useEffect } from 'react';
import './KeyboardShortcuts.css';

const SHORTCUTS = [
  { category: 'Simulation', shortcuts: [
    { keys: ['Space'], description: 'Play/Pause simulation' },
    { keys: ['R'], description: 'Reset simulation' },
    { keys: ['C'], description: 'Clear all atoms' },
  ]},
  { category: 'View', shortcuts: [
    { keys: ['B'], description: 'Toggle bonds' },
    { keys: ['V'], description: 'Toggle velocity vectors' },
    { keys: ['L'], description: 'Toggle atom labels' },
    { keys: ['G'], description: 'Toggle grid' },
    { keys: ['F'], description: 'Toggle fullscreen' },
  ]},
  { category: 'Navigation', shortcuts: [
    { keys: ['↑', '↓', '←', '→'], description: 'Move player atom' },
    { keys: ['Scroll'], description: 'Zoom in/out' },
    { keys: ['Drag'], description: 'Pan canvas' },
    { keys: ['+', '-'], description: 'Zoom in/out' },
    { keys: ['0'], description: 'Reset zoom' },
  ]},
  { category: 'Edit', shortcuts: [
    { keys: ['Ctrl', 'Z'], description: 'Undo' },
    { keys: ['Ctrl', 'Y'], description: 'Redo' },
    { keys: ['Ctrl', 'A'], description: 'Select all atoms' },
    { keys: ['Delete'], description: 'Delete selected atoms' },
    { keys: ['Ctrl', 'C'], description: 'Copy selected atoms' },
    { keys: ['Ctrl', 'V'], description: 'Paste atoms' },
  ]},
  { category: 'Tools', shortcuts: [
    { keys: ['S'], description: 'Screenshot' },
    { keys: ['?'], description: 'Show/hide shortcuts' },
    { keys: ['Esc'], description: 'Close modal/Cancel' },
  ]},
];

/**
 * Keyboard Shortcuts Overlay Component
 */
function KeyboardShortcuts() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const handleKeyDown = (e) => {
      // Don't trigger if typing in an input field
      const isInputField = ['INPUT', 'TEXTAREA', 'SELECT'].includes(e.target.tagName);
      if (isInputField) return;
      
      // Show on ? key (Shift + / or direct ?)
      if (e.key === '?' || (e.shiftKey && e.code === 'Slash')) {
        e.preventDefault();
        e.stopPropagation();
        setIsVisible(prev => !prev);
      }
      // Close on Escape
      if (e.key === 'Escape' && isVisible) {
        e.preventDefault();
        setIsVisible(false);
      }
    };

    // Use capture phase to ensure we get the event first
    window.addEventListener('keydown', handleKeyDown, true);
    return () => window.removeEventListener('keydown', handleKeyDown, true);
  }, [isVisible]);

  if (!isVisible) return null;

  return (
    <div className="shortcuts-overlay" onClick={() => setIsVisible(false)}>
      <div className="shortcuts-modal" onClick={e => e.stopPropagation()}>
        <div className="shortcuts-header">
          <h2>⌨️ Keyboard Shortcuts</h2>
          <button className="shortcuts-close" onClick={() => setIsVisible(false)}>×</button>
        </div>
        <div className="shortcuts-content">
          {SHORTCUTS.map(category => (
            <div key={category.category} className="shortcuts-category">
              <h3>{category.category}</h3>
              <div className="shortcuts-list">
                {category.shortcuts.map((shortcut, idx) => (
                  <div key={idx} className="shortcut-item">
                    <div className="shortcut-keys">
                      {shortcut.keys.map((key, kidx) => (
                        <span key={kidx}>
                          <kbd>{key}</kbd>
                          {kidx < shortcut.keys.length - 1 && <span className="key-separator">+</span>}
                        </span>
                      ))}
                    </div>
                    <span className="shortcut-desc">{shortcut.description}</span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
        <div className="shortcuts-footer">
          Press <kbd>?</kbd> to toggle this overlay
        </div>
      </div>
    </div>
  );
}

export default KeyboardShortcuts;
