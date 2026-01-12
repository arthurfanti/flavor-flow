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
          <div className="relative w-24 h-24 rounded-3xl shadow-2xl overflow-hidden transform hover:rotate-6 transition-transform border-4 border-brand-yellow/20">
            <img 
              src="/icons/transcribing.jpg" 
              alt="Transcribing" 
              className="w-full h-full object-cover"
            />
          </div>
        </div>
      )
    },
    analyzing: {
      title: 'Analyzing with AI',
      subtitle: 'MiniMax is identifying ingredients and steps...',
      icon: (
        <div className="relative w-32 h-32 flex items-center justify-center">
          <div className="absolute inset-0 bg-indigo-200/40 rounded-[2.5rem] blur-2xl animate-pulse" />
          <div className="relative w-24 h-24 bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-500 rounded-[2rem] shadow-[0_20px_50px_rgba(79,70,229,0.3)] flex items-center justify-center transform -rotate-6 animate-float border-2 border-white/30">
            <svg className="w-12 h-12 text-white drop-shadow-lg" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
            <div className="absolute -top-2 -right-2 w-8 h-8 bg-white rounded-full shadow-lg flex items-center justify-center animate-bounce">
              <div className="w-2 h-2 bg-indigo-600 rounded-full animate-ping" />
            </div>
          </div>
        </div>
      )
    },
    finalizing: {
      title: 'Finalizing Recipe',
      subtitle: 'Polishing your editorial-style instructions...',
      icon: (
        <div className="relative w-32 h-32 flex items-center justify-center">
          <div className="absolute inset-0 bg-emerald-200/40 rounded-[2.5rem] blur-2xl animate-pulse" />
          <div className="relative w-24 h-24 bg-gradient-to-br from-emerald-500 via-teal-500 to-cyan-600 rounded-[2rem] shadow-[0_20px_50px_rgba(16,185,129,0.3)] flex items-center justify-center transform hover:scale-110 transition-transform animate-float-slow border-2 border-white/30">
            <svg className="w-12 h-12 text-white drop-shadow-lg" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
            </svg>
            <div className="absolute -bottom-1 -left-1 w-6 h-6 bg-yellow-400 rounded-lg rotate-12 shadow-md animate-pulse" />
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