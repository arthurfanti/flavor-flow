import React from "react";
import { cn } from "@/lib/utils";

interface SkeletonProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: "text" | "card" | "list-item" | "hero";
}

export function Skeleton({
  className,
  variant = "text",
  ...props
}: SkeletonProps) {
  const baseStyles = "animate-shimmer bg-white/5 rounded-lg";

  const variantStyles = {
    text: "h-4 w-full",
    card: "h-48 w-full rounded-2xl",
    "list-item": "h-16 w-full rounded-xl",
    hero: "h-[40vh] w-full rounded-b-[2rem]",
  };

  return (
    <div
      className={cn(baseStyles, variantStyles[variant], className)}
      {...props}
    />
  );
}
