'use client';

import React from 'react';
import { PantryItem, PantryCategory } from '@/lib/repositories/PantryRepository';

interface PantryListProps {
  items: PantryItem[];
  onDelete: (id: number) => void;
  onToggleLowStock: (id: number, current: boolean) => void;
}

export default function PantryList({ items, onDelete, onToggleLowStock }: PantryListProps) {
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
                <div className="flex items-center gap-4">
                  <span className="text-lg font-medium text-gray-700">{item.name}</span>
                  {item.is_low_stock && (
                    <span className="text-[10px] font-bold uppercase tracking-wider px-3 py-1 bg-brand-yellow/10 text-brand-yellow-dark rounded-full">
                      Low Stock
                    </span>
                  )}
                </div>
                
                <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button 
                    onClick={() => onToggleLowStock(item.id!, item.is_low_stock)}
                    className={`p-2 rounded-xl transition-colors ${item.is_low_stock ? 'text-brand-yellow hover:bg-yellow-50' : 'text-gray-300 hover:bg-gray-50'}`}
                    title={item.is_low_stock ? "Mark as in stock" : "Mark as low stock"}
                  >
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-11a1 1 0 10-2 0v2H7a1 1 0 100 2h2v2a1 1 0 102 0v-2h2a1 1 0 100-2h-2V7z" clipRule="evenodd" />
                    </svg>
                  </button>
                  <button 
                    onClick={() => onDelete(item.id!)}
                    className="p-2 text-gray-300 hover:text-red-400 hover:bg-red-50 rounded-xl transition-colors"
                    title="Remove item"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </section>
      ))}
    </div>
  );
}
