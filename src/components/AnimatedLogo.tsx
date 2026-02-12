"use client";

import React from "react";
import { motion, Variants } from "framer-motion";
import { cn } from "@/lib/utils";

interface AnimatedLogoProps {
  className?: string;
  size?: "sm" | "md" | "lg" | "xl";
}

export default function AnimatedLogo({
  className,
  size = "xl",
}: AnimatedLogoProps) {
  const characters = ["F", "F", "."];

  const sizeClasses = {
    sm: "text-2xl",
    md: "text-4xl",
    lg: "text-6xl",
    xl: "text-[8rem]",
  };

  const containerVariants = {
    animate: {
      transition: {
        staggerChildren: 0.05,
      },
    },
  };

  const charVariants: Variants = {
    animate: {
      y: [0, "-64%", 0, "-18%", 0, "-2%", 0],
      rotate: ["-360deg", "0deg", "0deg", "0deg", "0deg", "0deg", "0deg"],
      transition: {
        duration: 1.6,
        times: [0, 0.15, 0.3, 0.45, 0.6, 0.75, 1],
        ease: "easeInOut",
        repeat: Infinity,
        repeatDelay: 1,
      } as any,
    },
  };

  return (
    <motion.div
      variants={containerVariants}
      initial="initial"
      animate="animate"
      className={cn(
        "flex items-center justify-center font-serif font-black text-white tracking-tighter leading-none select-none",
        sizeClasses[size],
        className,
      )}
      style={{ fontFamily: "'Bodoni Moda', serif" }}
    >
      {characters.map((char, index) => (
        <motion.span
          key={index}
          variants={charVariants}
          className="inline-block"
        >
          {char}
        </motion.span>
      ))}
    </motion.div>
  );
}
