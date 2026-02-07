"use client";

import React from "react";
import TabBar from "./TabBar";

interface MainLayoutProps {
  children: React.ReactNode;
}

export default function MainLayout({ children }: MainLayoutProps) {
  return (
    <div className="min-h-screen w-full relative flex flex-col bg-background text-foreground">
      <main className="flex-grow w-full">
        {children}
      </main>

      <TabBar />
    </div>
  );
}
