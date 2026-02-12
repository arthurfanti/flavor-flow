"use client";

import React, { useEffect, useState } from "react";
import { cn } from "@/lib/utils";
import AnimatedLogo from "./AnimatedLogo";

interface SplashScreenProps {
  onReady?: () => void;
  minDuration?: number; // Minimum time to show splash in ms
}

export default function SplashScreen({
  onReady,
  minDuration = 1600,
}: SplashScreenProps) {
  const [isVisible, setIsVisible] = useState(true);
  const [shouldRender, setShouldRender] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(false);

      // Remove from DOM after fade out transition
      setTimeout(() => {
        setShouldRender(false);
        if (onReady) onReady();
      }, 500); // Wait for transition-opacity duration-500
    }, minDuration);

    return () => clearTimeout(timer);
  }, [minDuration, onReady]);

  if (!shouldRender) return null;

  return (
    <div
      className={cn(
        "fixed inset-0 z-[200] flex items-center justify-center bg-[#121212] transition-opacity duration-500 ease-out",
        isVisible ? "opacity-100" : "opacity-0 pointer-events-none",
      )}
    >
      <div className="flex flex-col items-center">
        <AnimatedLogo size="xl" />
      </div>
    </div>
  );
}
