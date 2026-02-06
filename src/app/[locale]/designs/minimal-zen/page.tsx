import React from 'react';
import Icon from '@/components/Icon';

export default function MinimalZenDesign() {
  return (
    <main className="min-h-screen bg-[#F2F0E9] text-[#2C2C2C] font-serif selection:bg-[#C4B298] selection:text-white p-8 md:p-16 relative overflow-hidden">
      
      {/* Texture Overlay */}
      <div className="fixed inset-0 pointer-events-none opacity-40 bg-[url('https://www.transparenttextures.com/patterns/cream-paper.png')]"></div>

      {/* Decorative Circle (Enso-like) */}
      <div className="fixed -right-24 top-1/2 -translate-y-1/2 w-[500px] h-[500px] border-[40px] border-[#E6E2D6] rounded-full opacity-60"></div>

      <div className="relative z-10 max-w-7xl mx-auto flex flex-col md:flex-row h-full min-h-[80vh]">
        
        {/* Vertical Text Sidebar */}
        <div className="w-24 hidden md:flex flex-col justify-between items-center border-r border-[#D6D2C4] py-12 mr-16">
           <div className="text-xl font-bold tracking-widest [writing-mode:vertical-rl] rotate-180 text-[#8C8674]">
              FLAVOR FLOW
           </div>
           <div className="flex flex-col gap-8 text-[#8C8674]">
              <span className="cursor-pointer hover:text-black transition-colors">EN</span>
              <span className="w-[1px] h-12 bg-[#D6D2C4]"></span>
           </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 flex flex-col justify-center">
           
           <div className="mb-24">
             <span className="block text-xs uppercase tracking-[0.4em] text-[#8C8674] mb-6">The Essence of Cooking</span>
             <h1 className="text-6xl md:text-8xl leading-tight text-[#1a1a1a] mb-8 font-thin italic">
               Simplicity is <br/>
               the ultimate <br/>
               sophistication.
             </h1>
             
             <div className="relative max-w-lg">
                <input 
                  type="text" 
                  placeholder="Enter recipe URL..."
                  className="w-full bg-transparent border-b border-[#2C2C2C] py-4 text-xl placeholder:text-[#8C8674] focus:outline-none focus:border-black transition-colors"
                />
                <button className="absolute right-0 top-4 text-xs uppercase tracking-widest hover:font-bold transition-all">
                   Begin
                </button>
             </div>
           </div>

           {/* Horizontal Scroll Cards */}
           <div className="flex gap-12 overflow-x-auto pb-12 scrollbar-hide">
              {[
                { title: "Matcha Tea", subtitle: "Ceremonial Grade" },
                { title: "Miso Soup", subtitle: "Traditional Ferment" },
                { title: "Sashimi", subtitle: "Fresh Catch" }
              ].map((item, i) => (
                <div key={i} className="min-w-[250px] group cursor-pointer">
                   <div className="aspect-[3/4] bg-[#E6E2D6] mb-6 relative overflow-hidden">
                      <div className="absolute inset-0 bg-neutral-300 opacity-0 group-hover:opacity-10 transition-opacity"></div>
                      <div className="absolute bottom-4 right-4 text-[#8C8674] text-xs">0{i+1}</div>
                   </div>
                   <h3 className="text-2xl italic mb-2 group-hover:underline decoration-1 underline-offset-8 decoration-[#8C8674]">{item.title}</h3>
                   <p className="text-sm text-[#8C8674] tracking-wider uppercase">{item.subtitle}</p>
                </div>
              ))}
           </div>

        </div>

      </div>
    </main>
  );
}
