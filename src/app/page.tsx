'use client';

import { useState, useEffect, useMemo } from 'react';
import UrlInput from '@/components/UrlInput';
import RecipePreview from '@/components/RecipePreview';
import RecipeEditor from '@/components/RecipeEditor';
import ShoppingList from '@/components/ShoppingList';
import { MockRecipeRepository } from '@/lib/repositories/MockRecipeRepository';
import { SupabaseShoppingListRepository } from '@/lib/repositories/SupabaseShoppingListRepository';
import { createSupabaseClient } from '@/lib/supabase/client';

export default function Home() {
  const [isLoading, setIsLoading] = useState(false);
  const [recipe, setRecipe] = useState<any | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [shoppingListItems, setShoppingListItems] = useState<any[]>([]);

  const supabase = useMemo(() => createSupabaseClient(), []);
  const shoppingListRepo = useMemo(() => new SupabaseShoppingListRepository(supabase), [supabase]);

  useEffect(() => {
    const fetchItems = async () => {
      try {
        const items = await shoppingListRepo.getItems();
        setShoppingListItems(items);
      } catch (error) {
        console.error('Failed to fetch shopping list:', error);
      }
    };
    fetchItems();
  }, [shoppingListRepo]);

  const handleExtract = async (url: string) => {
    setIsLoading(true);
    setTimeout(async () => {
      const repo = new MockRecipeRepository();
      const recipes = await repo.getRecipes();
      setRecipe({
        ...recipes[0],
        sourceUrl: url
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
      const updatedItems = await shoppingListRepo.getItems();
      setShoppingListItems(updatedItems);
      alert('Added to shopping list!');
    } catch (error) {
      console.error('Failed to add to shopping list:', error);
    }
  };

  const handleToggleItem = async (id: number, bought: boolean) => {
    try {
      // Optimistic update
      setShoppingListItems(items => items.map(item => item.id === id ? { ...item, bought } : item));
      await shoppingListRepo.toggleItem(id, bought);
    } catch (error) {
      console.error('Failed to toggle item:', error);
      // Revert on error
      const items = await shoppingListRepo.getItems();
      setShoppingListItems(items);
    }
  };

  const handleRemoveItem = async (id: number) => {
    try {
      // Optimistic update
      setShoppingListItems(items => items.filter(item => item.id !== id));
      await shoppingListRepo.removeItem(id);
    } catch (error) {
      console.error('Failed to remove item:', error);
      const items = await shoppingListRepo.getItems();
      setShoppingListItems(items);
    }
  };

  return (
    <main className="flex min-h-screen flex-col items-center px-4 pt-20 pb-10 bg-[#FAFAFA]">
      <header className="text-center mb-12">
        <h1 className="text-5xl font-serif font-bold text-gray-900 mb-4">Flavor Flow</h1>
        <p className="text-lg text-gray-600 max-w-md mx-auto">
          Turn your favorite cooking videos into organized shopping lists in seconds.
        </p>
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
           <RecipePreview recipe={recipe} onAddToList={handleAddToList} />
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

      <ShoppingList 
        items={shoppingListItems} 
        onToggle={handleToggleItem} 
        onRemove={handleRemoveItem} 
      />
    </main>
  );
}
