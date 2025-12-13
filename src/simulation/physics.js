/**
 * Physics Engine for Molecular Dynamics Simulation
 * Implements ReaxFF-inspired force calculations and integration
 */

import {
  WALL_SPRING,
  MAX_VEL,
  LJ_SIGMA,
  LJ_EPSILON,
  COULOMB_CONSTANT,
  BOND_CUTOFF,
  TIMESTEP_IN_SIMULATION_UNIT,
  TIMESTAMP_IN_FEMPTO_SEC,
} from './constants';

/**
 * Atom type definitions with properties
 * Extended with elements from ReaxFF force field parameter files
 * @type {Object<number, AtomType>}
 */
export const ATOM_TYPES = {
  // Core organic elements
  1: { 
    name: 'Carbon', 
    symbol: 'C', 
    mass: 12.011, 
    radius: 1.7, 
    valency: 4,
    color: '#222222',         // CPK: Dark charcoal gray
    highlightColor: '#555555',
    charge: 0,
    roSigma: 1.3817,
    roPi: 1.1341,
    roPiPi: 1.2114,
  },
  2: { 
    name: 'Hydrogen', 
    symbol: 'H', 
    mass: 1.008, 
    radius: 1.2, 
    valency: 1,
    color: '#FFFFFF',         // CPK: White
    highlightColor: '#E8E8E8',
    charge: 0.1,
    roSigma: 0.8930,
    roPi: -0.1,
    roPiPi: -0.1,
  },
  3: { 
    name: 'Oxygen', 
    symbol: 'O', 
    mass: 15.999, 
    radius: 1.52, 
    valency: 2,
    color: '#FF0D0D',         // CPK: Bright red
    highlightColor: '#FF6666',
    charge: -0.2,
    roSigma: 1.2450,
    roPi: 1.0548,
    roPiPi: 0.9049,
  },
  4: { 
    name: 'Nitrogen', 
    symbol: 'N', 
    mass: 14.007, 
    radius: 1.55, 
    valency: 3,
    color: '#3050F8',         // CPK: Deep blue
    highlightColor: '#7090FF',
    charge: -0.1,
    roSigma: 1.2333,
    roPi: 1.1748,
    roPiPi: 1.0433,
  },
  5: { 
    name: 'Sulfur', 
    symbol: 'S', 
    mass: 32.06, 
    radius: 1.8, 
    valency: 6,
    color: '#FFFF30',         // CPK: Yellow
    highlightColor: '#FFFF80',
    charge: 0,
    roSigma: 1.9673,
    roPi: 1.5359,
    roPiPi: 1.4601,
  },
  6: { 
    name: 'Phosphorus', 
    symbol: 'P', 
    mass: 30.974, 
    radius: 1.8, 
    valency: 5,
    color: '#FF8000',         // CPK: Orange
    highlightColor: '#FFAA55',
    charge: 0,
    roSigma: 1.5994,
    roPi: 1.3000,
    roPiPi: -1.0,
  },
  // Metals and additional elements from ReaxFF force fields
  7: { 
    name: 'Silicon', 
    symbol: 'Si', 
    mass: 28.0855, 
    radius: 2.1, 
    valency: 4,
    color: '#F0C8A0',         // CPK: Tan/Beige
    highlightColor: '#F5DCC8',
    charge: 0,
    roSigma: 2.0175,
    roPi: 1.2962,
    roPiPi: -1.0,
  },
  8: { 
    name: 'Gold', 
    symbol: 'Au', 
    mass: 196.967, 
    radius: 1.66, 
    valency: 1,
    color: '#FFD123',         // CPK: Gold
    highlightColor: '#FFE066',
    charge: 0,
    roSigma: 1.9083,
    roPi: -1.0,
    roPiPi: -1.0,
  },
  9: { 
    name: 'Platinum', 
    symbol: 'Pt', 
    mass: 195.084, 
    radius: 1.75, 
    valency: 4,
    color: '#D0D0E0',         // CPK: Light Gray-Blue
    highlightColor: '#E8E8F0',
    charge: 0,
    roSigma: 1.8582,
    roPi: 1.6054,
    roPiPi: -1.0,
  },
  10: { 
    name: 'Zinc', 
    symbol: 'Zn', 
    mass: 65.38, 
    radius: 1.39, 
    valency: 2,
    color: '#7D80B0',         // CPK: Slate Blue
    highlightColor: '#A0A3C8',
    charge: 0,
    roSigma: 1.8200,
    roPi: -1.0,
    roPiPi: -1.0,
  },
  11: { 
    name: 'Copper', 
    symbol: 'Cu', 
    mass: 63.546, 
    radius: 1.4, 
    valency: 2,
    color: '#C88033',         // CPK: Copper
    highlightColor: '#D9A066',
    charge: 0,
    roSigma: 1.9202,
    roPi: 0.1,
    roPiPi: -1.0,
  },
  12: { 
    name: 'Magnesium', 
    symbol: 'Mg', 
    mass: 24.305, 
    radius: 1.73, 
    valency: 2,
    color: '#8AFF00',         // CPK: Bright Green
    highlightColor: '#B5FF55',
    charge: 0,
    roSigma: 1.8315,
    roPi: 1.0,
    roPiPi: -1.3,
  },
  13: { 
    name: 'Sodium', 
    symbol: 'Na', 
    mass: 22.990, 
    radius: 2.27, 
    valency: 1,
    color: '#AB5CF2',         // CPK: Purple
    highlightColor: '#C88FF8',
    charge: 1,
    roSigma: 2.0300,
    roPi: -1.0,
    roPiPi: -1.0,
  },
  14: { 
    name: 'Titanium', 
    symbol: 'Ti', 
    mass: 47.867, 
    radius: 1.47, 
    valency: 4,
    color: '#BFC2C7',         // CPK: Gray
    highlightColor: '#D5D8DD',
    charge: 0,
    roSigma: 1.7403,
    roPi: -1.0,
    roPiPi: -1.0,
  },
  15: { 
    name: 'Nickel', 
    symbol: 'Ni', 
    mass: 58.693, 
    radius: 1.24, 
    valency: 2,
    color: '#50D050',         // CPK: Green
    highlightColor: '#80E080',
    charge: 0,
    roSigma: 1.8099,
    roPi: -1.0,
    roPiPi: -1.0,
  },
  16: { 
    name: 'Zirconium', 
    symbol: 'Zr', 
    mass: 91.224, 
    radius: 1.75, 
    valency: 4,
    color: '#94E0E0',         // CPK: Light Cyan
    highlightColor: '#B8F0F0',
    charge: 0,
    roSigma: 1.9074,
    roPi: -1.0,
    roPiPi: -1.0,
  },
  17: { 
    name: 'Aluminum', 
    symbol: 'Al', 
    mass: 26.982, 
    radius: 1.84, 
    valency: 3,
    color: '#BFA6A6',         // CPK: Light Pink-Gray
    highlightColor: '#D5C8C8',
    charge: 0,
    roSigma: 2.0254,
    roPi: -1.0,
    roPiPi: -1.0,
  },
  18: { 
    name: 'Boron', 
    symbol: 'B', 
    mass: 10.81, 
    radius: 1.92, 
    valency: 3,
    color: '#FFB5B5',         // CPK: Salmon
    highlightColor: '#FFD5D5',
    charge: 0,
    roSigma: 1.5600,
    roPi: 1.3100,
    roPiPi: -1.0,
  },
};

/**
 * Calculate distance between two atoms
 */
export function calculateDistance(atom1, atom2) {
  const dx = atom2.pos.x - atom1.pos.x;
  const dy = atom2.pos.y - atom1.pos.y;
  const dz = atom2.pos.z - atom1.pos.z;
  return {
    dx,
    dy,
    dz,
    distance: Math.sqrt(dx * dx + dy * dy + dz * dz),
  };
}

/**
 * Calculate Lennard-Jones potential and force
 * V(r) = 4ε[(σ/r)^12 - (σ/r)^6]
 */
export function lennardJonesForce(distance, sigma = LJ_SIGMA, epsilon = LJ_EPSILON) {
  if (distance < 0.1) distance = 0.1; // Avoid singularity
  
  const sigma6 = Math.pow(sigma / distance, 6);
  const sigma12 = sigma6 * sigma6;
  
  // Force magnitude: F = 24ε/r * [2(σ/r)^12 - (σ/r)^6]
  const forceMagnitude = 24 * epsilon / distance * (2 * sigma12 - sigma6);
  
  // Energy
  const energy = 4 * epsilon * (sigma12 - sigma6);
  
  return { force: forceMagnitude, energy };
}

/**
 * Calculate Coulomb interaction
 * V(r) = k * q1 * q2 / r
 */
export function coulombForce(distance, q1, q2) {
  if (distance < 0.5) distance = 0.5; // Avoid singularity
  
  const energy = COULOMB_CONSTANT * q1 * q2 / distance;
  const force = -COULOMB_CONSTANT * q1 * q2 / (distance * distance);
  
  return { force, energy };
}

/**
 * Calculate taper correction for smooth cutoff
 */
export function calculateTaper(r, Rcut = 10.0) {
  if (r >= Rcut) return { tap: 0, dTap: 0 };
  
  const Tap7 = 20 / Math.pow(Rcut, 7);
  const Tap6 = -70 / Math.pow(Rcut, 6);
  const Tap5 = 84 / Math.pow(Rcut, 5);
  const Tap4 = -35 / Math.pow(Rcut, 4);
  
  const tap = Tap7 * Math.pow(r, 7) + Tap6 * Math.pow(r, 6) + 
              Tap5 * Math.pow(r, 5) + Tap4 * Math.pow(r, 4) + 1;
  
  return { tap, dTap: 0 };
}

/**
 * Calculate bond order between two atoms
 */
export function calculateBondOrder(distance, atom1Type, atom2Type) {
  const type1 = ATOM_TYPES[atom1Type];
  const type2 = ATOM_TYPES[atom2Type];
  
  if (!type1 || !type2) return 0;
  
  const roSigma = (type1.roSigma + type2.roSigma) / 2;
  
  if (distance > roSigma * 2.5) return 0;
  
  // Simplified bond order calculation
  const pbo1 = -0.1;
  const pbo2 = 6.0;
  
  const C12 = pbo1 * Math.pow(distance / roSigma, pbo2);
  const BO_sigma = Math.exp(C12);
  
  return Math.max(0, BO_sigma);
}

/**
 * Apply wall barrier forces
 */
export function applyWallForces(atom, size, wallSpring = WALL_SPRING) {
  const force = { x: 0, y: 0, z: 0 };
  const radius = atom.radius;
  
  // X boundaries
  if (atom.pos.x - radius < 0) {
    force.x = -wallSpring * (atom.pos.x - radius);
  } else if (atom.pos.x + radius > size.x) {
    force.x = -wallSpring * (atom.pos.x + radius - size.x);
  }
  
  // Y boundaries
  if (atom.pos.y - radius < 0) {
    force.y = -wallSpring * (atom.pos.y - radius);
  } else if (atom.pos.y + radius > size.y) {
    force.y = -wallSpring * (atom.pos.y + radius - size.y);
  }
  
  // Z boundaries
  if (atom.pos.z - radius < 0) {
    force.z = -wallSpring * (atom.pos.z - radius);
  } else if (atom.pos.z + radius > size.z) {
    force.z = -wallSpring * (atom.pos.z + radius - size.z);
  }
  
  return force;
}

/**
 * Clip velocity to maximum value
 */
export function clipVelocity(vel, maxVel = MAX_VEL) {
  return {
    x: Math.max(-maxVel, Math.min(maxVel, vel.x)),
    y: Math.max(-maxVel, Math.min(maxVel, vel.y)),
    z: Math.max(-maxVel, Math.min(maxVel, vel.z)),
  };
}

/**
 * Calculate all pairwise interactions and update forces
 * @param {Array} atoms - Array of atom objects
 * @param {Object} params - Simulation parameters
 * @returns {Object} - Updated atoms and energy information
 */
export function calculateInteractions(atoms, params = {}) {
  const { 
    enableLJ = true, 
    enableCoulomb = true,
    dampingFactor = 0.99,
  } = params;
  
  let totalLJEnergy = 0;
  let totalCoulombEnergy = 0;
  const bonds = [];
  
  // Reset forces
  const updatedAtoms = atoms.map(atom => ({
    ...atom,
    force: { x: 0, y: 0, z: 0 },
  }));
  
  // Calculate pairwise interactions
  for (let i = 0; i < updatedAtoms.length; i++) {
    for (let j = i + 1; j < updatedAtoms.length; j++) {
      const atom1 = updatedAtoms[i];
      const atom2 = updatedAtoms[j];
      
      const { dx, dy, dz, distance } = calculateDistance(atom1, atom2);
      
      if (distance < 0.1) continue; // Skip if too close
      
      // Calculate forces
      let totalForce = 0;
      
      // Lennard-Jones
      if (enableLJ) {
        const sigma = (atom1.radius + atom2.radius) / 2;
        const lj = lennardJonesForce(distance, sigma, LJ_EPSILON);
        totalForce += lj.force;
        totalLJEnergy += lj.energy;
      }
      
      // Coulomb
      if (enableCoulomb) {
        const type1 = ATOM_TYPES[atom1.type];
        const type2 = ATOM_TYPES[atom2.type];
        const q1 = type1?.charge || 0;
        const q2 = type2?.charge || 0;
        
        if (q1 !== 0 && q2 !== 0) {
          const coulomb = coulombForce(distance, q1, q2);
          totalForce += coulomb.force * 0.1; // Scale down Coulomb
          totalCoulombEnergy += coulomb.energy;
        }
      }
      
      // Apply forces (Newton's third law)
      const fx = totalForce * dx / distance;
      const fy = totalForce * dy / distance;
      const fz = totalForce * dz / distance;
      
      updatedAtoms[i].force.x += fx;
      updatedAtoms[i].force.y += fy;
      updatedAtoms[i].force.z += fz;
      
      updatedAtoms[j].force.x -= fx;
      updatedAtoms[j].force.y -= fy;
      updatedAtoms[j].force.z -= fz;
      
      // Calculate bond order for visualization
      const bondOrder = calculateBondOrder(distance, atom1.type, atom2.type);
      if (bondOrder > BOND_CUTOFF) {
        bonds.push({
          atom1Id: atom1.id,
          atom2Id: atom2.id,
          order: bondOrder,
          distance,
        });
      }
    }
  }
  
  return {
    atoms: updatedAtoms,
    bonds,
    energy: {
      lj: totalLJEnergy,
      coulomb: totalCoulombEnergy,
      total: totalLJEnergy + totalCoulombEnergy,
    },
  };
}

/**
 * Integrate equations of motion (Velocity Verlet)
 * @param {Array} atoms - Array of atom objects
 * @param {Object} size - Simulation box size
 * @param {number} dt - Time step
 * @returns {Array} - Updated atoms
 */
export function integrateMotion(atoms, size, dt = 0.01) {
  return atoms.map(atom => {
    if (atom.mass <= 0) return atom; // Fixed atom
    
    const type = ATOM_TYPES[atom.type];
    const mass = type?.mass || atom.mass;
    
    // Apply wall forces
    const wallForce = applyWallForces(atom, size);
    const totalForce = {
      x: atom.force.x + wallForce.x,
      y: atom.force.y + wallForce.y,
      z: atom.force.z + wallForce.z,
    };
    
    // Velocity update
    const newVel = {
      x: atom.vel.x + (totalForce.x / mass) * dt,
      y: atom.vel.y + (totalForce.y / mass) * dt,
      z: atom.vel.z + (totalForce.z / mass) * dt,
    };
    
    // Apply damping (energy dissipation)
    newVel.x *= 0.995;
    newVel.y *= 0.995;
    newVel.z *= 0.995;
    
    // Clip velocity
    const clippedVel = clipVelocity(newVel);
    
    // Position update
    const newPos = {
      x: atom.pos.x + clippedVel.x * dt,
      y: atom.pos.y + clippedVel.y * dt,
      z: atom.pos.z + clippedVel.z * dt,
    };
    
    return {
      ...atom,
      pos: newPos,
      vel: clippedVel,
    };
  });
}

/**
 * Calculate kinetic energy
 */
export function calculateKineticEnergy(atoms) {
  return atoms.reduce((total, atom) => {
    const type = ATOM_TYPES[atom.type];
    const mass = type?.mass || atom.mass;
    const v2 = atom.vel.x ** 2 + atom.vel.y ** 2 + atom.vel.z ** 2;
    return total + 0.5 * mass * v2;
  }, 0);
}

/**
 * Calculate temperature from kinetic energy
 * T = (2/3) * KE / (N * kB)
 */
export function calculateTemperature(atoms) {
  const kineticEnergy = calculateKineticEnergy(atoms);
  const kB = 0.0019872; // kcal/(mol·K)
  const N = atoms.length;
  if (N === 0) return 0;
  return (2 / 3) * kineticEnergy / (N * kB);
}

/**
 * Molecule preset atom definition
 * @typedef {Object} MoleculeAtom
 * @property {number} x - X coordinate in Angstroms
 * @property {number} y - Y coordinate in Angstroms  
 * @property {number} z - Z coordinate in Angstroms
 * @property {number} type - Atom type ID from ATOM_TYPES
 */

/**
 * Molecule preset configuration
 * @typedef {Object} MoleculePreset
 * @property {string} name - Display name with chemical formula
 * @property {('common'|'metals')} category - Category for UI grouping
 * @property {MoleculeAtom[]} atoms - Array of atom positions and types
 */

/**
 * Preset molecule configurations for quick loading
 * Organized by category: common organic molecules and metal-containing molecules
 * @type {Object<string, MoleculePreset>}
 */
export const MOLECULE_PRESETS = {
  // Common organic molecules
  water: {
    name: 'Water (H₂O)',
    category: 'common',
    atoms: [
      { x: 0, y: 0, z: 0, type: 3 },     // Oxygen
      { x: 0.96, y: 0, z: 0, type: 2 },   // Hydrogen
      { x: -0.24, y: 0.93, z: 0, type: 2 }, // Hydrogen
    ],
  },
  methane: {
    name: 'Methane (CH₄)',
    category: 'common',
    atoms: [
      { x: 0, y: 0, z: 0, type: 1 },        // Carbon
      { x: 0.63, y: 0.63, z: 0.63, type: 2 }, // H
      { x: -0.63, y: -0.63, z: 0.63, type: 2 }, // H
      { x: -0.63, y: 0.63, z: -0.63, type: 2 }, // H
      { x: 0.63, y: -0.63, z: -0.63, type: 2 }, // H
    ],
  },
  carbonDioxide: {
    name: 'Carbon Dioxide (CO₂)',
    category: 'common',
    atoms: [
      { x: 0, y: 0, z: 0, type: 1 },      // Carbon
      { x: 1.16, y: 0, z: 0, type: 3 },   // Oxygen
      { x: -1.16, y: 0, z: 0, type: 3 },  // Oxygen
    ],
  },
  ammonia: {
    name: 'Ammonia (NH₃)',
    category: 'common',
    atoms: [
      { x: 0, y: 0, z: 0, type: 4 },       // Nitrogen
      { x: 0.94, y: 0.38, z: 0, type: 2 }, // H
      { x: -0.47, y: 0.38, z: 0.81, type: 2 }, // H
      { x: -0.47, y: 0.38, z: -0.81, type: 2 }, // H
    ],
  },
  ozone: {
    name: 'Ozone (O₃)',
    category: 'common',
    atoms: [
      { x: 0, y: 0, z: 0, type: 3 },
      { x: 1.28, y: 0, z: 0, type: 3 },
      { x: 0.64, y: 1.1, z: 0, type: 3 },
    ],
  },
  ethane: {
    name: 'Ethane (C₂H₆)',
    category: 'common',
    atoms: [
      { x: 0, y: 0, z: 0, type: 1 },        // C
      { x: 1.54, y: 0, z: 0, type: 1 },     // C
      { x: -0.36, y: 1.03, z: 0, type: 2 }, // H
      { x: -0.36, y: -0.51, z: 0.89, type: 2 }, // H
      { x: -0.36, y: -0.51, z: -0.89, type: 2 }, // H
      { x: 1.9, y: 1.03, z: 0, type: 2 },   // H
      { x: 1.9, y: -0.51, z: 0.89, type: 2 }, // H
      { x: 1.9, y: -0.51, z: -0.89, type: 2 }, // H
    ],
  },
  hydrogen: {
    name: 'Hydrogen (H₂)',
    category: 'common',
    atoms: [
      { x: 0, y: 0, z: 0, type: 2 },
      { x: 0.74, y: 0, z: 0, type: 2 },
    ],
  },
  oxygen: {
    name: 'Oxygen (O₂)',
    category: 'common',
    atoms: [
      { x: 0, y: 0, z: 0, type: 3 },
      { x: 1.21, y: 0, z: 0, type: 3 },
    ],
  },
  nitrogen: {
    name: 'Nitrogen (N₂)',
    category: 'common',
    atoms: [
      { x: 0, y: 0, z: 0, type: 4 },
      { x: 1.1, y: 0, z: 0, type: 4 },
    ],
  },
  // Metal-containing molecules
  silane: {
    name: 'Silane (SiH₄)',
    category: 'metals',
    atoms: [
      { x: 0, y: 0, z: 0, type: 7 },       // Silicon
      { x: 0.85, y: 0.85, z: 0, type: 2 }, // H
      { x: -0.85, y: -0.85, z: 0, type: 2 }, // H
      { x: 0.85, y: -0.85, z: 0, type: 2 }, // H
      { x: -0.85, y: 0.85, z: 0, type: 2 }, // H
    ],
  },
  zincOxide: {
    name: 'Zinc Oxide (ZnO)',
    category: 'metals',
    atoms: [
      { x: 0, y: 0, z: 0, type: 10 },   // Zinc
      { x: 1.0, y: 0, z: 0, type: 3 },  // Oxygen
    ],
  },
  goldCluster: {
    name: 'Gold Cluster (Au₃)',
    category: 'metals',
    atoms: [
      { x: 0, y: 0, z: 0, type: 8 },    // Gold
      { x: 1.4, y: 0, z: 0, type: 8 },  // Gold
      { x: 0.7, y: 1.2, z: 0, type: 8 }, // Gold
    ],
  },
  copperSulfide: {
    name: 'Copper Sulfide (CuS)',
    category: 'metals',
    atoms: [
      { x: 0, y: 0, z: 0, type: 11 },  // Copper
      { x: 1.2, y: 0, z: 0, type: 5 }, // Sulfur
    ],
  },
};

export default {
  ATOM_TYPES,
  MOLECULE_PRESETS,
  calculateDistance,
  lennardJonesForce,
  coulombForce,
  calculateTaper,
  calculateBondOrder,
  applyWallForces,
  clipVelocity,
  calculateInteractions,
  integrateMotion,
  calculateKineticEnergy,
  calculateTemperature,
};
