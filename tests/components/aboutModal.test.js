/**
 * @jest-environment jsdom
 */

import { render, screen, fireEvent } from '@testing-library/react';
import AboutModal from '../../src/components/AboutModal';

describe('AboutModal Component', () => {
  it('should render the about button', () => {
    render(<AboutModal />);
    expect(screen.getByRole('button', { name: /about/i })).toBeInTheDocument();
  });

  it('should not show modal initially', () => {
    render(<AboutModal />);
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
  });

  it('should open modal when button is clicked', () => {
    render(<AboutModal />);
    
    const aboutButton = screen.getByRole('button', { name: /about/i });
    fireEvent.click(aboutButton);
    
    expect(screen.getByRole('dialog')).toBeInTheDocument();
    expect(screen.getByText('Molecular Dynamics Simulation')).toBeInTheDocument();
  });

  it('should close modal when close button is clicked', () => {
    render(<AboutModal />);
    
    // Open modal
    fireEvent.click(screen.getByRole('button', { name: /about/i }));
    expect(screen.getByRole('dialog')).toBeInTheDocument();
    
    // Close modal
    fireEvent.click(screen.getByRole('button', { name: /close/i }));
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
  });

  it('should close modal when backdrop is clicked', () => {
    render(<AboutModal />);
    
    // Open modal
    fireEvent.click(screen.getByRole('button', { name: /about/i }));
    expect(screen.getByRole('dialog')).toBeInTheDocument();
    
    // Click backdrop (the element with class about-modal-backdrop)
    const backdrop = document.querySelector('.about-modal-backdrop');
    fireEvent.click(backdrop);
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
  });

  it('should display overview section', () => {
    render(<AboutModal />);
    fireEvent.click(screen.getByRole('button', { name: /about/i }));
    
    expect(screen.getByText(/What is This App/)).toBeInTheDocument();
    expect(screen.getByText(/interactive molecular dynamics/i)).toBeInTheDocument();
  });

  it('should display features section', () => {
    render(<AboutModal />);
    fireEvent.click(screen.getByRole('button', { name: /about/i }));
    
    expect(screen.getByText(/Features/)).toBeInTheDocument();
    expect(screen.getByText(/Lennard-Jones/)).toBeInTheDocument();
  });

  it('should display controls section', () => {
    render(<AboutModal />);
    fireEvent.click(screen.getByRole('button', { name: /about/i }));
    
    expect(screen.getByText(/Controls/)).toBeInTheDocument();
    expect(screen.getByText(/Apply force to move the player atom/)).toBeInTheDocument();
  });

  it('should display technology section', () => {
    render(<AboutModal />);
    fireEvent.click(screen.getByRole('button', { name: /about/i }));
    
    expect(screen.getByText(/Technology/)).toBeInTheDocument();
    expect(screen.getByText(/React 18/)).toBeInTheDocument();
  });

  it('should have GitHub link', () => {
    render(<AboutModal />);
    fireEvent.click(screen.getByRole('button', { name: /about/i }));
    
    const githubLink = screen.getByRole('link', { name: /github/i });
    expect(githubLink).toBeInTheDocument();
    expect(githubLink).toHaveAttribute('href', 'https://github.com/aryaghan-mutum/MolecularDynamics');
    expect(githubLink).toHaveAttribute('target', '_blank');
  });

  it('should display version number', () => {
    render(<AboutModal />);
    fireEvent.click(screen.getByRole('button', { name: /about/i }));
    
    // Version is dynamically loaded from package.json
    expect(screen.getByText(/Version \d+\.\d+\.\d+/)).toBeInTheDocument();
  });
});
