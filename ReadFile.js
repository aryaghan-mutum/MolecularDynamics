
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
   this.gamma    = Math.pow(1/paramAtom[5], 3);    //gammaEEM (charge equilibration parameter) = 0.6544
   gamma_  = this.gamma;    
   this.roPi     = paramAtom[6];    //covalent radius 2 = 1.1341
  // roPi_ = this.roPi;
   
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
   //roPiPi_ = this.roPiPi;
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
   this.pval3    = paramAtom[25];
   this.nu       = paramAtom[26];   
   this.valBoc   = paramAtom[27]    //valency_val
   this.pval5    = paramAtom[28];    
   this.rcore2 	 = paramAtom[29];   //rcore2
   this.ecore2 	 = paramAtom[30];   //ecore2
   this.acore2 	 = paramAtom[31];   //acore2  
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
   this.pcoa4  = paramGeneral[30];	
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
var gamma_   = null;


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
  // this.roPi    = roPi_; 
   this.roPiPi  = roPiPi_;
   this.pboc3   = pboc3_;
   this.pboc4   = pboc4_;
   this.pboc5   = pboc5_;
   this.gamma   = gamma_;
}

  function angles(paramAngle) {
    this.at1    = paramAngle[0];
    this.at2    = paramAngle[1];
    this.at3    = paramAngle[2];
    this.thetao = paramAngle[3];
    this.o      = paramAngle[4];
    this.pval1  = paramAngle[5];
    this.pval2  = paramAngle[6];
    this.pval2  = paramAngle[6];
    this.pcoa1  = paramAngle[7];
    this.pval7  = paramAngle[8];
    this.pen1   = paramAngle[9];
    this.pval4  = paramAngle[10];
  }


	// Will remove all falsy values: undefined, null, 0, false, NaN and "" (empty string)
	function cleanArray(actual, type) {		
	  var newArray = new Array();
	  
    for (var i = 0; i < actual.length; i++) {
		  if (actual[i] && actual[i].search(/[a-zA-Z]+/) == -1 ) newArray.push(actual[i]);	  
	  }

	  for( var i = 0; i < newArray.length; i++) { console.log(newArray[i]); }

    var paramAtom = null; // creating an atom object from an array

    if(type == "atom"){
        var paramAtom = new atomType(newArray); // creating an atom object from an array 
    }
    else if(type == "bond"){
        var paramAtom = new bondType(newArray); // creating an bond object from an array 
    }
    else if(type == "angle"){
        var paramAtom = new angles(newArray); // creating an bond object from an array 
    }
	  return paramAtom;

	}  // end cleanArray function


	function loadAtoms(atom, start, end, type){	
		var atomvalues = []; 
		
    for(var i = start, j = 0; i < end; i++,j++){
				atomvalues[j] = atom[i];
				console.log(atomvalues[j]); // print after it is stored     
				console.log()
		}

    if (type == "atom"){
        atom_d = atomvalues[0].replace(/\s\s+/g,' ').split(" ");
        atom_d.push.apply(atom_d,atomvalues[1].replace(/\s\s+/g,' ').split(" "));
        atom_d.push.apply(atom_d,atomvalues[2].replace(/\s\s+/g,' ').split(" "));
        atom_d.push.apply(atom_d,atomvalues[3].replace(/\s\s+/g,' ').split(" "));
    }
    else if (type == "bond") {
        atom_d = atomvalues[0].replace(/\s\s+/g,' ').split(" ");
        atom_d.push.apply(atom_d,atomvalues[1].replace(/\s\s+/g,' ').split(" "));
    }
    else if (type == "angle") {
        atom_d = atomvalues[0].replace(/\s\s+/g,' ').split(" ");
        atom_d.push.apply(atom_d,atomvalues[1].replace(/\s\s+/g,' ').split(" "));
    }
      
		return cleanArray(atom_d, type);
	
  }  //end loadAtoms function
   

    function openFile(event) {
        var input = event.target;
        var reader = new FileReader();
        
        reader.onload = function() {
        
        var text = reader.result;
	      var arrayOfLines = text.split("\n");
        var node = document.getElementById('output');
		  		 
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

      //twobody_parameters
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

      //threebody_parameters
      console.log("carbon - carbon - carbon (1-1-1) ");
      ccc = loadAtoms(arrayOfLines, 76, 78, "angle");
      console.log("carbon - carbon - hydrogen (1-1-2) ");
      cch = loadAtoms(arrayOfLines, 78, 80, "angle");
      console.log("hydrogen - carbon - hydrogen (2-1-2) ");
      hch = loadAtoms(arrayOfLines, 80, 82, "angle");
      console.log("carbon - hydrogen - hydrogen (1-2-2) ");
      chh = loadAtoms(arrayOfLines, 82, 84, "angle");
      console.log("carbon - hydrogen - carbon (1-2-1) ");
      chc = loadAtoms(arrayOfLines, 84, 86, "angle");
      console.log("hydrogen - hydrogen - hydrogen (2-2-2) ");
      hhh = loadAtoms(arrayOfLines, 86, 88, "angle");
      console.log("carbon - carbon - oxygen (1-1-3) ");
      cco = loadAtoms(arrayOfLines, 88, 90, "angle");
      console.log("oxygen - carbon - oxygen (3-1-3) ");
      oco = loadAtoms(arrayOfLines, 90, 92, "angle");
      console.log("hydrogen - carbon - oxygen (2-1-3) ");
      hco = loadAtoms(arrayOfLines, 76, 78, "angle");
      console.log("carbon - oxygen - carbon (1-3-1) ");
      coc = loadAtoms(arrayOfLines, 76, 78, "angle");
      console.log("carbon - oxygen - oxygen (1-3-3) ");
      coo = loadAtoms(arrayOfLines, 76, 78, "angle");
      console.log("oxygen - oxygen - oxygen (3-3-3) ");
      ooo = loadAtoms(arrayOfLines, 76, 78, "angle");
      console.log("carbon - oxygen - hydrogen (1-3-2) ");
      coh = loadAtoms(arrayOfLines, 76, 78, "angle");
      console.log("hydrogen - oxygen - oxygen (2-3-3) ");
      hoo = loadAtoms(arrayOfLines, 76, 78, "angle");
      console.log("hydrogen - oxygen - hydrogen (2-3-2) ");
      hoh = loadAtoms(arrayOfLines, 76, 78, "angle");
      console.log("carbon - hydrogen - oxygen (1-2-3) ");
      cho = loadAtoms(arrayOfLines, 76, 78, "angle");
      console.log("oxygen - hydrogen - oxygen (3-2-3) ");
      oho = loadAtoms(arrayOfLines, 76, 78, "angle");
      console.log("hydrogen - hydrogen - oxygen (2-2-3) ");
      hho = loadAtoms(arrayOfLines, 76, 78, "angle");

      //onebody_parameters:
      var onebody_parameters = [ carbonObj, hydrogenObj, oxygenObj ];
      
      //twobody_parameters:
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

      //threebody_parameters:
      var param_angle = [ ccc, cch, hch, chh, chc, hhh, cco, oco, hco, coc, coo, ooo, coh, hoo, hoh, cho, oho, hho];
      var threebody_parameters = new Array(5);
          
      for(var i =0; i < threebody_parameters.length; i++){
        threebody_parameters[i] = new Array(5);
      }
/*
      threebody_parameters[1][1][1]= ccc;
      threebody_parameters[1][1][3]= cch;
      threebody_parameters[2][0][2]= hch;
      threebody_parameters[0][2][2]= chh;
      threebody_parameters[2][2][]= chc;
      threebody_parameters[1][2][]= hhh;
      threebody_parameters[1][2][]= cco;
      threebody_parameters[1][2][]= oco;
      threebody_parameters[1][2][]= hco;
      threebody_parameters[1][2][]= coc;
      threebody_parameters[1][2][]= coo;
      threebody_parameters[1][2][]= ooo;
      threebody_parameters[1][2][]= coh;
      threebody_parameters[1][2][]= hoo;
      threebody_parameters[1][2][]= hoh;
      threebody_parameters[1][2][]= cho;
      threebody_parameters[1][2][]= oho;
      threebody_parameters[1][2][]= hho;
*/

      // This nested for loop puts all the values from onebody_parameters into twobody_parameters array.
      for (var i = 0; i < onebody_parameters.length; i++) {
        for (var j = 0; j < onebody_parameters.length; j++) {
          
          paramAtom1 = twobody_parameters[i][j];
         // paramAtom1.roPi    = 0.5 * (onebody_parameters[i].roPi + onebody_parameters[j].roPi);
          roPi_    = (onebody_parameters[i].roPi + onebody_parameters[j].roPi);
          roPiPi_  = (onebody_parameters[i].roPiPi + onebody_parameters[j].roPiPi);
          pboc3_   = (onebody_parameters[i].pboc3 + onebody_parameters[j].pboc3);
          pboc4_   = (onebody_parameters[i].pboc4 + onebody_parameters[j].pboc4);
          pboc5_   = (onebody_parameters[i].pboc5 + onebody_parameters[j].pboc5);  
          rvdw_    = (onebody_parameters[i].rvdw + onebody_parameters[j].rvdw);  
          gammaW_  = (onebody_parameters[i].gammaW + onebody_parameters[j].gammaW);  
          gamma_   = (onebody_parameters[i].gamma + onebody_parameters[j].gamma);  
          alpha_   = (onebody_parameters[i].alpha + onebody_parameters[j].alpha); 

          pboc3_   = Math.sqrt(onebody_parameters[i].pboc3 * onebody_parameters[j].pboc3); 
          pboc4_   = Math.sqrt(onebody_parameters[i].pboc4 * onebody_parameters[j].pboc4); 
          pboc5_   = Math.sqrt(onebody_parameters[i].pboc5 * onebody_parameters[j].pboc5); 
          dij_     = Math.sqrt(onebody_parameters[i].dij * onebody_parameters[j].dij); 
          alpha_   = Math.sqrt(onebody_parameters[i].alpha * onebody_parameters[j].alpha);   

          rvdw_    = 2.0 * Math.sqrt(onebody_parameters[i].rvdw * onebody_parameters[j].rvdw);   
          gammaW_  = Math.sqrt(onebody_parameters[i].gammaW * onebody_parameters[j].gammaW);   
          gamma_   = Math.pow(onebody_parameters[i].gamma * onebody_parameters[j].gamma, -1.5);   

           // additions for additional vdWaals interaction types - inner core
          rcore_   = Math.sqrt(onebody_parameters[i].rcore2 * onebody_parameters[j].rcore2);   
          ecore_   = Math.sqrt(onebody_parameters[i].ecore2 * onebody_parameters[j].ecore2);   
          acore_   = Math.sqrt(onebody_parameters[i].acore2 * onebody_parameters[j].acore2);   

          // additions for additional vdWalls interaction types lg correction
          lgcij_   = Math.sqrt(onebody_parameters[i].lgcij * onebody_parameters[j].lgcij);   
          lgre_    = 2.0 * Math.sqrt(onebody_parameters[i].lgre * onebody_parameters[j].lgre);   





  //alert(": ", onebody_parameters[i].roPiPi );
/*
          twobody_parameters[i][j].object.roSigma = 0.5 * (onebody_parameters[i].roSigma + onebody_parameters[j].roSigma);
          twobody_parameters[i][j].roPi    = 0.5 * (onebody_parameters[i].roPi + onebody_parameters[j].roPi);
          twobody_parameters[i][j].roPiPi  = 0.5 * (onebody_parameters[i].roPiPi + onebody_parameters[j].roPiPi);
          twobody_parameters[i][j].pboc3   = 0.5 * (onebody_parameters[i].pboc3 + onebody_parameters[j].pboc3);
          twobody_parameters[i][j].pboc4   = 0.5 * (onebody_parameters[i].pboc4 + onebody_parameters[j].pboc4);
          twobody_parameters[i][j].pboc5   = 0.5 * (onebody_parameters[i].pboc5 + onebody_parameters[j].pboc5);  
          twobody_parameters[i][j].rvdw    = 0.5 * (onebody_parameters[i].rvdw + onebody_parameters[j].rvdw);  
          twobody_parameters[i][j].gammaW  = 0.5 * (onebody_parameters[i].gammaW + onebody_parameters[j].gammaW);  
          twobody_parameters[i][j].gamma   = 0.5 * (onebody_parameters[i].gamma + onebody_parameters[j].gamma);  
          twobody_parameters[i][j].alpha   = 0.5 * (onebody_parameters[i].alpha + onebody_parameters[j].alpha); 

          twobody_parameters[i][j].pboc3   = Math.sqrt(onebody_parameters[i].pboc3 * onebody_parameters[j].pboc3); 
          twobody_parameters[i][j].pboc4   = Math.sqrt(onebody_parameters[i].pboc4 * onebody_parameters[j].pboc4); 
          twobody_parameters[i][j].pboc5   = Math.sqrt(onebody_parameters[i].pboc5 * onebody_parameters[j].pboc5); 
          twobody_parameters[i][j].dij     = Math.sqrt(onebody_parameters[i].dij * onebody_parameters[j].dij); 
          twobody_parameters[i][j].alpha   = Math.sqrt(onebody_parameters[i].alpha * onebody_parameters[j].alpha);   

          twobody_parameters[i][j].rvdw    = 2.0 * Math.sqrt(onebody_parameters[i].rvdw * onebody_parameters[j].rvdw);   
          twobody_parameters[i][j].gammaW  = Math.sqrt(onebody_parameters[i].gammaW * onebody_parameters[j].gammaW);   
          twobody_parameters[i][j].gamma   = Math.pow(onebody_parameters[i].gamma * onebody_parameters[j].gamma, -1.5);   

          // additions for additional vdWaals interaction types - inner core
          twobody_parameters[i][j].rcore   = Math.sqrt(onebody_parameters[i].rcore2 * onebody_parameters[j].rcore2);   
          twobody_parameters[i][j].ecore   = Math.sqrt(onebody_parameters[i].ecore2 * onebody_parameters[j].ecore2);   
          twobody_parameters[i][j].acore   = Math.sqrt(onebody_parameters[i].acore2 * onebody_parameters[j].acore2);   

          // additions for additional vdWalls interaction types lg correction
          twobody_parameters[i][j].lgcij   = Math.sqrt(onebody_parameters[i].lgcij * onebody_parameters[j].lgcij);   
          twobody_parameters[i][j].lgre    = 2.0 * Math.sqrt(onebody_parameters[i].lgre * onebody_parameters[j].lgre);   

          */
        }
      }


      //Display Logic
      window.object.getValuesFromReadFile(r_ij, param_global, onebody_parameters, twobody_parameters, threebody_parameters);

      window.object.vanDerWaalsInteraction();
      window.object.bondOrder();
      window.object.atomEnergy();
      window.object.angleEnergy();
        
   
        //console.log(window.testing);
       
      
		  
      };  // end onload function 
        reader.readAsText(input.files[0]);
    }   // end openFile function 



