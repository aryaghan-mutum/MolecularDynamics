/**
 * @fileoverview Auto-save Manager Component
 * @description Manages automatic saving/loading of simulation state
 * @module components/AutoSaveManager
 */

import { useEffect, useState, useCallback } from 'react';
import { useSimulation, useSimulationDispatch } from '../context/SimulationContext';
import { useAutoSave } from '../hooks/useAutoSave';
import './AutoSaveManager.css';

/**
 * Auto-save Manager Component
 * Provides UI for save/load functionality and shows save status
 */
function AutoSaveManager() {
  const simulation = useSimulation();
  const dispatch = useSimulationDispatch();
  const { saveState, hasSavedState, restoreState, clearSavedState } = useAutoSave(simulation, dispatch);
  
  const [showRestorePrompt, setShowRestorePrompt] = useState(false);
  const [saveIndicator, setSaveIndicator] = useState(null);

  // Check for saved state on mount
  useEffect(() => {
    if (hasSavedState() && simulation.atoms.length === 0) {
      setShowRestorePrompt(true);
    }
  }, []); // Only on mount

  // Show save indicator when auto-save occurs
  useEffect(() => {
    if (simulation.lastAutoSave) {
      setSaveIndicator('saved');
      const timer = setTimeout(() => setSaveIndicator(null), 2000);
      return () => clearTimeout(timer);
    }
  }, [simulation.lastAutoSave]);

  const handleRestore = useCallback(() => {
    restoreState();
    setShowRestorePrompt(false);
  }, [restoreState]);

  const handleDismiss = useCallback(() => {
    clearSavedState();
    setShowRestorePrompt(false);
  }, [clearSavedState]);

  const handleManualSave = useCallback(() => {
    if (saveState()) {
      setSaveIndicator('saved');
      setTimeout(() => setSaveIndicator(null), 2000);
    }
  }, [saveState]);

  return (
    <>
      {/* Restore prompt */}
      {showRestorePrompt && (
        <div className="autosave-prompt">
          <div className="autosave-prompt-content">
            <span className="autosave-icon">💾</span>
            <p>Previous simulation found. Restore?</p>
            <div className="autosave-prompt-buttons">
              <button className="autosave-btn restore" onClick={handleRestore}>
                Restore
              </button>
              <button className="autosave-btn dismiss" onClick={handleDismiss}>
                Start Fresh
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Save indicator */}
      {saveIndicator && (
        <div className={`save-indicator ${saveIndicator}`}>
          {saveIndicator === 'saved' && '✓ Saved'}
        </div>
      )}

      {/* Manual save button (shown in settings or as small icon) */}
      {simulation.autoSaveEnabled && (
        <button 
          className="manual-save-btn" 
          onClick={handleManualSave}
          title="Save simulation now"
        >
          💾
        </button>
      )}
    </>
  );
}

export default AutoSaveManager;
