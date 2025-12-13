/**
 * @fileoverview Logger Utility Module
 * @description Centralized logging with configurable levels using loglevel library.
 * Provides module-specific loggers for simulation, physics, rendering, file operations, and UI.
 * @module utils/logger
 * @author Molecular Dynamics Team
 * @version 3.0.0
 */
import log from 'loglevel';

/**
 * Log level configuration based on environment
 * @constant {string}
 * @default 'debug' in development, 'warn' in production
 */
const LOG_LEVEL = process.env.NODE_ENV === 'production' ? 'warn' : 'debug';
log.setLevel(LOG_LEVEL);

/**
 * Create a named logger for a specific module
 * @function createLogger
 * @param {string} moduleName - The name of the module for the logger
 * @returns {Object} Configured loglevel logger instance
 * @private
 */
const createLogger = (moduleName) => {
  const logger = log.getLogger(moduleName);
  logger.setLevel(LOG_LEVEL);
  return logger;
};

/**
 * Logger instance for simulation-related operations
 * @type {Object}
 */
export const simulationLogger = createLogger('simulation');

/**
 * Logger instance for physics calculations
 * @type {Object}
 */
export const physicsLogger = createLogger('physics');

/**
 * Logger instance for rendering operations
 * @type {Object}
 */
export const renderLogger = createLogger('renderer');

/**
 * Logger instance for file reading/parsing operations
 * @type {Object}
 */
export const fileLogger = createLogger('fileReader');

/**
 * Logger instance for UI interactions
 * @type {Object}
 */
export const uiLogger = createLogger('ui');

/**
 * Format a message with ISO timestamp
 * @function formatMessage
 * @param {string} message - The log message to format
 * @returns {string} Formatted message with timestamp prefix [ISO-8601]
 * @example
 * formatMessage('Test message');
 * // Returns: '[2025-01-01T12:00:00.000Z] Test message'
 */
export const formatMessage = (message) => {
  const timestamp = new Date().toISOString();
  return `[${timestamp}] ${message}`;
};

/**
 * Log a message with context object to a specified logger
 * @function logWithContext
 * @param {Object} logger - The loglevel logger instance to use
 * @param {('debug'|'info'|'warn'|'error')} level - The log level
 * @param {string} message - The log message
 * @param {Object} [context={}] - Additional context object to include in log
 * @example
 * logWithContext(simulationLogger, 'info', 'Atom added', { id: 1, type: 'H' });
 * // Logs: '[2025-01-01T12:00:00.000Z] Atom added | {"id":1,"type":"H"}'
 */
export const logWithContext = (logger, level, message, context = {}) => {
  const formattedMessage = formatMessage(message);
  const contextStr = Object.keys(context).length > 0 
    ? ` | ${JSON.stringify(context)}` 
    : '';
  logger[level](`${formattedMessage}${contextStr}`);
};

/**
 * Convenience logger object for simulation operations
 * @namespace logSimulation
 * @property {Function} debug - Log debug message
 * @property {Function} info - Log info message
 * @property {Function} warn - Log warning message
 * @property {Function} error - Log error message
 */
export const logSimulation = {
  /**
   * Log debug message for simulation
   * @param {string} msg - Message to log
   * @param {Object} [ctx] - Context object
   */
  debug: (msg, ctx) => logWithContext(simulationLogger, 'debug', msg, ctx),
  /**
   * Log info message for simulation
   * @param {string} msg - Message to log
   * @param {Object} [ctx] - Context object
   */
  info: (msg, ctx) => logWithContext(simulationLogger, 'info', msg, ctx),
  /**
   * Log warning message for simulation
   * @param {string} msg - Message to log
   * @param {Object} [ctx] - Context object
   */
  warn: (msg, ctx) => logWithContext(simulationLogger, 'warn', msg, ctx),
  /**
   * Log error message for simulation
   * @param {string} msg - Message to log
   * @param {Object} [ctx] - Context object
   */
  error: (msg, ctx) => logWithContext(simulationLogger, 'error', msg, ctx),
};

/**
 * Convenience logger object for physics calculations
 * @namespace logPhysics
 * @property {Function} debug - Log debug message
 * @property {Function} info - Log info message
 * @property {Function} warn - Log warning message
 * @property {Function} error - Log error message
 */
export const logPhysics = {
  debug: (msg, ctx) => logWithContext(physicsLogger, 'debug', msg, ctx),
  info: (msg, ctx) => logWithContext(physicsLogger, 'info', msg, ctx),
  warn: (msg, ctx) => logWithContext(physicsLogger, 'warn', msg, ctx),
  error: (msg, ctx) => logWithContext(physicsLogger, 'error', msg, ctx),
};

/**
 * Convenience logger object for rendering operations
 * @namespace logRender
 * @property {Function} debug - Log debug message
 * @property {Function} info - Log info message
 * @property {Function} warn - Log warning message
 * @property {Function} error - Log error message
 */
export const logRender = {
  debug: (msg, ctx) => logWithContext(renderLogger, 'debug', msg, ctx),
  info: (msg, ctx) => logWithContext(renderLogger, 'info', msg, ctx),
  warn: (msg, ctx) => logWithContext(renderLogger, 'warn', msg, ctx),
  error: (msg, ctx) => logWithContext(renderLogger, 'error', msg, ctx),
};

/**
 * Convenience logger object for file operations
 * @namespace logFile
 * @property {Function} debug - Log debug message
 * @property {Function} info - Log info message
 * @property {Function} warn - Log warning message
 * @property {Function} error - Log error message
 */
export const logFile = {
  debug: (msg, ctx) => logWithContext(fileLogger, 'debug', msg, ctx),
  info: (msg, ctx) => logWithContext(fileLogger, 'info', msg, ctx),
  warn: (msg, ctx) => logWithContext(fileLogger, 'warn', msg, ctx),
  error: (msg, ctx) => logWithContext(fileLogger, 'error', msg, ctx),
};

/**
 * Convenience logger object for UI interactions
 * @namespace logUI
 * @property {Function} debug - Log debug message
 * @property {Function} info - Log info message
 * @property {Function} warn - Log warning message
 * @property {Function} error - Log error message
 */
export const logUI = {
  debug: (msg, ctx) => logWithContext(uiLogger, 'debug', msg, ctx),
  info: (msg, ctx) => logWithContext(uiLogger, 'info', msg, ctx),
  warn: (msg, ctx) => logWithContext(uiLogger, 'warn', msg, ctx),
  error: (msg, ctx) => logWithContext(uiLogger, 'error', msg, ctx),
};

/**
 * Default export - the root loglevel instance
 * @type {Object}
 */
export default log;
