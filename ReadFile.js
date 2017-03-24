
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
    this.P_cot1  = parseFloat(paramTorsions[8]);
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

    if(type == "atom")  atomtype = new atomType(newArray); // creating an atom object from an array 
    
    else if(type == "bond")  atomtype = new bondType(newArray); // creating a bond object from an array 
    
    else if(type == "angle") atomtype = new angles(newArray);   // creating a angle object from an array 
    
    else if(type == "torsions") atomtype = new torsions(newArray);   // creating a torsions object from an array 
    
    else if(type == "diag") atomtype = new diag(newArray); // creating a diag object from an array 
    
    else if(type == "hbonds") atomtype = new hbonds(newArray);   // creating a hbonds object from an array 
	  
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
	      var arrayOfLines = text.split("\n");
        var node = document.getElementById('output');
        var onebody_parameters = new Array();
        var twobody_parameters = new Array();
        var threebody_parameters = new Array();
        var fourbody_parameters = new Array();
        var diagonalAtom = new Array();
		  	var diagonalType = false;	 
        var hydrogenbonds = new Array();
        var hydrogenType = false;
		  

      //THIS PROGRAM DYNAMICALLY READS THE INPUT FROM A FILE AND AUTOMATICALLY RECOGNIZES 
      //THE HEADERS AND THE BODY AND THEN STORES THE VALUES IN APPROPRIATE ARRAYS:
      
      var i = 0;
      var count = 1;
      var num_of_atoms = 0;
      while(count < arrayOfLines.length) {

        var str = arrayOfLines[count];

        console.log(str.match(/^\s*[0-9][0-9]*\s*\!\s*[A-Za-z ]*/)!=null);  //1st header line
        if (str.match(/^\s*[0-9][0-9]*\s*\!\s*[A-Za-z ]*/) != null) {   
           
            if(str.match("Nr of off-diagonal terms")) diagonalType = true;
            if(str.match("Nr of hydrogen bonds")) hydrogenType = true;
            
            i=1;
            var elementLen = str.match(/[0-9][0-9]*/); 
            console.log("First line of the Header");
            console.log(str);
        } 
        else if (str.match(/^\s*[a-zA-Z()]{3,}[a-zA-Z;()]*/) != null) {   
            i++;
            console.log("Remaining Headers");
            console.log(str);
        }   
        else {    //This condition recognizes the body that has values

          if(str.match(/^\s*[0-9][0-9.]*\s*\![a-z()0-9]*/) != null) //recognizes paramGeneral type
          {   
            console.log("Global params");
            for( var i = count, j = 0; j < elementLen; i++, j++) {
              globalParams[j] = arrayOfLines[i];
              globalParams[j] = globalParams[j].replace(/\s\s+/g, ' ').split(" ")[1];
              console.log(globalParams[j]);  
              count++;                   
            }
     
            var param_global = new paramGlobal(globalParams);     
            count=count-1;
          }   
          else if(str.match(/^\s*[A-Z][a-z]*\s\s*[0-9][0-9]*.[0-9][0-9]*\s/) != null) //single body 
          {  
             num_of_atoms = elementLen[0];
              for( var j = 0; j < elementLen[0]; j++) {
                    console.log("carbon");  
                    str = arrayOfLines[count];
                    var atomName = str.match(/[A-Z][a-z]*/);
                    onebody_parameters[atomName] = loadAtoms(arrayOfLines, count, count+i, "atom" );         
                    count = count + i;  
              }
                count=count-1;
          } 
          else if((str.match(/^\s*[0-9]\s\s*[0-9]\s\s*[0-9][0-9]*.[0-9][0-9]*\s/) != null) && diagonalType )   //  Nr of off-diagonal
          {
              for(var k = 0; k <= num_of_atoms; k++) { diagonalAtom[k] = new Array(); }
              
              for( var j = 0; j < elementLen[0]; j++ ) { 
                    str = arrayOfLines[count];
                    var atomName = str.split(" ");
                    diagonalAtom[atomName[2]][atomName[4]] = loadAtoms(arrayOfLines, count, count+i, "diag" );         
                    count = count + i;  
                
               }
              diagonalType = false;
              count = count - 1;
          }    
          else if ((str.match(/^\s*[0-9]\s\s*[0-9]\s\s*[0-9]\s\s*[0-9][0-9]*.[0-9][0-9]*\s/) != null) && hydrogenType )  // Nr of hydrogen bonds
          {
              for(var k = 0; k <= num_of_atoms; k++) { 
                hydrogenbonds[k] = new Array(); 
                 for(var l = 0; l <= num_of_atoms; l++) { 
                    hydrogenbonds[k][l] = new Array(); 
                  }
              }
              
              for( var j = 0; j < elementLen[0]; j++ ) { 
                    str = arrayOfLines[count];
                    var atomName = str.split(" ");
                    hydrogenbonds[atomName[2]][atomName[4]][atomName[6]] = loadAtoms(arrayOfLines, count, count+i, "hbonds" );         
                    count = count + i;  
                
               }
              count = count - 1;
          }   
          else if(str.match(/^\s*[0-9]\s\s*[0-9]\s\s*[0-9][0-9]*.[0-9][0-9]*\s/) != null )    //two body           
          {
              for(var k = 0; k <= num_of_atoms; k++) { twobody_parameters[k] = new Array(); }
              
              for( var j = 0; j < elementLen[0]; j++ ) { 
                    str = arrayOfLines[count];
                    var atomName = str.split(" ");
                    twobody_parameters[atomName[2]][atomName[4]] = loadAtoms(arrayOfLines, count, count+i, "bond" );         
                    count = count + i;           
              }
              count = count - 1;
          } 
          else if(str.match(/^\s*[0-9]\s\s*[0-9]\s\s*[0-9]\s\s*[0-9][0-9]*.[0-9][0-9]*\s/) != null)  // three body    
          {   
              for(var k = 0; k <= num_of_atoms; k++) { 
                  threebody_parameters[k] = new Array(); 
                 for(var l = 0; l <= num_of_atoms; l++) { 
                    threebody_parameters[k][l] = new Array(); 
                  }
              }
             
              for( var j = 0; j < elementLen[0]; j++ ) { 
                    str = arrayOfLines[count];
                    var atomName = str.split(" ");
                    threebody_parameters[atomName[2]][atomName[4]][atomName[6]] = loadAtoms(arrayOfLines, count, count+i, "angle" );         
                    count = count + i;           
              }
              count = count - 1;    
          }  
          else if(str.match(/^\s*[0-9]\s\s*[0-9]\s\s*[0-9]\s\s*[0-9]\s/) != null )    //four body 
          {
              for(var k = 0; k <= num_of_atoms; k++) { 
                  fourbody_parameters[k] = new Array(); 
                for(var l = 0; l <= num_of_atoms; l++) { 
                    fourbody_parameters[k][l] = new Array(); 
                  for(var m = 0; m <= num_of_atoms; m++){
                         fourbody_parameters[k][l][m] = new Array(); 
                    }
                }
              }

              for( var j = 0; j < elementLen[0]; j++ ) { 
                    str = arrayOfLines[count];
                    var atomName = str.split(" ");
                    fourbody_parameters[atomName[2]][atomName[4]][atomName[6]][atomName[8]] = loadAtoms(arrayOfLines, count, count+i, "torsions" );         
                    count = count + i;           
              }
              count = count - 1;  
          }    
         
          }
          count++;
      }



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
      twobody_parameters[1][0]= coObj12;
      twobody_parameters[1][1]= ooObj22;
      twobody_parameters[0][2]= chObj13;
      twobody_parameters[2][0]= chObj13;
      twobody_parameters[2][2]= hhObj33;
      twobody_parameters[1][2]= ohObj23;
      twobody_parameters[2][1]= ohObj23;
    
      //threebody_parameters:
      var param_angle = [ ccc, cch, hch, chh, chc, hhh, cco, oco, hco, coc, coo, ooo, coh, hoo, hoh, cho, oho, hho ];
      var threebody_parameters_len = 5;
      var threebody_parameters = new Array(threebody_parameters_len);
         
      for(var i =0; i < threebody_parameters_len; i++){
          threebody_parameters[i] = new Array(threebody_parameters_len);
        for(var j = 0; j < threebody_parameters_len; j++){
          threebody_parameters[i][j] = new Array(threebody_parameters_len);
        }
      }

      //C-1, H-2, O-3
    
      threebody_parameters[0][0][0]= ccc;
      threebody_parameters[0][0][1]= cch;
      threebody_parameters[1][0][1]= hch;
      threebody_parameters[0][1][1]= chh;
      threebody_parameters[0][1][0]= chc;
      threebody_parameters[1][1][1]= hhh;
      threebody_parameters[0][0][2]= cco;
      threebody_parameters[2][0][2]= oco;
      threebody_parameters[1][0][2]= hco;
      threebody_parameters[0][2][0]= coc;
      threebody_parameters[0][2][2]= coo;
      threebody_parameters[2][2][2]= ooo;
      threebody_parameters[0][2][1]= coh;
      threebody_parameters[1][2][2]= hoo;
      threebody_parameters[1][2][1]= hoh;
      threebody_parameters[0][1][2]= cho;
      threebody_parameters[2][1][2]= oho;
      threebody_parameters[1][1][2]= hho;



      // This nested for loop puts all the values from onebody_parameters into twobody_parameters array.
      for (var i = 0; i < onebody_parameters.length; i++) {
        for (var j = 0; j < onebody_parameters.length; j++) {
          
           paramAtom1 = twobody_parameters[i][j];
        
            paramAtom1.roSigma = 0.5 * (onebody_parameters[i].roSigma + onebody_parameters[j].roSigma);
            paramAtom1.roPi = 0.5 * (onebody_parameters[i].roPi + onebody_parameters[j].roPi);
            paramAtom1.roPiPi = 0.5 * (onebody_parameters[i].roPiPi + onebody_parameters[j].roPiPi);
            paramAtom1.pboc3 = 0.5 * (onebody_parameters[i].pboc3 + onebody_parameters[j].pboc3);
            paramAtom1.pboc4 = 0.5 * (onebody_parameters[i].pboc4 + onebody_parameters[j].pboc4);
            paramAtom1.pboc5 = 0.5 * (onebody_parameters[i].pboc5 + onebody_parameters[j].pboc5);
            paramAtom1.rvdw = 0.5 * (onebody_parameters[i].rvdw + onebody_parameters[j].rvdw);
            paramAtom1.gammaW = 0.5 * (onebody_parameters[i].gammaW + onebody_parameters[j].gammaW);
            paramAtom1.gamma = 0.5 * (onebody_parameters[i].gamma + onebody_parameters[j].gamma);
            paramAtom1.alpha = 0.5 * (onebody_parameters[i].alpha + onebody_parameters[j].alpha);
            paramAtom1.pboc3 = Math.sqrt(onebody_parameters[i].pboc3 * onebody_parameters[j].pboc3);
            paramAtom1.pboc4 = Math.sqrt(onebody_parameters[i].pboc4 * onebody_parameters[j].pboc4);
            paramAtom1.pboc5 = Math.sqrt(onebody_parameters[i].pboc5 * onebody_parameters[j].pboc5);
            paramAtom1.dij = Math.sqrt(onebody_parameters[i].dij * onebody_parameters[j].dij);
            paramAtom1.alpha = Math.sqrt(onebody_parameters[i].alpha * onebody_parameters[j].alpha);
            paramAtom1.rvdw = 2.0 * Math.sqrt(onebody_parameters[i].rvdw * onebody_parameters[j].rvdw);
            paramAtom1.gammaW = Math.sqrt(onebody_parameters[i].gammaW * onebody_parameters[j].gammaW);
            paramAtom1.gamma = Math.pow(onebody_parameters[i].gamma * onebody_parameters[j].gamma, -1.5);
            paramAtom1.rcore = Math.sqrt(onebody_parameters[i].rcore * onebody_parameters[j].rcore);
            paramAtom1.ecore = Math.sqrt(onebody_parameters[i].ecore * onebody_parameters[j].ecore);
            paramAtom1.acore = Math.sqrt(onebody_parameters[i].acore * onebody_parameters[j].acore);
            paramAtom1.lgcij = Math.sqrt(onebody_parameters[i].lgcij * onebody_parameters[j].lgcij);
            paramAtom1.lgre = 2.0 * Math.sqrt(onebody_parameters[i].lgre * onebody_parameters[j].lgre); 

            twobody_parameters[i][j] = paramAtom1;
            //alert(": ", onebody_parameters[i].roPiPi );
      }
    }


      //Display Logic
      window.object.getValuesFromReadFile(r_ij, param_global, onebody_parameters, twobody_parameters, threebody_parameters, fourbody_parameters);

      window.object.vanDerWaalsInteraction();
      window.object.coulombInteraction();
      window.object.bondOrder();
      window.object.lonepairEnergy();
      window.object.valenceEnergy();
        
   
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


