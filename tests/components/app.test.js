/**
 * @fileoverview Unit tests for App Component
 * @description Tests for the main App component
 */
import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';

// Mock child components to isolate App testing
jest.mock('../../src/components/ControlPanel', () => {
  return function MockControlPanel() {
    return <div data-testid="control-panel">ControlPanel</div>;
  };
});

jest.mock('../../src/components/SimulationCanvas', () => {
  return function MockSimulationCanvas() {
    return <div data-testid="simulation-canvas">SimulationCanvas</div>;
  };
});

jest.mock('../../src/components/EnergyGraph', () => {
  return function MockEnergyGraph() {
    return <div data-testid="energy-graph">EnergyGraph</div>;
  };
});

jest.mock('../../src/components/SimulationInfo', () => {
  return function MockSimulationInfo() {
    return <div data-testid="simulation-info">SimulationInfo</div>;
  };
});

jest.mock('../../src/components/HeaderControls', () => {
  return function MockHeaderControls() {
    return <div data-testid="header-controls">HeaderControls</div>;
  };
});

jest.mock('../../src/components/HamburgerMenu', () => {
  return function MockHamburgerMenu() {
    return <div data-testid="hamburger-menu">HamburgerMenu</div>;
  };
});

// Mock new components added for UI improvements
jest.mock('../../src/components/ThemeToggle', () => {
  return function MockThemeToggle() {
    return <div data-testid="theme-toggle">ThemeToggle</div>;
  };
});

jest.mock('../../src/components/FPSCounter', () => {
  return function MockFPSCounter() {
    return <div data-testid="fps-counter">FPSCounter</div>;
  };
});

jest.mock('../../src/components/AtomLegend', () => {
  return function MockAtomLegend() {
    return <div data-testid="atom-legend">AtomLegend</div>;
  };
});

jest.mock('../../src/components/ZoomControls', () => {
  return function MockZoomControls() {
    return <div data-testid="zoom-controls">ZoomControls</div>;
  };
});

jest.mock('../../src/components/FullscreenButton', () => {
  return function MockFullscreenButton() {
    return <div data-testid="fullscreen-button">FullscreenButton</div>;
  };
});

jest.mock('../../src/components/KeyboardShortcuts', () => {
  return function MockKeyboardShortcuts() {
    return <div data-testid="keyboard-shortcuts">KeyboardShortcuts</div>;
  };
});

jest.mock('../../src/components/LoadingSpinner', () => {
  return function MockLoadingSpinner() {
    return <div data-testid="loading-spinner">LoadingSpinner</div>;
  };
});

// Mock context providers
jest.mock('../../src/context/ThemeContext', () => ({
  ThemeProvider: ({ children }) => <div data-testid="theme-provider">{children}</div>,
  useTheme: () => ({ theme: 'dark', toggleTheme: jest.fn() })
}));

jest.mock('../../src/components/Toast', () => ({
  ToastProvider: ({ children }) => <div data-testid="toast-provider">{children}</div>,
  useToast: () => ({ addToast: jest.fn() })
}));

jest.mock('../../src/components/ContextMenu', () => ({
  ContextMenuProvider: ({ children }) => <div data-testid="context-menu-provider">{children}</div>,
  useContextMenu: () => ({ showContextMenu: jest.fn(), hideContextMenu: jest.fn() })
}));

// Import after mocks
import App from '../../src/App';

describe('App Component', () => {
  it('should render without crashing', () => {
    render(<App />);
    
    expect(document.querySelector('.app')).toBeInTheDocument();
  });

  it('should render ControlPanel component', () => {
    render(<App />);
    
    expect(screen.getByTestId('control-panel')).toBeInTheDocument();
  });

  it('should render SimulationCanvas component', () => {
    render(<App />);
    
    expect(screen.getByTestId('simulation-canvas')).toBeInTheDocument();
  });

  it('should render EnergyGraph component', () => {
    render(<App />);
    
    expect(screen.getByTestId('energy-graph')).toBeInTheDocument();
  });

  it('should render SimulationInfo component', () => {
    render(<App />);
    
    expect(screen.getByTestId('simulation-info')).toBeInTheDocument();
  });

  it('should have correct layout structure', () => {
    render(<App />);
    
    const app = document.querySelector('.app');
    expect(app).toBeInTheDocument();
    
    // Check for main content container
    const mainContent = document.querySelector('.app-main');
    expect(mainContent).toBeInTheDocument();
  });

  it('should apply app class to container', () => {
    render(<App />);
    
    const appElement = document.querySelector('.app');
    expect(appElement.className).toContain('app');
  });
});
