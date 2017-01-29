
var object = (function() {
    var World = function() {

	var screen = document.getElementById("screen").getContext("2d");
	this.scale = 20.0;
	this.size = { x: screen.canvas.width/this.scale, y: screen.canvas.height/this.scale, z: screen.canvas.height/this.scale};

	this.timestep = 0.99; // Timestep in femtoseconds
	this.dt = 0.020454828*this.timestep; // timestep in simulation units; sqrt(u*angstroms^2/kcal_mol)
	this.dt2 = this.dt*this.dt;
	this.thrust = 100.0;
	this.wallSpring = 200.0;
	this.eps = 1e6;
	this.maxVel = 10.0;
	this.statusText = "";
	this.id = 0;
	this.clear = true;
	this.setup();
	this.keyboarder = new Keyboarder();
	this.bond_order = null;
	this.bond_order_sigma = null;
	this.bond_order_pi = null;
	this.bond_order_pi2 = null;
	this.rij = null;
	this.paramGeneral = null;
	this.onebody_parameters = null;
	this.twobody_parameters = null;

	var self = this;
	var tick = function() {
	    self.update();
	    self.draw(screen);
	    requestAnimationFrame(tick);
	};
	tick();
    };   //end World


World.prototype = {
	update: function() {

	    // Zero the forces.
	    for (var i = 0; i < this.atoms.length; i++) {
	    	this.atoms[i].force.x = 0.0;
    		this.atoms[i].force.y = 0.0;
	    }

	    // User input.
	    if (this.keyboarder.isDown(this.keyboarder.KEYS.LEFT)) {
			this.player.force.x -= this.thrust;
			this.shootFireball(this.player, 0.1, 0.0);
	    }
	    if (this.keyboarder.isDown(this.keyboarder.KEYS.RIGHT)) {
			this.player.force.x += this.thrust;
			this.shootFireball(this.player, -0.1, 0.0);
	    }
	    if (this.keyboarder.isDown(this.keyboarder.KEYS.UP)) {
			this.player.force.y -= this.thrust;
			this.shootFireball(this.player, 0.0, 0.1);
	    }
	    if (this.keyboarder.isDown(this.keyboarder.KEYS.DOWN)) {
			this.player.force.y += this.thrust;
			this.shootFireball(this.player, 0.0, -0.1);
	    }
	    this.statusText += " thrust: " + this.player.force.x + " " + this.player.force.y;

	    // Interact.
	    for (var i = 0; i < this.atoms.length; i++) {
	      	for (var j = i + 1; j < this.atoms.length; j++) {
	     	    //this.atoms[i].interact(this.atoms[j]);
	        }
	    }
	    // Step.
	    for (var i = 0; i < this.atoms.length; i++) {
	     	if (this.atoms[i].step !== undefined) {
		   		//this.atoms[i].step();
			}
	 	}

	    this.statusText = this.atoms[0].pos.x + " " + this.atoms[0].pos.y + " " + this.atoms[0].pos.z;

	    // Fireballs.
	    var newFireballs = [];
	    var n = 0;
	    for (var i = 0; i < this.fireballs.length; i++) {
	      	if (this.fireballs[i].step !== undefined) {
		    this.fireballs[i].step();
		    if (this.fireballs[i].time < this.fireballs[i].lifetime)
		       	newFireballs.push(this.fireballs[i]);
			}
	    }
	    this.fireballs = newFireballs;

	    document.getElementById("status").innerHTML = this.statusText;
	    this.time++;
	}, //end update fucntion

	setup: function() {
	    this.id = 0;
	    this.time = 0;
	    // Restart.
	    this.atoms = [];

	    // Add the player.
	    this.addAtom(1.2, 0.0, 0.0, 2);
	    this.player = this.atoms[this.atoms.length-1];
	    this.player.jump = 0;
	    this.id++;
	    this.addAtom(0.0, 0.0, 0.0, 2);
	    this.fireballs = [];
	},

	draw: function(screen) {
	    if (this.clear) screen.clearRect(0, 0, screen.canvas.width, screen.canvas.height);
	    screen.strokeStyle="white";
	    screen.strokeRect(0, 0, this.size.x*this.scale, this.size.y*this.scale);

	    for (var i = 0; i < this.atoms.length; i++) {
		if (this.atoms[i].draw !== undefined)
		    this.atoms[i].draw(screen);
	    }

	    for (var i = 0; i < this.fireballs.length; i++) {
	    	if (this.fireballs[i].draw !== undefined)
		    this.fireballs[i].draw(screen);
	    }
	},

	addAtom: function(x, y, z, type) {
	    var atom = new Atom(this, this.id, x, y, z, type);
	    this.atoms.push(atom);
	    this.id++;
	},

	toggleClear: function() {
	    this.clear = !this.clear;
	},

	shootFireball: function(atom,vx,vy) {
	    var v = Math.sqrt(vx*vx + vy*vy);
	    var x = atom.pos.x + 0.4*atom.radius*(Math.random()-0.5) + 0.8*vx/v*atom.radius;
	    var y = atom.pos.y + 0.4*atom.radius*(Math.random()-0.5) + 0.8*vy/v*atom.radius;
	    var fireball = new Fireball(this,{x: x, y: y}, 0.0);
	    fireball.vel.x += vx;
	    fireball.vel.y += vy;
	    this.fireballs.push(fireball);
	},

	removeAtom: function(atom) {
	    var atomIndex = this.atoms.indexOf(atom);
	    if (atomIndex !== -1) {
		this.atoms.splice(atomIndex, 1);
	    }
	},

	deleteAtom: function(atomIndex) {
	    if (atomIndex >= 0 && atomIndex < this.atoms.length) {
		this.atoms.splice(atomIndex, 1);
	    }
	},   
};  // end World.prototype


    var Atom = function(world, id, x, y, z, type) {
		this.world = world;
		this.pos = {x: x, y: y, z: z};
		this.radius = 2.0;
		this.mass = 12.0;
		this.vel = { x: 0, y: 0, z: 0};
		this.force = { x: 0, y: 0, z: 0};
		this.id = id;
		this.onFire = false;
		this.x = x;
	    this.y = y;
	    this.z = z;
		this.type = type;
    };  //end Atom

    Atom.prototype = {
	interact: function(atom) {
	    if (this.mass < 0.0 && atom.mass < 0.0) return;

	    var dx = this.pos.x - atom.pos.x;
	    var dy = this.pos.y - atom.pos.y;
	    var dz = this.pos.z - atom.pos.z;
	    var distance = Math.sqrt(dx*dx+dy*dy+dz*dz);
	  

	    // Lennard-Jones interaction
	    //var force1 = -1e-4*(distance-4)*(distance-4)*(distance-4);
	    var sigma = 1.9133;
	    var epsilon = 0.1853;
	    var sigma6 = Math.pow(sigma,6.0);
	    var dist14 = Math.pow(distance,14.0);
	    var dist8 = Math.pow(distance,8.0);
	    var force1 = epsilon*(sigma6*sigma6/dist14 - sigma6/dist8);

	    this.force.x += dx*force1;
	    this.force.y += dy*force1;
	    this.force.z += dz*force1;
	    atom.force.x -= dx*force1;
	    atom.force.y -= dy*force1;
	    atom.force.z -= dz*force1;
	},   


	step: function() {
	    // Ignore fixed atoms.
	    if (this.mass <= 0.0) return;

	    // Compute accelerations.
	    // Barrier force.
	    if (this.pos.x-this.radius < 0.0)
	      	this.force.x += -this.world.wallSpring*(this.pos.x-this.radius);
	    else if (this.pos.x+this.radius > this.world.size.x)
		    this.force.x += -this.world.wallSpring*(this.pos.x+this.radius-this.world.size.x);
	    if (this.pos.y-this.radius < 0.0)
			this.force.y += -this.world.wallSpring*(this.pos.y-this.radius);
	    else if (this.pos.y+this.radius > this.world.size.y)
			this.force.y += -this.world.wallSpring*(this.pos.y+this.radius-this.world.size.y)
	    if (this.pos.z-this.radius < 0.0)
			this.force.z += -this.world.wallSpring*(this.pos.z-this.radius);
	    else if (this.pos.z+this.radius > this.world.size.z)
			this.force.z += -this.world.wallSpring*(this.pos.z+this.radius-this.world.size.z);

	    this.vel.x += this.force.x/this.mass*this.world.dt;
	    this.vel.y += this.force.y/this.mass*this.world.dt;
	    this.vel.z += this.force.z/this.mass*this.world.dt;

	    if (this.vel.x > this.world.maxVel) this.vel.x = this.world.maxVel;
	    if (this.vel.x < -this.world.maxVel) this.vel.x = -this.world.maxVel;
	    if (this.vel.y > this.world.maxVel) this.vel.y = this.world.maxVel;
	    if (this.vel.y < -this.world.maxVel) this.vel.y = -this.world.maxVel;
	    if (this.vel.z > this.world.maxVel) this.vel.z = this.world.maxVel;
	    if (this.vel.z < -this.world.maxVel) this.vel.z = -this.world.maxVel;

	    // Leap frog integration.
	    this.pos.x += this.vel.x*this.world.dt;
	    this.pos.y += this.vel.y*this.world.dt;
	    this.pos.z += this.vel.z*this.world.dt;
	},  //end step

	draw: function(screen) {
	    if (this.mass > 0) drawSphere(screen, this);
	    else drawSphereGray(screen, this);
	},  
    };  //end Atom.prototype 

    var Keyboarder = function() {
		var keyState = {};
		window.addEventListener('keydown', function(e) {
	    keyState[e.keyCode] = true;
	});

	window.addEventListener('keyup', function(e) {
	    keyState[e.keyCode] = false;
	});

		this.isDown = function(keyCode) {
	    	return keyState[keyCode] === true;
		};

		this.KEYS = { LEFT: 37, RIGHT: 39, SPACE: 32, UP: 38, DOWN: 40};
    };  //end Keyboarder

    var Fireball = function(world,pos,startFraction) {
		this.pos = {x: pos.x, y: pos.y};
		this.time = Math.floor(30.0*startFraction);
		this.radius0 = 0.5;
		this.radius = this.radius0;
		this.vel = { x: 0.2*(Math.random()-0.5), y: -0.4*Math.random()};
		this.lifetime = 30.0;
		this.world = world;
	};  //end Fireball

    Fireball.prototype = {
	step: function() {
	    this.pos.x += this.vel.x;
	    this.pos.y += this.vel.y;
	    this.radius = this.radius0 + 2.0*this.radius0*this.time/this.lifetime;
	    this.time++;
	},

	draw: function(screen) {
	    drawFireball(screen, this);
	},
    };  //end Fireball.prototype

    var drawSphere = function(screen, atom) {
		screen.fillStyle = "";
		var x = atom.world.scale*atom.pos.x;
		var y = atom.world.scale*atom.pos.y;
		var rad = atom.world.scale*atom.radius;
		var grX0 = x - 0.3*rad;
		var grY0 = y - 0.3*rad;
		var grX1 = x - 0.3*rad;
		var grY1 = y - 0.3*rad;
		var gr = screen.createRadialGradient(grX0,grY0,0.1*rad,grX1,grY1,0.95*rad);
		gr.addColorStop(0,"rgb(245,200,255)");
		gr.addColorStop(1,"rgb(100,20,140)");
		screen.fillStyle = gr;
		screen.beginPath();
		screen.arc(x,y,rad, 0, Math.PI*2, true);
		screen.closePath();
		screen.fill();
    }; //drawSphere

    var drawSphereGray = function(screen, atom) {
		screen.fillStyle = "";
		var x = atom.world.scale*atom.pos.x;
		var y = atom.world.scale*atom.pos.y;
		var rad = atom.world.scale*atom.radius;
		var grX0 = x - 0.3*rad;
		var grY0 = y - 0.3*rad;
		var grX1 = x - 0.3*rad;
		var grY1 = y - 0.3*rad;
		var gr = screen.createRadialGradient(grX0,grY0,0.1*rad,grX1,grY1,0.95*rad);
		gr.addColorStop(0,"rgb(245,245,245)");
		gr.addColorStop(1,"rgb(40,40,40)");
		screen.fillStyle = gr;
		screen.beginPath();
		screen.arc(x,y,rad, 0, Math.PI*2, true);
		screen.closePath();
		screen.fill();
    };  //end drawSphereGray

    var drawFireball = function(screen, fireball) {
		var x = fireball.world.scale*fireball.pos.x;
		var y = fireball.world.scale*fireball.pos.y;
		var rad = fireball.world.scale*fireball.radius;

		var tau = fireball.time/fireball.lifetime;
		if (tau > 1.0) return;
			var tau0 = 0.0;
			var tau1 = 0.25;
			var tau2 = 0.625;
			var tau3 = 1.0;
		if (tau < tau1) {
	    	var a = (tau-tau0)/(tau1-tau0);
	    	var cb = Math.floor(255*(1.0-a));
	   		screen.fillStyle = "rgb(255,255,"+cb+")";
		} 
		else if (tau < tau2) {
	   		var a = (tau-tau1)/(tau2-tau1);
	    	var cr = Math.floor(255 + (238-255)*a);
	    	var cg = Math.floor(255 + (80-255)*a);
	    	var ca = 1.0 - 0.5*a;
	    	screen.fillStyle = "rgba("+cr+","+cg+",0,"+ca+")";
		} 
		else {
	    	var a = (tau-tau2)/(tau3-tau2);
	    	var cr = Math.floor(238 + (128-238)*a);
	    	var cg = Math.floor(80 + (128-80)*a);
	    	var cb = Math.floor(0 + (140-0)*a);
	    	var ca = 0.5 - 0.5*a;
	    	screen.fillStyle = "rgba("+cr+","+cg+","+cb+","+ca+")";
		}
		screen.beginPath();
		screen.arc(x, y, rad, 0, Math.PI*2, true);
		screen.closePath();
		screen.fill();
    };  //end drawFireball



  
    window.addEventListener('load', function() {
		this.world = new World();
    });


//get values from Readfile.js and assign values inside the constructor.
function getValuesFromReadFile(_rij, _paramGeneral, _onebody_parameters, _twobody_parameters) {
	rij = _rij;  
    paramGeneral = _paramGeneral;	   
	onebody_parameters = _onebody_parameters;
	twobody_parameters = _twobody_parameters;	
}


//////////////////////////////////////////////////////////VANDER WALL COULOMBIC FUNCTION/////////////////////////////////////////////////////////

//Van der Waals interactions - nonbonded
function vdW_Coulomb() {    
	var p_vdW1 = paramGeneral.pvdW1  
	var p_vdW1i = 1.0/p_vdW1; 
	var Rcut = paramGeneral.swb;   
	 
	//Tapper-term   (Equation 22)
	var Tap7 = 20 / Math.pow(Rcut, 7);
	var Tap6 = -70 / Math.pow(Rcut, 6);
	var Tap5 = 84 / Math.pow(Rcut, 5);
	var Tap4 = -35 / Math.pow(Rcut, 4);
	var Tap3 = 0;
	var Tap2 = 0;
	var Tap1 = 0;
	var Tap0 = 1;
	var dTap = 0.0;  
	 
	//Taper correction  (Equation 21)
	var Tap = (Tap7 * Math.pow(r_ij, 7)) + 
	          (Tap6 * Math.pow(r_ij, 6)) + 
	          (Tap5 * Math.pow(r_ij, 5)) + 
	          (Tap4 * Math.pow(r_ij, 4)) + 
	          (Tap3 * Math.pow(r_ij, 3)) + 
	          (Tap2 * Math.pow(r_ij, 2)) + 
	          (Tap1 * Math.pow(r_ij, 1)) + Tap0;   

	  
	//Derivative of Tapper correction
	dTap = 7 * Tap7 * r_ij + 6 * Tap6;
	dTap = dTap * r_ij + 5 * Tap5;
	dTap = dTap * r_ij + 4 * Tap;
	dTap = dTap * r_ij + 3 * Tap3;
	dTap = dTap * r_ij + 2 * Tap2;
	dTap += Tap1/r_ij;

	//van der waals calculations
	var powr_vdW1 = Math.pow(r_ij, p_vdW1);
	var powgi_vdW1 = Math.pow( 1.0 / oxygenObj.gammaW, p_vdW1);   
	var fn13 = Math.pow( powr_vdW1 + powgi_vdW1, p_vdW1i );    //(Equation 23b)

	var exp1 = Math.exp( oxygenObj.alpha * (1.0 - fn13 / oxygenObj.rvdw) );
	var exp2 = Math.exp( 0.5 * oxygenObj.alpha * (1.0 - fn13 / oxygenObj.rvdw) );  
	
	//Van der Waals interactions energy equation 
	var e_vdW = Tap * oxygenObj.dij * (exp1 - 2.0 * exp2);    // (Equation 23a)

	var dfn13 = Math.pow( powr_vdW1 + powgi_vdW1, p_vdW1i - 1.0) * Math.pow(r_ij, p_vdW1 - 2.0);     
	var CEvd = dTap * oxygenObj.dij * (exp1 - 2.0 * exp2) - Tap * oxygenObj.dij * (oxygenObj.alpha /oxygenObj.rvdw) * (exp1 - exp2) * dfn13;  

  /*
  //Coulomb calculations 
  dr3gamij_1 = ( r_ij * r_ij * r_ij + twbp.gamma );
  dr3gamij_3 = pow( dr3gamij_1 , 0.33333333333333 );

  tmp = Tap / dr3gamij_3;
  lr.H = EV_to_KCALpMOL * tmp;
  lr.e_ele = C_ele * tmp;

  lr.CEclmb = C_ele * ( dTap -  Tap * r_ij / dr3gamij_1 ) / dr3gamij_3;
 */

} // end of LR_vdW_Coulomb function


//////////////////////////////////////////////////////////BOND ORDER/////////////////////////////////////////////////////////

    // Bond Order and Bond Energy
	function bondOrder() {		
        var val_i = val_j;
        var deltap = [];
        var deltap_boc = [];
        
        var p_boc1 = paramGeneral.pboc1;  
        var p_boc2 = paramGeneral.pboc2; 
        
        //declare and initialize the arrays 
        var bond_order_uncorr = new Array(world.atoms.length);
        var bond_order_uncorr_sigma = new Array(world.atoms.length);
        var bond_order_uncorr_pi = new Array(world.atoms.length);
        var bond_order_uncorr_pi2 = new Array(world.atoms.length);

        //declare and initialize the array indexes
        for (var i = 0; i < world.atoms.length; i++) { 
        	bond_order_uncorr[i] = new Array(world.atoms.length);
  			bond_order_uncorr_sigma[i] = new Array(world.atoms.length);
  			bond_order_uncorr_pi[i] = new Array(world.atoms.length);
  			bond_order_uncorr_pi2[i] = new Array(world.atoms.length);
        }

		for (var i = 0; i < world.atoms.length; i++) {  
  			bond_order_uncorr[i][i] = 0.0;
  			bond_order_uncorr_sigma[i][i] = 0.0;
  			bond_order_uncorr_pi[i][i] = 0.0;
  			bond_order_uncorr_pi2[i][i] = 0.0;
            
  			for (var j = i + 1; j < world.atoms.length; j++) {   
  				var atom_i = world.atoms[i];
  				var atom_j = world.atoms[j];
        
  				var dx = atom_i.pos.x - atom_j.pos.x;
  				var dy = atom_i.pos.y - atom_j.pos.y;
  				var dz = atom_i.pos.z - atom_j.pos.z;
  				var r_ij = Math.sqrt(dx*dx + dy*dy + dz*dz);
  			
  				var sbp_i = onebody_parameters[atom_i.type];
  				var sbp_j = onebody_parameters[atom_j.type];	
  				var twbp =  twobody_parameters[atom_i.type][atom_j.type];   
  
  				if( sbp_i.roSigma > 0.0 && sbp_j.roSigma > 0.0 ) {
			    	var C12 = twbp.pbo1 * Math.pow( r_ij / twbp.roSigma, twbp.pbo2 );
    				var BO_s = (1.0 + paramGeneral.cutoff) * Math.exp( C12 );
  				}
  				else BO_s = C12 = 0.0;
  			
  				if( sbp_i.roPi > 0.0 && sbp_j.roPi > 0.0 ) {
    				var C34 = twbp.pbo3 * Math.pow( r_ij / twbp.roPi, twbp.pbo4 );
    				var BO_pi = Math.exp( C34 );
  				}
  				else BO_pi = C34 = 0.0;

  				if( sbp_i.roPiPi > 0.0 && sbp_j.roPiPi > 0.0 ) {
    				var C56 = twbp.pbo5 * Math.pow( r_ij / twbp.roPiPi, twbp.pbo6 );
    				var BO_pi2 = Math.exp( C56 );
  				}
  				else BO_pi2 = C56 = 0.0;

  				 // Uncorrected bond orders BO'
				bond_order_uncorr_sigma[i][j] = BO_s;
				bond_order_uncorr_sigma[j][i] = BO_s;
				bond_order_uncorr_pi[i][j] = BO_pi;
				bond_order_uncorr_pi[j][i] = BO_pi;
				bond_order_uncorr_pi2[i][j] = BO_pi2;
				bond_order_uncorr_pi2[j][i] = BO_pi2;

  				bond_order_uncorr[i][j] = BO_s + BO_pi + BO_pi2;    //(Equation 2)
  				bond_order_uncorr[j][i] = bond_order_uncorr[i][j];

  				if (bond_order_uncorr[i][j] >  paramGeneral.cutoff) {
  					bond_order_uncorr[i][j]	-=  paramGeneral.cutoff;
  					bond_order_uncorr[j][i]	-=  paramGeneral.cutoff;
  					bond_order_uncorr_sigma[i][j] -=  paramGeneral.cutoff;
  					bond_order_uncorr_sigma[j][i] -=  paramGeneral.cutoff;
  				}
  			
  			}  //end inner for loop
  		} //end outer for loop
    
  // Calculate Deltaprime, Deltaprime_boc values
  for(var i = 0; i < world.atoms.length; i++ ) {
	var sbp_i = onebody_parameters[world.atoms[i].type];

  	var sum = 0.0; 
  	for(var j = 0; j < world.atoms.length; j++ ) {                                                                                                        
    	sum += bond_order_uncorr[i][j];    
    }
    deltap[i] = sum - sbp_i.valency;              //(equation 3a)
    deltap_boc[i] = sum - sbp_i.valBoc;           //(equation 3b) 
  }

  // Corrected Bond Order calculations 
  for(var i = 0; i < world.atoms.length; i++ ) {     
    val_i = sbp_i.valency;    
    sbp_i = onebody_parameters[world.atoms[i].type]; 
    var deltap_i = deltap[i];
    var deltap_boc_i = deltap_boc[i];  
       
    for(var j = i + 1; j < world.atoms.length; j++ ) {   
    	var sbp_j = onebody_parameters[world.atoms[j].type];                                      
        var val_j = sbp_j.valency;             
        var twbp =  twobody_parameters[world.atoms[i].type][world.atoms[j].type];  
  	                   
          var deltap_j = deltap[j];
          var deltap_boc_j = deltap_boc[j];  

          // Correction for overcoordination 
          var exp_p1i = Math.exp( -p_boc1 * deltap_i );
          var exp_p2i = Math.exp( -p_boc2 * deltap_i );
          var exp_p1j = Math.exp( -p_boc1 * deltap_j );
          var exp_p2j = Math.exp( -p_boc2 * deltap_j );  

          var f2 = exp_p1i + exp_p1j;                                                                    //(equation 4c)
          var f3 = -1.0 / p_boc2 * Math.log( 0.5 * ( exp_p2i  + exp_p2j ) );                             //(equation 4d)
          var f1 = 0.5 * ( ( parseFloat(val_i) + f2 )/( parseFloat(val_i) + f2 + f3 ) +  ( parseFloat(val_j) + f2 )/( parseFloat(val_j) + f2 + f3 ) );   //(equation 4b)  
              
          // Correction for 1-3 bond orders
          var BO = bond_order_uncorr[i][j];       
          var exp_f4 = Math.exp(-(parseFloat(twbp.pboc4) * ( BO * BO ) - deltap_boc_i) * parseFloat(twbp.pboc3) + parseFloat(twbp.pboc5));   
          var exp_f5 = Math.exp(-(parseFloat(twbp.pboc4) * ( BO * BO ) - deltap_boc_j) * parseFloat(twbp.pboc3) + parseFloat(twbp.pboc5));    

          var f4 = 1.0 / (1.0 + exp_f4);   //(equation 4e)
          var f5 = 1.0 / (1.0 + exp_f5);   //(equation 4f)
      	
      	  var BO_s_corr = bond_order_uncorr_sigma[i][j] *f1*f4*f5;
      	  var BO_pi_corr = bond_order_uncorr_pi[i][j] *f1*f1*f4*f5;
      	  var BO_pi2_corr = bond_order_uncorr_pi2[i][j] *f1*f1*f4*f5;

          world.bond_order = new Array(world.atoms.length);
		  world.bond_order_sigma =  new Array(world.atoms.length);
          world.bond_order_pi = new Array(world.atoms.length);
      	  world.bond_order_pi2  = new Array(world.atoms.length);

      	for (var k = 0; k < world.atoms.length; k++) { 
            world.bond_order[k] = new Array(world.atoms.length);
  			world.bond_order_sigma[k] = new Array(world.atoms.length);
  			world.bond_order_pi[k] = new Array(world.atoms.length);
  			world.bond_order_pi2[k] = new Array(world.atoms.length);
        }

        //corrected bond order
		world.bond_order[i][j] = BO_s_corr + BO_pi_corr + BO_pi2_corr;     //(equation 4a)
		world.bond_order_sigma[i][j] = BO_s_corr;
       	world.bond_order_pi[i][j] = BO_pi_corr;
      	world.bond_order_pi2[i][j] = BO_pi2_corr;
        
        var bond_energy = bondEnergy(BO_s_corr, BO_pi_corr, BO_pi2_corr, twbp );

    }  // end inner for loop   
   
  }  // end outer for loop
} // end bond order function


	function bondEnergy(BO_s_corr, BO_pi_corr, BO_pi2_corr, twbp) {
        var pow_BOs_be2 = Math.pow( BO_s_corr, twbp.pbe2 );
        var exp_be12 = Math.exp( twbp.pbe1 * ( 1.0 - pow_BOs_be2 ) );
        var cebo = -twbp.DeSigma * exp_be12 * ( 1.0 - twbp.pbe1 * twbp.pbe2 * pow_BOs_be2 );
        
        //calculate the Bond Energy
        var e_bond = -twbp.DeSigma * BO_s_corr * exp_be12 - twbp.DePi * BO_pi_corr - twbp.DePipi * BO_pi2_corr;   //(Equation 6)	      
        return e_bond;	
	}


//////////////////////////////////////////////////////////Lone pair energy/////////////////////////////////////////////////////////

function atomEnergy() {

}

return { vdW_Coulomb: vdW_Coulomb, bondOrder: bondOrder,  getValuesFromReadFile: getValuesFromReadFile };



})();  //END



 



////////////////////////////////////////////////////////////NOTES//////////////////////////////////////////





