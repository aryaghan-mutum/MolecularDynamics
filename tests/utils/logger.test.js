/**
 * @fileoverview Unit tests for Logger Utility
 * @description Tests for logging functionality with mocks
 */
import log from 'loglevel';
import {
  formatMessage,
  logWithContext,
  simulationLogger,
  physicsLogger,
  renderLogger,
  fileLogger,
  uiLogger,
  logSimulation,
  logPhysics,
  logRender,
  logFile,
  logUI,
} from '../../src/utils/logger';

// Mock loglevel
jest.mock('loglevel', () => {
  const mockLogger = {
    debug: jest.fn(),
    info: jest.fn(),
    warn: jest.fn(),
    error: jest.fn(),
    setLevel: jest.fn(),
  };
  
  return {
    __esModule: true,
    default: {
      setLevel: jest.fn(),
      getLogger: jest.fn(() => mockLogger),
      debug: jest.fn(),
      info: jest.fn(),
      warn: jest.fn(),
      error: jest.fn(),
    },
    setLevel: jest.fn(),
    getLogger: jest.fn(() => mockLogger),
  };
});

describe('Logger Utility', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('formatMessage', () => {
    it('should format message with ISO timestamp', () => {
      const mockDate = new Date('2025-01-01T12:00:00.000Z');
      jest.spyOn(global, 'Date').mockImplementation(() => mockDate);

      const result = formatMessage('Test message');
      
      expect(result).toBe('[2025-01-01T12:00:00.000Z] Test message');
      
      jest.restoreAllMocks();
    });

    it('should handle empty message', () => {
      const mockDate = new Date('2025-01-01T12:00:00.000Z');
      jest.spyOn(global, 'Date').mockImplementation(() => mockDate);

      const result = formatMessage('');
      
      expect(result).toBe('[2025-01-01T12:00:00.000Z] ');
      
      jest.restoreAllMocks();
    });

    it('should handle special characters in message', () => {
      const mockDate = new Date('2025-01-01T12:00:00.000Z');
      jest.spyOn(global, 'Date').mockImplementation(() => mockDate);

      const result = formatMessage('Test "quoted" & <special> chars');
      
      expect(result).toContain('Test "quoted" & <special> chars');
      
      jest.restoreAllMocks();
    });
  });

  describe('logWithContext', () => {
    it('should log message without context', () => {
      const mockLogger = {
        debug: jest.fn(),
        info: jest.fn(),
        warn: jest.fn(),
        error: jest.fn(),
      };

      logWithContext(mockLogger, 'info', 'Test message');
      
      expect(mockLogger.info).toHaveBeenCalled();
      expect(mockLogger.info.mock.calls[0][0]).toContain('Test message');
    });

    it('should log message with context object', () => {
      const mockLogger = {
        debug: jest.fn(),
        info: jest.fn(),
        warn: jest.fn(),
        error: jest.fn(),
      };

      const context = { key: 'value', count: 42 };
      logWithContext(mockLogger, 'info', 'Test message', context);
      
      // logWithContext combines message and context into a single log call
      expect(mockLogger.info).toHaveBeenCalledTimes(1);
    });

    it('should handle debug level', () => {
      const mockLogger = {
        debug: jest.fn(),
        info: jest.fn(),
        warn: jest.fn(),
        error: jest.fn(),
      };

      logWithContext(mockLogger, 'debug', 'Debug message');
      
      expect(mockLogger.debug).toHaveBeenCalled();
    });

    it('should handle warn level', () => {
      const mockLogger = {
        debug: jest.fn(),
        info: jest.fn(),
        warn: jest.fn(),
        error: jest.fn(),
      };

      logWithContext(mockLogger, 'warn', 'Warning message');
      
      expect(mockLogger.warn).toHaveBeenCalled();
    });

    it('should handle error level', () => {
      const mockLogger = {
        debug: jest.fn(),
        info: jest.fn(),
        warn: jest.fn(),
        error: jest.fn(),
      };

      logWithContext(mockLogger, 'error', 'Error message');
      
      expect(mockLogger.error).toHaveBeenCalled();
    });
  });

  describe('Domain-specific loggers', () => {
    it('should have simulationLogger defined', () => {
      expect(simulationLogger).toBeDefined();
    });

    it('should have physicsLogger defined', () => {
      expect(physicsLogger).toBeDefined();
    });

    it('should have renderLogger defined', () => {
      expect(renderLogger).toBeDefined();
    });

    it('should have fileLogger defined', () => {
      expect(fileLogger).toBeDefined();
    });

    it('should have uiLogger defined', () => {
      expect(uiLogger).toBeDefined();
    });
  });

  describe('Convenience logging functions', () => {
    it('should call logSimulation.info without error', () => {
      expect(() => logSimulation.info('Test simulation log')).not.toThrow();
    });

    it('should call logPhysics.info without error', () => {
      expect(() => logPhysics.info('Test physics log')).not.toThrow();
    });

    it('should call logRender.info without error', () => {
      expect(() => logRender.info('Test render log')).not.toThrow();
    });

    it('should call logFile.info without error', () => {
      expect(() => logFile.info('Test file log')).not.toThrow();
    });

    it('should call logUI.info without error', () => {
      expect(() => logUI.info('Test UI log')).not.toThrow();
    });

    it('should have debug method on logSimulation', () => {
      expect(() => logSimulation.debug('debug test')).not.toThrow();
    });
  });

  describe('Log levels', () => {
    it('should handle info level with context', () => {
      const mockLogger = {
        debug: jest.fn(),
        info: jest.fn(),
        warn: jest.fn(),
        error: jest.fn(),
      };

      logWithContext(mockLogger, 'info', 'Message', { data: 'test' });
      
      expect(mockLogger.info).toHaveBeenCalled();
    });
  });
});
