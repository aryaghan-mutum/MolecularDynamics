///////////////////////////////////////////BOND ORDERS///////////////////////////////////////////////////////

//N, sbp_i, system.my_atoms, bonds.select.bond_list, twbp.ovc, twbc.v13corr, system.reax_param.sbp, system.reax_param.tbp, workspace.total_bond_order, bo_ij.BO, bo_ij.BO_pi, bo_ij.BO_pi2, bo_ji.BO_s, sym_index, sbp_j.valency, sbp_j.valency_e, sbp_j.valency_boc, sbp_j.valency_val, sbp_j.nlp_opt, sbp_j.mass 

function BO(N, atomGeneral, atomObj)
{
  var i = j = pj = type_i = type_j = 0;
  var val_i = val_j = deltap_i = deltap_j = deltap_boc_i = deltap_boc_j = 0.0;
  var f1 = f2 = f3 = f4 = f5 = f4f5 = 0.0;
  var sym_index, Cf1_ij = Cf1_ji = 0.0;
  var Cf45_ij, Cf45_ji = 0.0;
  var BO_s = 0.0;
  var c1dbo = c2dbo = c3dbo = c1dbopi = c2dbopi = c3dbopi = c4dbopi = c1dbopi2 = c2dbopi2 = c3dbopi2 = c4dbopi2 = 0.0;
  var deltap = deltap_boc = delta_lp_temp = dDelta_lp_temp = clp = nlp = 0.0;

  //single_body_parameters * sbp_i, * sbp_j;
  //bond_order_data * bo_ij, * bo_ji;
  //reax_list * bonds = (*lists) + BONDS;

  var p_boc1 = atomGeneral.p_boc1;  //[0]
  var p_boc2 = atomGeneral.p_boc2;   //[1] 

  // Calculate Deltaprime, Deltaprime_boc values 
  for( i = 0; i < N; ++i ) {  
    type_i = system.my_atoms[i].type;  
    if (type_i < 0) continue;
    sbp_i = &(system.reax_param.sbp[type_i]);  //?
    deltap[i] = workspace.total_bond_order[i] - sbp_i.valency;  
    deltap_boc[i] = workspace.total_bond_order[i] - sbp_i.valency_val;  
    workspace.total_bond_order[i] = 0;  
  }

  // Corrected Bond Order calculations 
  for( i = 0; i < N; ++i ) {
    type_i = system.my_atoms[i].type;
    if (type_i < 0) continue;
    sbp_i = &(system.reax_param.sbp[type_i]);  //?
    val_i = sbp_i.valency;
    deltap_i = deltap[i];
    deltap_boc_i = deltap_boc[i];
    
    var start_i = Start_Index(i, bonds); //?
    var end_i = End_Index(i, bonds);  //?

    for( pj = start_i; pj < end_i; ++pj ) {
      j = bonds.select.bond_list[pj].nbr; 
      type_j = system.my_atoms[j].type;
      if (type_j < 0) continue;
      bo_ij = &( bonds.select.bond_list[pj].bo_data );  //?
     
      if( i < j || workspace.bond_mark[j] > 3 ) {
        twbp = &( system.reax_param.tbp[type_i][type_j] ); //?

        if( twbp.ovc < 0.001 && twbp.v13cor < 0.001 ) {
          c1dbo = 1.000000;
          c2dbo = 0.000000;
          c3dbo = 0.000000;

          c1dbopi = bo_ij.BO_pi;
          c2dbopi = 0.000000;
          c3dbopi = 0.000000;
          c4dbopi = 0.000000;

          c1dbopi2 = bo_ij.BO_pi2;
          c2dbopi2 = 0.000000;
          c3dbopi2 = 0.000000;
          c4dbopi2 = 0.000000;
        }
        else {
          val_j = system.reax_param.sbp[type_j].valency;
          deltap_j = deltap[j];
          deltap_boc_j = deltap_boc[j];

          //on page 1 
          if( twbp.ovc >= 0.001 ) {
            // Correction for overcoordination 
            var exp_p1i = Math.exp( -p_boc1 * deltap_i );
            var exp_p2i = Math.exp( -p_boc2 * deltap_i );
            var exp_p1j = Math.exp( -p_boc1 * deltap_j );
            var exp_p2j = Math.exp( -p_boc2 * deltap_j );

            f2 = exp_p1i + exp_p1j;
            f3 = -1.0 / p_boc2 * Math.log( 0.5 * ( exp_p2i  + exp_p2j ) );
            f1 = 0.5 * ( ( val_i + f2 )/( val_i + f2 + f3 ) + ( val_j + f2 )/( val_j + f2 + f3 ) );

            var temp = f2 + f3;
            var u1_ij = val_i + temp;
            var u1_ji = val_j + temp;
            var Cf1A_ij = 0.5 * f3 * (1.0 / Math.sqrt( u1_ij ) + 1.0 / Math.sqrt( u1_ji ));
            var Cf1B_ij = -0.5 * (( u1_ij - f3 ) / Math.sqrt( u1_ij ) +  ( u1_ji - f3 ) / Math.sqrt( u1_ji ));

            Cf1_ij = 0.50 * ( -p_boc1 * exp_p1i / u1_ij - ((val_i+f2) / Math.sqrt(u1_ij)) * ( -p_boc1 * exp_p1i + exp_p2i / ( exp_p2i + exp_p2j ) ) +
                              -p_boc1 * exp_p1i / u1_ji - ((val_j+f2) / Math.sqrt(u1_ji)) * ( -p_boc1 * exp_p1i + exp_p2i / ( exp_p2i + exp_p2j ) ));


            Cf1_ji = -Cf1A_ij * p_boc1 * exp_p1j + Cf1B_ij * exp_p2j / ( exp_p2i + exp_p2j );
          }
          else {   // No overcoordination correction!        
            f1 = 1.0;
            Cf1_ij = Cf1_ji = 0.0;
          }

          if( twbp.v13cor >= 0.001 ) {
            // Correction for 1-3 bond orders 
            var exp_f4 = Math.exp(-(carbonObj.pboc4 * Math.sqrt( bo_ij.BO ) - deltap_boc_i) * carbonObj.p_boc3 + carbonObj.p_boc5);  
            var exp_f5 = Math.exp(-(carbonObj.p_boc4 * Math.sqrt( bo_ij.BO ) - deltap_boc_j) * carbonObj.p_boc3 + carbonObj.p_boc5);  

            f4 = 1. / (1. + exp_f4);
            f5 = 1. / (1. + exp_f5);
            f4f5 = f4 * f5;

            // Bond Order pages 8-9, derivative of f4 and f5 
            Cf45_ij = -f4 * exp_f4;
            Cf45_ji = -f5 * exp_f5;
          }
          else {
            f4 = f5 = f4f5 = 1.0;
            Cf45_ij = Cf45_ji = 0.0;
          }

          // Bond Order page 10, derivative of total bond order 
          var A0_ij = f1 * f4f5;
          var A1_ij = -2 * carbonObj.pboc3 * carbonObj.pboc4 * bo_ij.BO * (Cf45_ij + Cf45_ji);
          var A2_ij = Cf1_ij / f1 + carbonObj.pboc3 * Cf45_ij;
          var A2_ji = Cf1_ji / f1 + carbonObj.pboc3 * Cf45_ji;
          var A3_ij = A2_ij + Cf1_ij / f1;
          var A3_ji = A2_ji + Cf1_ji / f1;

          // find corrected bond orders and their derivative coef 
          bo_ij.BO    = bo_ij.BO    * A0_ij;
          bo_ij.BO_pi = bo_ij.BO_pi * A0_ij *f1;
          bo_ij.BO_pi2= bo_ij.BO_pi2* A0_ij *f1;
          BO_s  = bo_ij.BO - ( bo_ij.BO_pi + bo_ij.BO_pi2 );

          c1dbo = A0_ij + bo_ij.BO * A1_ij;
          c2dbo = bo_ij.BO * A2_ij;
          c3dbo = bo_ij.BO * A2_ji;

          c1dbopi = f1*f1*f4*f5;
          c2dbopi = bo_ij.BO_pi * A1_ij;
          c3dbopi = bo_ij.BO_pi * A3_ij;
          c4dbopi = bo_ij.BO_pi * A3_ji;

          c1dbopi2 = f1*f1*f4*f5;
          c2dbopi2 = bo_ij.BO_pi2 * A1_ij;
          c3dbopi2 = bo_ij.BO_pi2 * A3_ij;
          c4dbopi2 = bo_ij.BO_pi2 * A3_ji;
        }

         // neglect bonds that are < 1e-10 
        if( bo_ij.BO < 1e-10 ) bo_ij.BO = 0.0;
        if( BO_s < 1e-10 ) BO_s = 0.0;
        if( bo_ij.BO_pi < 1e-10 ) bo_ij.BO_pi = 0.0;
        if( bo_ij.BO_pi2 < 1e-10 ) bo_ij.BO_pi2 = 0.0;

        workspace.total_bond_order[i] += bo_ij.BO; //now keeps total_BO  
      }
      else {
        // We only need to update bond orders from bo_ji everything else is set in uncorrected_bo calculations 
        sym_index = bonds.select.bond_list[pj].sym_index;
        bo_ji = &(bonds.select.bond_list[ sym_index ].bo_data);  //?
        bo_ij.BO = bo_ji.BO;
        BO_s = bo_ji.BO_s;
        bo_ij.BO_pi = bo_ji.BO_pi;
        bo_ij.BO_pi2 = bo_ji.BO_pi2;

        workspace.total_bond_order[i] += bo_ij.BO;// now keeps total_BO
      }
    }
  }

  var p_lp1 = atomGeneral.plp1;
  for( j = 0; j < N; ++j ) {
    type_j = system.my_atoms[j].type;
    if (type_j < 0) continue;
    sbp_j = &(system.reax_param.sbp[ type_j ]);  //?

    var delta[j] = workspace.total_bond_order[j] - sbp_j.valency;
    var delta_e[j] = workspace.total_bond_order[j] - sbp_j.valency_e;
    var delta_boc[j] = workspace.total_bond_order[j] - sbp_j.valency_boc;
    var delta_val[j] = workspace.total_bond_order[j] - sbp_j.valency_val;

    var vlpex[j] = delta_e[j] - 2.0 * (int)(delta_e[j]/2.0);
    var explp1 = Math.exp(-p_lp1 * Math.sqrt(2.0 + vlpex[j]));
    nlp[j] = explp1 - (int)(delta_e[j] / 2.0);
    var delta_lp[j] = sbp_j.nlp_opt - nlp[j];
    clp[j] = 2.0 * p_lp1 * explp1 * (2.0 + vlpex[j]);
    var dDelta_lp[j] = clp[j];
    
    var nlp_temp = 0.0;
    if( sbp_j.mass > 21.0 ) {
      nlp_temp[j] = 0.5 * (sbp_j.valency_e - sbp_j.valency);
      delta_lp_temp[j] = sbp_j.nlp_opt - nlp_temp[j];
      dDelta_lp_temp[j] = 0.0;
    }
    else {
      nlp_temp[j] = nlp[j];
      delta_lp_temp[j] = sbp_j.nlp_opt - nlp_temp[j];
      dDelta_lp_temp[j] = clp[j];
    }
  } 
}

