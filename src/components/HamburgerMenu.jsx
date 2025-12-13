/**
 * @fileoverview Hamburger Menu Component
 * @description Provides a dropdown menu for Help, Settings, and About links
 * @module components/HamburgerMenu
 */

import { useState, useRef, useEffect } from 'react';
import HelpModal from './HelpModal';
import SettingsModal from './SettingsModal';
import AboutModal from './AboutModal';
import './HamburgerMenu.css';

/**
 * Hamburger Menu Component
 * Dropdown menu containing Help, Settings, and About options
 * @returns {JSX.Element} Hamburger menu with dropdown
 */
function HamburgerMenu() {
  const [isOpen, setIsOpen] = useState(false);
  const [activeModal, setActiveModal] = useState(null);
  const menuRef = useRef(null);

  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Close menu when Escape is pressed
  useEffect(() => {
    const handleEscape = (event) => {
      if (event.key === 'Escape') {
        setIsOpen(false);
      }
    };

    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, []);

  const handleMenuItemClick = (modalType) => {
    setActiveModal(modalType);
    setIsOpen(false);
  };

  const closeModal = () => {
    setActiveModal(null);
  };

  return (
    <div className="hamburger-menu" ref={menuRef}>
      <button 
        className="hamburger-button"
        onClick={() => setIsOpen(!isOpen)}
        aria-label="Menu"
        aria-expanded={isOpen}
      >
        <span className="hamburger-icon">
          <span className={`bar ${isOpen ? 'open' : ''}`}></span>
          <span className={`bar ${isOpen ? 'open' : ''}`}></span>
          <span className={`bar ${isOpen ? 'open' : ''}`}></span>
        </span>
      </button>

      {isOpen && (
        <div className="hamburger-dropdown">
          <button 
            className="menu-item"
            onClick={() => handleMenuItemClick('help')}
          >
            <span className="menu-icon">❓</span>
            <span className="menu-label">Help</span>
          </button>
          <button 
            className="menu-item"
            onClick={() => handleMenuItemClick('settings')}
          >
            <span className="menu-icon">⚙️</span>
            <span className="menu-label">Settings</span>
          </button>
          <div className="menu-divider"></div>
          <button 
            className="menu-item"
            onClick={() => {
              handleMenuItemClick('settings');
              // Set a small timeout to allow modal to open, then switch to data tab
              setTimeout(() => {
                const dataTab = document.querySelector('.settings-tab:last-child');
                if (dataTab) dataTab.click();
              }, 100);
            }}
          >
            <span className="menu-icon">📤</span>
            <span className="menu-label">Export Data</span>
          </button>
          <button 
            className="menu-item"
            onClick={() => {
              handleMenuItemClick('settings');
              setTimeout(() => {
                const dataTab = document.querySelector('.settings-tab:last-child');
                if (dataTab) dataTab.click();
              }, 100);
            }}
          >
            <span className="menu-icon">📁</span>
            <span className="menu-label">Load Parameters</span>
          </button>
          <div className="menu-divider"></div>
          <button 
            className="menu-item"
            onClick={() => handleMenuItemClick('about')}
          >
            <span className="menu-icon">ℹ️</span>
            <span className="menu-label">About</span>
          </button>
        </div>
      )}

      {/* Modals rendered based on activeModal state */}
      {activeModal === 'help' && (
        <HelpModal isOpenExternal={true} onCloseExternal={closeModal} />
      )}
      {activeModal === 'settings' && (
        <SettingsModal isOpenExternal={true} onCloseExternal={closeModal} />
      )}
      {activeModal === 'about' && (
        <AboutModal isOpenExternal={true} onCloseExternal={closeModal} />
      )}
    </div>
  );
}

export default HamburgerMenu;
