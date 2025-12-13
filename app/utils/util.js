/**
 * Utility functions for Molecular Dynamics simulation
 */

/**
 * Convert degrees to radians
 * @param {number} degrees - Angle in degrees
 * @returns {number} Angle in radians
 */
export function degreesToRadians(degrees) {
  return degrees * (Math.PI / 180);
}

/**
 * Convert radians to degrees
 * @param {number} radians - Angle in radians
 * @returns {number} Angle in degrees
 */
export function radiansToDegrees(radians) {
  return radians * (180 / Math.PI);
}

/**
 * Calculate 3D distance between two points
 * @param {{x: number, y: number, z: number}} p1 - First point
 * @param {{x: number, y: number, z: number}} p2 - Second point
 * @returns {number} Distance
 */
export function distance3D(p1, p2) {
  const dx = p2.x - p1.x;
  const dy = p2.y - p1.y;
  const dz = p2.z - p1.z;
  return Math.sqrt(dx * dx + dy * dy + dz * dz);
}

/**
 * Calculate dot product of two 3D vectors
 * @param {{x: number, y: number, z: number}} v1 - First vector
 * @param {{x: number, y: number, z: number}} v2 - Second vector
 * @returns {number} Dot product
 */
export function dotProduct(v1, v2) {
  return v1.x * v2.x + v1.y * v2.y + v1.z * v2.z;
}

/**
 * Calculate cross product of two 3D vectors
 * @param {{x: number, y: number, z: number}} v1 - First vector
 * @param {{x: number, y: number, z: number}} v2 - Second vector
 * @returns {{x: number, y: number, z: number}} Cross product
 */
export function crossProduct(v1, v2) {
  return {
    x: v1.y * v2.z - v1.z * v2.y,
    y: v1.z * v2.x - v1.x * v2.z,
    z: v1.x * v2.y - v1.y * v2.x
  };
}

/**
 * Normalize a 3D vector
 * @param {{x: number, y: number, z: number}} v - Vector to normalize
 * @returns {{x: number, y: number, z: number}} Normalized vector
 */
export function normalize(v) {
  const length = Math.sqrt(v.x * v.x + v.y * v.y + v.z * v.z);
  if (length === 0) return { x: 0, y: 0, z: 0 };
  return {
    x: v.x / length,
    y: v.y / length,
    z: v.z / length
  };
}

/**
 * Clamp a value between min and max
 * @param {number} value - Value to clamp
 * @param {number} min - Minimum value
 * @param {number} max - Maximum value
 * @returns {number} Clamped value
 */
export function clamp(value, min, max) {
  return Math.max(min, Math.min(max, value));
}

/**
 * Linear interpolation between two values
 * @param {number} a - Start value
 * @param {number} b - End value
 * @param {number} t - Interpolation factor (0-1)
 * @returns {number} Interpolated value
 */
export function lerp(a, b, t) {
  return a + (b - a) * t;
}

/**
 * Create a 2D array with default values
 * @param {number} rows - Number of rows
 * @param {number} cols - Number of columns
 * @param {*} defaultValue - Default value for cells
 * @returns {Array<Array>} 2D array
 */
export function create2DArray(rows, cols, defaultValue = 0) {
  return Array.from({ length: rows }, () => 
    Array.from({ length: cols }, () => defaultValue)
  );
}

/**
 * Deep clone an object
 * @param {Object} obj - Object to clone
 * @returns {Object} Cloned object
 */
export function deepClone(obj) {
  return JSON.parse(JSON.stringify(obj));
}

export class Util {
  static degreesToRadians = degreesToRadians;
  static radiansToDegrees = radiansToDegrees;
  static distance3D = distance3D;
  static dotProduct = dotProduct;
  static crossProduct = crossProduct;
  static normalize = normalize;
  static clamp = clamp;
  static lerp = lerp;
  static create2DArray = create2DArray;
  static deepClone = deepClone;
}

export default Util;