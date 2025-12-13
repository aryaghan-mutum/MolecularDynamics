/**
 * ReaxFF Force Field Parameter Parser
 * Parses ReaxFF parameter files and extracts atom definitions and properties
 * @module simulation/forceFieldParser
 */

import logger from '../utils/logger';

/**
 * @typedef {Object} AtomParameters
 * @property {string} symbol - Atomic symbol (e.g., 'C', 'H', 'O')
 * @property {string} name - Full element name
 * @property {number} mass - Atomic mass in amu
 * @property {number} roSigma - Sigma bond radius
 * @property {number} valency - Number of valence electrons
 * @property {number} rvdw - Van der Waals radius
 * @property {number} evdw - Van der Waals well depth
 * @property {number} gammaEEM - EEM gamma parameter
 * @property {number} roPi - Pi bond radius
 * @property {number} alfa - Alpha parameter
 * @property {number} gammavdW - Van der Waals gamma
 * @property {number} chiEEM - EEM electronegativity
 * @property {number} etaEEM - EEM hardness
 * @property {number} roPiPi - Double pi bond radius
 */

/**
 * @typedef {Object} ParsedForceField
 * @property {string} name - Force field name/description
 * @property {number} generalParamsCount - Number of general parameters
 * @property {number[]} generalParams - Array of general parameters
 * @property {AtomParameters[]} atoms - Array of atom definitions
 * @property {Object[]} bonds - Array of bond parameters
 */

/**
 * Element name lookup from symbol
 * @type {Object<string, string>}
 */
const ELEMENT_NAMES = {
  'C': 'Carbon',
  'H': 'Hydrogen',
  'O': 'Oxygen',
  'N': 'Nitrogen',
  'S': 'Sulfur',
  'P': 'Phosphorus',
  'Si': 'Silicon',
  'Au': 'Gold',
  'Pt': 'Platinum',
  'Zn': 'Zinc',
  'Zr': 'Zirconium',
  'Ni': 'Nickel',
  'Cu': 'Copper',
  'Ti': 'Titanium',
  'V': 'Vanadium',
  'Bi': 'Bismuth',
  'Mg': 'Magnesium',
  'Na': 'Sodium',
  'Fe': 'Iron',
  'Al': 'Aluminum',
  'B': 'Boron',
  'Cl': 'Chlorine',
  'F': 'Fluorine',
  'X': 'Placeholder',
};

/**
 * CPK color scheme for elements
 * @type {Object<string, Object>}
 */
const CPK_COLORS = {
  'C': { color: '#222222', highlightColor: '#555555' },
  'H': { color: '#FFFFFF', highlightColor: '#E8E8E8' },
  'O': { color: '#FF0D0D', highlightColor: '#FF6666' },
  'N': { color: '#3050F8', highlightColor: '#7090FF' },
  'S': { color: '#FFFF30', highlightColor: '#FFFF80' },
  'P': { color: '#FF8000', highlightColor: '#FFAA55' },
  'Si': { color: '#F0C8A0', highlightColor: '#F5DCC8' },
  'Au': { color: '#FFD123', highlightColor: '#FFE066' },
  'Pt': { color: '#D0D0E0', highlightColor: '#E8E8F0' },
  'Zn': { color: '#7D80B0', highlightColor: '#A0A3C8' },
  'Zr': { color: '#94E0E0', highlightColor: '#B8F0F0' },
  'Ni': { color: '#50D050', highlightColor: '#80E080' },
  'Cu': { color: '#C88033', highlightColor: '#D9A066' },
  'Ti': { color: '#BFC2C7', highlightColor: '#D5D8DD' },
  'V': { color: '#A6A6AB', highlightColor: '#C0C0C5' },
  'Bi': { color: '#9E4FB5', highlightColor: '#B878C8' },
  'Mg': { color: '#8AFF00', highlightColor: '#B5FF55' },
  'Na': { color: '#AB5CF2', highlightColor: '#C88FF8' },
  'Fe': { color: '#E06633', highlightColor: '#F09966' },
  'Al': { color: '#BFA6A6', highlightColor: '#D5C8C8' },
  'B': { color: '#FFB5B5', highlightColor: '#FFD5D5' },
  'Cl': { color: '#1FF01F', highlightColor: '#66F066' },
  'F': { color: '#90E050', highlightColor: '#B5F080' },
  'X': { color: '#808080', highlightColor: '#A0A0A0' },
};

/**
 * Parse a line of atom parameters from ReaxFF file
 * @param {string[]} lines - Array of 4 consecutive lines for one atom
 * @returns {AtomParameters|null} Parsed atom parameters or null if invalid
 */
const parseAtomBlock = (lines) => {
  if (lines.length < 4) {
    return null;
  }

  try {
    // First line: symbol and first row of parameters
    const line1Parts = lines[0].trim().split(/\s+/);
    const symbol = line1Parts[0];
    
    if (!symbol || symbol.length > 2 || /^\d/.test(symbol)) {
      return null;
    }

    const roSigma = parseFloat(line1Parts[1]) || 0;
    const valency = parseFloat(line1Parts[2]) || 0;
    const mass = parseFloat(line1Parts[3]) || 0;
    const rvdw = parseFloat(line1Parts[4]) || 0;
    const evdw = parseFloat(line1Parts[5]) || 0;
    const gammaEEM = parseFloat(line1Parts[6]) || 0;
    const roPi = parseFloat(line1Parts[7]) || 0;

    // Second line: more parameters
    const line2Parts = lines[1].trim().split(/\s+/);
    const alfa = parseFloat(line2Parts[0]) || 0;
    const gammavdW = parseFloat(line2Parts[1]) || 0;
    const chiEEM = parseFloat(line2Parts[5]) || 0;
    const etaEEM = parseFloat(line2Parts[6]) || 0;

    // Third line: more parameters including roPiPi
    const line3Parts = lines[2].trim().split(/\s+/);
    const roPiPi = parseFloat(line3Parts[0]) || 0;

    const colors = CPK_COLORS[symbol] || { color: '#808080', highlightColor: '#A0A0A0' };

    return {
      symbol,
      name: ELEMENT_NAMES[symbol] || symbol,
      mass,
      roSigma,
      valency: Math.round(valency),
      radius: rvdw,
      rvdw,
      evdw,
      gammaEEM,
      roPi,
      alfa,
      gammavdW,
      chiEEM,
      etaEEM,
      roPiPi,
      charge: 0,
      ...colors,
    };
  } catch (error) {
    logger.warn('Failed to parse atom block:', error.message);
    return null;
  }
};

/**
 * Parse a ReaxFF force field file content
 * @param {string} content - Raw file content
 * @returns {ParsedForceField} Parsed force field data
 */
export const parseForceField = (content) => {
  const lines = content.split('\n');
  const result = {
    name: '',
    generalParamsCount: 0,
    generalParams: [],
    atoms: [],
    bonds: [],
  };

  if (lines.length === 0) {
    logger.warn('Empty force field file');
    return result;
  }

  // First line is the force field name/description
  result.name = lines[0].trim();

  // Find the number of general parameters
  let lineIndex = 1;
  while (lineIndex < lines.length) {
    const line = lines[lineIndex].trim();
    const match = line.match(/^\s*(\d+)\s*!\s*Number of general parameters/i);
    if (match) {
      result.generalParamsCount = parseInt(match[1], 10);
      lineIndex++;
      break;
    }
    // Also try simpler format
    const simpleMatch = line.match(/^\s*(\d+)\s+/);
    if (simpleMatch && line.includes('!')) {
      result.generalParamsCount = parseInt(simpleMatch[1], 10);
      lineIndex++;
      break;
    }
    lineIndex++;
  }

  // Skip general parameters
  lineIndex += result.generalParamsCount;

  // Find atom section
  while (lineIndex < lines.length) {
    const line = lines[lineIndex].trim();
    const atomCountMatch = line.match(/^\s*(\d+)\s*!\s*Nr of atoms/i);
    if (atomCountMatch) {
      const atomCount = parseInt(atomCountMatch[1], 10);
      lineIndex += 4; // Skip header lines (4 header comment lines after count)

      // Parse each atom (4 lines per atom)
      for (let i = 0; i < atomCount && lineIndex + 3 < lines.length; i++) {
        const atomLines = [
          lines[lineIndex],
          lines[lineIndex + 1],
          lines[lineIndex + 2],
          lines[lineIndex + 3],
        ];
        
        const atom = parseAtomBlock(atomLines);
        if (atom) {
          result.atoms.push(atom);
        }
        lineIndex += 4;
      }
      break;
    }
    lineIndex++;
  }

  logger.info(`Parsed force field "${result.name}" with ${result.atoms.length} atom types`);
  return result;
};

/**
 * Convert parsed force field atoms to ATOM_TYPES format
 * @param {AtomParameters[]} atoms - Parsed atoms from force field
 * @param {number} startingId - Starting ID for atom types
 * @returns {Object} ATOM_TYPES compatible object
 */
export const toAtomTypes = (atoms, startingId = 1) => {
  const atomTypes = {};
  
  atoms.forEach((atom, index) => {
    atomTypes[startingId + index] = {
      name: atom.name,
      symbol: atom.symbol,
      mass: atom.mass,
      radius: atom.radius || atom.rvdw || 1.5,
      valency: atom.valency,
      color: atom.color,
      highlightColor: atom.highlightColor,
      charge: atom.charge || 0,
      roSigma: atom.roSigma,
      roPi: atom.roPi,
      roPiPi: atom.roPiPi,
    };
  });

  return atomTypes;
};

/**
 * Get available force field file names
 * @returns {string[]} Array of force field file names
 */
export const getAvailableForceFields = () => [
  'ffield.reax.cho',
  'BaeAiken2013.ff',
  'van_duin_zno.ff',
  'reaxff_glycine_force_field1.txt',
  'reaxff_biomolecules_param1.txt',
  'reaxff_aluminum_oxygen_carbon.txt',
  'reaxff_boron_carbide0.txt',
];

/**
 * Get force field description
 * @param {string} filename - Force field filename
 * @returns {Object} Description object
 */
export const getForceFieldInfo = (filename) => {
  const info = {
    'ffield.reax.cho': {
      name: 'CHO Combustion',
      description: 'Carbon-Hydrogen-Oxygen combustion chemistry',
      elements: ['C', 'H', 'O'],
    },
    'BaeAiken2013.ff': {
      name: 'Gold-Sulfur-Carbon',
      description: 'Gold nanoparticle with thiol ligands',
      elements: ['C', 'H', 'S', 'Au'],
    },
    'van_duin_zno.ff': {
      name: 'Water/ZnO System',
      description: 'Zinc oxide surfaces with water',
      elements: ['C', 'H', 'O', 'N', 'S', 'Si', 'Pt', 'Zr', 'Ni', 'Au', 'V', 'Bi', 'Ti', 'Zn'],
    },
    'reaxff_glycine_force_field1.txt': {
      name: 'Glycine',
      description: 'Amino acid glycine simulation',
      elements: ['C', 'H', 'O', 'N'],
    },
    'reaxff_biomolecules_param1.txt': {
      name: 'Biomolecules',
      description: 'Protein and biomolecule simulations',
      elements: ['C', 'H', 'O', 'N', 'S', 'Mg', 'P', 'Na', 'Cu'],
    },
    'reaxff_aluminum_oxygen_carbon.txt': {
      name: 'Aluminum Oxide',
      description: 'Aluminum and aluminum oxide systems',
      elements: ['Al', 'O', 'C', 'H'],
    },
    'reaxff_boron_carbide0.txt': {
      name: 'Boron Carbide',
      description: 'Boron carbide ceramic systems',
      elements: ['B', 'C', 'H'],
    },
  };

  return info[filename] || { name: filename, description: 'Unknown force field', elements: [] };
};

export default {
  parseForceField,
  toAtomTypes,
  getAvailableForceFields,
  getForceFieldInfo,
  ELEMENT_NAMES,
  CPK_COLORS,
};
