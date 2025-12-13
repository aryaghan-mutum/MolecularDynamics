/**
 * Babel Configuration for Jest Testing
 * @description Configures Babel presets for transforming ES modules and JSX in tests
 */
module.exports = {
  presets: [
    ['@babel/preset-env', { targets: { node: 'current' } }],
    ['@babel/preset-react', { runtime: 'automatic' }],
  ],
};
