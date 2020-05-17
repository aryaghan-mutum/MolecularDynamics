//
// export function coalitionEnergy(i, j, k, world, BOA_ij, BOA_jk, paramGeneral) {
//
//     let bondOrder = world.bond_order
//     let bond_order_pi = world.bond_order_pi
//     let bond_order_pi2 = world.bond_order_pi2
//
//     let thbp = threebody_parameters[world.atoms[i].type][world.atoms[j].type][world.atoms[k].type]
//     const cut = 0.001;
//     BOA_ij = bondOrder[i][k] - cut
//     BOA_jk = bondOrder[j][k] - cut
//
//     let eCoa = 0.0;
//     let expCoa2 = Math.exp(paramGeneral.pcoa2 * deltap_boc[j])   //Note: deltap_boc in JS is delta_val in C++
//     eCoa += eCoa = thbp.pcoa1 / (1. + expCoa2) *
//         Math.exp(-paramGeneral.pcoa3 * (bondOrder[i][j] - BOA_ij) * (bondOrder[i][j] - BOA_ij)) *
//         Math.exp(-paramGeneral.pcoa3 * (bondOrder[i][j] - BOA_jk) * (bondOrder[i][j] - BOA_jk)) *
//         Math.exp(-paramGeneral.pcoa4 * (BOA_ij - 1.5) * (BOA_ij - 1.5)) *
//         Math.exp(-paramGeneral.pcoa4 * (BOA_jk - 1.5) * (BOA_jk - 1.5))
//
//     return eCoa
// }