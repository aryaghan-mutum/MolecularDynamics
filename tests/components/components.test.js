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
  // New properties
  targetTemperature: 300,
  zoom: 1,
  pan: { x: 0, y: 0 },
  selectedAtomId: null,
  selectedAtomIds: [],
  draggingAtomId: null,
  showVelocityVectors: false,
  showAtomLabels: true,
  showBondLengths: false,
  boundaryCondition: 'reflective',
  timeStepMultiplier: 1,
  theme: 'dark',
  isFullscreen: false,
  undoStack: [],
  redoStack: [],
  rdfData: [],
  thermostatEnabled: false,
  thermostatTau: 0.1,
  enableCoulomb: false,
  coulombConstant: 332.06,
  show3DDepth: false,
  clipboard: [],
  measurementMode: null,
  measurementAtoms: [],
  isRecording: false,
  recordedFrames: [],
  energyHistory: [],
  msdData: [],
  initialPositions: [],
  customAtomColors: {},
  atomCountWarning: 100,
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
    
    // Title is now "⚙️ Controls" (compact design)
    expect(screen.getByText(/Controls/)).toBeInTheDocument();
  });

  it('should display atom type selector', () => {
    render(<ControlPanel />);
    
    // Quick select dropdowns now have title attributes instead of labels
    expect(screen.getByTitle('Add atom')).toBeInTheDocument();
  });

  it('should display molecule quick-select dropdown', () => {
    render(<ControlPanel />);
    
    // Molecule dropdown has title "Add molecule"
    expect(screen.getByTitle('Add molecule')).toBeInTheDocument();
  });

  it('should have water molecule preset in dropdown', () => {
    render(<ControlPanel />);
    
    const moleculeSelect = screen.getByTitle('Add molecule');
    expect(moleculeSelect).toBeInTheDocument();
    // Check that Water option exists in Common optgroup
    const options = moleculeSelect.querySelectorAll('option');
    const h2oOption = Array.from(options).find(opt => opt.textContent === 'Water (H₂O)');
    expect(h2oOption).toBeTruthy();
  });

  it('should have methane molecule preset in dropdown', () => {
    render(<ControlPanel />);
    
    const moleculeSelect = screen.getByTitle('Add molecule');
    const options = moleculeSelect.querySelectorAll('option');
    const ch4Option = Array.from(options).find(opt => opt.textContent === 'Methane (CH₄)');
    expect(ch4Option).toBeTruthy();
  });

  it('should dispatch LOAD_MOLECULE on molecule select', () => {
    render(<ControlPanel />);
    
    const moleculeSelect = screen.getByTitle('Add molecule');
    fireEvent.change(moleculeSelect, { target: { value: 'water' } });
    
    expect(mockDispatch).toHaveBeenCalledWith(
      expect.objectContaining({ type: 'LOAD_MOLECULE' })
    );
  });

  it('should display boundary & display section', () => {
    render(<ControlPanel />);
    
    // Section header in collapsible
    expect(screen.getByText('Boundary & Display')).toBeInTheDocument();
  });

  it('should have trails toggle in expanded section', () => {
    render(<ControlPanel />);
    
    // Click to expand the Boundary & Display section
    const boundarySection = screen.getByText('Boundary & Display');
    fireEvent.click(boundarySection);
    
    expect(screen.getByText('Trails')).toBeInTheDocument();
  });

  it('should have bond lengths toggle in expanded section', () => {
    render(<ControlPanel />);
    
    // Click to expand the Boundary & Display section
    const boundarySection = screen.getByText('Boundary & Display');
    fireEvent.click(boundarySection);
    
    expect(screen.getByText('Bond Lengths')).toBeInTheDocument();
  });

  it('should display force field section', () => {
    render(<ControlPanel />);
    
    expect(screen.getByText('Force Field')).toBeInTheDocument();
  });

  it('should display all presets section', () => {
    render(<ControlPanel />);
    
    expect(screen.getByText('All Presets')).toBeInTheDocument();
  });

  it('should display inline temperature control', () => {
    render(<ControlPanel />);
    
    // Temperature is now inline with emoji label
    expect(screen.getByText(/Temp/)).toBeInTheDocument();
  });

  it('should display inline speed control', () => {
    render(<ControlPanel />);
    
    // Speed is now inline with emoji label
    expect(screen.getByText(/Speed/)).toBeInTheDocument();
  });

  it('should have boundary dropdown in expanded section', () => {
    render(<ControlPanel />);
    
    // Click to expand the Boundary & Display section
    const boundarySection = screen.getByText('Boundary & Display');
    fireEvent.click(boundarySection);
    
    expect(screen.getByText('Boundary')).toBeInTheDocument();
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
