/**
 * @fileoverview Settings Modal Tests
 * @description Tests for SettingsModal component
 */

import { render, screen, fireEvent } from '@testing-library/react';
import SettingsModal from '../../src/components/SettingsModal';
import { SimulationProvider } from '../../src/context/SimulationContext';
import { ParametersProvider } from '../../src/context/ParametersContext';

// Wrapper with providers
const renderWithProviders = (component) => {
  return render(
    <ParametersProvider>
      <SimulationProvider>
        {component}
      </SimulationProvider>
    </ParametersProvider>
  );
};

describe('SettingsModal', () => {
  describe('Rendering', () => {
    it('renders settings button', () => {
      renderWithProviders(<SettingsModal />);
      expect(screen.getByRole('button', { name: /settings/i })).toBeInTheDocument();
    });

    it('modal is closed by default', () => {
      renderWithProviders(<SettingsModal />);
      expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
    });
  });

  describe('Modal Open/Close', () => {
    it('opens modal when button is clicked', () => {
      renderWithProviders(<SettingsModal />);
      fireEvent.click(screen.getByRole('button', { name: /settings/i }));
      expect(screen.getByRole('dialog')).toBeInTheDocument();
      expect(screen.getByText('Settings')).toBeInTheDocument();
    });

    it('closes modal when close button is clicked', () => {
      renderWithProviders(<SettingsModal />);
      fireEvent.click(screen.getByRole('button', { name: /settings/i }));
      fireEvent.click(screen.getByRole('button', { name: /close/i }));
      expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
    });

    it('closes modal when Cancel button is clicked', () => {
      renderWithProviders(<SettingsModal />);
      fireEvent.click(screen.getByRole('button', { name: /settings/i }));
      fireEvent.click(screen.getByText('Cancel'));
      expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
    });

    it('closes modal when backdrop is clicked', () => {
      renderWithProviders(<SettingsModal />);
      fireEvent.click(screen.getByRole('button', { name: /settings/i }));
      const backdrop = document.querySelector('.settings-modal-backdrop');
      fireEvent.click(backdrop);
      expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
    });
  });

  describe('Tabs', () => {
    beforeEach(() => {
      renderWithProviders(<SettingsModal />);
      fireEvent.click(screen.getByRole('button', { name: /settings/i }));
    });

    it('displays all three tabs', () => {
      expect(screen.getByText('Simulation')).toBeInTheDocument();
      expect(screen.getByText('Display')).toBeInTheDocument();
      expect(screen.getByText('Physics')).toBeInTheDocument();
    });

    it('shows Simulation tab content by default', () => {
      expect(screen.getByLabelText('Time Step (dt)')).toBeInTheDocument();
      expect(screen.getByLabelText('Zoom Scale')).toBeInTheDocument();
    });

    it('switches to Display tab', () => {
      fireEvent.click(screen.getByText('Display'));
      expect(screen.getByText('Show Bond Lines')).toBeInTheDocument();
      expect(screen.getByText('Clear Screen Each Frame')).toBeInTheDocument();
    });

    it('switches to Physics tab', () => {
      fireEvent.click(screen.getByText('Physics'));
      expect(screen.getByLabelText('Wall Spring Constant')).toBeInTheDocument();
      expect(screen.getByLabelText('Max Velocity')).toBeInTheDocument();
    });
  });

  describe('Settings Controls', () => {
    beforeEach(() => {
      renderWithProviders(<SettingsModal />);
      fireEvent.click(screen.getByRole('button', { name: /settings/i }));
    });

    it('renders time step slider', () => {
      const slider = screen.getByLabelText('Time Step (dt)');
      expect(slider).toHaveAttribute('type', 'range');
    });

    it('renders scale slider', () => {
      const slider = screen.getByLabelText('Zoom Scale');
      expect(slider).toHaveAttribute('type', 'range');
    });

    it('renders physics toggle checkbox', () => {
      const checkbox = screen.getByRole('checkbox', { name: /enable physics simulation/i });
      expect(checkbox).toBeInTheDocument();
    });

    it('has Reset Defaults button', () => {
      expect(screen.getByText('Reset Defaults')).toBeInTheDocument();
    });

    it('has Apply button', () => {
      expect(screen.getByText('Apply')).toBeInTheDocument();
    });
  });

  describe('Reset Defaults', () => {
    it('resets slider values when Reset Defaults is clicked', () => {
      renderWithProviders(<SettingsModal />);
      fireEvent.click(screen.getByRole('button', { name: /settings/i }));
      
      // Change a value first
      const timestepSlider = screen.getByLabelText('Time Step (dt)');
      fireEvent.change(timestepSlider, { target: { value: '0.1' } });
      
      // Click reset
      fireEvent.click(screen.getByText('Reset Defaults'));
      
      // Slider should be back to default
      expect(timestepSlider.value).toBe('0.05');
    });
  });

  describe('Accessibility', () => {
    it('has proper aria-modal attribute', () => {
      renderWithProviders(<SettingsModal />);
      fireEvent.click(screen.getByRole('button', { name: /settings/i }));
      expect(screen.getByRole('dialog')).toHaveAttribute('aria-modal', 'true');
    });

    it('has proper aria-labelledby', () => {
      renderWithProviders(<SettingsModal />);
      fireEvent.click(screen.getByRole('button', { name: /settings/i }));
      const dialog = screen.getByRole('dialog');
      expect(dialog).toHaveAttribute('aria-labelledby', 'settings-title');
    });
  });
});
