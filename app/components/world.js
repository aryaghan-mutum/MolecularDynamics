import { Atom } from './atom.js';
import { Fireball } from './fireball.js';
import {
  TIMESTAMP_IN_FEMPTO_SEC,
  TIMESTEP_IN_SIMULATION_UNIT,
  THRUST,
  WALL_SPRING,
  EPS,
  MAX_VEL,
  EMPTY_STRING,
  ID,
  CONTEXT_ID
} from '../config/constants.js';

/**
 * Keyboard handler for user input
 */
class Keyboarder {
  constructor() {
    this.keyState = {};
    this.KEYS = {
      LEFT: 37,
      RIGHT: 39,
      SPACE: 32,
      UP: 38,
      DOWN: 40
    };

    window.addEventListener('keydown', (e) => {
      this.keyState[e.keyCode] = true;
    });

    window.addEventListener('keyup', (e) => {
      this.keyState[e.keyCode] = false;
    });
  }

  isDown(keyCode) {
    return this.keyState[keyCode] === true;
  }
}

/**
 * World class managing the molecular dynamics simulation environment
 */
export class World {
  constructor(canvasId = 'screen') {
    const canvas = document.getElementById(canvasId);
    if (!canvas) {
      throw new Error(`Canvas element with id "${canvasId}" not found`);
    }
    
    this.screen = canvas.getContext(CONTEXT_ID);

    // Scale and size
    this.scale = 20.0;
    this.size = {
      x: this.screen.canvas.width / this.scale,
      y: this.screen.canvas.height / this.scale,
      z: this.screen.canvas.height / this.scale
    };

    // Simulation parameters
    this.timestep = TIMESTAMP_IN_FEMPTO_SEC;
    this.dt = TIMESTEP_IN_SIMULATION_UNIT * this.timestep;
    this.dt2 = this.dt * this.dt;
    this.thrust = THRUST;
    this.wallSpring = WALL_SPRING;
    this.eps = EPS;
    this.maxVel = MAX_VEL;
    this.statusText = EMPTY_STRING;
    this.id = ID;
    this.clear = true;
    this.time = 0;

    // Bond order related properties
    this.bond_order = null;
    this.bond_order_sigma = null;
    this.bond_order_pi = null;
    this.bond_order_pi2 = null;
    this.rij = null;
    
    // Force field parameters
    this.paramGeneral = null;
    this.onebody_parameters = null;
    this.twobody_parameters = null;
    this.threebody_parameters = null;
    this.fourbody_parameters = null;
    
    // Energy calculation arrays
    this.deltap_i = null;
    this.deltap_boc = null;
    this.deltap = null;
    this.deltap_i_lp = null;
    this.vlpex = null;
    this.n_lp = null;
    this.dDeltap_i_lp = null;
    this.delta_i = null;
    this.BOA_ij = null;
    this.BOA_jk = null;
    this.BO_s_corr = null;
    this.BO_pi_corr = null;
    this.BO_pi2_corr = null;

    // Initialize collections
    this.atoms = [];
    this.fireballs = [];
    this.player = null;

    // Setup input handler
    this.keyboarder = new Keyboarder();

    // Initialize simulation
    this.setup();

    // Start animation loop
    this._startAnimationLoop();
  }

  /**
   * Start the main animation loop
   * @private
   */
  _startAnimationLoop() {
    const tick = () => {
      this.update();
      this.draw(this.screen);
      requestAnimationFrame(tick);
    };
    tick();
  }

  /**
   * Main update loop
   */
  update() {
    // Zero all forces
    for (const atom of this.atoms) {
      atom.resetForces();
    }

    // Handle user input
    this._handleInput();

    // Calculate interactions
    // NOTE: Bond order and energy calculations can be enabled here
    // this._calculateBondOrders();
    // this._calculateInteractions();

    // Update atom positions
    // for (const atom of this.atoms) {
    //   atom.step();
    // }

    // Update status text
    if (this.atoms.length > 0) {
      this.statusText = `${this.atoms[0].pos.x.toFixed(2)} ${this.atoms[0].pos.y.toFixed(2)} ${this.atoms[0].pos.z.toFixed(2)}`;
    }

    // Update fireballs
    this._updateFireballs();

    // Update display
    const statusElement = document.getElementById('status');
    if (statusElement) {
      statusElement.innerHTML = this.statusText;
    }

    this.time++;
  }

  /**
   * Handle keyboard input
   * @private
   */
  _handleInput() {
    if (!this.player) return;

    if (this.keyboarder.isDown(this.keyboarder.KEYS.LEFT)) {
      this.player.force.x -= this.thrust;
      this.shootFireball(this.player, 0.1, 0.0);
    }
    if (this.keyboarder.isDown(this.keyboarder.KEYS.RIGHT)) {
      this.player.force.x += this.thrust;
      this.shootFireball(this.player, -0.1, 0.0);
    }
    if (this.keyboarder.isDown(this.keyboarder.KEYS.UP)) {
      this.player.force.y -= this.thrust;
      this.shootFireball(this.player, 0.0, 0.1);
    }
    if (this.keyboarder.isDown(this.keyboarder.KEYS.DOWN)) {
      this.player.force.y += this.thrust;
      this.shootFireball(this.player, 0.0, -0.1);
    }

    this.statusText += ` thrust: ${this.player.force.x} ${this.player.force.y}`;
  }

  /**
   * Update fireballs
   * @private
   */
  _updateFireballs() {
    this.fireballs = this.fireballs.filter(fireball => {
      if (fireball.step) {
        fireball.step();
        return fireball.isAlive();
      }
      return false;
    });
  }

  /**
   * Setup initial simulation state
   */
  setup() {
    this.id = 0;
    this.time = 0;
    this.atoms = [];
    this.fireballs = [];

    // Add ozone molecule
    this.addAtom(0.0, 0.0, 0.0, 2);
    this.player = this.atoms[this.atoms.length - 1];
    this.player.jump = 0;
    
    this.addAtom(1.2, 0.0, 0.0, 2);
    this.addAtom(2.0, 0.8, 0.0, 2);
  }

  /**
   * Draw the simulation
   * @param {CanvasRenderingContext2D} screen - Canvas context
   */
  draw(screen) {
    if (this.clear) {
      screen.clearRect(0, 0, screen.canvas.width, screen.canvas.height);
    }

    // Draw boundary
    screen.strokeStyle = 'white';
    screen.strokeRect(0, 0, this.size.x * this.scale, this.size.y * this.scale);

    // Draw atoms
    for (const atom of this.atoms) {
      if (atom.draw) {
        atom.draw(screen);
      }
    }

    // Draw fireballs
    for (const fireball of this.fireballs) {
      if (fireball.draw) {
        fireball.draw(screen);
      }
    }
  }

  /**
   * Add an atom to the simulation
   * @param {number} x - X position
   * @param {number} y - Y position
   * @param {number} z - Z position
   * @param {number} type - Atom type
   */
  addAtom(x, y, z, type) {
    const atom = new Atom(this, this.id, x, y, z, type);
    this.atoms.push(atom);
    this.id++;
  }

  /**
   * Toggle clear mode
   */
  toggleClear() {
    this.clear = !this.clear;
  }

  /**
   * Shoot a fireball from an atom
   * @param {Atom} atom - Source atom
   * @param {number} vx - X velocity
   * @param {number} vy - Y velocity
   */
  shootFireball(atom, vx, vy) {
    const v = Math.sqrt(vx * vx + vy * vy);
    const x = atom.pos.x + 0.4 * atom.radius * (Math.random() - 0.5) + 0.8 * vx / v * atom.radius;
    const y = atom.pos.y + 0.4 * atom.radius * (Math.random() - 0.5) + 0.8 * vy / v * atom.radius;
    
    const fireball = new Fireball(this, { x, y }, 0.0);
    fireball.vel.x += vx;
    fireball.vel.y += vy;
    this.fireballs.push(fireball);
  }

  /**
   * Remove an atom from the simulation
   * @param {Atom} atom - Atom to remove
   */
  removeAtom(atom) {
    const atomIndex = this.atoms.indexOf(atom);
    if (atomIndex !== -1) {
      this.atoms.splice(atomIndex, 1);
    }
  }

  /**
   * Delete an atom by index
   * @param {number} atomIndex - Index of atom to delete
   */
  deleteAtom(atomIndex) {
    if (atomIndex >= 0 && atomIndex < this.atoms.length) {
      this.atoms.splice(atomIndex, 1);
    }
  }

  /**
   * Set force field parameters from file reader
   * @param {number} rij - Distance parameter
   * @param {Object} paramGeneral - General parameters
   * @param {Array} onebody_parameters - One-body parameters
   * @param {Array} twobody_parameters - Two-body parameters
   * @param {Array} threebody_parameters - Three-body parameters
   * @param {Array} fourbody_parameters - Four-body parameters
   */
  setParameters(rij, paramGeneral, onebody_parameters, twobody_parameters, threebody_parameters, fourbody_parameters) {
    this.rij = rij;
    this.paramGeneral = paramGeneral;
    this.onebody_parameters = onebody_parameters;
    this.twobody_parameters = twobody_parameters;
    this.threebody_parameters = threebody_parameters;
    this.fourbody_parameters = fourbody_parameters;
  }
}

export default World;