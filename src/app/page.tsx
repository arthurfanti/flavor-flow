'use client';

import { useState, useEffect, useMemo, useCallback } from 'react';
import Link from 'next/link';
import UrlInput from '@/components/UrlInput';
import RecipePreview from '@/components/RecipePreview';
import RecipeEditor from '@/components/RecipeEditor';
import ShoppingList from '@/components/ShoppingList';
import RecipeListItem from '@/components/RecipeListItem';
import { MockRecipeRepository } from '@/lib/repositories/MockRecipeRepository';
import { SupabaseRecipeRepository } from '@/lib/repositories/SupabaseRecipeRepository';
import { SupabaseShoppingListRepository } from '@/lib/repositories/SupabaseShoppingListRepository';
import { MockShoppingListRepository } from '@/lib/repositories/MockShoppingListRepository';
import { SupabasePlannerRepository } from '@/lib/repositories/SupabasePlannerRepository';
import { MockPlannerRepository } from '@/lib/repositories/MockPlannerRepository';
import { SupabasePantryRepository } from '@/lib/repositories/SupabasePantryRepository';
import { MockPantryRepository } from '@/lib/repositories/MockPantryRepository';
import { createSupabaseClient } from '@/lib/supabase/client';
import { SpoonacularExtractor } from '@/lib/services/SpoonacularExtractor';
import { IngredientMatcher } from '@/lib/services/IngredientMatcher';

export default function Home() {
  const [isLoading, setIsLoading] = useState(false);
  const [recipe, setRecipe] = useState<any | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [recentRecipes, setRecentRecipes] = useState<any[]>([]);

  const recipeRepo = useMemo(() => {
    try {
      const supabase = createSupabaseClient();
      return new SupabaseRecipeRepository(supabase);
    } catch (e) {
      console.warn('Supabase not configured, using mock repository for recipes');
      return new MockRecipeRepository();
    }
  }, []);

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

  const pantryRepo = useMemo(() => {
    try {
      const supabase = createSupabaseClient();
      return new SupabasePantryRepository(supabase);
    } catch (e) {
      console.warn('Supabase not configured, using mock repository');
      return new MockPantryRepository();
    }
  }, []);

  const refreshRecent = useCallback(async () => {
    try {
      const latest = await recipeRepo.getLatest(3);
      setRecentRecipes(latest);
    } catch (error) {
      console.error('Failed to fetch recent recipes:', error);
    }
  }, [recipeRepo]);

  useEffect(() => {
    refreshRecent();
  }, [refreshRecent]);

  const handleExtract = async (url: string) => {
    setIsLoading(true);
    try {
      const apiKey = process.env.NEXT_PUBLIC_SPOONACULAR_API_KEY;
      const isMockMode = !apiKey || apiKey === '' || apiKey.includes('your-spoonacular-key');
      
      let extracted;
      if (isMockMode) {
        console.log('Flavor Flow: No valid API key found. Using mock extraction.');
        const mockRepo = new MockRecipeRepository();
        const mockRecipes = await mockRepo.getRecipes();
        extracted = {
          ...mockRecipes[0],
          sourceUrl: url,
          image_url: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&q=80&w=1000'
        };
      } else {
        console.log('Flavor Flow: Calling Spoonacular API...');
        const extractor = new SpoonacularExtractor(apiKey);
        extracted = await extractor.extractFromUrl(url);
      }

      console.log('Flavor Flow: Recipe extracted, saving to repository:', recipeRepo.constructor.name);
      await recipeRepo.addRecipe(extracted);
      setRecipe(extracted);
      await refreshRecent();
    } catch (error: any) {
      console.error('Flavor Flow Error: Extraction or Save failed', error);
      // More user-friendly error message
      const msg = error.message === 'Failed to fetch' 
        ? 'Network error: Could not reach the server. Please check your internet connection or Supabase settings.'
        : error.message || 'An unexpected error occurred.';
      alert(`Extraction Error: ${msg}`);
    } finally {
      setIsLoading(false);
    }
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

  const handleAddToPlanner = async (targetRecipe: any) => {
    try {
      // 1. Add to Planner Queue
      await plannerRepo.addToQueue({ 
        title: targetRecipe.title, 
        source_url: targetRecipe.sourceUrl || '',
        image_url: targetRecipe.image_url 
      });

      // 2. Intelligent Shopping List Sync (Pantry Awareness)
      const pantryItems = await pantryRepo.getItems();
      const matcher = new IngredientMatcher();
      
      const missingIngredients = targetRecipe.ingredients.filter((ing: string) => {
        const found = pantryItems.find(p => matcher.isMatch(p.name, ing));
        return !found;
      });

      const alreadyInPantry = targetRecipe.ingredients.length - missingIngredients.length;

      // 3. Push missing to shopping list
      for (const ingredient of missingIngredients) {
        await shoppingListRepo.addItem({ name: ingredient, bought: false });
      }

      alert(
        `Added to planner!\n\n` +
        `Shopping List updated: ${missingIngredients.length} items added.\n` +
        `${alreadyInPantry} items found in your pantry.`
      );
    } catch (error) {
      console.error('Failed to add to planner:', error);
      alert('Failed to add to planner. Please try again.');
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

      {!recipe && !isLoading && recentRecipes.length > 0 && (
        <div className="w-full mt-16 animate-slide-up">
          <div className="flex items-center justify-between mb-8 px-2">
            <h2 className="text-sm font-sans font-bold uppercase tracking-[0.2em] text-gray-400">
              Recent Extractions
            </h2>
            <Link 
              href="/recipes" 
              className="text-[10px] font-sans font-bold uppercase tracking-widest text-brand-yellow-dark hover:text-yellow-600 transition-colors"
            >
              View All
            </Link>
          </div>
          
          <div className="grid grid-cols-1 gap-4">
            {recentRecipes.map((r, i) => (
              <div 
                key={r.id || `${r.sourceUrl}-${i}`} 
                className="cursor-pointer active:scale-[0.98] transition-transform"
                onClick={() => setRecipe(r)}
              >
                <RecipeListItem recipe={r} />
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
