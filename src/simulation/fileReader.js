/**
 * ReaxFF Parameter File Parser - Functional Style
 * Functions for parsing ReaxFF force field parameter files
 */
import { logFile } from '../utils/logger';

// ============================================================================
// DATA STRUCTURES - Factory Functions
// ============================================================================

/**
 * Create AtomType parameters object - Pure factory
 */
const createAtomType = (paramAtom) => Object.freeze({
  atomID: paramAtom[0] ?? '',
  roSigma: parseFloat(paramAtom[1]) || 0,
  valency: parseFloat(paramAtom[2]) || 0,
  atmcMass: parseFloat(paramAtom[3]) || 0,
  rvdw: parseFloat(paramAtom[4]) || 0,
  dij: parseFloat(paramAtom[5]) || 0,
  gamma: parseFloat(paramAtom[6]) || 0,
  roPi: parseFloat(paramAtom[7]) || 0,
  valE: parseFloat(paramAtom[8]) || 0,
  alpha: parseFloat(paramAtom[9]) || 0,
  gammaW: parseFloat(paramAtom[10]) || 0,
  valAngle: parseFloat(paramAtom[11]) || 0,
  povun5: parseFloat(paramAtom[12]) || 0,
  chiEEM: parseFloat(paramAtom[14]) || 0,
  etaEEM: parseFloat(2 * (paramAtom[15] || 0)),
  nlp_opt: parseFloat(paramAtom[16]) || 0,
  roPiPi: parseFloat(paramAtom[17]) || 0,
  plp2: parseFloat(paramAtom[18]) || 0,
  heatInc: parseFloat(paramAtom[19]) || 0,
  pboc4: parseFloat(paramAtom[20]) || 0,
  pboc3: parseFloat(paramAtom[21]) || 0,
  pboc5: parseFloat(paramAtom[22]) || 0,
  povun2: parseFloat(paramAtom[25]) || 0,
  pval3: parseFloat(paramAtom[26]) || 0,
  valBoc: parseFloat(paramAtom[28]) || 0,
  pval5: parseFloat(paramAtom[29]) || 0,
  rcore: parseFloat(paramAtom[30]) || 0,
  ecore: parseFloat(paramAtom[31]) || 0,
  acore: parseFloat(paramAtom[32]) || 0,
  lgcij: 0,
  lgre: 0,
});

/**
 * Create ParamGlobal parameters object - Pure factory
 */
const createParamGlobal = (paramGeneral) => Object.freeze({
  pboc1: parseFloat(paramGeneral[0]) || 0,
  pboc2: parseFloat(paramGeneral[1]) || 0,
  pcoa2: parseFloat(paramGeneral[2]) || 0,
  ptrip4: parseFloat(paramGeneral[3]) || 0,
  ptrip3: parseFloat(paramGeneral[4]) || 0,
  kc2: parseFloat(paramGeneral[5]) || 0,
  povun6: parseFloat(paramGeneral[6]) || 0,
  ptrip2: parseFloat(paramGeneral[7]) || 0,
  povun7: parseFloat(paramGeneral[8]) || 0,
  povun8: parseFloat(paramGeneral[9]) || 0,
  ptrip1: parseFloat(paramGeneral[10]) || 0,
  swa: parseFloat(paramGeneral[11]) || 0,
  swb: parseFloat(paramGeneral[12]) || 0,
  pval7: parseFloat(paramGeneral[14]) || 0,
  plp1: parseFloat(paramGeneral[15]) || 0,
  pval9: parseFloat(paramGeneral[16]) || 0,
  pval10: parseFloat(paramGeneral[17]) || 0,
  ppen2: parseFloat(paramGeneral[19]) || 0,
  ppen3: parseFloat(paramGeneral[20]) || 0,
  ppen4: parseFloat(paramGeneral[21]) || 0,
  ptor2: parseFloat(paramGeneral[23]) || 0,
  ptor3: parseFloat(paramGeneral[24]) || 0,
  pval4: parseFloat(paramGeneral[25]) || 0,
  pcot2: parseFloat(paramGeneral[27]) || 0,
  pvdW1: parseFloat(paramGeneral[28]) || 0,
  cutoff: parseFloat(paramGeneral[29] || 0) / 100,
  pcoa4: parseFloat(paramGeneral[30]) || 0,
  povun4: parseFloat(paramGeneral[31]) || 0,
  povun3: parseFloat(paramGeneral[32]) || 0,
  pval8: parseFloat(paramGeneral[33]) || 0,
  pcoa3: parseFloat(paramGeneral[38]) || 0,
});

/**
 * Create BondType parameters object - Pure factory
 */
const createBondType = (paramBond) => Object.freeze({
  at1: parseFloat(paramBond[0]) || 0,
  at2: parseFloat(paramBond[1]) || 0,
  DeSigma: parseFloat(paramBond[2]) || 0,
  DePi: parseFloat(paramBond[3]) || 0,
  DePipi: parseFloat(paramBond[4]) || 0,
  pbe1: parseFloat(paramBond[5]) || 0,
  pbo5: parseFloat(paramBond[6]) || 0,
  v13corr: parseFloat(paramBond[7]) || 0,
  pbo6: parseFloat(paramBond[8]) || 0,
  povun1: parseFloat(paramBond[9]) || 0,
  pbe2: parseFloat(paramBond[10]) || 0,
  pbo3: parseFloat(paramBond[11]) || 0,
  pbo4: parseFloat(paramBond[12]) || 0,
  pbo1: parseFloat(paramBond[14]) || 0,
  pbo2: parseFloat(paramBond[15]) || 0,
  roSigma: 0,
  roPi: 0,
  roPiPi: 0,
  pboc3: 0,
  pboc4: 0,
  pboc5: 0,
  rvdw: 0,
  gammaW: 0,
  gamma: 0,
  alpha: 0,
  rcore: 0,
  ecore: 0,
  acore: 0,
  lgcij: 0,
  lgre: 0,
  dij: 0,
});

/**
 * Create Angles parameters object - Pure factory
 */
const createAngles = (paramAngle) => Object.freeze({
  at1: parseFloat(paramAngle[0]) || 0,
  at2: parseFloat(paramAngle[1]) || 0,
  at3: parseFloat(paramAngle[2]) || 0,
  thetao: parseFloat(paramAngle[3]) || 0,
  pval1: parseFloat(paramAngle[4]) || 0,
  pval2: parseFloat(paramAngle[5]) || 0,
  pcoa1: parseFloat(paramAngle[6]) || 0,
  pval7: parseFloat(paramAngle[7]) || 0,
  pen1: parseFloat(paramAngle[8]) || 0,
  pval4: parseFloat(paramAngle[9]) || 0,
});

/**
 * Create Torsions parameters object - Pure factory
 */
const createTorsions = (paramTorsions) => Object.freeze({
  at1: parseFloat(paramTorsions[0]) || 0,
  at2: parseFloat(paramTorsions[1]) || 0,
  at3: parseFloat(paramTorsions[2]) || 0,
  at4: parseFloat(paramTorsions[3]) || 0,
  V1: parseFloat(paramTorsions[4]) || 0,
  V2: parseFloat(paramTorsions[5]) || 0,
  V3: parseFloat(paramTorsions[6]) || 0,
  p_tor1: parseFloat(paramTorsions[7]) || 0,
  p_cot1: parseFloat(paramTorsions[8]) || 0,
});

/**
 * Create Diagonal parameters object - Pure factory
 */
const createDiagonal = (paramDiag) => Object.freeze({
  at1: parseFloat(paramDiag[0]) || 0,
  at2: parseFloat(paramDiag[1]) || 0,
  dij: parseFloat(paramDiag[2]) || 0,
  RvdW: parseFloat(paramDiag[3]) || 0,
  alfa: parseFloat(paramDiag[4]) || 0,
  roSigma: parseFloat(paramDiag[5]) || 0,
  roPi: parseFloat(paramDiag[6]) || 0,
  roPiPi: parseFloat(paramDiag[7]) || 0,
});

/**
 * Create HBonds parameters object - Pure factory
 */
const createHBonds = (hydrogenBonds) => Object.freeze({
  at1: parseFloat(hydrogenBonds[0]) || 0,
  at2: parseFloat(hydrogenBonds[1]) || 0,
  at3: parseFloat(hydrogenBonds[2]) || 0,
  r_hb: parseFloat(hydrogenBonds[3]) || 0,
  p_hb1: parseFloat(hydrogenBonds[4]) || 0,
  p_hb2: parseFloat(hydrogenBonds[5]) || 0,
  p_hb3: parseFloat(hydrogenBonds[6]) || 0,
});

// ============================================================================
// PURE HELPER FUNCTIONS
// ============================================================================

/** Factory map for parameter type creation */
const parameterFactories = Object.freeze({
  atom: createAtomType,
  bond: createBondType,
  angle: createAngles,
  torsions: createTorsions,
  diag: createDiagonal,
  hbonds: createHBonds,
});

/**
 * Filter empty values and create parameter object
 */
const cleanArray = (actual, type) => {
  const newArray = actual.filter(Boolean);
  const factory = parameterFactories[type];
  return factory ? factory(newArray) : null;
};

/**
 * Normalize whitespace in a string
 */
const normalizeWhitespace = (str) => str?.replace(/\s\s+/g, ' ').trim() ?? '';

/**
 * Split line into tokens
 */
const tokenize = (line) => normalizeWhitespace(line).split(' ').filter(Boolean);

/**
 * Load parameter values from lines
 */
const loadAtoms = (lines, start, end, type) => {
  const safeEnd = Math.min(end, lines.length);
  const values = lines.slice(start, safeEnd);
  
  let atomData;
  
  if (type === 'atom') {
    atomData = values.flatMap(tokenize);
  } else if (type === 'bond') {
    atomData = values.slice(0, 2).flatMap(tokenize);
  } else {
    atomData = tokenize(values[0] ?? '');
  }
  
  return cleanArray(atomData, type);
};

/**
 * Parse integer from line
 */
const parseLineCount = (line) => {
  const match = line?.match(/[0-9]+/);
  return parseInt(match?.[0] ?? '0', 10);
};

/**
 * Safely set nested object property
 */
const setNestedProperty = (obj, keys, value) => {
  const result = { ...obj };
  let current = result;
  
  for (let i = 0; i < keys.length - 1; i++) {
    const key = keys[i];
    current[key] = current[key] ? { ...current[key] } : {};
    current = current[key];
  }
  
  current[keys[keys.length - 1]] = value;
  return result;
};

/**
 * Combine one-body parameters into two-body parameters
 */
const combineParameters = (onebody, twobody) => {
  const result = { ...twobody };
  const keys = Object.keys(onebody);
  
  keys.forEach(i => {
    keys.forEach(j => {
      if (!result[i]?.[j]) return;
      
      const p1 = onebody[i];
      const p2 = onebody[j];
      if (!p1 || !p2) return;
      
      // Combine parameters using geometric means
      const combined = {
        ...result[i][j],
        roSigma: 0.5 * (p1.roSigma + p2.roSigma),
        roPi: 0.5 * (p1.roPi + p2.roPi),
        roPiPi: 0.5 * (p1.roPiPi + p2.roPiPi),
        pboc3: Math.sqrt(Math.abs(p1.pboc3 * p2.pboc3)),
        pboc4: Math.sqrt(Math.abs(p1.pboc4 * p2.pboc4)),
        pboc5: Math.sqrt(Math.abs(p1.pboc5 * p2.pboc5)),
        dij: Math.sqrt(Math.abs(p1.dij * p2.dij)),
        alpha: Math.sqrt(Math.abs(p1.alpha * p2.alpha)),
        rvdw: 2.0 * Math.sqrt(Math.abs(p1.rvdw * p2.rvdw)),
        gammaW: Math.sqrt(Math.abs(p1.gammaW * p2.gammaW)),
        gamma: (p1.gamma * p2.gamma) !== 0 
          ? Math.pow(Math.abs(p1.gamma * p2.gamma), -1.5) 
          : 0,
        rcore: Math.sqrt(Math.abs(p1.rcore * p2.rcore)),
        ecore: Math.sqrt(Math.abs(p1.ecore * p2.ecore)),
        acore: Math.sqrt(Math.abs(p1.acore * p2.acore)),
      };
      
      if (!result[i]) result[i] = {};
      result[i][j] = combined;
    });
  });
  
  return result;
};

// ============================================================================
// MAIN PARSER
// ============================================================================

/**
 * Parse ReaxFF parameter file content - Main entry point
 * @param {string} text - File content
 * @returns {Object} Parsed parameters
 */
export const parseParameterFile = (text) => {
  logFile.info('Starting ReaxFF file parsing');
  
  try {
    // Normalize line endings
    const normalizedText = text.replace(/\r\n/g, '\n').replace(/\r/g, '\n');
    const lines = normalizedText.split('\n');
    
    let lineIndex = 1;
    const maxAtomTypes = 50;
    
    // Initialize parameter containers
    const onebody_parameters = {};
    const twobody_parameters = {};
    const diagonalAtom = {};
    const threebody_parameters = {};
    const fourbody_parameters = {};
    const hydrogenbonds = {};
    
    // Parse global parameters
    const globalParamsCount = parseLineCount(lines[lineIndex]);
    lineIndex++;
    
    const globalParams = [];
    for (let j = 0; j < globalParamsCount && lineIndex < lines.length; j++, lineIndex++) {
      const parts = tokenize(lines[lineIndex]);
      if (parts.length > 1) {
        globalParams[j] = parts[1];
      }
    }
    
    const paramGeneral = createParamGlobal(globalParams);
    logFile.debug('Global parameters parsed', { count: globalParamsCount });
    
    // Parse one-body (atom) parameters
    const onebodyLen = 4;
    const atomCount = parseLineCount(lines[lineIndex]);
    
    for (let i = 0, idx = lineIndex + onebodyLen; i < atomCount; i++, idx += onebodyLen) {
      if (idx < lines.length) {
        onebody_parameters[i] = loadAtoms(lines, idx, idx + onebodyLen, 'atom');
      }
    }
    lineIndex += (atomCount + 1) * onebodyLen;
    logFile.debug('One-body parameters parsed', { count: atomCount });
    
    // Parse two-body (bond) parameters
    if (lineIndex < lines.length) {
      const twobodyLen = 2;
      const bondCount = parseLineCount(lines[lineIndex]);
      
      for (let i = 0, idx = lineIndex + twobodyLen; i < bondCount; i++, idx += twobodyLen) {
        if (idx >= lines.length) break;
        
        const tokens = tokenize(lines[idx]);
        const type0 = parseInt(tokens[0] ?? '0', 10) - 1;
        const type1 = parseInt(tokens[1] ?? '0', 10) - 1;
        
        if (type0 >= 0 && type1 >= 0 && type0 < maxAtomTypes && type1 < maxAtomTypes) {
          if (!twobody_parameters[type0]) twobody_parameters[type0] = {};
          if (!twobody_parameters[type1]) twobody_parameters[type1] = {};
          
          const bondParams = loadAtoms(lines, idx, idx + twobodyLen, 'bond');
          twobody_parameters[type0][type1] = bondParams;
          twobody_parameters[type1][type0] = bondParams;
        }
      }
      lineIndex += (bondCount + 1) * twobodyLen;
      logFile.debug('Two-body parameters parsed', { count: bondCount });
    }
    
    // Parse off-diagonal parameters
    if (lineIndex < lines.length) {
      const diagCount = parseLineCount(lines[lineIndex]);
      
      for (let i = 1; i <= diagCount && lineIndex + i < lines.length; i++) {
        const tokens = tokenize(lines[lineIndex + i]);
        const type0 = parseInt(tokens[0] ?? '0', 10) - 1;
        const type1 = parseInt(tokens[1] ?? '0', 10) - 1;
        
        if (type0 >= 0 && type1 >= 0 && type0 < maxAtomTypes && type1 < maxAtomTypes) {
          if (!diagonalAtom[type0]) diagonalAtom[type0] = {};
          if (!diagonalAtom[type1]) diagonalAtom[type1] = {};
          
          const diagParams = loadAtoms(lines, lineIndex + i, lineIndex + i + 1, 'diag');
          diagonalAtom[type0][type1] = diagParams;
          diagonalAtom[type1][type0] = diagParams;
        }
      }
      lineIndex += diagCount + 1;
      logFile.debug('Diagonal parameters parsed', { count: diagCount });
    }
    
    // Parse three-body (angle) parameters
    if (lineIndex < lines.length) {
      const angleCount = parseLineCount(lines[lineIndex]);
      
      for (let i = 1; i <= angleCount && lineIndex + i < lines.length; i++) {
        const tokens = tokenize(lines[lineIndex + i]);
        const type0 = parseInt(tokens[0] ?? '0', 10) - 1;
        const type1 = parseInt(tokens[1] ?? '0', 10) - 1;
        const type2 = parseInt(tokens[2] ?? '0', 10) - 1;
        
        if (type0 >= 0 && type1 >= 0 && type2 >= 0 &&
            type0 < maxAtomTypes && type1 < maxAtomTypes && type2 < maxAtomTypes) {
          // Initialize nested structure
          if (!threebody_parameters[type0]) threebody_parameters[type0] = {};
          if (!threebody_parameters[type0][type1]) threebody_parameters[type0][type1] = {};
          if (!threebody_parameters[type2]) threebody_parameters[type2] = {};
          if (!threebody_parameters[type2][type1]) threebody_parameters[type2][type1] = {};
          
          const angleParams = loadAtoms(lines, lineIndex + i, lineIndex + i + 1, 'angle');
          threebody_parameters[type0][type1][type2] = angleParams;
          threebody_parameters[type2][type1][type0] = angleParams;
        }
      }
      lineIndex += angleCount + 1;
      logFile.debug('Three-body parameters parsed', { count: angleCount });
    }
    
    // Parse four-body (torsion) parameters
    if (lineIndex < lines.length) {
      const torsionCount = parseLineCount(lines[lineIndex]);
      
      for (let i = 1; i <= torsionCount && lineIndex + i < lines.length; i++) {
        const tokens = tokenize(lines[lineIndex + i]);
        const type0 = parseInt(tokens[0] ?? '0', 10) - 1;
        const type1 = parseInt(tokens[1] ?? '0', 10) - 1;
        const type2 = parseInt(tokens[2] ?? '0', 10) - 1;
        const type3 = parseInt(tokens[3] ?? '0', 10) - 1;
        
        if (type0 >= 0 && type1 >= 0 && type2 >= 0 && type3 >= 0 &&
            type0 < maxAtomTypes && type1 < maxAtomTypes && 
            type2 < maxAtomTypes && type3 < maxAtomTypes) {
          // Initialize nested structure
          if (!fourbody_parameters[type0]) fourbody_parameters[type0] = {};
          if (!fourbody_parameters[type0][type1]) fourbody_parameters[type0][type1] = {};
          if (!fourbody_parameters[type0][type1][type2]) fourbody_parameters[type0][type1][type2] = {};
          if (!fourbody_parameters[type3]) fourbody_parameters[type3] = {};
          if (!fourbody_parameters[type3][type2]) fourbody_parameters[type3][type2] = {};
          if (!fourbody_parameters[type3][type2][type1]) fourbody_parameters[type3][type2][type1] = {};
          
          const torsionParams = loadAtoms(lines, lineIndex + i, lineIndex + i + 1, 'torsions');
          fourbody_parameters[type0][type1][type2][type3] = torsionParams;
          fourbody_parameters[type3][type2][type1][type0] = torsionParams;
        }
      }
      lineIndex += torsionCount + 1;
      logFile.debug('Four-body parameters parsed', { count: torsionCount });
    }
    
    // Parse hydrogen bond parameters
    if (lineIndex < lines.length) {
      const hbondCount = parseLineCount(lines[lineIndex]);
      
      for (let i = 1; i <= hbondCount && lineIndex + i < lines.length; i++) {
        const tokens = tokenize(lines[lineIndex + i]);
        const type0 = parseInt(tokens[0] ?? '0', 10) - 1;
        const type1 = parseInt(tokens[1] ?? '0', 10) - 1;
        const type2 = parseInt(tokens[2] ?? '0', 10) - 1;
        
        if (type0 >= 0 && type1 >= 0 && type2 >= 0 &&
            type0 < maxAtomTypes && type1 < maxAtomTypes && type2 < maxAtomTypes) {
          if (!hydrogenbonds[type0]) hydrogenbonds[type0] = {};
          if (!hydrogenbonds[type0][type1]) hydrogenbonds[type0][type1] = {};
          if (!hydrogenbonds[type2]) hydrogenbonds[type2] = {};
          if (!hydrogenbonds[type2][type1]) hydrogenbonds[type2][type1] = {};
          
          const hbondParams = loadAtoms(lines, lineIndex + i, lineIndex + i + 1, 'hbonds');
          hydrogenbonds[type0][type1][type2] = hbondParams;
          hydrogenbonds[type2][type1][type0] = hbondParams;
        }
      }
      logFile.debug('Hydrogen bond parameters parsed', { count: hbondCount });
    }
    
    // Combine parameters
    const combinedTwobody = combineParameters(onebody_parameters, twobody_parameters);
    
    logFile.info('ReaxFF file parsing complete', {
      onebodyCount: Object.keys(onebody_parameters).length,
      twobodyCount: Object.keys(combinedTwobody).length,
    });
    
    return Object.freeze({
      paramGeneral,
      onebody_parameters,
      twobody_parameters: combinedTwobody,
      threebody_parameters,
      fourbody_parameters,
      diagonalAtom,
      hydrogenbonds,
    });
    
  } catch (error) {
    logFile.error('Failed to parse ReaxFF file', { error: error.message });
    throw new Error(`Failed to parse parameter file: ${error.message}`);
  }
};

export default { parseParameterFile };
