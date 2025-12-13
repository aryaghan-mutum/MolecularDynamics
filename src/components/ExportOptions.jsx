/**
 * @fileoverview Export Options Component
 * @description Provides options to export simulation data and screenshots
 * @module components/ExportOptions
 */

import { useRef } from 'react';
import { useSimulation } from '../context/SimulationContext';
import './ExportOptions.css';

/**
 * Export Options Component
 * Allows exporting simulation data in various formats
 * @returns {JSX.Element} Export options panel
 */
function ExportOptions() {
  const simulation = useSimulation();
  const downloadLinkRef = useRef(null);

  /**
   * Generate filename with timestamp
   * @param {string} extension - File extension
   * @returns {string} Filename
   */
  const generateFilename = (extension) => {
    const date = new Date();
    const timestamp = date.toISOString().slice(0, 19).replace(/[:-]/g, '');
    return `md_simulation_${timestamp}.${extension}`;
  };

  /**
   * Download data as a file
   * @param {string} content - File content
   * @param {string} filename - Download filename
   * @param {string} mimeType - MIME type
   */
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

  /**
   * Export simulation state as JSON
   */
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
        name: atom.name,
        position: atom.pos,
        velocity: atom.vel,
        mass: atom.mass,
        radius: atom.radius,
      })),
      bonds: simulation.bonds.map(bond => ({
        atom1: bond.atom1Id,
        atom2: bond.atom2Id,
        order: bond.order,
        distance: bond.distance,
      })),
    };

    const json = JSON.stringify(data, null, 2);
    downloadFile(json, generateFilename('json'), 'application/json');
  };

  /**
   * Export atom data as CSV
   */
  const exportCSV = () => {
    const headers = ['ID', 'Type', 'Symbol', 'Name', 'X', 'Y', 'Z', 'VX', 'VY', 'VZ', 'Mass', 'Radius'];
    const rows = simulation.atoms.map(atom => [
      atom.id,
      atom.type,
      atom.symbol,
      atom.name,
      atom.pos.x.toFixed(4),
      atom.pos.y.toFixed(4),
      atom.pos.z.toFixed(4),
      atom.vel.x.toFixed(4),
      atom.vel.y.toFixed(4),
      atom.vel.z.toFixed(4),
      atom.mass.toFixed(4),
      atom.radius.toFixed(4),
    ]);

    const csv = [headers.join(','), ...rows.map(row => row.join(','))].join('\n');
    downloadFile(csv, generateFilename('csv'), 'text/csv');
  };

  /**
   * Export data in XYZ format (common molecular format)
   */
  const exportXYZ = () => {
    const lines = [
      simulation.atoms.length.toString(),
      `Molecular Dynamics Export - Time: ${simulation.time}, Temp: ${simulation.temperature.toFixed(2)}K`,
      ...simulation.atoms.map(atom => 
        `${atom.symbol}  ${atom.pos.x.toFixed(6)}  ${atom.pos.y.toFixed(6)}  ${atom.pos.z.toFixed(6)}`
      ),
    ];

    const xyz = lines.join('\n');
    downloadFile(xyz, generateFilename('xyz'), 'chemical/x-xyz');
  };

  /**
   * Capture and export canvas screenshot
   */
  const exportScreenshot = () => {
    const canvas = document.querySelector('canvas');
    if (!canvas) {
      alert('No canvas found to capture');
      return;
    }

    try {
      const dataUrl = canvas.toDataURL('image/png');
      const link = document.createElement('a');
      link.href = dataUrl;
      link.download = generateFilename('png');
      link.click();
    } catch (error) {
      console.error('Failed to capture screenshot:', error);
      alert('Failed to capture screenshot. Canvas may be tainted.');
    }
  };

  /**
   * Copy current state summary to clipboard
   */
  const copyToClipboard = async () => {
    const summary = [
      `=== Molecular Dynamics Simulation Summary ===`,
      `Time: ${simulation.time}`,
      `Temperature: ${simulation.temperature.toFixed(2)} K`,
      ``,
      `Energy:`,
      `  Kinetic: ${simulation.energy.kinetic.toFixed(4)}`,
      `  Potential: ${simulation.energy.potential.toFixed(4)}`,
      `  Total: ${simulation.energy.total.toFixed(4)}`,
      ``,
      `Atoms: ${simulation.atoms.length}`,
      `Bonds: ${simulation.bonds.length}`,
      ``,
      `Atom Summary:`,
      ...simulation.atoms.map(a => `  ${a.id}: ${a.symbol} (${a.name}) at (${a.pos.x.toFixed(2)}, ${a.pos.y.toFixed(2)}, ${a.pos.z.toFixed(2)})`),
    ].join('\n');

    try {
      await navigator.clipboard.writeText(summary);
      alert('Summary copied to clipboard!');
    } catch (error) {
      console.error('Failed to copy:', error);
      alert('Failed to copy to clipboard');
    }
  };

  return (
    <div className="export-options-panel">
      <h3 className="export-title">
        <span className="export-icon">📤</span>
        Export Data
      </h3>

      <div className="export-grid">
        <button className="export-btn" onClick={exportJSON} title="Export full simulation state">
          <span className="btn-icon">{ }</span>
          <span className="btn-label">JSON</span>
          <span className="btn-hint">Full state</span>
        </button>

        <button className="export-btn" onClick={exportCSV} title="Export atom data as spreadsheet">
          <span className="btn-icon">📊</span>
          <span className="btn-label">CSV</span>
          <span className="btn-hint">Atom data</span>
        </button>

        <button className="export-btn" onClick={exportXYZ} title="Export in molecular XYZ format">
          <span className="btn-icon">🧬</span>
          <span className="btn-label">XYZ</span>
          <span className="btn-hint">Molecular</span>
        </button>

        <button className="export-btn" onClick={exportScreenshot} title="Save canvas as image">
          <span className="btn-icon">📸</span>
          <span className="btn-label">Screenshot</span>
          <span className="btn-hint">PNG image</span>
        </button>
      </div>

      <button className="copy-btn" onClick={copyToClipboard}>
        📋 Copy Summary to Clipboard
      </button>

      {/* Hidden download link */}
      <a ref={downloadLinkRef} style={{ display: 'none' }} aria-hidden="true">
        Download
      </a>
    </div>
  );
}

export default ExportOptions;
