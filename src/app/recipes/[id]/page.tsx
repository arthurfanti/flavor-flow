'use client';

import { useState, useEffect, useMemo } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { toast } from 'sonner';
import RecipePreview from '@/components/RecipePreview';
import { SupabaseRecipeRepository } from '@/lib/repositories/SupabaseRecipeRepository';
import { SupabaseShoppingListRepository } from '@/lib/repositories/SupabaseShoppingListRepository';
import { SupabasePlannerRepository } from '@/lib/repositories/SupabasePlannerRepository';
import { SupabasePantryRepository } from '@/lib/repositories/SupabasePantryRepository';
import { createSupabaseClient } from '@/lib/supabase/client';
import { IngredientMatcher } from '@/lib/services/IngredientMatcher';

export default function RecipeDetailPage() {
  const params = useParams();
  const id = params?.id as string;
  const router = useRouter();
  const [recipe, setRecipe] = useState<any | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

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
      console.error(e);
      return null;
    }
  }, []);

  useEffect(() => {
    const fetchRecipe = async () => {
      if (!repos || !id) return;
      try {
        const data = await repos.recipe.getById(id);
        if (!data) {
           setError('Recipe not found');
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
    fetchRecipe();
  }, [repos, id]);

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
