/**
 * @fileoverview Unit tests for Simulation Reducer
 * @description Tests for state management in the simulation
 */
import { simulationReducer, INITIAL_SIMULATION_STATE } from '../../src/context/simulationReducer';

// Use the actual initial state export
const initialState = INITIAL_SIMULATION_STATE;

describe('Simulation Reducer', () => {
  describe('initialState', () => {
    it('should have default atoms array', () => {
      expect(initialState.atoms).toBeDefined();
      expect(Array.isArray(initialState.atoms)).toBe(true);
    });

    it('should have default bonds array', () => {
      expect(initialState.bonds).toBeDefined();
      expect(Array.isArray(initialState.bonds)).toBe(true);
    });

    it('should have default size', () => {
      expect(initialState.size).toBeDefined();
      expect(initialState.size.x).toBeGreaterThan(0);
      expect(initialState.size.y).toBeGreaterThan(0);
    });

    it('should have default display options', () => {
      expect(initialState.showBonds).toBeDefined();
      expect(initialState.clearScreen).toBeDefined();
      expect(initialState.enablePhysics).toBeDefined();
    });

    it('should have default energy object', () => {
      expect(initialState.energy).toBeDefined();
      expect(initialState.energy.kinetic).toBe(0);
      expect(initialState.energy.potential).toBe(0);
      expect(initialState.energy.total).toBe(0);
    });
  });

  describe('ADD_ATOM', () => {
    it('should add atom to state', () => {
      const action = {
        type: 'ADD_ATOM',
        payload: { x: 100, y: 100, z: 0, atomType: 1 },
      };
      
      const newState = simulationReducer(initialState, action);
      
      expect(newState.atoms.length).toBe(initialState.atoms.length + 1);
    });

    it('should create atom with correct properties', () => {
      const action = {
        type: 'ADD_ATOM',
        payload: { x: 150, y: 200, z: 0, atomType: 3 },
      };
      
      const newState = simulationReducer(initialState, action);
      const addedAtom = newState.atoms[newState.atoms.length - 1];
      
      expect(addedAtom.pos.x).toBe(150);
      expect(addedAtom.pos.y).toBe(200);
      expect(addedAtom.type).toBe(3);
    });

    it('should initialize velocity to zero', () => {
      const action = {
        type: 'ADD_ATOM',
        payload: { x: 100, y: 100, z: 0, atomType: 1 },
      };
      
      const newState = simulationReducer(initialState, action);
      const addedAtom = newState.atoms[newState.atoms.length - 1];
      
      expect(addedAtom.vel.x).toBe(0);
      expect(addedAtom.vel.y).toBe(0);
      expect(addedAtom.vel.z).toBe(0);
    });
  });

  describe('LOAD_MOLECULE', () => {
    it('should load molecule atoms', () => {
      const action = {
        type: 'LOAD_MOLECULE',
        payload: {
          atoms: [
            { x: 0, y: 0, z: 0, type: 3 },
            { x: 0.96, y: 0.5, z: 0, type: 2 },
            { x: -0.96, y: 0.5, z: 0, type: 2 },
          ],
        },
      };
      
      const newState = simulationReducer(initialState, action);
      
      expect(newState.atoms.length).toBe(initialState.atoms.length + 3);
    });

    it('should position molecule in center of canvas', () => {
      const action = {
        type: 'LOAD_MOLECULE',
        payload: {
          atoms: [
            { x: 0, y: 0, z: 0, type: 1 },
          ],
        },
      };
      
      const newState = simulationReducer(initialState, action);
      const addedAtom = newState.atoms[newState.atoms.length - 1];
      
      // Should be roughly in center
      expect(addedAtom.pos.x).toBeGreaterThan(0);
      expect(addedAtom.pos.y).toBeGreaterThan(0);
    });
  });

  describe('CLEAR_ATOMS', () => {
    it('should remove all atoms', () => {
      const stateWithAtoms = {
        ...initialState,
        atoms: [
          { pos: { x: 100, y: 100, z: 0 }, type: 1 },
          { pos: { x: 200, y: 200, z: 0 }, type: 2 },
        ],
      };
      
      const newState = simulationReducer(stateWithAtoms, { type: 'CLEAR_ATOMS' });
      
      expect(newState.atoms.length).toBe(0);
    });

    it('should clear bonds as well', () => {
      const stateWithBonds = {
        ...initialState,
        atoms: [
          { pos: { x: 100, y: 100, z: 0 }, type: 1 },
          { pos: { x: 200, y: 200, z: 0 }, type: 2 },
        ],
        bonds: [{ atom1: 0, atom2: 1, order: 1 }],
      };
      
      const newState = simulationReducer(stateWithBonds, { type: 'CLEAR_ATOMS' });
      
      expect(newState.bonds.length).toBe(0);
    });
  });

  describe('TOGGLE_PAUSE', () => {
    it('should toggle pause state', () => {
      const action = { type: 'TOGGLE_PAUSE' };
      
      const newState = simulationReducer(initialState, action);
      
      expect(newState.isPaused).toBe(!initialState.isPaused);
    });

    it('should toggle back', () => {
      const action = { type: 'TOGGLE_PAUSE' };
      
      const state1 = simulationReducer(initialState, action);
      const state2 = simulationReducer(state1, action);
      
      expect(state2.isPaused).toBe(initialState.isPaused);
    });
  });

  describe('TOGGLE_BONDS', () => {
    it('should toggle showBonds state', () => {
      const action = { type: 'TOGGLE_BONDS' };
      
      const newState = simulationReducer(initialState, action);
      
      expect(newState.showBonds).toBe(!initialState.showBonds);
    });
  });

  describe('TOGGLE_CLEAR', () => {
    it('should toggle clearScreen state', () => {
      const action = { type: 'TOGGLE_CLEAR' };
      
      const newState = simulationReducer(initialState, action);
      
      expect(newState.clearScreen).toBe(!initialState.clearScreen);
    });
  });

  describe('TOGGLE_PHYSICS', () => {
    it('should toggle enablePhysics state', () => {
      const action = { type: 'TOGGLE_PHYSICS' };
      
      const newState = simulationReducer(initialState, action);
      
      expect(newState.enablePhysics).toBe(!initialState.enablePhysics);
    });
  });

  describe('SET_ATOM_TYPE', () => {
    it('should set selected atom type', () => {
      const action = { type: 'SET_ATOM_TYPE', payload: 3 };
      
      const newState = simulationReducer(initialState, action);
      
      expect(newState.selectedAtomType).toBe(3);
    });

    it('should accept different atom type IDs', () => {
      const action = { type: 'SET_ATOM_TYPE', payload: 8 };
      
      const newState = simulationReducer(initialState, action);
      
      expect(newState.selectedAtomType).toBe(8);
    });
  });

  describe('RESET_SIMULATION', () => {
    it('should reset to initial state with water molecule', () => {
      const modifiedState = {
        ...initialState,
        atoms: [{ id: 99, pos: { x: 100, y: 100, z: 0 }, type: 1 }],
        isPaused: true,
        time: 1000,
      };
      
      const newState = simulationReducer(modifiedState, { type: 'RESET_SIMULATION' });
      
      // RESET_SIMULATION creates initial water molecule (3 atoms)
      expect(newState.atoms.length).toBe(3);
      expect(newState.isPaused).toBe(false);
    });
  });

  describe('PHYSICS_STEP', () => {
    it('should calculate forces and update positions', () => {
      // Create state with atoms that have forces
      const stateWithAtoms = {
        ...initialState,
        atoms: [
          { id: 0, pos: { x: 10, y: 10, z: 0 }, vel: { x: 0, y: 0, z: 0 }, force: { x: 0, y: 0, z: 0 }, type: 1, mass: 12, radius: 1.7 },
          { id: 1, pos: { x: 15, y: 10, z: 0 }, vel: { x: 0, y: 0, z: 0 }, force: { x: 0, y: 0, z: 0 }, type: 2, mass: 1, radius: 1.2 },
        ],
      };
      
      const newState = simulationReducer(stateWithAtoms, { type: 'PHYSICS_STEP' });
      
      expect(newState.atoms).toBeDefined();
      expect(newState.bonds).toBeDefined();
      expect(newState.energy).toBeDefined();
    });

    it('should handle empty atoms array', () => {
      const newState = simulationReducer(initialState, { type: 'PHYSICS_STEP' });
      
      expect(newState.atoms).toEqual([]);
    });

    it('should calculate energy', () => {
      const stateWithAtoms = {
        ...initialState,
        atoms: [
          { id: 0, pos: { x: 10, y: 10, z: 0 }, vel: { x: 1, y: 0, z: 0 }, force: { x: 0, y: 0, z: 0 }, type: 1, mass: 12, radius: 1.7 },
        ],
      };
      
      const newState = simulationReducer(stateWithAtoms, { type: 'PHYSICS_STEP' });
      
      expect(newState.energy.kinetic).toBeGreaterThanOrEqual(0);
    });
  });

  describe('UPDATE_ATOM_POSITION', () => {
    it('should update position of specific atom', () => {
      const stateWithAtoms = {
        ...initialState,
        atoms: [
          { id: 0, pos: { x: 100, y: 100, z: 0 }, vel: { x: 0, y: 0, z: 0 }, type: 1 },
        ],
      };
      
      const action = {
        type: 'UPDATE_ATOM_POSITION',
        payload: { id: 0, position: { x: 200, y: 200, z: 0 } },
      };
      
      const newState = simulationReducer(stateWithAtoms, action);
      
      expect(newState.atoms[0].pos.x).toBe(200);
      expect(newState.atoms[0].pos.y).toBe(200);
    });

    it('should not modify other atoms', () => {
      const stateWithAtoms = {
        ...initialState,
        atoms: [
          { id: 0, pos: { x: 100, y: 100, z: 0 }, vel: { x: 0, y: 0, z: 0 }, type: 1 },
          { id: 1, pos: { x: 200, y: 200, z: 0 }, vel: { x: 0, y: 0, z: 0 }, type: 2 },
        ],
      };
      
      const action = {
        type: 'UPDATE_ATOM_POSITION',
        payload: { id: 0, position: { x: 150, y: 150, z: 0 } },
      };
      
      const newState = simulationReducer(stateWithAtoms, action);
      
      expect(newState.atoms[1].pos.x).toBe(200);
    });
  });

  describe('INCREMENT_TIME', () => {
    it('should increment time by 1', () => {
      const newState = simulationReducer(initialState, { type: 'INCREMENT_TIME' });
      
      expect(newState.time).toBe(initialState.time + 1);
    });
  });

  describe('Unknown action', () => {
    it('should return current state for unknown action', () => {
      const action = { type: 'UNKNOWN_ACTION' };
      
      const newState = simulationReducer(initialState, action);
      
      expect(newState).toEqual(initialState);
    });
  });

  describe('TOGGLE_COLOR_BY_VELOCITY', () => {
    it('should toggle colorByVelocity state', () => {
      const action = { type: 'TOGGLE_COLOR_BY_VELOCITY' };
      
      const newState = simulationReducer(initialState, action);
      
      expect(newState.colorByVelocity).toBe(!initialState.colorByVelocity);
    });

    it('should toggle back to initial state', () => {
      const action = { type: 'TOGGLE_COLOR_BY_VELOCITY' };
      
      const state1 = simulationReducer(initialState, action);
      const state2 = simulationReducer(state1, action);
      
      expect(state2.colorByVelocity).toBe(initialState.colorByVelocity);
    });
  });

  describe('TOGGLE_MOTION_TRAILS', () => {
    it('should toggle showMotionTrails state', () => {
      const action = { type: 'TOGGLE_MOTION_TRAILS' };
      
      const newState = simulationReducer(initialState, action);
      
      expect(newState.showMotionTrails).toBe(!initialState.showMotionTrails);
    });

    it('should clear position history when disabling trails', () => {
      const stateWithHistory = {
        ...initialState,
        showMotionTrails: true,
        positionHistory: { 0: [{ x: 10, y: 10 }, { x: 11, y: 11 }] },
      };
      
      const action = { type: 'TOGGLE_MOTION_TRAILS' };
      const newState = simulationReducer(stateWithHistory, action);
      
      expect(newState.showMotionTrails).toBe(false);
      expect(newState.positionHistory).toEqual({});
    });
  });

  describe('SET_TRAIL_LENGTH', () => {
    it('should set trail length', () => {
      const action = { type: 'SET_TRAIL_LENGTH', payload: 30 };
      
      const newState = simulationReducer(initialState, action);
      
      expect(newState.trailLength).toBe(30);
    });

    it('should enforce minimum trail length of 5', () => {
      const action = { type: 'SET_TRAIL_LENGTH', payload: 2 };
      
      const newState = simulationReducer(initialState, action);
      
      expect(newState.trailLength).toBe(5);
    });

    it('should enforce maximum trail length of 50', () => {
      const action = { type: 'SET_TRAIL_LENGTH', payload: 200 };
      
      const newState = simulationReducer(initialState, action);
      
      expect(newState.trailLength).toBe(50);
    });
  });

  describe('UPDATE_POSITION_HISTORY', () => {
    it('should add new positions to history when motion trails enabled', () => {
      const stateWithAtoms = {
        ...initialState,
        showMotionTrails: true,
        atoms: [
          { id: 0, pos: { x: 100, y: 100 } },
        ],
        positionHistory: {},
      };
      
      const action = { type: 'UPDATE_POSITION_HISTORY' };
      const newState = simulationReducer(stateWithAtoms, action);
      
      expect(newState.positionHistory[0]).toBeDefined();
      expect(newState.positionHistory[0].length).toBe(1);
    });

    it('should not update history when motion trails disabled', () => {
      const stateWithAtoms = {
        ...initialState,
        showMotionTrails: false,
        atoms: [
          { id: 0, pos: { x: 100, y: 100 } },
        ],
        positionHistory: {},
      };
      
      const action = { type: 'UPDATE_POSITION_HISTORY' };
      const newState = simulationReducer(stateWithAtoms, action);
      
      expect(Object.keys(newState.positionHistory).length).toBe(0);
    });

    it('should not update history when simulation is paused', () => {
      const stateWithAtoms = {
        ...initialState,
        showMotionTrails: true,
        isPaused: true,
        atoms: [
          { id: 0, pos: { x: 100, y: 100 } },
        ],
        positionHistory: {},
      };
      
      const action = { type: 'UPDATE_POSITION_HISTORY' };
      const newState = simulationReducer(stateWithAtoms, action);
      
      expect(Object.keys(newState.positionHistory).length).toBe(0);
    });

    it('should limit history to trail length', () => {
      const positions = Array(25).fill(null).map((_, i) => ({ x: i, y: i }));
      const stateWithHistory = {
        ...initialState,
        showMotionTrails: true,
        atoms: [{ id: 0, pos: { x: 50, y: 50 } }],
        positionHistory: { 0: positions },
        trailLength: 20,
      };
      
      const action = { type: 'UPDATE_POSITION_HISTORY' };
      const newState = simulationReducer(stateWithHistory, action);
      
      expect(newState.positionHistory[0].length).toBeLessThanOrEqual(20);
    });
  });

  describe('CLEAR_POSITION_HISTORY', () => {
    it('should clear all position history', () => {
      const stateWithHistory = {
        ...initialState,
        positionHistory: {
          0: [{ x: 10, y: 10 }],
          1: [{ x: 20, y: 20 }],
        },
      };
      
      const action = { type: 'CLEAR_POSITION_HISTORY' };
      const newState = simulationReducer(stateWithHistory, action);
      
      expect(newState.positionHistory).toEqual({});
    });
  });

  describe('TOGGLE_AUTO_SAVE', () => {
    it('should toggle autoSaveEnabled state', () => {
      const action = { type: 'TOGGLE_AUTO_SAVE' };
      
      const newState = simulationReducer(initialState, action);
      
      expect(newState.autoSaveEnabled).toBe(!initialState.autoSaveEnabled);
    });
  });

  describe('SET_LAST_AUTO_SAVE', () => {
    it('should set last auto save timestamp', () => {
      const timestamp = Date.now();
      const action = { type: 'SET_LAST_AUTO_SAVE', payload: timestamp };
      
      const newState = simulationReducer(initialState, action);
      
      expect(newState.lastAutoSave).toBe(timestamp);
    });
  });

  describe('LOAD_SIMULATION_STATE', () => {
    it('should load saved simulation state atoms', () => {
      const savedState = {
        atoms: [{ id: 0, pos: { x: 50, y: 50 }, type: 1 }],
        bonds: [{ atom1: 0, atom2: 1, order: 1 }],
        nextAtomId: 5,
        playerId: 2,
      };
      
      const action = { type: 'LOAD_SIMULATION_STATE', payload: savedState };
      const newState = simulationReducer(initialState, action);
      
      expect(newState.atoms).toEqual(savedState.atoms);
      expect(newState.bonds).toEqual(savedState.bonds);
      expect(newState.nextAtomId).toBe(5);
      expect(newState.playerId).toBe(2);
    });

    it('should reset time and energy when loading state', () => {
      const savedState = {
        atoms: [{ id: 0, pos: { x: 50, y: 50 }, type: 1 }],
      };
      
      const action = { type: 'LOAD_SIMULATION_STATE', payload: savedState };
      const newState = simulationReducer(initialState, action);
      
      expect(newState.time).toBe(0);
      expect(newState.energy.kinetic).toBe(0);
      expect(newState.energy.potential).toBe(0);
      expect(newState.temperature).toBe(0);
    });

    it('should handle empty saved state gracefully', () => {
      const savedState = {};
      
      const action = { type: 'LOAD_SIMULATION_STATE', payload: savedState };
      const newState = simulationReducer(initialState, action);
      
      expect(newState.atoms).toEqual([]);
      expect(newState.bonds).toEqual([]);
    });
  });

  describe('Visual enhancement state', () => {
    it('should have colorByVelocity in initial state', () => {
      expect(initialState.colorByVelocity).toBeDefined();
      expect(typeof initialState.colorByVelocity).toBe('boolean');
    });

    it('should have showMotionTrails in initial state', () => {
      expect(initialState.showMotionTrails).toBeDefined();
      expect(typeof initialState.showMotionTrails).toBe('boolean');
    });

    it('should have trailLength in initial state', () => {
      expect(initialState.trailLength).toBeDefined();
      expect(initialState.trailLength).toBeGreaterThan(0);
    });

    it('should have positionHistory in initial state', () => {
      expect(initialState.positionHistory).toBeDefined();
      expect(typeof initialState.positionHistory).toBe('object');
    });

    it('should have autoSaveEnabled in initial state', () => {
      expect(initialState.autoSaveEnabled).toBeDefined();
      expect(typeof initialState.autoSaveEnabled).toBe('boolean');
    });
  });
});
