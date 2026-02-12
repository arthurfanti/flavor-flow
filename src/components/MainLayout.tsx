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
  const [showSplash, setShowSplash] = React.useState(true);

  return (
    <div className="min-h-screen w-full relative flex flex-col bg-background !text-foreground">
      {showSplash && (
        <SplashScreen minDuration={1600} onReady={() => setShowSplash(false)} />
      )}
      <main className="flex-grow w-full">{children}</main>

      <TabBar />
    </div>
  );
}
