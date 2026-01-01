'use client';

import { useState } from 'react';
import UrlInput from '@/components/UrlInput';
import RecipePreview from '@/components/RecipePreview';
import { MockRecipeRepository } from '@/lib/repositories/MockRecipeRepository';

export default function Home() {
  const [isLoading, setIsLoading] = useState(false);
  const [recipe, setRecipe] = useState<any | null>(null);

  const handleExtract = async (url: string) => {
    setIsLoading(true);
    // TODO: Integrate with SpoonacularExtractor in next step, using MockRepo for UI demo
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

  return (
    <main className="flex min-h-screen flex-col items-center px-4 pt-20 pb-10 bg-[#FAFAFA]">
      <header className="text-center mb-12">
        <h1 className="text-5xl font-serif font-bold text-gray-900 mb-4">Flavor Flow</h1>
        <p className="text-lg text-gray-600 max-w-md mx-auto">
          Turn your favorite cooking videos into organized shopping lists in seconds.
        </p>
      </header>

      <div className="w-full max-w-2xl bg-white rounded-3xl shadow-xl shadow-gray-200/50 p-6 md:p-8">
        <h2 className="text-xl font-semibold text-gray-800 mb-6 px-4">Start your recipe</h2>
        <UrlInput onExtract={handleExtract} isLoading={isLoading} />
        
        <div className="mt-8 px-4 py-6 border-t border-gray-100">
          <p className="text-sm text-gray-400 text-center italic">
            Paste a link from YouTube, Instagram, or TikTok to begin.
          </p>
        </div>
      </div>

      <RecipePreview recipe={recipe} />
    </main>
  );
}
