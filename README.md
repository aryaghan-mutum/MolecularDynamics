# Molecular Dynamics Simulation

MD is an atomistic simulation technique used to study a broad set of biomolecules in diverse conditions.

## Description

This project implements **ReaxFF Reactive Force Field potential functions** for Molecular Dynamics Simulations of Hydrocarbon Oxidation in JavaScript.

### ReaxFF Potential Functions

The following general ReaxFF potential functions are implemented:

1. Bond Order
2. Bond Energy
3. Lone pair energy
4. Over Coordination
5. Under Coordination
6. Valence energy
7. Penalty energy
8. Coalition energy
9. Torsion energy
10. Four-body conjugation term
11. Hydrogen body interaction
12. C2 Correction
13. Triple bond energy correction
14. Non-bonded interactions
15. Taper correction
16. Van der Waals interactions
17. Coulomb interactions
18. Overall system energy

## Getting Started

### Prerequisites

- Node.js >= 18.0.0
- npm >= 9.0.0

### Installation

```bash
# Clone the repository
git clone https://github.com/aryaghan-mutum/MolecularDynamics.git
cd MolecularDynamics

# Install dependencies
npm install
```

### Development

```bash
# Start the development server
npm start
```

This will open the simulation in your browser at `http://localhost:3000`.

### Production Build

```bash
# Create a production build
npm run build
```

The production files will be generated in the `dist/` directory.

## Project Structure

```
MolecularDynamics/
├── app/
│   ├── components/       # Core simulation components
│   │   ├── atom.js       # Atom class
│   │   ├── fireball.js   # Visual effects
│   │   └── world.js      # Simulation world
│   ├── config/           # Configuration constants
│   │   ├── constants.js  # Physical constants
│   │   └── world_config.js
│   ├── energy/           # Energy calculations
│   │   ├── bond_order.js # Bond order calculations
│   │   └── energy_calculations.js
│   ├── filereader/       # ReaxFF parameter file reader
│   │   └── reaxff_file_reader.js
│   ├── utils/            # Utility functions
│   │   └── util.js
│   ├── index.js          # Application entry point
│   ├── md.html           # Main HTML file
│   └── md_home.css       # Styles
├── resources/            # Resource files
│   └── reaxffparameters/ # ReaxFF parameter files
├── package.json
├── webpack.config.js
└── README.md
```

## Usage

### Controls

- **Arrow keys**: Move the player atom
- **Restart**: Reset the simulation
- **Toggle Clear**: Enable/disable screen clearing

### Loading Parameters

Click the file input to load a ReaxFF parameter file (`.ff` or `.txt`). Several parameter files are included in the `resources/reaxffparameters/` directory.

## Technologies

- JavaScript (ES6+)
- Webpack 5
- HTML5 Canvas

## Contributors

- Jeffrey Comer (jeffcomer@ksu.edu)
- Anurag Muthyam (anu.drumcoder@gmail.com)

## License

ISC
