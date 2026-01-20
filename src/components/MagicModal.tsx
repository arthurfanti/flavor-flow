import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';
import { X } from 'lucide-react';

interface MagicModalProps {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
  className?: string;
  title?: string;
}

export function MagicModal({ isOpen, onClose, children, className, title }: MagicModalProps) {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6" role="dialog" aria-modal="true" onClick={(e) => {
          // Close if the click is directly on the backdrop (this container)
          if (e.target === e.currentTarget) onClose();
        }}>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm transition-opacity"
            aria-hidden="true"
          />

          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
            className={cn(
              "relative w-full max-w-lg overflow-hidden rounded-xl border border-white/10 bg-[#1A1A1A] shadow-2xl ring-1 ring-white/10",
              className
            )}
          >
            {/* Header */}
            <div className="flex items-center justify-between border-b border-white/10 px-6 py-4">
              <h3 className="text-lg font-display font-semibold text-white">{title}</h3>
              <button
                onClick={onClose}
                className="rounded-full p-2 text-neutral-400 hover:bg-white/10 hover:text-white transition-colors"
              >
                <X className="h-4 w-4" />
                <span className="sr-only">Close</span>
              </button>
            </div>

            {/* Content */}
            <div className="p-6">
              {children}
            </div>
            
            {/* Magic Glow Effect */}
            <div className="pointer-events-none absolute inset-0 z-0 bg-gradient-to-t from-brand-primary/5 via-transparent to-transparent opacity-50" />
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
