import { Suspense, useState, useRef, useEffect } from 'react';
import { SimulationProvider } from './context/SimulationContext';
import { ParametersProvider } from './context/ParametersContext';
import { ThemeProvider } from './context/ThemeContext';
import { ToastProvider } from './components/Toast';
import { ContextMenuProvider } from './components/ContextMenu';
import SimulationCanvas from './components/SimulationCanvas';
import ControlPanel from './components/ControlPanel';
import EnergyGraph from './components/EnergyGraph';
import SimulationInfo from './components/SimulationInfo';
import HeaderControls from './components/HeaderControls';
import HamburgerMenu from './components/HamburgerMenu';
import ThemeToggle from './components/ThemeToggle';
import FPSCounter from './components/FPSCounter';
import AtomLegend from './components/AtomLegend';
import ZoomControls from './components/ZoomControls';
import FullscreenButton from './components/FullscreenButton';
import KeyboardShortcuts from './components/KeyboardShortcuts';
import LoadingSpinner from './components/LoadingSpinner';
import './styles/App.css';

/**
 * Main Application Component
 * Molecular Dynamics Simulation with ReaxFF Force Field
 */
function App({ skipLoading = false }) {
  // Skip loading animation in test environment
  const isTestEnv = typeof process !== 'undefined' && process.env?.NODE_ENV === 'test';
  const [isLoading, setIsLoading] = useState(!skipLoading && !isTestEnv);
  const canvasContainerRef = useRef(null);

  // Simulate initial load
  useEffect(() => {
    if (!skipLoading && !isTestEnv) {
      const timer = setTimeout(() => setIsLoading(false), 1500);
      return () => clearTimeout(timer);
    }
  }, [skipLoading, isTestEnv]);

  if (isLoading) {
    return <LoadingSpinner message="Initializing simulation..." />;
  }

  return (
    <ThemeProvider>
      <ToastProvider>
        <ContextMenuProvider>
          <ParametersProvider>
            <SimulationProvider>
              <div className="app">
                <header className="app-header">
                  <div className="header-content">
                    <div className="header-actions">
                      <HamburgerMenu />
                    </div>
                    <div className="header-title">
                      <h1>
                        Molecular Dynamics Simulation
                      </h1>
                      <p className="subtitle">ReaxFF Reactive Force Field</p>
                    </div>
                    <div className="header-right">
                      <ThemeToggle />
                      <HeaderControls />
                    </div>
                  </div>
                </header>

                <main className="app-main">
                  <div className="simulation-container" ref={canvasContainerRef}>
                    <SimulationInfo />
                    <div className="canvas-wrapper">
                      <FPSCounter />
                      <AtomLegend />
                      <SimulationCanvas />
                      <ZoomControls />
                      <div className="canvas-bottom-right">
                        <FullscreenButton targetRef={canvasContainerRef} />
                      </div>
                    </div>
                  </div>

                  <aside className="sidebar">
                    <ControlPanel />
                    <EnergyGraph />
                  </aside>
                </main>

                <footer className="app-footer">
                  <p>Use arrow keys to control the player atom • Press <kbd>?</kbd> for shortcuts</p>
                </footer>

                <KeyboardShortcuts />
              </div>
            </SimulationProvider>
          </ParametersProvider>
        </ContextMenuProvider>
      </ToastProvider>
    </ThemeProvider>
  );
}

export default App;
