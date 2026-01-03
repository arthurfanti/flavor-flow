import React from 'react';
import TabBar from './TabBar';

interface MainLayoutProps {
  children: React.ReactNode;
}

export default function MainLayout({ children }: MainLayoutProps) {
  return (
    <div className="min-h-screen flex flex-col bg-app-bg text-gray-900">
      <header className="w-full py-6 px-6 bg-white/90 backdrop-blur-xl border-b border-ui-border shadow-[0_1px_3px_rgba(0,0,0,0.02)] sticky top-0 z-50">
        <div className="max-w-2xl mx-auto flex items-center justify-between">
          <h1 className="text-3xl font-bold tracking-tight text-gray-900">
            Flavor Flow
          </h1>
          {/* Future slot for user profile/settings */}
          <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-gray-400">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
          </div>
        </div>
      </header>

      <main className="flex-grow w-full max-w-2xl mx-auto px-4 py-8 pb-24">
        {children}
      </main>

      <TabBar />
    </div>
  );
}
