import { useRef, useState, useCallback } from 'react';
import { useParametersActions } from '../context/ParametersContext';
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
  const { setParameters } = useParametersActions();

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

      setStatus({ 
        type: 'success', 
        message: `Loaded ${file.name} successfully` 
      });
    } catch (error) {
      console.error('Error parsing file:', error);
      setStatus({ 
        type: 'error', 
        message: `Error: ${error.message}` 
      });
    } finally {
      setIsLoading(false);
    }
  }, [setParameters]);

  const handleClick = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="file-uploader">
      <h3>Load Parameters</h3>
      
      <input
        ref={fileInputRef}
        type="file"
        accept=".ff,.txt,text/plain"
        onChange={handleFileChange}
        className="file-input-hidden"
      />

      <button 
        className="upload-button"
        onClick={handleClick}
        disabled={isLoading}
      >
        {isLoading ? 'Loading...' : 'Select ReaxFF File'}
      </button>

      {status.message && (
        <div className={`status-message ${status.type}`}>
          {status.message}
        </div>
      )}

      <p className="file-hint">
        Supported formats: .ff, .txt (ReaxFF parameter files)
      </p>
    </div>
  );
}

export default FileUploader;
