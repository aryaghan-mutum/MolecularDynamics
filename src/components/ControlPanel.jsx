/**
 * @fileoverview Control Panel Component for Molecular Dynamics Simulation
 * @description Provides UI controls for simulation parameters, atom selection,
 * molecule presets, force field selection, and display options.
 * @module components/ControlPanel
 */

import { useState } from 'react';
import { useSimulation, useSimulationDispatch } from '../context/SimulationContext';
import { useParameters } from '../context/ParametersContext';
import { ATOM_TYPES as PHYSICS_ATOM_TYPES, MOLECULE_PRESETS } from '../simulation/physics';
import { getAvailableForceFields, getForceFieldInfo } from '../simulation/forceFieldParser';
import { PRESET_CONFIGS } from '../context/simulationReducer';
import './ControlPanel.css';

/**
 * UI-friendly atom type representation
 * @typedef {Object} UIAtomType
 * @property {number} id - Atom type identifier
 * @property {string} name - Full element name
 * @property {string} symbol - Chemical symbol
 * @property {string} color - Display color in hex format
 */

/**
 * Convert physics atom types to array for UI rendering
 * @type {UIAtomType[]}
 */
const ATOM_TYPES = Object.entries(PHYSICS_ATOM_TYPES).map(([id, data]) => ({
  id: parseInt(id, 10),
  name: data.name,
  symbol: data.symbol,
  color: data.color,
}));

/**
 * Collapsible Section Component
 */
function CollapsibleSection({ title, icon, children, defaultOpen = false }) {
  const [isOpen, setIsOpen] = useState(defaultOpen);
  
  return (
    <div className={`collapsible-section ${isOpen ? 'open' : ''}`}>
      <button 
        className="collapsible-header"
        onClick={() => setIsOpen(!isOpen)}
        aria-expanded={isOpen}
      >
        <span className="section-icon">{icon}</span>
        <span className="section-title">{title}</span>
        <span className="chevron">{isOpen ? '▾' : '▸'}</span>
      </button>
      {isOpen && (
        <div className="collapsible-content">
          {children}
        </div>
      )}
    </div>
  );
}

/**
 * Control Panel Component
 * Provides UI controls for simulation parameters, atoms, and molecules
 * @returns {JSX.Element} Control panel with simulation controls
 */
function ControlPanel() {
  const simulation = useSimulation();
  const parameters = useParameters();
  const dispatch = useSimulationDispatch();
  const [selectedForceField, setSelectedForceField] = useState('');

  // Combine all atom types into a single categorized list
  const organicAtoms = ATOM_TYPES.filter(t => t.id <= 6);
  const metalAtoms = ATOM_TYPES.filter(t => t.id > 6);

  /**
   * Add a single atom at random position within canvas bounds
   */
  const handleAddAtom = (atomType) => {
    const x = Math.random() * simulation.size.x * 0.6 + simulation.size.x * 0.2;
    const y = Math.random() * simulation.size.y * 0.6 + simulation.size.y * 0.2;
    dispatch({ 
      type: 'ADD_ATOM', 
      payload: { x, y, z: 0, atomType } 
    });
  };

  /**
   * Load a preset molecule configuration
   * @param {string} moleculeKey - Key identifying the molecule preset
   */
  const handleLoadMolecule = (moleculeKey) => {
    const molecule = MOLECULE_PRESETS[moleculeKey];
    if (molecule) {
      dispatch({ 
        type: 'LOAD_MOLECULE', 
        payload: { atoms: molecule.atoms } 
      });
    }
  };

  const handleForceFieldChange = (event) => {
    const filename = event.target.value;
    setSelectedForceField(filename);
    if (filename) {
      const info = getForceFieldInfo(filename);
      dispatch({ type: 'SET_FORCE_FIELD', payload: { filename, info } });
    }
  };

  return (
    <div className="control-panel">
      <h3>⚙️ Controls</h3>

      {/* Quick Actions - Always visible */}
      <div className="quick-actions">
        <select
          className="quick-select"
          value=""
          onChange={(e) => {
            if (e.target.value) {
              handleAddAtom(parseInt(e.target.value, 10));
            }
          }}
          title="Add atom"
        >
          <option value="">➕ Add Atom...</option>
          <optgroup label="Elements">
            {organicAtoms.map(type => (
              <option key={type.id} value={type.id}>
                {type.symbol} - {type.name}
              </option>
            ))}
          </optgroup>
          <optgroup label="Metals">
            {metalAtoms.map(type => (
              <option key={type.id} value={type.id}>
                {type.symbol} - {type.name}
              </option>
            ))}
          </optgroup>
        </select>

        <select
          className="quick-select"
          value=""
          onChange={(e) => {
            if (e.target.value) {
              handleLoadMolecule(e.target.value);
            }
          }}
          title="Add molecule"
        >
          <option value="">🔬 Add Molecule...</option>
          <optgroup label="Common">
            {Object.entries(MOLECULE_PRESETS)
              .filter(([, mol]) => mol.category === 'common')
              .map(([key, mol]) => (
                <option key={key} value={key}>{mol.name}</option>
              ))}
          </optgroup>
          <optgroup label="Metals">
            {Object.entries(MOLECULE_PRESETS)
              .filter(([, mol]) => mol.category === 'metals')
              .map(([key, mol]) => (
                <option key={key} value={key}>{mol.name}</option>
              ))}
          </optgroup>
        </select>
      </div>

      {/* Preset Configurations - Compact buttons */}
      <div className="presets-row">
        {Object.entries(PRESET_CONFIGS).slice(0, 4).map(([key, preset]) => (
          <button
            key={key}
            className="preset-chip"
            onClick={() => {
              dispatch({ type: 'PUSH_UNDO' });
              dispatch({ type: 'LOAD_PRESET', payload: key });
            }}
            title={`Load ${preset.name}`}
          >
            {preset.name.split(' ')[0]}
          </button>
        ))}
      </div>

      {/* Temperature & Speed - Inline compact */}
      <div className="inline-controls">
        <div className="inline-control">
          <label>🌡️ Temp</label>
          <input
            type="range"
            min="0"
            max="1000"
            step="10"
            value={simulation.targetTemperature}
            onChange={(e) => dispatch({ 
              type: 'SET_TARGET_TEMPERATURE', 
              payload: parseFloat(e.target.value) 
            })}
          />
          <span className="control-value">{simulation.targetTemperature}K</span>
        </div>
        <div className="inline-control">
          <label>⚡ Speed</label>
          <input
            type="range"
            min="0.1"
            max="3"
            step="0.1"
            value={simulation.timeStepMultiplier}
            onChange={(e) => dispatch({ 
              type: 'SET_TIME_STEP_MULTIPLIER', 
              payload: parseFloat(e.target.value) 
            })}
          />
          <span className="control-value">{simulation.timeStepMultiplier.toFixed(1)}x</span>
        </div>
      </div>

      {/* Collapsible Advanced Options */}
      <CollapsibleSection title="Force Field" icon="⚛️" defaultOpen={false}>
        <select 
          className="full-select"
          value={selectedForceField}
          onChange={handleForceFieldChange}
        >
          <option value="">Select Force Field...</option>
          {getAvailableForceFields().map(ff => {
            const info = getForceFieldInfo(ff);
            return (
              <option key={ff} value={ff}>{info.name}</option>
            );
          })}
        </select>
        {selectedForceField && (
          <div className="force-field-info">
            <p>{getForceFieldInfo(selectedForceField).description}</p>
            <small>Elements: {getForceFieldInfo(selectedForceField).elements.join(', ')}</small>
          </div>
        )}
        {parameters.isLoaded && (
          <div className="params-loaded">✓ ReaxFF loaded</div>
        )}
      </CollapsibleSection>

      <CollapsibleSection title="Boundary & Display" icon="🖼️" defaultOpen={false}>
        <div className="compact-control">
          <label>Boundary</label>
          <select 
            className="compact-select"
            value={simulation.boundaryCondition}
            onChange={(e) => dispatch({ 
              type: 'SET_BOUNDARY_CONDITION', 
              payload: e.target.value 
            })}
          >
            <option value="reflective">Reflective</option>
            <option value="periodic">Periodic</option>
            <option value="open">Open</option>
          </select>
        </div>
        <div className="checkbox-row">
          <label className="mini-checkbox">
            <input
              type="checkbox"
              checked={simulation.showBondLengths}
              onChange={() => dispatch({ type: 'TOGGLE_BOND_LENGTHS' })}
            />
            Bond Lengths
          </label>
          <label className="mini-checkbox">
            <input
              type="checkbox"
              checked={!simulation.clearScreen}
              onChange={() => dispatch({ type: 'TOGGLE' })}
            />
            Trails
          </label>
        </div>
      </CollapsibleSection>

      <CollapsibleSection title="All Presets" icon="📋" defaultOpen={false}>
        <div className="all-presets">
          {Object.entries(PRESET_CONFIGS).map(([key, preset]) => (
            <button
              key={key}
              className="preset-btn-full"
              onClick={() => {
                dispatch({ type: 'PUSH_UNDO' });
                dispatch({ type: 'LOAD_PRESET', payload: key });
              }}
            >
              {preset.name}
            </button>
          ))}
        </div>
      </CollapsibleSection>
    </div>
  );
}

export default ControlPanel;
