import { useRef, useState, useCallback } from 'react';
import { useParametersActions, useParameters } from '../context/ParametersContext';
import { parseParameterFile } from '../simulation/fileReader';
import './FileUploader.css';

/**
 * File Uploader Component
 * Handles ReaxFF parameter file uploads
 */
function FileUploader() {
  const fileInputRef = useRef(null);
  const [status, setStatus] = useState({ type: '', message: '' });
  const [isLoading, setIsLoading] = useState(false);
  const [loadedFileName, setLoadedFileName] = useState('');
  const { setParameters } = useParametersActions();
  const parameters = useParameters();

  const handleFileChange = useCallback(async (event) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setIsLoading(true);
    setStatus({ type: 'info', message: 'Loading parameters...' });

    try {
      const text = await file.text();
      const params = parseParameterFile(text);
      
      setParameters({
        r_ij: 1.2,
        ...params,
      });

      setLoadedFileName(file.name);
      setStatus({ 
        type: 'success', 
        message: `✓ ${file.name} loaded!` 
      });
    } catch (error) {
      console.error('Error parsing file:', error);
      setStatus({ 
        type: 'error', 
        message: `Error: ${error.message}` 
      });
    } finally {
      setIsLoading(false);
      // Reset input so same file can be uploaded again
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  }, [setParameters]);

  const handleClick = () => {
    // Reset the input value before clicking to ensure onChange fires even for same file
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
    fileInputRef.current?.click();
  };

  return (
    <div className={`file-uploader ${parameters.isLoaded ? 'loaded' : ''}`}>
      <h3>📁 Load Parameters</h3>
      
      <input
        ref={fileInputRef}
        type="file"
        accept=".ff,.txt,text/plain"
        onChange={handleFileChange}
        className="file-input-hidden"
      />

      {parameters.isLoaded ? (
        <div className="loaded-indicator">
          <div className="loaded-badge">
            <span className="check-icon">✓</span>
            <span className="loaded-text">ReaxFF Active</span>
          </div>
          <div className="loaded-file">{loadedFileName || 'Parameters loaded'}</div>
          <button 
            className="upload-button compact"
            onClick={handleClick}
            disabled={isLoading}
          >
            Load Different File
          </button>
        </div>
      ) : (
        <button 
          className="upload-button"
          onClick={handleClick}
          disabled={isLoading}
        >
          {isLoading ? '⟳ Loading...' : '⬆ Select ReaxFF File'}
        </button>
      )}

      {status.message && !parameters.isLoaded && (
        <div className={`status-message ${status.type}`}>
          {status.message}
        </div>
      )}

      {!parameters.isLoaded && (
        <p className="file-hint">
          Formats: <code>.ff</code> <code>.txt</code>
        </p>
      )}
    </div>
  );
}

export default FileUploader;
