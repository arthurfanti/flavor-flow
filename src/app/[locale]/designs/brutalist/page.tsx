import React from 'react';
import Icon from '@/components/Icon';

export default function BrutalistDesign() {
  return (
    <main className="min-h-screen bg-[#E0E0E0] text-black font-mono selection:bg-black selection:text-white p-4">

      <div className="border-4 border-black min-h-[calc(100vh-2rem)] relative">

        {/* Header Block */}
        <header className="border-b-4 border-black p-8 flex justify-between items-center bg-[#FF5733]">
          <h1 className="text-6xl md:text-8xl font-black uppercase tracking-tighter leading-none">
            FLAVOR<br />FLOW
          </h1>
          <div className="hidden md:block text-right">
            <p className="font-bold uppercase">Video → Recipe</p>
            <p className="font-bold uppercase">Extraction Engine</p>
            <p className="font-bold uppercase">v.9.9.9</p>
          </div>
        </header>

        <div className="grid lg:grid-cols-2 h-full">

          {/* Input Section */}
          <div className="p-8 lg:border-r-4 border-black flex flex-col justify-center min-h-[50vh]">
            <label className="block text-4xl font-bold uppercase mb-4 bg-black text-white inline-block px-2">
              Insert Source Code
            </label>
            <div className="relative border-4 border-black shadow-[10px_10px_0px_0px_rgba(0,0,0,1)] bg-white transition-transform hover:translate-x-1 hover:translate-y-1 hover:shadow-none mb-8">
              <input
                type="text"
                placeholder="HTTPS://..."
                className="w-full bg-transparent p-6 text-2xl md:text-4xl font-bold uppercase focus:outline-none placeholder:text-black/20"
              />
              <button className="absolute right-0 top-0 bottom-0 bg-black text-white px-8 font-bold uppercase hover:bg-[#FF5733] hover:text-black transition-colors border-l-4 border-black">
                EXTRACT
              </button>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="border-4 border-black p-4 bg-white hover:bg-black hover:text-white cursor-pointer transition-colors">
                <Icon name="movie" className="text-4xl mb-2" />
                <div className="font-bold uppercase">From YouTube</div>
              </div>
              <div className="border-4 border-black p-4 bg-white hover:bg-black hover:text-white cursor-pointer transition-colors">
                <Icon name="smartphone" className="text-4xl mb-2" />
                <div className="font-bold uppercase">From TikTok</div>
              </div>
            </div>
          </div>

          {/* List Section */}
          <div className="bg-black text-white p-8 overflow-y-auto max-h-[100vh]">
            <h2 className="text-4xl font-bold uppercase mb-8 border-b-4 border-white pb-4">Raw Data Dump</h2>

            <div className="space-y-6">
              {[1, 2, 3].map((i) => (
                <div key={i} className="border-4 border-white p-6 hover:bg-[#FF5733] hover:text-black hover:border-black transition-colors cursor-pointer group relative">
                  <div className="absolute -top-3 -left-3 bg-white text-black border-2 border-black px-2 font-bold text-sm transform -rotate-3 group-hover:rotate-0 transition-transform">
                    INDEX_{i}
                  </div>
                  <h3 className="text-3xl font-black uppercase mb-2">Recipe_Batch_{i * 492}</h3>
                  <div className="flex justify-between font-bold text-sm opacity-60 group-hover:opacity-100">
                    <span>STATUS: EXTRACTED</span>
                    <span>SIZE: {i * 12}KB</span>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-12 border-4 border-dashed border-white/30 p-8 text-center uppercase font-bold text-white/50 hover:text-white hover:border-white cursor-pointer transition-colors">
              Load More Archives
            </div>
          </div>

        </div>

        {/* Marquee Footer */}
        <div className="absolute bottom-0 left-0 right-0 border-t-4 border-black bg-[#FF5733] overflow-hidden whitespace-nowrap py-2">
          <div className="animate-marquee font-bold uppercase text-xl text-black">
            <span dangerouslySetInnerHTML={{
              __html: `/// WARNING: HIGHLY ADDICTIVE COOKING EXPERIENCE /// DO NOT CONSUME RAW DATA /// FLAVOR FLOW SYSTEM OPERATIONAL ///
          /// WARNING: HIGHLY ADDICTIVE COOKING EXPERIENCE /// DO NOT CONSUME RAW DATA /// FLAVOR FLOW SYSTEM OPERATIONAL ///`}} />
          </div>
        </div>

      </div>
    </main>
  );
}
