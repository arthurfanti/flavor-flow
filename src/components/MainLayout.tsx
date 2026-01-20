import React from 'react';
import TabBar from './TabBar';

interface MainLayoutProps {
  children: React.ReactNode;
}

export default function MainLayout({ children }: MainLayoutProps) {
  return (
    <div className="min-h-screen w-full relative flex flex-col bg-background text-foreground">
      <header className="w-full py-6 px-6 bg-background/80 backdrop-blur-xl border-b border-white/10 shadow-[0_4px_30px_rgba(0,0,0,0.1)] sticky top-0 z-50">
        <div className="max-w-2xl mx-auto flex items-center justify-between">
          <h1 className="text-3xl font-display font-bold tracking-tight text-foreground">
            Flavor Flow
          </h1>
          {/* Future slot for user profile/settings */}
          <div className="w-8 h-8 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-gray-400 backdrop-blur-sm">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
          </div>
        </div>
      </header>

      <main className="relative z-10 flex-grow w-full max-w-2xl mx-auto px-4 py-8 pb-24 animate-fade-in">
        {children}
      </main>

      <TabBar />
    </div>
  );
}
