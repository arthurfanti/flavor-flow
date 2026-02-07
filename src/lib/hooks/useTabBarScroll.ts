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
    if (v > TAB_BAR_VELOCITY_THRESHOLD && currentScroll > 100) {
      setIsVisible(false);
    } 
    // Show on fast scroll up
    else if (v < -TAB_BAR_VELOCITY_THRESHOLD) {
      setIsVisible(true);
    }
    
    // Always show near top or bottom
    const windowHeight = typeof window !== 'undefined' ? window.innerHeight : 0;
    const documentHeight = typeof document !== 'undefined' ? document.documentElement.scrollHeight : 0;
    const isAtBottom = currentScroll + windowHeight >= documentHeight - 100;
    
    if (isAtBottom || currentScroll < 100) {
      setIsVisible(true);
    }
  });

  return { isVisible };
}
