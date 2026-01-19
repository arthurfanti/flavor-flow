'use client';

import { useState, useEffect, useMemo } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { toast } from 'sonner';
import RecipePreview from '@/components/RecipePreview';
import { SupabaseRecipeRepository } from '@/lib/repositories/SupabaseRecipeRepository';
import { SupabaseShoppingListRepository } from '@/lib/repositories/SupabaseShoppingListRepository';
import { SupabasePlannerRepository } from '@/lib/repositories/SupabasePlannerRepository';
import { SupabasePantryRepository } from '@/lib/repositories/SupabasePantryRepository';
import { SupabaseProfileRepository } from '@/lib/repositories/SupabaseProfileRepository';
import { createSupabaseClient } from '@/lib/supabase/client';
import { IngredientMatcher } from '@/lib/services/IngredientMatcher';
import { useAuth } from '@/components/AuthProvider';
import { TranslationService } from '@/lib/services/TranslationService';
import { OpenRouterService } from '@/lib/services/OpenRouterService';

export default function RecipeDetailPage() {
  const params = useParams();
  const id = params?.id as string;
  const router = useRouter();
  const { session, loading: authLoading } = useAuth();
  const [recipe, setRecipe] = useState<any | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const repos = useMemo(() => {
    if (authLoading) return null;
    try {
      const supabase = createSupabaseClient();
      const userId = session?.user?.id;
      return {
        recipe: new SupabaseRecipeRepository(supabase, userId),
        shoppingList: userId ? new SupabaseShoppingListRepository(supabase, userId) : null,
        planner: userId ? new SupabasePlannerRepository(supabase, userId) : null,
        pantry: userId ? new SupabasePantryRepository(supabase, userId) : null,
        profile: userId ? new SupabaseProfileRepository(supabase) : null,
      };
    } catch (e: any) {
      console.error(e);
      return null;
    }
  }, [session?.user?.id, authLoading]);

  const translationService = useMemo(() => {
    const key = process.env.NEXT_PUBLIC_OPENROUTER_API_KEY;
    if (!key) return null;
    return new TranslationService(new OpenRouterService(key));
  }, []);

  useEffect(() => {
    const fetchAndTranslate = async () => {
      if (!repos || !id) return;
      try {
        let preferredLocale = 'en';
        if (session?.user?.id && repos.profile) {
          const profile = await repos.profile.getProfile(session.user.id);
          if (profile?.preferred_locale) {
            preferredLocale = profile.preferred_locale;
          }
        }

        // 1. Fetch recipe (SupabaseRecipeRepository already joins translations if locale provided)
        const data = await repos.recipe.getById(id, preferredLocale);
        if (!data) {
          setError('Recipe not found');
          setIsLoading(false);
          return;
        }

        // 2. Check if we need to trigger AI translation
        const sourceLocale = data.source_locale || 'en';
        const existingTranslations = data.translations || [];

        if (sourceLocale !== preferredLocale && existingTranslations.length === 0 && translationService) {
          console.log('RecipeDetailPage: Triggering AI translation...');
          const translated = await translationService.translateRecipe({
            title: data.title,
            ingredients: data.ingredients,
            instructions: data.instructions
          }, preferredLocale);

          // Save translation
          await repos.recipe.saveTranslation(Number(id), preferredLocale, translated);
          
          setRecipe({ ...data, ...translated });
        } else {
          setRecipe(data);
        }
      } catch (err) {
        console.error(err);
        setError('Failed to load recipe');
      } finally {
        setIsLoading(false);
      }
    };

    fetchAndTranslate();
  }, [!!repos, id, session?.user?.id, !!translationService]);

  const handleAddToList = async (ingredients: string[]) => {
    if (!repos) return;
    try {
      await repos.shoppingList.addItems(ingredients.map(ing => ({ name: ing, bought: false })));
      toast.success('Added ingredients to shopping list');
    } catch (error) {
      console.error('Failed to add to shopping list:', error);
      toast.error('Failed to add items to shopping list.');
    }
  };

  const handleAddToPlanner = async (targetRecipe: any) => {
    if (!repos) return;
    try {
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

      toast.success('Added to planner');
      router.push('/planner');
    } catch (error) {
      console.error('Failed to add to planner:', error);
      toast.error('Failed to add to planner. Please try again.');
    }
  };

  if (isLoading) return <div className="flex justify-center py-20"><div className="animate-spin h-8 w-8 border-4 border-brand-yellow border-t-transparent rounded-full" /></div>;
  if (error) return <div className="p-8 text-center text-red-500 font-medium">{error}</div>;
  if (!recipe) return null;

  return (
    <div className="flex flex-col items-center w-full animate-fade-in pb-20">
       <RecipePreview 
         recipe={recipe} 
         onAddToList={handleAddToList} 
         onAddToPlanner={handleAddToPlanner}
       />
    </div>
  );
}
