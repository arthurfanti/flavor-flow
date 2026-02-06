import React from 'react';
import Link from 'next/link';
import Icon from '@/components/Icon';

export default function DesignsIndex() {
  const designs = [
    { 
      id: 'brutalist', 
      name: 'The Brutalist', 
      desc: 'Raw, Bold, Unapologetic.',
      color: 'bg-[#E0E0E0] text-black border-black hover:bg-[#FF5733]',
      icon: 'architecture'
    },
    { 
      id: 'minimal-zen', 
      name: 'Minimal Zen', 
      desc: 'Japanese Paper & Ink.',
      color: 'bg-[#F2F0E9] text-[#2C2C2C] border-[#8C8674] hover:bg-white',
      icon: 'spa'
    },
    { 
      id: 'kawaii-plastic', 
      name: 'Kawaii Plastic', 
      desc: 'Glossy 3D Toy Kitchen.',
      color: 'bg-[#E6EEFA] text-[#5A6B8C] border-[#5A6B8C]/20 hover:shadow-[10px_10px_30px_#c3cdda]',
      icon: 'smart_toy'
    },
  ];

  return (
    <div className="min-h-screen bg-[#111] text-white p-8 md:p-16 font-sans">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-5xl font-bold mb-4 bg-gradient-to-r from-blue-400 to-purple-600 bg-clip-text text-transparent">
          The Final Selection
        </h1>
        <p className="text-neutral-400 mb-12 text-xl max-w-2xl">
          Three radically different interpretations of the Flavor Flow experience.
        </p>
        
        <div className="grid md:grid-cols-3 gap-8">
          {designs.map((d) => (
            <Link key={d.id} href={`designs/${d.id}`} className="block group h-full">
              <div className={`h-full border-2 p-8 rounded-xl transition-all duration-300 flex flex-col justify-between ${d.color}`}>
                <div>
                  <div className="flex justify-between items-start mb-6">
                     <Icon name={d.icon} className="text-4xl opacity-80" />
                     <Icon name="arrow_forward" className="opacity-0 group-hover:opacity-100 transition-opacity -rotate-45 group-hover:rotate-0 transform duration-300" />
                  </div>
                  <h2 className="text-3xl font-bold mb-2">{d.name}</h2>
                  <p className="opacity-80 font-medium">{d.desc}</p>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}