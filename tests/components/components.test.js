/**
 * @fileoverview Unit tests for React Components
 * @description Tests for ControlPanel, SimulationCanvas, FileUploader, StatusBar
 */
import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';

// Mock the context providers
const mockDispatch = jest.fn();
const mockSimulation = {
  atoms: [],
  bonds: [],
  isPaused: false,
  showBonds: true,
  clearScreen: true,
  enablePhysics: true,
  selectedAtomType: 1,
  selectedAtom: -1,
  size: { x: 800, y: 600 },
  time: 0,
  energy: { kinetic: 0, potential: 0, total: 0 },
  temperature: 300,
};

const mockParameters = {
  isLoaded: false,
  data: null,
};

jest.mock('../../src/context/SimulationContext', () => ({
  useSimulation: () => mockSimulation,
  useSimulationDispatch: () => mockDispatch,
}));

jest.mock('../../src/context/ParametersContext', () => ({
  useParameters: () => mockParameters,
}));

// Import after mocking
import ControlPanel from '../../src/components/ControlPanel';
import StatusBar from '../../src/components/StatusBar';

describe('ControlPanel Component', () => {
  beforeEach(() => {
    mockDispatch.mockClear();
  });

  it('should render without crashing', () => {
    render(<ControlPanel />);
    
    expect(screen.getByText('Simulation Controls')).toBeInTheDocument();
  });

  it('should display restart button', () => {
    render(<ControlPanel />);
    
    expect(screen.getByText(/Restart/)).toBeInTheDocument();
  });

  it('should display play/pause button', () => {
    render(<ControlPanel />);
    
    // Since isPaused is false, should show Pause
    expect(screen.getByText(/Pause/)).toBeInTheDocument();
  });

  it('should display clear all button', () => {
    render(<ControlPanel />);
    
    expect(screen.getByText(/Clear All/)).toBeInTheDocument();
  });

  it('should dispatch RESET_SIMULATION on restart click', () => {
    render(<ControlPanel />);
    
    fireEvent.click(screen.getByText(/Restart/));
    
    expect(mockDispatch).toHaveBeenCalledWith({ type: 'RESET_SIMULATION' });
  });

  it('should dispatch TOGGLE_PAUSE on play/pause click', () => {
    render(<ControlPanel />);
    
    fireEvent.click(screen.getByText(/Pause/));
    
    expect(mockDispatch).toHaveBeenCalledWith({ type: 'TOGGLE_PAUSE' });
  });

  it('should dispatch CLEAR_ATOMS on clear all click', () => {
    render(<ControlPanel />);
    
    fireEvent.click(screen.getByText(/Clear All/));
    
    expect(mockDispatch).toHaveBeenCalledWith({ type: 'CLEAR_ATOMS' });
  });

  it('should display atom type selector', () => {
    render(<ControlPanel />);
    
    expect(screen.getByText('Add Atom')).toBeInTheDocument();
    expect(screen.getByLabelText('Elements')).toBeInTheDocument();
    expect(screen.getByLabelText('Metals & Others')).toBeInTheDocument();
  });

  it('should display molecule presets section', () => {
    render(<ControlPanel />);
    
    expect(screen.getByText('Metal Molecules')).toBeInTheDocument();
    expect(screen.getByText('Molecules')).toBeInTheDocument();
  });

  it('should have water molecule preset in dropdown', () => {
    render(<ControlPanel />);
    
    const commonSelect = screen.getByLabelText('Molecules');
    expect(commonSelect).toBeInTheDocument();
    // Check that H₂O option exists
    const options = commonSelect.querySelectorAll('option');
    const h2oOption = Array.from(options).find(opt => opt.textContent === 'H₂O');
    expect(h2oOption).toBeTruthy();
  });

  it('should have methane molecule preset in dropdown', () => {
    render(<ControlPanel />);
    
    const commonSelect = screen.getByLabelText('Molecules');
    const options = commonSelect.querySelectorAll('option');
    const ch4Option = Array.from(options).find(opt => opt.textContent === 'CH₄');
    expect(ch4Option).toBeTruthy();
  });

  it('should dispatch LOAD_MOLECULE on molecule select', () => {
    render(<ControlPanel />);
    
    const commonSelect = screen.getByLabelText('Molecules');
    fireEvent.change(commonSelect, { target: { value: 'water' } });
    
    expect(mockDispatch).toHaveBeenCalledWith(
      expect.objectContaining({ type: 'LOAD_MOLECULE' })
    );
  });

  it('should display display options', () => {
    render(<ControlPanel />);
    
    expect(screen.getByText('Display Options')).toBeInTheDocument();
  });

  it('should have trail effect toggle', () => {
    render(<ControlPanel />);
    
    expect(screen.getByText('Trail Effect')).toBeInTheDocument();
  });

  it('should have show bonds toggle', () => {
    render(<ControlPanel />);
    
    expect(screen.getByText('Show Bonds')).toBeInTheDocument();
  });

  it('should have physics enabled toggle', () => {
    render(<ControlPanel />);
    
    expect(screen.getByText('Physics Enabled')).toBeInTheDocument();
  });

  it('should display simulation info', () => {
    render(<ControlPanel />);
    
    expect(screen.getByText('Simulation Info')).toBeInTheDocument();
  });

  it('should display energy section', () => {
    render(<ControlPanel />);
    
    expect(screen.getByText('Energy (kcal/mol)')).toBeInTheDocument();
  });

  it('should display instructions', () => {
    render(<ControlPanel />);
    
    expect(screen.getByText('Controls')).toBeInTheDocument();
  });

  it('should display force field selector', () => {
    render(<ControlPanel />);
    
    expect(screen.getByText('Force Field')).toBeInTheDocument();
  });
});

describe('StatusBar Component', () => {
  beforeEach(() => {
    mockDispatch.mockClear();
  });

  it('should render without crashing', () => {
    render(<StatusBar />);
    
    // StatusBar should render some content
    expect(document.querySelector('.status-bar')).toBeInTheDocument();
  });

  it('should display status text', () => {
    render(<StatusBar />);
    
    // Default status text is 'Ready'
    expect(screen.getByText('Ready')).toBeInTheDocument();
  });

  it('should have status-text class', () => {
    render(<StatusBar />);
    
    expect(document.querySelector('.status-text')).toBeInTheDocument();
  });

  it('should not show paused badge when simulation is running', () => {
    render(<StatusBar />);
    
    // The mock context has isPaused: false by default
    expect(screen.queryByText('PAUSED')).not.toBeInTheDocument();
  });
});
