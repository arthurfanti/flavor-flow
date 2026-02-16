'use client';

import { motion, type HTMLMotionProps } from 'framer-motion';
import { cn } from '@/lib/utils';

interface MagicButtonProps extends HTMLMotionProps<'button'> {
  variant?: 'default' | 'shiny' | 'glass';
  children: React.ReactNode;
  ref?: React.Ref<HTMLButtonElement>;
}

export function MagicButton({ className, variant = 'default', children, ref, ...props }: MagicButtonProps) {
  if (variant === 'shiny') {
    return (
      <motion.button
        ref={ref}
        className={cn(
          'relative inline-flex h-12 items-center justify-center overflow-hidden rounded-md border border-white/20 bg-black/20 px-6 font-medium text-neutral-300 transition-all duration-300 hover:bg-black/40 hover:text-white',
          className
        )}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        {...props}
      >
        <div className="absolute inset-0 flex h-full w-full justify-center [transform:skew(-12deg)_translateX(-100%)] group-hover:duration-1000 group-hover:[transform:skew(-12deg)_translateX(100%)]">
          <div className="relative h-full w-8 bg-white/20 blur animate-shimmer" />
        </div>
        <span className="relative z-10 flex items-center gap-2">{children}</span>
      </motion.button>
    );
  }

  return (
    <motion.button
      ref={ref}
      className={cn(
        'relative inline-flex items-center justify-center rounded-md px-4 py-2 font-medium transition-colors',
        variant === 'glass' && 'bg-glass-surface backdrop-blur-md border border-white/10 hover:bg-white/10 text-white',
        variant === 'default' && 'bg-brand-primary text-white hover:bg-brand-primary/90',
        className
      )}
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      {...props}
    >
      {children}
    </motion.button>
  );
}
