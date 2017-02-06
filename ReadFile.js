
      var r_ij = 1.2 ;
      var globalParams = [];
	    var carbon = [];
	    var oxygen = [];
      var hydrogen = [];

          
 function atomType(paramAtom) {
   this.atomID   =  "atom ID";
   this.roSigma  = paramAtom[0];    //ro(sigma) single bond covalent radius in A = 1.3817
   roSigma_ = this.roSigma;
   this.valency  = paramAtom[1];    //valency of atom
   this.atmcMass = paramAtom[2];    //atomic mass in daltons
   this.rvdw     = 2 * paramAtom[3];    // van der Waals radius in Amstrongs = 0.18903
   this.dij      = paramAtom[4];    //epsilon
   this.gamma    = paramAtom[5];    //gammaEEM (charge equilibration parameter) = 0.6544
   this.roPi     = paramAtom[6];    //covalent radius 2 = 1.1341
   roPi_ = this.roPi;
   this.valE     = paramAtom[7];    //val(e) (an additional valence, see atoms O and N) = 4
   
   this.alpha    = paramAtom[8]; 
   this.gammaW   = paramAtom[9];     //gamma(w) (van der Waals screening distance in Å) 
   this.valAngle = paramAtom[10]; 
   this.povun5   = paramAtom[11];  
   this.nu       = paramAtom[12];  
   this.chiEEM   = paramAtom[13];     //charge equilibration parameter 
   this.etaEEM   = 2 * paramAtom[14]; //charge equilibration parameter    
   this.nlp_opt  = paramAtom[15];    
   
   this.roPiPi   = paramAtom[16];  //(covalent radius 3) = 1.2114
   roPiPi_ = this.roPiPi;
   this.plp2     = paramAtom[17];  // elp (lone pair energy—carbon has no lone pairs, see O and N ) = 0.0
   this.heatInc  = paramAtom[18]; 
   this.pboc4    = paramAtom[19];
   pboc4_ = this.pboc4;
   this.pboc3    = paramAtom[20];
   pboc3_ = this.pboc3;
   this.pboc5    = paramAtom[21];
   pboc5_ = this.pboc5;
   this.nu       = paramAtom[22];
   this.nu 	     = paramAtom[23]
   
   this.povun2   = paramAtom[24]     
   this.pvaL3    = paramAtom[25];
   this.nu       = paramAtom[26];   
   this.valBoc   = paramAtom[27]    //valency_val
   this.pVal5    = paramAtom[28];    
   this.nu 		   = paramAtom[29];   //rcore2
   this.nu 		   = paramAtom[30];   //ecore2
   this.nu 		   = paramAtom[31];   //acore2  
}

//General parameters
function paramGlobal(paramGeneral) {
   this.pboc1   = paramGeneral[0];
   this.pboc2   = paramGeneral[1];
   this.pcoa2   = paramGeneral[2];
   this.ptrip4  = paramGeneral[3];
   this.ptrip3  = paramGeneral[4];
   this.kc2     = paramGeneral[5];
   this.povun6  = paramGeneral[6];
   this.ptrip2  = paramGeneral[7];
   this.povun7  = paramGeneral[8];
   this.povun8  = paramGeneral[9];
   this.ptrip1  = paramGeneral[10];
   this.swa     = paramGeneral[11];
   this.swb     = paramGeneral[12];
   this.notused = paramGeneral[13];
   this.pval7   = paramGeneral[14];
   this.plp1    = paramGeneral[15];
   this.pval9   = paramGeneral[16];
   this.pval10  = paramGeneral[17];	
   this.notused = paramGeneral[18];	
   this.ppen2   = paramGeneral[19];	
   this.ppen3   = paramGeneral[20];
   this.pval4   = paramGeneral[21];
   this.notused = paramGeneral[22];	 
   this.ptor2   = paramGeneral[23];	
   this.ptor3 	= paramGeneral[24];	
   this.pval4   = paramGeneral[25];	
   this.notused = paramGeneral[26];	
   this.pcot2   = paramGeneral[27];
   this.pvdW1   = paramGeneral[28];		
   this.cutoff  = paramGeneral[29]/100;	
   this.pvcoa4  = paramGeneral[30];	
   this.povun4  = paramGeneral[31];	
   this.povun3  = paramGeneral[32];	
   this.pval8   = paramGeneral[33];	
   this.notused = paramGeneral[34];	
   this.notused = paramGeneral[35];	
   this.notused = paramGeneral[36];	
   this.notused = paramGeneral[37];	
   this.pcoa3   = paramGeneral[38];																						    	
}

var roSigma_ = null;
var roPi_    = null;
var roPiPi_  = null;
var pboc3_   = null;
var pboc4_   = null;
var pboc5_   = null;


function bondType(paramBond) {
   this.at1     = paramBond[0];
   this.at2     = paramBond[1];
   this.DeSigma = paramBond[2];
   this.DePi    = paramBond[3];
   this.DePipi  = paramBond[4];
   this.pbe1    = paramBond[5];
   this.pbo5    = paramBond[6];
   this.v13corr = paramBond[7];
   this.nu      = "not used";
   this.pbo6    = paramBond[8];
   this.povun1  = paramBond[9];
   this.pbe2    = paramBond[10];
   this.pbo3    = paramBond[11];
   this.pbo4    = paramBond[12];
   this.nu      = paramBond[13];
   this.pbo1    = paramBond[14];
   this.pbo2    = paramBond[15];

   this.roSigma = roSigma_;
   this.roPi    = roPi_; 
   this.roPiPi  = roPiPi_;
   this.pboc3   = pboc3_;
   this.pboc4   = pboc4_;
   this.pboc5   = pboc5_;
}


	// Will remove all falsy values: undefined, null, 0, false, NaN and "" (empty string)
	function cleanArray(actual, type) {		
	  var newArray = new Array();
	  for (var i = 0; i < actual.length; i++) {
		if (actual[i] && actual[i].search(/[a-zA-Z]+/) == -1 ) {
		  newArray.push(actual[i]);
		  }
	  }
	  for( var i = 0; i < newArray.length; i++){
			console.log(newArray[i]);
	  }

     var paramAtom = null; // creating an atom object from an array

    if(type == "atom"){
      var paramAtom = new atomType(newArray); // creating an atom object from an array 
    }
    else if(type == "bond"){
        var paramAtom = new bondType(newArray); // creating an bond object from an array 
    }
	  return paramAtom;
	}


	function loadAtoms(atom,start,end,type){	
		var atomvalues = []; 
		for(var i = start, j = 0; i < end; i++,j++){
				atomvalues[j] = atom[i];
				console.log(atomvalues[j]); // print after it is stored     
				console.log()
		  }
      if(type == "atom"){
        atom_d = atomvalues[0].replace(/\s\s+/g,' ').split(" ");
        atom_d.push.apply(atom_d,atomvalues[1].replace(/\s\s+/g,' ').split(" "));
        atom_d.push.apply(atom_d,atomvalues[2].replace(/\s\s+/g,' ').split(" "));
        atom_d.push.apply(atom_d,atomvalues[3].replace(/\s\s+/g,' ').split(" "));
      }
      else if (type == "bond") {
        atom_d = atomvalues[0].replace(/\s\s+/g,' ').split(" ");
        atom_d.push.apply(atom_d,atomvalues[1].replace(/\s\s+/g,' ').split(" "));
      }
		  return cleanArray(atom_d, type);
	}
   
    function openFile(event) {
        var input = event.target;
        var reader = new FileReader();
        reader.onload = function() {
        var text = reader.result;
	      var arrayOfLines = text.split("\n");
        var node = document.getElementById('output');
		  //console.log(text);
		  //console.log(arrayOfLines[2]);
		  		 
		  console.log("Global params");
		  for(var i = 2, j = 0; i < 41; i++,j++) {
				globalParams[j] =arrayOfLines[i];
				globalParams[j] = globalParams[j].replace(/\s\s+/g, ' ').split(" ")[1];
				console.log(globalParams[j]);					
		        		
		  }
		 
		  var param_global = new paramGlobal(globalParams);	 
		 
       	  
		  console.log("carbon");	
		  carbonObj = loadAtoms(arrayOfLines,46,50,"atom");     //Assign carbon values, parameters passed array of line read, start index, end index		  
		  console.log("hydrogen");		 
		  hydrogenObj = loadAtoms(arrayOfLines,50,54, "atom");  //Assign hydrogen values		  
		  console.log("oxygen");		 
		  oxygenObj = loadAtoms(arrayOfLines,54,58, "atom");    //Assign oxygen values

		  console.log("carbon - carbon (1-1) ");
		  ccObj11 = loadAtoms(arrayOfLines, 60, 62, "bond");
    	console.log("carbon - oxygen (1-2) ");
		  coObj12 = loadAtoms(arrayOfLines, 62, 64, "bond");
      console.log("oxygen - oxygen (2-2)");
		  ooObj22 = loadAtoms(arrayOfLines, 64, 66, "bond");
      console.log("carbon - hydrogen (1-3)");
		  chObj13 = loadAtoms(arrayOfLines, 66, 68, "bond");
		  console.log("hydrogen - hydrogen (3-3) ");
		  hhObj33 = loadAtoms(arrayOfLines, 68, 70, "bond");
		  console.log("oxygen - hydrogen (2-3) ");
		  ohObj23 = loadAtoms(arrayOfLines, 70, 72, "bond")

      var onebody_parameters = [ carbonObj, hydrogenObj, oxygenObj ];
      var param_bond = [ ccObj11, coObj12, ooObj22, chObj13, hhObj33, ohObj23];
      var twobody_parameters = new Array(4);

      for(var i =0; i < twobody_parameters.length; i++){
        twobody_parameters[i] = new Array(4);
      }

      twobody_parameters[0][0]= ccObj11;
      twobody_parameters[0][1]= coObj12;
      twobody_parameters[1][1]= ooObj22;
      twobody_parameters[0][2]= chObj13;
      twobody_parameters[2][2]= hhObj33;
      twobody_parameters[1][2]= ohObj23;

      //Display Logic
      window.object.getValuesFromReadFile(r_ij, param_global, onebody_parameters, twobody_parameters);

      window.object.vdW_Coulomb();
      window.object.bondOrder();
      window.object.atomEnergy();
        
   
        //console.log(window.testing);
       
      
		  
       };  // onload function ends
        reader.readAsText(input.files[0]);
      }



