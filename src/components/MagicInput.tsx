import React from 'react';
import { cn } from '@/lib/utils';

export interface MagicInputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  icon?: React.ReactNode;
}

export const MagicInput = React.forwardRef<HTMLInputElement, MagicInputProps>(
  ({ className, type, icon, ...props }, ref) => {
    return (
      <div className="relative flex items-center w-full group">
        {icon && (
          <div className="absolute z-10 left-3 text-white/50 group-focus-within:text-brand-primary transition-colors">
            {icon}
          </div>
        )}
        <input
          type={type}
          className={cn(
            "magic-input flex h-12 w-full rounded-md px-4 py-2 text-sm text-foreground ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-primary/50 focus-visible:border-brand-primary/50 disabled:cursor-not-allowed disabled:opacity-50 transition-all duration-300 backdrop-blur-sm",
            icon && "pl-10",
            className
          )}
          ref={ref}
          {...props}
        />
      </div>
    );
  }
);
MagicInput.displayName = "MagicInput";
