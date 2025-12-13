/**
 * @fileoverview Unit tests for Physics Engine
 * @description Tests for molecular dynamics calculations
 */
import {
  ATOM_TYPES,
  calculateDistance,
  lennardJonesForce,
  coulombForce,
  calculateTaper,
  calculateBondOrder,
  applyWallForces,
  clipVelocity,
  calculateInteractions,
  calculateKineticEnergy,
  calculateTemperature,
  integrateMotion,
  MOLECULE_PRESETS,
} from '../../src/simulation/physics';

describe('Physics Engine', () => {
  describe('ATOM_TYPES', () => {
    it('should have Carbon defined as type 1', () => {
      expect(ATOM_TYPES[1]).toBeDefined();
      expect(ATOM_TYPES[1].symbol).toBe('C');
      expect(ATOM_TYPES[1].name).toBe('Carbon');
    });

    it('should have Hydrogen defined as type 2', () => {
      expect(ATOM_TYPES[2]).toBeDefined();
      expect(ATOM_TYPES[2].symbol).toBe('H');
      expect(ATOM_TYPES[2].mass).toBeCloseTo(1.008, 2);
    });

    it('should have Oxygen defined as type 3', () => {
      expect(ATOM_TYPES[3]).toBeDefined();
      expect(ATOM_TYPES[3].symbol).toBe('O');
      expect(ATOM_TYPES[3].color).toBe('#FF0D0D');
    });

    it('should have Nitrogen defined as type 4', () => {
      expect(ATOM_TYPES[4]).toBeDefined();
      expect(ATOM_TYPES[4].symbol).toBe('N');
      expect(ATOM_TYPES[4].valency).toBe(3);
    });

    it('should have Sulfur defined as type 5', () => {
      expect(ATOM_TYPES[5]).toBeDefined();
      expect(ATOM_TYPES[5].symbol).toBe('S');
    });

    it('should have Phosphorus defined as type 6', () => {
      expect(ATOM_TYPES[6]).toBeDefined();
      expect(ATOM_TYPES[6].symbol).toBe('P');
    });

    it('should have Silicon defined as type 7', () => {
      expect(ATOM_TYPES[7]).toBeDefined();
      expect(ATOM_TYPES[7].symbol).toBe('Si');
    });

    it('should have Gold defined as type 8', () => {
      expect(ATOM_TYPES[8]).toBeDefined();
      expect(ATOM_TYPES[8].symbol).toBe('Au');
    });

    it('should have all required properties for each atom type', () => {
      Object.values(ATOM_TYPES).forEach(atom => {
        expect(atom).toHaveProperty('name');
        expect(atom).toHaveProperty('symbol');
        expect(atom).toHaveProperty('mass');
        expect(atom).toHaveProperty('radius');
        expect(atom).toHaveProperty('valency');
        expect(atom).toHaveProperty('color');
        expect(atom).toHaveProperty('roSigma');
      });
    });
  });

  describe('calculateDistance', () => {
    it('should calculate distance between two atoms correctly', () => {
      const atom1 = { pos: { x: 0, y: 0, z: 0 } };
      const atom2 = { pos: { x: 3, y: 4, z: 0 } };
      
      const result = calculateDistance(atom1, atom2);
      
      expect(result.distance).toBeCloseTo(5, 5);
      expect(result.dx).toBe(3);
      expect(result.dy).toBe(4);
      expect(result.dz).toBe(0);
    });

    it('should return zero distance for same position', () => {
      const atom1 = { pos: { x: 5, y: 5, z: 5 } };
      const atom2 = { pos: { x: 5, y: 5, z: 5 } };
      
      const result = calculateDistance(atom1, atom2);
      
      expect(result.distance).toBe(0);
    });

    it('should calculate 3D distance correctly', () => {
      const atom1 = { pos: { x: 0, y: 0, z: 0 } };
      const atom2 = { pos: { x: 1, y: 1, z: 1 } };
      
      const result = calculateDistance(atom1, atom2);
      
      expect(result.distance).toBeCloseTo(Math.sqrt(3), 5);
    });

    it('should handle negative coordinates', () => {
      const atom1 = { pos: { x: -5, y: -5, z: -5 } };
      const atom2 = { pos: { x: 5, y: 5, z: 5 } };
      
      const result = calculateDistance(atom1, atom2);
      
      expect(result.dx).toBe(10);
      expect(result.dy).toBe(10);
      expect(result.dz).toBe(10);
    });
  });

  describe('lennardJonesForce', () => {
    it('should return force and energy', () => {
      const result = lennardJonesForce(3.5);
      
      expect(result).toHaveProperty('force');
      expect(result).toHaveProperty('energy');
    });

    it('should return repulsive force at short distance', () => {
      const result = lennardJonesForce(1.0);
      
      expect(result.force).toBeGreaterThan(0);
    });

    it('should return attractive force at medium distance', () => {
      const result = lennardJonesForce(4.0);
      
      expect(result.force).toBeLessThan(0);
    });

    it('should handle very small distances without NaN', () => {
      const result = lennardJonesForce(0.01);
      
      expect(Number.isFinite(result.force)).toBe(true);
      expect(Number.isFinite(result.energy)).toBe(true);
    });

    it('should respect custom sigma and epsilon', () => {
      const result1 = lennardJonesForce(3.0, 2.0, 1.0);
      const result2 = lennardJonesForce(3.0, 3.0, 1.0);
      
      expect(result1.force).not.toBe(result2.force);
    });
  });

  describe('coulombForce', () => {
    it('should return repulsive force for like charges', () => {
      const result = coulombForce(2.0, 1.0, 1.0);
      
      expect(result.energy).toBeGreaterThan(0);
    });

    it('should return attractive force for opposite charges', () => {
      const result = coulombForce(2.0, 1.0, -1.0);
      
      expect(result.energy).toBeLessThan(0);
    });

    it('should return zero for neutral charges', () => {
      const result = coulombForce(2.0, 0, 1.0);
      
      expect(result.energy).toBe(0);
      // Handle -0 vs 0 comparison
      expect(result.force === 0 || result.force === -0).toBe(true);
    });

    it('should decrease with distance', () => {
      const closeResult = coulombForce(2.0, 1.0, 1.0);
      const farResult = coulombForce(4.0, 1.0, 1.0);
      
      expect(Math.abs(closeResult.energy)).toBeGreaterThan(Math.abs(farResult.energy));
    });

    it('should handle small distances without NaN', () => {
      const result = coulombForce(0.01, 1.0, 1.0);
      
      expect(Number.isFinite(result.force)).toBe(true);
      expect(Number.isFinite(result.energy)).toBe(true);
    });
  });

  describe('calculateTaper', () => {
    it('should return tap of 1 at r=0', () => {
      const result = calculateTaper(0);
      
      expect(result.tap).toBe(1);
    });

    it('should return tap of 0 at cutoff', () => {
      const result = calculateTaper(10.0, 10.0);
      
      expect(result.tap).toBe(0);
    });

    it('should return tap between 0 and 1 for intermediate distances', () => {
      const result = calculateTaper(5.0, 10.0);
      
      expect(result.tap).toBeGreaterThan(0);
      expect(result.tap).toBeLessThan(1);
    });

    it('should smoothly decrease with distance', () => {
      const tap1 = calculateTaper(2.0, 10.0).tap;
      const tap2 = calculateTaper(5.0, 10.0).tap;
      const tap3 = calculateTaper(8.0, 10.0).tap;
      
      expect(tap1).toBeGreaterThan(tap2);
      expect(tap2).toBeGreaterThan(tap3);
    });
  });

  describe('calculateBondOrder', () => {
    it('should return positive bond order for close atoms', () => {
      const bo = calculateBondOrder(1.5, 1, 1); // C-C
      
      expect(bo).toBeGreaterThan(0);
    });

    it('should return zero for distant atoms', () => {
      const bo = calculateBondOrder(10.0, 1, 1);
      
      expect(bo).toBe(0);
    });

    it('should handle invalid atom types', () => {
      const bo = calculateBondOrder(1.5, 999, 999);
      
      expect(bo).toBe(0);
    });

    it('should decrease with distance', () => {
      const bo1 = calculateBondOrder(1.2, 1, 1);
      const bo2 = calculateBondOrder(1.5, 1, 1);
      const bo3 = calculateBondOrder(2.0, 1, 1);
      
      expect(bo1).toBeGreaterThan(bo2);
      expect(bo2).toBeGreaterThan(bo3);
    });
  });

  describe('applyWallForces', () => {
    it('should apply force when atom is near left wall', () => {
      const atom = {
        pos: { x: 5, y: 100, z: 0 },
        radius: 10,
      };
      const size = { x: 200, y: 200, z: 200 };
      
      const force = applyWallForces(atom, size);
      
      expect(force.x).toBeGreaterThan(0);
    });

    it('should apply force when atom is near right wall', () => {
      const atom = {
        pos: { x: 195, y: 100, z: 0 },
        radius: 10,
      };
      const size = { x: 200, y: 200, z: 200 };
      
      const force = applyWallForces(atom, size);
      
      expect(force.x).toBeLessThan(0);
    });

    it('should return zero force when atom is in center', () => {
      const atom = {
        pos: { x: 100, y: 100, z: 100 },
        radius: 10,
      };
      const size = { x: 200, y: 200, z: 200 };
      
      const force = applyWallForces(atom, size);
      
      expect(force.x).toBe(0);
      expect(force.y).toBe(0);
      expect(force.z).toBe(0);
    });
  });

  describe('clipVelocity', () => {
    it('should not modify velocity within bounds', () => {
      const vel = { x: 10, y: -10, z: 5 };
      const result = clipVelocity(vel, 100);
      
      expect(result.x).toBe(10);
      expect(result.y).toBe(-10);
      expect(result.z).toBe(5);
    });

    it('should clip positive velocities to max', () => {
      const vel = { x: 200, y: 0, z: 0 };
      const result = clipVelocity(vel, 100);
      
      expect(result.x).toBe(100);
    });

    it('should clip negative velocities to -max', () => {
      const vel = { x: -200, y: 0, z: 0 };
      const result = clipVelocity(vel, 100);
      
      expect(result.x).toBe(-100);
    });
  });

  describe('calculateKineticEnergy', () => {
    it('should calculate kinetic energy correctly', () => {
      const atoms = [{
        vel: { x: 10, y: 0, z: 0 },
        mass: 2.0,
      }];
      
      const ke = calculateKineticEnergy(atoms);
      
      // KE = 0.5 * m * v^2 = 0.5 * 2 * 100 = 100
      expect(ke).toBeCloseTo(100, 1);
    });

    it('should return zero for stationary atoms', () => {
      const atoms = [{
        vel: { x: 0, y: 0, z: 0 },
        mass: 12.0,
      }];
      
      const ke = calculateKineticEnergy(atoms);
      
      expect(ke).toBe(0);
    });

    it('should sum energy from multiple atoms', () => {
      const atoms = [
        { vel: { x: 10, y: 0, z: 0 }, mass: 1.0 },
        { vel: { x: 10, y: 0, z: 0 }, mass: 1.0 },
      ];
      
      const ke = calculateKineticEnergy(atoms);
      
      expect(ke).toBeCloseTo(100, 1); // 50 + 50
    });
  });

  describe('calculateTemperature', () => {
    it('should return temperature based on kinetic energy', () => {
      const atoms = [
        { vel: { x: 100, y: 0, z: 0 }, mass: 1.0 },
      ];
      
      const temp = calculateTemperature(atoms);
      
      expect(temp).toBeGreaterThan(0);
    });

    it('should return zero for stationary atoms', () => {
      const atoms = [
        { vel: { x: 0, y: 0, z: 0 }, mass: 1.0 },
      ];
      
      const temp = calculateTemperature(atoms);
      
      expect(temp).toBe(0);
    });

    it('should handle empty atoms array', () => {
      const temp = calculateTemperature([]);
      
      expect(temp).toBe(0);
    });
  });

  describe('integrateMotion', () => {
    it('should integrate atom motion correctly', () => {
      const atoms = [{
        pos: { x: 100, y: 100, z: 0 },
        vel: { x: 1, y: 1, z: 0 },
        force: { x: 0, y: 0, z: 0 },
        type: 1,
        radius: 17,
        mass: 12.011,
      }];
      const size = { x: 800, y: 600, z: 100 };
      
      const result = integrateMotion(atoms, size, 0.01);
      
      // integrateMotion returns an array of updated atoms
      expect(Array.isArray(result)).toBe(true);
      expect(result.length).toBe(1);
      expect(result[0].pos).toBeDefined();
    });

    it('should handle empty atoms array', () => {
      const size = { x: 800, y: 600, z: 100 };
      
      const result = integrateMotion([], size, 1.0);
      
      expect(Array.isArray(result)).toBe(true);
      expect(result.length).toBe(0);
    });

    it('should update atom positions based on velocity', () => {
      const atoms = [{
        pos: { x: 100, y: 100, z: 0 },
        vel: { x: 10, y: 10, z: 0 },
        force: { x: 0, y: 0, z: 0 },
        type: 1,
        radius: 17,
        mass: 12.011,
      }];
      const size = { x: 800, y: 600, z: 100 };
      
      const result = integrateMotion(atoms, size, 1.0);
      
      // Position should change based on velocity
      expect(result[0].pos.x).not.toBe(100);
    });
  });
});
