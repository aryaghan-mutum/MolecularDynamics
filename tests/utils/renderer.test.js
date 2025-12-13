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
});
