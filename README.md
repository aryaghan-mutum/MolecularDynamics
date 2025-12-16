# Molecular Dynamics Simulation

[![CI/CD Pipeline](https://github.com/aryaghan-mutum/MolecularDynamics/actions/workflows/deploy.yml/badge.svg)](https://github.com/aryaghan-mutum/MolecularDynamics/actions/workflows/deploy.yml)
[![Unit Tests](https://img.shields.io/badge/tests-367%20passing-brightgreen)](https://aryaghan-mutum.github.io/MolecularDynamics/coverage/)
[![Coverage](https://img.shields.io/badge/coverage-47%25-yellow)](https://aryaghan-mutum.github.io/MolecularDynamics/coverage/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Node.js](https://img.shields.io/badge/node-%3E%3D18.0.0-blue)](https://nodejs.org)

ReaxFF Reactive Force Field implementation for Molecular Dynamics Simulations of Hydrocarbon Oxidation in JavaScript.

🌐 **Live Demo**: [https://aryaghan-mutum.github.io/MolecularDynamics/](https://aryaghan-mutum.github.io/MolecularDynamics/)

📖 **Documentation**: [JSDoc API Reference](https://aryaghan-mutum.github.io/MolecularDynamics/docs/)

📊 **Coverage Report**: [Test Coverage](https://aryaghan-mutum.github.io/MolecularDynamics/coverage/)

🔧 **CI/CD Pipeline**: [Pipeline Documentation](documents/CI_CD_PIPELINE.md)

## ReaxFF Potential Functions

Bond Order, Bond Energy, Lone pair, Over/Under Coordination, Valence, Penalty, Coalition, Torsion, Four-body conjugation, Hydrogen bond, C2 Correction, Triple bond correction, Van der Waals, Coulomb interactions, Taper correction.

## Quick Start

```bash
npm install     # Install dependencies
npm start       # Start dev server at http://localhost:3000
npm run build   # Production build to dist/
```

## Testing & Coverage

```bash
npm test              # Run all tests
npm run test:watch    # Watch mode
npm run test:coverage # Coverage report with HTML output
```

### Coverage Report

After running `npm run test:coverage`, open the HTML report:

```bash
# Windows
start coverage/lcov-report/index.html

# Mac/Linux
open coverage/lcov-report/index.html
```

## Documentation

```bash
npm run docs          # Generate JSDoc to docs/
npm run docs:watch    # Generate with live reload
```

### View Documentation

```bash
# Windows
start docs/index.html

# Mac/Linux  
open docs/index.html
```

The JSDoc documentation includes:
- API reference for all modules
- Component documentation
- Simulation physics documentation
- Utility function documentation

## ReaxFF Parameter Files

Located in `resources/reaxffparameters/`:

| File | System |
|------|--------|
| `ffield.reax.cho` | C-H-O |
| `BaeAiken2013.ff` | Hydrocarbons |
| `van_duin_zno.ff` | ZnO |
| `reaxff_aluminum_oxygen_carbon.txt` | Al-O-C |
| `reaxff_biomolecules_param1.txt` | Biomolecules |
| `reaxff_glycine_force_field1.txt` | Glycine |

## Project Structure

```
src/                    # React app (components, context, hooks, simulation, utils)
tests/                  # Unit tests (mirrors src structure)
app/                    # Legacy vanilla JS
resources/              # ReaxFF parameter files
docs/                   # Generated JSDoc
```

## Controls

- **Arrow keys**: Move player atom
- **Load Parameters**: Select `.ff` or `.txt` ReaxFF file

## Scripts

| Command | Description |
|---------|-------------|
| `npm start` | Dev server |
| `npm run build` | Production build |
| `npm test` | Run tests |
| `npm run test:coverage` | Coverage report |
| `npm run docs` | Generate JSDoc |
| `npm run lint` | ESLint |
| `npm run format` | Prettier |

## Tech Stack

React 18, Webpack 5, HTML5 Canvas, Jest, JSDoc


## License

MIT © Jeffrey Comer and Anurag Muthyam
