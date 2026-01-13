'use client';

import React, { useState } from 'react';

interface UrlInputProps {
  onExtract: (url: string) => void;
  isLoading: boolean;
}

export default function UrlInput({ onExtract, isLoading }: UrlInputProps) {
  const [url, setUrl] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (url.trim()) {
      onExtract(url);
    }
  };

  return (
    <div className="w-full max-w-2xl mx-auto p-0">
      <form onSubmit={handleSubmit} className="flex flex-col gap-5">
        <div className="relative group">
          <input
            type="text"
            placeholder="Paste video URL (YouTube, Instagram...)"
            className="w-full p-5 rounded-2xl border border-white/20 focus:outline-none focus:ring-4 focus:ring-sky-300/40 bg-white/10 backdrop-blur-md shadow-[0_8px_30px_rgba(0,0,0,0.03)] group-hover:shadow-lg transition-all font-sans text-gray-900 placeholder:text-gray-500"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            disabled={isLoading}
            required
          />
        </div>
        <button
          type="submit"
          disabled={isLoading || !url.trim()}
          className={`w-full p-5 rounded-2xl font-bold uppercase tracking-widest text-xs transition-all ${
            isLoading || !url.trim()
              ? 'bg-white/50 text-gray-400 cursor-not-allowed border border-white/10'
              : 'bg-gradient-to-r from-sky-300 via-pink-300 to-rose-300 text-black hover:brightness-105 active:scale-[0.98] shadow-lg shadow-pink-300/20'
          }`}
        >
          {isLoading ? (
            <span className="flex items-center justify-center gap-2">
              <svg className="animate-spin h-5 w-5 text-gray-700" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
              </svg>
              Extracting...
            </span>
          ) : (
            'Extract Recipe'
          )}
        </button>
      </form>
    </div>
  );
}
