import React, { useEffect, useState } from "react";
import { useTranslations } from "next-intl";
import { cn } from "@/lib/utils";
import AnimatedLogo from "./AnimatedLogo";

export type AIStage = "idle" | "transcribing" | "analyzing" | "finalizing";

interface AILoadingOverlayProps {
  stage: AIStage;
  isLoading?: boolean;
}

export default function AILoadingOverlay({
  stage,
  isLoading = false,
}: AILoadingOverlayProps) {
  const t = useTranslations("Extraction");
  const [visible, setVisible] = useState(false);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    if (isLoading) {
      setVisible(true);
      setProgress(0);

      // Fake progress: increment to 90%
      const interval = setInterval(() => {
        setProgress((prev) => {
          if (prev >= 90) return prev;
          // Slower progress as it gets higher
          const increment = Math.max(0.2, (90 - prev) / 100);
          return prev + increment;
        });
      }, 100);

      return () => clearInterval(interval);
    } else {
      // If loading finishes, fast-forward to 100% then close
      if (visible) {
        setProgress(100);
        const timeout = setTimeout(() => {
          setVisible(false);
        }, 800); // Wait for transition to 100% + small delay
        return () => clearTimeout(timeout);
      }
    }
  }, [isLoading, visible]);

  if (!visible) return null;

  const currentStageText = {
    transcribing: t("transcribing.title"),
    analyzing: t("analyzing.title"),
    finalizing: t("finalizing.title"),
    idle: t("analyzing.title"), // Fallback
  }[stage === "idle" ? "analyzing" : stage];

  return (
    <div
      className={cn(
        "fixed inset-0 z-[200] bg-[#121212]/95 backdrop-blur-md flex flex-col items-center justify-center transition-opacity duration-500",
        isLoading || progress < 100 ? "opacity-100" : "opacity-0",
      )}
    >
      <div className="flex flex-col items-center w-full max-w-sm px-8">
        {/* Animated Logo */}
        <AnimatedLogo size="xl" className="mb-12" />

        {/* Progress Bar Container */}
        <div className="w-full h-1 bg-white/10 rounded-full overflow-hidden mb-6">
          <div
            className="h-full bg-brand-primary rounded-full transition-all duration-300 ease-out shadow-[0_0_10px_rgba(224,93,68,0.5)]"
            style={{ width: `${progress}%` }}
          />
        </div>

        {/* Status Text */}
        <div className="h-8 flex flex-col items-center overflow-hidden">
          <p className="text-white/60 font-medium uppercase tracking-[0.2em] text-xs animate-pulse">
            {currentStageText}
          </p>
        </div>

        {/* Percentage */}
        <p className="mt-2 text-white/30 text-[10px] font-mono">
          {Math.floor(progress)}%
        </p>
      </div>
    </div>
  );
}
