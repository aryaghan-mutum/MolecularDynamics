/**
 * @fileoverview Settings Modal Component
 * @description Provides UI for customizing simulation parameters and display options
 * @module components/SettingsModal
 */

import { useState, useRef, useCallback, useEffect } from 'react';
import { useSimulation, useSimulationDispatch } from '../context/SimulationContext';
import { useParametersActions, useParameters } from '../context/ParametersContext';
import { parseParameterFile } from '../simulation/fileReader';
import './SettingsModal.css';

/**
 * Settings categories for organization
 */
const SETTINGS_TABS = [
  { id: 'simulation', label: 'Simulation', icon: '⚛️' },
  { id: 'display', label: 'Display', icon: '🎨' },
  { id: 'physics', label: 'Physics', icon: '🔬' },
  { id: 'controls', label: 'Controls', icon: '🎮' },
  { id: 'data', label: 'Data', icon: '📁' },
  { id: 'analysis', label: 'Analysis', icon: '📊' },
];

/**
 * Settings Modal Component
 * Allows users to customize simulation parameters, display options, and physics settings
 * @param {Object} props - Component props
 * @param {boolean} [props.isOpenExternal] - External open state control
 * @param {Function} [props.onCloseExternal] - External close handler
 * @returns {JSX.Element} Settings modal with toggle button
 */
function SettingsModal({ isOpenExternal, onCloseExternal }) {
  const simulation = useSimulation();
  const dispatch = useSimulationDispatch();
  const parameters = useParameters();
  const { setParameters } = useParametersActions();
  const [isOpenInternal, setIsOpenInternal] = useState(false);
  const [activeTab, setActiveTab] = useState('simulation');
  const fileInputRef = useRef(null);
  const downloadLinkRef = useRef(null);
  const [fileStatus, setFileStatus] = useState({ type: '', message: '' });
  const [isLoading, setIsLoading] = useState(false);

  // Support both internal button and external hamburger menu
  const isOpen = isOpenExternal !== undefined ? isOpenExternal : isOpenInternal;

  // Local state for settings (applied on save)
  const [settings, setSettings] = useState({
    timestep: simulation.dt,
    scale: simulation.scale,
    wallSpring: simulation.wallSpring,
    maxVel: simulation.maxVel,
    showBonds: simulation.showBonds,
    clearScreen: simulation.clearScreen,
    enablePhysics: simulation.enablePhysics,
  });

  const handleOpen = () => {
    // Sync settings with current simulation state
    setSettings({
      timestep: simulation.dt,
      scale: simulation.scale,
      wallSpring: simulation.wallSpring,
      maxVel: simulation.maxVel,
      showBonds: simulation.showBonds,
      clearScreen: simulation.clearScreen,
      enablePhysics: simulation.enablePhysics,
    });
    setIsOpenInternal(true);
  };

  const handleClose = () => {
    if (onCloseExternal) {
      onCloseExternal();
    } else {
      setIsOpenInternal(false);
    }
  };

  // Sync settings when modal opens (via useEffect to avoid render loop)
  const prevIsOpenRef = useRef(false);
  useEffect(() => {
    if (isOpen && !prevIsOpenRef.current) {
      // Modal just opened, sync settings
      setSettings({
        timestep: simulation.dt,
        scale: simulation.scale,
        wallSpring: simulation.wallSpring,
        maxVel: simulation.maxVel,
        showBonds: simulation.showBonds,
        clearScreen: simulation.clearScreen,
        enablePhysics: simulation.enablePhysics,
      });
    }
    prevIsOpenRef.current = isOpen;
  }, [isOpen, simulation.dt, simulation.scale, simulation.wallSpring, simulation.maxVel, simulation.showBonds, simulation.clearScreen, simulation.enablePhysics]);

  const handleBackdropClick = (e) => {
    if (e.target.classList.contains('settings-modal-backdrop')) {
      handleClose();
    }
  };

  const handleSettingChange = (key, value) => {
    setSettings(prev => ({ ...prev, [key]: value }));
  };

  const handleApply = () => {
    // Apply all settings
    if (settings.scale !== simulation.scale) {
      dispatch({ type: 'SET_SCALE', payload: { scale: settings.scale } });
    }
    if (settings.showBonds !== simulation.showBonds) {
      dispatch({ type: 'TOGGLE_BONDS' });
    }
    if (settings.clearScreen !== simulation.clearScreen) {
      dispatch({ type: 'TOGGLE_CLEAR' });
    }
    if (settings.enablePhysics !== simulation.enablePhysics) {
      dispatch({ type: 'TOGGLE_PHYSICS' });
    }
    dispatch({ 
      type: 'UPDATE_SETTINGS', 
      payload: {
        dt: settings.timestep,
        wallSpring: settings.wallSpring,
        maxVel: settings.maxVel,
      }
    });
    handleClose();
  };

  const handleReset = () => {
    setSettings({
      timestep: 0.05,
      scale: 20.0,
      wallSpring: 50.0,
      maxVel: 10.0,
      showBonds: true,
      clearScreen: true,
      enablePhysics: true,
    });
  };

  // File loading handler
  const handleFileChange = useCallback(async (event) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setIsLoading(true);
    setFileStatus({ type: 'info', message: 'Loading parameters...' });

    try {
      const text = await file.text();
      const params = parseParameterFile(text);
      
      setParameters({
        r_ij: 1.2,
        ...params,
      });

      setFileStatus({ 
        type: 'success', 
        message: `✓ ${file.name} loaded!` 
      });
    } catch (error) {
      console.error('Error parsing file:', error);
      setFileStatus({ 
        type: 'error', 
        message: `Error: ${error.message}` 
      });
    } finally {
      setIsLoading(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  }, [setParameters]);

  // Export functions
  const generateFilename = (extension) => {
    const date = new Date();
    const timestamp = date.toISOString().slice(0, 19).replace(/[:-]/g, '');
    return `md_simulation_${timestamp}.${extension}`;
  };

  const downloadFile = (content, filename, mimeType) => {
    const blob = new Blob([content], { type: mimeType });
    const url = URL.createObjectURL(blob);
    
    if (downloadLinkRef.current) {
      downloadLinkRef.current.href = url;
      downloadLinkRef.current.download = filename;
      downloadLinkRef.current.click();
      URL.revokeObjectURL(url);
    }
  };

  const exportJSON = () => {
    const data = {
      exportedAt: new Date().toISOString(),
      simulation: {
        time: simulation.time,
        temperature: simulation.temperature,
        energy: simulation.energy,
        settings: {
          dt: simulation.dt,
          scale: simulation.scale,
          size: simulation.size,
          enablePhysics: simulation.enablePhysics,
          showBonds: simulation.showBonds,
        },
      },
      atoms: simulation.atoms.map(atom => ({
        id: atom.id,
        type: atom.type,
        symbol: atom.symbol,
        position: atom.pos,
        velocity: atom.vel,
      })),
      bonds: simulation.bonds.map(bond => ({
        atom1: bond.atom1Id,
        atom2: bond.atom2Id,
        order: bond.order,
      })),
    };
    downloadFile(JSON.stringify(data, null, 2), generateFilename('json'), 'application/json');
  };

  const exportCSV = () => {
    const headers = ['ID', 'Symbol', 'X', 'Y', 'Z', 'VX', 'VY', 'VZ'];
    const rows = simulation.atoms.map(atom => [
      atom.id, atom.symbol,
      atom.pos.x.toFixed(4), atom.pos.y.toFixed(4), atom.pos.z.toFixed(4),
      atom.vel.x.toFixed(4), atom.vel.y.toFixed(4), atom.vel.z.toFixed(4),
    ]);
    const csv = [headers.join(','), ...rows.map(row => row.join(','))].join('\n');
    downloadFile(csv, generateFilename('csv'), 'text/csv');
  };

  const exportXYZ = () => {
    const lines = [
      simulation.atoms.length.toString(),
      `MD Export - Time: ${simulation.time}`,
      ...simulation.atoms.map(atom => 
        `${atom.symbol}  ${atom.pos.x.toFixed(6)}  ${atom.pos.y.toFixed(6)}  ${atom.pos.z.toFixed(6)}`
      ),
    ];
    downloadFile(lines.join('\n'), generateFilename('xyz'), 'chemical/x-xyz');
  };

  const exportScreenshot = () => {
    const canvas = document.querySelector('canvas');
    if (!canvas) return;
    try {
      const link = document.createElement('a');
      link.href = canvas.toDataURL('image/png');
      link.download = generateFilename('png');
      link.click();
    } catch (error) {
      console.error('Screenshot failed:', error);
    }
  };

  return (
    <>
      {isOpenExternal === undefined && (
        <button 
          className="settings-button" 
          onClick={handleOpen}
          title="Settings"
          aria-label="Settings"
        >
          ⚙️ Settings
        </button>
      )}

      {isOpen && (
        <div 
          className="settings-modal-backdrop" 
          onClick={handleBackdropClick}
          role="dialog"
          aria-modal="true"
          aria-labelledby="settings-title"
        >
          <div className="settings-modal">
            <div className="settings-header">
              <h2 id="settings-title">Settings</h2>
              <button 
                className="settings-modal-close" 
                onClick={handleClose}
                aria-label="Close"
              >
                ✕
              </button>
            </div>

            <div className="settings-tabs">
              {SETTINGS_TABS.map(tab => (
                <button
                  key={tab.id}
                  className={`settings-tab ${activeTab === tab.id ? 'active' : ''}`}
                  onClick={() => setActiveTab(tab.id)}
                >
                  <span className="tab-icon">{tab.icon}</span>
                  {tab.label}
                </button>
              ))}
            </div>

            <div className="settings-content">
              {activeTab === 'simulation' && (
                <div className="settings-section">
                  <div className="setting-item">
                    <label htmlFor="timestep">Time Step (dt)</label>
                    <div className="setting-control">
                      <input
                        id="timestep"
                        type="range"
                        min="0.01"
                        max="0.2"
                        step="0.01"
                        value={settings.timestep}
                        onChange={(e) => handleSettingChange('timestep', parseFloat(e.target.value))}
                      />
                      <span className="setting-value">{settings.timestep.toFixed(2)}</span>
                    </div>
                    <p className="setting-hint">Smaller values = more accurate but slower</p>
                  </div>

                  <div className="setting-item">
                    <label htmlFor="scale">Zoom Scale</label>
                    <div className="setting-control">
                      <input
                        id="scale"
                        type="range"
                        min="5"
                        max="50"
                        step="1"
                        value={settings.scale}
                        onChange={(e) => handleSettingChange('scale', parseFloat(e.target.value))}
                      />
                      <span className="setting-value">{settings.scale.toFixed(0)}x</span>
                    </div>
                    <p className="setting-hint">Adjust visualization zoom level</p>
                  </div>

                  <div className="setting-item">
                    <label>
                      <input
                        type="checkbox"
                        checked={settings.enablePhysics}
                        onChange={(e) => handleSettingChange('enablePhysics', e.target.checked)}
                      />
                      Enable Physics Simulation
                    </label>
                    <p className="setting-hint">Toggle force calculations and motion</p>
                  </div>
                </div>
              )}

              {activeTab === 'display' && (
                <div className="settings-section">
                  <div className="setting-item">
                    <label>
                      <input
                        type="checkbox"
                        checked={settings.showBonds}
                        onChange={(e) => handleSettingChange('showBonds', e.target.checked)}
                      />
                      Show Bond Lines
                    </label>
                    <p className="setting-hint">Display bonds between nearby atoms</p>
                  </div>

                  <div className="setting-item">
                    <label>
                      <input
                        type="checkbox"
                        checked={settings.clearScreen}
                        onChange={(e) => handleSettingChange('clearScreen', e.target.checked)}
                      />
                      Clear Screen Each Frame
                    </label>
                    <p className="setting-hint">Disable for trail effect</p>
                  </div>

                  <div className="setting-item">
                    <label htmlFor="theme-select">Theme</label>
                    <select
                      id="theme-select"
                      className="theme-select"
                      value={simulation.theme}
                      onChange={(e) => dispatch({ type: 'SET_THEME', payload: e.target.value })}
                    >
                      <option value="dark">Dark Theme</option>
                      <option value="light">Light Theme</option>
                    </select>
                    <p className="setting-hint">Change simulation background color</p>
                  </div>
                </div>
              )}

              {activeTab === 'physics' && (
                <div className="settings-section">
                  <div className="setting-item">
                    <label htmlFor="wallSpring">Wall Spring Constant</label>
                    <div className="setting-control">
                      <input
                        id="wallSpring"
                        type="range"
                        min="10"
                        max="200"
                        step="5"
                        value={settings.wallSpring}
                        onChange={(e) => handleSettingChange('wallSpring', parseFloat(e.target.value))}
                      />
                      <span className="setting-value">{settings.wallSpring.toFixed(0)}</span>
                    </div>
                    <p className="setting-hint">How hard atoms bounce off walls</p>
                  </div>

                  <div className="setting-item">
                    <label htmlFor="maxVel">Max Velocity</label>
                    <div className="setting-control">
                      <input
                        id="maxVel"
                        type="range"
                        min="1"
                        max="50"
                        step="1"
                        value={settings.maxVel}
                        onChange={(e) => handleSettingChange('maxVel', parseFloat(e.target.value))}
                      />
                      <span className="setting-value">{settings.maxVel.toFixed(0)} Å/fs</span>
                    </div>
                    <p className="setting-hint">Velocity clipping for stability</p>
                  </div>
                </div>
              )}

              {activeTab === 'controls' && (
                <div className="settings-section">
                  <h4 className="section-title">Keyboard Shortcuts</h4>
                  <div className="controls-list">
                    <div className="control-row">
                      <span className="keys"><kbd>↑</kbd><kbd>↓</kbd><kbd>←</kbd><kbd>→</kbd></span>
                      <span className="description">Move player atom</span>
                    </div>
                    <div className="control-row">
                      <span className="keys"><kbd>Space</kbd></span>
                      <span className="description">Pause/Resume simulation</span>
                    </div>
                    <div className="control-row">
                      <span className="keys"><kbd>R</kbd></span>
                      <span className="description">Reset simulation</span>
                    </div>
                    <div className="control-row">
                      <span className="keys"><kbd>B</kbd></span>
                      <span className="description">Toggle bond display</span>
                    </div>
                    <div className="control-row">
                      <span className="keys"><kbd>V</kbd></span>
                      <span className="description">Toggle velocity vectors</span>
                    </div>
                    <div className="control-row">
                      <span className="keys"><kbd>L</kbd></span>
                      <span className="description">Toggle atom labels</span>
                    </div>
                    <div className="control-row">
                      <span className="keys"><kbd>F</kbd></span>
                      <span className="description">Toggle fullscreen</span>
                    </div>
                    <div className="control-row">
                      <span className="keys"><kbd>Ctrl</kbd>+<kbd>Z</kbd></span>
                      <span className="description">Undo</span>
                    </div>
                    <div className="control-row">
                      <span className="keys"><kbd>Ctrl</kbd>+<kbd>Y</kbd></span>
                      <span className="description">Redo</span>
                    </div>
                    <div className="control-row">
                      <span className="keys"><kbd>Delete</kbd></span>
                      <span className="description">Remove selected atom</span>
                    </div>
                  </div>
                  <h4 className="section-title">Mouse Controls</h4>
                  <div className="controls-list">
                    <div className="control-row">
                      <span className="keys">Click</span>
                      <span className="description">Select atom</span>
                    </div>
                    <div className="control-row">
                      <span className="keys">Double-click</span>
                      <span className="description">Add atom at position</span>
                    </div>
                    <div className="control-row">
                      <span className="keys">Drag</span>
                      <span className="description">Move selected atom</span>
                    </div>
                    <div className="control-row">
                      <span className="keys">Right-drag</span>
                      <span className="description">Pan view</span>
                    </div>
                    <div className="control-row">
                      <span className="keys">Scroll</span>
                      <span className="description">Zoom in/out</span>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'data' && (
                <div className="settings-section">
                  <h4 className="section-title">📁 Load Parameters</h4>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept=".ff,.txt,text/plain"
                    onChange={handleFileChange}
                    style={{ display: 'none' }}
                  />
                  <div className="data-row">
                    {parameters.isLoaded ? (
                      <div className="loaded-badge">
                        <span className="check">✓</span> ReaxFF Parameters Active
                      </div>
                    ) : (
                      <p className="setting-hint">Load ReaxFF force field parameters</p>
                    )}
                    <button 
                      className="settings-btn secondary"
                      onClick={() => fileInputRef.current?.click()}
                      disabled={isLoading}
                    >
                      {isLoading ? '⟳ Loading...' : '📂 Select File'}
                    </button>
                  </div>
                  {fileStatus.message && (
                    <div className={`file-status ${fileStatus.type}`}>{fileStatus.message}</div>
                  )}

                  <h4 className="section-title">📤 Export Data</h4>
                  <div className="export-buttons">
                    <button className="settings-btn secondary" onClick={exportJSON} title="Full simulation state">
                      📄 JSON
                    </button>
                    <button className="settings-btn secondary" onClick={exportCSV} title="Atom data spreadsheet">
                      📊 CSV
                    </button>
                    <button className="settings-btn secondary" onClick={exportXYZ} title="Molecular XYZ format">
                      🧬 XYZ
                    </button>
                    <button className="settings-btn secondary" onClick={exportScreenshot} title="Canvas screenshot">
                      📸 Screenshot
                    </button>
                  </div>
                  <a ref={downloadLinkRef} style={{ display: 'none' }} aria-hidden="true">Download</a>

                  <h4 className="section-title">💾 Save/Load Simulation</h4>
                  <div className="save-load-buttons">
                    <button 
                      className="settings-btn secondary" 
                      onClick={() => {
                        const stateData = {
                          atoms: simulation.atoms,
                          bonds: simulation.bonds,
                          playerId: simulation.playerId,
                          nextAtomId: simulation.nextAtomId,
                          savedAt: new Date().toISOString(),
                        };
                        const blob = new Blob([JSON.stringify(stateData, null, 2)], { type: 'application/json' });
                        const url = URL.createObjectURL(blob);
                        const link = document.createElement('a');
                        link.href = url;
                        link.download = `simulation-state-${Date.now()}.json`;
                        link.click();
                        URL.revokeObjectURL(url);
                      }}
                      title="Save current simulation state"
                    >
                      💾 Save State
                    </button>
                    <input
                      type="file"
                      id="load-state-input"
                      accept=".json"
                      style={{ display: 'none' }}
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (!file) return;
                        const reader = new FileReader();
                        reader.onload = (event) => {
                          try {
                            const savedState = JSON.parse(event.target.result);
                            dispatch({ type: 'LOAD_SIMULATION_STATE', payload: savedState });
                            setFileStatus({ type: 'success', message: '✓ Simulation loaded!' });
                          } catch (err) {
                            setFileStatus({ type: 'error', message: 'Error loading state: ' + err.message });
                          }
                        };
                        reader.readAsText(file);
                        e.target.value = '';
                      }}
                    />
                    <button 
                      className="settings-btn secondary" 
                      onClick={() => document.getElementById('load-state-input')?.click()}
                      title="Load saved simulation state"
                    >
                      📂 Load State
                    </button>
                  </div>
                </div>
              )}

              {activeTab === 'analysis' && (
                <div className="settings-section">
                  <h4 className="section-title">📊 Radial Distribution Function</h4>
                  <p className="setting-hint">Shows the probability of finding atom pairs at distance r</p>
                  <button 
                    className="settings-btn primary"
                    onClick={() => dispatch({ type: 'CALCULATE_RDF' })}
                    disabled={simulation.atoms.length < 2}
                  >
                    Calculate RDF
                  </button>
                  {simulation.rdfData.length > 0 && (
                    <div className="rdf-chart">
                      <svg viewBox="0 0 300 150" className="rdf-svg">
                        {/* Axes */}
                        <line x1="40" y1="130" x2="290" y2="130" stroke="#666" strokeWidth="1" />
                        <line x1="40" y1="10" x2="40" y2="130" stroke="#666" strokeWidth="1" />
                        
                        {/* Labels */}
                        <text x="165" y="148" fontSize="10" fill="#888" textAnchor="middle">Distance (r)</text>
                        <text x="12" y="70" fontSize="10" fill="#888" textAnchor="middle" transform="rotate(-90, 12, 70)">g(r)</text>
                        
                        {/* Data */}
                        <polyline
                          fill="none"
                          stroke="#4CAF50"
                          strokeWidth="2"
                          points={simulation.rdfData.map((d, i) => {
                            const maxG = Math.max(...simulation.rdfData.map(p => p.g), 1);
                            const x = 40 + (i / simulation.rdfData.length) * 250;
                            const y = 130 - (d.g / maxG) * 110;
                            return `${x},${y}`;
                          }).join(' ')}
                        />
                      </svg>
                    </div>
                  )}

                  <h4 className="section-title">📈 Current Statistics</h4>
                  <div className="stats-grid">
                    <div className="stat-item">
                      <span className="stat-label">Atoms</span>
                      <span className="stat-value">{simulation.atoms.length}</span>
                    </div>
                    <div className="stat-item">
                      <span className="stat-label">Bonds</span>
                      <span className="stat-value">{simulation.bonds.length}</span>
                    </div>
                    <div className="stat-item">
                      <span className="stat-label">Temperature</span>
                      <span className="stat-value">{simulation.temperature.toFixed(1)} K</span>
                    </div>
                    <div className="stat-item">
                      <span className="stat-label">Kinetic E</span>
                      <span className="stat-value">{simulation.energy.kinetic.toFixed(2)}</span>
                    </div>
                    <div className="stat-item">
                      <span className="stat-label">Potential E</span>
                      <span className="stat-value">{simulation.energy.potential.toFixed(2)}</span>
                    </div>
                    <div className="stat-item">
                      <span className="stat-label">Total E</span>
                      <span className="stat-value">{simulation.energy.total.toFixed(2)}</span>
                    </div>
                  </div>
                </div>
              )}
            </div>

            <div className="settings-footer">
              <button className="settings-btn secondary" onClick={handleReset}>
                Reset Defaults
              </button>
              <div className="settings-footer-right">
                <button className="settings-btn secondary" onClick={handleClose}>
                  Cancel
                </button>
                <button className="settings-btn primary" onClick={handleApply}>
                  Apply
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default SettingsModal;
