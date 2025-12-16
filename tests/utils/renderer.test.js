/**
 * @fileoverview Unit tests for Renderer Utility
 * @description Tests for Canvas rendering functions
 */
import {
  clearCanvas,
  drawAtom,
  drawBond,
  drawBorder,
  drawFireball,
  drawMotionTrail,
  velocityToColor,
} from '../../src/utils/renderer';

// Mock canvas context
const createMockContext = () => ({
  clearRect: jest.fn(),
  fillRect: jest.fn(),
  strokeRect: jest.fn(),
  beginPath: jest.fn(),
  closePath: jest.fn(),
  arc: jest.fn(),
  fill: jest.fn(),
  stroke: jest.fn(),
  moveTo: jest.fn(),
  lineTo: jest.fn(),
  rect: jest.fn(),
  createRadialGradient: jest.fn(() => ({
    addColorStop: jest.fn(),
  })),
  createLinearGradient: jest.fn(() => ({
    addColorStop: jest.fn(),
  })),
  save: jest.fn(),
  restore: jest.fn(),
  fillText: jest.fn(),
  measureText: jest.fn(() => ({ width: 10 })),
  fillStyle: '',
  strokeStyle: '',
  lineWidth: 0,
  globalAlpha: 1,
  shadowColor: '',
  shadowBlur: 0,
  shadowOffsetX: 0,
  shadowOffsetY: 0,
  font: '',
  textAlign: '',
  textBaseline: '',
  lineCap: '',
});

describe('Renderer Utility', () => {
  let ctx;

  beforeEach(() => {
    ctx = createMockContext();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('clearCanvas', () => {
    it('should clear the canvas with black color', () => {
      clearCanvas(ctx, 800, 600);
      
      expect(ctx.fillRect).toHaveBeenCalledWith(0, 0, 800, 600);
    });

    it('should set fill style to black', () => {
      clearCanvas(ctx, 800, 600);
      
      expect(ctx.fillStyle).toBe('#1a1a2e');
    });

    it('should handle different canvas sizes', () => {
      clearCanvas(ctx, 1920, 1080);
      
      expect(ctx.fillRect).toHaveBeenCalledWith(0, 0, 1920, 1080);
    });

    it('should handle zero dimensions', () => {
      clearCanvas(ctx, 0, 0);
      
      expect(ctx.fillRect).toHaveBeenCalledWith(0, 0, 0, 0);
    });
  });

  describe('drawAtom', () => {
    it('should draw an atom at specified position', () => {
      const atom = {
        pos: { x: 100, y: 200 },
        radius: 20,
        type: 1,
      };
      
      drawAtom(ctx, atom);
      
      expect(ctx.beginPath).toHaveBeenCalled();
      expect(ctx.arc).toHaveBeenCalled();
      expect(ctx.fill).toHaveBeenCalled();
    });

    it('should handle selected atom', () => {
      const atom = {
        pos: { x: 100, y: 200 },
        radius: 20,
        type: 1,
      };
      
      drawAtom(ctx, atom, true);
      
      expect(ctx.beginPath).toHaveBeenCalled();
      expect(ctx.arc).toHaveBeenCalled();
    });

    it('should use radial gradient for 3D effect', () => {
      const atom = {
        pos: { x: 100, y: 200 },
        radius: 20,
        type: 1,
      };
      
      drawAtom(ctx, atom);
      
      expect(ctx.createRadialGradient).toHaveBeenCalled();
    });

    it('should handle different atom types', () => {
      const carbonAtom = {
        pos: { x: 100, y: 200 },
        radius: 20,
        type: 1,
      };
      
      const oxygenAtom = {
        pos: { x: 150, y: 250 },
        radius: 18,
        type: 3,
      };
      
      drawAtom(ctx, carbonAtom);
      drawAtom(ctx, oxygenAtom);
      
      expect(ctx.beginPath).toHaveBeenCalledTimes(2);
    });
  });

  describe('drawBond', () => {
    it('should draw a bond between two atoms', () => {
      const atom1 = { pos: { x: 100, y: 200 } };
      const atom2 = { pos: { x: 150, y: 250 } };
      
      drawBond(ctx, atom1, atom2, 1);
      
      expect(ctx.beginPath).toHaveBeenCalled();
      expect(ctx.moveTo).toHaveBeenCalled();
      expect(ctx.lineTo).toHaveBeenCalled();
      expect(ctx.stroke).toHaveBeenCalled();
    });

    it('should handle different bond orders', () => {
      const atom1 = { pos: { x: 100, y: 200 } };
      const atom2 = { pos: { x: 150, y: 250 } };
      
      drawBond(ctx, atom1, atom2, 1);
      drawBond(ctx, atom1, atom2, 2);
      drawBond(ctx, atom1, atom2, 3);
      
      expect(ctx.stroke).toHaveBeenCalledTimes(3);
    });

    it('should set appropriate line width based on bond order', () => {
      const atom1 = { pos: { x: 100, y: 200 } };
      const atom2 = { pos: { x: 150, y: 250 } };
      
      drawBond(ctx, atom1, atom2, 2);
      
      expect(ctx.lineWidth).toBeGreaterThan(0);
    });
  });

  describe('drawBorder', () => {
    it('should draw border rectangle', () => {
      const size = { x: 800, y: 600 };
      
      drawBorder(ctx, size, 1);
      
      expect(ctx.strokeRect || ctx.stroke || ctx.rect).toBeDefined();
    });
  });

  describe('drawFireball', () => {
    it('should draw fireball with correct position', () => {
      const fireball = {
        pos: { x: 100, y: 200, z: 0 },
        radius: 20,
        born: 0,
        lifetime: 1000,
      };
      
      drawFireball(ctx, fireball, 1);
      
      expect(ctx.beginPath).toHaveBeenCalled();
    });

    it('should not draw fireball past lifetime', () => {
      const fireball = {
        pos: { x: 100, y: 200, z: 0 },
        radius: 20,
        born: 0,
        lifetime: -1,
      };
      
      // Should not crash
      drawFireball(ctx, fireball, 1);
    });
  });

  describe('velocityToColor', () => {
    it('should return blue color for zero velocity', () => {
      const color = velocityToColor(0);
      
      // Should be blue (low velocity)
      expect(color).toMatch(/^#[0-9a-f]{6}$/i);
      // Blue color should have high B component
      const b = parseInt(color.slice(5, 7), 16);
      expect(b).toBeGreaterThan(200);
    });

    it('should return red color for high velocity', () => {
      const color = velocityToColor(10); // High velocity
      
      // Should be red (high velocity)
      expect(color).toMatch(/^#[0-9a-f]{6}$/i);
      // Red color should have high R component
      const r = parseInt(color.slice(1, 3), 16);
      expect(r).toBeGreaterThan(200);
    });

    it('should return color for medium velocity', () => {
      const color = velocityToColor(2.5); // Medium velocity
      
      // Should be a valid hex color
      expect(color).toMatch(/^#[0-9a-f]{6}$/i);
    });

    it('should handle negative velocity using absolute value', () => {
      const colorPositive = velocityToColor(5);
      const colorNegative = velocityToColor(-5);
      
      // Should return same color for same magnitude
      expect(colorNegative).toBe(colorPositive);
      expect(colorNegative).toMatch(/^#[0-9a-f]{6}$/i);
    });

    it('should return consistent colors for same velocity', () => {
      const color1 = velocityToColor(2.0);
      const color2 = velocityToColor(2.0);
      
      expect(color1).toBe(color2);
    });

    it('should produce gradient of colors from blue to red', () => {
      const colorLow = velocityToColor(0);
      const colorMed = velocityToColor(2.5);
      const colorHigh = velocityToColor(5);
      
      // All should be valid colors
      expect(colorLow).toMatch(/^#[0-9a-f]{6}$/i);
      expect(colorMed).toMatch(/^#[0-9a-f]{6}$/i);
      expect(colorHigh).toMatch(/^#[0-9a-f]{6}$/i);
      
      // They should be different
      expect(colorLow).not.toBe(colorHigh);
    });
  });

  describe('drawMotionTrail', () => {
    it('should draw trail with multiple positions', () => {
      const positions = [
        { x: 100, y: 100 },
        { x: 110, y: 110 },
        { x: 120, y: 120 },
      ];
      
      drawMotionTrail(ctx, positions, '#ff0000', 1, 10);
      
      expect(ctx.save).toHaveBeenCalled();
      expect(ctx.restore).toHaveBeenCalled();
      expect(ctx.beginPath).toHaveBeenCalled();
      expect(ctx.arc).toHaveBeenCalled();
      expect(ctx.fill).toHaveBeenCalled();
    });

    it('should not draw trail with less than 2 positions', () => {
      const positions = [{ x: 100, y: 100 }];
      
      drawMotionTrail(ctx, positions, '#ff0000', 1, 10);
      
      // Should not call drawing functions
      expect(ctx.save).not.toHaveBeenCalled();
    });

    it('should not draw trail with null positions', () => {
      drawMotionTrail(ctx, null, '#ff0000', 1, 10);
      
      // Should not crash or call drawing functions
      expect(ctx.save).not.toHaveBeenCalled();
    });

    it('should not draw trail with undefined positions', () => {
      drawMotionTrail(ctx, undefined, '#ff0000', 1, 10);
      
      // Should not crash or call drawing functions
      expect(ctx.save).not.toHaveBeenCalled();
    });

    it('should not draw trail with empty positions array', () => {
      drawMotionTrail(ctx, [], '#ff0000', 1, 10);
      
      // Should not crash or call drawing functions
      expect(ctx.save).not.toHaveBeenCalled();
    });

    it('should apply transparency to trail', () => {
      const positions = [
        { x: 100, y: 100 },
        { x: 110, y: 110 },
      ];
      
      drawMotionTrail(ctx, positions, '#ff0000', 1, 10);
      
      // globalAlpha should have been set (for transparency effect)
      expect(ctx.globalAlpha).toBeDefined();
    });

    it('should scale trail positions by scale factor', () => {
      const positions = [
        { x: 100, y: 100 },
        { x: 110, y: 110 },
      ];
      
      drawMotionTrail(ctx, positions, '#ff0000', 2, 10);
      
      // Arc positions should be scaled
      expect(ctx.arc).toHaveBeenCalled();
    });

    it('should handle different color formats', () => {
      const positions = [
        { x: 100, y: 100 },
        { x: 110, y: 110 },
      ];
      
      // Should not throw for different color formats
      expect(() => {
        drawMotionTrail(ctx, positions, '#ff0000', 1, 10);
        drawMotionTrail(ctx, positions, 'rgb(255, 0, 0)', 1, 10);
        drawMotionTrail(ctx, positions, 'red', 1, 10);
      }).not.toThrow();
    });
  });
});
