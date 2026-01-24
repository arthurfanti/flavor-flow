"use client";

import { useScroll, useVelocity, useMotionValueEvent } from 'framer-motion';
import { useState } from 'react';

export const VELOCITY_THRESHOLD = 500; 

export function useScrollVelocity() {
  const { scrollY } = useScroll();
  const velocity = useVelocity(scrollY);
  const [isFixed, setIsFixed] = useState(false);
  const [isVisible, setIsVisible] = useState(true);

  useMotionValueEvent(velocity, "change", (v) => {
    const currentScroll = scrollY.get();
    
    // Trigger reveal on fast scroll up
    if (v < -VELOCITY_THRESHOLD && currentScroll > 100) {
      setIsFixed(true);
      setIsVisible(true);
    } 
    // If scrolling down while fixed, unfix it
    else if (v > 0 && isFixed) {
      setIsFixed(false);
      // We don't necessarily hide it immediately, 
      // it just stops being fixed and scrolls with content
    }
    
    // If we are at the very top, it should be natural (not fixed)
    if (currentScroll <= 0 && isFixed) {
      setIsFixed(false);
    }
  });

  return { isFixed, isVisible, velocity };
}
