/**
 * @fileoverview Unit tests for FileUploader Component
 * @description Tests for file upload functionality and error handling
 */
import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';

// Mock parseParameterFile
jest.mock('../../src/simulation/fileReader', () => ({
  parseParameterFile: jest.fn(() => ({
    onebody_parameters: [],
    twobody_parameters: [],
    paramGeneral: {},
  })),
}));

// Mock the context
const mockSetParameters = jest.fn();

jest.mock('../../src/context/ParametersContext', () => ({
  useParametersActions: () => ({
    setParameters: mockSetParameters,
  }),
  useParameters: () => ({ isLoaded: false }),
}));

// Import after mocking
import FileUploader from '../../src/components/FileUploader';
import { parseParameterFile } from '../../src/simulation/fileReader';

describe('FileUploader Component', () => {
  beforeEach(() => {
    mockSetParameters.mockClear();
    parseParameterFile.mockClear();
    parseParameterFile.mockReturnValue({
      onebody_parameters: [],
      twobody_parameters: [],
      paramGeneral: {},
    });
  });

  it('should render without crashing', () => {
    render(<FileUploader />);
    expect(screen.getByRole('button')).toBeInTheDocument();
  });

  it('should display title', () => {
    render(<FileUploader />);
    expect(screen.getByText(/Load Parameters/)).toBeInTheDocument();
  });

  it('should display upload button', () => {
    render(<FileUploader />);
    expect(screen.getByText(/Select ReaxFF File/)).toBeInTheDocument();
  });

  it('should display file hint', () => {
    render(<FileUploader />);
    expect(screen.getByText(/Formats:/)).toBeInTheDocument();
  });

  it('should have hidden file input', () => {
    render(<FileUploader />);
    const input = document.querySelector('input[type="file"]');
    expect(input).toBeInTheDocument();
    expect(input).toHaveClass('file-input-hidden');
  });

  it('should accept correct file types', () => {
    render(<FileUploader />);
    const input = document.querySelector('input[type="file"]');
    expect(input).toHaveAttribute('accept', '.ff,.txt,text/plain');
  });

  it('should trigger file input on button click', () => {
    render(<FileUploader />);
    const input = document.querySelector('input[type="file"]');
    const clickSpy = jest.spyOn(input, 'click');
    
    const button = screen.getByRole('button');
    fireEvent.click(button);
    
    expect(clickSpy).toHaveBeenCalled();
  });

  it('should handle file upload', async () => {
    render(<FileUploader />);
    const input = document.querySelector('input[type="file"]');
    
    const file = new File(['test content'], 'test.ff', { type: 'text/plain' });
    
    // Mock file.text() method
    Object.defineProperty(file, 'text', {
      value: jest.fn().mockResolvedValue('test content'),
    });
    
    fireEvent.change(input, { target: { files: [file] } });
    
    await waitFor(() => {
      expect(parseParameterFile).toHaveBeenCalledWith('test content');
    });
  });

  it('should call setParameters on successful parse', async () => {
    render(<FileUploader />);
    const input = document.querySelector('input[type="file"]');
    
    const file = new File(['test content'], 'params.ff', { type: 'text/plain' });
    Object.defineProperty(file, 'text', {
      value: jest.fn().mockResolvedValue('test content'),
    });
    
    fireEvent.change(input, { target: { files: [file] } });
    
    await waitFor(() => {
      expect(mockSetParameters).toHaveBeenCalled();
    });
  });

  it('should display success message after upload', async () => {
    render(<FileUploader />);
    const input = document.querySelector('input[type="file"]');
    
    const file = new File(['test'], 'myfile.ff', { type: 'text/plain' });
    Object.defineProperty(file, 'text', {
      value: jest.fn().mockResolvedValue('test'),
    });
    
    fireEvent.change(input, { target: { files: [file] } });
    
    await waitFor(() => {
      expect(screen.getByText(/myfile\.ff loaded/)).toBeInTheDocument();
    });
  });

  it('should display error message on parse failure', async () => {
    parseParameterFile.mockImplementation(() => {
      throw new Error('Invalid file format');
    });
    
    render(<FileUploader />);
    const input = document.querySelector('input[type="file"]');
    
    const file = new File(['bad content'], 'bad.ff', { type: 'text/plain' });
    Object.defineProperty(file, 'text', {
      value: jest.fn().mockResolvedValue('bad content'),
    });
    
    fireEvent.change(input, { target: { files: [file] } });
    
    await waitFor(() => {
      expect(screen.getByText(/Error: Invalid file format/)).toBeInTheDocument();
    });
  });

  it('should handle no file selected', async () => {
    render(<FileUploader />);
    const input = document.querySelector('input[type="file"]');
    
    // Simulate no file selected
    fireEvent.change(input, { target: { files: [] } });
    
    // setParameters should not be called
    await new Promise(resolve => setTimeout(resolve, 100));
    expect(mockSetParameters).not.toHaveBeenCalled();
  });

  it('should show loading state during upload', async () => {
    // Make the file read take time
    const file = new File(['test'], 'slow.ff', { type: 'text/plain' });
    let resolveText;
    Object.defineProperty(file, 'text', {
      value: jest.fn().mockReturnValue(new Promise(r => { resolveText = r; })),
    });
    
    render(<FileUploader />);
    const input = document.querySelector('input[type="file"]');
    
    fireEvent.change(input, { target: { files: [file] } });
    
    // Button should show loading
    await waitFor(() => {
      expect(screen.getAllByText(/Loading/).length).toBeGreaterThan(0);
    });
    
    // Resolve the promise
    resolveText('test content');
    
    await waitFor(() => {
      expect(screen.getByText(/Select ReaxFF File/)).toBeInTheDocument();
    });
  });

  it('should disable button during loading', async () => {
    const file = new File(['test'], 'slow.ff', { type: 'text/plain' });
    let resolveText;
    Object.defineProperty(file, 'text', {
      value: jest.fn().mockReturnValue(new Promise(r => { resolveText = r; })),
    });
    
    render(<FileUploader />);
    const input = document.querySelector('input[type="file"]');
    
    fireEvent.change(input, { target: { files: [file] } });
    
    await waitFor(() => {
      expect(screen.getByRole('button')).toBeDisabled();
    });
    
    resolveText('test content');
    
    await waitFor(() => {
      expect(screen.getByRole('button')).not.toBeDisabled();
    });
  });
});
