/**
 * @fileoverview Help Modal Tests
 * @description Tests for HelpModal component
 */

import { render, screen, fireEvent } from '@testing-library/react';
import HelpModal from '../../src/components/HelpModal';

describe('HelpModal', () => {
  describe('Rendering', () => {
    it('renders help button', () => {
      render(<HelpModal />);
      expect(screen.getByRole('button', { name: /help/i })).toBeInTheDocument();
    });

    it('modal is closed by default', () => {
      render(<HelpModal />);
      expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
    });
  });

  describe('Modal Open/Close', () => {
    it('opens modal when button is clicked', () => {
      render(<HelpModal />);
      fireEvent.click(screen.getByRole('button', { name: /help/i }));
      expect(screen.getByRole('dialog')).toBeInTheDocument();
      expect(screen.getByText('Help & Tutorial')).toBeInTheDocument();
    });

    it('closes modal when close button is clicked', () => {
      render(<HelpModal />);
      fireEvent.click(screen.getByRole('button', { name: /help/i }));
      fireEvent.click(screen.getByRole('button', { name: /close/i }));
      expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
    });

    it('closes modal when backdrop is clicked', () => {
      render(<HelpModal />);
      fireEvent.click(screen.getByRole('button', { name: /help/i }));
      const backdrop = document.querySelector('.help-modal-backdrop');
      fireEvent.click(backdrop);
      expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
    });

    it('closes modal on Escape key', () => {
      render(<HelpModal />);
      fireEvent.click(screen.getByRole('button', { name: /help/i }));
      fireEvent.keyDown(window, { key: 'Escape' });
      expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
    });
  });

  describe('Tabs', () => {
    beforeEach(() => {
      render(<HelpModal />);
      fireEvent.click(screen.getByRole('button', { name: /help/i }));
    });

    it('displays all three tabs', () => {
      const tabs = document.querySelectorAll('.help-tab');
      expect(tabs.length).toBe(3);
      expect(tabs[0].textContent).toContain('Tutorial');
      expect(tabs[1].textContent).toContain('Quick Reference');
      expect(tabs[2].textContent).toContain('Physics Info');
    });

    it('shows Tutorial tab content by default', () => {
      expect(screen.getByText('Welcome!')).toBeInTheDocument();
    });

    it('switches to Quick Reference tab', () => {
      const tabs = document.querySelectorAll('.help-tab');
      fireEvent.click(tabs[1]); // Quick Reference tab
      expect(screen.getByText('Keyboard Shortcuts')).toBeInTheDocument();
      expect(screen.getByText('Mouse Controls')).toBeInTheDocument();
    });

    it('switches to Physics Info tab', () => {
      const tabs = document.querySelectorAll('.help-tab');
      fireEvent.click(tabs[2]); // Physics Info tab
      expect(screen.getByText(/Physics Formulas/)).toBeInTheDocument();
      expect(screen.getByText(/Lennard-Jones Potential/)).toBeInTheDocument();
    });
  });

  describe('Tutorial Navigation', () => {
    beforeEach(() => {
      render(<HelpModal />);
      fireEvent.click(screen.getByRole('button', { name: /help/i }));
    });

    it('shows first step initially', () => {
      expect(screen.getByText('Welcome!')).toBeInTheDocument();
      expect(screen.getByText(/step 1 of/i)).toBeInTheDocument();
    });

    it('has Previous button disabled on first step', () => {
      const prevBtn = screen.getByText(/← Previous/);
      expect(prevBtn).toBeDisabled();
    });

    it('advances to next step when Next is clicked', () => {
      const nextBtn = screen.getByRole('button', { name: /next →/i });
      fireEvent.click(nextBtn);
      expect(screen.getByText('Adding Atoms')).toBeInTheDocument();
      expect(screen.getByText(/step 2 of/i)).toBeInTheDocument();
    });

    it('goes back to previous step when Previous is clicked', () => {
      const nextBtn = screen.getByRole('button', { name: /next →/i });
      fireEvent.click(nextBtn); // Go to step 2
      fireEvent.click(screen.getByText(/← Previous/)); // Go back
      expect(screen.getByText('Welcome!')).toBeInTheDocument();
    });

    it('shows Finish button on last step', () => {
      // Navigate to last step by clicking Next button
      for (let i = 0; i < 8; i++) {
        const nextBtn = document.querySelector('.tutorial-btn.primary');
        fireEvent.click(nextBtn);
      }
      expect(screen.getByText('Finish')).toBeInTheDocument();
    });

    it('closes modal when Finish is clicked', () => {
      // Navigate to last step
      for (let i = 0; i < 8; i++) {
        const nextBtn = document.querySelector('.tutorial-btn.primary');
        fireEvent.click(nextBtn);
      }
      fireEvent.click(screen.getByText('Finish'));
      expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
    });

    it('has progress dots for each step', () => {
      const dots = document.querySelectorAll('.progress-dot');
      expect(dots.length).toBe(9); // 9 tutorial steps
    });

    it('can navigate by clicking progress dots', () => {
      const dots = document.querySelectorAll('.progress-dot');
      fireEvent.click(dots[4]); // Click 5th dot
      expect(screen.getByText('Player Control')).toBeInTheDocument();
    });
  });

  describe('Quick Reference Content', () => {
    beforeEach(() => {
      render(<HelpModal />);
      fireEvent.click(screen.getByRole('button', { name: /help/i }));
      const tabs = document.querySelectorAll('.help-tab');
      fireEvent.click(tabs[1]); // Quick Reference tab
    });

    it('shows keyboard shortcuts', () => {
      expect(screen.getByText('Move player atom')).toBeInTheDocument();
      expect(screen.getByText('Pause/Resume simulation')).toBeInTheDocument();
    });

    it('shows mouse controls', () => {
      expect(screen.getByText('Add selected atom type')).toBeInTheDocument();
    });

    it('displays kbd elements for shortcuts', () => {
      const kbdElements = document.querySelectorAll('kbd');
      expect(kbdElements.length).toBeGreaterThan(0);
    });
  });

  describe('Physics Info Content', () => {
    beforeEach(() => {
      render(<HelpModal />);
      fireEvent.click(screen.getByRole('button', { name: /help/i }));
      const tabs = document.querySelectorAll('.help-tab');
      fireEvent.click(tabs[2]); // Physics Info tab
    });

    it('shows Lennard-Jones section', () => {
      expect(screen.getByText(/Lennard-Jones Potential/)).toBeInTheDocument();
    });

    it('shows formula', () => {
      const formula = document.querySelector('.formula');
      expect(formula).toBeInTheDocument();
      expect(formula.textContent).toContain('V(r)');
    });

    it('shows Temperature & Energy section', () => {
      expect(screen.getByText(/Temperature.*Kinetic Energy/)).toBeInTheDocument();
    });

    it('shows Integration Method section', () => {
      expect(screen.getByText(/Integration Method/)).toBeInTheDocument();
    });
  });

  describe('Accessibility', () => {
    it('has proper aria-modal attribute', () => {
      render(<HelpModal />);
      fireEvent.click(screen.getByRole('button', { name: /help/i }));
      expect(screen.getByRole('dialog')).toHaveAttribute('aria-modal', 'true');
    });

    it('has proper aria-labelledby', () => {
      render(<HelpModal />);
      fireEvent.click(screen.getByRole('button', { name: /help/i }));
      const dialog = screen.getByRole('dialog');
      expect(dialog).toHaveAttribute('aria-labelledby', 'help-title');
    });
  });
});
