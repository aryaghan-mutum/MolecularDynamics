/**
 * @fileoverview Unit tests for useAutoSave Hook
 * @description Tests for auto-save functionality with localStorage
 */
import { renderHook, act, waitFor } from '@testing-library/react';
import { useAutoSave } from '../../src/hooks/useAutoSave';

// Mock localStorage
const mockLocalStorage = (() => {
  let store = {};
  return {
    getItem: jest.fn((key) => store[key] || null),
    setItem: jest.fn((key, value) => {
      store[key] = value;
    }),
    removeItem: jest.fn((key) => {
      delete store[key];
    }),
    clear: () => {
      store = {};
    },
  };
})();

Object.defineProperty(window, 'localStorage', {
  value: mockLocalStorage,
});

describe('useAutoSave Hook', () => {
  let mockDispatch;
  let defaultSimulation;

  beforeEach(() => {
    jest.clearAllMocks();
    mockLocalStorage.clear();
    mockDispatch = jest.fn();
    defaultSimulation = {
      atoms: [{ id: 0, pos: { x: 100, y: 100 }, type: 1 }],
      bonds: [],
      isPaused: false,
      autoSaveEnabled: true,
      targetTemperature: 300,
      zoom: 1.0,
      pan: { x: 0, y: 0 },
      showBonds: true,
      colorByVelocity: false,
      showMotionTrails: false,
      trailLength: 20,
    };
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  describe('saveState', () => {
    it('should save state to localStorage when autoSaveEnabled is true', () => {
      const { result } = renderHook(() => useAutoSave(defaultSimulation, mockDispatch));
      
      act(() => {
        const success = result.current.saveState();
        expect(success).toBe(true);
      });
      
      expect(mockLocalStorage.setItem).toHaveBeenCalled();
    });

    it('should not save state when autoSaveEnabled is false', () => {
      const simulation = { ...defaultSimulation, autoSaveEnabled: false };
      const { result } = renderHook(() => useAutoSave(simulation, mockDispatch));
      
      act(() => {
        const success = result.current.saveState();
        expect(success).toBe(false);
      });
      
      expect(mockLocalStorage.setItem).not.toHaveBeenCalled();
    });

    it('should dispatch SET_LAST_AUTO_SAVE action after saving', () => {
      const { result } = renderHook(() => useAutoSave(defaultSimulation, mockDispatch));
      
      act(() => {
        result.current.saveState();
      });
      
      expect(mockDispatch).toHaveBeenCalledWith(
        expect.objectContaining({ type: 'SET_LAST_AUTO_SAVE' })
      );
    });

    it('should save with correct storage key', () => {
      const { result } = renderHook(() => useAutoSave(defaultSimulation, mockDispatch));
      
      act(() => {
        result.current.saveState();
      });
      
      expect(mockLocalStorage.setItem).toHaveBeenCalledWith(
        'molecular-dynamics-autosave',
        expect.any(String)
      );
    });

    it('should include version and savedAt in saved data', () => {
      const { result } = renderHook(() => useAutoSave(defaultSimulation, mockDispatch));
      
      act(() => {
        result.current.saveState();
      });
      
      const savedData = JSON.parse(mockLocalStorage.setItem.mock.calls[0][1]);
      expect(savedData.version).toBe('1.0.0');
      expect(savedData.savedAt).toBeDefined();
    });
  });

  describe('loadState', () => {
    it('should return null when no saved state exists', () => {
      const { result } = renderHook(() => useAutoSave(defaultSimulation, mockDispatch));
      
      let loadedState;
      act(() => {
        loadedState = result.current.loadState();
      });
      
      expect(loadedState).toBeNull();
    });

    it('should return parsed state when saved state exists', () => {
      const savedData = {
        atoms: [{ id: 0, pos: { x: 50, y: 50 }, type: 2 }],
        version: '1.0.0',
      };
      mockLocalStorage.getItem.mockReturnValue(JSON.stringify(savedData));
      
      const { result } = renderHook(() => useAutoSave(defaultSimulation, mockDispatch));
      
      let loadedState;
      act(() => {
        loadedState = result.current.loadState();
      });
      
      expect(loadedState.atoms).toEqual(savedData.atoms);
    });

    it('should return null for invalid JSON', () => {
      mockLocalStorage.getItem.mockReturnValue('invalid json');
      
      const { result } = renderHook(() => useAutoSave(defaultSimulation, mockDispatch));
      
      let loadedState;
      act(() => {
        loadedState = result.current.loadState();
      });
      
      expect(loadedState).toBeNull();
    });

    it('should return null for data without version', () => {
      const savedData = { atoms: [] }; // No version
      mockLocalStorage.getItem.mockReturnValue(JSON.stringify(savedData));
      
      const { result } = renderHook(() => useAutoSave(defaultSimulation, mockDispatch));
      
      let loadedState;
      act(() => {
        loadedState = result.current.loadState();
      });
      
      expect(loadedState).toBeNull();
    });
  });

  describe('hasSavedState', () => {
    it('should return false when no saved state exists', () => {
      mockLocalStorage.getItem.mockReturnValue(null);
      
      const { result } = renderHook(() => useAutoSave(defaultSimulation, mockDispatch));
      
      let hasSaved;
      act(() => {
        hasSaved = result.current.hasSavedState();
      });
      
      expect(hasSaved).toBe(false);
    });

    it('should return true when saved state exists', () => {
      mockLocalStorage.getItem.mockReturnValue('{"atoms":[]}');
      
      const { result } = renderHook(() => useAutoSave(defaultSimulation, mockDispatch));
      
      let hasSaved;
      act(() => {
        hasSaved = result.current.hasSavedState();
      });
      
      expect(hasSaved).toBe(true);
    });
  });

  describe('clearSavedState', () => {
    it('should remove saved state from localStorage', () => {
      const { result } = renderHook(() => useAutoSave(defaultSimulation, mockDispatch));
      
      act(() => {
        result.current.clearSavedState();
      });
      
      expect(mockLocalStorage.removeItem).toHaveBeenCalledWith('molecular-dynamics-autosave');
    });

    it('should return true on successful clear', () => {
      const { result } = renderHook(() => useAutoSave(defaultSimulation, mockDispatch));
      
      let success;
      act(() => {
        success = result.current.clearSavedState();
      });
      
      expect(success).toBe(true);
    });
  });

  describe('restoreState', () => {
    it('should dispatch LOAD_SIMULATION_STATE action with saved data', () => {
      const savedData = {
        atoms: [{ id: 0, pos: { x: 50, y: 50 }, type: 2 }],
        version: '1.0.0',
      };
      mockLocalStorage.getItem.mockReturnValue(JSON.stringify(savedData));
      
      const { result } = renderHook(() => useAutoSave(defaultSimulation, mockDispatch));
      
      act(() => {
        result.current.restoreState();
      });
      
      expect(mockDispatch).toHaveBeenCalledWith({
        type: 'LOAD_SIMULATION_STATE',
        payload: savedData,
      });
    });

    it('should return false when no saved state exists', () => {
      mockLocalStorage.getItem.mockReturnValue(null);
      
      const { result } = renderHook(() => useAutoSave(defaultSimulation, mockDispatch));
      
      let success;
      act(() => {
        success = result.current.restoreState();
      });
      
      expect(success).toBe(false);
    });

    it('should return true on successful restore', () => {
      const savedData = {
        atoms: [],
        version: '1.0.0',
      };
      mockLocalStorage.getItem.mockReturnValue(JSON.stringify(savedData));
      
      const { result } = renderHook(() => useAutoSave(defaultSimulation, mockDispatch));
      
      let success;
      act(() => {
        success = result.current.restoreState();
      });
      
      expect(success).toBe(true);
    });
  });

  describe('auto-save interval', () => {
    beforeEach(() => {
      jest.useFakeTimers();
    });

    it('should not auto-save when simulation is paused', () => {
      const simulation = { 
        ...defaultSimulation, 
        isPaused: true,
        atoms: [{ id: 0 }],
      };
      
      renderHook(() => useAutoSave(simulation, mockDispatch));
      
      act(() => {
        jest.advanceTimersByTime(35000); // 35 seconds (past 30s interval)
      });
      
      // Should not have saved (only initial calls checked)
      expect(mockLocalStorage.setItem).not.toHaveBeenCalled();
    });

    it('should not auto-save when atoms array is empty', () => {
      const simulation = { 
        ...defaultSimulation, 
        atoms: [],
      };
      
      renderHook(() => useAutoSave(simulation, mockDispatch));
      
      act(() => {
        jest.advanceTimersByTime(35000);
      });
      
      expect(mockLocalStorage.setItem).not.toHaveBeenCalled();
    });
  });

  describe('returned values', () => {
    it('should return all expected functions', () => {
      const { result } = renderHook(() => useAutoSave(defaultSimulation, mockDispatch));
      
      expect(typeof result.current.saveState).toBe('function');
      expect(typeof result.current.loadState).toBe('function');
      expect(typeof result.current.clearSavedState).toBe('function');
      expect(typeof result.current.hasSavedState).toBe('function');
      expect(typeof result.current.restoreState).toBe('function');
    });
  });
});
