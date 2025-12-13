/**
 * @fileoverview Unit tests for Context Providers
 * @description Tests for SimulationContext and ParametersContext
 */
import React from 'react';
import { render, screen, act } from '@testing-library/react';
import '@testing-library/jest-dom';
import {
  SimulationProvider,
  useSimulation,
  useSimulationDispatch,
} from '../../src/context/SimulationContext';
import {
  ParametersProvider,
  useParameters,
  useParametersDispatch,
} from '../../src/context/ParametersContext';

describe('SimulationContext', () => {
  // Test component to access context
  const TestConsumer = () => {
    const simulation = useSimulation();
    const dispatch = useSimulationDispatch();
    
    return (
      <div>
        <span data-testid="atoms-count">{simulation.atoms.length}</span>
        <span data-testid="is-paused">{simulation.isPaused ? 'paused' : 'running'}</span>
        <button onClick={() => dispatch({ type: 'TOGGLE_PAUSE' })}>Toggle</button>
      </div>
    );
  };

  it('should provide simulation state', () => {
    render(
      <SimulationProvider>
        <TestConsumer />
      </SimulationProvider>
    );
    
    expect(screen.getByTestId('atoms-count')).toBeInTheDocument();
  });

  it('should provide initial atoms array', () => {
    render(
      <SimulationProvider>
        <TestConsumer />
      </SimulationProvider>
    );
    
    expect(screen.getByTestId('atoms-count').textContent).toBeDefined();
  });

  it('should provide dispatch function', () => {
    render(
      <SimulationProvider>
        <TestConsumer />
      </SimulationProvider>
    );
    
    const button = screen.getByText('Toggle');
    expect(button).toBeInTheDocument();
  });

  it('should throw error when used outside provider', () => {
    const consoleError = jest.spyOn(console, 'error').mockImplementation(() => {});
    
    expect(() => {
      render(<TestConsumer />);
    }).toThrow();
    
    consoleError.mockRestore();
  });
});

describe('ParametersContext', () => {
  // Test component to access context
  const TestConsumer = () => {
    const parameters = useParameters();
    const dispatch = useParametersDispatch();
    
    return (
      <div>
        <span data-testid="is-loaded">{parameters.isLoaded ? 'loaded' : 'not-loaded'}</span>
        <button onClick={() => dispatch({ type: 'LOAD_PARAMS', payload: { test: true } })}>
          Load
        </button>
      </div>
    );
  };

  it('should provide parameters state', () => {
    render(
      <ParametersProvider>
        <TestConsumer />
      </ParametersProvider>
    );
    
    expect(screen.getByTestId('is-loaded')).toBeInTheDocument();
  });

  it('should start with isLoaded as false', () => {
    render(
      <ParametersProvider>
        <TestConsumer />
      </ParametersProvider>
    );
    
    expect(screen.getByTestId('is-loaded').textContent).toBe('not-loaded');
  });

  it('should provide dispatch function', () => {
    render(
      <ParametersProvider>
        <TestConsumer />
      </ParametersProvider>
    );
    
    const button = screen.getByText('Load');
    expect(button).toBeInTheDocument();
  });

  it('should throw error when used outside provider', () => {
    const consoleError = jest.spyOn(console, 'error').mockImplementation(() => {});
    
    expect(() => {
      render(<TestConsumer />);
    }).toThrow();
    
    consoleError.mockRestore();
  });
});

describe('Combined Context Providers', () => {
  const CombinedConsumer = () => {
    const simulation = useSimulation();
    const parameters = useParameters();
    
    return (
      <div>
        <span data-testid="atoms">{simulation.atoms.length}</span>
        <span data-testid="loaded">{parameters.isLoaded.toString()}</span>
      </div>
    );
  };

  it('should work with nested providers', () => {
    render(
      <SimulationProvider>
        <ParametersProvider>
          <CombinedConsumer />
        </ParametersProvider>
      </SimulationProvider>
    );
    
    expect(screen.getByTestId('atoms')).toBeInTheDocument();
    expect(screen.getByTestId('loaded')).toBeInTheDocument();
  });
});
