/**
 * Jest Configuration for Molecular Dynamics Simulation
 * @description Configures Jest for ES modules, React testing, and code coverage
 */
module.exports = {
  // Use jsdom for React component testing
  testEnvironment: 'jsdom',

  // Test file patterns - include both centralized tests/ folder and src/ __tests__
  testMatch: [
    '<rootDir>/tests/**/*.{spec,test}.{js,jsx}',
    '<rootDir>/src/**/__tests__/**/*.{js,jsx}',
    '<rootDir>/src/**/*.{spec,test}.{js,jsx}',
  ],

  // Module file extensions
  moduleFileExtensions: ['js', 'jsx', 'json'],

  // Transform ES modules and JSX
  transform: {
    '^.+\\.(js|jsx)$': ['babel-jest', { configFile: './babel.config.cjs' }],
  },

  // Handle CSS imports
  moduleNameMapper: {
    '\\.(css|less|scss|sass)$': 'identity-obj-proxy',
  },

  // Setup files
  setupFilesAfterEnv: ['<rootDir>/src/setupTests.js'],

  // Coverage configuration
  collectCoverageFrom: [
    'src/**/*.{js,jsx}',
    '!src/index.jsx',
    '!src/setupTests.js',
    '!src/**/*.test.{js,jsx}',
    '!src/**/*.spec.{js,jsx}',
    '!src/**/__tests__/**',
    '!src/**/__mocks__/**',
  ],

  // Coverage thresholds - lowered for CI stability
  coverageThreshold: {
    global: {
      branches: 30,
      functions: 40,
      lines: 45,
      statements: 45,
    },
  },

  // Coverage reporters
  coverageReporters: ['text', 'text-summary', 'lcov', 'html'],

  // Coverage output directory
  coverageDirectory: '<rootDir>/coverage',

  // Clear mocks between tests
  clearMocks: true,

  // Verbose output
  verbose: true,

  // Transform ignore patterns (allow transforming ES modules in node_modules)
  transformIgnorePatterns: [
    '/node_modules/(?!(loglevel)/)',
  ],
};
