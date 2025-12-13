import { useState } from 'react';
import { useSimulation, useSimulationDispatch } from '../context/SimulationContext';
import { useParameters } from '../context/ParametersContext';
import { ATOM_TYPES as PHYSICS_ATOM_TYPES } from '../simulation/physics';
import { getAvailableForceFields, getForceFieldInfo } from '../simulation/forceFieldParser';
import './ControlPanel.css';

// Molecule presets organized by category
const MOLECULE_PRESETS = {
  // Common organic molecules
  h2: {
    name: 'H₂',
    category: 'common',
    atoms: [
      { x: -0.37, y: 0, z: 0, type: 2 },
      { x: 0.37, y: 0, z: 0, type: 2 },
    ],
  },
  o2: {
    name: 'O₂',
    category: 'common',
    atoms: [
      { x: -0.6, y: 0, z: 0, type: 3 },
      { x: 0.6, y: 0, z: 0, type: 3 },
    ],
  },
  water: {
    name: 'H₂O',
    category: 'common',
    atoms: [
      { x: 0, y: 0, z: 0, type: 3 },
      { x: 0.96, y: 0.5, z: 0, type: 2 },
      { x: -0.96, y: 0.5, z: 0, type: 2 },
    ],
  },
  co2: {
    name: 'CO₂',
    category: 'common',
    atoms: [
      { x: 0, y: 0, z: 0, type: 1 },
      { x: 1.16, y: 0, z: 0, type: 3 },
      { x: -1.16, y: 0, z: 0, type: 3 },
    ],
  },
  methane: {
    name: 'CH₄',
    category: 'common',
    atoms: [
      { x: 0, y: 0, z: 0, type: 1 },
      { x: 0.63, y: 0.63, z: 0, type: 2 },
      { x: -0.63, y: -0.63, z: 0, type: 2 },
      { x: 0.63, y: -0.63, z: 0, type: 2 },
      { x: -0.63, y: 0.63, z: 0, type: 2 },
    ],
  },
  ammonia: {
    name: 'NH₃',
    category: 'common',
    atoms: [
      { x: 0, y: 0, z: 0, type: 4 },
      { x: 0.94, y: 0.38, z: 0, type: 2 },
      { x: -0.47, y: 0.38, z: 0, type: 2 },
      { x: 0, y: -0.76, z: 0, type: 2 },
    ],
  },
  // Metal-containing molecules
  silane: {
    name: 'SiH₄',
    category: 'metals',
    atoms: [
      { x: 0, y: 0, z: 0, type: 7 },
      { x: 0.85, y: 0.85, z: 0, type: 2 },
      { x: -0.85, y: -0.85, z: 0, type: 2 },
      { x: 0.85, y: -0.85, z: 0, type: 2 },
      { x: -0.85, y: 0.85, z: 0, type: 2 },
    ],
  },
  zincOxide: {
    name: 'ZnO',
    category: 'metals',
    atoms: [
      { x: 0, y: 0, z: 0, type: 10 },
      { x: 1.0, y: 0, z: 0, type: 3 },
    ],
  },
  goldCluster: {
    name: 'Au₃',
    category: 'metals',
    atoms: [
      { x: 0, y: 0, z: 0, type: 8 },
      { x: 1.4, y: 0, z: 0, type: 8 },
      { x: 0.7, y: 1.2, z: 0, type: 8 },
    ],
  },
  copperSulfate: {
    name: 'CuS',
    category: 'metals',
    atoms: [
      { x: 0, y: 0, z: 0, type: 11 },
      { x: 1.2, y: 0, z: 0, type: 5 },
    ],
  },
};

// Convert physics atom types to array for UI
const ATOM_TYPES = Object.entries(PHYSICS_ATOM_TYPES).map(([id, data]) => ({
  id: parseInt(id, 10),
  name: data.name,
  symbol: data.symbol,
  color: data.color,
}));

/**
 * Control Panel Component
 * Provides controls for the simulation
 */
function ControlPanel() {
  const simulation = useSimulation();
  const parameters = useParameters();
  const dispatch = useSimulationDispatch();
  const [selectedForceField, setSelectedForceField] = useState('');
  const [showMetals, setShowMetals] = useState(false);

  // Split atom types into organic and metals
  const organicAtoms = ATOM_TYPES.filter(t => t.id <= 6);
  const metalAtoms = ATOM_TYPES.filter(t => t.id > 6);

  const handleAddAtom = () => {
    const x = Math.random() * simulation.size.x * 0.6 + simulation.size.x * 0.2;
    const y = Math.random() * simulation.size.y * 0.6 + simulation.size.y * 0.2;
    dispatch({ 
      type: 'ADD_ATOM', 
      payload: { x, y, z: 0, atomType: simulation.selectedAtomType } 
    });
  };

  const handleLoadMolecule = (moleculeKey) => {
    const molecule = MOLECULE_PRESETS[moleculeKey];
    if (molecule) {
      dispatch({ 
        type: 'LOAD_MOLECULE', 
        payload: { atoms: molecule.atoms } 
      });
    }
  };

  const handleAtomTypeChange = (typeId) => {
    dispatch({ type: 'SET_ATOM_TYPE', payload: typeId });
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
      <h3>Simulation Controls</h3>
      
      <div className="control-group">
        <button 
          className="control-button primary"
          onClick={() => dispatch({ type: 'RESET_SIMULATION' })}
        >
          🔄 Restart
        </button>
        
        <button 
          className={`control-button ${simulation.isPaused ? 'paused' : 'running'}`}
          onClick={() => dispatch({ type: 'TOGGLE_PAUSE' })}
        >
          {simulation.isPaused ? '▶ Play' : '⏸ Pause'}
        </button>
        
        <button 
          className="control-button danger"
          onClick={() => dispatch({ type: 'CLEAR_ATOMS' })}
        >
          🗑 Clear All
        </button>
      </div>

      <div className="control-section">
        <h4>Add Atom</h4>
        <div className="molecule-category">
          <label className="category-label" htmlFor="organic-atoms">Elements</label>
          <select
            id="organic-atoms"
            className="molecule-select"
            value=""
            onChange={(e) => {
              if (e.target.value) {
                const atomType = parseInt(e.target.value, 10);
                handleAtomTypeChange(atomType);
                // Add atom immediately when selected
                const x = Math.random() * simulation.size.x * 0.6 + simulation.size.x * 0.2;
                const y = Math.random() * simulation.size.y * 0.6 + simulation.size.y * 0.2;
                dispatch({
                  type: 'ADD_ATOM',
                  payload: { x, y, z: 0, atomType: atomType },
                });
              }
            }}
          >
            <option value="">Select element...</option>
            {organicAtoms.map(type => (
              <option key={type.id} value={type.id}>
                {type.symbol} - {type.name}
              </option>
            ))}
          </select>
        </div>
        <div className="molecule-category">
          <label className="category-label" htmlFor="metal-atoms">Metals & Others</label>
          <select
            id="metal-atoms"
            className="molecule-select"
            value=""
            onChange={(e) => {
              if (e.target.value) {
                const atomType = parseInt(e.target.value, 10);
                handleAtomTypeChange(atomType);
                // Add atom immediately when selected
                const x = Math.random() * simulation.size.x * 0.6 + simulation.size.x * 0.2;
                const y = Math.random() * simulation.size.y * 0.6 + simulation.size.y * 0.2;
                dispatch({
                  type: 'ADD_ATOM',
                  payload: { x, y, z: 0, atomType: atomType },
                });
              }
            }}
          >
            <option value="">Select metal atom...</option>
            {metalAtoms.map(type => (
              <option key={type.id} value={type.id}>
                {type.symbol} - {type.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="control-section molecules-section">
        <div className="molecule-category">
          <label className="category-label" htmlFor="metal-molecules">Metal Molecules</label>
          <select
            id="metal-molecules"
            className="molecule-select"
            value=""
            onChange={(e) => {
              if (e.target.value) {
                handleLoadMolecule(e.target.value);
                e.target.value = '';
              }
            }}
          >
            <option value="">Select a molecule...</option>
            {Object.entries(MOLECULE_PRESETS)
              .filter(([, mol]) => mol.category === 'metals')
              .map(([key, mol]) => (
                <option key={key} value={key}>
                  {mol.name}
                </option>
              ))}
          </select>
        </div>
        <div className="molecule-category">
          <label className="category-label" htmlFor="common-molecules">Molecules</label>
          <select
            id="common-molecules"
            className="molecule-select"
            value=""
            onChange={(e) => {
              if (e.target.value) {
                handleLoadMolecule(e.target.value);
                e.target.value = '';
              }
            }}
          >
            <option value="">Select a molecule...</option>
            {Object.entries(MOLECULE_PRESETS)
              .filter(([, mol]) => mol.category === 'common')
              .map(([key, mol]) => (
                <option key={key} value={key}>
                  {mol.name}
                </option>
              ))}
          </select>
        </div>
      </div>

      <div className="control-section">
        <h4>Force Field</h4>
        <select 
          className="force-field-select"
          value={selectedForceField}
          onChange={handleForceFieldChange}
        >
          <option value="">Select Force Field...</option>
          {getAvailableForceFields().map(ff => {
            const info = getForceFieldInfo(ff);
            return (
              <option key={ff} value={ff}>
                {info.name}
              </option>
            );
          })}
        </select>
        {selectedForceField && (
          <div className="force-field-info">
            <p>{getForceFieldInfo(selectedForceField).description}</p>
            <small>
              Elements: {getForceFieldInfo(selectedForceField).elements.join(', ')}
            </small>
          </div>
        )}
      </div>

      <div className="control-section">
        <h4>Display Options</h4>
        <label className="toggle-label">
          <input
            type="checkbox"
            checked={!simulation.clearScreen}
            onChange={() => dispatch({ type: 'TOGGLE_CLEAR' })}
          />
          Trail Effect
        </label>
        <label className="toggle-label">
          <input
            type="checkbox"
            checked={simulation.showBonds}
            onChange={() => dispatch({ type: 'TOGGLE_BONDS' })}
          />
          Show Bonds
        </label>
        <label className="toggle-label">
          <input
            type="checkbox"
            checked={simulation.enablePhysics}
            onChange={() => dispatch({ type: 'TOGGLE_PHYSICS' })}
          />
          Physics Enabled
        </label>
      </div>

      <div className="info-section">
        <h4>Simulation Info</h4>
        <div className="info-grid">
          <span>Atoms:</span><span>{simulation.atoms.length}</span>
          <span>Bonds:</span><span>{simulation.bonds?.length || 0}</span>
          <span>Time:</span><span>{simulation.time}</span>
          <span>Status:</span><span>{simulation.isPaused ? 'Paused' : 'Running'}</span>
        </div>
      </div>

      <div className="energy-section">
        <h4>Energy (kcal/mol)</h4>
        <div className="energy-grid">
          <span>Kinetic:</span><span>{simulation.energy?.kinetic?.toFixed(2) || '0.00'}</span>
          <span>Potential:</span><span>{simulation.energy?.potential?.toFixed(2) || '0.00'}</span>
          <span>Total:</span><span>{simulation.energy?.total?.toFixed(2) || '0.00'}</span>
          <span>Temp (K):</span><span>{simulation.temperature?.toFixed(0) || '0'}</span>
        </div>
      </div>

      {parameters.isLoaded && (
        <div className="params-section">
          <h4>✓ ReaxFF Parameters</h4>
          <p className="params-info">Force field loaded successfully</p>
        </div>
      )}

      <div className="instructions">
        <h4>Controls</h4>
        <ul>
          <li><kbd>←</kbd><kbd>→</kbd><kbd>↑</kbd><kbd>↓</kbd> Move selected atom</li>
          <li>Click molecules to add to simulation</li>
          <li>Upload .ff file for ReaxFF parameters</li>
        </ul>
      </div>
    </div>
  );
}

export default ControlPanel;
