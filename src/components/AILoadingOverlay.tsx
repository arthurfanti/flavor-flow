import React from 'react';

export type AIStage = 'idle' | 'transcribing' | 'analyzing' | 'finalizing';

interface AILoadingOverlayProps {
  stage: AIStage;
}

export default function AILoadingOverlay({ stage }: AILoadingOverlayProps) {
  if (stage === 'idle') return null;

  const stages = {
    transcribing: {
      title: 'Transcribing Audio',
      subtitle: 'Extracting every word from the video...',
      icon: (
        <div className="relative w-32 h-32 flex items-center justify-center">
          <div className="absolute inset-0 bg-brand-yellow/20 rounded-[2.5rem] blur-2xl animate-pulse" />
          <div className="relative w-24 h-24 bg-gradient-to-br from-brand-yellow to-orange-400 rounded-3xl shadow-2xl flex items-center justify-center transform hover:rotate-6 transition-transform">
            <svg className="w-12 h-12 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
            </svg>
          </div>
        </div>
      )
    },
    analyzing: {
      title: 'Analyzing with AI',
      subtitle: 'MiniMax is identifying ingredients and steps...',
      icon: (
        <div className="relative w-32 h-32 flex items-center justify-center">
          <div className="absolute inset-0 bg-purple-200 rounded-[2.5rem] blur-2xl animate-pulse" />
          <div className="relative w-24 h-24 bg-gradient-to-br from-purple-500 to-indigo-600 rounded-3xl shadow-2xl flex items-center justify-center transform -rotate-6 transition-transform">
            <svg className="w-12 h-12 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
            </svg>
          </div>
        </div>
      )
    },
    finalizing: {
      title: 'Finalizing Recipe',
      subtitle: 'Polishing your editorial-style instructions...',
      icon: (
        <div className="relative w-32 h-32 flex items-center justify-center">
          <div className="absolute inset-0 bg-emerald-200 rounded-[2.5rem] blur-2xl animate-pulse" />
          <div className="relative w-24 h-24 bg-gradient-to-br from-emerald-400 to-teal-600 rounded-3xl shadow-2xl flex items-center justify-center transform hover:scale-110 transition-transform">
            <svg className="w-12 h-12 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
            </svg>
          </div>
        </div>
      )
    }
  };

  const current = stages[stage];

  return (
    <div className="fixed inset-0 z-[100] bg-white/90 backdrop-blur-xl flex flex-col items-center justify-center p-6 animate-fade-in">
      <div className="flex flex-col items-center max-w-sm text-center">
        <div className="mb-12 animate-float">
          {current.icon}
        </div>
        
        <div className="space-y-3">
          <h2 className="text-3xl font-serif font-bold text-gray-900 leading-tight">
            {current.title}
          </h2>
          <p className="text-gray-500 font-medium italic leading-relaxed">
            {current.subtitle}
          </p>
        </div>

        <div className="mt-12 w-48 h-1 bg-gray-100 rounded-full overflow-hidden">
          <div className="h-full bg-brand-yellow animate-shimmer" style={{ width: '60%' }} />
        </div>
      </div>
    </div>
  );
}