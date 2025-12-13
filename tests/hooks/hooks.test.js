/**
 * @fileoverview Unit tests for Custom Hooks
 * @description Tests for useAnimationFrame and useKeyboard hooks
 */
import { renderHook, act, cleanup } from '@testing-library/react';
import { useAnimationFrame } from '../../src/hooks/useAnimationFrame';
import { useKeyboard } from '../../src/hooks/useKeyboard';

describe('useAnimationFrame', () => {
  let mockRequestAnimationFrame;
  let mockCancelAnimationFrame;
  let frameCallback;
  let frameId = 0;
  let originalRAF;
  let originalCAF;

  beforeAll(() => {
    originalRAF = window.requestAnimationFrame;
    originalCAF = window.cancelAnimationFrame;
  });

  beforeEach(() => {
    jest.useFakeTimers();
    frameId = 0;
    
    mockRequestAnimationFrame = jest.fn((callback) => {
      frameCallback = callback;
      frameId++;
      return frameId;
    });
    mockCancelAnimationFrame = jest.fn();
    
    // Mock both global and window
    global.requestAnimationFrame = mockRequestAnimationFrame;
    global.cancelAnimationFrame = mockCancelAnimationFrame;
    window.requestAnimationFrame = mockRequestAnimationFrame;
    window.cancelAnimationFrame = mockCancelAnimationFrame;
  });

  afterEach(() => {
    // Clean up React components while mocks are still in place
    cleanup();
    jest.useRealTimers();
    jest.clearAllMocks();
  });

  afterAll(() => {
    // Restore original functions
    window.requestAnimationFrame = originalRAF || (() => 0);
    window.cancelAnimationFrame = originalCAF || (() => {});
  });

  it('should call requestAnimationFrame when active', () => {
    const callback = jest.fn();
    
    renderHook(() => useAnimationFrame(callback, true));
    
    expect(mockRequestAnimationFrame).toHaveBeenCalled();
  });

  it('should not call requestAnimationFrame when inactive', () => {
    const callback = jest.fn();
    
    renderHook(() => useAnimationFrame(callback, false));
    
    expect(mockRequestAnimationFrame).not.toHaveBeenCalled();
  });

  it('should call cancelAnimationFrame on unmount', () => {
    const callback = jest.fn();
    
    const { unmount } = renderHook(() => useAnimationFrame(callback, true));
    unmount();
    
    expect(mockCancelAnimationFrame).toHaveBeenCalled();
  });

  it('should call callback with deltaTime on animation frame', () => {
    const callback = jest.fn();
    
    renderHook(() => useAnimationFrame(callback, true));
    
    // First frame doesn't call callback (no previous time)
    act(() => {
      frameCallback(1000);
    });
    
    // Second frame should call callback with delta time
    act(() => {
      frameCallback(1016);
    });
    
    expect(callback).toHaveBeenCalledWith(16);
  });

  it('should not call callback on first frame', () => {
    const callback = jest.fn();
    
    renderHook(() => useAnimationFrame(callback, true));
    
    act(() => {
      frameCallback(0);
    });
    
    expect(callback).not.toHaveBeenCalled();
  });

  it('should update callback reference when it changes', () => {
    const callback1 = jest.fn();
    const callback2 = jest.fn();
    
    const { rerender } = renderHook(
      ({ callback }) => useAnimationFrame(callback, true),
      { initialProps: { callback: callback1 } }
    );
    
    // First frame to set previous time
    act(() => {
      frameCallback(1000);
    });
    
    // Change callback
    rerender({ callback: callback2 });
    
    // Next frame should use new callback
    act(() => {
      frameCallback(1016);
    });
    
    expect(callback2).toHaveBeenCalled();
  });

  it('should stop animation when isActive becomes false', () => {
    const callback = jest.fn();
    
    const { rerender } = renderHook(
      ({ isActive }) => useAnimationFrame(callback, isActive),
      { initialProps: { isActive: true } }
    );
    
    expect(mockRequestAnimationFrame).toHaveBeenCalled();
    
    rerender({ isActive: false });
    
    expect(mockCancelAnimationFrame).toHaveBeenCalled();
  });

  it('should handle rapid on/off toggling', () => {
    const callback = jest.fn();
    
    const { rerender } = renderHook(
      ({ isActive }) => useAnimationFrame(callback, isActive),
      { initialProps: { isActive: true } }
    );
    
    rerender({ isActive: false });
    rerender({ isActive: true });
    rerender({ isActive: false });
    
    expect(mockCancelAnimationFrame).toHaveBeenCalled();
  });
});

describe('useKeyboard', () => {
  let keydownHandler;
  let keyupHandler;
  let blurHandler;

  beforeEach(() => {
    // Mock addEventListener
    jest.spyOn(window, 'addEventListener').mockImplementation((event, handler) => {
      if (event === 'keydown') keydownHandler = handler;
      if (event === 'keyup') keyupHandler = handler;
      if (event === 'blur') blurHandler = handler;
    });
    
    jest.spyOn(window, 'removeEventListener').mockImplementation(() => {});
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('should add event listeners on mount', () => {
    renderHook(() => useKeyboard());
    
    expect(window.addEventListener).toHaveBeenCalledWith('keydown', expect.any(Function));
    expect(window.addEventListener).toHaveBeenCalledWith('keyup', expect.any(Function));
  });

  it('should remove event listeners on unmount', () => {
    const { unmount } = renderHook(() => useKeyboard());
    unmount();
    
    expect(window.removeEventListener).toHaveBeenCalledWith('keydown', expect.any(Function));
    expect(window.removeEventListener).toHaveBeenCalledWith('keyup', expect.any(Function));
  });

  it('should track key down state', () => {
    const { result } = renderHook(() => useKeyboard());
    
    act(() => {
      keydownHandler({ key: 'ArrowLeft', code: 'ArrowLeft', preventDefault: jest.fn() });
    });
    
    expect(result.current['ArrowLeft']).toBe(true);
  });

  it('should track key up state', () => {
    const { result } = renderHook(() => useKeyboard());
    
    act(() => {
      keydownHandler({ key: 'ArrowLeft', code: 'ArrowLeft', preventDefault: jest.fn() });
    });
    
    expect(result.current['ArrowLeft']).toBe(true);
    
    act(() => {
      keyupHandler({ key: 'ArrowLeft', code: 'ArrowLeft' });
    });
    
    expect(result.current['ArrowLeft']).toBe(false);
  });

  it('should return empty object initially', () => {
    const { result } = renderHook(() => useKeyboard());
    
    expect(result.current).toEqual({});
  });

  it('should track multiple keys', () => {
    const { result } = renderHook(() => useKeyboard());
    
    act(() => {
      keydownHandler({ key: 'a', code: 'KeyA', preventDefault: jest.fn() });
      keydownHandler({ key: 'b', code: 'KeyB', preventDefault: jest.fn() });
    });
    
    expect(result.current['a']).toBe(true);
    expect(result.current['b']).toBe(true);
  });

  it('should reset keys on blur', () => {
    const { result } = renderHook(() => useKeyboard());
    
    act(() => {
      keydownHandler({ key: 'a', code: 'KeyA', preventDefault: jest.fn() });
    });
    
    expect(result.current['a']).toBe(true);
    
    act(() => {
      blurHandler();
    });
    
    expect(result.current).toEqual({});
  });

  it('should prevent default for arrow keys', () => {
    renderHook(() => useKeyboard());
    
    const preventDefault = jest.fn();
    
    act(() => {
      keydownHandler({ key: 'ArrowUp', code: 'ArrowUp', preventDefault });
    });
    
    expect(preventDefault).toHaveBeenCalled();
  });

  it('should not prevent default for regular keys', () => {
    renderHook(() => useKeyboard());
    
    const preventDefault = jest.fn();
    
    act(() => {
      keydownHandler({ key: 'a', code: 'KeyA', preventDefault });
    });
    
    expect(preventDefault).not.toHaveBeenCalled();
  });
});
