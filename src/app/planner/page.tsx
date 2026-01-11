'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { createSupabaseClient } from '@/lib/supabase/client';
import { SupabasePlannerRepository } from '@/lib/repositories/SupabasePlannerRepository';
import PlannerQueue from '@/components/PlannerQueue';
import { PlannedRecipe } from '@/lib/repositories/PlannerRepository';

export default function PlannerPage() {
  const [recipes, setRecipes] = useState<PlannedRecipe[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [configError, setConfigError] = useState<string | null>(null);

  const plannerRepo = useMemo(() => {
    try {
      const supabase = createSupabaseClient();
      return new SupabasePlannerRepository(supabase);
    } catch (e: any) {
      setConfigError(e.message);
      return null;
    }
  }, []);

  const refreshQueue = async () => {
    if (!plannerRepo) return;
    setIsLoading(true);
    try {
      const data = await plannerRepo.getQueue();
      setRecipes(data);
      localStorage.setItem('plannedRecipes', JSON.stringify(data));
    } catch (error) {
      console.error('Failed to fetch planned recipes:', error);
      const cached = localStorage.getItem('plannedRecipes');
      if (cached) setRecipes(JSON.parse(cached));
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    refreshQueue();
  }, [plannerRepo]);

  const handleRemove = async (id: number) => {
    if (!plannerRepo) return;
    try {
      // Optimistic update
      setRecipes(prev => prev.filter(r => r.id !== id));
      await plannerRepo.removeFromQueue(id);
    } catch (error) {
      console.error('Failed to remove recipe:', error);
      await refreshQueue();
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
          src="https://images.unsplash.com/photo-1490645935967-10de6ba17061?auto=format&fit=crop&q=80&w=1000" 
          alt="Healthy meal planning"
          className="w-full h-full object-cover group-hover:scale-105 transition-all duration-1000 ease-out"
          onError={(e) => {
            (e.target as HTMLImageElement).style.display = 'none';
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />
        <div className="absolute bottom-8 left-8">
          <span className="text-brand-yellow font-sans font-bold uppercase tracking-[0.2em] text-[10px] mb-2 block">Meal Planning</span>
          <h1 className="text-4xl font-bold text-white tracking-tight">
            Next Meals
          </h1>
        </div>
      </div>

      <header className="mb-10 text-center">
        <p className="text-xl text-gray-500 font-medium italic leading-relaxed max-w-sm mx-auto">
          Your curated queue of upcoming culinary adventures.
        </p>
      </header>

      {isLoading ? (
        <div className="w-full py-20 flex justify-center">
          <div className="animate-spin h-8 w-8 border-4 border-brand-yellow border-t-transparent rounded-full" />
        </div>
      ) : (
        <PlannerQueue recipes={recipes} onRemove={handleRemove} />
      )}
    </div>
  );
}
