'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { createSupabaseClient } from '@/lib/supabase/client';
import { SupabaseShoppingListRepository } from '@/lib/repositories/SupabaseShoppingListRepository';
import { MockShoppingListRepository } from '@/lib/repositories/MockShoppingListRepository';
import ShoppingList from '@/components/ShoppingList';

export default function ShoppingListPage() {
  const [items, setItems] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const shoppingListRepo = useMemo(() => {
    try {
      const supabase = createSupabaseClient();
      return new SupabaseShoppingListRepository(supabase);
    } catch (e) {
      console.warn('Supabase not configured, using mock repository');
      return new MockShoppingListRepository();
    }
  }, []);

  const refreshItems = async () => {
    setIsLoading(true);
    try {
      const data = await shoppingListRepo.getItems();
      setItems(data);
      localStorage.setItem('shoppingList', JSON.stringify(data));
    } catch (error) {
      console.error('Failed to fetch shopping list:', error);
      const cached = localStorage.getItem('shoppingList');
      if (cached) setItems(JSON.parse(cached));
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    refreshItems();
  }, [shoppingListRepo]);

  const handleToggleItem = async (id: number, bought: boolean) => {
    try {
      // Optimistic update
      const newItems = items.map(item => item.id === id ? { ...item, bought } : item);
      setItems(newItems);
      localStorage.setItem('shoppingList', JSON.stringify(newItems));
      await shoppingListRepo.toggleItem(id, bought);
    } catch (error) {
      console.error('Failed to toggle item:', error);
      await refreshItems();
    }
  };

  const handleRemoveItem = async (id: number) => {
    try {
      // Optimistic update
      const newItems = items.filter(item => item.id !== id);
      setItems(newItems);
      localStorage.setItem('shoppingList', JSON.stringify(newItems));
      await shoppingListRepo.removeItem(id);
    } catch (error) {
      console.error('Failed to remove item:', error);
      await refreshItems();
    }
  };

  return (
    <div className="flex flex-col w-full animate-fade-in pb-20 text-gray-900">
      <div className="w-full h-56 rounded-[2rem] overflow-hidden mb-10 shadow-lg relative group bg-gradient-to-br from-brand-yellow/20 to-orange-100">
        <img 
          src="https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&q=80&w=1000" 
          alt="Grocery shopping"
          className="w-full h-full object-cover group-hover:scale-105 transition-all duration-1000 ease-out"
          onError={(e) => {
            (e.target as HTMLImageElement).style.display = 'none';
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />
        <div className="absolute bottom-8 left-8">
          <span className="text-brand-yellow font-sans font-bold uppercase tracking-[0.2em] text-[10px] mb-2 block">Market</span>
          <h1 className="text-4xl font-bold text-white tracking-tight">
            Shopping List
          </h1>
        </div>
      </div>

      <header className="mb-10 text-center">
        <p className="text-xl text-gray-500 font-medium italic leading-relaxed max-w-sm mx-auto">
          Everything you need for your upcoming culinary creations.
        </p>
      </header>

      {isLoading ? (
        <div className="w-full py-20 flex justify-center">
          <div className="animate-spin h-8 w-8 border-4 border-brand-yellow border-t-transparent rounded-full" />
        </div>
      ) : (
        <ShoppingList 
          items={items} 
          onToggle={handleToggleItem} 
          onRemove={handleRemoveItem} 
        />
      )}
    </div>
  );
}
