/**
 * Physical Constants for Molecular Dynamics Simulation
 * @module simulation/constants
 */

// ============================================================================
// TIME CONSTANTS
// ============================================================================

/** Timestep in femtoseconds for simulation */
export const TIMESTAMP_IN_FEMPTO_SEC = 0.99;

/** Timestep in simulation units: sqrt(u*angstroms^2/kcal_mol) */
export const TIMESTEP_IN_SIMULATION_UNIT = 0.020454828;

// ============================================================================
// SIMULATION PARAMETERS
// ============================================================================

/** Force applied for player movement */
export const THRUST = 100.0;

/** Spring constant for wall collisions */
export const WALL_SPRING = 200.0;

/** Maximum velocity cap */
export const MAX_VEL = 10.0;

// ============================================================================
// COULOMB INTERACTION CONSTANTS
// ============================================================================

/** Coulomb's constant (kcal·mol^-1·e^-2·Å) */
export const COULOMB_CONSTANT = 332.06371;

// ============================================================================
// LENNARD-JONES PARAMETERS
// ============================================================================

/** Lennard-Jones sigma parameter (equilibrium distance) */
export const LJ_SIGMA = 1.9133;

/** Lennard-Jones epsilon parameter (well depth) */
export const LJ_EPSILON = 0.1853;

// ============================================================================
// BOND PARAMETERS
// ============================================================================

/** Bond order cutoff threshold */
export const BOND_CUTOFF = 0.3;
