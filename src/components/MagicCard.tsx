import { cn } from "@/lib/utils";
import { motion, useMotionTemplate, useMotionValue } from "framer-motion";
import React from "react";

export interface MagicCardProps extends React.HTMLAttributes<HTMLDivElement> {
  gradientColor?: string;
  variant?: "default" | "neon";
  borderSize?: number;
}

export function MagicCard({
  children,
  className,
  gradientColor = "rgba(255, 255, 255, 0.15)",
  variant = "default",
  borderSize = 1,
  ...props
}: MagicCardProps) {
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  function onMouseMove({ currentTarget, clientX, clientY }: React.MouseEvent) {
    const { left, top } = currentTarget.getBoundingClientRect();
    mouseX.set(clientX - left);
    mouseY.set(clientY - top);
  }

  return (
    <div
      data-testid="magic-card"
      onMouseMove={onMouseMove}
      className={cn(
        "group relative flex size-full flex-col overflow-hidden rounded-xl bg-neutral-900 border border-transparent transition-all duration-300",
        variant === "neon" && "shadow-[0_0_20px_-12px_rgba(224,93,68,0.5)]",
        className,
      )}
      {...props}
    >
      {/* Border Highlight Layer */}
      <motion.div
        className="pointer-events-none absolute -inset-px rounded-xl opacity-0 transition duration-300 group-hover:opacity-100 z-0"
        style={{
          background: useMotionTemplate`
            radial-gradient(
              350px circle at ${mouseX}px ${mouseY}px,
              ${gradientColor},
              transparent 80%
            )
          `,
        }}
      />

      {/* Card Content Surface */}
      <div className="relative z-10 flex flex-col h-full bg-[#1A1A1A]/95 m-[1px] rounded-[calc(0.75rem-1px)] overflow-hidden">
        {children}
      </div>

      {/* Subtle background glow for neon variant */}
      {variant === "neon" && (
        <div className="absolute inset-0 z-[-1] bg-brand-primary/5 blur-3xl opacity-50" />
      )}
    </div>
  );
}
