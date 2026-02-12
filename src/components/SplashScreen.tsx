"use client";

import React, { useEffect, useState } from "react";
import { cn } from "@/lib/utils";

interface SplashScreenProps {
  onReady?: () => void;
  minDuration?: number; // Minimum time to show splash in ms
}

export default function SplashScreen({
  onReady,
  minDuration = 2000,
}: SplashScreenProps) {
  const [isVisible, setIsVisible] = useState(true);
  const [shouldRender, setShouldRender] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(false);
      if (onReady) onReady();

      // Remove from DOM after fade out transition
      setTimeout(() => setShouldRender(false), 500);
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
        <h1
          className="text-[8rem] font-serif font-black text-white tracking-tighter leading-none select-none"
          style={{
            fontFamily: "'Bodoni Moda', serif",
            animation: "float 3s ease-in-out infinite",
          }}
        >
          FF.
        </h1>
      </div>
    </div>
  );
}
