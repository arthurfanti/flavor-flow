import React from 'react';
import Icon from '@/components/Icon';

export default function KawaiiPlasticDesign() {
  return (
    <main className="min-h-screen bg-[#F0F5FF] text-[#5A6B8C] font-sans selection:bg-[#FFB5E8] selection:text-white relative overflow-hidden flex flex-col items-center justify-center p-8">
      
      {/* Soft Lighting / Empty Space Context */}
      <div className="fixed top-[-20%] left-[-10%] w-[80vw] h-[80vw] bg-white rounded-full blur-[150px] opacity-60"></div>
      <div className="fixed bottom-[-20%] right-[-10%] w-[60vw] h-[60vw] bg-[#E0F0FF] rounded-full blur-[120px] opacity-80"></div>

      <div className="relative z-10 w-full max-w-4xl flex flex-col items-center gap-12">
        
        {/* Hero Section */}
        <div className="text-center space-y-4">
          <div className="inline-block bg-[#E6EEFA] px-6 py-2 rounded-full shadow-[inset_-4px_-4px_8px_rgba(255,255,255,1),inset_4px_4px_8px_rgba(174,174,192,0.2)]">
             <span className="text-sm font-bold tracking-wider uppercase text-[#8EA3C9]">★ Super Smart Cooking ★</span>
          </div>
          <h1 className="text-6xl md:text-8xl font-black text-[#5A6B8C] tracking-tight drop-shadow-sm">
            Flavor<span className="text-[#FF9ECD]">Flow</span>
          </h1>
          <p className="text-xl text-[#8EA3C9] font-medium max-w-lg mx-auto leading-relaxed">
            Turn your yummy videos into a shopping list! <br/> Just paste the link below.
          </p>
        </div>

        {/* The "Plastic" Input Module */}
        <div className="w-full max-w-2xl bg-[#E6EEFA] p-4 rounded-[3rem] shadow-[20px_20px_60px_#c3cdda,-20px_-20px_60px_#ffffff] flex items-center gap-4 transition-transform hover:scale-[1.01] duration-300">
          <div className="w-16 h-16 bg-[#FF9ECD] rounded-full shadow-[inset_-5px_-5px_10px_rgba(200,80,140,0.5),inset_5px_5px_10px_rgba(255,255,255,0.4)] flex items-center justify-center text-white text-2xl">
            <Icon name="link" />
          </div>
          <input 
            type="text" 
            placeholder="Paste your video link..." 
            className="flex-1 bg-transparent text-xl font-bold text-[#5A6B8C] placeholder:text-[#AABBCF] focus:outline-none px-2"
          />
          <button className="bg-[#B5EAD7] text-[#5A6B8C] px-10 py-5 rounded-[2.5rem] font-black text-lg shadow-[8px_8px_16px_#9abdae,-8px_-8px_16px_#d0fffa] hover:shadow-[inset_4px_4px_8px_#9abdae,inset_-4px_-4px_8px_#d0fffa] hover:translate-y-1 transition-all flex items-center gap-2">
            <span>COOK!</span>
            <Icon name="bolt" />
          </button>
        </div>

        {/* Floating Cards (Empty Space utilization) */}
        <div className="w-full grid md:grid-cols-3 gap-8 mt-12">
           {[
             { bg: 'bg-[#FFDFD3]', icon: 'icecream', title: 'Sweet Treat' },
             { bg: 'bg-[#E0BBE4]', icon: 'restaurant', title: 'Dinner Time' },
             { bg: 'bg-[#FFFFD8]', icon: 'local_pizza', title: 'Snack Attack' }
           ].map((item, i) => (
             <div key={i} className={`${item.bg} p-8 rounded-[2.5rem] aspect-square flex flex-col items-center justify-center gap-4 shadow-[10px_10px_30px_rgba(0,0,0,0.05)] hover:rotate-3 transition-transform cursor-pointer relative overflow-hidden group`}>
                {/* Glossy Overlay */}
                <div className="absolute top-4 right-4 w-12 h-12 bg-white rounded-full blur-xl opacity-60"></div>
                <div className="absolute bottom-4 left-4 w-24 h-24 bg-white rounded-full blur-2xl opacity-40"></div>
                
                <div className="w-20 h-20 bg-white/40 rounded-3xl flex items-center justify-center text-4xl text-[#5A6B8C] shadow-sm backdrop-blur-sm group-hover:scale-110 transition-transform">
                  <Icon name={item.icon} />
                </div>
                <h3 className="text-xl font-black text-[#5A6B8C]/80">{item.title}</h3>
             </div>
           ))}
        </div>

      </div>
    </main>
  );
}
