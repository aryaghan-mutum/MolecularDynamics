/**
 * @fileoverview Energy Graph Tests
 * @description Tests for EnergyGraph component
 */

import { render, screen, fireEvent } from '@testing-library/react';
import EnergyGraph from '../../src/components/EnergyGraph';
import { SimulationProvider } from '../../src/context/SimulationContext';

// Wrapper with providers
const renderWithProviders = (component) => {
  return render(
    <SimulationProvider>
      {component}
    </SimulationProvider>
  );
};

describe('EnergyGraph', () => {
  describe('Rendering', () => {
    it('renders energy monitor title', () => {
      renderWithProviders(<EnergyGraph />);
      expect(screen.getByText('Energy Monitor')).toBeInTheDocument();
    });

    it('renders all three energy type buttons', () => {
      renderWithProviders(<EnergyGraph />);
      expect(screen.getByText('Kinetic')).toBeInTheDocument();
      expect(screen.getByText('Potential')).toBeInTheDocument();
      expect(screen.getByText('Total')).toBeInTheDocument();
    });

    it('renders temperature display', () => {
      renderWithProviders(<EnergyGraph />);
      expect(screen.getByText('Temperature:')).toBeInTheDocument();
    });

    it('displays initial energy values', () => {
      renderWithProviders(<EnergyGraph />);
      // Should show 0.00 for initial state
      const energyValues = screen.getAllByText('0.00');
      expect(energyValues.length).toBeGreaterThan(0);
    });

    it('displays temperature with K unit', () => {
      renderWithProviders(<EnergyGraph />);
      expect(screen.getByText(/K$/)).toBeInTheDocument();
    });
  });

  describe('Graph Display', () => {
    it('graph is always visible', () => {
      renderWithProviders(<EnergyGraph />);
      const canvas = document.querySelector('.energy-canvas');
      expect(canvas).toBeInTheDocument();
    });

    it('shows canvas with correct dimensions', () => {
      renderWithProviders(<EnergyGraph />);
      const canvas = document.querySelector('.energy-canvas');
      expect(canvas).toHaveAttribute('width', '280');
      expect(canvas).toHaveAttribute('height', '150');
    });

    it('shows graph container', () => {
      renderWithProviders(<EnergyGraph />);
      const container = document.querySelector('.energy-graph-container');
      expect(container).toBeInTheDocument();
    });
  });

  describe('Energy Type Toggles', () => {
    it('all energy types are active by default', () => {
      renderWithProviders(<EnergyGraph />);
      const buttons = document.querySelectorAll('.energy-value-btn');
      buttons.forEach(btn => {
        expect(btn).toHaveClass('active');
      });
    });

    it('toggles energy type when clicked', () => {
      renderWithProviders(<EnergyGraph />);
      const kineticBtn = screen.getByText('Kinetic').closest('button');
      fireEvent.click(kineticBtn);
      expect(kineticBtn).not.toHaveClass('active');
    });

    it('can re-enable toggled off energy type', () => {
      renderWithProviders(<EnergyGraph />);
      const kineticBtn = screen.getByText('Kinetic').closest('button');
      fireEvent.click(kineticBtn); // Toggle off
      fireEvent.click(kineticBtn); // Toggle on
      expect(kineticBtn).toHaveClass('active');
    });
  });

  describe('Clear History', () => {
    it('has clear history button', () => {
      renderWithProviders(<EnergyGraph />);
      expect(screen.getByTitle(/clear history/i)).toBeInTheDocument();
    });

    it('clear button is clickable', () => {
      renderWithProviders(<EnergyGraph />);
      const clearBtn = screen.getByTitle(/clear history/i);
      expect(() => fireEvent.click(clearBtn)).not.toThrow();
    });
  });

  describe('Canvas', () => {
    it('canvas has correct dimensions', () => {
      renderWithProviders(<EnergyGraph />);
      const canvas = document.querySelector('.energy-canvas');
      expect(canvas).toHaveAttribute('width', '280');
      expect(canvas).toHaveAttribute('height', '150');
    });
  });

  describe('Structure', () => {
    it('has correct panel structure', () => {
      renderWithProviders(<EnergyGraph />);
      expect(document.querySelector('.energy-graph-panel')).toBeInTheDocument();
      expect(document.querySelector('.energy-graph-header')).toBeInTheDocument();
      expect(document.querySelector('.energy-values')).toBeInTheDocument();
      expect(document.querySelector('.temperature-display')).toBeInTheDocument();
    });
  });
});
