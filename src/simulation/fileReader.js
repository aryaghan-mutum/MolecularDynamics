/**
 * ReaxFF Parameter File Parser
 * Parses ReaxFF force field parameter files
 */

/**
 * Atom type parameters
 */
class AtomType {
  constructor(paramAtom) {
    this.atomID = paramAtom[0] || '';
    this.roSigma = parseFloat(paramAtom[1]) || 0;
    this.valency = parseFloat(paramAtom[2]) || 0;
    this.atmcMass = parseFloat(paramAtom[3]) || 0;
    this.rvdw = parseFloat(paramAtom[4]) || 0;
    this.dij = parseFloat(paramAtom[5]) || 0;
    this.gamma = parseFloat(paramAtom[6]) || 0;
    this.roPi = parseFloat(paramAtom[7]) || 0;
    this.valE = parseFloat(paramAtom[8]) || 0;
    this.alpha = parseFloat(paramAtom[9]) || 0;
    this.gammaW = parseFloat(paramAtom[10]) || 0;
    this.valAngle = parseFloat(paramAtom[11]) || 0;
    this.povun5 = parseFloat(paramAtom[12]) || 0;
    this.chiEEM = parseFloat(paramAtom[14]) || 0;
    this.etaEEM = parseFloat(2 * (paramAtom[15] || 0));
    this.nlp_opt = parseFloat(paramAtom[16]) || 0;
    this.roPiPi = parseFloat(paramAtom[17]) || 0;
    this.plp2 = parseFloat(paramAtom[18]) || 0;
    this.heatInc = parseFloat(paramAtom[19]) || 0;
    this.pboc4 = parseFloat(paramAtom[20]) || 0;
    this.pboc3 = parseFloat(paramAtom[21]) || 0;
    this.pboc5 = parseFloat(paramAtom[22]) || 0;
    this.povun2 = parseFloat(paramAtom[25]) || 0;
    this.pval3 = parseFloat(paramAtom[26]) || 0;
    this.valBoc = parseFloat(paramAtom[28]) || 0;
    this.pval5 = parseFloat(paramAtom[29]) || 0;
    this.rcore = parseFloat(paramAtom[30]) || 0;
    this.ecore = parseFloat(paramAtom[31]) || 0;
    this.acore = parseFloat(paramAtom[32]) || 0;
    this.lgcij = 0;
    this.lgre = 0;
  }
}

/**
 * Global parameters
 */
class ParamGlobal {
  constructor(paramGeneral) {
    this.pboc1 = parseFloat(paramGeneral[0]) || 0;
    this.pboc2 = parseFloat(paramGeneral[1]) || 0;
    this.pcoa2 = parseFloat(paramGeneral[2]) || 0;
    this.ptrip4 = parseFloat(paramGeneral[3]) || 0;
    this.ptrip3 = parseFloat(paramGeneral[4]) || 0;
    this.kc2 = parseFloat(paramGeneral[5]) || 0;
    this.povun6 = parseFloat(paramGeneral[6]) || 0;
    this.ptrip2 = parseFloat(paramGeneral[7]) || 0;
    this.povun7 = parseFloat(paramGeneral[8]) || 0;
    this.povun8 = parseFloat(paramGeneral[9]) || 0;
    this.ptrip1 = parseFloat(paramGeneral[10]) || 0;
    this.swa = parseFloat(paramGeneral[11]) || 0;
    this.swb = parseFloat(paramGeneral[12]) || 0;
    this.pval7 = parseFloat(paramGeneral[14]) || 0;
    this.plp1 = parseFloat(paramGeneral[15]) || 0;
    this.pval9 = parseFloat(paramGeneral[16]) || 0;
    this.pval10 = parseFloat(paramGeneral[17]) || 0;
    this.ppen2 = parseFloat(paramGeneral[19]) || 0;
    this.ppen3 = parseFloat(paramGeneral[20]) || 0;
    this.ppen4 = parseFloat(paramGeneral[21]) || 0;
    this.ptor2 = parseFloat(paramGeneral[23]) || 0;
    this.ptor3 = parseFloat(paramGeneral[24]) || 0;
    this.pval4 = parseFloat(paramGeneral[25]) || 0;
    this.pcot2 = parseFloat(paramGeneral[27]) || 0;
    this.pvdW1 = parseFloat(paramGeneral[28]) || 0;
    this.cutoff = parseFloat(paramGeneral[29] || 0) / 100;
    this.pcoa4 = parseFloat(paramGeneral[30]) || 0;
    this.povun4 = parseFloat(paramGeneral[31]) || 0;
    this.povun3 = parseFloat(paramGeneral[32]) || 0;
    this.pval8 = parseFloat(paramGeneral[33]) || 0;
    this.pcoa3 = parseFloat(paramGeneral[38]) || 0;
  }
}

/**
 * Bond type parameters
 */
class BondType {
  constructor(paramBond) {
    this.at1 = parseFloat(paramBond[0]) || 0;
    this.at2 = parseFloat(paramBond[1]) || 0;
    this.DeSigma = parseFloat(paramBond[2]) || 0;
    this.DePi = parseFloat(paramBond[3]) || 0;
    this.DePipi = parseFloat(paramBond[4]) || 0;
    this.pbe1 = parseFloat(paramBond[5]) || 0;
    this.pbo5 = parseFloat(paramBond[6]) || 0;
    this.v13corr = parseFloat(paramBond[7]) || 0;
    this.pbo6 = parseFloat(paramBond[8]) || 0;
    this.povun1 = parseFloat(paramBond[9]) || 0;
    this.pbe2 = parseFloat(paramBond[10]) || 0;
    this.pbo3 = parseFloat(paramBond[11]) || 0;
    this.pbo4 = parseFloat(paramBond[12]) || 0;
    this.pbo1 = parseFloat(paramBond[14]) || 0;
    this.pbo2 = parseFloat(paramBond[15]) || 0;
    this.roSigma = 0;
    this.roPi = 0;
    this.roPiPi = 0;
    this.pboc3 = 0;
    this.pboc4 = 0;
    this.pboc5 = 0;
    this.rvdw = 0;
    this.gammaW = 0;
    this.gamma = 0;
    this.alpha = 0;
    this.rcore = 0;
    this.ecore = 0;
    this.acore = 0;
    this.lgcij = 0;
    this.lgre = 0;
    this.dij = 0;
  }
}

/**
 * Angle parameters
 */
class Angles {
  constructor(paramAngle) {
    this.at1 = parseFloat(paramAngle[0]) || 0;
    this.at2 = parseFloat(paramAngle[1]) || 0;
    this.at3 = parseFloat(paramAngle[2]) || 0;
    this.thetao = parseFloat(paramAngle[3]) || 0;
    this.pval1 = parseFloat(paramAngle[4]) || 0;
    this.pval2 = parseFloat(paramAngle[5]) || 0;
    this.pcoa1 = parseFloat(paramAngle[6]) || 0;
    this.pval7 = parseFloat(paramAngle[7]) || 0;
    this.pen1 = parseFloat(paramAngle[8]) || 0;
    this.pval4 = parseFloat(paramAngle[9]) || 0;
  }
}

/**
 * Torsion parameters
 */
class Torsions {
  constructor(paramTorsions) {
    this.at1 = parseFloat(paramTorsions[0]) || 0;
    this.at2 = parseFloat(paramTorsions[1]) || 0;
    this.at3 = parseFloat(paramTorsions[2]) || 0;
    this.at4 = parseFloat(paramTorsions[3]) || 0;
    this.V1 = parseFloat(paramTorsions[4]) || 0;
    this.V2 = parseFloat(paramTorsions[5]) || 0;
    this.V3 = parseFloat(paramTorsions[6]) || 0;
    this.p_tor1 = parseFloat(paramTorsions[7]) || 0;
    this.p_cot1 = parseFloat(paramTorsions[8]) || 0;
  }
}

/**
 * Off-diagonal parameters
 */
class Diagonal {
  constructor(paramDiag) {
    this.at1 = parseFloat(paramDiag[0]) || 0;
    this.at2 = parseFloat(paramDiag[1]) || 0;
    this.dij = parseFloat(paramDiag[2]) || 0;
    this.RvdW = parseFloat(paramDiag[3]) || 0;
    this.alfa = parseFloat(paramDiag[4]) || 0;
    this.roSigma = parseFloat(paramDiag[5]) || 0;
    this.roPi = parseFloat(paramDiag[6]) || 0;
    this.roPiPi = parseFloat(paramDiag[7]) || 0;
  }
}

/**
 * Hydrogen bond parameters
 */
class HBonds {
  constructor(hydrogenBonds) {
    this.at1 = parseFloat(hydrogenBonds[0]) || 0;
    this.at2 = parseFloat(hydrogenBonds[1]) || 0;
    this.at3 = parseFloat(hydrogenBonds[2]) || 0;
    this.r_hb = parseFloat(hydrogenBonds[3]) || 0;
    this.p_hb1 = parseFloat(hydrogenBonds[4]) || 0;
    this.p_hb2 = parseFloat(hydrogenBonds[5]) || 0;
    this.p_hb3 = parseFloat(hydrogenBonds[6]) || 0;
  }
}

/**
 * Clean array and create parameter object
 */
function cleanArray(actual, type) {
  const newArray = actual.filter(item => item);

  switch (type) {
    case 'atom': return new AtomType(newArray);
    case 'bond': return new BondType(newArray);
    case 'angle': return new Angles(newArray);
    case 'torsions': return new Torsions(newArray);
    case 'diag': return new Diagonal(newArray);
    case 'hbonds': return new HBonds(newArray);
    default: return null;
  }
}

/**
 * Load parameter values from lines
 */
function loadAtoms(lines, start, end, type) {
  const values = [];
  for (let i = start, j = 0; i < end; i++, j++) {
    values[j] = lines[i];
  }

  let atomData;
  if (type === 'atom') {
    atomData = values[0]?.replace(/\s\s+/g, ' ').split(' ') || [];
    for (let k = 1; k < values.length; k++) {
      atomData.push(...(values[k]?.replace(/\s\s+/g, ' ').split(' ') || []));
    }
  } else if (type === 'bond') {
    atomData = values[0]?.replace(/\s\s+/g, ' ').split(' ') || [];
    if (values[1]) {
      atomData.push(...values[1].replace(/\s\s+/g, ' ').split(' '));
    }
  } else {
    atomData = values[0]?.replace(/\s\s+/g, ' ').split(' ') || [];
  }

  return cleanArray(atomData, type);
}

/**
 * Create multi-dimensional array
 */
function createArray(...dimensions) {
  if (dimensions.length === 1) {
    return new Array(dimensions[0]);
  }
  
  const arr = new Array(dimensions[0]);
  const subDimensions = dimensions.slice(1);
  
  for (let i = 0; i < dimensions[0]; i++) {
    arr[i] = createArray(...subDimensions);
  }
  
  return arr;
}

/**
 * Combine one-body parameters into two-body parameters
 */
function combineParameters(onebody_parameters, twobody_parameters) {
  for (let i = 0; i < onebody_parameters.length; i++) {
    for (let j = 0; j < onebody_parameters.length; j++) {
      if (!twobody_parameters[i]?.[j]) continue;
      
      const paramAtom1 = twobody_parameters[i][j];
      const p1 = onebody_parameters[i];
      const p2 = onebody_parameters[j];

      if (!p1 || !p2) continue;

      paramAtom1.roSigma = 0.5 * (p1.roSigma + p2.roSigma);
      paramAtom1.roPi = 0.5 * (p1.roPi + p2.roPi);
      paramAtom1.roPiPi = 0.5 * (p1.roPiPi + p2.roPiPi);
      paramAtom1.pboc3 = Math.sqrt(p1.pboc3 * p2.pboc3);
      paramAtom1.pboc4 = Math.sqrt(p1.pboc4 * p2.pboc4);
      paramAtom1.pboc5 = Math.sqrt(p1.pboc5 * p2.pboc5);
      paramAtom1.dij = Math.sqrt(p1.dij * p2.dij);
      paramAtom1.alpha = Math.sqrt(p1.alpha * p2.alpha);
      paramAtom1.rvdw = 2.0 * Math.sqrt(p1.rvdw * p2.rvdw);
      paramAtom1.gammaW = Math.sqrt(p1.gammaW * p2.gammaW);
      paramAtom1.gamma = Math.pow(p1.gamma * p2.gamma, -1.5);
      paramAtom1.rcore = Math.sqrt(p1.rcore * p2.rcore);
      paramAtom1.ecore = Math.sqrt(p1.ecore * p2.ecore);
      paramAtom1.acore = Math.sqrt(p1.acore * p2.acore);
    }
  }
}

/**
 * Parse ReaxFF parameter file content
 * @param {string} text - File content
 * @returns {Object} Parsed parameters
 */
export function parseParameterFile(text) {
  const arrayOfLines = text.split('\n ');
  const globalParams = [];
  
  let count = 1;
  const onebodyLen = 4;
  const twobodyLen = 2;

  // Parse global parameters
  let elementLen = parseInt(arrayOfLines[count]?.match(/[0-9][0-9]*/)?.[0] || '0');
  count++;
  
  for (let i = count, j = 0; j < elementLen; count++, i++, j++) {
    globalParams[j] = arrayOfLines[i]?.replace(/\s\s+/g, ' ').split(' ')[1];
  }
  
  const paramGeneral = new ParamGlobal(globalParams);

  // Parse atom count
  const numAtoms = parseInt(arrayOfLines[count]?.match(/[0-9][0-9]*/)?.[0] || '0');

  // Initialize arrays
  const onebody_parameters = new Array(numAtoms);
  const twobody_parameters = createArray(numAtoms, numAtoms);
  const diagonalAtom = createArray(numAtoms, numAtoms);
  const threebody_parameters = createArray(numAtoms, numAtoms, numAtoms);
  const fourbody_parameters = createArray(numAtoms, numAtoms, numAtoms, numAtoms);
  const hydrogenbonds = createArray(numAtoms, numAtoms, numAtoms);

  // Parse one-body parameters
  elementLen = parseInt(arrayOfLines[count]?.match(/[0-9][0-9]*/)?.[0] || '0');
  let onebodyCount = 0;
  
  for (let i = count + onebodyLen; i <= count + (elementLen * onebodyLen); i += onebodyLen) {
    onebody_parameters[onebodyCount] = loadAtoms(arrayOfLines, i, i + onebodyLen, 'atom');
    onebodyCount++;
  }
  count += ((elementLen + 1) * onebodyLen);

  // Parse two-body parameters
  elementLen = parseInt(arrayOfLines[count]?.match(/[0-9][0-9]*/)?.[0] || '0');
  
  for (let i = count + twobodyLen; i <= count + (elementLen * twobodyLen); i += twobodyLen) {
    const str = arrayOfLines[i];
    const atomName = str?.trim().split(/\s+/);
    const type0 = parseInt(atomName?.[0] || '0') - 1;
    const type1 = parseInt(atomName?.[1] || '0') - 1;
    
    if (type0 >= 0 && type1 >= 0) {
      twobody_parameters[type0][type1] = loadAtoms(arrayOfLines, i, i + twobodyLen, 'bond');
      twobody_parameters[type1][type0] = twobody_parameters[type0][type1];
    }
  }
  count += ((elementLen + 1) * twobodyLen);

  // Parse diagonal parameters
  elementLen = parseInt(arrayOfLines[count]?.match(/[0-9][0-9]*/)?.[0] || '0');
  
  for (let i = count + 1; i <= count + elementLen; i++) {
    const str = arrayOfLines[i];
    const atomName = str?.trim().split(/\s+/);
    const type0 = parseInt(atomName?.[0] || '0') - 1;
    const type1 = parseInt(atomName?.[1] || '0') - 1;
    
    if (type0 >= 0 && type1 >= 0) {
      diagonalAtom[type0][type1] = loadAtoms(arrayOfLines, i, i + 1, 'diag');
      diagonalAtom[type1][type0] = diagonalAtom[type0][type1];
    }
  }
  count += elementLen + 1;

  // Parse three-body parameters
  elementLen = parseInt(arrayOfLines[count]?.match(/[0-9][0-9]*/)?.[0] || '0');
  
  for (let i = count + 1; i <= count + elementLen; i++) {
    const str = arrayOfLines[i];
    const atomName = str?.trim().split(/\s+/);
    const type0 = parseInt(atomName?.[0] || '0') - 1;
    const type1 = parseInt(atomName?.[1] || '0') - 1;
    const type2 = parseInt(atomName?.[2] || '0') - 1;
    
    if (type0 >= 0 && type1 >= 0 && type2 >= 0) {
      threebody_parameters[type0][type1][type2] = loadAtoms(arrayOfLines, i, i + 1, 'angle');
      threebody_parameters[type2][type1][type0] = threebody_parameters[type0][type1][type2];
    }
  }
  count += elementLen + 1;

  // Parse four-body parameters
  elementLen = parseInt(arrayOfLines[count]?.match(/[0-9][0-9]*/)?.[0] || '0');
  
  for (let i = count + 1; i <= count + elementLen; i++) {
    const str = arrayOfLines[i];
    const atomName = str?.trim().split(/\s+/);
    const type0 = parseInt(atomName?.[0] || '0') - 1;
    const type1 = parseInt(atomName?.[1] || '0') - 1;
    const type2 = parseInt(atomName?.[2] || '0') - 1;
    const type3 = parseInt(atomName?.[3] || '0') - 1;
    
    if (type0 >= 0 && type1 >= 0 && type2 >= 0 && type3 >= 0) {
      fourbody_parameters[type0][type1][type2][type3] = loadAtoms(arrayOfLines, i, i + 1, 'torsions');
      fourbody_parameters[type3][type2][type1][type0] = fourbody_parameters[type0][type1][type2][type3];
    }
  }
  count += elementLen + 1;

  // Parse hydrogen bond parameters
  elementLen = parseInt(arrayOfLines[count]?.match(/[0-9][0-9]*/)?.[0] || '0');
  
  for (let i = count + 1; i <= count + elementLen; i++) {
    const str = arrayOfLines[i];
    const atomName = str?.trim().split(/\s+/);
    const type0 = parseInt(atomName?.[0] || '0') - 1;
    const type1 = parseInt(atomName?.[1] || '0') - 1;
    const type2 = parseInt(atomName?.[2] || '0') - 1;
    
    if (type0 >= 0 && type1 >= 0 && type2 >= 0) {
      hydrogenbonds[type0][type1][type2] = loadAtoms(arrayOfLines, i, i + 1, 'hbonds');
      hydrogenbonds[type2][type1][type0] = hydrogenbonds[type0][type1][type2];
    }
  }

  // Combine parameters
  combineParameters(onebody_parameters, twobody_parameters);

  return {
    paramGeneral,
    onebody_parameters,
    twobody_parameters,
    threebody_parameters,
    fourbody_parameters,
    diagonalAtom,
    hydrogenbonds,
  };
}

export default { parseParameterFile };
