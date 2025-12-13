import { createContext, useContext, useReducer, useCallback } from 'react';
import { INITIAL_SIMULATION_STATE, simulationReducer } from './simulationReducer';

const SimulationContext = createContext(null);
const SimulationDispatchContext = createContext(null);

/**
 * Simulation Context Provider
 * Manages global simulation state using useReducer for predictable state updates
 */
export function SimulationProvider({ children }) {
  const [state, dispatch] = useReducer(simulationReducer, INITIAL_SIMULATION_STATE);

  return (
    <SimulationContext.Provider value={state}>
      <SimulationDispatchContext.Provider value={dispatch}>
        {children}
      </SimulationDispatchContext.Provider>
    </SimulationContext.Provider>
  );
}

/**
 * Custom hook to access simulation state
 */
export function useSimulation() {
  const context = useContext(SimulationContext);
  if (context === null) {
    throw new Error('useSimulation must be used within a SimulationProvider');
  }
  return context;
}

/**
 * Custom hook to access simulation dispatch
 */
export function useSimulationDispatch() {
  const context = useContext(SimulationDispatchContext);
  if (context === null) {
    throw new Error('useSimulationDispatch must be used within a SimulationProvider');
  }
  return context;
}

/**
 * Custom hook for simulation actions
 */
export function useSimulationActions() {
  const dispatch = useSimulationDispatch();

  const addAtom = useCallback((x, y, z, type) => {
    dispatch({ type: 'ADD_ATOM', payload: { x, y, z, atomType: type } });
  }, [dispatch]);

  const removeAtom = useCallback((id) => {
    dispatch({ type: 'REMOVE_ATOM', payload: { id } });
  }, [dispatch]);

  const updateAtomPosition = useCallback((id, position) => {
    dispatch({ type: 'UPDATE_ATOM_POSITION', payload: { id, position } });
  }, [dispatch]);

  const updateAtomForce = useCallback((id, force) => {
    dispatch({ type: 'UPDATE_ATOM_FORCE', payload: { id, force } });
  }, [dispatch]);

  const resetSimulation = useCallback(() => {
    dispatch({ type: 'RESET_SIMULATION' });
  }, [dispatch]);

  const togglePause = useCallback(() => {
    dispatch({ type: 'TOGGLE_PAUSE' });
  }, [dispatch]);

  const toggleClear = useCallback(() => {
    dispatch({ type: 'TOGGLE_CLEAR' });
  }, [dispatch]);

  const setScale = useCallback((scale) => {
    dispatch({ type: 'SET_SCALE', payload: { scale } });
  }, [dispatch]);

  const incrementTime = useCallback(() => {
    dispatch({ type: 'INCREMENT_TIME' });
  }, [dispatch]);

  const addFireball = useCallback((fireball) => {
    dispatch({ type: 'ADD_FIREBALL', payload: fireball });
  }, [dispatch]);

  const updateFireballs = useCallback((fireballs) => {
    dispatch({ type: 'UPDATE_FIREBALLS', payload: fireballs });
  }, [dispatch]);

  const setPlayerForce = useCallback((force) => {
    dispatch({ type: 'SET_PLAYER_FORCE', payload: force });
  }, [dispatch]);

  return {
    addAtom,
    removeAtom,
    updateAtomPosition,
    updateAtomForce,
    resetSimulation,
    togglePause,
    toggleClear,
    setScale,
    incrementTime,
    addFireball,
    updateFireballs,
    setPlayerForce,
  };
}

export default SimulationContext;
