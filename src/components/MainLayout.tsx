"use client";

import React from "react";
import { Link } from "@/navigation";
import TabBar from "./TabBar";
import { useScrollVelocity } from "@/lib/hooks/useScrollVelocity";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import { useTranslations } from "next-intl";

interface MainLayoutProps {
  children: React.ReactNode;
}

export default function MainLayout({ children }: MainLayoutProps) {
  const { isFixed } = useScrollVelocity();
  const t = useTranslations('Common');
  const tNav = useTranslations('Navigation');

  const headerContent = (
    <div className="relative max-w-2xl mx-auto flex items-center justify-between">
      <Link href="/">
        <h1 className="text-3xl font-display font-bold tracking-tight text-foreground hover:text-brand-primary transition-colors cursor-pointer">
          {t('title')}
        </h1>
      </Link>
      <Link 
        href="/profile"
        className="w-8 h-8 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-gray-400 backdrop-blur-sm hover:bg-white/10 hover:text-white transition-all active:scale-95"
        aria-label={tNav('profile')}
      >
        <svg
          className="w-5 h-5"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
          />
        </svg>
      </Link>
    </div>
  );

  return (
    <div className="min-h-screen w-full relative flex flex-col bg-background text-foreground">
      {/* 
        The Fixed Header: Only rendered when revealed by fast scroll up.
        It uses AnimatePresence for the smooth slide down.
      */}
      <AnimatePresence>
        {isFixed && (
          <motion.header
            initial={{ y: -100 }}
            animate={{ y: 0 }}
            exit={{ y: -100 }}
            transition={{ duration: 0.3, ease: "easeOut" }}
            className="fixed top-0 left-0 right-0 z-50 w-full py-6 px-6 bg-background/80 border-b border-white/5 backdrop-blur-xl shadow-2xl"
          >
            {headerContent}
          </motion.header>
        )}
      </AnimatePresence>

      {/* 
        The Natural Header: Always in the document flow. 
        When isFixed is false, this is what the user sees at the top or as they scroll down.
      */}
      <header className={cn(
        "w-full py-6 px-6 bg-background/80 border-b border-black/10 shadow-[0_12px_24px_-4px_rgba(0,0,0,0.4)] relative z-40 transition-opacity duration-300",
        isFixed ? "opacity-0 pointer-events-none" : "opacity-100"
      )}>
        <div className="absolute inset-0 w-full bg-linear-to-b from-black/10 to-transparent backdrop-blur-xl mask-b-from-20%" />
        <div className="absolute inset-0 w-full bg-linear-to-b from-black/20 to-transparent backdrop-blur-md mask-b-from-60%" />
        <div className="absolute inset-0 w-full bg-linear-to-b from-black/30 to-transparent backdrop-blur-sm mask-b-from-80%" />
        {headerContent}
      </header>

      <main className="relative z-10 flex-grow w-full max-w-2xl mx-auto px-4 py-8 pb-24 animate-fade-in">
        {children}
      </main>

      <TabBar />
    </div>
  );
}
