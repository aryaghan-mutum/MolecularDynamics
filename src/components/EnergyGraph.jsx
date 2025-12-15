/**
 * @fileoverview Energy Graph Component
 * @description Real-time visualization of kinetic, potential, and total energy
 * @module components/EnergyGraph
 */

import { useState, useEffect, useRef, useCallback } from 'react';
import { useSimulation } from '../context/SimulationContext';
import './EnergyGraph.css';

/** Maximum number of data points to display */
const MAX_DATA_POINTS = 100;

/** Energy type configurations */
const ENERGY_TYPES = {
  kinetic: { color: '#ef4444', label: 'Kinetic' },
  potential: { color: '#3b82f6', label: 'Potential' },
  total: { color: '#10b981', label: 'Total' },
};

/**
 * Energy Graph Component
 * Displays real-time line charts for simulation energy values
 * @returns {JSX.Element} Energy graph panel
 */
function EnergyGraph() {
  const simulation = useSimulation();
  const canvasRef = useRef(null);
  const lastTimeRef = useRef(null);
  const [showTypes, setShowTypes] = useState({
    kinetic: true,
    potential: true,
    total: true,
  });
  
  // Energy history for graphing
  const [energyHistory, setEnergyHistory] = useState({
    kinetic: [],
    potential: [],
    total: [],
  });

  // Update energy history when simulation changes
  useEffect(() => {
    if (simulation.isPaused) return;
    // Skip if time hasn't changed (prevents duplicate entries)
    if (lastTimeRef.current === simulation.time) return;
    lastTimeRef.current = simulation.time;
    
    setEnergyHistory(prev => {
      const addPoint = (arr, value) => {
        const newArr = [...arr, value];
        return newArr.length > MAX_DATA_POINTS 
          ? newArr.slice(-MAX_DATA_POINTS) 
          : newArr;
      };
      
      return {
        kinetic: addPoint(prev.kinetic, simulation.energy.kinetic),
        potential: addPoint(prev.potential, simulation.energy.potential),
        total: addPoint(prev.total, simulation.energy.total),
      };
    });
  }, [simulation.time, simulation.isPaused, simulation.energy]);

  // Draw the graph
  const drawGraph = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    const { width, height } = canvas;
    const padding = { top: 10, right: 10, bottom: 25, left: 50 };
    const graphWidth = width - padding.left - padding.right;
    const graphHeight = height - padding.top - padding.bottom;
    
    // Clear canvas
    ctx.fillStyle = 'rgba(0, 0, 0, 0.3)';
    ctx.fillRect(0, 0, width, height);
    
    // Find value range
    let minVal = 0;
    let maxVal = 1;
    
    Object.entries(energyHistory).forEach(([type, values]) => {
      if (showTypes[type] && values.length > 0) {
        maxVal = Math.max(maxVal, ...values);
        minVal = Math.min(minVal, ...values);
      }
    });
    
    // Add padding to range
    const range = maxVal - minVal || 1;
    maxVal += range * 0.1;
    minVal -= range * 0.1;
    
    // Draw grid lines
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.1)';
    ctx.lineWidth = 1;
    
    // Horizontal grid lines
    for (let i = 0; i <= 4; i++) {
      const y = padding.top + (graphHeight * i / 4);
      ctx.beginPath();
      ctx.moveTo(padding.left, y);
      ctx.lineTo(width - padding.right, y);
      ctx.stroke();
      
      // Y-axis labels
      const value = maxVal - ((maxVal - minVal) * i / 4);
      ctx.fillStyle = '#666';
      ctx.font = '10px monospace';
      ctx.textAlign = 'right';
      ctx.fillText(value.toFixed(1), padding.left - 5, y + 3);
    }
    
    // Draw each energy line
    Object.entries(energyHistory).forEach(([type, values]) => {
      if (!showTypes[type] || values.length < 2) return;
      
      ctx.strokeStyle = ENERGY_TYPES[type].color;
      ctx.lineWidth = 2;
      ctx.beginPath();
      
      values.forEach((val, i) => {
        const x = padding.left + (graphWidth * i / (MAX_DATA_POINTS - 1));
        const y = padding.top + graphHeight * (1 - (val - minVal) / (maxVal - minVal));
        
        if (i === 0) {
          ctx.moveTo(x, y);
        } else {
          ctx.lineTo(x, y);
        }
      });
      
      ctx.stroke();
    });
    
    // X-axis label
    ctx.fillStyle = '#666';
    ctx.font = '10px sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('Time →', width / 2, height - 5);
  }, [energyHistory, showTypes]);

  // Redraw on changes
  useEffect(() => {
    drawGraph();
  }, [drawGraph]);

  const toggleEnergyType = (type) => {
    setShowTypes(prev => ({ ...prev, [type]: !prev[type] }));
  };

  const clearHistory = () => {
    setEnergyHistory({
      kinetic: [],
      potential: [],
      total: [],
    });
    // Reset time tracking so graph starts fresh
    lastTimeRef.current = simulation.time;
  };

  return (
    <div className="energy-graph-panel">
      <div className="energy-graph-header">
        <h3>
          <span className="graph-icon">📊</span>
          Energy Monitor
        </h3>
        <div className="energy-graph-controls">
          <button 
            className="graph-btn" 
            onClick={clearHistory}
            title="Clear history"
          >
            🗑️
          </button>
        </div>
      </div>

      <div className="energy-values">
        {Object.entries(ENERGY_TYPES).map(([type, config]) => (
          <button
            key={type}
            className={`energy-value-btn ${showTypes[type] ? 'active' : ''}`}
            onClick={() => toggleEnergyType(type)}
            style={{ '--energy-color': config.color }}
          >
            <span className="energy-dot"></span>
            <span className="energy-label">{config.label}</span>
            <span className="energy-num">
              {simulation.energy[type]?.toFixed(2) ?? '0.00'}
            </span>
          </button>
        ))}
      </div>

      <div className="energy-graph-container">
        <canvas 
          ref={canvasRef} 
          width={280} 
          height={150}
          className="energy-canvas"
        />
      </div>

      <div className="temperature-display">
        <span className="temp-icon">🌡️</span>
        <span className="temp-label">Temperature:</span>
        <span className="temp-value">
          {simulation.temperature?.toFixed(1) ?? '0.0'} K
        </span>
      </div>
    </div>
  );
}

export default EnergyGraph;
