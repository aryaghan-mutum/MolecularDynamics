/**
 * @fileoverview Atom Legend Component
 * @description Shows a legend of atom types currently in the simulation
 * @module components/AtomLegend
 */

import { useMemo } from 'react';
import { useSimulation } from '../context/SimulationContext';
import { ATOM_TYPES } from '../simulation/physics';
import './AtomLegend.css';

/**
 * Atom Legend Component
 */
function AtomLegend() {
  const simulation = useSimulation();

  // Get unique atom types currently in simulation
  const activeAtomTypes = useMemo(() => {
    const typeSet = new Set(simulation.atoms.map(atom => atom.type));
    return Array.from(typeSet)
      .map(typeId => ATOM_TYPES[typeId])
      .filter(Boolean)
      .sort((a, b) => a.symbol.localeCompare(b.symbol));
  }, [simulation.atoms]);

  if (activeAtomTypes.length === 0) return null;

  return (
    <div className="atom-legend">
      <div className="legend-title">Atoms</div>
      <div className="legend-items">
        {activeAtomTypes.map(atomType => (
          <div key={atomType.symbol} className="legend-item">
            <span 
              className="legend-dot" 
              style={{ background: atomType.color }}
            />
            <span className="legend-symbol">{atomType.symbol}</span>
            <span className="legend-count">
              {simulation.atoms.filter(a => ATOM_TYPES[a.type]?.symbol === atomType.symbol).length}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

export default AtomLegend;
