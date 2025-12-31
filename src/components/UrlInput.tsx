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
    <div className="w-full max-w-2xl mx-auto p-4">
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <div className="relative">
          <input
            type="url"
            placeholder="Paste video URL (YouTube, Instagram, TikTok)"
            className="w-full p-4 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-yellow-400 bg-white shadow-sm transition-all"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            disabled={isLoading}
            required
          />
        </div>
        <button
          type="submit"
          disabled={isLoading || !url.trim()}
          className={`w-full p-4 rounded-xl font-semibold transition-all ${
            isLoading || !url.trim()
              ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
              : 'bg-yellow-400 text-black hover:bg-yellow-500 active:scale-[0.98] shadow-md'
          }`}
        >
          {isLoading ? (
            <span className="flex items-center justify-center gap-2">
              <svg className="animate-spin h-5 w-5 text-gray-600" viewBox="0 0 24 24">
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
