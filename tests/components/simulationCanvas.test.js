/**
 * @fileoverview Unit tests for SimulationCanvas Component
 * @description Tests for canvas rendering and interaction
 */
import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';

// Mock the hooks
jest.mock('../../src/hooks/useKeyboard', () => ({
  useKeyboard: () => ({
    ArrowUp: false,
    ArrowDown: false,
    ArrowLeft: false,
    ArrowRight: false,
  }),
}));

jest.mock('../../src/hooks/useAnimationFrame', () => ({
  useAnimationFrame: jest.fn(),
}));

// Mock context
const mockDispatch = jest.fn();

jest.mock('../../src/context/SimulationContext', () => ({
  useSimulation: () => ({
    atoms: [
      { id: 1, pos: { x: 50, y: 50 }, vel: { x: 0, y: 0 }, force: { x: 0, y: 0 }, radius: 10, type: 1, symbol: 'C' },
    ],
    bonds: [],
    fireballs: [],
    isPaused: false,
    showBonds: true,
    clearScreen: true,
    scale: 1,
    size: { x: 800, y: 600, z: 100 },
    playerId: 1,
    thrust: 0.5,
  }),
  useSimulationDispatch: () => mockDispatch,
}));

jest.mock('../../src/context/ParametersContext', () => ({
  useParameters: () => ({
    isLoaded: false,
    data: null,
  }),
}));

// Mock the renderer functions
jest.mock('../../src/utils/renderer', () => ({
  drawAtom: jest.fn(),
  drawBond: jest.fn(),
  drawFireball: jest.fn(),
}));

// Mock canvas context
const mockContext = {
  fillStyle: '',
  strokeStyle: '',
  lineWidth: 1,
  font: '',
  fillRect: jest.fn(),
  strokeRect: jest.fn(),
  fillText: jest.fn(),
  beginPath: jest.fn(),
  arc: jest.fn(),
  fill: jest.fn(),
  stroke: jest.fn(),
  moveTo: jest.fn(),
  lineTo: jest.fn(),
  createRadialGradient: jest.fn(() => ({
    addColorStop: jest.fn(),
  })),
  save: jest.fn(),
  restore: jest.fn(),
};

HTMLCanvasElement.prototype.getContext = jest.fn(() => mockContext);

// Import after mocking
import SimulationCanvas from '../../src/components/SimulationCanvas';

describe('SimulationCanvas Component', () => {
  beforeEach(() => {
    mockDispatch.mockClear();
  });

  it('should render without crashing', () => {
    render(<SimulationCanvas />);
    const canvas = document.querySelector('canvas');
    expect(canvas).toBeInTheDocument();
  });

  it('should have accessible label', () => {
    render(<SimulationCanvas />);
    expect(screen.getByLabelText('Molecular Dynamics Simulation')).toBeInTheDocument();
  });

  it('should have simulation-canvas class', () => {
    render(<SimulationCanvas />);
    const canvas = document.querySelector('canvas');
    expect(canvas).toHaveClass('simulation-canvas');
  });

  it('should dispatch INITIALIZE on mount', () => {
    render(<SimulationCanvas />);
    expect(mockDispatch).toHaveBeenCalledWith({ type: 'INITIALIZE' });
  });

  it('should wrap in canvas-container div', () => {
    render(<SimulationCanvas />);
    const container = document.querySelector('.canvas-container');
    expect(container).toBeInTheDocument();
    expect(container.querySelector('canvas')).toBeInTheDocument();
  });

  it('should dispatch SET_SIZE on mount', () => {
    render(<SimulationCanvas />);
    const setSizeCalls = mockDispatch.mock.calls.filter(
      call => call[0].type === 'SET_SIZE'
    );
    expect(setSizeCalls.length).toBeGreaterThanOrEqual(1);
  });
});
