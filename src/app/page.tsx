'use client';

import { useState, useEffect, useMemo, useCallback } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import UrlInput from '@/components/UrlInput';
import RecipePreview from '@/components/RecipePreview';
import RecipeEditor from '@/components/RecipeEditor';
import ShoppingList from '@/components/ShoppingList';
import RecipeListItem from '@/components/RecipeListItem';
import AILoadingOverlay, { AIStage } from '@/components/AILoadingOverlay';
import { SupabaseRecipeRepository } from '@/lib/repositories/SupabaseRecipeRepository';
import { SupabaseShoppingListRepository } from '@/lib/repositories/SupabaseShoppingListRepository';
import { SupabasePlannerRepository } from '@/lib/repositories/SupabasePlannerRepository';
import { SupabasePantryRepository } from '@/lib/repositories/SupabasePantryRepository';
import { createSupabaseClient } from '@/lib/supabase/client';
import { VideoAIExtractor } from '@/lib/services/VideoAIExtractor';
import { SupadataService } from '@/lib/services/SupadataService';
import { OpenRouterService } from '@/lib/services/OpenRouterService';
import { IngredientMatcher } from '@/lib/services/IngredientMatcher';

export default function Home() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [aiStage, setAiStage] = useState<AIStage>('idle');
  const [recipe, setRecipe] = useState<any | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [recentRecipes, setRecentRecipes] = useState<any[]>([]);
  const [configError, setConfigError] = useState<string | null>(null);

  const extractor = useMemo(() => {
    try {
      const supadataKey = process.env.NEXT_PUBLIC_SUPADATA_API_KEY;
      const openRouterKey = process.env.NEXT_PUBLIC_OPENROUTER_API_KEY;
      
      if (!supadataKey || !openRouterKey) {
        throw new Error('AI Extraction keys (Supadata/OpenRouter) are missing.');
      }

      return new VideoAIExtractor(
        new SupadataService(supadataKey),
        new OpenRouterService(openRouterKey)
      );
    } catch (e: any) {
      console.warn('AI Extractor could not be initialized:', e.message);
      return null;
    }
  }, []);

  const repos = useMemo(() => {
    try {
      const supabase = createSupabaseClient();
      return {
        recipe: new SupabaseRecipeRepository(supabase),
        shoppingList: new SupabaseShoppingListRepository(supabase),
        planner: new SupabasePlannerRepository(supabase),
        pantry: new SupabasePantryRepository(supabase),
      };
    } catch (e: any) {
      setConfigError(e.message);
      return null;
    }
  }, []);

  const refreshRecent = useCallback(async () => {
    if (!repos) return;
    try {
      const latest = await repos.recipe.getLatest(3);
      setRecentRecipes(latest);
    } catch (error) {
      console.error('Failed to fetch recent recipes:', error);
    }
  }, [repos]);

  useEffect(() => {
    refreshRecent();
  }, [refreshRecent]);

  const handleExtract = async (url: string) => {
    if (!repos || !extractor) {
      toast.error('AI Extractor or Repositories not initialized. Check your API keys.');
      return;
    }
    setIsLoading(true);
    try {
      console.log('Flavor Flow: Initializing True AI Extraction...');
      const extracted = await extractor.extractFromUrl(url, (stage) => setAiStage(stage));
      console.log('Flavor Flow: AI Extraction successful:', extracted.title);

      console.log('Flavor Flow: Saving to Supabase...');
      const savedRecipe = await repos.recipe.addRecipe(extracted);
      console.log('Flavor Flow: Save successful.');
      
      setRecipe(savedRecipe);
      await refreshRecent();
      toast.success('Recipe extracted and saved!');
    } catch (error: any) {
      console.error('Flavor Flow Error Object:', JSON.stringify(error, Object.getOwnPropertyNames(error)));
      // More user-friendly error message
      const msg = error.message === 'Failed to fetch' 
        ? 'Network error: Could not reach the server. Please check your internet connection or Supabase settings.'
        : error.message || 'An unexpected error occurred.';
      toast.error(`Extraction Error: ${msg}`);
    } finally {
      setIsLoading(false);
      setAiStage('idle');
    }
  };

  const handleSave = (updatedRecipe: any) => {
    setRecipe(updatedRecipe);
    setIsEditing(false);
    toast.success('Recipe updates saved locally.');
  };

  const handleAddToList = async (ingredients: string[]) => {
    if (!repos) return;
    try {
      console.log('Flavor Flow: Bulk adding items to list...');
      await repos.shoppingList.addItems(ingredients.map(ing => ({ name: ing, bought: false })));
      // Success feedback handled by RecipePreview button
    } catch (error) {
      console.error('Failed to add to shopping list:', error);
      toast.error('Failed to add items to shopping list.');
    }
  };

  const handleAddToPlanner = async (targetRecipe: any) => {
    if (!repos) return;
    setIsLoading(true);
    try {
      console.log('Flavor Flow: Adding to planner with pantry sync...');
      // 1. Add to Planner Queue
      await repos.planner.addToQueue({ 
        title: targetRecipe.title,
        recipe_id: targetRecipe.id,
        source_url: targetRecipe.source_url || targetRecipe.sourceUrl || '',
        image_url: targetRecipe.image_url || targetRecipe.imageUrl
      });

      // 2. Intelligent Shopping List Sync (Pantry Awareness)
      const pantryItems = await repos.pantry.getItems();
      const matcher = new IngredientMatcher();
      
      const missingIngredients = (targetRecipe.ingredients || []).filter((ing: string) => {
        const found = pantryItems.find(p => matcher.isMatch(p.name, ing));
        return !found;
      });

      // 3. Push missing to shopping list in bulk
      if (missingIngredients.length > 0) {
        await repos.shoppingList.addItems(missingIngredients.map((ing: string) => ({ name: ing, bought: false })));
      }

      setIsLoading(false);
      // Success feedback handled by redirection
      router.push('/planner');
    } catch (error) {
      setIsLoading(false);
      console.error('Failed to add to planner:', error);
      toast.error('Failed to add to planner. Please try again.');
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
    <div className="flex flex-col items-center w-full animate-fade-in text-gray-900 relative">
      <AILoadingOverlay stage={aiStage} />
      
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
