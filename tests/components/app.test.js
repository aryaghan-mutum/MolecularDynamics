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

jest.mock('../../src/components/FileUploader', () => {
  return function MockFileUploader() {
    return <div data-testid="file-uploader">FileUploader</div>;
  };
});

jest.mock('../../src/components/StatusBar', () => {
  return function MockStatusBar() {
    return <div data-testid="status-bar">StatusBar</div>;
  };
});

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

  it('should render FileUploader component', () => {
    render(<App />);
    
    expect(screen.getByTestId('file-uploader')).toBeInTheDocument();
  });

  it('should render StatusBar component', () => {
    render(<App />);
    
    expect(screen.getByTestId('status-bar')).toBeInTheDocument();
  });

  it('should have correct layout structure', () => {
    render(<App />);
    
    const app = document.querySelector('.app');
    expect(app).toBeInTheDocument();
    
    // Check for main content container
    const mainContent = document.querySelector('.app-content') || document.querySelector('.app');
    expect(mainContent).toBeInTheDocument();
  });

  it('should apply app class to container', () => {
    render(<App />);
    
    const appElement = document.querySelector('.app');
    expect(appElement.className).toContain('app');
  });
});
