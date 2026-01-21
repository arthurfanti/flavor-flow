import React, { useState } from 'react';
import { MagicInput } from './MagicInput';
import { MagicButton } from './MagicButton';
import { Link2 } from 'lucide-react';

interface UrlInputProps {
  onExtract: (url: string) => void;
  isLoading: boolean;
}

export default function UrlInput({ onExtract, isLoading }: UrlInputProps) {
  const [url, setUrl] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (url.trim()) {
      onExtract(url.trim());
    }
  };

  return (
    <div className="w-full max-w-2xl mx-auto p-0">
      <form onSubmit={handleSubmit} className="flex flex-col gap-5">
        <MagicInput
          type="text"
          placeholder="Paste video URL (YouTube, Instagram...)"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          required
          icon={<Link2 className="h-5 w-5" />}
          disabled={isLoading}
        />
        
        <MagicButton 
          type="submit" 
          variant={url.trim() ? "shiny" : "default"}
          disabled={isLoading || !url.trim()}
          className="w-full h-14 uppercase tracking-[0.2em] text-xs font-bold"
        >
          {isLoading ? 'Processing...' : 'Extract Recipe'}
        </MagicButton>
      </form>
    </div>
  );
}
