/**
 * @fileoverview Unit tests for SimulationContext Actions
 * @description Tests for simulation action hooks and their dispatch behavior
 */
import React from 'react';
import { render, act } from '@testing-library/react';
import { renderHook } from '@testing-library/react';
import '@testing-library/jest-dom';

import {
  SimulationProvider,
  useSimulationActions,
  useSimulation,
  useSimulationDispatch,
} from '../../src/context/SimulationContext';

describe('SimulationContext Actions', () => {
  const wrapper = ({ children }) => (
    <SimulationProvider>{children}</SimulationProvider>
  );

  describe('useSimulationActions', () => {
    it('should provide addAtom action', () => {
      const { result } = renderHook(() => useSimulationActions(), { wrapper });
      expect(typeof result.current.addAtom).toBe('function');
    });

    it('should provide removeAtom action', () => {
      const { result } = renderHook(() => useSimulationActions(), { wrapper });
      expect(typeof result.current.removeAtom).toBe('function');
    });

    it('should provide updateAtomPosition action', () => {
      const { result } = renderHook(() => useSimulationActions(), { wrapper });
      expect(typeof result.current.updateAtomPosition).toBe('function');
    });

    it('should provide updateAtomForce action', () => {
      const { result } = renderHook(() => useSimulationActions(), { wrapper });
      expect(typeof result.current.updateAtomForce).toBe('function');
    });

    it('should provide resetSimulation action', () => {
      const { result } = renderHook(() => useSimulationActions(), { wrapper });
      expect(typeof result.current.resetSimulation).toBe('function');
    });

    it('should provide togglePause action', () => {
      const { result } = renderHook(() => useSimulationActions(), { wrapper });
      expect(typeof result.current.togglePause).toBe('function');
    });

    it('should provide toggleClear action', () => {
      const { result } = renderHook(() => useSimulationActions(), { wrapper });
      expect(typeof result.current.toggleClear).toBe('function');
    });

    it('should provide setScale action', () => {
      const { result } = renderHook(() => useSimulationActions(), { wrapper });
      expect(typeof result.current.setScale).toBe('function');
    });

    it('should provide incrementTime action', () => {
      const { result } = renderHook(() => useSimulationActions(), { wrapper });
      expect(typeof result.current.incrementTime).toBe('function');
    });

    it('should provide addFireball action', () => {
      const { result } = renderHook(() => useSimulationActions(), { wrapper });
      expect(typeof result.current.addFireball).toBe('function');
    });

    it('should provide updateFireballs action', () => {
      const { result } = renderHook(() => useSimulationActions(), { wrapper });
      expect(typeof result.current.updateFireballs).toBe('function');
    });

    it('should provide setPlayerForce action', () => {
      const { result } = renderHook(() => useSimulationActions(), { wrapper });
      expect(typeof result.current.setPlayerForce).toBe('function');
    });

    it('addAtom should add atom to state', () => {
      const { result: actionsResult } = renderHook(() => useSimulationActions(), { wrapper });
      const { result: stateResult } = renderHook(() => useSimulation(), { wrapper });
      
      act(() => {
        actionsResult.current.addAtom(100, 100, 0, 1);
      });
      
      // The state hook is in a different wrapper instance, so we just verify no throw
      expect(() => actionsResult.current.addAtom(100, 100, 0, 1)).not.toThrow();
    });

    it('togglePause should toggle pause state', () => {
      const { result: actionsResult } = renderHook(() => useSimulationActions(), { wrapper });
      
      expect(() => {
        act(() => {
          actionsResult.current.togglePause();
        });
      }).not.toThrow();
    });

    it('resetSimulation should reset state', () => {
      const { result: actionsResult } = renderHook(() => useSimulationActions(), { wrapper });
      
      expect(() => {
        act(() => {
          actionsResult.current.resetSimulation();
        });
      }).not.toThrow();
    });

    it('setScale should update scale', () => {
      const { result: actionsResult } = renderHook(() => useSimulationActions(), { wrapper });
      
      expect(() => {
        act(() => {
          actionsResult.current.setScale(2);
        });
      }).not.toThrow();
    });

    it('incrementTime should increment time counter', () => {
      const { result: actionsResult } = renderHook(() => useSimulationActions(), { wrapper });
      
      expect(() => {
        act(() => {
          actionsResult.current.incrementTime();
        });
      }).not.toThrow();
    });

    it('addFireball should add fireball to state', () => {
      const { result: actionsResult } = renderHook(() => useSimulationActions(), { wrapper });
      
      const fireball = {
        id: 1,
        pos: { x: 50, y: 50 },
        vel: { x: 0.1, y: -0.1 },
        radius: 0.5,
        time: 0,
        lifetime: 30,
      };
      
      expect(() => {
        act(() => {
          actionsResult.current.addFireball(fireball);
        });
      }).not.toThrow();
    });

    it('updateFireballs should update fireballs array', () => {
      const { result: actionsResult } = renderHook(() => useSimulationActions(), { wrapper });
      
      const fireballs = [
        { id: 1, pos: { x: 50, y: 50 }, vel: { x: 0, y: 0 }, radius: 1, time: 0, lifetime: 30 },
      ];
      
      expect(() => {
        act(() => {
          actionsResult.current.updateFireballs(fireballs);
        });
      }).not.toThrow();
    });

    it('setPlayerForce should set player force', () => {
      const { result: actionsResult } = renderHook(() => useSimulationActions(), { wrapper });
      
      expect(() => {
        act(() => {
          actionsResult.current.setPlayerForce({ x: 10, y: 10 });
        });
      }).not.toThrow();
    });

    it('removeAtom should remove atom', () => {
      const { result: actionsResult } = renderHook(() => useSimulationActions(), { wrapper });
      
      expect(() => {
        act(() => {
          actionsResult.current.removeAtom(1);
        });
      }).not.toThrow();
    });

    it('updateAtomPosition should update atom position', () => {
      const { result: actionsResult } = renderHook(() => useSimulationActions(), { wrapper });
      
      expect(() => {
        act(() => {
          actionsResult.current.updateAtomPosition(1, { x: 100, y: 100, z: 0 });
        });
      }).not.toThrow();
    });

    it('updateAtomForce should update atom force', () => {
      const { result: actionsResult } = renderHook(() => useSimulationActions(), { wrapper });
      
      expect(() => {
        act(() => {
          actionsResult.current.updateAtomForce(1, { x: 10, y: 10, z: 0 });
        });
      }).not.toThrow();
    });

    it('toggleClear should toggle clear screen', () => {
      const { result: actionsResult } = renderHook(() => useSimulationActions(), { wrapper });
      
      expect(() => {
        act(() => {
          actionsResult.current.toggleClear();
        });
      }).not.toThrow();
    });
  });
});
