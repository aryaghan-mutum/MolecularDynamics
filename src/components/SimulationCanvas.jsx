import { useRef, useEffect, useCallback } from 'react';
import { useSimulation, useSimulationDispatch } from '../context/SimulationContext';
import { useParameters } from '../context/ParametersContext';
import { useAnimationFrame } from '../hooks/useAnimationFrame';
import { useKeyboard } from '../hooks/useKeyboard';
import { drawAtom, drawFireball, drawBond } from '../utils/renderer';
import './SimulationCanvas.css';

/**
 * Simulation Canvas Component
 * Renders the molecular dynamics simulation using HTML5 Canvas
 */
function SimulationCanvas() {
  const canvasRef = useRef(null);
  const simulation = useSimulation();
  const parameters = useParameters();
  const dispatch = useSimulationDispatch();
  const keys = useKeyboard();

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

  // Handle keyboard input
  useEffect(() => {
    if (simulation.isPaused || simulation.playerId === null) return;

    const playerAtom = simulation.atoms.find(a => a.id === simulation.playerId);
    if (!playerAtom) return;

    let forceX = 0;
    let forceY = 0;

    if (keys.ArrowLeft) forceX -= simulation.thrust;
    if (keys.ArrowRight) forceX += simulation.thrust;
    if (keys.ArrowUp) forceY -= simulation.thrust;
    if (keys.ArrowDown) forceY += simulation.thrust;

    if (forceX !== 0 || forceY !== 0) {
      dispatch({
        type: 'SET_PLAYER_FORCE',
        payload: { x: forceX, y: forceY },
      });

      // Add fireball effect
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
    }
  }, [keys, simulation.isPaused, simulation.playerId, simulation.atoms, simulation.thrust, dispatch]);

  // Render function
  const render = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    const { atoms, bonds, fireballs, clearScreen, scale, size, showBonds } = simulation;

    // Clear canvas
    if (clearScreen) {
      ctx.fillStyle = '#0a0a12';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
    }

    // Draw boundary
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.3)';
    ctx.lineWidth = 2;
    ctx.strokeRect(2, 2, size.x * scale - 4, size.y * scale - 4);

    // Draw bonds first (behind atoms)
    if (showBonds && bonds) {
      bonds.forEach(bond => {
        const atom1 = atoms.find(a => a.id === bond.atom1Id);
        const atom2 = atoms.find(a => a.id === bond.atom2Id);
        if (atom1 && atom2) {
          drawBond(ctx, atom1, atom2, bond.order, scale);
        }
      });
    }

    // Draw atoms
    atoms.forEach(atom => {
      drawAtom(ctx, atom, scale, atom.id === simulation.playerId);
    });

    // Draw fireballs
    fireballs.forEach(fireball => {
      drawFireball(ctx, fireball, scale);
    });

    // Draw info overlay
    if (parameters.isLoaded) {
      ctx.fillStyle = 'rgba(0, 255, 100, 0.8)';
      ctx.font = '12px monospace';
      ctx.fillText('ReaxFF Parameters Loaded ✓', 10, 20);
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

    // Run physics simulation step
    dispatch({ type: 'PHYSICS_STEP' });

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
  }, [simulation.isPaused, simulation.fireballs, dispatch]);

  // Animation loop
  useAnimationFrame(() => {
    update();
    render();
  });

  return (
    <div className="canvas-container">
      <canvas
        ref={canvasRef}
        className="simulation-canvas"
        aria-label="Molecular Dynamics Simulation"
      />
    </div>
  );
}

export default SimulationCanvas;
