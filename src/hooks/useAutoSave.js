/**
 * @fileoverview Auto-save Hook
 * @description Automatically saves and loads simulation state to localStorage
 * @module hooks/useAutoSave
 */

import { useEffect, useCallback, useRef } from 'react';

const STORAGE_KEY = 'molecular-dynamics-autosave';
const AUTO_SAVE_INTERVAL = 30000; // 30 seconds

/**
 * Fields to save (exclude transient/computed fields)
 */
const SAVEABLE_FIELDS = [
  'atoms',
  'bonds',
  'nextAtomId',
  'playerId',
  'isPaused',
  'targetTemperature',
  'zoom',
  'pan',
  'showBonds',
  'showVelocityVectors',
  'showAtomLabels',
  'showBondLengths',
  'boundaryCondition',
  'timeStepMultiplier',
  'thermostatEnabled',
  'thermostatTau',
  'enableCoulomb',
  'colorByVelocity',
  'showMotionTrails',
  'trailLength',
  'theme',
];

/**
 * Extract saveable state from simulation
 * @param {Object} state - Full simulation state
 * @returns {Object} State subset safe for saving
 */
const extractSaveableState = (state) => {
  const saveState = {};
  SAVEABLE_FIELDS.forEach(field => {
    if (state[field] !== undefined) {
      saveState[field] = state[field];
    }
  });
  saveState.savedAt = Date.now();
  saveState.version = '1.0.0';
  return saveState;
};

/**
 * Auto-save hook for simulation state persistence
 * @param {Object} simulation - Current simulation state
 * @param {Function} dispatch - Dispatch function
 * @returns {Object} Auto-save controls
 */
export function useAutoSave(simulation, dispatch) {
  const lastSaveRef = useRef(null);
  const intervalRef = useRef(null);

  /**
   * Save current state to localStorage
   */
  const saveState = useCallback(() => {
    if (!simulation.autoSaveEnabled) return false;
    
    try {
      const saveData = extractSaveableState(simulation);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(saveData));
      lastSaveRef.current = Date.now();
      dispatch({ type: 'SET_LAST_AUTO_SAVE', payload: lastSaveRef.current });
      return true;
    } catch (error) {
      console.warn('Auto-save failed:', error);
      return false;
    }
  }, [simulation, dispatch]);

  /**
   * Load state from localStorage
   */
  const loadState = useCallback(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (!saved) return null;
      
      const data = JSON.parse(saved);
      
      // Validate version compatibility
      if (!data.version || !data.atoms) {
        console.warn('Invalid save data format');
        return null;
      }
      
      return data;
    } catch (error) {
      console.warn('Load state failed:', error);
      return null;
    }
  }, []);

  /**
   * Clear saved state
   */
  const clearSavedState = useCallback(() => {
    try {
      localStorage.removeItem(STORAGE_KEY);
      return true;
    } catch (error) {
      console.warn('Clear save failed:', error);
      return false;
    }
  }, []);

  /**
   * Check if saved state exists
   */
  const hasSavedState = useCallback(() => {
    return localStorage.getItem(STORAGE_KEY) !== null;
  }, []);

  /**
   * Restore simulation from saved state
   */
  const restoreState = useCallback(() => {
    const savedState = loadState();
    if (!savedState) return false;
    
    dispatch({ type: 'LOAD_SIMULATION_STATE', payload: savedState });
    return true;
  }, [loadState, dispatch]);

  // Set up auto-save interval
  useEffect(() => {
    if (!simulation.autoSaveEnabled) {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
      return;
    }

    intervalRef.current = setInterval(() => {
      if (!simulation.isPaused && simulation.atoms.length > 0) {
        saveState();
      }
    }, AUTO_SAVE_INTERVAL);

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [simulation.autoSaveEnabled, simulation.isPaused, simulation.atoms.length, saveState]);

  // Save on page unload
  useEffect(() => {
    const handleBeforeUnload = () => {
      if (simulation.autoSaveEnabled && simulation.atoms.length > 0) {
        saveState();
      }
    };

    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
  }, [simulation.autoSaveEnabled, simulation.atoms.length, saveState]);

  return {
    saveState,
    loadState,
    clearSavedState,
    hasSavedState,
    restoreState,
    lastSave: lastSaveRef.current,
  };
}

export default useAutoSave;
