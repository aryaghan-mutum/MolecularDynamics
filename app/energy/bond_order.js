/**
 * Bond Order Calculations for ReaxFF
 * 
 * A fundamental assumption of ReaxFF is that the bond order BO'ij between a pair of atoms
 * can be obtained directly from the interatomic distance rij as given in Equation (2).
 * In calculating the bond orders, ReaxFF distinguishes between contributions from 
 * sigma bonds, pi-bonds and double pi bonds.
 */

/**
 * Initialize bond order arrays for a world
 * @param {number} numAtoms - Number of atoms
 * @returns {Object} Initialized bond order arrays
 */
export function initializeBondOrderArrays(numAtoms) {
  const createMatrix = () => {
    const matrix = new Array(numAtoms);
    for (let i = 0; i < numAtoms; i++) {
      matrix[i] = new Array(numAtoms).fill(0.0);
    }
    return matrix;
  };

  return {
    bond_order: createMatrix(),
    bond_order_sigma: createMatrix(),
    bond_order_pi: createMatrix(),
    bond_order_pi2: createMatrix(),
    bond_order_uncorr: createMatrix(),
    bond_order_uncorr_sigma: createMatrix(),
    bond_order_uncorr_pi: createMatrix(),
    bond_order_uncorr_pi2: createMatrix(),
    deltap: new Array(numAtoms).fill(0.0),
    deltap_boc: new Array(numAtoms).fill(0.0),
    deltap_i: new Array(numAtoms).fill(0.0),
    vlpex: new Array(numAtoms).fill(0.0),
    n_lp: new Array(numAtoms).fill(0.0),
    deltap_i_lp: new Array(numAtoms).fill(0.0),
    delta_i: new Array(numAtoms).fill(0.0),
    dDeltap_i_lp: new Array(numAtoms).fill(0.0)
  };
}

/**
 * Calculate uncorrected bond orders (Equation 2)
 * @param {World} world - World object
 * @param {Object} arrays - Bond order arrays
 */
export function calculateUncorrectedBondOrders(world, arrays) {
  const { atoms, paramGeneral, onebody_parameters, twobody_parameters } = world;
  const { bond_order_uncorr, bond_order_uncorr_sigma, bond_order_uncorr_pi, bond_order_uncorr_pi2 } = arrays;

  for (let i = 0; i < atoms.length; i++) {
    for (let j = i + 1; j < atoms.length; j++) {
      const atom_i = atoms[i];
      const atom_j = atoms[j];

      const dx = atom_i.pos.x - atom_j.pos.x;
      const dy = atom_i.pos.y - atom_j.pos.y;
      const dz = atom_i.pos.z - atom_j.pos.z;
      const r_ij = Math.sqrt(dx * dx + dy * dy + dz * dz);

      const sbp_i = onebody_parameters[atom_i.type];
      const sbp_j = onebody_parameters[atom_j.type];
      const twbp = twobody_parameters[atom_i.type][atom_j.type];

      let BO_s = 0.0, BO_pi = 0.0, BO_pi2 = 0.0;
      let C12 = 0.0, C34 = 0.0, C56 = 0.0;

      // Sigma bond contribution
      if (sbp_i.roSigma > 0.0 && sbp_j.roSigma > 0.0) {
        C12 = twbp.pbo1 * Math.pow(r_ij / twbp.roSigma, twbp.pbo2);
        BO_s = (1.0 + paramGeneral.cutoff) * Math.exp(C12);
      }

      // Pi bond contribution
      if (sbp_i.roPi > 0.0 && sbp_j.roPi > 0.0) {
        C34 = twbp.pbo3 * Math.pow(r_ij / twbp.roPi, twbp.pbo4);
        BO_pi = Math.exp(C34);
      }

      // Double pi bond contribution
      if (sbp_i.roPiPi > 0.0 && sbp_j.roPiPi > 0.0) {
        C56 = twbp.pbo5 * Math.pow(r_ij / twbp.roPiPi, twbp.pbo6);
        BO_pi2 = Math.exp(C56);
      }

      // Store uncorrected bond orders (symmetric)
      bond_order_uncorr_sigma[i][j] = BO_s;
      bond_order_uncorr_sigma[j][i] = BO_s;
      bond_order_uncorr_pi[i][j] = BO_pi;
      bond_order_uncorr_pi[j][i] = BO_pi;
      bond_order_uncorr_pi2[i][j] = BO_pi2;
      bond_order_uncorr_pi2[j][i] = BO_pi2;

      // Total uncorrected bond order (Equation 2)
      bond_order_uncorr[i][j] = BO_s + BO_pi + BO_pi2;
      bond_order_uncorr[j][i] = bond_order_uncorr[i][j];

      // Apply cutoff
      if (bond_order_uncorr[i][j] > paramGeneral.cutoff) {
        bond_order_uncorr[i][j] -= paramGeneral.cutoff;
        bond_order_uncorr[j][i] -= paramGeneral.cutoff;
        bond_order_uncorr_sigma[i][j] -= paramGeneral.cutoff;
        bond_order_uncorr_sigma[j][i] -= paramGeneral.cutoff;
      }
    }
  }
}

/**
 * Calculate delta prime values (Equations 3a-3b)
 * @param {World} world - World object
 * @param {Object} arrays - Bond order arrays
 */
export function calculateDeltaPrime(world, arrays) {
  const { atoms, onebody_parameters } = world;
  const { bond_order_uncorr, deltap, deltap_boc, delta_i } = arrays;

  for (let i = 0; i < atoms.length; i++) {
    const sbp_i = onebody_parameters[atoms[i].type];

    let sum = 0.0;
    for (let j = 0; j < atoms.length; j++) {
      sum += bond_order_uncorr[i][j];
    }
    
    deltap[i] = sum - sbp_i.valency;     // (Equation 3a)
    deltap_boc[i] = sum - sbp_i.valBoc;  // (Equation 3b)
    delta_i[i] = sum - sbp_i.valency;    // For overCoordination
  }
}

/**
 * Calculate corrected bond orders (Equations 4a-4f)
 * @param {World} world - World object
 * @param {Object} arrays - Bond order arrays
 */
export function calculateCorrectedBondOrders(world, arrays) {
  const { atoms, paramGeneral, onebody_parameters, twobody_parameters } = world;
  const { 
    bond_order, bond_order_sigma, bond_order_pi, bond_order_pi2,
    bond_order_uncorr, bond_order_uncorr_sigma, bond_order_uncorr_pi, bond_order_uncorr_pi2,
    deltap, deltap_boc 
  } = arrays;

  const p_boc1 = paramGeneral.pboc1;
  const p_boc2 = paramGeneral.pboc2;

  for (let i = 0; i < atoms.length; i++) {
    const sbp_i = onebody_parameters[atoms[i].type];
    const val_i = sbp_i.valency;
    const deltap_i = deltap[i];
    const deltap_boc_i = deltap_boc[i];

    for (let j = i + 1; j < atoms.length; j++) {
      const sbp_j = onebody_parameters[atoms[j].type];
      const val_j = sbp_j.valency;
      const twbp = twobody_parameters[atoms[i].type][atoms[j].type];

      const deltap_j = deltap[j];
      const deltap_boc_j = deltap_boc[j];

      // Correction for overcoordination (Equations 4b-4d)
      const exp_p1i = Math.exp(-p_boc1 * deltap_i);
      const exp_p2i = Math.exp(-p_boc2 * deltap_i);
      const exp_p1j = Math.exp(-p_boc1 * deltap_j);
      const exp_p2j = Math.exp(-p_boc2 * deltap_j);

      const f2 = exp_p1i + exp_p1j;  // (Equation 4c)
      const f3 = -1.0 / p_boc2 * Math.log(0.5 * (exp_p2i + exp_p2j));  // (Equation 4d)
      const f1 = 0.5 * ((val_i + f2) / (val_i + f2 + f3) + 
                        (val_j + f2) / (val_j + f2 + f3));  // (Equation 4b)

      // Correction for 1-3 bond orders (Equations 4e-4f)
      const BO = bond_order_uncorr[i][j];
      const exp_f4 = Math.exp(-(twbp.pboc4 * (BO * BO) - deltap_boc_i) * twbp.pboc3 + twbp.pboc5);
      const exp_f5 = Math.exp(-(twbp.pboc4 * (BO * BO) - deltap_boc_j) * twbp.pboc3 + twbp.pboc5);

      const f4 = 1.0 / (1.0 + exp_f4);  // (Equation 4e)
      const f5 = 1.0 / (1.0 + exp_f5);  // (Equation 4f)

      // Corrected bond order components
      const BO_s_corr = bond_order_uncorr_sigma[i][j] * f1 * f4 * f5;
      const BO_pi_corr = bond_order_uncorr_pi[i][j] * f1 * f1 * f4 * f5;
      const BO_pi2_corr = bond_order_uncorr_pi2[i][j] * f1 * f1 * f4 * f5;

      // Total corrected bond order (Equation 4a)
      bond_order[i][j] = BO_s_corr + BO_pi_corr + BO_pi2_corr;
      bond_order[j][i] = bond_order[i][j];

      bond_order_sigma[i][j] = BO_s_corr;
      bond_order_sigma[j][i] = BO_s_corr;

      bond_order_pi[i][j] = BO_pi_corr;
      bond_order_pi[j][i] = BO_pi_corr;

      bond_order_pi2[i][j] = BO_pi2_corr;
      bond_order_pi2[j][i] = BO_pi2_corr;
    }
  }
}

/**
 * Calculate corrected overcoordination (Equation 5)
 * @param {World} world - World object
 * @param {Object} arrays - Bond order arrays
 */
export function calculateCorrectedOvercoordination(world, arrays) {
  const { atoms, onebody_parameters } = world;
  const { bond_order_uncorr, deltap_i } = arrays;

  for (let i = 0; i < atoms.length; i++) {
    const sbp_i = onebody_parameters[atoms[i].type];

    let sum = 0.0;
    for (let j = 0; j < atoms.length; j++) {
      sum += bond_order_uncorr[i][j];
    }
    deltap_i[i] = sum - sbp_i.valency;  // (Equation 5)
  }
}

/**
 * Main bond order calculation function
 * @param {World} world - World object
 * @returns {Object} Computed bond order arrays
 */
export function bondOrder(world) {
  const arrays = initializeBondOrderArrays(world.atoms.length);

  calculateUncorrectedBondOrders(world, arrays);
  calculateDeltaPrime(world, arrays);
  calculateCorrectedBondOrders(world, arrays);
  calculateCorrectedOvercoordination(world, arrays);

  // Update world with calculated values
  Object.assign(world, arrays);

  return arrays;
}

export default {
  initializeBondOrderArrays,
  calculateUncorrectedBondOrders,
  calculateDeltaPrime,
  calculateCorrectedBondOrders,
  calculateCorrectedOvercoordination,
  bondOrder
};
