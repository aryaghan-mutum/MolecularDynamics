# Molecular Dynamics Simulation

ReaxFF Reactive Force Field implementation for Molecular Dynamics Simulations of Hydrocarbon Oxidation in JavaScript.

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
npm run test:coverage # Coverage report (thresholds: 80% statements/lines/functions, 70% branches)
```

## Documentation

```bash
npm run docs          # Generate JSDoc to docs/
npm run docs:watch    # Generate with live reload
start docs/index.html # Open docs in browser (Windows)
open docs/index.html  # Open docs in browser (Mac/Linux)
```

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

## Contributors

Jeffrey Comer (jeffcomer@ksu.edu), Anurag Muthyam (anu.drumcoder@gmail.com)

## License

ISC
