/**
 * Canvas Rendering Utilities
 * Functions for drawing atoms and particles on the canvas
 */

/**
 * Draw an atom on the canvas
 * @param {CanvasRenderingContext2D} ctx - Canvas context
 * @param {Object} atom - Atom object
 * @param {number} scale - Scale factor
 * @param {boolean} isPlayer - Whether this is the player atom
 */
export function drawAtom(ctx, atom, scale, isPlayer = false) {
  const x = scale * atom.pos.x;
  const y = scale * atom.pos.y;
  const rad = scale * atom.radius;

  // Create gradient for 3D effect
  const grX0 = x - 0.3 * rad;
  const grY0 = y - 0.3 * rad;
  const gr = ctx.createRadialGradient(grX0, grY0, 0.1 * rad, grX0, grY0, 0.95 * rad);

  if (atom.mass <= 0) {
    // Fixed atom - gray
    gr.addColorStop(0, 'rgb(245,245,245)');
    gr.addColorStop(1, 'rgb(40,40,40)');
  } else if (isPlayer) {
    // Player atom - highlighted
    gr.addColorStop(0, 'rgb(255,220,100)');
    gr.addColorStop(1, 'rgb(200,100,50)');
  } else {
    // Normal atom - purple
    gr.addColorStop(0, 'rgb(245,200,255)');
    gr.addColorStop(1, 'rgb(100,20,140)');
  }

  ctx.fillStyle = gr;
  ctx.beginPath();
  ctx.arc(x, y, rad, 0, Math.PI * 2, true);
  ctx.closePath();
  ctx.fill();

  // Draw highlight ring for player
  if (isPlayer) {
    ctx.strokeStyle = 'rgba(255, 255, 100, 0.5)';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.arc(x, y, rad + 3, 0, Math.PI * 2, true);
    ctx.stroke();
  }
}

/**
 * Draw a fireball particle on the canvas
 * @param {CanvasRenderingContext2D} ctx - Canvas context
 * @param {Object} fireball - Fireball object
 * @param {number} scale - Scale factor
 */
export function drawFireball(ctx, fireball, scale) {
  const x = scale * fireball.pos.x;
  const y = scale * fireball.pos.y;
  const rad = scale * fireball.radius;

  const tau = fireball.time / fireball.lifetime;
  if (tau > 1.0) return;

  const tau1 = 0.25;
  const tau2 = 0.625;

  let fillStyle;

  if (tau < tau1) {
    // White to yellow
    const a = tau / tau1;
    const cb = Math.floor(255 * (1.0 - a));
    fillStyle = `rgb(255,255,${cb})`;
  } else if (tau < tau2) {
    // Yellow to orange with fade
    const a = (tau - tau1) / (tau2 - tau1);
    const cr = Math.floor(255 + (238 - 255) * a);
    const cg = Math.floor(255 + (80 - 255) * a);
    const ca = 1.0 - 0.5 * a;
    fillStyle = `rgba(${cr},${cg},0,${ca})`;
  } else {
    // Orange to gray/smoke with fade
    const a = (tau - tau2) / (1.0 - tau2);
    const cr = Math.floor(238 + (128 - 238) * a);
    const cg = Math.floor(80 + (128 - 80) * a);
    const cb = Math.floor(0 + (140 - 0) * a);
    const ca = 0.5 - 0.5 * a;
    fillStyle = `rgba(${cr},${cg},${cb},${ca})`;
  }

  ctx.fillStyle = fillStyle;
  ctx.beginPath();
  ctx.arc(x, y, rad, 0, Math.PI * 2, true);
  ctx.closePath();
  ctx.fill();
}

/**
 * Draw bond between two atoms
 * @param {CanvasRenderingContext2D} ctx - Canvas context
 * @param {Object} atom1 - First atom
 * @param {Object} atom2 - Second atom
 * @param {number} scale - Scale factor
 * @param {number} bondOrder - Bond order (1-3)
 */
export function drawBond(ctx, atom1, atom2, scale, bondOrder = 1) {
  const x1 = scale * atom1.pos.x;
  const y1 = scale * atom1.pos.y;
  const x2 = scale * atom2.pos.x;
  const y2 = scale * atom2.pos.y;

  ctx.strokeStyle = 'rgba(200, 200, 200, 0.6)';
  ctx.lineWidth = bondOrder * 2;

  ctx.beginPath();
  ctx.moveTo(x1, y1);
  ctx.lineTo(x2, y2);
  ctx.stroke();
}

export default {
  drawAtom,
  drawFireball,
  drawBond,
};
