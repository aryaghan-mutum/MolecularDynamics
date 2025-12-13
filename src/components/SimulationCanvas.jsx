import { useRef, useEffect, useCallback, useState } from 'react';
import { useSimulation, useSimulationDispatch } from '../context/SimulationContext';
import { useParameters } from '../context/ParametersContext';
import { useAnimationFrame } from '../hooks/useAnimationFrame';
import { useKeyboard } from '../hooks/useKeyboard';
import { 
  drawAtom, 
  drawFireball, 
  drawBond, 
  drawBondWithLength,
  drawVelocityVector,
  drawAtomInfo 
} from '../utils/renderer';
import './SimulationCanvas.css';

/**
 * Simulation Canvas Component
 * Renders the molecular dynamics simulation using HTML5 Canvas
 * Supports zoom, pan, atom selection, dragging, multi-select, touch, and recording
 */
function SimulationCanvas() {
  const canvasRef = useRef(null);
  const containerRef = useRef(null);
  const simulation = useSimulation();
  const parameters = useParameters();
  const dispatch = useSimulationDispatch();
  const keys = useKeyboard();
  
  // Local state for interactions
  const [isPanning, setIsPanning] = useState(false);
  const [lastMousePos, setLastMousePos] = useState({ x: 0, y: 0 });
  const [isBoxSelecting, setIsBoxSelecting] = useState(false);
  const [boxSelectStart, setBoxSelectStart] = useState({ x: 0, y: 0 });
  const [boxSelectEnd, setBoxSelectEnd] = useState({ x: 0, y: 0 });
  const [touchState, setTouchState] = useState({ touches: [], lastDist: 0 });

  // Initialize simulation on mount
  useEffect(() => {
    dispatch({ type: 'INITIALIZE' });
  }, [dispatch]);

  // Update canvas size based on container
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const updateSize = () => {
      const container = canvas.parentElement;
      const width = container.clientWidth;
      const height = Math.min(container.clientWidth * 0.75, 600);
      
      canvas.width = width;
      canvas.height = height;

      dispatch({
        type: 'SET_SIZE',
        payload: {
          x: width / simulation.scale,
          y: height / simulation.scale,
          z: height / simulation.scale,
        },
      });
    };

    updateSize();
    window.addEventListener('resize', updateSize);
    return () => window.removeEventListener('resize', updateSize);
  }, [dispatch, simulation.scale]);

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e) => {
      // Space to pause/resume
      if (e.code === 'Space' && e.target === document.body) {
        e.preventDefault();
        dispatch({ type: 'TOGGLE_PAUSE' });
      }
      // R to reset
      if (e.code === 'KeyR' && e.target === document.body && !e.ctrlKey) {
        dispatch({ type: 'RESET_SIMULATION' });
      }
      // Ctrl+Z to undo
      if (e.code === 'KeyZ' && e.ctrlKey && !e.shiftKey) {
        e.preventDefault();
        dispatch({ type: 'UNDO' });
      }
      // Ctrl+Shift+Z or Ctrl+Y to redo
      if ((e.code === 'KeyZ' && e.ctrlKey && e.shiftKey) || (e.code === 'KeyY' && e.ctrlKey)) {
        e.preventDefault();
        dispatch({ type: 'REDO' });
      }
      // F for fullscreen
      if (e.code === 'KeyF' && e.target === document.body) {
        dispatch({ type: 'TOGGLE_FULLSCREEN' });
      }
      // V for velocity vectors
      if (e.code === 'KeyV' && e.target === document.body) {
        dispatch({ type: 'TOGGLE_VELOCITY_VECTORS' });
      }
      // L for labels
      if (e.code === 'KeyL' && e.target === document.body) {
        dispatch({ type: 'TOGGLE_ATOM_LABELS' });
      }
      // B for bonds
      if (e.code === 'KeyB' && e.target === document.body) {
        dispatch({ type: 'TOGGLE_BONDS' });
      }
      // Delete to remove selected atom(s)
      if (e.code === 'Delete') {
        if (simulation.selectedAtomIds?.length > 0) {
          dispatch({ type: 'PUSH_UNDO' });
          dispatch({ type: 'DELETE_SELECTED_ATOMS' });
        } else if (simulation.selectedAtomId !== null) {
          dispatch({ type: 'PUSH_UNDO' });
          dispatch({ type: 'REMOVE_ATOM', payload: { id: simulation.selectedAtomId } });
          dispatch({ type: 'SELECT_ATOM', payload: null });
        }
      }
      // Ctrl+C to copy
      if (e.code === 'KeyC' && e.ctrlKey) {
        e.preventDefault();
        dispatch({ type: 'COPY_ATOMS' });
      }
      // Ctrl+V to paste
      if (e.code === 'KeyV' && e.ctrlKey) {
        e.preventDefault();
        const canvas = canvasRef.current;
        if (canvas) {
          const rect = canvas.getBoundingClientRect();
          dispatch({ 
            type: 'PASTE_ATOMS', 
            payload: { x: simulation.size.x / 2, y: simulation.size.y / 2 } 
          });
        }
      }
      // Escape to clear selection/measurement
      if (e.code === 'Escape') {
        dispatch({ type: 'CLEAR_SELECTION' });
        dispatch({ type: 'CLEAR_MEASUREMENT' });
      }
      // M for measurement mode
      if (e.code === 'KeyM' && e.target === document.body) {
        dispatch({ type: 'SET_MEASUREMENT_MODE', payload: simulation.measurementMode ? null : 'distance' });
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [dispatch, simulation.selectedAtomId, simulation.selectedAtomIds, simulation.measurementMode, simulation.size]);

  // Handle keyboard input for player movement
  useEffect(() => {
    if (simulation.playerId === null) return;

    const playerAtom = simulation.atoms.find(a => a.id === simulation.playerId);
    if (!playerAtom) return;

    let forceX = 0;
    let forceY = 0;

    if (keys.ArrowLeft) forceX -= simulation.thrust;
    if (keys.ArrowRight) forceX += simulation.thrust;
    if (keys.ArrowUp) forceY -= simulation.thrust;
    if (keys.ArrowDown) forceY += simulation.thrust;

    // Always update force (including zero when no keys pressed)
    dispatch({
      type: 'SET_PLAYER_FORCE',
      payload: { x: forceX, y: forceY },
    });

    // Add fireball effect when force is applied
    if (forceX !== 0 || forceY !== 0) {
      const v = Math.sqrt(forceX * forceX + forceY * forceY);
      const vx = -forceX / v * 0.1;
      const vy = -forceY / v * 0.1;
      
      dispatch({
        type: 'ADD_FIREBALL',
        payload: {
          id: Date.now(),
          pos: {
            x: playerAtom.pos.x + vx * playerAtom.radius,
            y: playerAtom.pos.y + vy * playerAtom.radius,
          },
          vel: { x: vx + (Math.random() - 0.5) * 0.2, y: vy - Math.random() * 0.4 },
          radius: 0.5,
          time: 0,
          lifetime: 30,
        },
      });
    }
  }, [keys, simulation.playerId, simulation.atoms, simulation.thrust, dispatch]);

  // Mouse wheel for zoom
  const handleWheel = useCallback((e) => {
    e.preventDefault();
    const delta = e.deltaY > 0 ? 0.9 : 1.1;
    dispatch({ type: 'SET_ZOOM', payload: simulation.zoom * delta });
  }, [dispatch, simulation.zoom]);

  // Get canvas coordinates from mouse event
  const getCanvasCoords = useCallback((e) => {
    const canvas = canvasRef.current;
    const rect = canvas.getBoundingClientRect();
    const x = (e.clientX - rect.left - simulation.pan.x) / (simulation.scale * simulation.zoom);
    const y = (e.clientY - rect.top - simulation.pan.y) / (simulation.scale * simulation.zoom);
    return { x, y };
  }, [simulation.scale, simulation.zoom, simulation.pan]);

  // Find atom at position
  const findAtomAtPos = useCallback((canvasX, canvasY) => {
    for (const atom of simulation.atoms) {
      const dx = atom.pos.x - canvasX;
      const dy = atom.pos.y - canvasY;
      const dist = Math.sqrt(dx * dx + dy * dy);
      if (dist < atom.radius * 1.5) {
        return atom;
      }
    }
    return null;
  }, [simulation.atoms]);

  // Mouse down handler
  const handleMouseDown = useCallback((e) => {
    const coords = getCanvasCoords(e);
    const atom = findAtomAtPos(coords.x, coords.y);
    
    if (e.button === 0) { // Left click
      // Measurement mode
      if (simulation.measurementMode === 'distance' && atom) {
        dispatch({ type: 'ADD_MEASUREMENT_ATOM', payload: atom.id });
        return;
      }
      
      // Shift+click for multi-select
      if (e.shiftKey) {
        if (atom) {
          if (simulation.selectedAtomIds?.includes(atom.id)) {
            dispatch({ type: 'REMOVE_FROM_SELECTION', payload: atom.id });
          } else {
            dispatch({ type: 'ADD_TO_SELECTION', payload: atom.id });
          }
        } else {
          // Start box selection
          setIsBoxSelecting(true);
          setBoxSelectStart(coords);
          setBoxSelectEnd(coords);
        }
      } else if (atom) {
        dispatch({ type: 'SELECT_ATOM', payload: atom.id });
        dispatch({ type: 'SET_DRAGGING_ATOM', payload: atom.id });
        dispatch({ type: 'CLEAR_SELECTION' }); // Clear multi-selection
      } else {
        dispatch({ type: 'SELECT_ATOM', payload: null });
        dispatch({ type: 'CLEAR_SELECTION' });
      }
    } else if (e.button === 1 || e.button === 2) { // Middle or right click for pan
      setIsPanning(true);
      setLastMousePos({ x: e.clientX, y: e.clientY });
    }
  }, [getCanvasCoords, findAtomAtPos, dispatch]);

  // Mouse move handler
  const handleMouseMove = useCallback((e) => {
    if (isPanning) {
      const dx = e.clientX - lastMousePos.x;
      const dy = e.clientY - lastMousePos.y;
      dispatch({ 
        type: 'SET_PAN', 
        payload: { x: simulation.pan.x + dx, y: simulation.pan.y + dy } 
      });
      setLastMousePos({ x: e.clientX, y: e.clientY });
    } else if (simulation.draggingAtomId !== null) {
      const coords = getCanvasCoords(e);
      dispatch({
        type: 'UPDATE_ATOM_POSITION',
        payload: { id: simulation.draggingAtomId, position: { x: coords.x, y: coords.y } },
      });
    }
  }, [isPanning, lastMousePos, simulation.pan, simulation.draggingAtomId, dispatch, getCanvasCoords]);

  // Mouse up handler
  const handleMouseUp = useCallback(() => {
    setIsPanning(false);
    if (simulation.draggingAtomId !== null) {
      dispatch({ type: 'SET_DRAGGING_ATOM', payload: null });
    }
  }, [simulation.draggingAtomId, dispatch]);

  // Double click to add atom
  const handleDoubleClick = useCallback((e) => {
    const coords = getCanvasCoords(e);
    dispatch({ type: 'PUSH_UNDO' });
    dispatch({ 
      type: 'ADD_ATOM', 
      payload: { x: coords.x, y: coords.y, z: 0, atomType: simulation.selectedAtomType } 
    });
  }, [getCanvasCoords, dispatch, simulation.selectedAtomType]);

  // Context menu prevention
  const handleContextMenu = useCallback((e) => {
    e.preventDefault();
  }, []);

  // Render function
  const render = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    const { 
      atoms, bonds, fireballs, clearScreen, scale, size, showBonds,
      zoom, pan, selectedAtomId, showVelocityVectors, showAtomLabels,
      showBondLengths, theme
    } = simulation;

    // Apply zoom and pan transforms
    ctx.save();
    
    // Clear canvas with theme-appropriate color
    const bgColor = theme === 'light' ? '#f0f4f8' : '#0a0a12';
    if (clearScreen) {
      ctx.fillStyle = bgColor;
      ctx.fillRect(0, 0, canvas.width, canvas.height);
    }

    // Apply transformations
    ctx.translate(pan.x, pan.y);
    ctx.scale(zoom, zoom);

    // Draw boundary
    ctx.strokeStyle = theme === 'light' ? 'rgba(0, 0, 0, 0.3)' : 'rgba(255, 255, 255, 0.3)';
    ctx.lineWidth = 2 / zoom;
    ctx.strokeRect(2 / zoom, 2 / zoom, size.x * scale - 4 / zoom, size.y * scale - 4 / zoom);

    // Draw bonds first (behind atoms)
    if (showBonds && bonds) {
      bonds.forEach(bond => {
        const atom1 = atoms.find(a => a.id === bond.atom1Id);
        const atom2 = atoms.find(a => a.id === bond.atom2Id);
        if (atom1 && atom2) {
          if (showBondLengths) {
            drawBondWithLength(ctx, atom1, atom2, bond.order, scale, true);
          } else {
            drawBond(ctx, atom1, atom2, bond.order, scale);
          }
        }
      });
    }

    // Draw atoms
    atoms.forEach(atom => {
      drawAtom(ctx, atom, scale, atom.id === simulation.playerId, showAtomLabels);
      
      // Draw velocity vectors if enabled
      if (showVelocityVectors) {
        drawVelocityVector(ctx, atom, scale, zoom);
      }
    });

    // Draw selection highlight
    if (selectedAtomId !== null) {
      const selectedAtom = atoms.find(a => a.id === selectedAtomId);
      if (selectedAtom) {
        const screenPos = { x: scale * selectedAtom.pos.x, y: scale * selectedAtom.pos.y };
        const radius = scale * selectedAtom.radius;
        
        ctx.strokeStyle = 'rgba(100, 200, 255, 0.9)';
        ctx.lineWidth = 3 / zoom;
        ctx.setLineDash([5 / zoom, 5 / zoom]);
        ctx.beginPath();
        ctx.arc(screenPos.x, screenPos.y, radius + 8 / zoom, 0, Math.PI * 2);
        ctx.stroke();
        ctx.setLineDash([]);
      }
    }

    // Draw fireballs
    fireballs.forEach(fireball => {
      drawFireball(ctx, fireball, scale);
    });

    ctx.restore();

    // Draw atom info tooltip (outside transform)
    if (selectedAtomId !== null) {
      const selectedAtom = atoms.find(a => a.id === selectedAtomId);
      if (selectedAtom) {
        drawAtomInfo(ctx, selectedAtom, scale * zoom, canvas.width);
      }
    }

    // Draw info overlay
    if (parameters.isLoaded) {
      ctx.fillStyle = 'rgba(0, 255, 100, 0.8)';
      ctx.font = '12px monospace';
      ctx.fillText('ReaxFF Parameters Loaded ✓', 10, 20);
    }

    // Atom count warning
    if (atoms.length >= simulation.atomCountWarning) {
      ctx.fillStyle = 'rgba(255, 200, 50, 0.9)';
      ctx.font = '12px monospace';
      ctx.fillText(`⚠ ${atoms.length} atoms (may affect performance)`, 10, canvas.height - 10);
    }

    // Update status
    if (atoms.length > 0) {
      const player = atoms.find(a => a.id === simulation.playerId);
      if (player) {
        dispatch({
          type: 'SET_STATUS',
          payload: `${player.symbol || 'H'} @ (${player.pos.x.toFixed(1)}, ${player.pos.y.toFixed(1)})`,
        });
      }
    }
  }, [simulation, parameters.isLoaded, dispatch]);

  // Update simulation state
  const update = useCallback(() => {
    if (simulation.isPaused) return;

    // Run physics simulation step (respecting time multiplier)
    for (let i = 0; i < Math.ceil(simulation.timeStepMultiplier); i++) {
      dispatch({ type: 'PHYSICS_STEP' });
    }

    // Update fireballs
    const updatedFireballs = simulation.fireballs
      .map(fb => ({
        ...fb,
        pos: {
          x: fb.pos.x + fb.vel.x,
          y: fb.pos.y + fb.vel.y,
        },
        radius: fb.radius + 0.033,
        time: fb.time + 1,
      }))
      .filter(fb => fb.time < fb.lifetime);

    dispatch({ type: 'UPDATE_FIREBALLS', payload: updatedFireballs });
  }, [simulation.isPaused, simulation.fireballs, simulation.timeStepMultiplier, dispatch]);

  // Screenshot function
  const takeScreenshot = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return null;
    return canvas.toDataURL('image/png');
  }, []);

  // Expose screenshot function
  useEffect(() => {
    if (containerRef.current) {
      containerRef.current.takeScreenshot = takeScreenshot;
    }
  }, [takeScreenshot]);

  // Animation loop
  useAnimationFrame(() => {
    update();
    render();
  });

  return (
    <div 
      ref={containerRef}
      className={`canvas-container ${simulation.isFullscreen ? 'fullscreen' : ''}`}
    >
      <canvas
        ref={canvasRef}
        className="simulation-canvas"
        aria-label="Molecular Dynamics Simulation"
        onWheel={handleWheel}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
        onDoubleClick={handleDoubleClick}
        onContextMenu={handleContextMenu}
      />
      {simulation.isFullscreen && (
        <button 
          className="exit-fullscreen-btn"
          onClick={() => dispatch({ type: 'TOGGLE_FULLSCREEN' })}
        >
          Exit Fullscreen (F)
        </button>
      )}
      <div className="canvas-zoom-indicator">
        {(simulation.zoom * 100).toFixed(0)}%
      </div>
    </div>
  );
}

export default SimulationCanvas;
