/**
 * @fileoverview Loading Spinner Component
 * @description Loading animation for initial app load
 * @module components/LoadingSpinner
 */

import './LoadingSpinner.css';

/**
 * Loading Spinner Component
 */
function LoadingSpinner({ message = 'Loading simulation...' }) {
  return (
    <div className="loading-spinner-container">
      <div className="loading-spinner">
        <div className="spinner-atom">
          <div className="spinner-nucleus"></div>
          <div className="spinner-orbit orbit-1">
            <div className="spinner-electron"></div>
          </div>
          <div className="spinner-orbit orbit-2">
            <div className="spinner-electron"></div>
          </div>
          <div className="spinner-orbit orbit-3">
            <div className="spinner-electron"></div>
          </div>
        </div>
      </div>
      <p className="loading-message">{message}</p>
    </div>
  );
}

export default LoadingSpinner;
