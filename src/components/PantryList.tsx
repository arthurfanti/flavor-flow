'use client';

import React from 'react';
import { PantryItem, PantryCategory } from '@/lib/repositories/PantryRepository';

interface PantryListProps {
  items: PantryItem[];
}

export default function PantryList({ items }: PantryListProps) {
  if (items.length === 0) {
    return (
      <div className="w-full py-12 text-center bg-white rounded-3xl border border-ui-border shadow-sm">
        <p className="text-gray-400 font-medium italic">Your pantry is empty.</p>
      </div>
    );
  }

  // Group items by category
  const categories: PantryCategory[] = ['Produce', 'Spices', 'Pantry Staples', 'Dairy', 'Meat', 'Other'];
  const groupedItems = categories.reduce((acc, cat) => {
    const catItems = items.filter(item => item.category === cat);
    if (catItems.length > 0) acc[cat] = catItems;
    return acc;
  }, {} as Record<string, PantryItem[]>);

  return (
    <div className="w-full space-y-10 pb-12">
      {Object.entries(groupedItems).map(([category, catItems], idx) => (
        <section 
          key={category} 
          className="animate-fade-in"
          style={{ animationDelay: `${idx * 100}ms` }}
        >
          <h3 className="text-sm font-sans font-bold uppercase tracking-[0.2em] text-gray-400 mb-6 flex items-center gap-4">
            {category}
            <div className="h-px bg-gray-100 flex-grow" />
          </h3>
          
          <div className="grid grid-cols-1 gap-3">
            {catItems.map((item) => (
              <div 
                key={item.id}
                className="flex items-center justify-between p-5 bg-white rounded-2xl border border-gray-50 shadow-[0_2px_8px_rgba(0,0,0,0.02)] hover:shadow-md transition-shadow group"
              >
                <span className="text-lg font-medium text-gray-700">{item.name}</span>
                {item.is_low_stock && (
                  <span className="text-[10px] font-bold uppercase tracking-wider px-3 py-1 bg-brand-yellow/10 text-brand-yellow-dark rounded-full">
                    Low Stock
                  </span>
                )}
              </div>
            ))}
          </div>
        </section>
      ))}
    </div>
  );
}
