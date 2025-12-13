import {
  TIMESTAMP_IN_FEMPTO_SEC,
  TIMESTEP_IN_SIMULATION_UNIT,
  THRUST,
  WALL_SPRING,
  MAX_VEL,
  DEFAULT_ATOM_RADIUS,
  DEFAULT_ATOM_MASS,
} from '../simulation/constants';

/**
 * Initial simulation state
 */
export const INITIAL_SIMULATION_STATE = {
  atoms: [],
  fireballs: [],
  playerId: null,
  time: 0,
  isPaused: false,
  clearScreen: true,
  scale: 20.0,
  size: { x: 40, y: 30, z: 30 }, // Will be updated based on canvas size
  timestep: TIMESTAMP_IN_FEMPTO_SEC,
  dt: TIMESTEP_IN_SIMULATION_UNIT * TIMESTAMP_IN_FEMPTO_SEC,
  thrust: THRUST,
  wallSpring: WALL_SPRING,
  maxVel: MAX_VEL,
  statusText: '',
  nextAtomId: 0,
};

/**
 * Create initial atoms (ozone molecule)
 */
function createInitialAtoms() {
  return [
    createAtom(0, 0.0, 0.0, 0.0, 2),
    createAtom(1, 1.2, 0.0, 0.0, 2),
    createAtom(2, 2.0, 0.8, 0.0, 2),
  ];
}

/**
 * Create a new atom object
 */
function createAtom(id, x, y, z, type) {
  return {
    id,
    type,
    pos: { x, y, z },
    vel: { x: 0, y: 0, z: 0 },
    force: { x: 0, y: 0, z: 0 },
    radius: DEFAULT_ATOM_RADIUS,
    mass: DEFAULT_ATOM_MASS,
  };
}

/**
 * Simulation reducer for state management
 */
export function simulationReducer(state, action) {
  switch (action.type) {
    case 'ADD_ATOM': {
      const { x, y, z, atomType } = action.payload;
      const newAtom = createAtom(state.nextAtomId, x, y, z, atomType);
      return {
        ...state,
        atoms: [...state.atoms, newAtom],
        nextAtomId: state.nextAtomId + 1,
      };
    }

    case 'REMOVE_ATOM': {
      const { id } = action.payload;
      return {
        ...state,
        atoms: state.atoms.filter(atom => atom.id !== id),
        playerId: state.playerId === id ? null : state.playerId,
      };
    }

    case 'UPDATE_ATOM_POSITION': {
      const { id, position } = action.payload;
      return {
        ...state,
        atoms: state.atoms.map(atom =>
          atom.id === id ? { ...atom, pos: { ...atom.pos, ...position } } : atom
        ),
      };
    }

    case 'UPDATE_ATOM_FORCE': {
      const { id, force } = action.payload;
      return {
        ...state,
        atoms: state.atoms.map(atom =>
          atom.id === id ? { ...atom, force: { ...atom.force, ...force } } : atom
        ),
      };
    }

    case 'UPDATE_ATOMS': {
      return {
        ...state,
        atoms: action.payload,
      };
    }

    case 'RESET_SIMULATION': {
      const initialAtoms = createInitialAtoms();
      return {
        ...INITIAL_SIMULATION_STATE,
        atoms: initialAtoms,
        playerId: 0,
        nextAtomId: 3,
        size: state.size,
      };
    }

    case 'TOGGLE_PAUSE': {
      return {
        ...state,
        isPaused: !state.isPaused,
      };
    }

    case 'TOGGLE_CLEAR': {
      return {
        ...state,
        clearScreen: !state.clearScreen,
      };
    }

    case 'SET_SCALE': {
      return {
        ...state,
        scale: action.payload.scale,
      };
    }

    case 'SET_SIZE': {
      return {
        ...state,
        size: action.payload,
      };
    }

    case 'INCREMENT_TIME': {
      return {
        ...state,
        time: state.time + 1,
      };
    }

    case 'ADD_FIREBALL': {
      return {
        ...state,
        fireballs: [...state.fireballs, action.payload],
      };
    }

    case 'UPDATE_FIREBALLS': {
      return {
        ...state,
        fireballs: action.payload,
      };
    }

    case 'SET_PLAYER_FORCE': {
      if (state.playerId === null) return state;
      return {
        ...state,
        atoms: state.atoms.map(atom =>
          atom.id === state.playerId
            ? { ...atom, force: { ...atom.force, ...action.payload } }
            : atom
        ),
      };
    }

    case 'SET_STATUS': {
      return {
        ...state,
        statusText: action.payload,
      };
    }

    case 'INITIALIZE': {
      const initialAtoms = createInitialAtoms();
      return {
        ...state,
        atoms: initialAtoms,
        playerId: 0,
        nextAtomId: 3,
      };
    }

    default:
      return state;
  }
}

export default simulationReducer;
