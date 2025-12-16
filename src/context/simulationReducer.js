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
  // New features
  targetTemperature: 300,      // Temperature control (Kelvin)
  zoom: 1.0,                   // Zoom level
  pan: Object.freeze({ x: 0, y: 0 }), // Pan offset
  selectedAtomId: null,        // Selected atom for viewing properties
  draggingAtomId: null,        // Atom being dragged
  showVelocityVectors: false,  // Show velocity arrows
  showAtomLabels: true,        // Show element symbols
  showBondLengths: false,      // Show distance on bonds
  boundaryCondition: 'reflective', // 'reflective', 'periodic', 'open'
  timeStepMultiplier: 1.0,     // Speed control
  atomCountWarning: 100,       // Warning threshold
  undoStack: [],               // Undo history
  redoStack: [],               // Redo history
  theme: 'dark',               // 'dark' or 'light'
  isFullscreen: false,         // Fullscreen mode
  rdfData: [],                 // Radial distribution function data
  // Phase 2 features
  thermostatEnabled: true,     // Enable Berendsen thermostat
  thermostatTau: 0.5,          // Thermostat coupling constant
  enableCoulomb: false,        // Electrostatic interactions
  coulombConstant: 332.0,      // kcal·Å/(mol·e²)
  enableQEq: true,             // Enable charge equilibration for stable molecules
  qeqUpdateInterval: 10,       // Update charges every N steps (performance)
  show3DDepth: false,          // 3D depth visualization
  selectedAtomIds: [],         // Multi-selection
  clipboard: [],               // Copy/paste buffer
  measurementMode: false,      // Distance measurement tool
  measurementAtoms: [],        // Atoms selected for measurement
  isRecording: false,          // Animation recording
  recordedFrames: [],          // Recorded frame data
  energyHistory: [],           // Energy vs time data
  msdData: [],                 // Mean square displacement
  initialPositions: {},        // For MSD calculation
  customAtomColors: {},        // Custom colors per atom type
  playerForce: Object.freeze({ x: 0, y: 0 }), // External force from keyboard
  lockZoom: true,              // Lock zoom/scroll on canvas (static view)
  viewMode: '2d',              // '2d' or '3d' view mode
  // Visual enhancement features
  colorByVelocity: false,      // Color atoms based on velocity (blue=slow, red=fast)
  showMotionTrails: false,     // Show motion trails behind atoms
  trailLength: 20,             // Number of trail positions to keep
  positionHistory: {},         // Track atom positions for trails: { atomId: [{x,y}, ...] }
  autoSaveEnabled: true,       // Auto-save to localStorage
  lastAutoSave: null,          // Timestamp of last auto-save
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
 * @param {Object} options - Additional options
 * @returns {Object} Immutable atom object
 */
const createAtom = (id, x, y, z, type, options = {}) => {
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
    // New properties
    isFixed: options.isFixed || false,  // Frozen atom
    charge: props.charge || 0,          // Partial charge for Coulomb
    customColor: options.customColor || null, // Custom color override
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
  if (atom.mass <= 0 || atom.isFixed) return atom;
  
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
 * Calculate Coulomb force between two charged atoms
 * F = k * q1 * q2 / r^2
 */
const calculateCoulombForce = (atom1, atom2, coulombConstant) => {
  if (!atom1.charge || !atom2.charge) return { force: vec3(), energy: 0 };
  
  const dx = atom2.pos.x - atom1.pos.x;
  const dy = atom2.pos.y - atom1.pos.y;
  const dz = atom2.pos.z - atom1.pos.z;
  const r = Math.sqrt(dx * dx + dy * dy + dz * dz);
  
  if (r < 0.5) return { force: vec3(), energy: 0 }; // Prevent singularity
  
  const forceMag = coulombConstant * atom1.charge * atom2.charge / (r * r);
  const energy = coulombConstant * atom1.charge * atom2.charge / r;
  
  return {
    force: vec3(forceMag * dx / r, forceMag * dy / r, forceMag * dz / r),
    energy,
  };
};

// ============================================================================
// CHARGE EQUILIBRATION (QEq) - Electronegativity Equalization Method
// ============================================================================

/**
 * Solve charge equilibration using Gauss-Seidel iteration
 * Based on Rappe & Goddard QEq method
 * 
 * The chemical potential for each atom:
 * μᵢ = χᵢ + 2ηᵢqᵢ + Σⱼ(qⱼ * J(rᵢⱼ))
 * 
 * At equilibrium: μ₁ = μ₂ = ... = μₙ = μ_common
 * Constraint: Σqᵢ = Q_total (charge conservation)
 * 
 * @param {Array} atoms - Array of atoms with electronegativity and hardness
 * @param {number} totalCharge - Total system charge (default 0 for neutral)
 * @returns {Array} Atoms with updated charges
 */
const equilibrateCharges = (atoms, totalCharge = 0) => {
  if (atoms.length < 2) return atoms;
  
  const n = atoms.length;
  const EV_TO_KCAL = 23.0605; // eV to kcal/mol conversion
  
  // Get QEq parameters for each atom
  const chi = atoms.map(a => {
    const props = getAtomProps(a.type);
    return (props.electronegativity || 5.0) * EV_TO_KCAL;
  });
  
  const eta = atoms.map(a => {
    const props = getAtomProps(a.type);
    return (props.hardness || 5.0) * EV_TO_KCAL;
  });
  
  // Calculate Coulomb interaction matrix J(rᵢⱼ)
  // Using shielded Coulomb: J(r) = 1/sqrt(r² + (1/(2η))²)
  const calcJ = (i, j) => {
    if (i === j) return 0;
    const dx = atoms[j].pos.x - atoms[i].pos.x;
    const dy = atoms[j].pos.y - atoms[i].pos.y;
    const dz = atoms[j].pos.z - atoms[i].pos.z;
    const r2 = dx * dx + dy * dy + dz * dz;
    
    // Shielding parameter from average hardness
    const avgEta = (eta[i] + eta[j]) / 2;
    const shieldR2 = 1 / (4 * avgEta * avgEta);
    
    return 332.0 / Math.sqrt(r2 + shieldR2 + 0.01); // 332 = kcal·Å/(mol·e²)
  };
  
  // Initialize charges (use existing or zero)
  const q = atoms.map(a => a.charge || 0);
  
  // Gauss-Seidel iteration to equilibrate charges
  const maxIter = 50;
  const tolerance = 1e-4;
  
  for (let iter = 0; iter < maxIter; iter++) {
    let maxChange = 0;
    
    // Calculate common chemical potential (Lagrange multiplier)
    let sumChi = 0;
    let sumInvEta = 0;
    
    for (let i = 0; i < n; i++) {
      let sumJ = 0;
      for (let j = 0; j < n; j++) {
        if (i !== j) sumJ += q[j] * calcJ(i, j);
      }
      sumChi += (chi[i] + sumJ) / (2 * eta[i]);
      sumInvEta += 1 / (2 * eta[i]);
    }
    
    const mu = (sumChi - totalCharge) / sumInvEta;
    
    // Update charges
    for (let i = 0; i < n; i++) {
      let sumJ = 0;
      for (let j = 0; j < n; j++) {
        if (i !== j) sumJ += q[j] * calcJ(i, j);
      }
      
      const newQ = (mu - chi[i] - sumJ) / (2 * eta[i]);
      const change = Math.abs(newQ - q[i]);
      maxChange = Math.max(maxChange, change);
      q[i] = newQ;
    }
    
    // Enforce charge conservation
    const qSum = q.reduce((a, b) => a + b, 0);
    const correction = (totalCharge - qSum) / n;
    for (let i = 0; i < n; i++) {
      q[i] += correction;
    }
    
    if (maxChange < tolerance) break;
  }
  
  // Clamp charges to reasonable range (-2 to +2)
  return atoms.map((atom, i) => ({
    ...atom,
    charge: Math.max(-2, Math.min(2, q[i])),
  }));
};

/**
 * Apply Berendsen thermostat - velocity rescaling
 * Scale velocities to approach target temperature
 */
const applyThermostat = (atoms, currentTemp, targetTemp, tau, dt) => {
  if (currentTemp <= 0 || targetTemp <= 0) return atoms;
  
  const lambda = Math.sqrt(1 + (dt / tau) * (targetTemp / currentTemp - 1));
  const clampedLambda = Math.max(0.9, Math.min(1.1, lambda)); // Prevent extreme scaling
  
  return atoms.map(atom => {
    if (atom.isFixed) return atom;
    return {
      ...atom,
      vel: scaleVec3(atom.vel, clampedLambda),
    };
  });
};

/**
 * Calculate kinetic energy of an atom - Pure function
 * KE = 0.5 * m * v^2
 */
const calculateKineticEnergy = (atom) => {
  const v2 = atom.vel.x ** 2 + atom.vel.y ** 2 + atom.vel.z ** 2;
  return 0.5 * atom.mass * v2;
};

/**
 * Calculate coordination number for each atom
 * Count neighbors within cutoff distance
 */
const calculateCoordinationNumbers = (atoms, cutoff = 3.0) => {
  const coordination = {};
  atoms.forEach(atom => {
    coordination[atom.id] = 0;
  });
  
  for (let i = 0; i < atoms.length; i++) {
    for (let j = i + 1; j < atoms.length; j++) {
      const dx = atoms[j].pos.x - atoms[i].pos.x;
      const dy = atoms[j].pos.y - atoms[i].pos.y;
      const dz = atoms[j].pos.z - atoms[i].pos.z;
      const r = Math.sqrt(dx * dx + dy * dy + dz * dz);
      
      if (r < cutoff) {
        coordination[atoms[i].id]++;
        coordination[atoms[j].id]++;
      }
    }
  }
  
  return coordination;
};

// ============================================================================
// SIMULATION STEP - Pure function composition
// ============================================================================

/**
 * Perform one physics simulation step - Pure function
 * Composes force calculations, motion updates, and bond detection
 */
const performPhysicsStep = (state) => {
  const { atoms, size, wallSpring, dt, maxVel, enableCoulomb, coulombConstant, boundaryCondition, enableQEq, qeqUpdateInterval, time } = state;
  
  if (atoms.length === 0) {
    return { atoms: [], bonds: [], energy: { kinetic: 0, potential: 0, total: 0 }, temperature: 0 };
  }
  
  // Apply charge equilibration periodically for stable molecules
  let chargedAtoms = atoms;
  if (enableQEq && atoms.length >= 2 && (time % qeqUpdateInterval === 0)) {
    chargedAtoms = equilibrateCharges(atoms, 0);
  }
  
  // Initialize atoms with reset forces, but preserve player force
  const { playerForce = { x: 0, y: 0 }, playerId } = state;
  const atomsWithForces = chargedAtoms.map(atom => {
    if (atom.id === playerId && (playerForce.x !== 0 || playerForce.y !== 0)) {
      return { ...atom, force: vec3(playerForce.x, playerForce.y, 0) };
    }
    return { ...atom, force: vec3() };
  });
  
  // Calculate pairwise interactions and collect bonds
  const bonds = [];
  let totalPotentialEnergy = 0;
  
  // Process all pairs - accumulate forces
  for (let i = 0; i < atomsWithForces.length; i++) {
    for (let j = i + 1; j < atomsWithForces.length; j++) {
      // Lennard-Jones force
      const { force, energy, distance } = calculateLJForce(atomsWithForces[i], atomsWithForces[j]);
      
      // Accumulate forces (Newton's third law)
      atomsWithForces[i].force = addVec3(atomsWithForces[i].force, force);
      atomsWithForces[j].force = addVec3(atomsWithForces[j].force, scaleVec3(force, -1));
      
      totalPotentialEnergy += energy;
      
      // Coulomb force if enabled (QEq provides the charges)
      if (enableCoulomb) {
        const coulomb = calculateCoulombForce(atomsWithForces[i], atomsWithForces[j], coulombConstant);
        atomsWithForces[i].force = addVec3(atomsWithForces[i].force, coulomb.force);
        atomsWithForces[j].force = addVec3(atomsWithForces[j].force, scaleVec3(coulomb.force, -1));
        totalPotentialEnergy += coulomb.energy;
      }
      
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
  
  let updatedAtoms = atomsWithForces.map(atom => {
    if (atom.isFixed) {
      return { ...atom, vel: vec3() }; // Fixed atoms don't move
    }
    
    const wallForce = boundaryCondition === 'reflective' 
      ? calculateWallForce(atom, size, wallSpring) 
      : vec3();
    const totalForce = addVec3(atom.force, wallForce);
    const updated = updateAtomMotion(atom, totalForce, dt, maxVel);
    totalKineticEnergy += calculateKineticEnergy(updated);
    return updated;
  });
  
  // Apply periodic boundary conditions
  if (boundaryCondition === 'periodic') {
    updatedAtoms = updatedAtoms.map(atom => ({
      ...atom,
      pos: {
        x: ((atom.pos.x % size.x) + size.x) % size.x,
        y: ((atom.pos.y % size.y) + size.y) % size.y,
        z: atom.pos.z,
      },
    }));
  }
  
  // Calculate temperature from kinetic energy
  // T = (2/3) * KE / (N * kB)
  const kB = 0.0019872; // kcal/(mol·K)
  const nonFixedAtoms = atoms.filter(a => !a.isFixed).length;
  const temperature = nonFixedAtoms > 0 
    ? (2 / 3) * totalKineticEnergy / (nonFixedAtoms * kB)
    : 0;
  
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
  
  let result = performPhysicsStep(state);
  
  // Apply thermostat if enabled
  if (state.thermostatEnabled && result.temperature > 0) {
    result.atoms = applyThermostat(result.atoms, result.temperature, state.targetTemperature, state.thermostatTau, state.dt);
    // Recalculate kinetic energy and temperature after thermostat
    let totalKE = 0;
    result.atoms.forEach(atom => {
      totalKE += calculateKineticEnergy(atom);
    });
    const kB = 0.0019872;
    const nonFixedAtoms = result.atoms.filter(a => !a.isFixed).length;
    result.temperature = nonFixedAtoms > 0 ? (2 / 3) * totalKE / (nonFixedAtoms * kB) : 0;
    result.energy.kinetic = totalKE;
    result.energy.total = totalKE + result.energy.potential;
  }
  
  // Track energy history for plotting
  const maxHistory = 200;
  const newEnergyHistory = [...state.energyHistory, { 
    time: state.time, 
    ...result.energy,
    temperature: result.temperature
  }].slice(-maxHistory);
  
  // Track MSD if we have initial positions
  let newMsdData = state.msdData;
  if (state.initialPositions.length > 0) {
    let totalMsd = 0;
    let count = 0;
    result.atoms.forEach(atom => {
      const initial = state.initialPositions.find(p => p.id === atom.id);
      if (initial) {
        const dx = atom.pos.x - initial.x;
        const dy = atom.pos.y - initial.y;
        const dz = atom.pos.z - initial.z;
        totalMsd += dx * dx + dy * dy + dz * dz;
        count++;
      }
    });
    const msd = count > 0 ? totalMsd / count : 0;
    newMsdData = [...state.msdData, { time: state.time, msd }].slice(-maxHistory);
  }
  
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
    energyHistory: newEnergyHistory,
    msdData: newMsdData,
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

const handleUpdateSettings = (state, settings) => {
  logSimulation.info('Settings updated', settings);
  return { ...state, ...settings };
};

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
    playerForce: { x: force.x || 0, y: force.y || 0 },
  };
};

const handleClearPlayerForce = (state) => ({
  ...state,
  playerForce: { x: 0, y: 0 },
});

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
// NEW FEATURE HANDLERS
// ============================================================================

const handleSetTargetTemperature = (state, temp) => ({ ...state, targetTemperature: temp });

const handleSetZoom = (state, zoom) => ({ 
  ...state, 
  zoom: Math.max(0.25, Math.min(4, zoom)) 
});

const handleSetPan = (state, pan) => ({ ...state, pan });

const handleSelectAtom = (state, atomId) => ({ ...state, selectedAtomId: atomId });

const handleSetDraggingAtom = (state, atomId) => ({ ...state, draggingAtomId: atomId });

const handleToggleVelocityVectors = (state) => ({ 
  ...state, 
  showVelocityVectors: !state.showVelocityVectors 
});

const handleToggleAtomLabels = (state) => ({ 
  ...state, 
  showAtomLabels: !state.showAtomLabels 
});

const handleToggleBondLengths = (state) => ({ 
  ...state, 
  showBondLengths: !state.showBondLengths 
});

const handleSetBoundaryCondition = (state, condition) => ({ 
  ...state, 
  boundaryCondition: condition 
});

const handleSetTimeStepMultiplier = (state, multiplier) => ({ 
  ...state, 
  timeStepMultiplier: Math.max(0.1, Math.min(5, multiplier)) 
});

const handleSetTheme = (state, theme) => ({ ...state, theme });

const handleToggleFullscreen = (state) => ({ 
  ...state, 
  isFullscreen: !state.isFullscreen 
});

const handleToggleLockZoom = (state) => ({
  ...state,
  lockZoom: !state.lockZoom
});

const handleResetView = (state) => ({
  ...state,
  zoom: 1.0,
  pan: Object.freeze({ x: 0, y: 0 })
});

// Visual enhancement handlers
const handleToggleColorByVelocity = (state) => ({
  ...state,
  colorByVelocity: !state.colorByVelocity
});

const handleToggleMotionTrails = (state) => ({
  ...state,
  showMotionTrails: !state.showMotionTrails,
  positionHistory: state.showMotionTrails ? {} : state.positionHistory // Clear history when disabling
});

const handleSetTrailLength = (state, length) => ({
  ...state,
  trailLength: Math.max(5, Math.min(50, length))
});

const handleUpdatePositionHistory = (state) => {
  if (!state.showMotionTrails || state.isPaused) return state;
  
  const newHistory = { ...state.positionHistory };
  const maxLength = state.trailLength;
  
  state.atoms.forEach(atom => {
    const history = newHistory[atom.id] || [];
    const newPos = { x: atom.pos.x, y: atom.pos.y };
    newHistory[atom.id] = [...history, newPos].slice(-maxLength);
  });
  
  return {
    ...state,
    positionHistory: newHistory
  };
};

const handleToggleAutoSave = (state) => ({
  ...state,
  autoSaveEnabled: !state.autoSaveEnabled
});

const handleSetLastAutoSave = (state, timestamp) => ({
  ...state,
  lastAutoSave: timestamp
});

const handleClearPositionHistory = (state) => ({
  ...state,
  positionHistory: {}
});

const handlePushUndo = (state) => {
  const currentState = {
    atoms: state.atoms.map(a => ({ ...a })),
    bonds: [...state.bonds],
    nextAtomId: state.nextAtomId,
    playerId: state.playerId,
  };
  return {
    ...state,
    undoStack: [...state.undoStack.slice(-19), currentState], // Keep last 20
    redoStack: [],
  };
};

const handleUndo = (state) => {
  if (state.undoStack.length === 0) return state;
  
  const currentState = {
    atoms: state.atoms.map(a => ({ ...a })),
    bonds: [...state.bonds],
    nextAtomId: state.nextAtomId,
    playerId: state.playerId,
  };
  
  const prevState = state.undoStack[state.undoStack.length - 1];
  
  return {
    ...state,
    atoms: prevState.atoms,
    bonds: prevState.bonds,
    nextAtomId: prevState.nextAtomId,
    playerId: prevState.playerId,
    undoStack: state.undoStack.slice(0, -1),
    redoStack: [...state.redoStack, currentState],
  };
};

const handleRedo = (state) => {
  if (state.redoStack.length === 0) return state;
  
  const currentState = {
    atoms: state.atoms.map(a => ({ ...a })),
    bonds: [...state.bonds],
    nextAtomId: state.nextAtomId,
    playerId: state.playerId,
  };
  
  const nextState = state.redoStack[state.redoStack.length - 1];
  
  return {
    ...state,
    atoms: nextState.atoms,
    bonds: nextState.bonds,
    nextAtomId: nextState.nextAtomId,
    playerId: nextState.playerId,
    undoStack: [...state.undoStack, currentState],
    redoStack: state.redoStack.slice(0, -1),
  };
};

const handleCalculateRDF = (state) => {
  if (state.atoms.length < 2) return { ...state, rdfData: [] };
  
  const maxR = Math.min(state.size.x, state.size.y) / 2;
  const numBins = 50;
  const dr = maxR / numBins;
  const bins = new Array(numBins).fill(0);
  
  // Calculate all pairwise distances
  for (let i = 0; i < state.atoms.length; i++) {
    for (let j = i + 1; j < state.atoms.length; j++) {
      const dx = state.atoms[j].pos.x - state.atoms[i].pos.x;
      const dy = state.atoms[j].pos.y - state.atoms[i].pos.y;
      const r = Math.sqrt(dx * dx + dy * dy);
      const binIndex = Math.floor(r / dr);
      if (binIndex < numBins) {
        bins[binIndex] += 2; // Count for both i-j and j-i
      }
    }
  }
  
  // Normalize by shell volume and density
  const area = state.size.x * state.size.y;
  const density = state.atoms.length / area;
  const rdfData = bins.map((count, i) => {
    const rInner = i * dr;
    const rOuter = (i + 1) * dr;
    const shellArea = Math.PI * (rOuter * rOuter - rInner * rInner);
    const g = count / (state.atoms.length * density * shellArea);
    return { r: (rInner + rOuter) / 2, g };
  });
  
  return { ...state, rdfData };
};

const handleLoadSimulationState = (state, savedState) => {
  logSimulation.info('Loading saved simulation state');
  return {
    ...state,
    atoms: savedState.atoms || [],
    bonds: savedState.bonds || [],
    playerId: savedState.playerId ?? null,
    nextAtomId: savedState.nextAtomId ?? 0,
    time: 0,
    energy: { kinetic: 0, potential: 0, total: 0 },
    temperature: 0,
  };
};

// New Phase 2 action handlers

const handleToggleThermostat = (state) => ({
  ...state,
  thermostatEnabled: !state.thermostatEnabled,
});

const handleSetThermostatTau = (state, tau) => ({
  ...state,
  thermostatTau: tau,
});

const handleToggleCoulomb = (state) => ({
  ...state,
  enableCoulomb: !state.enableCoulomb,
});

const handleSetCoulombConstant = (state, value) => ({
  ...state,
  coulombConstant: value,
});

const handleToggleQEq = (state) => ({
  ...state,
  enableQEq: !state.enableQEq,
});

const handleSetQEqInterval = (state, value) => ({
  ...state,
  qeqUpdateInterval: Math.max(1, Math.floor(value)),
});

const handleToggle3DDepth = (state) => ({
  ...state,
  show3DDepth: !state.show3DDepth,
});

const handleToggleFixAtom = (state, atomId) => ({
  ...state,
  atoms: state.atoms.map(atom =>
    atom.id === atomId ? { ...atom, isFixed: !atom.isFixed } : atom
  ),
});

const handleSetAtomCharge = (state, { atomId, charge }) => ({
  ...state,
  atoms: state.atoms.map(atom =>
    atom.id === atomId ? { ...atom, charge } : atom
  ),
});

const handleMultiSelect = (state, atomIds) => ({
  ...state,
  selectedAtomIds: atomIds,
});

const handleAddToSelection = (state, atomId) => ({
  ...state,
  selectedAtomIds: state.selectedAtomIds.includes(atomId)
    ? state.selectedAtomIds
    : [...state.selectedAtomIds, atomId],
});

const handleRemoveFromSelection = (state, atomId) => ({
  ...state,
  selectedAtomIds: state.selectedAtomIds.filter(id => id !== atomId),
});

const handleClearSelection = (state) => ({
  ...state,
  selectedAtomIds: [],
});

const handleCopyAtoms = (state) => {
  const selectedAtoms = state.atoms.filter(a => state.selectedAtomIds.includes(a.id));
  if (selectedAtoms.length === 0) return state;
  
  // Find center of selection
  const cx = selectedAtoms.reduce((sum, a) => sum + a.pos.x, 0) / selectedAtoms.length;
  const cy = selectedAtoms.reduce((sum, a) => sum + a.pos.y, 0) / selectedAtoms.length;
  
  // Store relative positions
  const clipboard = selectedAtoms.map(a => ({
    relX: a.pos.x - cx,
    relY: a.pos.y - cy,
    relZ: a.pos.z,
    type: a.type,
    charge: a.charge,
    isFixed: a.isFixed,
    customColor: a.customColor,
  }));
  
  return { ...state, clipboard };
};

const handlePasteAtoms = (state, { x, y }) => {
  if (state.clipboard.length === 0) return state;
  
  const newAtoms = state.clipboard.map((atomData, i) =>
    createAtom(
      state.nextAtomId + i,
      x + atomData.relX,
      y + atomData.relY,
      atomData.relZ,
      atomData.type,
      { charge: atomData.charge, isFixed: atomData.isFixed, customColor: atomData.customColor }
    )
  );
  
  return {
    ...state,
    atoms: [...state.atoms, ...newAtoms],
    nextAtomId: state.nextAtomId + newAtoms.length,
  };
};

const handleSetMeasurementMode = (state, mode) => ({
  ...state,
  measurementMode: mode,
  measurementAtoms: [],
});

const handleAddMeasurementAtom = (state, atomId) => {
  const newMeasurementAtoms = [...state.measurementAtoms, atomId];
  
  // If we have 2 atoms, we have a measurement
  if (newMeasurementAtoms.length >= 2) {
    return {
      ...state,
      measurementAtoms: newMeasurementAtoms.slice(0, 2),
    };
  }
  
  return { ...state, measurementAtoms: newMeasurementAtoms };
};

const handleClearMeasurement = (state) => ({
  ...state,
  measurementMode: null,
  measurementAtoms: [],
});

const handleToggleRecording = (state) => {
  if (state.isRecording) {
    // Stop recording
    return { ...state, isRecording: false };
  } else {
    // Start recording
    return { ...state, isRecording: true, recordedFrames: [] };
  }
};

const handleAddRecordedFrame = (state, frameData) => ({
  ...state,
  recordedFrames: [...state.recordedFrames, frameData],
});

const handleClearRecording = (state) => ({
  ...state,
  recordedFrames: [],
});

const handleSetCustomAtomColor = (state, { atomId, color }) => ({
  ...state,
  atoms: state.atoms.map(atom =>
    atom.id === atomId ? { ...atom, customColor: color } : atom
  ),
  customAtomColors: { ...state.customAtomColors, [atomId]: color },
});

const handleDeleteSelectedAtoms = (state) => {
  if (state.selectedAtomIds.length === 0) return state;
  
  return {
    ...state,
    atoms: state.atoms.filter(a => !state.selectedAtomIds.includes(a.id)),
    selectedAtomIds: [],
    playerId: state.selectedAtomIds.includes(state.playerId) ? null : state.playerId,
  };
};

const handleSetInitialPositions = (state) => ({
  ...state,
  initialPositions: state.atoms.map(a => ({ id: a.id, x: a.pos.x, y: a.pos.y, z: a.pos.z })),
  msdData: [],
});

const handleClearMsdTracking = (state) => ({
  ...state,
  initialPositions: [],
  msdData: [],
});

const handleImportStructure = (state, { atoms: importedAtoms, format }) => {
  logSimulation.info('Importing structure', { format, atomCount: importedAtoms.length });
  
  const cx = state.size.x / 2;
  const cy = state.size.y / 2;
  
  // Find center of imported structure
  const impCx = importedAtoms.reduce((s, a) => s + a.x, 0) / importedAtoms.length;
  const impCy = importedAtoms.reduce((s, a) => s + a.y, 0) / importedAtoms.length;
  
  const newAtoms = importedAtoms.map((atomData, i) =>
    createAtom(
      state.nextAtomId + i,
      cx + (atomData.x - impCx) * 10, // Scale factor
      cy + (atomData.y - impCy) * 10,
      (atomData.z || 0) * 10,
      atomData.type || 1,
      { charge: atomData.charge || 0 }
    )
  );
  
  return {
    ...state,
    atoms: [...state.atoms, ...newAtoms],
    nextAtomId: state.nextAtomId + newAtoms.length,
    playerId: state.playerId ?? state.nextAtomId,
  };
};

// Preset molecular configurations
const PRESET_CONFIGS = {
  waterCluster: {
    name: 'Water Cluster',
    atoms: [
      { x: 0, y: 0, z: 0, type: 3 },     // O
      { x: 0.96, y: 0, z: 0, type: 2 },  // H
      { x: -0.24, y: 0.93, z: 0, type: 2 }, // H
      { x: 3, y: 0, z: 0, type: 3 },     // O
      { x: 3.96, y: 0, z: 0, type: 2 },  // H
      { x: 2.76, y: 0.93, z: 0, type: 2 }, // H
      { x: 1.5, y: 2.5, z: 0, type: 3 }, // O
      { x: 2.46, y: 2.5, z: 0, type: 2 }, // H
      { x: 1.26, y: 3.43, z: 0, type: 2 }, // H
    ],
  },
  crystalLattice: {
    name: 'Crystal Lattice (2D)',
    atoms: Array.from({ length: 16 }, (_, i) => ({
      x: (i % 4) * 2,
      y: Math.floor(i / 4) * 2,
      z: 0,
      type: 1, // Carbon
    })),
  },
  methane: {
    name: 'Methane (CH4)',
    atoms: [
      { x: 0, y: 0, z: 0, type: 1 },      // C
      { x: 1.1, y: 0, z: 0, type: 2 },    // H
      { x: -0.37, y: 1.04, z: 0, type: 2 }, // H
      { x: -0.37, y: -0.52, z: 0.9, type: 2 }, // H
      { x: -0.37, y: -0.52, z: -0.9, type: 2 }, // H
    ],
  },
  benzene: {
    name: 'Benzene Ring',
    atoms: [
      { x: 0, y: 1.4, z: 0, type: 1 },
      { x: 1.21, y: 0.7, z: 0, type: 1 },
      { x: 1.21, y: -0.7, z: 0, type: 1 },
      { x: 0, y: -1.4, z: 0, type: 1 },
      { x: -1.21, y: -0.7, z: 0, type: 1 },
      { x: -1.21, y: 0.7, z: 0, type: 1 },
      { x: 0, y: 2.5, z: 0, type: 2 },
      { x: 2.17, y: 1.25, z: 0, type: 2 },
      { x: 2.17, y: -1.25, z: 0, type: 2 },
      { x: 0, y: -2.5, z: 0, type: 2 },
      { x: -2.17, y: -1.25, z: 0, type: 2 },
      { x: -2.17, y: 1.25, z: 0, type: 2 },
    ],
  },
  randomGas: {
    name: 'Random Gas (20 atoms)',
    generate: (size) => Array.from({ length: 20 }, () => ({
      x: (Math.random() - 0.5) * 8,
      y: (Math.random() - 0.5) * 6,
      z: 0,
      type: Math.random() > 0.7 ? 3 : 2, // 70% H, 30% O
    })),
  },
};

const handleLoadPreset = (state, presetKey) => {
  const preset = PRESET_CONFIGS[presetKey];
  if (!preset) return state;
  
  const cx = state.size.x / 2;
  const cy = state.size.y / 2;
  
  const atomDefs = preset.generate ? preset.generate(state.size) : preset.atoms;
  
  const newAtoms = atomDefs.map((atomDef, index) =>
    createAtom(
      state.nextAtomId + index,
      cx + atomDef.x * 2,
      cy + atomDef.y * 2,
      atomDef.z * 2,
      atomDef.type
    )
  );
  
  logSimulation.info('Preset loaded', { preset: presetKey, atomCount: newAtoms.length });
  
  return {
    ...state,
    atoms: [...state.atoms, ...newAtoms],
    nextAtomId: state.nextAtomId + newAtoms.length,
    playerId: state.playerId ?? state.nextAtomId,
  };
};

// Export presets for UI
export { PRESET_CONFIGS };

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
  UPDATE_SETTINGS: handleUpdateSettings,
  SET_SIZE: handleSetSize,
  INCREMENT_TIME: handleIncrementTime,
  ADD_FIREBALL: handleAddFireball,
  UPDATE_FIREBALLS: handleUpdateFireballs,
  SET_PLAYER_FORCE: handleSetPlayerForce,
  CLEAR_PLAYER_FORCE: handleClearPlayerForce,
  SET_STATUS: handleSetStatus,
  INITIALIZE: handleInitialize,
  // New feature actions
  SET_TARGET_TEMPERATURE: handleSetTargetTemperature,
  SET_ZOOM: handleSetZoom,
  SET_PAN: handleSetPan,
  SELECT_ATOM: handleSelectAtom,
  SET_DRAGGING_ATOM: handleSetDraggingAtom,
  TOGGLE_VELOCITY_VECTORS: handleToggleVelocityVectors,
  TOGGLE_ATOM_LABELS: handleToggleAtomLabels,
  TOGGLE_BOND_LENGTHS: handleToggleBondLengths,
  SET_BOUNDARY_CONDITION: handleSetBoundaryCondition,
  SET_TIME_STEP_MULTIPLIER: handleSetTimeStepMultiplier,
  SET_THEME: handleSetTheme,
  TOGGLE_FULLSCREEN: handleToggleFullscreen,
  PUSH_UNDO: handlePushUndo,
  UNDO: handleUndo,
  REDO: handleRedo,
  CALCULATE_RDF: handleCalculateRDF,
  LOAD_SIMULATION_STATE: handleLoadSimulationState,
  LOAD_PRESET: handleLoadPreset,
  // Phase 2 feature actions
  TOGGLE_THERMOSTAT: handleToggleThermostat,
  SET_THERMOSTAT_TAU: handleSetThermostatTau,
  TOGGLE_COULOMB: handleToggleCoulomb,
  SET_COULOMB_CONSTANT: handleSetCoulombConstant,
  TOGGLE_QEQ: handleToggleQEq,
  SET_QEQ_INTERVAL: handleSetQEqInterval,
  TOGGLE_3D_DEPTH: handleToggle3DDepth,
  TOGGLE_FIX_ATOM: handleToggleFixAtom,
  SET_ATOM_CHARGE: handleSetAtomCharge,
  MULTI_SELECT: handleMultiSelect,
  ADD_TO_SELECTION: handleAddToSelection,
  REMOVE_FROM_SELECTION: handleRemoveFromSelection,
  CLEAR_SELECTION: handleClearSelection,
  COPY_ATOMS: handleCopyAtoms,
  PASTE_ATOMS: handlePasteAtoms,
  SET_MEASUREMENT_MODE: handleSetMeasurementMode,
  ADD_MEASUREMENT_ATOM: handleAddMeasurementAtom,
  CLEAR_MEASUREMENT: handleClearMeasurement,
  TOGGLE_RECORDING: handleToggleRecording,
  ADD_RECORDED_FRAME: handleAddRecordedFrame,
  CLEAR_RECORDING: handleClearRecording,
  SET_CUSTOM_ATOM_COLOR: handleSetCustomAtomColor,
  DELETE_SELECTED_ATOMS: handleDeleteSelectedAtoms,
  SET_INITIAL_POSITIONS: handleSetInitialPositions,
  CLEAR_MSD_TRACKING: handleClearMsdTracking,
  IMPORT_STRUCTURE: handleImportStructure,
  // View control actions
  TOGGLE_LOCK_ZOOM: handleToggleLockZoom,
  RESET_VIEW: handleResetView,
  // Visual enhancement actions
  TOGGLE_COLOR_BY_VELOCITY: handleToggleColorByVelocity,
  TOGGLE_MOTION_TRAILS: handleToggleMotionTrails,
  SET_TRAIL_LENGTH: handleSetTrailLength,
  UPDATE_POSITION_HISTORY: handleUpdatePositionHistory,
  TOGGLE_AUTO_SAVE: handleToggleAutoSave,
  SET_LAST_AUTO_SAVE: handleSetLastAutoSave,
  CLEAR_POSITION_HISTORY: handleClearPositionHistory,
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
