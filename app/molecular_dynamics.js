const TIMESTAMP_IN_FEMPTO_SEC = 0.99
const TIMESTEP_IN_SIMULATION_UNIT = 0.020454828 // sqrt(u*angstroms^2/kcal_mol)
const THRUST = 100.0
const WALL_SPRING = 200.0
const EPS = 1e6
const MAX_VEL = 10.0
const EMPTY_STRING = ''
const ID = 0
const CONTEXT_ID = '2d'

const COULOMB_CONSTANT = 332.06371
const COULOMB_CHARGE_QI = 0.22472581226836  // magnitudes of the charge q1
const COULOMB_CHARGE_QJ = -0.22472581226836 // magnitudes of the charge q2


var object = function () {

    debugger
    var World = function () {

        var screen = document.getElementById("screen").getContext(CONTEXT_ID)

        this.scale = 20.0
        this.size = {
            x: screen.canvas.width / this.scale,
            y: screen.canvas.height / this.scale,
            z: screen.canvas.height / this.scale
        }

        this.timestep = TIMESTAMP_IN_FEMPTO_SEC
        this.dt = TIMESTEP_IN_SIMULATION_UNIT * this.timestep
        this.dt2 = this.dt * this.dt
        this.thrust = THRUST
        this.wallSpring = WALL_SPRING
        this.eps = EPS
        this.maxVel = MAX_VEL
        this.statusText = EMPTY_STRING
        this.id = ID
        this.clear = true
        this.setup()
        this.keyboarder = new Keyboarder()
        this.bond_order = null
        this.bond_order_sigma = null
        this.bond_order_pi = null
        this.bond_order_pi2 = null
        this.rij = null
        this.paramGeneral = null
        this.onebody_parameters = null
        this.twobody_parameters = null
        this.threebody_parameters = null
        this.fourbody_parameters = null
        this.deltap_i = null       //used in bondOrder() Equation 5  corrected and penaltyEnergy()
        this.deltap_boc = null     //used in bondOrder() and valenceEnergy()  uncorrected
        this.deltap = null		   //used in bondOrder() and valenceEnergy()
        this.deltap_i_lp = null    //used in lonepairEnergy() Equation 9
        this.vlpex = null			//used in lonepairEnergy() and valenceEnergy()
        this.n_lp = null			//used in lonepairEnergy() and valenceEnergy()
        this.dDeltap_i_lp = null 	//used in lonepairEnergy() and valenceEnergy()
        this.delta_i = null
        this.BOA_ij = null
        this.BOA_jk = null
        this.BO_s_corr = null
        this.BO_pi_corr = null
        this.BO_pi2_corr = null

        var self = this

        var tick = function () {
            self.update();
            self.draw(screen)
            requestAnimationFrame(tick)
        }
        tick()
    }

    World.prototype = {
        update: function () {

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


            // Calculate bond orders for all atoms.
            // bondOrder();

            // Interact.
            for (var i = 0; i < this.atoms.length; i++) {
                for (var j = i + 1; j < this.atoms.length; j++) {
                    // this.atoms[i].interact(this.atoms[j]);
                    // var enerVdw = vanDerWaalsInteraction(i,j);
                    //  var enerCoulomb = coulombInteraction(i,j);
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

        setup: function () {
            this.id = 0;
            this.time = 0;
            // Restart.
            this.atoms = [];

            // Add the player.
            //Ozone:
            this.addAtom(0.0, 0.0, 0.0, 2);
            this.player = this.atoms[this.atoms.length - 1];
            this.player.jump = 0;
            this.id++;
            this.addAtom(1.2, 0.0, 0.0, 2);
            this.addAtom(2.0, 0.8, 0.0, 2);
            this.fireballs = [];

            //Carbon   : 1
            //Hydrogen : 2
            //Oxygen   : 3

            //CO or O
            /*   this.addAtom(1.2, 0.0, 0.0, 2);
               this.player = this.atoms[this.atoms.length-1];
               this.player.jump = 0;
               this.id++;
               this.addAtom(0.0, 0.0, 0.0, 2);
               this.fireballs = [];  */

        },

        draw: function (screen) {
            if (this.clear) screen.clearRect(0, 0, screen.canvas.width, screen.canvas.height);
            screen.strokeStyle = "white";
            screen.strokeRect(0, 0, this.size.x * this.scale, this.size.y * this.scale);

            for (var i = 0; i < this.atoms.length; i++) {
                if (this.atoms[i].draw !== undefined)
                    this.atoms[i].draw(screen);
            }

            for (var i = 0; i < this.fireballs.length; i++) {
                if (this.fireballs[i].draw !== undefined)
                    this.fireballs[i].draw(screen);
            }
        },

        addAtom: function (x, y, z, type) {
            var atom = new Atom(this, this.id, x, y, z, type);
            this.atoms.push(atom);
            this.id++;
        },

        toggleClear: function () {
            this.clear = !this.clear;
        },

        shootFireball: function (atom, vx, vy) {
            var v = Math.sqrt(vx * vx + vy * vy);
            var x = atom.pos.x + 0.4 * atom.radius * (Math.random() - 0.5) + 0.8 * vx / v * atom.radius;
            var y = atom.pos.y + 0.4 * atom.radius * (Math.random() - 0.5) + 0.8 * vy / v * atom.radius;
            var fireball = new Fireball(this, {x: x, y: y}, 0.0);
            fireball.vel.x += vx;
            fireball.vel.y += vy;
            this.fireballs.push(fireball);
        },

        removeAtom: function (atom) {
            var atomIndex = this.atoms.indexOf(atom);
            if (atomIndex !== -1) {
                this.atoms.splice(atomIndex, 1);
            }
        },

        deleteAtom: function (atomIndex) {
            if (atomIndex >= 0 && atomIndex < this.atoms.length) {
                this.atoms.splice(atomIndex, 1);
            }
        },
    };  // end World.prototype

    var Atom = function (world, id, x, y, z, type) {
        this.world = world;
        this.pos = {x: x, y: y, z: z};
        this.radius = 2.0;
        this.mass = 12.0;
        this.vel = {x: 0, y: 0, z: 0};
        this.force = {x: 0, y: 0, z: 0};
        this.id = id;
        this.onFire = false;
        this.x = x;
        this.y = y;
        this.z = z;
        this.type = type;
    };  //end Atom

    Atom.prototype = {
        interact: function (atom) {
            if (this.mass < 0.0 && atom.mass < 0.0) return;

            var dx = this.pos.x - atom.pos.x;
            var dy = this.pos.y - atom.pos.y;
            var dz = this.pos.z - atom.pos.z;
            var distance = Math.sqrt(dx * dx + dy * dy + dz * dz);

            // valenceEnergy(distance);

            // Lennard-Jones interaction
            //var force1 = -1e-4*(distance-4)*(distance-4)*(distance-4);
            var sigma = 1.9133;
            var epsilon = 0.1853;
            var sigma6 = Math.pow(sigma, 6.0);
            var dist14 = Math.pow(distance, 14.0);
            var dist8 = Math.pow(distance, 8.0);
            var force1 = epsilon * (sigma6 * sigma6 / dist14 - sigma6 / dist8);

            this.force.x += dx * force1;
            this.force.y += dy * force1;
            this.force.z += dz * force1;
            atom.force.x -= dx * force1;
            atom.force.y -= dy * force1;
            atom.force.z -= dz * force1;
        },


        step: function () {
            // Ignore fixed atoms.
            if (this.mass <= 0.0) return;

            // Compute accelerations.
            // Barrier force.
            if (this.pos.x - this.radius < 0.0)
                this.force.x += -this.world.wallSpring * (this.pos.x - this.radius);
            else if (this.pos.x + this.radius > this.world.size.x)
                this.force.x += -this.world.wallSpring * (this.pos.x + this.radius - this.world.size.x);
            if (this.pos.y - this.radius < 0.0)
                this.force.y += -this.world.wallSpring * (this.pos.y - this.radius);
            else if (this.pos.y + this.radius > this.world.size.y)
                this.force.y += -this.world.wallSpring * (this.pos.y + this.radius - this.world.size.y)
            if (this.pos.z - this.radius < 0.0)
                this.force.z += -this.world.wallSpring * (this.pos.z - this.radius);
            else if (this.pos.z + this.radius > this.world.size.z)
                this.force.z += -this.world.wallSpring * (this.pos.z + this.radius - this.world.size.z);

            this.vel.x += this.force.x / this.mass * this.world.dt;
            this.vel.y += this.force.y / this.mass * this.world.dt;
            this.vel.z += this.force.z / this.mass * this.world.dt;

            if (this.vel.x > this.world.maxVel) this.vel.x = this.world.maxVel;
            if (this.vel.x < -this.world.maxVel) this.vel.x = -this.world.maxVel;
            if (this.vel.y > this.world.maxVel) this.vel.y = this.world.maxVel;
            if (this.vel.y < -this.world.maxVel) this.vel.y = -this.world.maxVel;
            if (this.vel.z > this.world.maxVel) this.vel.z = this.world.maxVel;
            if (this.vel.z < -this.world.maxVel) this.vel.z = -this.world.maxVel;

            // Leap frog integration.
            this.pos.x += this.vel.x * this.world.dt;
            this.pos.y += this.vel.y * this.world.dt;
            this.pos.z += this.vel.z * this.world.dt;
        },  //end step

        draw: function (screen) {
            if (this.mass > 0) drawSphere(screen, this);
            else drawSphereGray(screen, this);
        },
    };  //end Atom.prototype 

    var Keyboarder = function () {
        var keyState = {};
        window.addEventListener('keydown', function (e) {
            keyState[e.keyCode] = true;
        });

        window.addEventListener('keyup', function (e) {
            keyState[e.keyCode] = false;
        });

        this.isDown = function (keyCode) {
            return keyState[keyCode] === true;
        };

        this.KEYS = {LEFT: 37, RIGHT: 39, SPACE: 32, UP: 38, DOWN: 40};
    };  //end Keyboarder

    var Fireball = function (world, pos, startFraction) {
        this.pos = {x: pos.x, y: pos.y};
        this.time = Math.floor(30.0 * startFraction);
        this.radius0 = 0.5;
        this.radius = this.radius0;
        this.vel = {x: 0.2 * (Math.random() - 0.5), y: -0.4 * Math.random()};
        this.lifetime = 30.0;
        this.world = world;
    };  //end Fireball

    Fireball.prototype = {
        step: function () {
            this.pos.x += this.vel.x;
            this.pos.y += this.vel.y;
            this.radius = this.radius0 + 2.0 * this.radius0 * this.time / this.lifetime;
            this.time++;
        },

        draw: function (screen) {
            drawFireball(screen, this);
        },
    };  //end Fireball.prototype

    var drawSphere = function (screen, atom) {
        screen.fillStyle = "";
        var x = atom.world.scale * atom.pos.x;
        var y = atom.world.scale * atom.pos.y;
        var rad = atom.world.scale * atom.radius;
        var grX0 = x - 0.3 * rad;
        var grY0 = y - 0.3 * rad;
        var grX1 = x - 0.3 * rad;
        var grY1 = y - 0.3 * rad;
        var gr = screen.createRadialGradient(grX0, grY0, 0.1 * rad, grX1, grY1, 0.95 * rad);
        gr.addColorStop(0, "rgb(245,200,255)");
        gr.addColorStop(1, "rgb(100,20,140)");
        screen.fillStyle = gr;
        screen.beginPath();
        screen.arc(x, y, rad, 0, Math.PI * 2, true);
        screen.closePath();
        screen.fill();
    }; //drawSphere

    var drawSphereGray = function (screen, atom) {
        screen.fillStyle = "";
        var x = atom.world.scale * atom.pos.x;
        var y = atom.world.scale * atom.pos.y;
        var rad = atom.world.scale * atom.radius;
        var grX0 = x - 0.3 * rad;
        var grY0 = y - 0.3 * rad;
        var grX1 = x - 0.3 * rad;
        var grY1 = y - 0.3 * rad;
        var gr = screen.createRadialGradient(grX0, grY0, 0.1 * rad, grX1, grY1, 0.95 * rad);
        gr.addColorStop(0, "rgb(245,245,245)");
        gr.addColorStop(1, "rgb(40,40,40)");
        screen.fillStyle = gr;
        screen.beginPath();
        screen.arc(x, y, rad, 0, Math.PI * 2, true);
        screen.closePath();
        screen.fill();
    };  //end drawSphereGray

    var drawFireball = function (screen, fireball) {
        var x = fireball.world.scale * fireball.pos.x;
        var y = fireball.world.scale * fireball.pos.y;
        var rad = fireball.world.scale * fireball.radius;

        var tau = fireball.time / fireball.lifetime;
        if (tau > 1.0) return;
        var tau0 = 0.0;
        var tau1 = 0.25;
        var tau2 = 0.625;
        var tau3 = 1.0;
        if (tau < tau1) {
            var a = (tau - tau0) / (tau1 - tau0);
            var cb = Math.floor(255 * (1.0 - a));
            screen.fillStyle = "rgb(255,255," + cb + ")";
        } else if (tau < tau2) {
            var a = (tau - tau1) / (tau2 - tau1);
            var cr = Math.floor(255 + (238 - 255) * a);
            var cg = Math.floor(255 + (80 - 255) * a);
            var ca = 1.0 - 0.5 * a;
            screen.fillStyle = "rgba(" + cr + "," + cg + ",0," + ca + ")";
        } else {
            var a = (tau - tau2) / (tau3 - tau2);
            var cr = Math.floor(238 + (128 - 238) * a);
            var cg = Math.floor(80 + (128 - 80) * a);
            var cb = Math.floor(0 + (140 - 0) * a);
            var ca = 0.5 - 0.5 * a;
            screen.fillStyle = "rgba(" + cr + "," + cg + "," + cb + "," + ca + ")";
        }
        screen.beginPath();
        screen.arc(x, y, rad, 0, Math.PI * 2, true);
        screen.closePath();
        screen.fill();
    };  //end drawFireball

    window.addEventListener('load', function () {
        this.world = new World();
    });


//get values from Readfile.js and assign values inside the constructor.
    function getValuesFromReadFile(_rij, _paramGeneral, _onebody_parameters, _twobody_parameters, _threebody_parameters, _fourbody_parameters) {
        rij = _rij;
        paramGeneral = _paramGeneral;
        onebody_parameters = _onebody_parameters;
        twobody_parameters = _twobody_parameters;
        threebody_parameters = _threebody_parameters;
        fourbody_parameters = _fourbody_parameters;
    }


//////////////////////////////////////////////////////////FORCE FIELD FUNCTIONS/////////////////////////////////////////////////////////


/// <summary>
///   Van der Waals interactions:
///   In van der Waals interactions, we use a distance-corrected Morse-potential (Equations. 23a-b). 
///   By including a shielded interaction (Equation 23b) excessively high repulsions between 
///   bonded atoms (1-2 interactions) and atoms sharing a valence angle (1-3 interactions) are avoided.
/// </summary>
    function vanDerWaalsInteraction(i, j) {
        var Rcut = paramGeneral.swb;
        var p_vdW1 = paramGeneral.pvdW1;
        var p_vdW1i = 1.0 / p_vdW1;

        var dx = world.atoms[j].pos.x - world.atoms[i].pos.x;
        var dy = world.atoms[j].pos.y - world.atoms[i].pos.y;
        var dz = world.atoms[j].pos.z - world.atoms[i].pos.z;
        var r_ij = Math.sqrt(dx * dx + dy * dy + dz * dz);

        //Tapper-term   (Equation 22)
        var Tap7 = 20 / Math.pow(Rcut, 7);
        var Tap6 = -70 / Math.pow(Rcut, 6);
        var Tap5 = 84 / Math.pow(Rcut, 5);
        var Tap4 = -35 / Math.pow(Rcut, 4);
        var Tap3 = 0;
        var Tap2 = 0;
        var Tap1 = 0;
        var Tap0 = 1;

        //Taper correction  (Equation 21)
        var Tap = (Tap7 * Math.pow(r_ij, 7)) +
            (Tap6 * Math.pow(r_ij, 6)) +
            (Tap5 * Math.pow(r_ij, 5)) +
            (Tap4 * Math.pow(r_ij, 4)) +
            (Tap3 * Math.pow(r_ij, 3)) +
            (Tap2 * Math.pow(r_ij, 2)) +
            (Tap1 * Math.pow(r_ij, 1)) + Tap0;

        var twbp = twobody_parameters[world.atoms[0].type][world.atoms[1].type];

        //van der waals calculations
        var powr_vdW1 = Math.pow(r_ij, p_vdW1);
        var powgi_vdW1 = Math.pow(1.0 / twbp.gammaW, p_vdW1);
        var fn13 = Math.pow(powr_vdW1 + powgi_vdW1, p_vdW1i);    //(Equation 23b)

        var exp1 = Math.exp(twbp.alpha * (1.0 - fn13 / twbp.rvdw));
        var exp2 = Math.exp(0.5 * twbp.alpha * (1.0 - fn13 / twbp.rvdw));

        //Van der Waals interactions energy equation
        var E_vdW = Tap * twbp.dij * (exp1 - 2.0 * exp2);    	   // (Equation 23a)

        var dfn13 = Math.pow(powr_vdW1 + powgi_vdW1, p_vdW1i - 1.0) * Math.pow(r_ij, p_vdW1 - 2.0);
        //var CEvd = dTap * twbp.dij * (exp1 - 2.0 * exp2) - Tap * twbp.dij * (twbp.alpha /twbp.rvdw) * (exp1 - exp2) * dfn13;

    } // end of vanDerWaalsInteraction function


    /**
     * Coulomb Constant aka Marino's Constant/Electrostatic Constant :
     * As with the van der Waals-interactions, Coulomb interactions are taken into account between all atom pairs.
     * To adjust for orbital overlap between atoms at close distances a shielded Coulomb-potential is used (Equation 24).
     * @param i
     * @param j
     * @returns {number}
     */
    function coulombInteraction(i, j) {
        let rCut = paramGeneral.swb

        //Tapper-term   (Equation 22)
        let tap7 = 20 / Math.pow(rCut, 7)
        let tap6 = -70 / Math.pow(rCut, 6)
        let tap5 = 84 / Math.pow(rCut, 5)
        let tap4 = -35 / Math.pow(rCut, 4)
        let tap3 = 0
        let tap2 = 0
        let tap1 = 0
        let tap0 = 1

        //Taper correction  (Equation 21)
        let tap = (tap7 * Math.pow(r_ij, 7)) +
            (tap6 * Math.pow(r_ij, 6)) +
            (tap5 * Math.pow(r_ij, 5)) +
            (tap4 * Math.pow(r_ij, 4)) +
            (tap3 * Math.pow(r_ij, 3)) +
            (tap2 * Math.pow(r_ij, 2)) +
            (tap1 * Math.pow(r_ij, 1)) + tap0

        //Derivative of Tapper correction
        let dTap = 7 * tap7 * r_ij + 6 * tap6
        dTap = dTap * r_ij + 5 * tap5
        dTap = dTap * r_ij + 4 * tap
        dTap = dTap * r_ij + 3 * tap3
        dTap = dTap * r_ij + 2 * tap2
        dTap += tap1 / r_ij

        let eCoul = 0.0
        let atomI = world.atoms[i]
        let atomJ = world.atoms[j]

        let twbp = twobody_parameters[world.atoms[i].type][world.atoms[j].type]

        let dr3gamij1 = (r_ij * r_ij * r_ij + twbp.gamma)
        let dr3gamij3 = Math.pow(dr3gamij1, 0.33333333333333)
        let tmp = tap / dr3gamij3

        eCoul += COULOMB_CONSTANT * COULOMB_CHARGE_QI * COULOMB_CHARGE_QJ * tmp      // (Equation 24)
        let ceClmb = COULOMB_CONSTANT * COULOMB_CHARGE_QI * COULOMB_CHARGE_QJ * (dTap - tap * r_ij / dr3gamij1) / dr3gamij3

        return eCoul
    }


//////////////////////////////////////////////////////////BOND ORDER/////////////////////////////////////////////////////////
    /**
     * Bond Order and Bond Energy:
     * A fundamental assumption of ReaxFF is that the bond order BO’ij between a pair of atoms can be obtained directly
     * from the interatomic distance rij as given in Equation (2). In calculating the bond orders, ReaxFF distinguishes
     * between contributions from sigma bonds, pi-bonds and double pi bonds.
     */
    function bondOrder() {

        var val_i = val_j;
        deltap = [];
        deltap_boc = [];
        deltap_i = [];

        var p_boc1 = paramGeneral.pboc1;
        var p_boc2 = paramGeneral.pboc2;

        //declare and initialize the arrays 
        world.vlpex = new Array(world.atoms.length);  		 // the array  vlpex is used in lonepairEnergy function
        world.n_lp = new Array(world.atoms.length);  		 // the array  n_lp  is used in lonepairEnergy function
        world.deltap_i_lp = new Array(world.atoms.length);	 // the array  deltap_i_lp  is used in lonepairEnergy function
        world.delta_i = new Array(world.atoms.length);		 // the array  delta_i  is used in overCoordination function
        world.dDeltap_i_lp = new Array(world.atoms.length);	 // the array  dDeltap_i_lp is used in valenceEnergy function

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
                var r_ij = Math.sqrt(dx * dx + dy * dy + dz * dz);

                var sbp_i = onebody_parameters[atom_i.type];
                var sbp_j = onebody_parameters[atom_j.type];
                var twbp = twobody_parameters[atom_i.type][atom_j.type];

                if (sbp_i.roSigma > 0.0 && sbp_j.roSigma > 0.0) {
                    var C12 = twbp.pbo1 * Math.pow(r_ij / twbp.roSigma, twbp.pbo2);
                    var BO_s = (1.0 + paramGeneral.cutoff) * Math.exp(C12);
                } else BO_s = C12 = 0.0;

                if (sbp_i.roPi > 0.0 && sbp_j.roPi > 0.0) {
                    var C34 = twbp.pbo3 * Math.pow(r_ij / twbp.roPi, twbp.pbo4);
                    var BO_pi = Math.exp(C34);
                } else BO_pi = C34 = 0.0;

                if (sbp_i.roPiPi > 0.0 && sbp_j.roPiPi > 0.0) {
                    var C56 = twbp.pbo5 * Math.pow(r_ij / twbp.roPiPi, twbp.pbo6);
                    var BO_pi2 = Math.exp(C56);
                } else BO_pi2 = C56 = 0.0;

                // Uncorrected bond orders BO'
                bond_order_uncorr_sigma[i][j] = BO_s;
                bond_order_uncorr_sigma[j][i] = BO_s;
                bond_order_uncorr_pi[i][j] = BO_pi;
                bond_order_uncorr_pi[j][i] = BO_pi;
                bond_order_uncorr_pi2[i][j] = BO_pi2;
                bond_order_uncorr_pi2[j][i] = BO_pi2;

                bond_order_uncorr[i][j] = BO_s + BO_pi + BO_pi2;    //(Equation 2)
                bond_order_uncorr[j][i] = bond_order_uncorr[i][j];

                if (bond_order_uncorr[i][j] > paramGeneral.cutoff) {
                    bond_order_uncorr[i][j] -= paramGeneral.cutoff;
                    bond_order_uncorr[j][i] -= paramGeneral.cutoff;
                    bond_order_uncorr_sigma[i][j] -= paramGeneral.cutoff;
                    bond_order_uncorr_sigma[j][i] -= paramGeneral.cutoff;
                }

            }  //end inner for loop
        } //end outer for loop

        // Calculate Deltaprime, Deltaprime_boc values
        for (var i = 0; i < world.atoms.length; i++) {
            var sbp_i = onebody_parameters[atom_i.type];

            var sum = 0.0;
            for (var j = 0; j < world.atoms.length; j++) {
                sum += bond_order_uncorr[i][j];
            }
            deltap[i] = sum - sbp_i.valency;              //(Equation 3a)
            deltap_boc[i] = sum - sbp_i.valBoc;           //(Equation 3b)

            world.delta_i[i] = sum - sbp_i.valency;    //setting delta_i for the overCoordination()

        }


        world.bond_order = new Array(world.atoms.length);
        world.bond_order_sigma = new Array(world.atoms.length);
        world.bond_order_pi = new Array(world.atoms.length);
        world.bond_order_pi2 = new Array(world.atoms.length);

        for (var k = 0; k < world.atoms.length; k++) {
            world.bond_order[k] = new Array(world.atoms.length);
            world.bond_order_sigma[k] = new Array(world.atoms.length);
            world.bond_order_pi[k] = new Array(world.atoms.length);
            world.bond_order_pi2[k] = new Array(world.atoms.length);
        }

        // Zero diagonal elements.
        for (var i = 0; i < world.atoms.length; i++) {
            world.bond_order[i][i] = 0.0;
            world.bond_order_sigma[i][i] = 0.0;
            world.bond_order_pi[i][i] = 0.0;
            world.bond_order_pi2[i][i] = 0.0;
        }

        // Corrected Bond Order calculations
        for (var i = 0; i < world.atoms.length; i++) {
            val_i = sbp_i.valency;
            deltap_i = deltap[i];
            var deltap_boc_i = deltap_boc[i];

            for (var j = i + 1; j < world.atoms.length; j++) {
                //var sbp_j = onebody_parameters[world.atoms[j].type];
                var val_j = sbp_j.valency;
                var twbp = twobody_parameters[world.atoms[i].type][world.atoms[j].type];

                var deltap_j = deltap[j];
                var deltap_boc_j = deltap_boc[j];

                // Correction for overcoordination
                var exp_p1i = Math.exp(-p_boc1 * deltap_i);
                var exp_p2i = Math.exp(-p_boc2 * deltap_i);
                var exp_p1j = Math.exp(-p_boc1 * deltap_j);
                var exp_p2j = Math.exp(-p_boc2 * deltap_j);

                var f2 = exp_p1i + exp_p1j;                                                                    //(Equation 4c)
                var f3 = -1.0 / p_boc2 * Math.log(0.5 * (exp_p2i + exp_p2j));                             //(Equation 4d)
                var f1 = 0.5 * ((val_i + f2) / (val_i + f2 + f3) + (val_j + f2) / (val_j + f2 + f3));   //(Equation 4b)

                // Correction for 1-3 bond orders
                var BO = bond_order_uncorr[i][j];
                var exp_f4 = Math.exp(-(twbp.pboc4 * (BO * BO) - deltap_boc_i) * twbp.pboc3 + twbp.pboc5);
                var exp_f5 = Math.exp(-(twbp.pboc4 * (BO * BO) - deltap_boc_j) * twbp.pboc3 + twbp.pboc5);

                var f4 = 1.0 / (1.0 + exp_f4);   //(Equation 4e)
                var f5 = 1.0 / (1.0 + exp_f5);   //(Equation 4f)

                BO_s_corr = bond_order_uncorr_sigma[i][j] * f1 * f4 * f5;
                BO_pi_corr = bond_order_uncorr_pi[i][j] * f1 * f1 * f4 * f5;
                BO_pi2_corr = bond_order_uncorr_pi2[i][j] * f1 * f1 * f4 * f5;

                //corrected bond order
                world.bond_order[i][j] = BO_s_corr + BO_pi_corr + BO_pi2_corr;     //(Equation 4a)
                world.bond_order[j][i] = world.bond_order[i][j];

                world.bond_order_sigma[i][j] = BO_s_corr;
                world.bond_order_sigma[j][i] = BO_s_corr;

                world.bond_order_pi[i][j] = BO_pi_corr;
                world.bond_order_pi[j][i] = BO_pi_corr;

                world.bond_order_pi2[i][j] = BO_pi2_corr;
                world.bond_order_pi2[j][i] = BO_pi2_corr;

            }  // end inner for loop
        }  // end outer for loop


        // Corrected overcoordination (deltap_i):
        for (var i = 0; i < world.atoms.length; i++) {
            var sbp_i = onebody_parameters[atom_i.type];

            var sum = 0.0;
            for (var j = 0; j < world.atoms.length; j++) {
                sum += bond_order_uncorr[i][j];
            }
            deltap_i[i] = sum - sbp_i.valency;              //(Equation 5)
        }


    } // end bond order function

    function bondEnergy(i, j) {
        let twbp = twobody_parameters[world.atoms[i].type][world.atoms[j].type]
        let powBoSbe2 = Math.pow(world.bond_order_sigma[i][j], twbp.pbe2)
        let expBe12 = Math.exp(twbp.pbe1 * (1.0 - powBoSbe2))
        let cebo = -twbp.DeSigma * expBe12 * (1.0 - twbp.pbe1 * twbp.pbe2 * powBoSbe2)
        let ebond = -twbp.DeSigma * world.bond_order_sigma[i][j] * expBe12 - twbp.DePi * BO_pi_corr - twbp.DePipi * world.bond_order_pi2[i][j]   //(Equation 6)
        return ebond
    }


//////////////////////////////////////////////////////////Lone pair energy/////////////////////////////////////////////////////////

    /**
     * Lone pair energy:
     * Equation (8) is used to determine the number of lone pairs around an atom. Δ e is determined in Equation (7)
     * and describes the difference between the total number of outer shell electrons (6 for oxygen, 4 for silicon, 1 for hydrogen)
     * and the sum of bond orders around an atomic center.
     * @param i
     * @returns {number}
     */
    function lonepairEnergy(i) {
        let bond_order = world.bond_order

        let pLp1 = paramGeneral.plp1
        let atomI = world.atoms[i]
        //var sbp_i = onebody_parameters[atomI.type]
        let sbpI = onebody_parameters[atomI.type]

        var sum = 0.0
        for (var j = 0; j < world.atoms.length; j++) {
            sum += world.bond_order[i][j]
        }

        let delta_e = sum - sbpI.valE    						//(Equation 7)
        let vlpex = delta_e - 2.0 * Math.trunc(delta_e / 2.0)
        world.vlpex[i] = vlpex
        let explp1 = Math.exp(-pLp1 * (2.0 + vlpex) * (2.0 + vlpex))
        world.n_lp[i] = explp1 - Math.trunc(delta_e / 2.0)
        world.deltap_i_lp[i] = sbpI.nlp_opt - world.n_lp[i]  //(Equation 9)

        // lone-pair Energy
        let expvd2 = Math.exp(-75 * world.deltap_i_lp[i])
        let inv_expvd2 = 1 / (1 + expvd2)

        let elp = sbpI.plp2 * world.deltap_i_lp[i] * inv_expvd2               		  //(Equation 10)
        return sbpI
        //var dElp = sbpI.plp2  * inv_expvd2 + 75 * sbpI.plp2  * world.deltap_i_lp[i] * expvd2 * (inv_expvd2 * inv_expvd2);
        world.dDeltap_i_lp[i] = 2.0 * p_lp1 * explp1 * (2.0 + vlpex[i])
        //var CElp = dElp * dDeltap_i_lp[i]
    }


/// <summary>
///   Over Coordination:
///   For an overcoordinated atom (Δi>0), equations (11a-b) impose an energy penalty on the system. 
///   The degree of overcoordination Δ is decreased if the atom contains a broken-up lone electron pair. 
///   This is done by calculating a corrected overcoordination (equation 11b), taking the deviation from 
///   the optimal number of lone pairs, as calculated in equation (9), into account.
/// </summary>
    function overCoordination(i) {
        var bond_order_uncorr_pi = world.bond_order_pi;
        var bond_order_uncorr_pi2 = world.bond_order_pi2;

        var atom_i = world.atoms[i];
        var sbp_i = onebody_parameters[atom_i.type];

        var dfvl = 0.0;
        if (sbp_i.atmcMass > 21.00) dfvl = 0.0;
        else dfvl = 1.0;   // only for 1st-row elements

        var sum = 0.0;
        for (var j = 0; j < world.atoms.length; j++) {
            sum += (world.delta_i[j] - dfvl * world.deltap_i_lp[i]) * (bond_order_uncorr_pi[i][j] + bond_order_uncorr_pi2[i][j]);
        }

        //(Equation 11b)
        var exp_ovun1 = paramGeneral.povun3 * Math.exp(paramGeneral.povun4 * sum);
        var inv_exp_ovun1 = 1.0 / (1 + exp_ovun1);
        var delta_lpcorr = world.delta_i[i] - (dfvl * world.deltap_i_lp[i]) * inv_exp_ovun1;

        // (Equation 11a)
        var sum_ovun1 = 0.0;
        for (var j = 0; j < world.atoms.length; j++) {
            var twbp = twobody_parameters[world.atoms[i].type][world.atoms[j].type];
            sum_ovun1 += twbp.povun1 * twbp.DeSigma * world.bond_order[i][j];
        }
        var dlpVi = 1.0 / (delta_lpcorr + sbp_i.valency + 1e-8);
        var exp_ovun2 = Math.exp(sbp_i.povun2 * delta_lpcorr);
        var inv_exp_ovun2 = 1.0 / (1.0 + exp_ovun2);
        var E_over = sum_ovun1 * dlpVi * delta_lpcorr * inv_exp_ovun2;        //(Equation 11a)

        var E_under = underCoordination(sbp_i, exp_ovun2, sum, delta_lpcorr, dfvl);

        return E_over + E_under;
    }  //end overCoordination function

/// <summary>
///   Under Coordination:
///   For an undercoordinated atom (Δi<0), we want to take into account the energy contribution for the resonance 
//    of the π-electron between attached under-coordinated atomic centers. This is done by equations 12 where Eunder 
//    is only important if the bonds between under-coordinated atom i and its under-coordinated neighbors j partly have π-bond character.
/// </summary>
    function underCoordination(sbp_i, exp_ovun2, sum_ovun2, delta_lpcorr, dfvl) {

        var exp_ovun2n = 1.0 / exp_ovun2;
        var exp_ovun6 = Math.exp(paramGeneral.povun6 * delta_lpcorr);
        var exp_ovun8 = paramGeneral.povun7 * Math.exp(paramGeneral.povun8 * sum_ovun2);   //lammps CO sum_ovun2 = 0.02642533114220256
        var inv_exp_ovun2n = 1.0 / (1.0 + exp_ovun2n);
        var inv_exp_ovun8 = 1.0 / (1.0 + exp_ovun8);

        var E_under = -sbp_i.povun5 * (1.0 - exp_ovun6) * inv_exp_ovun2n * inv_exp_ovun8;       //(Equation 12)
        // var E_under1 = inv_exp_ovun2n * ( sbp_i.povun5 * paramGeneral.povun6 * exp_ovun6 * inv_exp_ovun8 + sbp_i.povun2 * E_under * exp_ovun2n );
        // var E_under2 = -E_under * exp_ovun8 * inv_exp_ovun8;
        // var E_under3 = E_under1 * ( 1.0 - dfvl * delta_lp_temp[i] * inv_exp_ovun1);
        // var E_under4 = E_under1 * ( dfvl * dDelta_lp_temp[i] ) * paramGeneral.povun4 * exp_ovun1 * (inv_exp_ovun1 * inv_exp_ovun1) + E_under2;

        return E_under;
    }  //end underCoordination function

    function valenceEnergy(i, j, k) {

        var bond_order = world.bond_order;
        var bond_order_pi = world.bond_order_pi;
        var bond_order_pi2 = world.bond_order_pi2;

        if (i == j || k == j) return 0.0;

        var atom_i = world.atoms[i];
        var sbp_i = onebody_parameters[atom_i.type];
        var twbp = twobody_parameters[world.atoms[i].type][world.atoms[j].type];
        var thbp = threebody_parameters[world.atoms[i].type][world.atoms[j].type][world.atoms[k].type];

        const cut = 0.001;
        BOA_ij = bond_order[i][k] - cut;
        BOA_jk = bond_order[j][k] - cut;	    //BOA_jk is 6.92941723262061e-310 in lammps

        // ANGLE ENERGY
        var expval6 = Math.exp(paramGeneral.pval7 * deltap_boc[j]); 	//Note: pval7 in JS is pval6 in C++ but the value is same

        var exp3ij = Math.exp(-sbp_i.pval3 * Math.pow(BOA_ij, thbp.pval4));
        var f7_ij = 1.0 - exp3ij; 			  											   //(Equation 13b)
        var Cf7ij = sbp_i.pval3 * thbp.pval4 * Math.pow(BOA_ij, thbp.pval4 - 1.0) * exp3ij;

        var exp3jk = Math.exp(-sbp_i.pval3 * Math.pow(BOA_jk, thbp.pval4));
        var f7_jk = 1.0 - exp3jk;
        var Cf7jk = sbp_i.pval3 * thbp.pval4 * Math.pow(BOA_jk, thbp.pval4 - 1.0) * exp3jk;

        var expval7 = Math.exp(-thbp.pval7 * deltap_boc[j]);
        var trm8 = 1.0 + expval6 + expval7;
        var f8_Dj = sbp_i.pval5 - ((sbp_i.pval5 - 1.0) * (2.0 + expval6) / trm8);   	  //(Equation 13c)
        var Cf8j = ((1.0 - sbp_i.pval5) / (trm8 * trm8)) *
            (paramGeneral.pval7 * expval6 * trm8 -
                (2.0 + expval6) * (paramGeneral.pval7 * expval6 - thbp.pval7 * expval7));

        var SBOp = 0;
        var prod_SBO = 1;
        for (var t = 0; t < world.atoms.length; t++) {
            SBOp += (bond_order_pi[t][j] + bond_order_pi2[t][j]);
            var temp = (bond_order[t][j] * bond_order[t][j]);
            temp *= temp;
            temp *= temp;
            prod_SBO *= Math.exp(-temp);
        }

        var vlpadj = 0;
        var dSBO2 = 0;
        if (world.vlpex[j] >= 0) {
            vlpadj = 0;
            dSBO2 = prod_SBO - 1;
        } else {
            vlpadj = world.n_lp[j];
            dSBO2 = (prod_SBO - 1) * (1 - paramGeneral.pval8 * world.dDeltap_i_lp[i]);
        }

        var SBO = SBOp + (1 - prod_SBO) * (-deltap_boc[i] - paramGeneral.pval8 * vlpadj);      	  //(Equation 13d)
        var dSBO1 = -8 * prod_SBO * (deltap_boc[i] + paramGeneral.pval8 * vlpadj);

        var SBO2 = 0;
        var CSBO2 = 0;
        if (SBO <= 0) SBO2 = 0, CSBO2 = 0;
        else if (SBO > 0 && SBO <= 1) {
            SBO2 = Math.pow(SBO, paramGeneral.pval9);     								  //(Equation 13f)
            CSBO2 = paramGeneral.pval9 * Math.pow(SBO, paramGeneral.pval8 - 1);
        } else if (SBO > 1 && SBO < 2) {
            SBO2 = 2 - Math.pow(2 - SBO, paramGeneral.pval9);
            CSBO2 = paramGeneral.pval9 * Math.pow(2 - SBO, paramGeneral.pval9 - 1);
        } else SBO2 = 2, CSBO2 = 0;

        var theta_0 = 180.0 - thbp.thetao * (1.0 - Math.exp(-paramGeneral.pval10 * (2.0 - SBO2)));     //(Equation 13g)
        theta_0 = degreesToRadians(theta_0);

        var expval2theta = 0.0;
        var expval12theta = 0.0;
        if (thbp.pval1 >= 0)
            expval12theta = thbp.pval1 * (1.0 - expval2theta);
        else
            expval12theta = thbp.pval1 * (-expval2theta);

        var E_ang = 0.0;
        var CEval1 = Cf7ij * f7_jk * f8_Dj * expval12theta;
        var CEval2 = Cf7jk * f7_ij * f8_Dj * expval12theta;
        var CEval3 = Cf8j * f7_ij * f7_jk * expval12theta;
        //var CEval4 = -2.0 * thbp.pval1 * thbp.pval2 * f7_ij * f7_jk * f8_Dj * expval2theta * (theta_0 - theta);
        var Ctheta_0 = paramGeneral.pval10 * degreesToRadians(thbp.thetao) * Math.exp(-paramGeneral.pval10 * (2.0 - SBO2));
        //var CEval5 = -CEval4 * Ctheta_0 * CSBO2;
        //var CEval6 = CEval5 * dSBO1;
        //var CEval7 = CEval5 * dSBO2;
        //var CEval8 = -CEval4 / sin_theta;

        E_ang += f7_ij * f7_jk * f8_Dj * expval12theta;

    } //end valenceEnergy function

    const degreesToRadians = (degrees) => {
        debugger
        return degrees * (Math.PI / 180)
    }

    const penaltyEnergy = (i, j, k) => {

        let bond_order = world.bond_order
        let bond_order_pi = world.bond_order_pi
        let bond_order_pi2 = world.bond_order_pi2

        let thbp = threebody_parameters[world.atoms[i].type][world.atoms[j].type][world.atoms[k].type]

        const cut = 0.001
        BOA_ij = bond_order[i][k] - cut
        BOA_jk = bond_order[j][k] - cut

        let epen = 0.0
        let expPen2ij = Math.exp(-paramGeneral.ppen2 * (BOA_ij - 2.0) * (BOA_ij - 2.0))
        let expPen2jk = Math.exp(-paramGeneral.ppen2 * (BOA_jk - 2.0) * (BOA_jk - 2.0))
        let expPen3 = Math.exp(-paramGeneral.ppen3 * deltap_i)    //Note: deltap in JS is Delta in C++
        let expPen4 = Math.exp(paramGeneral.ppen4 * deltap_i)
        let trmPen34 = 1.0 + expPen3 + expPen4
        let f9_Dj = (2.0 + expPen3) / trmPen34      			    //(Equation 14b)
        epen += thbp.pen1 * f9_Dj * expPen2ij * expPen2jk           //(Equation 14a)

        return epen
    }   //end penaltyEnergy function

    function coalitionEnergy(i, j, k) {

        let bondOrder = world.bond_order
        let bondOrder_pi = world.bond_order_pi
        let bond_order_pi2 = world.bond_order_pi2

        let thbp = threebody_parameters[world.atoms[i].type][world.atoms[j].type][world.atoms[k].type]
        const cut = 0.001
        BOA_ij = bondOrder[i][k] - cut
        BOA_jk = bondOrder[j][k] - cut

        let eCoa = 0.0
        let expCoa2 = Math.exp(paramGeneral.pcoa2 * deltap_boc[j])   //Note: deltap_boc in JS is delta_val in C++
        eCoa += eCoa = thbp.pcoa1 / (1. + expCoa2) *
            Math.exp(-paramGeneral.pcoa3 * (bondOrder[i][j] - BOA_ij) * (bondOrder[i][j] - BOA_ij)) *
            Math.exp(-paramGeneral.pcoa3 * (bondOrder[i][j] - BOA_jk) * (bondOrder[i][j] - BOA_jk)) *
            Math.exp(-paramGeneral.pcoa4 * (BOA_ij - 1.5) * (BOA_ij - 1.5)) *
            Math.exp(-paramGeneral.pcoa4 * (BOA_jk - 1.5) * (BOA_jk - 1.5))

        return eCoa
    }   //end coalitionEnergy function

    /*
    function torsionEnergy(i,j,k,l){

        var fbp = fourbody_parameters[world.atoms[i].type][world.atoms[j].type][world.atoms[k].type][world.atoms[l].type];

        // omega and its derivative
        var omega = Calculate_Omega( pbond_ij.dvec, r_ij,
                                     pbond_jk.dvec, r_jk,
                                     pbond_kl.dvec, r_kl,
                                     dvec_li, r_li,
                                     p_ijk, p_jkl,
                                     dcos_omega_di, dcos_omega_dj,
                                     dcos_omega_dk, dcos_omega_dl,
                                     out_control );

        var cos_omega = Math.cos( omega );
        var cos2omega = Math.cos( 2. * omega );
        var cos3omega = Math.cos( 3. * omega );

        // torsion energy
        var exp_cot2_jk = Math.exp( -paramGeneral.p_cot2 * (BOA_jk - 1.5) * (BOA_jk - 1.5) );
        var exp_cot2_kl = Math.exp( -paramGeneral.p_cot2 * (BOA_kl - 1.5) * (BOA_kl - 1.5) );
        var exp_tor2_ij = Math.exp( -paramGeneral.p_tor2 * BOA_ij );
        var exp_cot2_ij = Math.exp( -paramGeneral.p_cot2 * (BOA_ij -1.5) * (BOA_ij -1.5));
        var exp_tor2_jk = Math.exp( -paramGeneral.p_tor2 * BOA_jk );
        var exp_tor2_kl = Math.exp( -paramGeneral.p_tor2 * BOA_kl );

        var fn10 = (1.0 - exp_tor2_ij) * (1.0 - exp_tor2_jk) * (1.0 - exp_tor2_kl);     //(Equation 16b)

        var exp_tor3_DjDk = Math.exp( -paramGeneral.p_tor3 * (Delta_j + Delta_k) );
        var exp_tor4_DjDk = Math.exp( paramGeneral.p_tor4  * (Delta_j + Delta_k) );
        var exp_tor34_inv = 1.0 / (1.0 + exp_tor3_DjDk + exp_tor4_DjDk);
        var f11_DjDk = (2.0 + exp_tor3_DjDk) * exp_tor34_inv;						    //(Equation 16c)

        var exp_tor1 = Math.exp( fbp.p_tor1 * (2.0 - bo_jk.BO_pi - f11_DjDk) * (2.0 - bo_jk.BO_pi - f11_DjDk) );

        var CV = 0.5 * ( fbp.V1 * (1.0 + cos_omega) +
                         fbp.V2 * exp_tor1 * (1.0 - cos2omega) +
                         fbp.V3 * (1.0 + cos3omega) );    								//(Equation 16a)  //V1=-0.177, V2=30.0252, V3=0.4340


        var theta_ijk = p_ijk.theta;
        var sin_ijk = Math.sin( theta_ijk );
        var cos_ijk = Math.cos( theta_ijk );
        var sin_jkl = Math.sin( theta_jkl );
        var cos_jkl = Math.cos( theta_jkl );
        var tan_ijk_i;
        var MIN_SINE = 1e-10;

        if( sin_ijk >= 0 && sin_ijk <= MIN_SINE ) tan_ijk_i = cos_ijk / MIN_SINE;
        else if( sin_ijk <= 0 && sin_ijk >= -MIN_SINE ) tan_ijk_i = cos_ijk / -MIN_SINE;
        else tan_ijk_i = cos_ijk / sin_ijk;

        var E_tor = fn10 * sin_ijk * sin_jkl * CV;					  //(Equation 16a)


        // 4-body conjugation energy
        var fn12 = exp_cot2_ij * exp_cot2_jk * exp_cot2_kl;				 											//(Equation 17b)
        var E_con += fbp.p_cot1 * fn12 * (1.0 + ((cos_omega) * (cos_omega) - 1.0) * sin_ijk * sin_jkl);    			//(Equation 17a)
        var Cconj = -2.0 * fn12 * fbp.p_cot1 * paramGeneral.pcot2 * (1.0 + ((cos_omega)*(cos_omega) - 1.0) * sin_ijk * sin_jkl);

        var CEconj1 = Cconj * (BOA_ij - 1.5e0);
        var CEconj2 = Cconj * (BOA_jk - 1.5e0);
        var CEconj3 = Cconj * (BOA_kl - 1.5e0);

        var CEconj4 = -fbp.p_cot1 * fn12 * ((cos_omega * cos_omega) - 1.0) * sin_jkl * tan_ijk_i;
        var CEconj5 = -fbp.p_cot1 * fn12 * ((cos_omega * cos_omega) - 1.0) * sin_ijk * tan_jkl_i;
        var CEconj6 = 2.0 * fbp.p_cot1 * fn12 * cos_omega * sin_ijk * sin_jkl;

    }

    function Calculate_Omega(
                          rvec dvec_ij, double r_ij,
                          rvec dvec_jk, double r_jk,
                          rvec dvec_kl, double r_kl,
                          rvec dvec_li, double r_li,
                          three_body_interaction_data *p_ijk,
                          three_body_interaction_data *p_jkl,
                          rvec dcos_omega_di, rvec dcos_omega_dj,
                          rvec dcos_omega_dk, rvec dcos_omega_dl,
                          output_controls * out_control ){

          var sin_ijk = Math.sin( p_ijk.theta );
          var cos_ijk = Math.cos( p_ijk.theta );
          var sin_jkl = Math.sin( p_jkl.theta );
          var cos_jkl = Math.cos( p_jkl.theta );

         var unnorm_cos_omega = -rvec_Dot(dvec_ij, dvec_jk) * rvec_Dot(dvec_jk, dvec_kl) + ( r_jk * r_jk) *  rvec_Dot( dvec_ij, dvec_kl );
          var unnorm_sin_omega = -r_jk * rvec_Dot( dvec_ij, cross_jk_kl );

          var omega = Math.atan2( unnorm_sin_omega, unnorm_cos_omega );

      return omega;
    }
    */
    /*
    function hydrogenBondInteraction(){

        var sin_theta2 = Math.sin( theta /2.0 );
        var sin_xhz4 = (sin_theta2 * sin_theta2);
        var sin_xhz4 *= sin_xhz4;
        var cos_xhz1 = ( 1.0 - cos_theta );
        var exp_hb2 = Math.exp( -hbp.p_hb2 * bo_ij.BO );
        var exp_hb3 = Math.exp( -hbp.p_hb3 * ( hbp.r_hb / r_jk + r_jk / hbp.r_hb - 2.0 ) );

        var E_hb = 0;
        E_hb += hbp.p_hb1 * (1.0 - exp_hb2) * exp_hb3 * sin_xhz4;		  //(Equation 18)

        var CEhb1 = hbp.p_hb1 * hbp.p_hb2 * exp_hb2 * exp_hb3 * sin_xhz4;
        var CEhb2 = -hbp.p_hb1/2.0 * (1.0 - exp_hb2) * exp_hb3 * cos_xhz1;
        var CEhb3 = -hbp.p_hb3 * (-hbp.r0_hb / (r_jk * r_jk) + 1.0 / hbp.r_hb) * E_hb;
    }
    */
    /*
    function C2Correction(i,j){

        if( paramGeneral.kc2 > 0.001 && !strcmp(system->reax_param.sbp[type_i].name, "C") )
          for( j = Start_Index(i, bonds); j < End_Index(i, bonds); j++ ) {
            j = bonds->select.bond_list[pj].nbr;
            var type_j = system->my_atoms[j].type;

            if (type_j < 0) return 0.0;

            if( !strcmp( system->reax_param.sbp[type_j].name, "C" ) ) {
              var twbp = twobody_parameters[world.atoms[0].type][world.atoms[1].type];
              bo_ij = &( bonds->select.bond_list[j].bo_data );
              var Di = Delta[i];
              var vov3 = bo_ij->BO - Di - 0.040 * Math.pow(Di, 4.0);

              var E_lp = 0;
              if( vov3 > 3.0 ) {
                E_lp += e_lph = paramGeneral.kc2 * (vov3-3.0) * (vov3-3.0);

                var deahu2dbo  = 2.0 * paramGeneral.kc2 * (vov3 - 3.0);
                var deahu2dsbo = 2.0 * paramGeneral.kc2 * (vov3 - 3.0) * (-1. - 0.16 * Math.pow(Di, 3.0));

                bo_ij->Cdbo += deahu2dbo;
                workspace->CdDelta[i] += deahu2dsbo;

                // tally into per-atom energy
                if( system->pair_ptr->evflag)
                  system->pair_ptr->ev_tally(i,j,system->n,1,e_lph,0.0,0.0,0.0,0.0,0.0);
              }
            }
          }
    }
    */

    return {
        vanDerWaalsInteraction: vanDerWaalsInteraction,
        coulombInteraction: coulombInteraction,
        bondOrder: bondOrder,
        bondEnergy: bondEnergy,
        lonepairEnergy: lonepairEnergy,
        overCoordination: overCoordination,
        valenceEnergy: valenceEnergy,
        penaltyEnergy: penaltyEnergy,
        coalitionEnergy: coalitionEnergy,

        //torsionEnergy: torsionEnergy,
        //HydrogenBondInteraction: HydrogenBondInteraction,
        //C2Correction(): C2Correction();
        getValuesFromReadFile: getValuesFromReadFile
    };


}();  //END





















