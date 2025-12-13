/**
 * Simulation Reducer - Functional Programming Style
 * Pure functions for state management with immutable data transformations
 */
import { logSimulation, logPhysics } from '../utils/logger';
import {
  TIMESTAMP_IN_FEMPTO_SEC,
  THRUST,
  WALL_SPRING,
  MAX_VEL,
  LJ_EPSILON,
} from '../simulation/constants';
import { ATOM_TYPES } from '../simulation/physics';

// ============================================================================
// CONSTANTS & CONFIGURATION
// ============================================================================

/** Atom type properties for visualization and physics - re-export from physics */
export const ATOM_PROPERTIES = ATOM_TYPES;


/** Initial simulation state - immutable template */
export const INITIAL_SIMULATION_STATE = Object.freeze({
  atoms: [],
  bonds: [],
  fireballs: [],
  playerId: null,
  time: 0,
  isPaused: false,
  clearScreen: true,
  scale: 20.0,
  size: Object.freeze({ x: 40, y: 30, z: 30 }),
  timestep: TIMESTAMP_IN_FEMPTO_SEC,
  dt: 0.05,
  thrust: THRUST,
  wallSpring: WALL_SPRING,
  maxVel: MAX_VEL,
  statusText: '',
  nextAtomId: 0,
  enablePhysics: true,
  showBonds: true,
  energy: Object.freeze({ kinetic: 0, potential: 0, total: 0 }),
  temperature: 0,
  selectedAtomType: 2,
});

// ============================================================================
// PURE HELPER FUNCTIONS - Vector Operations
// ============================================================================

/** Create a 3D vector */
const vec3 = (x = 0, y = 0, z = 0) => ({ x, y, z });

/** Add two vectors */
const addVec3 = (v1, v2) => vec3(v1.x + v2.x, v1.y + v2.y, v1.z + v2.z);

/** Scale a vector */
const scaleVec3 = (v, s) => vec3(v.x * s, v.y * s, v.z * s);

/** Clamp a value between min and max */
const clamp = (value, min, max) => Math.max(min, Math.min(max, value));

/** Clamp all components of a vector */
const clampVec3 = (v, min, max) => vec3(
  clamp(v.x, min, max),
  clamp(v.y, min, max),
  clamp(v.z, min, max)
);

// ============================================================================
// PURE HELPER FUNCTIONS - Atom Creation
// ============================================================================

/** Get atom properties by type with default fallback */
const getAtomProps = (type) => ATOM_PROPERTIES[type] ?? ATOM_PROPERTIES[2];

/**
 * Create a new atom object - Pure function
 * @param {number} id - Unique atom identifier
 * @param {number} x - X position
 * @param {number} y - Y position
 * @param {number} z - Z position
 * @param {number} type - Atom type (1-4)
 * @returns {Object} Immutable atom object
 */
const createAtom = (id, x, y, z, type) => {
  const props = getAtomProps(type);
  return Object.freeze({
    id,
    type,
    pos: vec3(x, y, z),
    vel: vec3(),
    force: vec3(),
    radius: props.radius,
    mass: props.mass,
    color: props.color,
    symbol: props.symbol,
    name: props.name,
  });
};

/** Create initial water molecule atoms */
const createInitialAtoms = () => {
  const centerX = 15;
  const centerY = 10;
  return [
    createAtom(0, centerX, centerY, 0, 3),           // Oxygen
    createAtom(1, centerX + 1.5, centerY - 1, 0, 2), // Hydrogen
    createAtom(2, centerX - 1.5, centerY - 1, 0, 2), // Hydrogen
  ];
};

// ============================================================================
// PURE PHYSICS FUNCTIONS
// ============================================================================

/**
 * Calculate Lennard-Jones force between two atoms - Pure function
 * V(r) = 4ε[(σ/r)^12 - (σ/r)^6]
 * F(r) = 24ε/r * [2(σ/r)^12 - (σ/r)^6]
 */
const calculateLJForce = (atom1, atom2) => {
  const dx = atom2.pos.x - atom1.pos.x;
  const dy = atom2.pos.y - atom1.pos.y;
  const dz = atom2.pos.z - atom1.pos.z;
  const r = Math.sqrt(dx * dx + dy * dy + dz * dz);
  
  // Prevent division by zero
  if (r < 0.1) {
    return { force: vec3(), energy: 0, distance: r };
  }
  
  const sigma = (atom1.radius + atom2.radius) * 0.5;
  const sr6 = Math.pow(sigma / r, 6);
  const sr12 = sr6 * sr6;
  
  const forceMag = 24 * LJ_EPSILON / r * (2 * sr12 - sr6);
  const energy = 4 * LJ_EPSILON * (sr12 - sr6);
  
  return {
    force: vec3(forceMag * dx / r, forceMag * dy / r, forceMag * dz / r),
    energy,
    distance: r,
  };
};

/**
 * Calculate wall boundary force for an atom - Pure function
 * Applies spring force when atom penetrates walls
 */
const calculateWallForce = (atom, size, wallSpring) => {
  const r = atom.radius;
  const { x, y, z } = atom.pos;
  
  const fx = x - r < 0 ? -wallSpring * (x - r) :
             x + r > size.x ? -wallSpring * (x + r - size.x) : 0;
  
  const fy = y - r < 0 ? -wallSpring * (y - r) :
             y + r > size.y ? -wallSpring * (y + r - size.y) : 0;
  
  const fz = z - r < 0 ? -wallSpring * (z - r) :
             z + r > size.z ? -wallSpring * (z + r - size.z) : 0;
  
  return vec3(fx, fy, fz);
};

/**
 * Calculate bond order between atoms based on distance - Pure function
 * Uses Gaussian function for smooth bond visualization
 */
const calculateBondOrder = (distance, sigma) => {
  const bondSigma = sigma * 0.8;
  if (distance >= bondSigma * 2.0) return 0;
  return Math.exp(-0.5 * Math.pow((distance - bondSigma) / bondSigma, 2));
};

/**
 * Update single atom with forces and velocity - Pure function
 * Implements velocity Verlet integration with damping
 */
const updateAtomMotion = (atom, totalForce, dt, maxVel) => {
  if (atom.mass <= 0) return atom;
  
  const damping = 0.995;
  const acceleration = scaleVec3(totalForce, 1 / atom.mass);
  
  // Update velocity with damping
  const newVel = clampVec3(
    scaleVec3(addVec3(atom.vel, scaleVec3(acceleration, dt)), damping),
    -maxVel,
    maxVel
  );
  
  // Update position
  const newPos = addVec3(atom.pos, scaleVec3(newVel, dt));
  
  return { ...atom, pos: newPos, vel: newVel };
};

/**
 * Calculate kinetic energy of an atom - Pure function
 * KE = 0.5 * m * v^2
 */
const calculateKineticEnergy = (atom) => {
  const v2 = atom.vel.x ** 2 + atom.vel.y ** 2 + atom.vel.z ** 2;
  return 0.5 * atom.mass * v2;
};

// ============================================================================
// SIMULATION STEP - Pure function composition
// ============================================================================

/**
 * Perform one physics simulation step - Pure function
 * Composes force calculations, motion updates, and bond detection
 */
const performPhysicsStep = (state) => {
  const { atoms, size, wallSpring, dt, maxVel } = state;
  
  if (atoms.length === 0) {
    return { atoms: [], bonds: [], energy: { kinetic: 0, potential: 0, total: 0 }, temperature: 0 };
  }
  
  // Initialize atoms with reset forces
  const atomsWithForces = atoms.map(atom => ({ ...atom, force: vec3() }));
  
  // Calculate pairwise interactions and collect bonds
  const bonds = [];
  let totalPotentialEnergy = 0;
  
  // Process all pairs - accumulate forces
  for (let i = 0; i < atomsWithForces.length; i++) {
    for (let j = i + 1; j < atomsWithForces.length; j++) {
      const { force, energy, distance } = calculateLJForce(atomsWithForces[i], atomsWithForces[j]);
      
      // Accumulate forces (Newton's third law)
      atomsWithForces[i].force = addVec3(atomsWithForces[i].force, force);
      atomsWithForces[j].force = addVec3(atomsWithForces[j].force, scaleVec3(force, -1));
      
      totalPotentialEnergy += energy;
      
      // Bond detection
      const sigma = (atomsWithForces[i].radius + atomsWithForces[j].radius) * 0.5;
      const bondOrder = calculateBondOrder(distance, sigma);
      
      if (bondOrder > 0.1) {
        bonds.push({
          atom1Id: atomsWithForces[i].id,
          atom2Id: atomsWithForces[j].id,
          order: bondOrder,
          distance,
        });
      }
    }
  }
  
  // Update positions and velocities, calculate kinetic energy
  let totalKineticEnergy = 0;
  
  const updatedAtoms = atomsWithForces.map(atom => {
    const wallForce = calculateWallForce(atom, size, wallSpring);
    const totalForce = addVec3(atom.force, wallForce);
    const updated = updateAtomMotion(atom, totalForce, dt, maxVel);
    totalKineticEnergy += calculateKineticEnergy(updated);
    return updated;
  });
  
  // Calculate temperature from kinetic energy
  // T = (2/3) * KE / (N * kB)
  const kB = 0.0019872; // kcal/(mol·K)
  const temperature = (2 / 3) * totalKineticEnergy / (atoms.length * kB);
  
  return {
    atoms: updatedAtoms,
    bonds,
    energy: {
      kinetic: totalKineticEnergy,
      potential: totalPotentialEnergy,
      total: totalKineticEnergy + totalPotentialEnergy,
    },
    temperature,
  };
};

// ============================================================================
// ACTION HANDLERS - Pure functions returning new state
// ============================================================================

const handleAddAtom = (state, { x, y, z, atomType }) => {
  const newAtom = createAtom(
    state.nextAtomId,
    x, y, z,
    atomType ?? state.selectedAtomType
  );
  
  logSimulation.info('Atom added', { id: newAtom.id, type: newAtom.type, pos: newAtom.pos });
  
  return {
    ...state,
    atoms: [...state.atoms, newAtom],
    nextAtomId: state.nextAtomId + 1,
    playerId: state.playerId ?? state.nextAtomId,
  };
};

const handlePhysicsStep = (state) => {
  if (state.isPaused || !state.enablePhysics || state.atoms.length === 0) {
    return state;
  }
  
  const result = performPhysicsStep(state);
  
  logPhysics.debug('Physics step', { 
    atomCount: result.atoms.length, 
    bondCount: result.bonds.length,
    temperature: result.temperature.toFixed(2)
  });
  
  return {
    ...state,
    atoms: result.atoms,
    bonds: result.bonds,
    energy: result.energy,
    temperature: result.temperature,
    time: state.time + 1,
  };
};

const handleRemoveAtom = (state, { id }) => {
  logSimulation.info('Atom removed', { id });
  return {
    ...state,
    atoms: state.atoms.filter(atom => atom.id !== id),
    playerId: state.playerId === id ? null : state.playerId,
  };
};

const handleUpdateAtomPosition = (state, { id, position }) => ({
  ...state,
  atoms: state.atoms.map(atom =>
    atom.id === id ? { ...atom, pos: { ...atom.pos, ...position } } : atom
  ),
});

const handleUpdateAtomForce = (state, { id, force }) => ({
  ...state,
  atoms: state.atoms.map(atom =>
    atom.id === id ? { ...atom, force: { ...atom.force, ...force } } : atom
  ),
});

const handleUpdateAtoms = (state, atoms) => ({ ...state, atoms });

const handleResetSimulation = (state) => {
  logSimulation.info('Simulation reset');
  const initialAtoms = createInitialAtoms();
  return {
    ...INITIAL_SIMULATION_STATE,
    atoms: initialAtoms,
    playerId: 0,
    nextAtomId: 3,
    size: state.size,
    isPaused: false,
  };
};

const handleClearAtoms = (state) => {
  logSimulation.info('All atoms cleared');
  return {
    ...state,
    atoms: [],
    bonds: [],
    playerId: null,
    nextAtomId: 0,
    energy: { kinetic: 0, potential: 0, total: 0 },
    temperature: 0,
  };
};

const handleLoadMolecule = (state, { atoms: moleculeAtoms, centerX, centerY }) => {
  const cx = centerX ?? state.size.x / 2;
  const cy = centerY ?? state.size.y / 2;
  
  const newAtoms = moleculeAtoms.map((atomDef, index) =>
    createAtom(
      state.nextAtomId + index,
      cx + atomDef.x * 2,
      cy + atomDef.y * 2,
      atomDef.z * 2,
      atomDef.type
    )
  );
  
  logSimulation.info('Molecule loaded', { atomCount: newAtoms.length });
  
  return {
    ...state,
    atoms: [...state.atoms, ...newAtoms],
    nextAtomId: state.nextAtomId + newAtoms.length,
    playerId: state.playerId ?? state.nextAtomId,
  };
};

const handleSetAtomType = (state, type) => ({ ...state, selectedAtomType: type });

const handleTogglePhysics = (state) => {
  logSimulation.info('Physics toggled', { enabled: !state.enablePhysics });
  return { ...state, enablePhysics: !state.enablePhysics };
};

const handleToggleBonds = (state) => ({ ...state, showBonds: !state.showBonds });

const handleTogglePause = (state) => {
  logSimulation.info('Pause toggled', { isPaused: !state.isPaused });
  return { ...state, isPaused: !state.isPaused };
};

const handleToggleClear = (state) => ({ ...state, clearScreen: !state.clearScreen });

const handleSetScale = (state, { scale }) => ({ ...state, scale });

const handleSetSize = (state, size) => ({ ...state, size });

const handleIncrementTime = (state) => ({ ...state, time: state.time + 1 });

const handleAddFireball = (state, fireball) => ({
  ...state,
  fireballs: [...state.fireballs, fireball],
});

const handleUpdateFireballs = (state, fireballs) => ({ ...state, fireballs });

const handleSetPlayerForce = (state, force) => {
  if (state.playerId === null) return state;
  return {
    ...state,
    atoms: state.atoms.map(atom =>
      atom.id === state.playerId
        ? { ...atom, force: { ...atom.force, ...force } }
        : atom
    ),
  };
};

const handleSetStatus = (state, text) => ({ ...state, statusText: text });

const handleInitialize = (state) => {
  logSimulation.info('Simulation initialized');
  const initialAtoms = createInitialAtoms();
  return {
    ...state,
    atoms: initialAtoms,
    playerId: 0,
    nextAtomId: 3,
  };
};

// ============================================================================
// REDUCER - Action dispatch mapping
// ============================================================================

/** Action handlers map for clean dispatch */
const actionHandlers = Object.freeze({
  ADD_ATOM: handleAddAtom,
  PHYSICS_STEP: handlePhysicsStep,
  REMOVE_ATOM: handleRemoveAtom,
  UPDATE_ATOM_POSITION: handleUpdateAtomPosition,
  UPDATE_ATOM_FORCE: handleUpdateAtomForce,
  UPDATE_ATOMS: handleUpdateAtoms,
  RESET_SIMULATION: handleResetSimulation,
  CLEAR_ATOMS: handleClearAtoms,
  LOAD_MOLECULE: handleLoadMolecule,
  SET_ATOM_TYPE: handleSetAtomType,
  TOGGLE_PHYSICS: handleTogglePhysics,
  TOGGLE_BONDS: handleToggleBonds,
  TOGGLE_PAUSE: handleTogglePause,
  TOGGLE_CLEAR: handleToggleClear,
  SET_SCALE: handleSetScale,
  SET_SIZE: handleSetSize,
  INCREMENT_TIME: handleIncrementTime,
  ADD_FIREBALL: handleAddFireball,
  UPDATE_FIREBALLS: handleUpdateFireballs,
  SET_PLAYER_FORCE: handleSetPlayerForce,
  SET_STATUS: handleSetStatus,
  INITIALIZE: handleInitialize,
});

/**
 * Main simulation reducer - Dispatches to appropriate handler
 * @param {Object} state - Current state
 * @param {Object} action - Action with type and payload
 * @returns {Object} New state
 */
export const simulationReducer = (state, action) => {
  const handler = actionHandlers[action.type];
  
  if (!handler) {
    logSimulation.warn('Unknown action type', { type: action.type });
    return state;
  }
  
  return handler(state, action.payload);
};

export default simulationReducer;
