'use client';

import { useState, useEffect, useMemo } from 'react';
import UrlInput from '@/components/UrlInput';
import RecipePreview from '@/components/RecipePreview';
import RecipeEditor from '@/components/RecipeEditor';
import ShoppingList from '@/components/ShoppingList';
import { MockRecipeRepository } from '@/lib/repositories/MockRecipeRepository';
import { SupabaseShoppingListRepository } from '@/lib/repositories/SupabaseShoppingListRepository';
import { MockShoppingListRepository } from '@/lib/repositories/MockShoppingListRepository';
import { createSupabaseClient } from '@/lib/supabase/client';

export default function Home() {
  const [isLoading, setIsLoading] = useState(false);
  const [recipe, setRecipe] = useState<any | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [shoppingListItems, setShoppingListItems] = useState<any[]>([]);

  const shoppingListRepo = useMemo(() => {
    try {
      const supabase = createSupabaseClient();
      return new SupabaseShoppingListRepository(supabase);
    } catch (e) {
      console.warn('Supabase not configured, using mock repository');
      return new MockShoppingListRepository();
    }
  }, []);

  useEffect(() => {
    const fetchItems = async () => {
      try {
        const items = await shoppingListRepo.getItems();
        setShoppingListItems(items);
        localStorage.setItem('shoppingList', JSON.stringify(items));
      } catch (error) {
        console.error('Failed to fetch shopping list:', error);
        // Fallback to local storage if fetch fails (e.g. offline)
        const cached = localStorage.getItem('shoppingList');
        if (cached) setShoppingListItems(JSON.parse(cached));
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
      localStorage.setItem('shoppingList', JSON.stringify(updatedItems));
      alert('Added to shopping list!');
    } catch (error) {
      console.error('Failed to add to shopping list:', error);
    }
  };

  const handleToggleItem = async (id: number, bought: boolean) => {
    try {
      // Optimistic update
      const newItems = shoppingListItems.map(item => item.id === id ? { ...item, bought } : item);
      setShoppingListItems(newItems);
      localStorage.setItem('shoppingList', JSON.stringify(newItems));
      await shoppingListRepo.toggleItem(id, bought);
    } catch (error) {
      console.error('Failed to toggle item:', error);
      // Revert on error
      const items = await shoppingListRepo.getItems();
      setShoppingListItems(items);
      localStorage.setItem('shoppingList', JSON.stringify(items));
    }
  };

  const handleRemoveItem = async (id: number) => {
    try {
      // Optimistic update
      const newItems = shoppingListItems.filter(item => item.id !== id);
      setShoppingListItems(newItems);
      localStorage.setItem('shoppingList', JSON.stringify(newItems));
      await shoppingListRepo.removeItem(id);
    } catch (error) {
      console.error('Failed to remove item:', error);
      const items = await shoppingListRepo.getItems();
      setShoppingListItems(items);
      localStorage.setItem('shoppingList', JSON.stringify(items));
    }
  };

  return (
    <div className="flex flex-col items-center w-full animate-fade-in">
      <div className="w-full h-56 rounded-[2rem] overflow-hidden mb-10 shadow-lg relative group">
        <img 
          src="https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&q=80&w=1000" 
          alt="Fresh ingredients"
          className="w-full h-full object-cover grayscale-[10%] group-hover:grayscale-0 group-hover:scale-105 transition-all duration-1000 ease-out"
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
    </div>
  );
}
