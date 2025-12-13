/**
 * Molecular Dynamics Simulation
 * Entry point for the application
 * 
 * This project implements ReaxFF Reactive Force Field potential functions 
 * for Molecular Dynamics Simulations of Hydrocarbon Oxidation.
 */

import { World } from './components/world.js';
import { ReaxFFFileReader } from './filereader/reaxff_file_reader.js';
import { bondOrder } from './energy/bond_order.js';
import {
  vanDerWaalsInteraction,
  coulombInteraction,
  bondEnergy,
  lonepairEnergy,
  overCoordination,
  penaltyEnergy,
  coalitionEnergy
} from './energy/energy_calculations.js';
import './md_home.css';

/**
 * Molecular Dynamics Application
 */
class MolecularDynamicsApp {
  constructor() {
    this.world = null;
    this.fileReader = new ReaxFFFileReader();
    this.isInitialized = false;
  }

  /**
   * Initialize the application
   */
  init() {
    // Create the simulation world
    this.world = new World('screen');
    
    // Expose to global scope for legacy compatibility
    window.world = this.world;
    
    // Setup event listeners
    this._setupEventListeners();
    
    this.isInitialized = true;
    console.log('Molecular Dynamics simulation initialized');
  }

  /**
   * Setup event listeners
   * @private
   */
  _setupEventListeners() {
    // File input handler
    const fileInput = document.querySelector('input[type="file"]');
    if (fileInput) {
      fileInput.addEventListener('change', (event) => this._handleFileOpen(event));
    }
  }

  /**
   * Handle file open event
   * @param {Event} event - File input event
   * @private
   */
  async _handleFileOpen(event) {
    try {
      const params = await this.fileReader.readFile(event);
      
      // Set parameters on world
      this.world.setParameters(
        params.r_ij,
        params.paramGeneral,
        params.onebody_parameters,
        params.twobody_parameters,
        params.threebody_parameters,
        params.fourbody_parameters
      );

      // Run calculations
      this._runCalculations();
      
      console.log('Parameters loaded successfully');
    } catch (error) {
      console.error('Error loading parameters:', error);
    }
  }

  /**
   * Run force field calculations
   * @private
   */
  _runCalculations() {
    if (!this.world.paramGeneral) {
      console.warn('Parameters not loaded yet');
      return;
    }

    try {
      // Calculate bond orders
      bondOrder(this.world);

      // Calculate various energies
      if (this.world.atoms.length >= 2) {
        vanDerWaalsInteraction(0, 1, this.world);
        coulombInteraction(0, 1, this.world, this.world.rij);
        bondEnergy(0, 1, this.world);
        lonepairEnergy(0, this.world);
        overCoordination(0, this.world);
      }

      if (this.world.atoms.length >= 3) {
        penaltyEnergy(0, 1, 2, this.world);
        coalitionEnergy(0, 1, 2, this.world);
      }

      console.log('Calculations completed');
    } catch (error) {
      console.error('Error running calculations:', error);
    }
  }
}

// Initialize application when DOM is ready
let app;

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => {
    app = new MolecularDynamicsApp();
    app.init();
  });
} else {
  app = new MolecularDynamicsApp();
  app.init();
}

// Export for module usage
export { MolecularDynamicsApp, app };
export default app;
