"use client";

import React from "react";
import TabBar from "./TabBar";
import { useAuth } from "./AuthProvider";
import SplashScreen from "./SplashScreen";

interface MainLayoutProps {
  children: React.ReactNode;
}

export default function MainLayout({ children }: MainLayoutProps) {
  const { loading } = useAuth();
  return (
    <div className="min-h-screen w-full relative flex flex-col bg-background !text-foreground">
      {loading && <SplashScreen minDuration={2500} />}
      <main className="flex-grow w-full">{children}</main>

      <TabBar />
    </div>
  );
}
