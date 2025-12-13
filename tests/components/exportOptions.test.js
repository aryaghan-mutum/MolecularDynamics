/**
 * @fileoverview Export Options Tests
 * @description Tests for ExportOptions component
 */

import { render, screen, fireEvent } from '@testing-library/react';
import ExportOptions from '../../src/components/ExportOptions';
import { SimulationProvider } from '../../src/context/SimulationContext';

// Mock URL.createObjectURL and URL.revokeObjectURL
const mockCreateObjectURL = jest.fn(() => 'blob:mock-url');
const mockRevokeObjectURL = jest.fn();
global.URL.createObjectURL = mockCreateObjectURL;
global.URL.revokeObjectURL = mockRevokeObjectURL;

// Mock clipboard API
const mockWriteText = jest.fn();
Object.assign(navigator, {
  clipboard: {
    writeText: mockWriteText,
  },
});

// Wrapper with providers
const renderWithProviders = (component) => {
  return render(
    <SimulationProvider>
      {component}
    </SimulationProvider>
  );
};

describe('ExportOptions', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    // Mock alert
    jest.spyOn(window, 'alert').mockImplementation(() => {});
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  describe('Rendering', () => {
    it('renders export title', () => {
      renderWithProviders(<ExportOptions />);
      expect(screen.getByText('Export Data')).toBeInTheDocument();
    });

    it('renders JSON export button', () => {
      renderWithProviders(<ExportOptions />);
      expect(screen.getByText('JSON')).toBeInTheDocument();
      expect(screen.getByText('Full state')).toBeInTheDocument();
    });

    it('renders CSV export button', () => {
      renderWithProviders(<ExportOptions />);
      expect(screen.getByText('CSV')).toBeInTheDocument();
      expect(screen.getByText('Atom data')).toBeInTheDocument();
    });

    it('renders XYZ export button', () => {
      renderWithProviders(<ExportOptions />);
      expect(screen.getByText('XYZ')).toBeInTheDocument();
      expect(screen.getByText('Molecular')).toBeInTheDocument();
    });

    it('renders Screenshot export button', () => {
      renderWithProviders(<ExportOptions />);
      expect(screen.getByText('Screenshot')).toBeInTheDocument();
      expect(screen.getByText('PNG image')).toBeInTheDocument();
    });

    it('renders copy to clipboard button', () => {
      renderWithProviders(<ExportOptions />);
      expect(screen.getByText(/copy summary to clipboard/i)).toBeInTheDocument();
    });
  });

  describe('Export Buttons', () => {
    it('JSON export button is clickable', () => {
      renderWithProviders(<ExportOptions />);
      const jsonBtn = screen.getByText('JSON').closest('button');
      expect(() => fireEvent.click(jsonBtn)).not.toThrow();
    });

    it('CSV export button is clickable', () => {
      renderWithProviders(<ExportOptions />);
      const csvBtn = screen.getByText('CSV').closest('button');
      expect(() => fireEvent.click(csvBtn)).not.toThrow();
    });

    it('XYZ export button is clickable', () => {
      renderWithProviders(<ExportOptions />);
      const xyzBtn = screen.getByText('XYZ').closest('button');
      expect(() => fireEvent.click(xyzBtn)).not.toThrow();
    });

    it('Screenshot button is clickable', () => {
      renderWithProviders(<ExportOptions />);
      const screenshotBtn = screen.getByText('Screenshot').closest('button');
      expect(() => fireEvent.click(screenshotBtn)).not.toThrow();
    });
  });

  describe('JSON Export', () => {
    it('creates blob URL when JSON export is clicked', () => {
      renderWithProviders(<ExportOptions />);
      const jsonBtn = screen.getByText('JSON').closest('button');
      fireEvent.click(jsonBtn);
      expect(mockCreateObjectURL).toHaveBeenCalled();
    });

    it('revokes blob URL after download', () => {
      renderWithProviders(<ExportOptions />);
      const jsonBtn = screen.getByText('JSON').closest('button');
      fireEvent.click(jsonBtn);
      expect(mockRevokeObjectURL).toHaveBeenCalled();
    });
  });

  describe('CSV Export', () => {
    it('creates blob URL when CSV export is clicked', () => {
      renderWithProviders(<ExportOptions />);
      const csvBtn = screen.getByText('CSV').closest('button');
      fireEvent.click(csvBtn);
      expect(mockCreateObjectURL).toHaveBeenCalled();
    });
  });

  describe('XYZ Export', () => {
    it('creates blob URL when XYZ export is clicked', () => {
      renderWithProviders(<ExportOptions />);
      const xyzBtn = screen.getByText('XYZ').closest('button');
      fireEvent.click(xyzBtn);
      expect(mockCreateObjectURL).toHaveBeenCalled();
    });
  });

  describe('Copy to Clipboard', () => {
    it('calls clipboard API when copy button is clicked', async () => {
      mockWriteText.mockResolvedValueOnce();
      renderWithProviders(<ExportOptions />);
      const copyBtn = screen.getByText(/copy summary to clipboard/i);
      fireEvent.click(copyBtn);
      expect(mockWriteText).toHaveBeenCalled();
    });

    it('shows success alert after copying', async () => {
      mockWriteText.mockResolvedValueOnce();
      renderWithProviders(<ExportOptions />);
      const copyBtn = screen.getByText(/copy summary to clipboard/i);
      await fireEvent.click(copyBtn);
      // Wait for async operation
      await new Promise(resolve => setTimeout(resolve, 0));
      expect(window.alert).toHaveBeenCalledWith('Summary copied to clipboard!');
    });
  });

  describe('Button Titles', () => {
    it('JSON button has correct title', () => {
      renderWithProviders(<ExportOptions />);
      const jsonBtn = screen.getByText('JSON').closest('button');
      expect(jsonBtn).toHaveAttribute('title', 'Export full simulation state');
    });

    it('CSV button has correct title', () => {
      renderWithProviders(<ExportOptions />);
      const csvBtn = screen.getByText('CSV').closest('button');
      expect(csvBtn).toHaveAttribute('title', 'Export atom data as spreadsheet');
    });

    it('XYZ button has correct title', () => {
      renderWithProviders(<ExportOptions />);
      const xyzBtn = screen.getByText('XYZ').closest('button');
      expect(xyzBtn).toHaveAttribute('title', 'Export in molecular XYZ format');
    });

    it('Screenshot button has correct title', () => {
      renderWithProviders(<ExportOptions />);
      const screenshotBtn = screen.getByText('Screenshot').closest('button');
      expect(screenshotBtn).toHaveAttribute('title', 'Save canvas as image');
    });
  });

  describe('Structure', () => {
    it('has correct panel structure', () => {
      renderWithProviders(<ExportOptions />);
      expect(document.querySelector('.export-options-panel')).toBeInTheDocument();
      expect(document.querySelector('.export-grid')).toBeInTheDocument();
      expect(document.querySelector('.copy-btn')).toBeInTheDocument();
    });

    it('has hidden download link', () => {
      renderWithProviders(<ExportOptions />);
      const hiddenLink = document.querySelector('a[style*="display: none"]');
      expect(hiddenLink).toBeInTheDocument();
      expect(hiddenLink).toHaveAttribute('aria-hidden', 'true');
    });
  });
});
