"use client";

import { useScroll, useVelocity, useMotionValueEvent } from 'framer-motion';
import { useState } from 'react';

export const TAB_BAR_VELOCITY_THRESHOLD = 500; 

export function useTabBarScroll() {
  const { scrollY } = useScroll();
  const velocity = useVelocity(scrollY);
  const [isVisible, setIsVisible] = useState(true);

  useMotionValueEvent(velocity, "change", (v) => {
    const currentScroll = scrollY.get();
    
    // Hide on fast scroll down
    if (v > TAB_BAR_VELOCITY_THRESHOLD && currentScroll > 50) {
      setIsVisible(false);
    } 
    // Show on fast scroll up
    else if (v < -TAB_BAR_VELOCITY_THRESHOLD) {
      setIsVisible(true);
    }
    
    // Always show at the bottom or near the top
    const isAtBottom = typeof window !== 'undefined' && 
      (window.innerHeight + window.scrollY) >= document.body.offsetHeight - 50;
    
    if (isAtBottom || currentScroll < 50) {
      setIsVisible(true);
    }
  });

  return { isVisible };
}
