'use client';

import { useState, useEffect, useMemo } from 'react';
import UrlInput from '@/components/UrlInput';
import RecipePreview from '@/components/RecipePreview';
import RecipeEditor from '@/components/RecipeEditor';
import ShoppingList from '@/components/ShoppingList';
import { MockRecipeRepository } from '@/lib/repositories/MockRecipeRepository';
import { SupabaseShoppingListRepository } from '@/lib/repositories/SupabaseShoppingListRepository';
import { MockShoppingListRepository } from '@/lib/repositories/MockShoppingListRepository';
import { SupabasePlannerRepository } from '@/lib/repositories/SupabasePlannerRepository';
import { MockPlannerRepository } from '@/lib/repositories/MockPlannerRepository';
import { createSupabaseClient } from '@/lib/supabase/client';

export default function Home() {
  const [isLoading, setIsLoading] = useState(false);
  const [recipe, setRecipe] = useState<any | null>(null);
  const [isEditing, setIsEditing] = useState(false);

  const shoppingListRepo = useMemo(() => {
    try {
      const supabase = createSupabaseClient();
      return new SupabaseShoppingListRepository(supabase);
    } catch (e) {
      console.warn('Supabase not configured, using mock repository');
      return new MockShoppingListRepository();
    }
  }, []);

  const plannerRepo = useMemo(() => {
    try {
      const supabase = createSupabaseClient();
      return new SupabasePlannerRepository(supabase);
    } catch (e) {
      console.warn('Supabase not configured, using mock repository');
      return new MockPlannerRepository();
    }
  }, []);

  const handleExtract = async (url: string) => {
    setIsLoading(true);
    setTimeout(async () => {
      const repo = new MockRecipeRepository();
      const recipes = await repo.getRecipes();
      setRecipe({
        ...recipes[0],
        sourceUrl: url,
        image_url: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&q=80&w=1000'
      });
      setIsLoading(false);
    }, 1500);
  };

  const handleSave = (updatedRecipe: any) => {
    setRecipe(updatedRecipe);
    setIsEditing(false);
  };

  const handleAddToList = async (ingredients: string[]) => {
    try {
      for (const ingredient of ingredients) {
        await shoppingListRepo.addItem({ name: ingredient, bought: false });
      }
      alert('Added to shopping list!');
    } catch (error) {
      console.error('Failed to add to shopping list:', error);
    }
  };

  const handleAddToPlanner = async (title: string) => {
    try {
      await plannerRepo.addToQueue({ 
        title, 
        source_url: recipe?.sourceUrl || '',
        image_url: recipe?.image_url 
      });
      alert('Added to planner!');
    } catch (error) {
      console.error('Failed to add to planner:', error);
    }
  };

  return (
    <div className="flex flex-col items-center w-full animate-fade-in text-gray-900">
      <div className="w-full h-56 rounded-[2rem] overflow-hidden mb-10 shadow-lg relative group bg-gradient-to-br from-brand-yellow/20 to-orange-100">
        <img 
          src="https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&q=80&w=1000" 
          alt="Fresh food"
          className="w-full h-full object-cover group-hover:scale-105 transition-all duration-1000 ease-out"
          onError={(e) => {
            (e.target as HTMLImageElement).style.display = 'none';
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />
        <div className="absolute bottom-8 left-8">
          <span className="text-brand-yellow font-sans font-bold uppercase tracking-[0.2em] text-[10px] mb-2 block">Premium Kitchen</span>
          <h1 className="text-4xl font-bold text-white tracking-tight">
            Discover
          </h1>
        </div>
      </div>

      <header className="text-center mb-12 max-w-lg">
        <p className="text-2xl text-gray-800 font-medium leading-relaxed">
          Transform your cooking inspiration into actionable lists.
        </p>
        <div className="w-12 h-1 bg-brand-yellow mx-auto mt-6 rounded-full" />
      </header>

      {!recipe && (
        <div className="w-full max-w-2xl bg-white rounded-3xl shadow-xl shadow-gray-200/50 p-6 md:p-8">
          <h2 className="text-xl font-semibold text-gray-800 mb-6 px-4">Start your recipe</h2>
          <UrlInput onExtract={handleExtract} isLoading={isLoading} />
          
          <div className="mt-8 px-4 py-6 border-t border-gray-100">
            <p className="text-sm text-gray-400 text-center italic">
              Paste a link from YouTube, Instagram, or TikTok to begin.
            </p>
          </div>
        </div>
      )}

      {recipe && !isEditing && (
        <div className="w-full max-w-2xl">
           <RecipePreview 
             recipe={recipe} 
             onAddToList={handleAddToList} 
             onAddToPlanner={handleAddToPlanner}
           />
           <div className="mt-4 flex justify-center">
             <button 
               onClick={() => setIsEditing(true)}
               className="text-gray-600 hover:text-gray-900 font-medium underline"
             >
               Edit Recipe
             </button>
           </div>
        </div>
      )}

      {recipe && isEditing && (
        <RecipeEditor 
          recipe={recipe} 
          onSave={handleSave} 
          onCancel={() => setIsEditing(false)} 
        />
      )}
    </div>
  );
}
