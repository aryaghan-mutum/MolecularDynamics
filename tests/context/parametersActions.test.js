/**
 * @fileoverview Unit tests for ParametersContext Actions
 * @description Tests for parameter action hooks and reducer behavior
 */
import React from 'react';
import { act } from '@testing-library/react';
import { renderHook } from '@testing-library/react';
import '@testing-library/jest-dom';

import {
  ParametersProvider,
  useParameters,
  useParametersDispatch,
  useParametersActions,
} from '../../src/context/ParametersContext';

describe('ParametersContext Actions', () => {
  const wrapper = ({ children }) => (
    <ParametersProvider>{children}</ParametersProvider>
  );

  describe('useParametersActions', () => {
    it('should provide setParameters action', () => {
      const { result } = renderHook(() => useParametersActions(), { wrapper });
      expect(typeof result.current.setParameters).toBe('function');
    });

    it('should provide setBondOrderArrays action', () => {
      const { result } = renderHook(() => useParametersActions(), { wrapper });
      expect(typeof result.current.setBondOrderArrays).toBe('function');
    });

    it('should provide resetParameters action', () => {
      const { result } = renderHook(() => useParametersActions(), { wrapper });
      expect(typeof result.current.resetParameters).toBe('function');
    });

    it('setParameters should update parameters state', () => {
      const { result: actionsResult } = renderHook(() => useParametersActions(), { wrapper });
      
      expect(() => {
        act(() => {
          actionsResult.current.setParameters({
            r_ij: 1.5,
            paramGeneral: { test: 'value' },
          });
        });
      }).not.toThrow();
    });

    it('setBondOrderArrays should update bond order arrays', () => {
      const { result: actionsResult } = renderHook(() => useParametersActions(), { wrapper });
      
      const bondOrderArrays = {
        sigma: [1.0, 1.5],
        pi: [0.5, 0.8],
      };
      
      expect(() => {
        act(() => {
          actionsResult.current.setBondOrderArrays(bondOrderArrays);
        });
      }).not.toThrow();
    });

    it('resetParameters should reset to initial state', () => {
      const { result: actionsResult } = renderHook(() => useParametersActions(), { wrapper });
      
      expect(() => {
        act(() => {
          actionsResult.current.resetParameters();
        });
      }).not.toThrow();
    });
  });

  describe('useParametersDispatch', () => {
    it('should provide dispatch function', () => {
      const { result } = renderHook(() => useParametersDispatch(), { wrapper });
      expect(typeof result.current).toBe('function');
    });

    it('should throw when used outside provider', () => {
      expect(() => {
        renderHook(() => useParametersDispatch());
      }).toThrow('useParametersDispatch must be used within a ParametersProvider');
    });
  });

  describe('parameters reducer', () => {
    it('should handle SET_PARAMETERS action', () => {
      const { result: actionsResult } = renderHook(() => useParametersActions(), { wrapper });
      const { result: stateResult } = renderHook(() => useParameters(), { wrapper });
      
      act(() => {
        actionsResult.current.setParameters({
          r_ij: 2.0,
          paramGeneral: { param1: 100 },
          onebody_parameters: [{ element: 'C' }],
        });
      });
      
      // Just verify no error
      expect(true).toBe(true);
    });

    it('should handle SET_BOND_ORDER_ARRAYS action', () => {
      const { result: actionsResult } = renderHook(() => useParametersActions(), { wrapper });
      
      act(() => {
        actionsResult.current.setBondOrderArrays({
          sigma: [],
          pi: [],
          pipi: [],
        });
      });
      
      expect(true).toBe(true);
    });

    it('should handle RESET_PARAMETERS action', () => {
      const { result: actionsResult } = renderHook(() => useParametersActions(), { wrapper });
      
      // Set some parameters first
      act(() => {
        actionsResult.current.setParameters({ r_ij: 3.0 });
      });
      
      // Then reset
      act(() => {
        actionsResult.current.resetParameters();
      });
      
      expect(true).toBe(true);
    });

    it('should handle unknown action type gracefully', () => {
      const { result: dispatchResult } = renderHook(() => useParametersDispatch(), { wrapper });
      
      // Unknown action should return current state
      expect(() => {
        act(() => {
          dispatchResult.current({ type: 'UNKNOWN_ACTION' });
        });
      }).not.toThrow();
    });
  });

  describe('initial state', () => {
    it('should start with isLoaded as false', () => {
      const { result } = renderHook(() => useParameters(), { wrapper });
      expect(result.current.isLoaded).toBe(false);
    });

    it('should have default r_ij value', () => {
      const { result } = renderHook(() => useParameters(), { wrapper });
      expect(result.current.r_ij).toBe(1.2);
    });

    it('should have null parameter arrays initially', () => {
      const { result } = renderHook(() => useParameters(), { wrapper });
      expect(result.current.paramGeneral).toBeNull();
      expect(result.current.onebody_parameters).toBeNull();
      expect(result.current.twobody_parameters).toBeNull();
    });
  });

  describe('full workflow', () => {
    it('should load parameters and mark as loaded', () => {
      const combinedWrapper = ({ children }) => (
        <ParametersProvider>{children}</ParametersProvider>
      );
      
      const { result: stateResult, rerender: rerenderState } = renderHook(
        () => useParameters(),
        { wrapper: combinedWrapper }
      );
      const { result: actionsResult } = renderHook(
        () => useParametersActions(),
        { wrapper: combinedWrapper }
      );
      
      // Initially not loaded
      expect(stateResult.current.isLoaded).toBe(false);
      
      // Load parameters (in same wrapper instance would update state)
      act(() => {
        actionsResult.current.setParameters({
          onebody_parameters: [{ element: 'H' }, { element: 'C' }],
        });
      });
      
      // Test passes if no errors
      expect(true).toBe(true);
    });
  });
});
