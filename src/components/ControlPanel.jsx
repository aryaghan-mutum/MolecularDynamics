import { useSimulation, useSimulationActions } from '../context/SimulationContext';
import './ControlPanel.css';

/**
 * Control Panel Component
 * Provides controls for the simulation
 */
function ControlPanel() {
  const simulation = useSimulation();
  const { resetSimulation, togglePause, toggleClear, addAtom } = useSimulationActions();

  const handleAddAtom = () => {
    // Add atom at random position
    const x = Math.random() * simulation.size.x * 0.8 + simulation.size.x * 0.1;
    const y = Math.random() * simulation.size.y * 0.8 + simulation.size.y * 0.1;
    addAtom(x, y, 0, 2);
  };

  return (
    <div className="control-panel">
      <h3>Controls</h3>
      
      <div className="control-group">
        <button 
          className="control-button primary"
          onClick={resetSimulation}
        >
          Restart
        </button>
        
        <button 
          className={`control-button ${simulation.isPaused ? 'active' : ''}`}
          onClick={togglePause}
        >
          {simulation.isPaused ? 'Resume' : 'Pause'}
        </button>
        
        <button 
          className={`control-button ${!simulation.clearScreen ? 'active' : ''}`}
          onClick={toggleClear}
        >
          Toggle Clear
        </button>
        
        <button 
          className="control-button"
          onClick={handleAddAtom}
        >
          Add Atom
        </button>
      </div>

      <div className="info-group">
        <h4>Simulation Info</h4>
        <p><strong>Atoms:</strong> {simulation.atoms.length}</p>
        <p><strong>Time:</strong> {simulation.time}</p>
        <p><strong>Scale:</strong> {simulation.scale.toFixed(1)}x</p>
      </div>

      <div className="instructions">
        <h4>Instructions</h4>
        <ul>
          <li><kbd>←</kbd> <kbd>→</kbd> <kbd>↑</kbd> <kbd>↓</kbd> Move player</li>
          <li>Load ReaxFF parameters for full simulation</li>
        </ul>
      </div>
    </div>
  );
}

export default ControlPanel;
