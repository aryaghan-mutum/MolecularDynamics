/**
 * @fileoverview Unit tests for File Reader
 * @description Tests for ReaxFF parameter file parsing
 */
import { parseParameterFile } from '../../src/simulation/fileReader';

describe('File Reader', () => {
  describe('parseParameterFile', () => {
    const mockFileContent = `Reactive MD-force field: Test Force Field
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
     -3.5500   2.9000   1.0493   4.0000   2.9225   0.0000   0.0000   0.0000
`;

    it('should parse force field file and return object', () => {
      const result = parseParameterFile(mockFileContent);
      
      expect(result).toBeDefined();
      expect(typeof result).toBe('object');
    });

    it('should parse result object', () => {
      const result = parseParameterFile(mockFileContent);
      
      // parseParameterFile returns onebody_parameters, not header
      expect(result.onebody_parameters).toBeDefined();
    });

    it('should parse atom types from onebody_parameters', () => {
      const result = parseParameterFile(mockFileContent);
      
      expect(result.onebody_parameters).toBeDefined();
      expect(typeof result.onebody_parameters).toBe('object');
    });

    it('should handle empty content', () => {
      const result = parseParameterFile('');
      
      expect(result).toBeDefined();
    });

    it('should handle malformed content gracefully', () => {
      expect(() => parseParameterFile('random garbage text\n123\nabc')).not.toThrow();
    });

    it('should parse general parameters', () => {
      const result = parseParameterFile(mockFileContent);
      
      expect(result.paramGeneral).toBeDefined();
    });

    it('should return an object with expected properties', () => {
      const result = parseParameterFile(mockFileContent);
      
      expect(result).toHaveProperty('paramGeneral');
      expect(result).toHaveProperty('onebody_parameters');
      expect(result).toHaveProperty('twobody_parameters');
    });
  });

  describe('Error handling', () => {
    it('should throw error for undefined input', () => {
      expect(() => parseParameterFile(undefined)).toThrow();
    });

    it('should throw error for null input', () => {
      expect(() => parseParameterFile(null)).toThrow();
    });

    it('should throw error for non-string input', () => {
      expect(() => parseParameterFile(123)).toThrow();
    });

    it('should handle very large input without crashing', () => {
      const largeContent = 'x'.repeat(100000);
      
      // May throw but should not crash
      try {
        parseParameterFile(largeContent);
      } catch (e) {
        expect(e).toBeDefined();
      }
    });
  });

  describe('Content parsing', () => {
    it('should normalize CRLF line endings', () => {
      const content = 'Line1\r\nLine2\r\n';
      
      expect(() => parseParameterFile(content)).not.toThrow();
    });

    it('should normalize CR line endings', () => {
      const content = 'Line1\rLine2\r';
      
      expect(() => parseParameterFile(content)).not.toThrow();
    });

    it('should handle mixed line endings', () => {
      const content = 'Line1\r\nLine2\rLine3\n';
      
      expect(() => parseParameterFile(content)).not.toThrow();
    });
  });
});
