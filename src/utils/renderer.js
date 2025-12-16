/**
 * Canvas Rendering Utilities - Functional Style
 * Functions for drawing atoms, bonds, and particles on the canvas
 */

// ============================================================================
// CONSTANTS
// ============================================================================

/** Maximum velocity for color scaling (units per timestep) */
const MAX_VELOCITY_FOR_COLOR = 5.0;

/** Atom colors by type - CPK (Corey-Pauling-Koltun) coloring scheme */
const ATOM_COLORS = Object.freeze({
  1: Object.freeze({ main: '#222222', light: '#555555' }),  // Carbon - dark charcoal gray
  2: Object.freeze({ main: '#FFFFFF', light: '#FFFFFF' }),  // Hydrogen - white
  3: Object.freeze({ main: '#FF0D0D', light: '#FF6666' }),  // Oxygen - bright red
  4: Object.freeze({ main: '#3050F8', light: '#7090FF' }),  // Nitrogen - deep blue
  5: Object.freeze({ main: '#FFFF30', light: '#FFFF80' }),  // Sulfur - yellow
  6: Object.freeze({ main: '#FF8000', light: '#FFAA55' }),  // Phosphorus - orange
  7: Object.freeze({ main: '#1FF01F', light: '#80FF80' }),  // Chlorine - bright green
  8: Object.freeze({ main: '#A62929', light: '#CC5555' }),  // Bromine - dark red
  9: Object.freeze({ main: '#940094', light: '#CC55CC' }),  // Iodine - purple
  10: Object.freeze({ main: '#B6B6B6', light: '#E0E0E0' }), // Silicon - light gray
  11: Object.freeze({ main: '#8F40D4', light: '#B080E0' }), // Boron - peach/purple
  12: Object.freeze({ main: '#2194D6', light: '#66BBEE' }), // Fluorine - cyan
});

/** Default color for unknown atom types */
const DEFAULT_COLOR = Object.freeze({ main: '#ffffff', light: '#ffffff' });

// ============================================================================
// PURE HELPER FUNCTIONS - Color Manipulation
// ============================================================================

/**
 * Parse hex color to RGB components
 * @param {string} color - Hex color string (#RRGGBB)
 * @returns {Object} RGB components
 */
const parseHexColor = (color) => {
  const hex = color.replace('#', '');
  return {
    r: parseInt(hex.substr(0, 2), 16),
    g: parseInt(hex.substr(2, 2), 16),
    b: parseInt(hex.substr(4, 2), 16),
  };
};

/**
 * Clamp a value between 0 and 255
 */
const clampColor = (value) => Math.max(0, Math.min(255, Math.round(value)));

/**
 * Format RGB values as CSS string
 */
const toRgbString = (r, g, b) => `rgb(${clampColor(r)}, ${clampColor(g)}, ${clampColor(b)})`;

/**
 * Lighten a color by a given amount
 * @param {string} color - Hex color string
 * @param {number} amount - Amount to lighten (0-1)
 * @returns {string} RGB color string
 */
const lightenColor = (color, amount) => {
  const { r, g, b } = parseHexColor(color);
  return toRgbString(
    r + 255 * amount,
    g + 255 * amount,
    b + 255 * amount
  );
};

/**
 * Darken a color by a given amount
 * @param {string} color - Hex color string
 * @param {number} amount - Amount to darken (0-1)
 * @returns {string} RGB color string
 */
const darkenColor = (color, amount) => {
  const { r, g, b } = parseHexColor(color);
  const factor = 1 - amount;
  return toRgbString(r * factor, g * factor, b * factor);
};

/**
 * Get color based on velocity magnitude (blue=slow, green=medium, red=fast)
 * @param {number} velocity - Velocity magnitude
 * @returns {string} Hex color string
 */
export const velocityToColor = (velocity) => {
  // Use absolute value and normalize to 0-1 range
  const absVelocity = Math.abs(velocity);
  const normalized = Math.min(Math.max(absVelocity / MAX_VELOCITY_FOR_COLOR, 0), 1);
  
  // Color gradient: blue (0) -> cyan (0.25) -> green (0.5) -> yellow (0.75) -> red (1)
  let r, g, b;
  
  if (normalized < 0.25) {
    // Blue to Cyan
    const t = normalized / 0.25;
    r = 0;
    g = Math.round(255 * t);
    b = 255;
  } else if (normalized < 0.5) {
    // Cyan to Green
    const t = (normalized - 0.25) / 0.25;
    r = 0;
    g = 255;
    b = Math.round(255 * (1 - t));
  } else if (normalized < 0.75) {
    // Green to Yellow
    const t = (normalized - 0.5) / 0.25;
    r = Math.round(255 * t);
    g = 255;
    b = 0;
  } else {
    // Yellow to Red
    const t = (normalized - 0.75) / 0.25;
    r = 255;
    g = Math.round(255 * (1 - t));
    b = 0;
  }
  
  return `#${r.toString(16).padStart(2, '0')}${g.toString(16).padStart(2, '0')}${b.toString(16).padStart(2, '0')}`;
};

/**
 * Draw motion trail for an atom
 * @param {CanvasRenderingContext2D} ctx - Canvas context
 * @param {Array} positions - Array of {x, y} positions (oldest first)
 * @param {string} color - Base color for the trail
 * @param {number} scale - Scale factor
 * @param {number} radius - Atom radius
 */
export const drawMotionTrail = (ctx, positions, color, scale, radius) => {
  if (!positions || positions.length < 2) return;
  
  ctx.save();
  
  const trailRadius = radius * scale * 0.3;
  
  positions.forEach((pos, i) => {
    // Calculate alpha based on position in trail (older = more transparent)
    const alpha = (i / positions.length) * 0.4;
    const size = trailRadius * (0.3 + 0.7 * (i / positions.length));
    
    ctx.fillStyle = color;
    ctx.globalAlpha = alpha;
    ctx.beginPath();
    ctx.arc(pos.x * scale, pos.y * scale, size, 0, Math.PI * 2);
    ctx.fill();
  });
  
  ctx.restore();
};

// ============================================================================
// PURE HELPER FUNCTIONS - Geometry
// ============================================================================

/**
 * Calculate screen position from simulation position
 */
const toScreenPos = (pos, scale) => ({
  x: scale * pos.x,
  y: scale * pos.y,
});

/**
 * Calculate gradient offset position
 */
const gradientOffset = (pos, radius, offsetFactor = 0.3) => ({
  x: pos.x - offsetFactor * radius,
  y: pos.y - offsetFactor * radius,
});

// ============================================================================
// DRAWING FUNCTIONS - Side effects contained
// ============================================================================

/**
 * Draw a bond between two atoms
 * @param {CanvasRenderingContext2D} ctx - Canvas context
 * @param {Object} atom1 - First atom
 * @param {Object} atom2 - Second atom
 * @param {number} bondOrder - Bond order (0-1)
 * @param {number} scale - Scale factor
 */
export const drawBond = (ctx, atom1, atom2, bondOrder, scale) => {
  const pos1 = toScreenPos(atom1.pos, scale);
  const pos2 = toScreenPos(atom2.pos, scale);
  
  const alpha = Math.min(1, bondOrder * 1.5);
  const lineWidth = 2 + bondOrder * 4;
  
  // Create gradient for bond coloring
  const gradient = ctx.createLinearGradient(pos1.x, pos1.y, pos2.x, pos2.y);
  const color1 = atom1.color || DEFAULT_COLOR.main;
  const color2 = atom2.color || DEFAULT_COLOR.main;
  
  gradient.addColorStop(0, color1);
  gradient.addColorStop(1, color2);
  
  // Draw bond line
  ctx.save();
  ctx.strokeStyle = gradient;
  ctx.lineWidth = lineWidth;
  ctx.globalAlpha = alpha;
  ctx.lineCap = 'round';
  
  ctx.beginPath();
  ctx.moveTo(pos1.x, pos1.y);
  ctx.lineTo(pos2.x, pos2.y);
  ctx.stroke();
  ctx.restore();
};

/**
 * Create radial gradient for atom
 */
const createAtomGradient = (ctx, screenPos, radius, mainColor, isPlayer, isFixed) => {
  const offset = gradientOffset(screenPos, radius);
  const gradient = ctx.createRadialGradient(
    offset.x, offset.y, 0.1 * radius,
    offset.x, offset.y, 0.95 * radius
  );
  
  if (isFixed) {
    gradient.addColorStop(0, 'rgb(245,245,245)');
    gradient.addColorStop(1, 'rgb(40,40,40)');
  } else if (isPlayer) {
    gradient.addColorStop(0, '#ffffcc');
    gradient.addColorStop(0.5, mainColor);
    gradient.addColorStop(1, darkenColor(mainColor, 0.5));
  } else {
    gradient.addColorStop(0, lightenColor(mainColor, 0.4));
    gradient.addColorStop(1, darkenColor(mainColor, 0.3));
  }
  
  return gradient;
};

/**
 * Draw atom circle - Side effect function
 */
const drawAtomCircle = (ctx, screenPos, radius, gradient) => {
  ctx.fillStyle = gradient;
  ctx.beginPath();
  ctx.arc(screenPos.x, screenPos.y, radius, 0, Math.PI * 2, true);
  ctx.closePath();
  ctx.fill();
};

/**
 * Draw player highlight ring - Side effect function
 */
const drawPlayerHighlight = (ctx, screenPos, radius) => {
  ctx.strokeStyle = 'rgba(255, 255, 100, 0.7)';
  ctx.lineWidth = 3;
  ctx.beginPath();
  ctx.arc(screenPos.x, screenPos.y, radius + 4, 0, Math.PI * 2, true);
  ctx.stroke();
};

/**
 * Draw atom symbol text - Side effect function
 */
const drawAtomSymbol = (ctx, screenPos, radius, symbol, atomType) => {
  ctx.fillStyle = atomType === 2 ? '#333' : '#fff';
  ctx.font = `bold ${Math.max(10, radius * 0.7)}px Arial`;
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText(symbol, screenPos.x, screenPos.y);
};

/**
 * Draw velocity vector arrow for an atom
 */
export const drawVelocityVector = (ctx, atom, scale, zoom = 1) => {
  const screenPos = toScreenPos(atom.pos, scale);
  const velMag = Math.sqrt(atom.vel.x ** 2 + atom.vel.y ** 2);
  
  if (velMag < 0.01) return; // Don't draw tiny vectors
  
  const arrowLength = Math.min(velMag * scale * 10, 50) * zoom;
  const angle = Math.atan2(atom.vel.y, atom.vel.x);
  
  const endX = screenPos.x + Math.cos(angle) * arrowLength;
  const endY = screenPos.y + Math.sin(angle) * arrowLength;
  
  ctx.save();
  ctx.strokeStyle = 'rgba(255, 200, 50, 0.8)';
  ctx.fillStyle = 'rgba(255, 200, 50, 0.8)';
  ctx.lineWidth = 2;
  
  // Draw line
  ctx.beginPath();
  ctx.moveTo(screenPos.x, screenPos.y);
  ctx.lineTo(endX, endY);
  ctx.stroke();
  
  // Draw arrowhead
  const headLength = 8;
  const headAngle = Math.PI / 6;
  ctx.beginPath();
  ctx.moveTo(endX, endY);
  ctx.lineTo(
    endX - headLength * Math.cos(angle - headAngle),
    endY - headLength * Math.sin(angle - headAngle)
  );
  ctx.lineTo(
    endX - headLength * Math.cos(angle + headAngle),
    endY - headLength * Math.sin(angle + headAngle)
  );
  ctx.closePath();
  ctx.fill();
  ctx.restore();
};

/**
 * Draw bond with optional length label
 */
export const drawBondWithLength = (ctx, atom1, atom2, bondOrder, scale, showLength = false) => {
  const pos1 = toScreenPos(atom1.pos, scale);
  const pos2 = toScreenPos(atom2.pos, scale);
  
  const alpha = Math.min(1, bondOrder * 1.5);
  const lineWidth = 2 + bondOrder * 4;
  
  // Create gradient for bond coloring
  const gradient = ctx.createLinearGradient(pos1.x, pos1.y, pos2.x, pos2.y);
  const color1 = atom1.color || DEFAULT_COLOR.main;
  const color2 = atom2.color || DEFAULT_COLOR.main;
  
  gradient.addColorStop(0, color1);
  gradient.addColorStop(1, color2);
  
  // Draw bond line
  ctx.save();
  ctx.strokeStyle = gradient;
  ctx.lineWidth = lineWidth;
  ctx.globalAlpha = alpha;
  ctx.lineCap = 'round';
  
  ctx.beginPath();
  ctx.moveTo(pos1.x, pos1.y);
  ctx.lineTo(pos2.x, pos2.y);
  ctx.stroke();
  ctx.restore();
  
  // Draw length label if enabled
  if (showLength) {
    const dx = atom2.pos.x - atom1.pos.x;
    const dy = atom2.pos.y - atom1.pos.y;
    const distance = Math.sqrt(dx * dx + dy * dy);
    
    const midX = (pos1.x + pos2.x) / 2;
    const midY = (pos1.y + pos2.y) / 2;
    
    ctx.save();
    ctx.fillStyle = 'rgba(255, 255, 255, 0.9)';
    ctx.font = '10px monospace';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    
    // Background for better readability
    const text = distance.toFixed(2) + 'Å';
    const textWidth = ctx.measureText(text).width;
    ctx.fillStyle = 'rgba(0, 0, 0, 0.6)';
    ctx.fillRect(midX - textWidth / 2 - 2, midY - 7, textWidth + 4, 14);
    
    ctx.fillStyle = 'rgba(200, 255, 200, 0.9)';
    ctx.fillText(text, midX, midY);
    ctx.restore();
  }
};

/**
 * Draw selection highlight for selected atom
 */
export const drawAtomSelection = (ctx, atom, scale) => {
  const screenPos = toScreenPos(atom.pos, scale);
  const radius = scale * atom.radius;
  
  ctx.save();
  ctx.strokeStyle = 'rgba(100, 200, 255, 0.9)';
  ctx.lineWidth = 3;
  ctx.setLineDash([5, 5]);
  ctx.beginPath();
  ctx.arc(screenPos.x, screenPos.y, radius + 8, 0, Math.PI * 2);
  ctx.stroke();
  ctx.setLineDash([]);
  ctx.restore();
};

/**
 * Draw atom info tooltip
 */
export const drawAtomInfo = (ctx, atom, scale, canvasWidth) => {
  const screenPos = toScreenPos(atom.pos, scale);
  
  const lines = [
    `${atom.name} (${atom.symbol})`,
    `ID: ${atom.id}`,
    `Pos: (${atom.pos.x.toFixed(2)}, ${atom.pos.y.toFixed(2)})`,
    `Vel: ${Math.sqrt(atom.vel.x ** 2 + atom.vel.y ** 2).toFixed(3)}`,
    `Mass: ${atom.mass.toFixed(2)}`,
  ];
  
  ctx.save();
  ctx.font = '11px monospace';
  const maxWidth = Math.max(...lines.map(l => ctx.measureText(l).width));
  const padding = 8;
  const lineHeight = 16;
  const boxWidth = maxWidth + padding * 2;
  const boxHeight = lines.length * lineHeight + padding * 2;
  
  // Position tooltip
  let tooltipX = screenPos.x + 20;
  let tooltipY = screenPos.y - boxHeight / 2;
  
  // Keep within canvas bounds
  if (tooltipX + boxWidth > canvasWidth) {
    tooltipX = screenPos.x - boxWidth - 20;
  }
  
  // Background
  ctx.fillStyle = 'rgba(20, 20, 40, 0.9)';
  ctx.strokeStyle = 'rgba(100, 200, 255, 0.5)';
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.roundRect(tooltipX, tooltipY, boxWidth, boxHeight, 6);
  ctx.fill();
  ctx.stroke();
  
  // Text
  ctx.fillStyle = '#fff';
  ctx.textAlign = 'left';
  ctx.textBaseline = 'top';
  lines.forEach((line, i) => {
    ctx.fillText(line, tooltipX + padding, tooltipY + padding + i * lineHeight);
  });
  
  ctx.restore();
};

/**
 * Draw an atom on the canvas - Composed function
 * @param {CanvasRenderingContext2D} ctx - Canvas context
 * @param {Object} atom - Atom object
 * @param {number} scale - Scale factor
 * @param {boolean} isPlayer - Whether this is the player atom
 * @param {boolean} showLabel - Whether to show atom label
 * @param {boolean} colorByVelocity - Whether to color by velocity
 */
export const drawAtom = (ctx, atom, scale, isPlayer = false, showLabel = true, colorByVelocity = false) => {
  const screenPos = toScreenPos(atom.pos, scale);
  const radius = scale * atom.radius;
  
  // Get colors based on atom type or velocity
  let mainColor;
  if (colorByVelocity) {
    const velocity = Math.sqrt(atom.vel.x ** 2 + atom.vel.y ** 2);
    mainColor = velocityToColor(velocity);
  } else {
    const colors = ATOM_COLORS[atom.type] || DEFAULT_COLOR;
    mainColor = atom.color || colors.main;
  }
  
  // Create gradient and draw atom
  const isFixed = atom.mass <= 0;
  const gradient = createAtomGradient(ctx, screenPos, radius, mainColor, isPlayer, isFixed);
  
  drawAtomCircle(ctx, screenPos, radius, gradient);
  
  // Draw player highlight
  if (isPlayer) {
    drawPlayerHighlight(ctx, screenPos, radius);
  }
  
  // Draw atom symbol
  if (showLabel && atom.symbol && radius > 15) {
    drawAtomSymbol(ctx, screenPos, radius, atom.symbol, atom.type);
  }
};

/**
 * Calculate fireball color based on lifetime
 */
const calculateFireballColor = (tau) => {
  const tau1 = 0.25;
  const tau2 = 0.625;
  
  if (tau < tau1) {
    // White to yellow
    const a = tau / tau1;
    const cb = Math.floor(255 * (1.0 - a));
    return `rgb(255,255,${cb})`;
  }
  
  if (tau < tau2) {
    // Yellow to orange with fade
    const a = (tau - tau1) / (tau2 - tau1);
    const cr = Math.floor(255 + (238 - 255) * a);
    const cg = Math.floor(255 + (80 - 255) * a);
    const ca = 1.0 - 0.5 * a;
    return `rgba(${cr},${cg},0,${ca})`;
  }
  
  // Orange to gray/smoke with fade
  const a = (tau - tau2) / (1.0 - tau2);
  const cr = Math.floor(238 + (128 - 238) * a);
  const cg = Math.floor(80 + (128 - 80) * a);
  const cb = Math.floor(0 + (140 - 0) * a);
  const ca = 0.5 - 0.5 * a;
  return `rgba(${cr},${cg},${cb},${ca})`;
};

/**
 * Draw a fireball particle on the canvas - Composed function
 * @param {CanvasRenderingContext2D} ctx - Canvas context
 * @param {Object} fireball - Fireball object
 * @param {number} scale - Scale factor
 */
export const drawFireball = (ctx, fireball, scale) => {
  const tau = fireball.time / fireball.lifetime;
  
  // Don't draw if lifetime exceeded
  if (tau > 1.0) return;
  
  const screenPos = toScreenPos(fireball.pos, scale);
  const radius = scale * fireball.radius;
  const fillStyle = calculateFireballColor(tau);
  
  ctx.fillStyle = fillStyle;
  ctx.beginPath();
  ctx.arc(screenPos.x, screenPos.y, radius, 0, Math.PI * 2, true);
  ctx.closePath();
  ctx.fill();
};

/**
 * Clear the canvas - Side effect function
 * @param {CanvasRenderingContext2D} ctx - Canvas context
 * @param {number} width - Canvas width
 * @param {number} height - Canvas height
 * @param {string} color - Background color
 */
export const clearCanvas = (ctx, width, height, color = '#1a1a2e') => {
  ctx.fillStyle = color;
  ctx.fillRect(0, 0, width, height);
};

/**
 * Draw simulation border - Side effect function
 * @param {CanvasRenderingContext2D} ctx - Canvas context
 * @param {Object} size - Simulation size
 * @param {number} scale - Scale factor
 */
export const drawBorder = (ctx, size, scale) => {
  ctx.strokeStyle = 'rgba(100, 100, 150, 0.5)';
  ctx.lineWidth = 2;
  ctx.strokeRect(0, 0, size.x * scale, size.y * scale);
};

// ============================================================================
// EXPORTS
// ============================================================================

export default {
  drawAtom,
  drawFireball,
  drawBond,
  drawBondWithLength,
  drawVelocityVector,
  drawAtomSelection,
  drawAtomInfo,
  clearCanvas,
  drawBorder,
  velocityToColor,
  drawMotionTrail,
};
