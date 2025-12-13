import { DEFAULT_ATOM_RADIUS, DEFAULT_ATOM_MASS, LJ_SIGMA, LJ_EPSILON } from '../config/constants.js';

/**
 * Atom class representing a single atom in the molecular dynamics simulation
 */
export class Atom {
  /**
   * Create an atom
   * @param {World} world - Reference to the world object
   * @param {number} id - Unique identifier
   * @param {number} x - X position
   * @param {number} y - Y position
   * @param {number} z - Z position
   * @param {number} type - Atom type (1=Carbon, 2=Hydrogen, 3=Oxygen)
   */
  constructor(world, id, x, y, z, type) {
    this.world = world;
    this.id = id;
    this.type = type;
    
    this.pos = { x, y, z };
    this.vel = { x: 0, y: 0, z: 0 };
    this.force = { x: 0, y: 0, z: 0 };
    
    this.radius = DEFAULT_ATOM_RADIUS;
    this.mass = DEFAULT_ATOM_MASS;
    this.onFire = false;
    
    // Legacy properties for backward compatibility
    this.x = x;
    this.y = y;
    this.z = z;
  }

  /**
   * Calculate Lennard-Jones interaction with another atom
   * @param {Atom} atom - The other atom
   */
  interact(atom) {
    if (this.mass < 0.0 && atom.mass < 0.0) return;

    const dx = this.pos.x - atom.pos.x;
    const dy = this.pos.y - atom.pos.y;
    const dz = this.pos.z - atom.pos.z;
    const distance = Math.sqrt(dx * dx + dy * dy + dz * dz);

    // Lennard-Jones interaction
    const sigma6 = Math.pow(LJ_SIGMA, 6.0);
    const dist14 = Math.pow(distance, 14.0);
    const dist8 = Math.pow(distance, 8.0);
    const force1 = LJ_EPSILON * (sigma6 * sigma6 / dist14 - sigma6 / dist8);

    this.force.x += dx * force1;
    this.force.y += dy * force1;
    this.force.z += dz * force1;
    atom.force.x -= dx * force1;
    atom.force.y -= dy * force1;
    atom.force.z -= dz * force1;
  }

  /**
   * Perform integration step for atom motion
   */
  step() {
    // Ignore fixed atoms
    if (this.mass <= 0.0) return;

    // Barrier forces
    this._applyBoundaryForces();

    // Velocity update
    this.vel.x += (this.force.x / this.mass) * this.world.dt;
    this.vel.y += (this.force.y / this.mass) * this.world.dt;
    this.vel.z += (this.force.z / this.mass) * this.world.dt;

    // Velocity clipping
    this._clipVelocity();

    // Position update (Leap frog integration)
    this.pos.x += this.vel.x * this.world.dt;
    this.pos.y += this.vel.y * this.world.dt;
    this.pos.z += this.vel.z * this.world.dt;
  }

  /**
   * Apply boundary barrier forces
   * @private
   */
  _applyBoundaryForces() {
    const { wallSpring, size } = this.world;

    if (this.pos.x - this.radius < 0.0) {
      this.force.x += -wallSpring * (this.pos.x - this.radius);
    } else if (this.pos.x + this.radius > size.x) {
      this.force.x += -wallSpring * (this.pos.x + this.radius - size.x);
    }

    if (this.pos.y - this.radius < 0.0) {
      this.force.y += -wallSpring * (this.pos.y - this.radius);
    } else if (this.pos.y + this.radius > size.y) {
      this.force.y += -wallSpring * (this.pos.y + this.radius - size.y);
    }

    if (this.pos.z - this.radius < 0.0) {
      this.force.z += -wallSpring * (this.pos.z - this.radius);
    } else if (this.pos.z + this.radius > size.z) {
      this.force.z += -wallSpring * (this.pos.z + this.radius - size.z);
    }
  }

  /**
   * Clip velocity to maximum allowed value
   * @private
   */
  _clipVelocity() {
    const { maxVel } = this.world;

    this.vel.x = Math.max(-maxVel, Math.min(maxVel, this.vel.x));
    this.vel.y = Math.max(-maxVel, Math.min(maxVel, this.vel.y));
    this.vel.z = Math.max(-maxVel, Math.min(maxVel, this.vel.z));
  }

  /**
   * Draw the atom on the canvas
   * @param {CanvasRenderingContext2D} screen - Canvas rendering context
   */
  draw(screen) {
    if (this.mass > 0) {
      this._drawSphere(screen, false);
    } else {
      this._drawSphere(screen, true);
    }
  }

  /**
   * Draw a sphere representation of the atom
   * @param {CanvasRenderingContext2D} screen - Canvas context
   * @param {boolean} isGray - Whether to draw in grayscale
   * @private
   */
  _drawSphere(screen, isGray = false) {
    const x = this.world.scale * this.pos.x;
    const y = this.world.scale * this.pos.y;
    const rad = this.world.scale * this.radius;
    
    const grX0 = x - 0.3 * rad;
    const grY0 = y - 0.3 * rad;
    
    const gr = screen.createRadialGradient(grX0, grY0, 0.1 * rad, grX0, grY0, 0.95 * rad);
    
    if (isGray) {
      gr.addColorStop(0, 'rgb(245,245,245)');
      gr.addColorStop(1, 'rgb(40,40,40)');
    } else {
      gr.addColorStop(0, 'rgb(245,200,255)');
      gr.addColorStop(1, 'rgb(100,20,140)');
    }
    
    screen.fillStyle = gr;
    screen.beginPath();
    screen.arc(x, y, rad, 0, Math.PI * 2, true);
    screen.closePath();
    screen.fill();
  }

  /**
   * Zero all forces on this atom
   */
  resetForces() {
    this.force.x = 0.0;
    this.force.y = 0.0;
    this.force.z = 0.0;
  }
}

export default Atom;