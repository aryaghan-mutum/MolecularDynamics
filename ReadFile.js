
      var r_ij = 1.2 ;
      var globalParams = [];
	    var carbon = [];
	    var oxygen = [];
      var hydrogen = [];

          
 function atomType(paramAtom) {
   this.atomID   =  "atom ID";
   this.roSigma  = parseFloat(paramAtom[0]);    //ro(sigma) single bond covalent radius in A = 1.3817
   this.valency  = parseFloat(paramAtom[1]);    //valency of atom
   this.atmcMass = parseFloat(paramAtom[2]);    //atomic mass in daltons
   this.rvdw     = parseFloat(paramAtom[3]);    // van der Waals radius in Amstrongs = 0.18903
   this.dij      = parseFloat(paramAtom[4]);    //epsilon  
   this.gamma    = parseFloat(paramAtom[5]);    //gammaEEM (charge equilibration parameter) = 0.6544
   this.roPi     = parseFloat(paramAtom[6]);    //covalent radius 2 = 1.1341
   this.valE     = parseFloat(paramAtom[7]);    //val(e) (an additional valence, see atoms O and N) = 4 
   this.alpha    = parseFloat(paramAtom[8]); 
   this.gammaW   = parseFloat(paramAtom[9]);     //gamma(w) (van der Waals screening distance in Å) 
   this.valAngle = parseFloat(paramAtom[10]); 
   this.povun5   = parseFloat(paramAtom[11]);  
   this.nu       = parseFloat(paramAtom[12]);  
   this.chiEEM   = parseFloat(paramAtom[13]);     //charge equilibration parameter 
   this.etaEEM   = parseFloat(2 * paramAtom[14]); //charge equilibration parameter    
   this.nlp_opt  = parseFloat(paramAtom[15]);    
   this.roPiPi   = parseFloat(paramAtom[16]);  //(covalent radius 3) = 1.2114
   this.plp2     = parseFloat(paramAtom[17]);  // elp (lone pair energy—carbon has no lone pairs, see O and N ) = 0.0
   this.heatInc  = parseFloat(paramAtom[18]); 
   this.pboc4    = parseFloat(paramAtom[19]);
   this.pboc3    = parseFloat(paramAtom[20]);
   this.pboc5    = parseFloat(paramAtom[21]);   
   this.nu       = parseFloat(paramAtom[22]);
   this.nu 	     = parseFloat(paramAtom[23]);
   this.povun2   = parseFloat(paramAtom[24]);     
   this.pval3    = parseFloat(paramAtom[25]);
   this.nu       = parseFloat(paramAtom[26]);   
   this.valBoc   = parseFloat(paramAtom[27]);    //valency_val
   this.pval5    = parseFloat(paramAtom[28]);    
   this.rcore 	 = parseFloat(paramAtom[29]);   //rcore2
   this.ecore 	 = parseFloat(paramAtom[30]);   //ecore2
   this.acore 	 = parseFloat(paramAtom[31]);   //acore2  
}

function paramGlobal(paramGeneral) {
   this.pboc1   = parseFloat(paramGeneral[0]);
   this.pboc2   = parseFloat(paramGeneral[1]);
   this.pcoa2   = parseFloat(paramGeneral[2]);
   this.ptrip4  = parseFloat(paramGeneral[3]);
   this.ptrip3  = parseFloat(paramGeneral[4]);
   this.kc2     = parseFloat(paramGeneral[5]);
   this.povun6  = parseFloat(paramGeneral[6]);
   this.ptrip2  = parseFloat(paramGeneral[7]);
   this.povun7  = parseFloat(paramGeneral[8]);
   this.povun8  = parseFloat(paramGeneral[9]);
   this.ptrip1  = parseFloat(paramGeneral[10]);
   this.swa     = parseFloat(paramGeneral[11]);
   this.swb     = parseFloat(paramGeneral[12]);
   this.notused = parseFloat(paramGeneral[13]);
   this.pval7   = parseFloat(paramGeneral[14]);
   this.plp1    = parseFloat(paramGeneral[15]);
   this.pval9   = parseFloat(paramGeneral[16]);
   this.pval10  = parseFloat(paramGeneral[17]);	
   this.notused = parseFloat(paramGeneral[18]);	
   this.ppen2   = parseFloat(paramGeneral[19]);	
   this.ppen3   = parseFloat(paramGeneral[20]);
   this.ppen4   = parseFloat(paramGeneral[21]);
   this.notused = parseFloat(paramGeneral[22]);	 
   this.ptor2   = parseFloat(paramGeneral[23]);	
   this.ptor3 	= parseFloat(paramGeneral[24]);	
   this.pval4   = parseFloat(paramGeneral[25]);	
   this.notused = parseFloat(paramGeneral[26]);	
   this.pcot2   = parseFloat(paramGeneral[27]);
   this.pvdW1   = parseFloat(paramGeneral[28]);		
   this.cutoff  = parseFloat(paramGeneral[29]/100);	
   this.pcoa4   = parseFloat(paramGeneral[30]);	
   this.povun4  = parseFloat(paramGeneral[31]);	
   this.povun3  = parseFloat(paramGeneral[32]);	
   this.pval8   = parseFloat(paramGeneral[33]);	
   this.notused = parseFloat(paramGeneral[34]);	
   this.notused = parseFloat(paramGeneral[35]);	
   this.notused = parseFloat(paramGeneral[36]);	
   this.notused = parseFloat(paramGeneral[37]);	
   this.pcoa3   = parseFloat(paramGeneral[38]);																						    	
}

function bondType(paramBond) {
   this.at1     = parseFloat(paramBond[0]);
   this.at2     = parseFloat(paramBond[1]);
   this.DeSigma = parseFloat(paramBond[2]);
   this.DePi    = parseFloat(paramBond[3]);
   this.DePipi  = parseFloat(paramBond[4]);
   this.pbe1    = parseFloat(paramBond[5]);
   this.pbo5    = parseFloat(paramBond[6]);
   this.v13corr = parseFloat(paramBond[7]);
   this.nu      = "not used";
   this.pbo6    = parseFloat(paramBond[8]);
   this.povun1  = parseFloat(paramBond[9]);
   this.pbe2    = parseFloat(paramBond[10]);
   this.pbo3    = parseFloat(paramBond[11]);
   this.pbo4    = parseFloat(paramBond[12]);
   this.nu      = parseFloat(paramBond[13]);
   this.pbo1    = parseFloat(paramBond[14]);
   this.pbo2    = parseFloat(paramBond[15]);

   this.atomID   = null;
   this.roSigma  = null;
   this.valency  = null;
   this.atmcMass = null;
   this.rvdw     = null;
   this.dij      = null;
   this.gamma    = null;
   this.roPi     = null;
   this.valE     = null;
   this.alpha    = null;
   this.gammaW   = null;
   this.valAngle = null;
   this.povun5   = null;
   this.nu       = null;
   this.chiEEM   = null;
   this.etaEEM   = null;
   this.nlp_opt  = null;
   this.roPiPi   = null;
   this.plp2     = null;
   this.heatInc  = null;
   this.pboc4    = null;
   this.pboc3    = null;
   this.pboc5    = null;
   this.nu       = null;
   this.nu       = null;
   this.povun2   = null;
   this.pval3    = null;
   this.nu       = null;
   this.valBoc   = null;
   this.pval5    = null;
   this.rcore    = null;
   this.ecore    = null;
   this.acore    = null;

}

function angles(paramAngle) {
    this.at1    = parseFloat(paramAngle[0]);
    this.at2    = parseFloat(paramAngle[1]);
    this.at3    = parseFloat(paramAngle[2]);
    this.thetao = parseFloat(paramAngle[3]);
    this.pval1  = parseFloat(paramAngle[4]);
    this.pval2  = parseFloat(paramAngle[5]);
    this.pcoa1  = parseFloat(paramAngle[6]);
    this.pval7  = parseFloat(paramAngle[7]);
    this.pen1   = parseFloat(paramAngle[8]);
    this.pval4  = parseFloat(paramAngle[9]);
}

function torsions(paramTorsions) {
    this.at1     = parseFloat(paramTorsions[0]);
    this.at2     = parseFloat(paramTorsions[1]);
    this.at3     = parseFloat(paramTorsions[2]);
    this.at4     = parseFloat(paramTorsions[3]);
    this.V1      = parseFloat(paramTorsions[4]);
    this.V2      = parseFloat(paramTorsions[5]);
    this.V3      = parseFloat(paramTorsions[6]);
    this.p_tor1  = parseFloat(paramTorsions[7]);
    this.p_cot1  = parseFloat(paramTorsions[8]);
    this.nu      = parseFloat(paramTorsions[9]);
    this.nu      = parseFloat(paramTorsions[10]);
}

function diag(paramDiag) {
    this.at1      = parseFloat(paramDiag[0]);
    this.at2      = parseFloat(paramDiag[1]);
    this.dij      = parseFloat(paramDiag[2]);
    this.RvdW     = parseFloat(paramDiag[3]);
    this.alfa     = parseFloat(paramDiag[4]);
    this.roSigma  = parseFloat(paramDiag[5]);
    this.roPi     = parseFloat(paramDiag[6]);
    this.roPiPi   = parseFloat(paramDiag[7]);
}

function hbonds(hydrogenBonds) {
    this.at1    = parseFloat(hydrogenBonds[0]);
    this.at2    = parseFloat(hydrogenBonds[1]);
    this.at3    = parseFloat(hydrogenBonds[2]);
    this.r_hb   = parseFloat(hydrogenBonds[3]);
    this.p_hb1  = parseFloat(hydrogenBonds[4]);
    this.p_hb2  = parseFloat(hydrogenBonds[5]);
    this.p_hb3  = parseFloat(hydrogenBonds[6]);
}


	// Will remove all falsy values: undefined, null, 0, false, NaN and "" (empty string)
	function cleanArray(actual, type) {		
	  var newArray = new Array();
	  
    for (var i = 0; i < actual.length; i++) {
		  if (actual[i] && actual[i].search(/[a-zA-Z]+/) == -1 ) newArray.push(actual[i]);	  
	  }

	  for( var i = 0; i < newArray.length; i++) { console.log(newArray[i]); }

    var atomtype = null; 

    if(type == "atom")  atomtype = new atomType(newArray);             // creating an atom object from an array  
    else if(type == "bond")  atomtype = new bondType(newArray);       // creating a bond object from an array 
    else if(type == "angle") atomtype = new angles(newArray);         // creating an angle object from an array 
    else if(type == "torsions") atomtype = new torsions(newArray);    // creating a torsions object from an array 
    else if(type == "diag") atomtype = new diag(newArray);           // creating a diag object from an array 
    else if(type == "hbonds") atomtype = new hbonds(newArray);       // creating a hbonds object from an array 
    else if(type == "torsions") atomtype = new torsions(newArray);   // creating a torsions object from an array 
	  
    return atomtype;

	}  // end cleanArray function


	function loadAtoms(atom, start, end, type){	
		var atomvalues = []; 
		
    for(var i = start, j = 0; i < end; i++,j++){
				atomvalues[j] = atom[i];
				console.log(atomvalues[j]); // print after it is stored     
				console.log()
		}

    if (type == "atom") {
        atom_d = atomvalues[0].replace(/\s\s+/g,' ').split(" ");
        atom_d.push.apply(atom_d,atomvalues[1].replace(/\s\s+/g,' ').split(" "));
        atom_d.push.apply(atom_d,atomvalues[2].replace(/\s\s+/g,' ').split(" "));
        atom_d.push.apply(atom_d,atomvalues[3].replace(/\s\s+/g,' ').split(" "));
    }
    else if (type == "bond") {
        atom_d = atomvalues[0].replace(/\s\s+/g,' ').split(" ");
        atom_d.push.apply(atom_d,atomvalues[1].replace(/\s\s+/g,' ').split(" "));
    }
    else if (type == "angle")   { atom_d = atomvalues[0].replace(/\s\s+/g,' ').split(" "); }

    else if (type == "torsions")  { atom_d = atomvalues[0].replace(/\s\s+/g,' ').split(" "); }  
    
    else if (type == "diag")    { atom_d = atomvalues[0].replace(/\s\s+/g,' ').split(" "); }

    else if (type == "hbonds")  { atom_d = atomvalues[0].replace(/\s\s+/g,' ').split(" "); }  
          
		return cleanArray(atom_d, type);
	
  }  //end loadAtoms function
   

    function openFile(event) {
        var input = event.target;
        var reader = new FileReader();
        
        reader.onload = function() {
        
        var text = reader.result;
	      var arrayOfLines = text.split("\n ");
        var node = document.getElementById('output');
        var onebody_parameters = new Array();
        var twobody_parameters = new Array();
        var threebody_parameters = new Array();
        var fourbody_parameters = new Array();
        var diagonalAtom = new Array();
        var hydrogenbonds = new Array();
        var myMap = new Map();
		  

      //THIS PROGRAM DYNAMICALLY READS THE INPUT FROM A FILE AND AUTOMATICALLY RECOGNIZES 
      //THE HEADERS AND THE BODY, AND THEN STORES THE VALUES IN APPROPRIATE ARRAYS:


      var count = 1;    
      var onebody_len = 4;
      var twobody_len = 2;
      var atomName;

      //Global paramters
      var elementLen = arrayOfLines[count].match(/[0-9][0-9]*/);
      count++;
      for( var i = count, j = 0; j < elementLen; count++, i++, j++) {
          globalParams[j] = arrayOfLines[i];
          globalParams[j] = globalParams[j].replace(/\s\s+/g, ' ').split(" ")[1];              
      }    
      var param_global = new paramGlobal(globalParams);

      //Allocation of Arrays 
      var num_of_atoms = parseInt(arrayOfLines[count].match(/[0-9][0-9]*/));

      //twobody:
      for(var k = 0; k <= num_of_atoms; k++) { 
        twobody_parameters[k] = new Array(num_of_atoms); 
      }

      //diagonalAtom:
      for(var k = 0; k <= num_of_atoms; k++) { 
        diagonalAtom[k] = new Array(); 
      } 

      //threebody:
      for(var k = 0; k <= num_of_atoms; k++) { 
         threebody_parameters[k] = new Array(); 
          for(var l = 0; l <= num_of_atoms; l++) { 
            threebody_parameters[k][l] = new Array(); 
          }
      }

      //fourbody:
          for(var k = 0; k <= num_of_atoms; k++) { 
            fourbody_parameters[k] = new Array(); 
              for(var l = 0; l <= num_of_atoms; l++) { 
                fourbody_parameters[k][l] = new Array(); 
                 for(var m = 0; m <= num_of_atoms; m++) {
                   fourbody_parameters[k][l][m] = new Array(); 
                 }
              }
          }

      //hydrogenbonds:     
          for(var k = 0; k <= num_of_atoms; k++) { 
            hydrogenbonds[k] = new Array(); 
              for(var l = 0; l <= num_of_atoms; l++) { 
                hydrogenbonds[k][l] = new Array(); 
              }
          }
       
      
      //Populating Arrays  
   
      //onebody
      elementLen = arrayOfLines[count].match(/[0-9][0-9]*/);
      for(var i = count+onebody_len,j=1; i <= count+(elementLen*onebody_len); i+=onebody_len,j++){
         str = arrayOfLines[i];
         atomName = str.match(/[A-Z][a-z]*/);
         myMap.set(j, atomName[0]);
         onebody_parameters[atomName] = loadAtoms(arrayOfLines, i, i+onebody_len, "atom" );  
         onebody_parameters[atomName[1]] =  onebody_parameters[atomName[0]]; 
         onebody_parameters.length++;
      }  
      count += ((parseInt(elementLen[0])+1)*onebody_len);


      //twobody
      elementLen = arrayOfLines[count].match(/[0-9][0-9]*/);  
      for(var i = count+twobody_len; i <= count+(elementLen*twobody_len); i+=twobody_len){
          str = arrayOfLines[i];
          atomName = str.trim().split(/\s+/);  
          twobody_parameters[atomName[0]][atomName[1]] =  loadAtoms(arrayOfLines, i, i+twobody_len, "bond" );  
          twobody_parameters[atomName[1]][atomName[0]] =  twobody_parameters[atomName[0]][atomName[1]];
                           
      }
      count += ((parseInt(elementLen[0])+1)*twobody_len);


      //diagonalAtom:
      elementLen = arrayOfLines[count].match(/[0-9][0-9]*/);
      for(var i = count+1; i <= count+parseInt(elementLen); i++){          
          str = arrayOfLines[i];
          atomName = str.trim().split(/\s+/);                    
          diagonalAtom[atomName[0]][atomName[1]] = loadAtoms(arrayOfLines, i, i+1, "diag" );       
          diagonalAtom[atomName[1]][atomName[0]] = diagonalAtom[atomName[0]][atomName[1]]; 
      }
      count += parseInt(elementLen[0])+1;


      //threebody
      elementLen = arrayOfLines[count].match(/[0-9][0-9]*/);
      for(var i = count+1; i <= count+parseInt(elementLen); i++){
          str = arrayOfLines[i];
          atomName = str.trim().split(/\s+/);
          threebody_parameters[atomName[0]][atomName[1]][atomName[2]] = loadAtoms(arrayOfLines, i, i+1, "angle" );   
          threebody_parameters[atomName[2]][atomName[1]][atomName[0]] = threebody_parameters[atomName[0]][atomName[1]][atomName[2]] 
      }
      count += parseInt(elementLen[0])+1;


      //fourbody
      elementLen = arrayOfLines[count].match(/[0-9][0-9]*/);
      for(var i = count+1; i < count+parseInt(elementLen); i++){
          str = arrayOfLines[i];
          atomName = str.trim().split(/\s+/);
          fourbody_parameters[atomName[0]][atomName[1]][atomName[2]][atomName[3]] = loadAtoms(arrayOfLines, i, i+1, "torsions" );
          fourbody_parameters[atomName[3]][atomName[2]][atomName[1]][atomName[0]] = fourbody_parameters[atomName[0]][atomName[1]][atomName[2]][atomName[3]]   
      }
      count += parseInt(elementLen[0])+1;


      //hydrogenbonds
      elementLen = arrayOfLines[count].match(/[0-9][0-9]*/);
      for(var i = count+1; i < count+parseInt(elementLen); i++){
          str = arrayOfLines[i];
          atomName = str.trim().split(/\s+/);
          atomName = str.trim();
          hydrogenbonds[atomName[0]][atomName[1]][atomName[2]] = loadAtoms(arrayOfLines, i, i+1, "hbonds" );      
          hydrogenbonds[atomName[2]][atomName[1]][atomName[0]] = hydrogenbonds[atomName[0]][atomName[1]][atomName[2]];
      }
      count += parseInt(elementLen[0])+1;



      // This nested for loop puts all the values from onebody_parameters into twobody_parameters array.
      for (var i = 1; i <= onebody_parameters.length; i++) {
            var x = myMap.get(i);
        for (var j = 1; j <= onebody_parameters.length; j++) {
            var y = myMap.get(j);
          
            paramAtom1 = twobody_parameters[i][j];
        
            paramAtom1.roSigma = 0.5 * (onebody_parameters[x].roSigma + onebody_parameters[y].roSigma);
            paramAtom1.roPi    = 0.5 * (onebody_parameters[x].roPi + onebody_parameters[y].roPi);
            paramAtom1.roPiPi  = 0.5 * (onebody_parameters[x].roPiPi + onebody_parameters[y].roPiPi);
            paramAtom1.pboc3   = 0.5 * (onebody_parameters[x].pboc3 + onebody_parameters[y].pboc3);
            paramAtom1.pboc4   = 0.5 * (onebody_parameters[x].pboc4 + onebody_parameters[y].pboc4);
            paramAtom1.pboc5   = 0.5 * (onebody_parameters[x].pboc5 + onebody_parameters[y].pboc5);
            paramAtom1.rvdw    = 0.5 * (onebody_parameters[x].rvdw + onebody_parameters[y].rvdw);
            paramAtom1.gammaW  = 0.5 * (onebody_parameters[x].gammaW + onebody_parameters[y].gammaW);
            paramAtom1.gamma   = 0.5 * (onebody_parameters[x].gamma + onebody_parameters[y].gamma);
            paramAtom1.alpha   = 0.5 * (onebody_parameters[x].alpha + onebody_parameters[y].alpha);
            paramAtom1.pboc3   = Math.sqrt(onebody_parameters[x].pboc3 * onebody_parameters[y].pboc3);
            paramAtom1.pboc4   = Math.sqrt(onebody_parameters[x].pboc4 * onebody_parameters[y].pboc4);
            paramAtom1.pboc5   = Math.sqrt(onebody_parameters[x].pboc5 * onebody_parameters[y].pboc5);
            paramAtom1.dij     = Math.sqrt(onebody_parameters[x].dij * onebody_parameters[y].dij);
            paramAtom1.alpha   = Math.sqrt(onebody_parameters[x].alpha * onebody_parameters[y].alpha);
            paramAtom1.rvdw    = 2.0 * Math.sqrt(onebody_parameters[x].rvdw * onebody_parameters[y].rvdw);
            paramAtom1.gammaW  = Math.sqrt(onebody_parameters[x].gammaW * onebody_parameters[y].gammaW);
            paramAtom1.gamma   = Math.pow(onebody_parameters[x].gamma * onebody_parameters[y].gamma, -1.5);
            paramAtom1.rcore   = Math.sqrt(onebody_parameters[x].rcore * onebody_parameters[y].rcore);
            paramAtom1.ecore   = Math.sqrt(onebody_parameters[x].ecore * onebody_parameters[y].ecore);
            paramAtom1.acore   = Math.sqrt(onebody_parameters[x].acore * onebody_parameters[y].acore);
            paramAtom1.lgcij   = Math.sqrt(onebody_parameters[x].lgcij * onebody_parameters[y].lgcij);
            paramAtom1.lgre    = 2.0 * Math.sqrt(onebody_parameters[x].lgre * onebody_parameters[y].lgre); 

            twobody_parameters[i][j] = paramAtom1;
            //alert(": ", onebody_parameters[i].roPiPi );
      }
    }


      //Display Logic
      window.object.getValuesFromReadFile(r_ij, param_global, onebody_parameters, twobody_parameters, threebody_parameters, fourbody_parameters, myMap);

      window.object.vanDerWaalsInteraction(0,1);  
      window.object.coulombInteraction(0,1);   
      window.object.bondOrder();
      window.object.bondEnergy(0,1);  
      window.object.lonepairEnergy(0);          
      window.object.overCoordination(0);
      window.object.valenceEnergy(0,1,2);  
      window.object.coalitionEnergy(0,1,2);   
      window.object.penaltyEnergy(0,1,2);
     // window.object.torsionEnergy(0,1,2,3);  
     //window.object.hydrogenBondInteraction();
     //window.object.conjugationEnergy();   //0,1,2,3, 
     //window.object.C2Correction();
   
        //console.log(window.testing);
       
      
		  
      };  // end onload function 

        reader.readAsText(input.files[0]);

    }   // end openFile function 



//NOTE:
/*

find the value for rvdw, lgre and lgre in reaxc_ffield.cpp
-> why is their no array in getValuesFromReadFile(_onebody_parameters);

   /*
          read Line " 39       ! Number of general parameters "
          n =  the total number of lines in header
          extract number in header "39" to len variable
          for(i=0;i<39;i++){
              x = extract Atoms/Bond type
              Array["x"] = loadAtoms(arrayOfLines,num+(i*n),num+((i+1)*n),"atom"); 
          }
  */





