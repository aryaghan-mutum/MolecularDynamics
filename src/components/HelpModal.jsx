/**
 * @fileoverview Help Modal Component
 * @description Interactive tutorial and help documentation for the simulation
 * @module components/HelpModal
 */

import { useState, useEffect } from 'react';
import './HelpModal.css';

/**
 * Tutorial steps for guided walkthrough
 */
const TUTORIAL_STEPS = [
  {
    id: 1,
    title: 'Welcome!',
    icon: '👋',
    content: `Welcome to the Molecular Dynamics Simulation! This tutorial will guide you through 
    the basics of using the application. Click "Next" to continue.`,
  },
  {
    id: 2,
    title: 'Adding Atoms',
    icon: '⚛️',
    content: `Use the atom selector buttons (H, C, O, N) to choose an atom type, then click 
    on the canvas to add atoms. Each atom type has different properties like mass and radius.`,
  },
  {
    id: 3,
    title: 'Loading Molecules',
    icon: '🧬',
    content: `Click on preset molecules (Water, Methane, CO₂, etc.) to instantly add complete 
    molecular structures. Molecules are placed at the center of the simulation area.`,
  },
  {
    id: 4,
    title: 'Controlling the Simulation',
    icon: '⏯️',
    content: `Use the Play/Pause button to start or stop the physics simulation. 
    The Reset button clears all atoms and restarts with a water molecule.`,
  },
  {
    id: 5,
    title: 'Player Control',
    icon: '🎮',
    content: `The first atom (highlighted with a ring) is the "player atom". Use the 
    arrow keys to apply forces and move it around. This is great for exploring interactions!`,
  },
  {
    id: 6,
    title: 'Energy Monitoring',
    icon: '📊',
    content: `Watch the Energy Monitor panel to see kinetic, potential, and total energy 
    in real-time. Expand the graph for a visual history of energy changes.`,
  },
  {
    id: 7,
    title: 'Settings & Customization',
    icon: '⚙️',
    content: `Click Settings in the header to adjust simulation parameters like time step, 
    wall bounce strength, and display options. Experiment to see how they affect behavior!`,
  },
  {
    id: 8,
    title: 'ReaxFF Parameters',
    icon: '📂',
    content: `Use the File Uploader to load ReaxFF force field parameter files. These 
    contain the physics parameters for reactive molecular dynamics.`,
  },
  {
    id: 9,
    title: 'You\'re Ready!',
    icon: '🚀',
    content: `That's the basics! Explore, experiment, and have fun watching atoms interact. 
    Remember: smaller time steps = more accurate but slower simulation.`,
  },
];

/**
 * Quick reference keyboard shortcuts
 */
const KEYBOARD_SHORTCUTS = [
  { keys: ['↑', '↓', '←', '→'], description: 'Move player atom' },
  { keys: ['Space'], description: 'Pause/Resume simulation' },
  { keys: ['R'], description: 'Reset simulation' },
  { keys: ['B'], description: 'Toggle bond display' },
  { keys: ['P'], description: 'Toggle physics' },
];

/**
 * Help Modal Component
 * Provides interactive tutorial and quick reference
 * @param {Object} props - Component props
 * @param {boolean} [props.isOpenExternal] - External open state control
 * @param {Function} [props.onCloseExternal] - External close handler
 * @returns {JSX.Element} Help modal with tutorial
 */
function HelpModal({ isOpenExternal, onCloseExternal }) {
  const [isOpenInternal, setIsOpenInternal] = useState(false);
  const [activeTab, setActiveTab] = useState('tutorial');
  const [currentStep, setCurrentStep] = useState(0);

  // Support both internal button and external hamburger menu
  const isOpen = isOpenExternal !== undefined ? isOpenExternal : isOpenInternal;
  const handleOpen = () => setIsOpenInternal(true);
  const handleClose = () => {
    if (onCloseExternal) {
      onCloseExternal();
    } else {
      setIsOpenInternal(false);
    }
  };

  const handleBackdropClick = (e) => {
    if (e.target.classList.contains('help-modal-backdrop')) {
      handleClose();
    }
  };

  // Keyboard navigation
  useEffect(() => {
    if (!isOpen) return;
    
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') handleClose();
      if (activeTab === 'tutorial') {
        if (e.key === 'ArrowRight' || e.key === 'Enter') {
          setCurrentStep(prev => Math.min(prev + 1, TUTORIAL_STEPS.length - 1));
        }
        if (e.key === 'ArrowLeft') {
          setCurrentStep(prev => Math.max(prev - 1, 0));
        }
      }
    };
    
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, activeTab]);

  const nextStep = () => {
    if (currentStep < TUTORIAL_STEPS.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      handleClose();
    }
  };

  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const step = TUTORIAL_STEPS[currentStep];

  return (
    <>
      {isOpenExternal === undefined && (
        <button 
          className="help-button" 
          onClick={handleOpen}
          title="Help & Tutorial"
          aria-label="Help"
        >
          ❓ Help
        </button>
      )}

      {isOpen && (
        <div 
          className="help-modal-backdrop" 
          onClick={handleBackdropClick}
          role="dialog"
          aria-modal="true"
          aria-labelledby="help-title"
        >
          <div className="help-modal">
            <div className="help-header">
              <h2 id="help-title">Help & Tutorial</h2>
              <button 
                className="help-modal-close" 
                onClick={handleClose}
                aria-label="Close"
              >
                ✕
              </button>
            </div>

            <div className="help-tabs">
              <button
                className={`help-tab ${activeTab === 'tutorial' ? 'active' : ''}`}
                onClick={() => setActiveTab('tutorial')}
              >
                📚 Tutorial
              </button>
              <button
                className={`help-tab ${activeTab === 'reference' ? 'active' : ''}`}
                onClick={() => setActiveTab('reference')}
              >
                ⌨️ Quick Reference
              </button>
              <button
                className={`help-tab ${activeTab === 'physics' ? 'active' : ''}`}
                onClick={() => setActiveTab('physics')}
              >
                🔬 Physics Info
              </button>
            </div>

            <div className="help-content">
              {activeTab === 'tutorial' && (
                <div className="tutorial-view">
                  <div className="tutorial-progress">
                    {TUTORIAL_STEPS.map((_, index) => (
                      <div
                        key={index}
                        className={`progress-dot ${index === currentStep ? 'active' : ''} ${index < currentStep ? 'completed' : ''}`}
                        onClick={() => setCurrentStep(index)}
                      />
                    ))}
                  </div>

                  <div className="tutorial-step">
                    <div className="step-icon">{step.icon}</div>
                    <h3 className="step-title">{step.title}</h3>
                    <p className="step-content">{step.content}</p>
                    <div className="step-counter">
                      Step {currentStep + 1} of {TUTORIAL_STEPS.length}
                    </div>
                  </div>

                  <div className="tutorial-nav">
                    <button
                      className="tutorial-btn secondary"
                      onClick={prevStep}
                      disabled={currentStep === 0}
                    >
                      ← Previous
                    </button>
                    <button
                      className="tutorial-btn primary"
                      onClick={nextStep}
                    >
                      {currentStep === TUTORIAL_STEPS.length - 1 ? 'Finish' : 'Next →'}
                    </button>
                  </div>
                </div>
              )}

              {activeTab === 'reference' && (
                <div className="reference-view">
                  <h3>Keyboard Shortcuts</h3>
                  <div className="shortcuts-list">
                    {KEYBOARD_SHORTCUTS.map((shortcut, index) => (
                      <div key={index} className="shortcut-item">
                        <div className="shortcut-keys">
                          {shortcut.keys.map((key, i) => (
                            <kbd key={i}>{key}</kbd>
                          ))}
                        </div>
                        <span className="shortcut-desc">{shortcut.description}</span>
                      </div>
                    ))}
                  </div>

                  <h3>Mouse Controls</h3>
                  <div className="shortcuts-list">
                    <div className="shortcut-item">
                      <span className="mouse-action">Click</span>
                      <span className="shortcut-desc">Add selected atom type</span>
                    </div>
                    <div className="shortcut-item">
                      <span className="mouse-action">Scroll</span>
                      <span className="shortcut-desc">Zoom in/out (when enabled)</span>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'physics' && (
                <div className="physics-view">
                  <h3>Physics Formulas & Forces</h3>
                  
                  <div className="physics-section">
                    <h4>🔴 Active Forces in Simulation</h4>
                    <ul className="forces-list">
                      <li><strong>Lennard-Jones Force:</strong> Attractive/repulsive van der Waals interactions between all atom pairs</li>
                      <li><strong>Wall Force:</strong> Harmonic spring force at boundaries (reflective mode)</li>
                      <li><strong>Coulomb Force:</strong> Electrostatic interactions (when enabled)</li>
                      <li><strong>Player Force:</strong> External force applied via arrow keys</li>
                      <li><strong>Thermostat Force:</strong> Berendsen velocity rescaling (when enabled)</li>
                    </ul>
                  </div>

                  <div className="physics-section">
                    <h4>📐 Lennard-Jones Potential</h4>
                    <p>Models van der Waals forces (attraction at long range, repulsion at short range):</p>
                    <div className="formula">V(r) = 4ε[(σ/r)¹² - (σ/r)⁶]</div>
                    <div className="formula-desc">
                      <span>ε (epsilon) = well depth (0.185 kcal/mol)</span>
                      <span>σ (sigma) = equilibrium distance (1.91 Å)</span>
                      <span>r = distance between atoms</span>
                    </div>
                    <p>The force is the negative gradient: <strong>F = -dV/dr</strong></p>
                  </div>

                  <div className="physics-section">
                    <h4>⚡ Coulomb Potential</h4>
                    <p>Electrostatic interaction between charged particles:</p>
                    <div className="formula">V(r) = k × q₁q₂ / r</div>
                    <div className="formula-desc">
                      <span>k = 332.06 kcal·Å/(mol·e²)</span>
                      <span>q₁, q₂ = partial charges</span>
                    </div>
                  </div>

                  <div className="physics-section">
                    <h4>🌡️ Temperature & Kinetic Energy</h4>
                    <p>Temperature from equipartition theorem:</p>
                    <div className="formula">T = (2/3) × KE / (N × kB)</div>
                    <div className="formula-desc">
                      <span>KE = Σ(½mv²) = total kinetic energy</span>
                      <span>kB = 0.001987 kcal/(mol·K)</span>
                      <span>N = number of atoms</span>
                    </div>
                    <div className="formula">KE = ½mv² (per atom)</div>
                  </div>

                  <div className="physics-section">
                    <h4>🔄 Berendsen Thermostat</h4>
                    <p>Velocity rescaling to target temperature:</p>
                    <div className="formula">λ = √[1 + (Δt/τ)(T₀/T - 1)]</div>
                    <div className="formula-desc">
                      <span>τ = coupling constant (0.5 ps)</span>
                      <span>T₀ = target temperature</span>
                      <span>T = current temperature</span>
                      <span>v_new = λ × v_old</span>
                    </div>
                  </div>

                  <div className="physics-section">
                    <h4>⚙️ Integration Method</h4>
                    <p>Velocity Verlet algorithm for time evolution:</p>
                    <div className="formula">x(t+Δt) = x(t) + v(t)Δt + ½a(t)Δt²</div>
                    <div className="formula">v(t+Δt) = v(t) + ½[a(t) + a(t+Δt)]Δt</div>
                    <div className="formula-desc">
                      <span>Δt = time step (0.05 fs default)</span>
                      <span>a = F/m (Newton's 2nd law)</span>
                    </div>
                  </div>

                  <div className="physics-section">
                    <h4>🔗 Bond Order</h4>
                    <p>Calculated from interatomic distance:</p>
                    <div className="formula">BO = exp[-β(r - r₀)]</div>
                    <div className="formula-desc">
                      <span>r₀ = equilibrium bond length</span>
                      <span>β = decay parameter</span>
                      <span>Single: BO ≈ 1, Double: BO ≈ 2, Triple: BO ≈ 3</span>
                    </div>
                  </div>

                  <div className="physics-section">
                    <h4>📊 Mean Square Displacement (MSD)</h4>
                    <p>Measures diffusion of atoms over time:</p>
                    <div className="formula">MSD = ⟨|r(t) - r(0)|²⟩</div>
                    <div className="formula-desc">
                      <span>Related to diffusion: MSD = 6Dt (3D)</span>
                      <span>D = diffusion coefficient</span>
                    </div>
                  </div>

                  <div className="physics-section">
                    <h4>📈 Radial Distribution Function g(r)</h4>
                    <p>Probability of finding atoms at distance r:</p>
                    <div className="formula">g(r) = n(r) / (ρ × 4πr²dr)</div>
                    <div className="formula-desc">
                      <span>n(r) = atom count in shell [r, r+dr]</span>
                      <span>ρ = number density</span>
                      <span>Peaks indicate coordination shells</span>
                    </div>
                  </div>

                  <div className="physics-section">
                    <h4>⚖️ Energy Conservation</h4>
                    <div className="formula">E_total = KE + PE = constant</div>
                    <p>In an isolated system (no thermostat), total energy should be conserved. Deviations indicate numerical error or external forces.</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default HelpModal;
