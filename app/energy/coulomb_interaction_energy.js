const constants = require('../config/Constants')

/**
 * Coulomb Constant aka Marino's Constant/Electrostatic Constant :
 * As with the van der Waals-interactions, Coulomb interactions are taken into account between all atom pairs.
 * To adjust for orbital overlap between atoms at close distances a shielded Coulomb-potential is used (Equation 24).
 * @param i
 * @param j
 * @returns {number}
 */
export function coulombInteraction(i, j) {
    let r_cut = paramGeneral.swb ;

    //Tapper-term   (Equation 22)
    let Tap7 = 20 / Math.pow(r_cut, 7);
    let Tap6 = -70 / Math.pow(r_cut, 6);
    let Tap5 = 84 / Math.pow(r_cut, 5);
    let Tap4 = -35 / Math.pow(r_cut, 4);
    let Tap3 = 0;
    let Tap2 = 0;
    let Tap1 = 0;
    let Tap0 = 1;

    //Taper correction  (Equation 21)
    let Tap = (Tap7 * Math.pow(r_ij, 7)) +
        (Tap6 * Math.pow(constants.R_IJ, 6)) +
        (Tap5 * Math.pow(constants.R_IJ, 5)) +
        (Tap4 * Math.pow(constants.R_IJ, 4)) +
        (Tap3 * Math.pow(constants.R_IJ, 3)) +
        (Tap2 * Math.pow(constants.R_IJ, 2)) +
        (Tap1 * Math.pow(constants.R_IJ, 1)) + Tap0;

    //Derivative of Tapper correction
    let dTap = 7 * Tap7 * constants.R_IJ + 6 * Tap6;
    dTap = dTap * constants.R_IJ + 5 * Tap5;
    dTap = dTap * constants.R_IJ + 4 * Tap;
    dTap = dTap * constants.R_IJ + 3 * Tap3;
    dTap = dTap * constants.R_IJ + 2 * Tap2;
    dTap += Tap1 / constants.R_IJ;

    let e_coul = 0.0;

    let atom_i = world.atoms[i];
    let atom_j = world.atoms[j];

    let twbp = twobody_parameters[world.atoms[i].type][world.atoms[j].type];

    let dr3gamij_1 = (constants.R_IJ * constants.R_IJ * constants.R_IJ + twbp.gamma);
    let dr3gamij_3 = Math.pow(dr3gamij_1, 0.33333333333333);
    let tmp = Tap / dr3gamij_3;

    e_coul += constants.COULOMB_CONSTANT * constants.COULOMB_CHARGE_QI * constants.COULOMB_CHARGE_QJ * tmp;      // (Equation 24)
    let ce_clmb = constants.COULOMB_CONSTANT * constants.COULOMB_CHARGE_QI * constants.COULOMB_CHARGE_QJ * (dTap - Tap * constants.R_IJ / dr3gamij_1) / dr3gamij_3;

    return e_coul
}
