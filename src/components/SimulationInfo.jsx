/**
 * @fileoverview Simulation Info Component
 * @description Displays real-time simulation statistics and energy values
 * @module components/SimulationInfo
 */

import { useSimulation } from '../context/SimulationContext';
import './SimulationInfo.css';

/**
 * Simulation Info Component
 * Shows atoms, bonds, time, status, and energy values in a compact bar
 * @returns {JSX.Element} Simulation info bar
 */
function SimulationInfo() {
  const simulation = useSimulation();

  return (
    <div className="simulation-info-bar">
      <div className="info-group">
        <span className="info-title">Simulation</span>
        <div className="info-items">
          <div className="info-item">
            <span className="info-label">Atoms</span>
            <span className="info-value">{simulation.atoms.length}</span>
          </div>
          <div className="info-item">
            <span className="info-label">Bonds</span>
            <span className="info-value">{simulation.bonds?.length || 0}</span>
          </div>
          <div className="info-item">
            <span className="info-label">Time</span>
            <span className="info-value">{simulation.time}</span>
          </div>
          <div className="info-item">
            <span className="info-label">Status</span>
            <span className={`info-value status-${simulation.isPaused ? 'paused' : 'running'}`}>
              {simulation.isPaused ? '⏸ Paused' : '▶ Running'}
            </span>
          </div>
        </div>
      </div>

      <div className="info-group energy-group">
        <span className="info-title">Energy (kcal/mol)</span>
        <div className="info-items">
          <div className="info-item">
            <span className="info-label">Kinetic</span>
            <span className="info-value kinetic">{simulation.energy?.kinetic?.toFixed(2) || '0.00'}</span>
          </div>
          <div className="info-item">
            <span className="info-label">Potential</span>
            <span className="info-value potential">{simulation.energy?.potential?.toFixed(2) || '0.00'}</span>
          </div>
          <div className="info-item">
            <span className="info-label">Total</span>
            <span className="info-value total">{simulation.energy?.total?.toFixed(2) || '0.00'}</span>
          </div>
          <div className="info-item">
            <span className="info-label">Temp</span>
            <span className="info-value temp">{simulation.temperature?.toFixed(0) || '0'} K</span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default SimulationInfo;
