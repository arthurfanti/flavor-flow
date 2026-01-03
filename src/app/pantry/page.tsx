'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { createSupabaseClient } from '@/lib/supabase/client';
import { SupabasePantryRepository } from '@/lib/repositories/SupabasePantryRepository';
import { MockPantryRepository } from '@/lib/repositories/MockPantryRepository';
import PantryList from '@/components/PantryList';
import { PantryItem } from '@/lib/repositories/PantryRepository';

export default function PantryPage() {
  const [items, setItems] = useState<PantryItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const pantryRepo = useMemo(() => {
    try {
      const supabase = createSupabaseClient();
      return new SupabasePantryRepository(supabase);
    } catch (e) {
      console.warn('Supabase not configured, using mock repository');
      return new MockPantryRepository();
    }
  }, []);

  useEffect(() => {
    const fetchItems = async () => {
      try {
        const data = await pantryRepo.getItems();
        setItems(data);
      } catch (error) {
        console.error('Failed to fetch pantry items:', error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchItems();
  }, [pantryRepo]);

  return (
    <div className="flex flex-col w-full animate-fade-in">
      <div className="w-full h-48 rounded-[2rem] overflow-hidden mb-10 shadow-lg relative bg-brand-yellow/5">
        <img 
          src="https://images.unsplash.com/photo-1584473457406-62302ce999e2?auto=format&fit=crop&q=80&w=1000" 
          alt="Kitchen pantry"
          className="w-full h-full object-cover grayscale-[10%]"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
        <div className="absolute bottom-8 left-8">
          <span className="text-brand-yellow font-sans font-bold uppercase tracking-[0.2em] text-[10px] mb-2 block">Inventory</span>
          <h1 className="text-4xl font-bold text-white tracking-tight">
            My Pantry
          </h1>
        </div>
      </div>

      <header className="mb-10 flex items-center justify-between">
        <div>
          <p className="text-gray-500 font-medium italic">
            Keep track of your kitchen staples.
          </p>
        </div>
        {/* Placeholder for Add Item Action */}
        <button className="w-12 h-12 rounded-2xl bg-brand-yellow text-black flex items-center justify-center shadow-lg shadow-brand-yellow/20 hover:scale-105 active:scale-95 transition-all">
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
          </svg>
        </button>
      </header>

      {isLoading ? (
        <div className="w-full py-20 flex justify-center">
          <div className="animate-spin h-8 w-8 border-4 border-brand-yellow border-t-transparent rounded-full" />
        </div>
      ) : (
        <PantryList items={items} />
      )}
    </div>
  );
}
