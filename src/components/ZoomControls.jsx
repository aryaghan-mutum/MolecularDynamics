/**
 * @fileoverview Zoom Controls Component
 * @description Provides zoom in/out/reset buttons for canvas
 * @module components/ZoomControls
 */

import { useSimulation, useSimulationDispatch } from '../context/SimulationContext';
import './ZoomControls.css';

/**
 * Zoom Controls Component
 */
function ZoomControls() {
  const simulation = useSimulation();
  const dispatch = useSimulationDispatch();

  const handleZoomIn = () => {
    dispatch({ type: 'SET_SCALE', payload: Math.min(simulation.scale * 1.2, 5) });
  };

  const handleZoomOut = () => {
    dispatch({ type: 'SET_SCALE', payload: Math.max(simulation.scale / 1.2, 0.2) });
  };

  const handleZoomReset = () => {
    dispatch({ type: 'SET_SCALE', payload: 1 });
    dispatch({ type: 'SET_PAN', payload: { x: 0, y: 0 } });
  };

  const zoomPercent = Math.round(simulation.scale * 100);

  return (
    <div className="zoom-controls">
      <button 
        className="zoom-btn" 
        onClick={handleZoomOut}
        title="Zoom out (-)"
        disabled={simulation.scale <= 0.2}
      >
        −
      </button>
      <button 
        className="zoom-level"
        onClick={handleZoomReset}
        title="Reset zoom (0)"
      >
        {zoomPercent}%
      </button>
      <button 
        className="zoom-btn" 
        onClick={handleZoomIn}
        title="Zoom in (+)"
        disabled={simulation.scale >= 5}
      >
        +
      </button>
    </div>
  );
}

export default ZoomControls;
