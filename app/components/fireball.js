/**
 * Fireball class for visual particle effects
 */
export class Fireball {
  /**
   * Create a fireball
   * @param {World} world - Reference to the world object
   * @param {{x: number, y: number}} pos - Initial position
   * @param {number} startFraction - Starting fraction of lifetime
   */
  constructor(world, pos, startFraction) {
    this.world = world;
    this.pos = { x: pos.x, y: pos.y };
    this.time = Math.floor(30.0 * startFraction);
    this.radius0 = 0.5;
    this.radius = this.radius0;
    this.vel = {
      x: 0.2 * (Math.random() - 0.5),
      y: -0.4 * Math.random()
    };
    this.lifetime = 30.0;
  }

  /**
   * Update fireball state
   */
  step() {
    this.pos.x += this.vel.x;
    this.pos.y += this.vel.y;
    this.radius = this.radius0 + 2.0 * this.radius0 * this.time / this.lifetime;
    this.time++;
  }

  /**
   * Draw the fireball on the canvas
   * @param {CanvasRenderingContext2D} screen - Canvas rendering context
   */
  draw(screen) {
    const x = this.world.scale * this.pos.x;
    const y = this.world.scale * this.pos.y;
    const rad = this.world.scale * this.radius;

    const tau = this.time / this.lifetime;
    if (tau > 1.0) return;

    const tau0 = 0.0;
    const tau1 = 0.25;
    const tau2 = 0.625;
    const tau3 = 1.0;

    if (tau < tau1) {
      const a = (tau - tau0) / (tau1 - tau0);
      const cb = Math.floor(255 * (1.0 - a));
      screen.fillStyle = `rgb(255,255,${cb})`;
    } else if (tau < tau2) {
      const a = (tau - tau1) / (tau2 - tau1);
      const cr = Math.floor(255 + (238 - 255) * a);
      const cg = Math.floor(255 + (80 - 255) * a);
      const ca = 1.0 - 0.5 * a;
      screen.fillStyle = `rgba(${cr},${cg},0,${ca})`;
    } else {
      const a = (tau - tau2) / (tau3 - tau2);
      const cr = Math.floor(238 + (128 - 238) * a);
      const cg = Math.floor(80 + (128 - 80) * a);
      const cb = Math.floor(0 + (140 - 0) * a);
      const ca = 0.5 - 0.5 * a;
      screen.fillStyle = `rgba(${cr},${cg},${cb},${ca})`;
    }

    screen.beginPath();
    screen.arc(x, y, rad, 0, Math.PI * 2, true);
    screen.closePath();
    screen.fill();
  }

  /**
   * Check if fireball is still alive
   * @returns {boolean}
   */
  isAlive() {
    return this.time < this.lifetime;
  }
}

export default Fireball;