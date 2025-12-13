/**
 * @fileoverview Context Menu Component
 * @description Right-click context menu for atoms
 * @module components/ContextMenu
 */

import { createContext, useContext, useState, useCallback, useEffect } from 'react';
import './ContextMenu.css';

const ContextMenuContext = createContext();

/**
 * Context Menu Provider
 */
export function ContextMenuProvider({ children }) {
  const [menu, setMenu] = useState(null);

  const showContextMenu = useCallback((x, y, items, atom = null) => {
    setMenu({ x, y, items, atom });
  }, []);

  const hideContextMenu = useCallback(() => {
    setMenu(null);
  }, []);

  // Hide on click outside
  useEffect(() => {
    const handleClick = () => hideContextMenu();
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') hideContextMenu();
    };

    document.addEventListener('click', handleClick);
    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('click', handleClick);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [hideContextMenu]);

  return (
    <ContextMenuContext.Provider value={{ showContextMenu, hideContextMenu }}>
      {children}
      {menu && (
        <div 
          className="context-menu"
          style={{ 
            left: Math.min(menu.x, window.innerWidth - 200), 
            top: Math.min(menu.y, window.innerHeight - 300)
          }}
          onClick={(e) => e.stopPropagation()}
        >
          {menu.atom && (
            <div className="context-menu-header">
              {menu.atom.symbol} Atom
            </div>
          )}
          {menu.items.map((item, index) => (
            item.divider ? (
              <div key={index} className="context-menu-divider" />
            ) : (
              <button
                key={index}
                className={`context-menu-item ${item.danger ? 'danger' : ''}`}
                onClick={() => {
                  item.action();
                  hideContextMenu();
                }}
                disabled={item.disabled}
              >
                {item.icon && <span className="context-menu-icon">{item.icon}</span>}
                <span className="context-menu-label">{item.label}</span>
                {item.shortcut && (
                  <span className="context-menu-shortcut">{item.shortcut}</span>
                )}
              </button>
            )
          ))}
        </div>
      )}
    </ContextMenuContext.Provider>
  );
}

/**
 * Hook to use context menu
 */
export function useContextMenu() {
  const context = useContext(ContextMenuContext);
  if (!context) {
    throw new Error('useContextMenu must be used within a ContextMenuProvider');
  }
  return context;
}

export default ContextMenuProvider;
