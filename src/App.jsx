import { SimulationProvider } from './context/SimulationContext';
import { ParametersProvider } from './context/ParametersContext';
import SimulationCanvas from './components/SimulationCanvas';
import ControlPanel from './components/ControlPanel';
import StatusBar from './components/StatusBar';
import FileUploader from './components/FileUploader';
import './styles/App.css';

/**
 * Main Application Component
 * Molecular Dynamics Simulation with ReaxFF Force Field
 */
function App() {
  return (
    <ParametersProvider>
      <SimulationProvider>
        <div className="app">
          <header className="app-header">
            <h1>Molecular Dynamics Simulation</h1>
            <p className="subtitle">ReaxFF Reactive Force Field</p>
          </header>

          <main className="app-main">
            <div className="simulation-container">
              <SimulationCanvas />
              <StatusBar />
            </div>

            <aside className="sidebar">
              <ControlPanel />
              <FileUploader />
            </aside>
          </main>

          <footer className="app-footer">
            <p>Use arrow keys to control the player atom</p>
          </footer>
        </div>
      </SimulationProvider>
    </ParametersProvider>
  );
}

export default App;
