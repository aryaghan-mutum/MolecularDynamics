/**
 * @fileoverview Unit tests for Force Field Parser
 * @description Tests for ReaxFF force field parameter parsing
 */
import {
  parseForceField,
  toAtomTypes,
  getAvailableForceFields,
  getForceFieldInfo,
} from '../../src/simulation/forceFieldParser';
import forceFieldParser from '../../src/simulation/forceFieldParser';

// Extract from default export
const ELEMENT_NAMES = forceFieldParser.ELEMENT_NAMES;
const CPK_COLORS = forceFieldParser.CPK_COLORS;

describe('Force Field Parser', () => {
  describe('parseForceField', () => {
    const mockForceFieldContent = `Reactive MD-force field: Test CHO Force Field
 39       ! Number of general parameters
   50.0000 !Overcoordination parameter
    9.5469 !Overcoordination parameter
    1.6725 !Valency angle conjugation parameter
    1.7224 !Triple bond stabilisation parameter
    6.8702 !Triple bond stabilisation parameter
   60.4850 !C2-correction
    1.0588 !Undercoordination parameter
    4.6000 !Triple bond stabilisation parameter
   12.1176 !Undercoordination parameter
   13.3056 !Undercoordination parameter
  -40.0000 !Triple bond stabilization energy
    0.0000 !Lower Taper-radius
   10.0000 !Upper Taper-radius
    2.8793 !Not used
   33.8667 !Valency undercoordination
    6.0891 !Valency angle/lone pair parameter
    1.0563 !Valency angle
    2.0384 !Valency angle parameter
    6.1431 !Not used
    6.9290 !Double bond/angle parameter
    0.3989 !Double bond/angle parameter: overcoord
    3.9954 !Double bond/angle parameter: overcoord
   -2.4837 !Not used
    5.7796 !Torsion/BO parameter
   10.0000 !Torsion overcoordination
    1.9487 !Torsion overcoordination
   -1.2327 !Conjugation 0 (not used)
    2.1645 !Conjugation
    1.5591 !vdWaals shielding
    0.1000 !Cutoff for bond order (*100)
    1.7602 !Valency angle conjugation parameter
    0.6991 !Overcoordination parameter
   50.0000 !Overcoordination parameter
    1.8512 !Valency/lone pair parameter
    0.5000 !Not used
   20.0000 !Not used
    5.0000 !Molecular energy (not used)
    0.0000 !Molecular energy (not used)
    0.7903 !Valency angle conjugation parameter
  3    ! Nr of atoms; cov.r; valency;a.m;Rvdw;Evdw;gammaEEM;cov.r2;#
            alfa;gammavdW;valency;Eunder;Eover;chiEEM;etaEEM;n.u.
            cov r3;Elp;Heat inc.;n.u.;n.u.;n.u.;n.u.
            ovun;val1;n.u.;val3,vval4
 C    1.3817   4.0000  12.0000   1.8903   0.1838   0.6544   1.1341   4.0000
      9.7559   2.1346   4.0000  34.9350  79.5548   5.4088   6.0000   0.0000
      1.2114   0.0000 202.2908   8.9539  34.9289  13.5366   0.8563   0.0000
     -2.8983   2.5000   1.0564   4.0000   2.9663   0.0000   0.0000   0.0000
 H    0.8930   1.0000   1.0080   1.3550   0.0930   0.8203  -0.1000   1.0000
      8.2230  33.2894   1.0000   0.0000 121.1250   3.7248   9.6093   1.0000
     -0.1000   0.0000  55.1878   3.0408   2.4197   0.0003   1.0698   0.0000
    -19.4571   4.2733   1.0338   1.0000   2.8793   0.0000   0.0000   0.0000
 O    1.2450   2.0000  15.9990   2.3890   0.1000   1.0898   1.0548   6.0000
      9.7300  13.8449   4.0000  37.5000 116.0768   8.5000   8.3122   2.0000
      0.9049   0.4056  68.0152   3.5027   0.7640   0.0021   0.9745   0.0000
     -3.5500   2.9000   1.0493   4.0000   2.9225   0.0000   0.0000   0.0000`;

    it('should parse force field name', () => {
      const result = parseForceField(mockForceFieldContent);
      
      expect(result.name).toContain('Test CHO Force Field');
    });

    it('should parse general parameters count', () => {
      const result = parseForceField(mockForceFieldContent);
      
      expect(result.generalParamsCount).toBe(39);
    });

    it('should parse atoms', () => {
      const result = parseForceField(mockForceFieldContent);
      
      expect(result.atoms.length).toBe(3);
    });

    it('should parse Carbon atom correctly', () => {
      const result = parseForceField(mockForceFieldContent);
      const carbon = result.atoms.find(a => a.symbol === 'C');
      
      expect(carbon).toBeDefined();
      expect(carbon.mass).toBeCloseTo(12.0, 0);
      expect(carbon.valency).toBe(4);
    });

    it('should parse Hydrogen atom correctly', () => {
      const result = parseForceField(mockForceFieldContent);
      const hydrogen = result.atoms.find(a => a.symbol === 'H');
      
      expect(hydrogen).toBeDefined();
      expect(hydrogen.mass).toBeCloseTo(1.008, 2);
      expect(hydrogen.valency).toBe(1);
    });

    it('should parse Oxygen atom correctly', () => {
      const result = parseForceField(mockForceFieldContent);
      const oxygen = result.atoms.find(a => a.symbol === 'O');
      
      expect(oxygen).toBeDefined();
      expect(oxygen.mass).toBeCloseTo(15.999, 2);
      expect(oxygen.valency).toBe(2);
    });

    it('should handle empty content', () => {
      const result = parseForceField('');
      
      expect(result.atoms).toEqual([]);
      expect(result.generalParamsCount).toBe(0);
    });

    it('should assign CPK colors to atoms', () => {
      const result = parseForceField(mockForceFieldContent);
      
      result.atoms.forEach(atom => {
        expect(atom.color).toBeDefined();
        expect(atom.highlightColor).toBeDefined();
      });
    });
  });

  describe('toAtomTypes', () => {
    it('should convert parsed atoms to ATOM_TYPES format', () => {
      const atoms = [
        { symbol: 'C', name: 'Carbon', mass: 12.0, radius: 1.7, valency: 4, color: '#222222', highlightColor: '#555555', roSigma: 1.38, roPi: 1.1, roPiPi: 1.2 },
        { symbol: 'H', name: 'Hydrogen', mass: 1.008, radius: 1.2, valency: 1, color: '#FFFFFF', highlightColor: '#E8E8E8', roSigma: 0.89, roPi: -0.1, roPiPi: -0.1 },
      ];
      
      const result = toAtomTypes(atoms);
      
      expect(result[1].symbol).toBe('C');
      expect(result[2].symbol).toBe('H');
    });

    it('should use custom starting ID', () => {
      const atoms = [
        { symbol: 'Au', name: 'Gold', mass: 197.0, radius: 1.66, valency: 1, color: '#FFD123', highlightColor: '#FFE066', roSigma: 1.9, roPi: -1, roPiPi: -1 },
      ];
      
      const result = toAtomTypes(atoms, 10);
      
      expect(result[10].symbol).toBe('Au');
    });

    it('should preserve all required properties', () => {
      const atoms = [
        { symbol: 'N', name: 'Nitrogen', mass: 14.0, radius: 1.55, valency: 3, color: '#3050F8', highlightColor: '#7090FF', roSigma: 1.23, roPi: 1.05, roPiPi: 0.95 },
      ];
      
      const result = toAtomTypes(atoms);
      
      expect(result[1]).toHaveProperty('name');
      expect(result[1]).toHaveProperty('symbol');
      expect(result[1]).toHaveProperty('mass');
      expect(result[1]).toHaveProperty('radius');
      expect(result[1]).toHaveProperty('valency');
      expect(result[1]).toHaveProperty('color');
      expect(result[1]).toHaveProperty('roSigma');
    });

    it('should handle empty atoms array', () => {
      const result = toAtomTypes([]);
      
      expect(Object.keys(result).length).toBe(0);
    });
  });

  describe('getAvailableForceFields', () => {
    it('should return array of force field names', () => {
      const result = getAvailableForceFields();
      
      expect(Array.isArray(result)).toBe(true);
      expect(result.length).toBeGreaterThan(0);
    });

    it('should include standard force field files', () => {
      const result = getAvailableForceFields();
      
      expect(result).toContain('ffield.reax.cho');
      expect(result).toContain('BaeAiken2013.ff');
    });
  });

  describe('getForceFieldInfo', () => {
    it('should return info for known force fields', () => {
      const result = getForceFieldInfo('ffield.reax.cho');
      
      expect(result.name).toBeDefined();
      expect(result.description).toBeDefined();
      expect(result.elements).toBeDefined();
    });

    it('should return CHO elements for combustion force field', () => {
      const result = getForceFieldInfo('ffield.reax.cho');
      
      expect(result.elements).toContain('C');
      expect(result.elements).toContain('H');
      expect(result.elements).toContain('O');
    });

    it('should return info for gold-sulfur force field', () => {
      const result = getForceFieldInfo('BaeAiken2013.ff');
      
      expect(result.elements).toContain('Au');
      expect(result.elements).toContain('S');
    });

    it('should return default info for unknown force field', () => {
      const result = getForceFieldInfo('unknown.ff');
      
      expect(result.name).toBe('unknown.ff');
      expect(result.description).toBe('Unknown force field');
    });
  });

  describe('ELEMENT_NAMES', () => {
    it('should have common element names', () => {
      expect(ELEMENT_NAMES['C']).toBe('Carbon');
      expect(ELEMENT_NAMES['H']).toBe('Hydrogen');
      expect(ELEMENT_NAMES['O']).toBe('Oxygen');
      expect(ELEMENT_NAMES['N']).toBe('Nitrogen');
    });

    it('should have metal element names', () => {
      expect(ELEMENT_NAMES['Au']).toBe('Gold');
      expect(ELEMENT_NAMES['Pt']).toBe('Platinum');
      expect(ELEMENT_NAMES['Cu']).toBe('Copper');
    });
  });

  describe('CPK_COLORS', () => {
    it('should have colors for common elements', () => {
      expect(CPK_COLORS['C'].color).toBe('#222222');
      expect(CPK_COLORS['H'].color).toBe('#FFFFFF');
      expect(CPK_COLORS['O'].color).toBe('#FF0D0D');
      expect(CPK_COLORS['N'].color).toBe('#3050F8');
    });

    it('should have highlight colors', () => {
      Object.values(CPK_COLORS).forEach(colors => {
        expect(colors.color).toBeDefined();
        expect(colors.highlightColor).toBeDefined();
      });
    });

    it('should have gold color for Au', () => {
      expect(CPK_COLORS['Au'].color).toBe('#FFD123');
    });
  });
});
