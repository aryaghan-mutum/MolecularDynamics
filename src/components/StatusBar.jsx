import { useSimulation } from '../context/SimulationContext';
import './StatusBar.css';

/**
 * Status Bar Component
 * Displays current simulation status
 */
function StatusBar() {
  const simulation = useSimulation();

  return (
    <div className="status-bar">
      <span className="status-text">{simulation.statusText || 'Ready'}</span>
      {simulation.isPaused && (
        <span className="status-badge paused">PAUSED</span>
      )}
    </div>
  );
}

export default StatusBar;
