/**
 * @fileoverview About Modal Component
 * @description Displays information about the Molecular Dynamics Simulation application
 * @module components/AboutModal
 */

import { useState } from 'react';
import packageJson from '../../package.json';
import './AboutModal.css';

const { version } = packageJson;

/**
 * About Modal Component
 * Provides information about the application, its features, and usage
 * @param {Object} props - Component props
 * @param {boolean} [props.isOpenExternal] - External open state control
 * @param {Function} [props.onCloseExternal] - External close handler
 * @returns {JSX.Element} About modal with toggle button
 */
function AboutModal({ isOpenExternal, onCloseExternal }) {
  const [isOpenInternal, setIsOpenInternal] = useState(false);

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

  // Close on backdrop click
  const handleBackdropClick = (e) => {
    if (e.target.classList.contains('about-modal-backdrop')) {
      handleClose();
    }
  };

  // Close on Escape key
  const handleKeyDown = (e) => {
    if (e.key === 'Escape') {
      handleClose();
    }
  };

  return (
    <>
      {isOpenExternal === undefined && (
        <button 
          className="about-button" 
          onClick={handleOpen}
          title="About this application"
          aria-label="About"
        >
          ℹ️ About
        </button>
      )}

      {isOpen && (
        <div 
          className="about-modal-backdrop" 
          onClick={handleBackdropClick}
          onKeyDown={handleKeyDown}
          role="dialog"
          aria-modal="true"
          aria-labelledby="about-title"
        >
          <div className="about-modal">
            <button 
              className="about-modal-close" 
              onClick={handleClose}
              aria-label="Close"
            >
              ✕
            </button>

            <h2 id="about-title">Molecular Dynamics Simulation</h2>
            
            <div className="about-content">
              <section className="about-section">
                <h3>🎯 What is This App?</h3>
                <p>
                  This is an <strong>interactive molecular dynamics (MD) simulation</strong> that lets you 
                  visualize and understand how atoms and molecules behave at the nanoscale. Watch atoms 
                  attract and repel each other, form bonds, vibrate, and exchange energy in real-time!
                </p>
              </section>

              <section className="about-section">
                <h3>🎓 Learning Objectives</h3>
                <ul>
                  <li><strong>Atomic Interactions:</strong> See how atoms attract at long distances (van der Waals) and repel when too close</li>
                  <li><strong>Energy Conservation:</strong> Watch kinetic and potential energy transform into each other while total energy stays constant</li>
                  <li><strong>Temperature:</strong> Understand that temperature is just average kinetic energy of atoms</li>
                  <li><strong>Chemical Bonds:</strong> Observe how bond order changes with interatomic distance</li>
                  <li><strong>Phase Behavior:</strong> See how high temperature = fast-moving atoms (gas-like), low temperature = clustered atoms (solid-like)</li>
                  <li><strong>Molecular Structure:</strong> Load preset molecules like water, methane, and benzene to see their geometries</li>
                </ul>
              </section>

              <section className="about-section">
                <h3>🔬 Why is This Useful?</h3>
                <p>
                  Molecular dynamics is a fundamental tool in <strong>computational chemistry, materials science, 
                  and drug discovery</strong>. Scientists use MD to:
                </p>
                <ul>
                  <li>Design new materials with specific properties</li>
                  <li>Understand protein folding and enzyme mechanisms</li>
                  <li>Study chemical reactions at the atomic level</li>
                  <li>Predict how drugs bind to their targets</li>
                </ul>
                <p>
                  This app provides an intuitive introduction to these concepts, making complex physics 
                  accessible and fun to explore!
                </p>
              </section>

              <section className="about-section">
                <h3>⚛️ Features</h3>
                <ul>
                  <li>Real-time physics with Lennard-Jones and Coulomb potentials</li>
                  <li>ReaxFF force field parameter support</li>
                  <li>12 atom types (H, C, N, O, S, P, Na, Cl, Fe, Au, Si, Pt)</li>
                  <li>Preset molecules: H₂O, CH₄, CO₂, NH₃, benzene, and more</li>
                  <li>Bond order visualization (single, double, triple bonds)</li>
                  <li>Energy tracking (kinetic, potential, total)</li>
                  <li>Temperature control with Berendsen thermostat</li>
                  <li>Radial distribution function (RDF) analysis</li>
                  <li>Mean square displacement (MSD) for diffusion</li>
                </ul>
              </section>

              <section className="about-section">
                <h3>🎮 Controls</h3>
                <ul>
                  <li><kbd>↑</kbd> <kbd>↓</kbd> <kbd>←</kbd> <kbd>→</kbd> - Apply force to move the player atom</li>
                  <li><kbd>Space</kbd> - Pause/Resume simulation</li>
                  <li><kbd>V</kbd> - Toggle velocity vectors</li>
                  <li><kbd>L</kbd> - Toggle atom labels</li>
                  <li><kbd>B</kbd> - Toggle bond display</li>
                  <li><kbd>F</kbd> - Toggle fullscreen</li>
                  <li><kbd>Ctrl+Z</kbd> / <kbd>Ctrl+Y</kbd> - Undo/Redo</li>
                  <li>Double-click canvas to add atoms</li>
                  <li>Scroll to zoom, right-drag to pan</li>
                </ul>
              </section>

              <section className="about-section">
                <h3>🛠️ Technology</h3>
                <p>
                  Built with <strong>React 18</strong> using functional components and hooks. 
                  The physics engine implements <strong>velocity Verlet integration</strong> for 
                  accurate molecular dynamics with optional Berendsen thermostat for temperature control.
                </p>
              </section>

              <section className="about-section about-footer">
                <p>
                  <a 
                    href="https://github.com/aryaghan-mutum/MolecularDynamics" 
                    target="_blank" 
                    rel="noopener noreferrer"
                  >
                    View on GitHub
                  </a>
                </p>
                <p className="version">Version {version}</p>
              </section>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default AboutModal;
