/**
 * Physical Constants for Molecular Dynamics Simulation
 */

// Distance constants
export const R_IJ = 1.2;

// Time constants
export const TIMESTAMP_IN_FEMPTO_SEC = 0.99;
export const TIMESTEP_IN_SIMULATION_UNIT = 0.020454828; // sqrt(u*angstroms^2/kcal_mol)

// Simulation parameters
export const THRUST = 100.0;
export const WALL_SPRING = 200.0;
export const EPS = 1e6;
export const MAX_VEL = 10.0;

// Coulomb constants
export const COULOMB_CONSTANT = 332.06371;        // Coulomb's constant (kcal·mol^-1·e^-2·Å)
export const COULOMB_CHARGE_QI = 0.22472581226836;  // magnitudes of the charge q1
export const COULOMB_CHARGE_QJ = -0.22472581226836; // magnitudes of the charge q2

// UI constants
export const CONTEXT_ID = '2d';
export const EMPTY_STRING = '';
export const ID = 0;

// Atom types
export const ATOM_TYPES = {
  CARBON: 1,
  HYDROGEN: 2,
  OXYGEN: 3,
  NITROGEN: 4,
};

// Default atom properties
export const DEFAULT_ATOM_RADIUS = 2.0;
export const DEFAULT_ATOM_MASS = 12.0;

// Lennard-Jones parameters
export const LJ_SIGMA = 1.9133;
export const LJ_EPSILON = 0.1853;

// Bond order cutoff
export const BOND_CUTOFF = 0.3;

// Canvas defaults
export const DEFAULT_CANVAS_WIDTH = 800;
export const DEFAULT_CANVAS_HEIGHT = 600;
export const DEFAULT_SCALE = 20.0;

