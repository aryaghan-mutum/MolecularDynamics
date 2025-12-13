import { COULOMB_CONSTANT, COULOMB_CHARGE_QI, COULOMB_CHARGE_QJ } from '../config/constants.js';

/**
 * Force Field Energy Calculations for ReaxFF
 * This module implements various energy calculation functions for molecular dynamics simulations
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
 * Calculate taper correction term (Equation 21-22)
 * @param {number} r_ij - Interatomic distance
 * @param {number} Rcut - Cutoff radius
 * @returns {{tap: number, dTap: number}} Taper value and derivative
 */
export function calculateTaper(r_ij, Rcut) {
  const Tap7 = 20 / Math.pow(Rcut, 7);
  const Tap6 = -70 / Math.pow(Rcut, 6);
  const Tap5 = 84 / Math.pow(Rcut, 5);
  const Tap4 = -35 / Math.pow(Rcut, 4);
  const Tap3 = 0;
  const Tap2 = 0;
  const Tap1 = 0;
  const Tap0 = 1;

  const tap = (Tap7 * Math.pow(r_ij, 7)) +
    (Tap6 * Math.pow(r_ij, 6)) +
    (Tap5 * Math.pow(r_ij, 5)) +
    (Tap4 * Math.pow(r_ij, 4)) +
    (Tap3 * Math.pow(r_ij, 3)) +
    (Tap2 * Math.pow(r_ij, 2)) +
    (Tap1 * r_ij) + Tap0;

  let dTap = 7 * Tap7 * r_ij + 6 * Tap6;
  dTap = dTap * r_ij + 5 * Tap5;
  dTap = dTap * r_ij + 4 * Tap4;
  dTap = dTap * r_ij + 3 * Tap3;
  dTap = dTap * r_ij + 2 * Tap2;
  dTap += Tap1 / r_ij;

  return { tap, dTap };
}

/**
 * Van der Waals interactions using distance-corrected Morse-potential (Equations 23a-b)
 * By including a shielded interaction, excessively high repulsions between
 * bonded atoms (1-2 interactions) and atoms sharing a valence angle (1-3 interactions) are avoided.
 * 
 * @param {number} i - Index of first atom
 * @param {number} j - Index of second atom
 * @param {World} world - World object containing atoms and parameters
 * @returns {number} Van der Waals energy
 */
export function vanDerWaalsInteraction(i, j, world) {
  const { paramGeneral, twobody_parameters, atoms } = world;
  
  const Rcut = paramGeneral.swb;
  const p_vdW1 = paramGeneral.pvdW1;
  const p_vdW1i = 1.0 / p_vdW1;

  const dx = atoms[j].pos.x - atoms[i].pos.x;
  const dy = atoms[j].pos.y - atoms[i].pos.y;
  const dz = atoms[j].pos.z - atoms[i].pos.z;
  const r_ij = Math.sqrt(dx * dx + dy * dy + dz * dz);

  const { tap } = calculateTaper(r_ij, Rcut);

  const twbp = twobody_parameters[atoms[i].type][atoms[j].type];

  // Van der waals calculations
  const powr_vdW1 = Math.pow(r_ij, p_vdW1);
  const powgi_vdW1 = Math.pow(1.0 / twbp.gammaW, p_vdW1);
  const fn13 = Math.pow(powr_vdW1 + powgi_vdW1, p_vdW1i); // (Equation 23b)

  const exp1 = Math.exp(twbp.alpha * (1.0 - fn13 / twbp.rvdw));
  const exp2 = Math.exp(0.5 * twbp.alpha * (1.0 - fn13 / twbp.rvdw));

  // Van der Waals interactions energy equation (Equation 23a)
  const E_vdW = tap * twbp.dij * (exp1 - 2.0 * exp2);

  return E_vdW;
}

/**
 * Coulomb interactions with shielded potential (Equation 24)
 * Coulomb interactions are taken into account between all atom pairs.
 * To adjust for orbital overlap between atoms at close distances a shielded Coulomb-potential is used.
 * 
 * @param {number} i - Index of first atom
 * @param {number} j - Index of second atom
 * @param {World} world - World object containing atoms and parameters
 * @param {number} r_ij - Interatomic distance
 * @returns {number} Coulomb energy
 */
export function coulombInteraction(i, j, world, r_ij) {
  const { paramGeneral, twobody_parameters, atoms } = world;
  
  const rCut = paramGeneral.swb;
  const { tap, dTap } = calculateTaper(r_ij, rCut);

  const twbp = twobody_parameters[atoms[i].type][atoms[j].type];

  const dr3gamij1 = (r_ij * r_ij * r_ij + twbp.gamma);
  const dr3gamij3 = Math.pow(dr3gamij1, 0.33333333333333);
  const tmp = tap / dr3gamij3;

  const eCoul = COULOMB_CONSTANT * COULOMB_CHARGE_QI * COULOMB_CHARGE_QJ * tmp; // (Equation 24)
  
  return eCoul;
}

/**
 * Bond Energy calculation (Equation 6)
 * @param {number} i - Index of first atom
 * @param {number} j - Index of second atom
 * @param {World} world - World object
 * @returns {number} Bond energy
 */
export function bondEnergy(i, j, world) {
  const { twobody_parameters, atoms, bond_order_sigma, bond_order_pi2, BO_pi_corr } = world;
  
  const twbp = twobody_parameters[atoms[i].type][atoms[j].type];
  const powBoSbe2 = Math.pow(bond_order_sigma[i][j], twbp.pbe2);
  const expBe12 = Math.exp(twbp.pbe1 * (1.0 - powBoSbe2));
  
  // Bond energy (Equation 6)
  const ebond = -twbp.DeSigma * bond_order_sigma[i][j] * expBe12 -
    twbp.DePi * BO_pi_corr -
    twbp.DePipi * bond_order_pi2[i][j];
  
  return ebond;
}

/**
 * Lone pair energy calculation (Equations 7-10)
 * Equation (8) determines the number of lone pairs around an atom.
 * 
 * @param {number} i - Index of atom
 * @param {World} world - World object
 * @returns {number} Lone pair energy
 */
export function lonepairEnergy(i, world) {
  const { paramGeneral, onebody_parameters, atoms, bond_order, vlpex, n_lp, deltap_i_lp, dDeltap_i_lp } = world;
  
  const pLp1 = paramGeneral.plp1;
  const sbpI = onebody_parameters[atoms[i].type];

  let sum = 0.0;
  for (let j = 0; j < atoms.length; j++) {
    sum += bond_order[i][j];
  }

  const delta_e = sum - sbpI.valE; // (Equation 7)
  const vlpexVal = delta_e - 2.0 * Math.trunc(delta_e / 2.0);
  world.vlpex[i] = vlpexVal;
  
  const explp1 = Math.exp(-pLp1 * (2.0 + vlpexVal) * (2.0 + vlpexVal));
  world.n_lp[i] = explp1 - Math.trunc(delta_e / 2.0);
  world.deltap_i_lp[i] = sbpI.nlp_opt - world.n_lp[i]; // (Equation 9)

  // Lone-pair Energy (Equation 10)
  const expvd2 = Math.exp(-75 * world.deltap_i_lp[i]);
  const inv_expvd2 = 1 / (1 + expvd2);
  const elp = sbpI.plp2 * world.deltap_i_lp[i] * inv_expvd2;

  world.dDeltap_i_lp[i] = 2.0 * pLp1 * explp1 * (2.0 + vlpexVal);
  
  return elp;
}

/**
 * Under Coordination energy (Equation 12)
 * For an undercoordinated atom (Δi<0), we want to take into account the energy contribution
 * for the resonance of the π-electron between attached under-coordinated atomic centers.
 * 
 * @param {Object} sbp_i - One-body parameters
 * @param {number} exp_ovun2 - Over coordination exponential
 * @param {number} sum_ovun2 - Sum of over coordination
 * @param {number} delta_lpcorr - Corrected delta
 * @param {Object} paramGeneral - General parameters
 * @returns {number} Under coordination energy
 */
export function underCoordination(sbp_i, exp_ovun2, sum_ovun2, delta_lpcorr, paramGeneral) {
  const exp_ovun2n = 1.0 / exp_ovun2;
  const exp_ovun6 = Math.exp(paramGeneral.povun6 * delta_lpcorr);
  const exp_ovun8 = paramGeneral.povun7 * Math.exp(paramGeneral.povun8 * sum_ovun2);
  const inv_exp_ovun2n = 1.0 / (1.0 + exp_ovun2n);
  const inv_exp_ovun8 = 1.0 / (1.0 + exp_ovun8);

  const E_under = -sbp_i.povun5 * (1.0 - exp_ovun6) * inv_exp_ovun2n * inv_exp_ovun8; // (Equation 12)
  
  return E_under;
}

/**
 * Over Coordination energy (Equations 11a-b)
 * For an overcoordinated atom (Δi>0), equations impose an energy penalty on the system.
 * 
 * @param {number} i - Index of atom
 * @param {World} world - World object
 * @returns {number} Over coordination energy
 */
export function overCoordination(i, world) {
  const { paramGeneral, onebody_parameters, twobody_parameters, atoms, 
          bond_order, bond_order_pi, bond_order_pi2, delta_i, deltap_i_lp } = world;
  
  const atom_i = atoms[i];
  const sbp_i = onebody_parameters[atom_i.type];

  let dfvl = 0.0;
  if (sbp_i.atmcMass > 21.00) {
    dfvl = 0.0;
  } else {
    dfvl = 1.0; // only for 1st-row elements
  }

  let sum = 0.0;
  for (let j = 0; j < atoms.length; j++) {
    sum += (delta_i[j] - dfvl * deltap_i_lp[i]) * (bond_order_pi[i][j] + bond_order_pi2[i][j]);
  }

  // (Equation 11b)
  const exp_ovun1 = paramGeneral.povun3 * Math.exp(paramGeneral.povun4 * sum);
  const inv_exp_ovun1 = 1.0 / (1 + exp_ovun1);
  const delta_lpcorr = delta_i[i] - (dfvl * deltap_i_lp[i]) * inv_exp_ovun1;

  // (Equation 11a)
  let sum_ovun1 = 0.0;
  for (let j = 0; j < atoms.length; j++) {
    const twbp = twobody_parameters[atoms[i].type][atoms[j].type];
    sum_ovun1 += twbp.povun1 * twbp.DeSigma * bond_order[i][j];
  }
  
  const dlpVi = 1.0 / (delta_lpcorr + sbp_i.valency + 1e-8);
  const exp_ovun2 = Math.exp(sbp_i.povun2 * delta_lpcorr);
  const inv_exp_ovun2 = 1.0 / (1.0 + exp_ovun2);
  const E_over = sum_ovun1 * dlpVi * delta_lpcorr * inv_exp_ovun2; // (Equation 11a)

  const E_under = underCoordination(sbp_i, exp_ovun2, sum, delta_lpcorr, paramGeneral);

  return E_over + E_under;
}

/**
 * Penalty Energy (Equation 14)
 * @param {number} i - Index of first atom
 * @param {number} j - Index of second atom
 * @param {number} k - Index of third atom
 * @param {World} world - World object
 * @returns {number} Penalty energy
 */
export function penaltyEnergy(i, j, k, world) {
  const { paramGeneral, threebody_parameters, atoms, bond_order, deltap_i } = world;
  
  const thbp = threebody_parameters[atoms[i].type][atoms[j].type][atoms[k].type];

  const cut = 0.001;
  const BOA_ij = bond_order[i][k] - cut;
  const BOA_jk = bond_order[j][k] - cut;

  const expPen2ij = Math.exp(-paramGeneral.ppen2 * (BOA_ij - 2.0) * (BOA_ij - 2.0));
  const expPen2jk = Math.exp(-paramGeneral.ppen2 * (BOA_jk - 2.0) * (BOA_jk - 2.0));
  const expPen3 = Math.exp(-paramGeneral.ppen3 * deltap_i);
  const expPen4 = Math.exp(paramGeneral.ppen4 * deltap_i);
  const trmPen34 = 1.0 + expPen3 + expPen4;
  const f9_Dj = (2.0 + expPen3) / trmPen34; // (Equation 14b)
  
  const epen = thbp.pen1 * f9_Dj * expPen2ij * expPen2jk; // (Equation 14a)

  return epen;
}

/**
 * Coalition Energy (Three-body conjugation)
 * @param {number} i - Index of first atom
 * @param {number} j - Index of second atom
 * @param {number} k - Index of third atom
 * @param {World} world - World object
 * @returns {number} Coalition energy
 */
export function coalitionEnergy(i, j, k, world) {
  const { paramGeneral, threebody_parameters, atoms, bond_order, deltap_boc } = world;
  
  const thbp = threebody_parameters[atoms[i].type][atoms[j].type][atoms[k].type];
  
  const cut = 0.001;
  const BOA_ij = bond_order[i][k] - cut;
  const BOA_jk = bond_order[j][k] - cut;

  const expCoa2 = Math.exp(paramGeneral.pcoa2 * deltap_boc[j]);
  
  const eCoa = thbp.pcoa1 / (1. + expCoa2) *
    Math.exp(-paramGeneral.pcoa3 * (bond_order[i][j] - BOA_ij) * (bond_order[i][j] - BOA_ij)) *
    Math.exp(-paramGeneral.pcoa3 * (bond_order[i][j] - BOA_jk) * (bond_order[i][j] - BOA_jk)) *
    Math.exp(-paramGeneral.pcoa4 * (BOA_ij - 1.5) * (BOA_ij - 1.5)) *
    Math.exp(-paramGeneral.pcoa4 * (BOA_jk - 1.5) * (BOA_jk - 1.5));

  return eCoa;
}

export default {
  degreesToRadians,
  calculateTaper,
  vanDerWaalsInteraction,
  coulombInteraction,
  bondEnergy,
  lonepairEnergy,
  underCoordination,
  overCoordination,
  penaltyEnergy,
  coalitionEnergy
};
