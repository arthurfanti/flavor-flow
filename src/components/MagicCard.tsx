import React, { useRef, useState, useEffect } from 'react';
import { motion, useMotionTemplate, useMotionValue } from 'framer-motion';
import { cn } from '@/lib/utils';

export interface MagicCardProps extends React.HTMLAttributes<HTMLDivElement> {
  gradientColor?: string;
  variant?: 'default' | 'neon';
}

export function MagicCard({
  children,
  className,
  gradientColor = '#262626',
  variant = 'default',
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
      data-testid="magic-card-root"
      className={cn(
        "group relative flex h-full w-full flex-col overflow-hidden rounded-xl border border-white/10 bg-black/40 text-foreground",
        variant === 'neon' && "border-brand-primary/50 shadow-[0_0_20px_-12px_rgba(224,93,68,0.5)]",
        className
      )}
      onMouseMove={onMouseMove}
      {...props}
    >
      <motion.div
        className="pointer-events-none absolute -inset-px rounded-xl opacity-0 transition duration-300 group-hover:opacity-100"
        style={{
          background: useMotionTemplate`
            radial-gradient(
              650px circle at ${mouseX}px ${mouseY}px,
              ${gradientColor},
              transparent 80%
            )
          `,
        }}
      />
      <div className="relative flex flex-col h-full">{children}</div>
    </div>
  );
}
