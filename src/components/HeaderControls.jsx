/**
 * @fileoverview Header Controls Component
 * @description Quick access simulation controls for the header area
 * @module components/HeaderControls
 */

import { useSimulation, useSimulationDispatch } from '../context/SimulationContext';
import './HeaderControls.css';

/**
 * Header Controls Component
 * Provides quick access to common simulation controls
 * @returns {JSX.Element} Header controls bar
 */
function HeaderControls() {
  const simulation = useSimulation();
  const dispatch = useSimulationDispatch();

  const handleScreenshot = () => {
    const canvas = document.querySelector('.simulation-canvas');
    if (canvas) {
      const link = document.createElement('a');
      link.download = `simulation-${Date.now()}.png`;
      link.href = canvas.toDataURL('image/png');
      link.click();
    }
  };

  return (
    <div className="header-controls">
      <div className="header-control-group">
        <button 
          className={`header-btn ${simulation.isPaused ? 'paused' : 'running'}`}
          onClick={() => dispatch({ type: 'TOGGLE_PAUSE' })}
          title={simulation.isPaused ? 'Resume (Space)' : 'Pause (Space)'}
        >
          {simulation.isPaused ? '▶ Play' : '⏸ Pause'}
        </button>
        <button 
          className="header-btn"
          onClick={() => dispatch({ type: 'RESET_SIMULATION' })}
          title="Reset simulation (R)"
        >
          🔄 Reset
        </button>
        <button 
          className="header-btn danger"
          onClick={() => dispatch({ type: 'CLEAR_ATOMS' })}
          title="Clear all atoms"
        >
          🗑 Clear
        </button>
        <button 
          className="header-btn"
          onClick={() => dispatch({ type: 'UNDO' })}
          disabled={simulation.undoStack.length === 0}
          title="Undo (Ctrl+Z)"
        >
          ↩ Undo
        </button>
        <button 
          className="header-btn"
          onClick={() => dispatch({ type: 'REDO' })}
          disabled={simulation.redoStack.length === 0}
          title="Redo (Ctrl+Y)"
        >
          ↪ Redo
        </button>
      </div>

      <div className="header-control-group toggles">
        <label className="header-toggle" title="Show/hide atomic bonds (B)">
          <input
            type="checkbox"
            checked={simulation.showBonds}
            onChange={() => dispatch({ type: 'TOGGLE_BONDS' })}
          />
          <span className="toggle-switch"></span>
          <span className="toggle-text">Bonds</span>
        </label>
        <label className="header-toggle" title="Enable/disable physics simulation">
          <input
            type="checkbox"
            checked={simulation.enablePhysics}
            onChange={() => dispatch({ type: 'TOGGLE_PHYSICS' })}
          />
          <span className="toggle-switch"></span>
          <span className="toggle-text">Physics</span>
        </label>
        <label className="header-toggle" title="Show velocity vectors (V)">
          <input
            type="checkbox"
            checked={simulation.showVelocityVectors}
            onChange={() => dispatch({ type: 'TOGGLE_VELOCITY_VECTORS' })}
          />
          <span className="toggle-switch"></span>
          <span className="toggle-text">Vectors</span>
        </label>
        <label className="header-toggle" title="Show atom labels (L)">
          <input
            type="checkbox"
            checked={simulation.showAtomLabels}
            onChange={() => dispatch({ type: 'TOGGLE_ATOM_LABELS' })}
          />
          <span className="toggle-switch"></span>
          <span className="toggle-text">Labels</span>
        </label>
      </div>

      <div className="header-control-group">
        <button 
          className="header-btn"
          onClick={handleScreenshot}
          title="Take screenshot"
        >
          📷
        </button>
        <button 
          className="header-btn"
          onClick={() => dispatch({ type: 'TOGGLE_FULLSCREEN' })}
          title="Toggle fullscreen (F)"
        >
          {simulation.isFullscreen ? '⊡' : '⛶'}
        </button>
      </div>
    </div>
  );
}

export default HeaderControls;
