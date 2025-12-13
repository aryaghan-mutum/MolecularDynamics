/**
 * World Configuration for Molecular Dynamics Simulation
 */

export const CONTEXT_ID = '2d';
export const TIMESTAMP_IN_FEMPTO_SEC = 0.99;
export const TIMESTEP_IN_SIMULATION_UNIT = 0.020454828;

// Default canvas configuration
export const DEFAULT_CANVAS_WIDTH = 800;
export const DEFAULT_CANVAS_HEIGHT = 600;

// World scale (pixels per angstrom)
export const DEFAULT_WORLD_SCALE = 20.0;

// Initial molecule configurations
export const MOLECULE_CONFIGS = {
  OZONE: [
    { x: 0.0, y: 0.0, z: 0.0, type: 2 },
    { x: 1.2, y: 0.0, z: 0.0, type: 2 },
    { x: 2.0, y: 0.8, z: 0.0, type: 2 }
  ],
  WATER: [
    { x: 0.0, y: 0.0, z: 0.0, type: 3 },  // O
    { x: 0.96, y: 0.0, z: 0.0, type: 2 }, // H
    { x: -0.24, y: 0.93, z: 0.0, type: 2 } // H
  ],
  CARBON_DIOXIDE: [
    { x: 0.0, y: 0.0, z: 0.0, type: 1 },   // C
    { x: 1.16, y: 0.0, z: 0.0, type: 3 },  // O
    { x: -1.16, y: 0.0, z: 0.0, type: 3 }  // O
  ]
};

// Visualization colors by atom type
export const ATOM_COLORS = {
  1: { primary: 'rgb(100,100,100)', secondary: 'rgb(40,40,40)' },      // Carbon - gray
  2: { primary: 'rgb(245,245,245)', secondary: 'rgb(200,200,200)' },   // Hydrogen - white
  3: { primary: 'rgb(255,100,100)', secondary: 'rgb(200,50,50)' }      // Oxygen - red
};

export default {
  CONTEXT_ID,
  TIMESTAMP_IN_FEMPTO_SEC,
  TIMESTEP_IN_SIMULATION_UNIT,
  DEFAULT_CANVAS_WIDTH,
  DEFAULT_CANVAS_HEIGHT,
  DEFAULT_WORLD_SCALE,
  MOLECULE_CONFIGS,
  ATOM_COLORS
};