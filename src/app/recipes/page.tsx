'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { createSupabaseClient } from '@/lib/supabase/client';
import { SupabaseRecipeRepository } from '@/lib/repositories/SupabaseRecipeRepository';
import RecipeListItem from '@/components/RecipeListItem';

export default function RecipesPage() {
  const [recipes, setRecipes] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [configError, setConfigError] = useState<string | null>(null);

  const recipeRepo = useMemo(() => {
    try {
      const supabase = createSupabaseClient();
      return new SupabaseRecipeRepository(supabase);
    } catch (e: any) {
      setConfigError(e.message);
      return null;
    }
  }, []);

  useEffect(() => {
    const fetchRecipes = async () => {
      if (!recipeRepo) return;
      try {
        const data = await recipeRepo.getAll();
        setRecipes(data);
      } catch (error) {
        console.error('Failed to fetch recipes:', error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchRecipes();
  }, [recipeRepo]);

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
          src="https://images.unsplash.com/photo-1466637574441-749b8f19452f?auto=format&fit=crop&q=80&w=1000" 
          alt="Recipe collection"
          className="w-full h-full object-cover group-hover:scale-105 transition-all duration-1000 ease-out"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />
        <div className="absolute bottom-8 left-8">
          <span className="text-brand-yellow font-sans font-bold uppercase tracking-[0.2em] text-[10px] mb-2 block">Library</span>
          <h1 className="text-4xl font-bold text-white tracking-tight">
            My Recipes
          </h1>
        </div>
      </div>

      <header className="mb-8 px-2">
        <p className="text-xl text-gray-500 font-medium italic leading-relaxed">
          Your personal archive of culinary inspiration.
        </p>
      </header>

      {isLoading ? (
        <div className="w-full py-20 flex justify-center">
          <div className="animate-spin h-8 w-8 border-4 border-brand-yellow border-t-transparent rounded-full" />
        </div>
      ) : recipes.length === 0 ? (
        <div className="w-full py-12 text-center bg-white rounded-3xl border border-ui-border shadow-sm">
          <p className="text-gray-400 font-medium italic">Your recipe list is empty.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4">
          {recipes.map((recipe) => (
            <RecipeListItem key={recipe.id || recipe.sourceUrl} recipe={recipe} />
          ))}
        </div>
      )}
    </div>
  );
}
