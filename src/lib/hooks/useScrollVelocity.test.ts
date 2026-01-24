import { renderHook, act } from '@testing-library/react';
import { useScrollVelocity, VELOCITY_THRESHOLD } from './useScrollVelocity';
import { useScroll, useVelocity, useMotionValueEvent } from 'framer-motion';

jest.mock('framer-motion', () => ({
  useScroll: jest.fn(),
  useVelocity: jest.fn(),
  useMotionValueEvent: jest.fn(),
}));

describe('useScrollVelocity', () => {
  let scrollYGet: jest.Mock;
  let eventHandler: (v: number) => void;

  beforeEach(() => {
    scrollYGet = jest.fn().mockReturnValue(0);
    (useScroll as jest.Mock).mockReturnValue({
      scrollY: { get: scrollYGet }
    });
    (useVelocity as jest.Mock).mockReturnValue({});
    (useMotionValueEvent as jest.Mock).mockImplementation((_mv, _event, cb) => {
      eventHandler = cb;
    });
  });

  it('should return default visibility state', () => {
    const { result } = renderHook(() => useScrollVelocity());
    expect(result.current.isVisible).toBe(true);
    expect(result.current.isFixed).toBe(false);
  });

  it('should become fixed when fast scroll up occurs', () => {
    const { result } = renderHook(() => useScrollVelocity());
    
    // Simulate scroll down first to 500px
    scrollYGet.mockReturnValue(500);
    
    // Fast scroll up (negative velocity)
    act(() => {
      eventHandler(-VELOCITY_THRESHOLD - 100);
    });

    expect(result.current.isFixed).toBe(true);
    expect(result.current.isVisible).toBe(true);
  });

  it('should remain natural when slow scroll up occurs', () => {
    const { result } = renderHook(() => useScrollVelocity());
    
    scrollYGet.mockReturnValue(500);
    
    // Slow scroll up
    act(() => {
      eventHandler(-100);
    });

    expect(result.current.isFixed).toBe(false);
  });

  it('should unfix when scrolling down occurs after being fixed', () => {
    const { result } = renderHook(() => useScrollVelocity());
    
    scrollYGet.mockReturnValue(500);
    
    // Fast scroll up to fix it
    act(() => {
      eventHandler(-1000);
    });
    expect(result.current.isFixed).toBe(true);

    // Scroll down (positive velocity)
    act(() => {
      eventHandler(100);
    });

    expect(result.current.isFixed).toBe(false);
  });

  it('should unlock (isFixed: false) immediately when any downward scroll starts while fixed', () => {
    const { result } = renderHook(() => useScrollVelocity());
    
    scrollYGet.mockReturnValue(500);
    
    // 1. Fix it first
    act(() => {
      eventHandler(-1000);
    });
    expect(result.current.isFixed).toBe(true);

    // 2. Scroll down even a little bit (positive velocity)
    act(() => {
      eventHandler(1); 
    });

    expect(result.current.isFixed).toBe(false);
  });
});