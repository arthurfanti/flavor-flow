'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { createSupabaseClient } from '@/lib/supabase/client';
import { SupabasePantryRepository } from '@/lib/repositories/SupabasePantryRepository';
import PantryList from '@/components/PantryList';
import PantryItemForm from '@/components/PantryItemForm';
import { PantryItem } from '@/lib/repositories/PantryRepository';

export default function PantryPage() {
  const [items, setItems] = useState<PantryItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isAdding, setIsAdding] = useState(false);
  const [configError, setConfigError] = useState<string | null>(null);

  const pantryRepo = useMemo(() => {
    try {
      const supabase = createSupabaseClient();
      return new SupabasePantryRepository(supabase);
    } catch (e: any) {
      setConfigError(e.message);
      return null;
    }
  }, []);

  const refreshItems = async () => {
    if (!pantryRepo) return;
    setIsLoading(true);
    try {
      const data = await pantryRepo.getItems();
      setItems(data);
      localStorage.setItem('pantryItems', JSON.stringify(data));
    } catch (error) {
      console.error('Failed to fetch pantry items:', error);
      const cached = localStorage.getItem('pantryItems');
      if (cached) setItems(JSON.parse(cached));
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    refreshItems();
  }, [pantryRepo]);

  const handleSaveItem = async (data: Partial<PantryItem>) => {
    if (!pantryRepo) return;
    try {
      await pantryRepo.addItem(data);
      await refreshItems();
      setIsAdding(false);
    } catch (error) {
      console.error('Failed to save pantry item:', error);
    }
  };

  const handleDeleteItem = async (id: number) => {
    if (!pantryRepo) return;
    try {
      await pantryRepo.removeItem(id);
      await refreshItems();
    } catch (error) {
      console.error('Failed to delete pantry item:', error);
    }
  };

  const handleToggleLowStock = async (id: number, current: boolean) => {
    if (!pantryRepo) return;
    try {
      await pantryRepo.updateItem(id, { is_low_stock: !current });
      await refreshItems();
    } catch (error) {
      console.error('Failed to update pantry item:', error);
    }
  };

  if (configError) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen p-4 text-center">
        <h1 className="text-2xl font-bold text-red-600 mb-4">Configuration Error</h1>
        <p className="text-gray-700">{configError}</p>
        <p className="text-sm text-gray-500 mt-4">Please check your environment variables.</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col w-full animate-fade-in pb-20 text-gray-900">
      <div className="w-full h-56 rounded-[2rem] overflow-hidden mb-10 shadow-lg relative group bg-gradient-to-br from-brand-yellow/20 to-orange-100">
        <img 
          src="https://images.unsplash.com/photo-1580927942266-81d0519eb7be?auto=format&fit=crop&q=80&w=1000" 
          alt="Kitchen pantry"
          className="w-full h-full object-cover group-hover:scale-105 transition-all duration-1000 ease-out"
          onError={(e) => {
            (e.target as HTMLImageElement).style.display = 'none';
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />
        <div className="absolute bottom-8 left-8">
          <span className="text-brand-yellow font-sans font-bold uppercase tracking-[0.2em] text-[10px] mb-2 block">Inventory</span>
          <h1 className="text-4xl font-bold text-white tracking-tight">
            My Pantry
          </h1>
        </div>
      </div>

      {!isAdding && (
        <>
          <header className="mb-10 flex items-center justify-between px-2">
            <div>
              <p className="text-gray-500 font-medium italic">
                Keep track of your kitchen staples.
              </p>
            </div>
            <button 
              onClick={() => setIsAdding(true)}
              className="w-14 h-14 rounded-2xl bg-brand-yellow text-black flex items-center justify-center shadow-lg shadow-brand-yellow/20 hover:scale-105 active:scale-95 transition-all"
            >
              <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
            </button>
          </header>

          {isLoading ? (
            <div className="w-full py-20 flex justify-center">
              <div className="animate-spin h-8 w-8 border-4 border-brand-yellow border-t-transparent rounded-full" />
            </div>
          ) : (
            <PantryList 
              items={items} 
              onDelete={handleDeleteItem}
              onToggleLowStock={handleToggleLowStock}
            />
          )}
        </>
      )}

      {isAdding && (
        <div className="w-full max-w-lg mx-auto py-4">
          <header className="mb-10 text-center">
            <h2 className="text-3xl font-serif font-bold text-gray-900 mb-2">Add New Item</h2>
            <p className="text-gray-400 italic">Expand your kitchen inventory</p>
          </header>
          <PantryItemForm onSave={handleSaveItem} onCancel={() => setIsAdding(false)} />
        </div>
      )}
    </div>
  );
}
