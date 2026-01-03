import React from 'react';

interface Recipe {
  title: string;
  ingredients: string[];
  instructions: string[];
  sourceUrl: string;
}

interface RecipePreviewProps {
  recipe: Recipe | null;
  onAddToList: (ingredients: string[]) => void;
}

export default function RecipePreview({ recipe, onAddToList }: RecipePreviewProps) {
  if (!recipe) return null;

  return (
    <div className="w-full max-w-2xl bg-white rounded-3xl shadow-xl shadow-gray-200/50 p-6 md:p-8 mt-8 animate-fade-in">
      <div className="flex justify-between items-start mb-6">
        <h2 className="text-3xl font-serif font-bold text-gray-900">{recipe.title}</h2>
        <button
          onClick={() => onAddToList(recipe.ingredients)}
          className="bg-yellow-400 text-black px-4 py-2 rounded-lg font-semibold hover:bg-yellow-500 shadow-sm transition-all active:scale-95 text-sm"
        >
          Add to Shopping List
        </button>
      </div>
      
      <div className="mb-8">
        <h3 className="text-lg font-semibold text-gray-700 mb-3 uppercase tracking-wider">Ingredients</h3>
        <ul className="space-y-2">
          {recipe.ingredients.map((ingredient, index) => (
            <li key={index} className="flex items-start gap-3 text-gray-600">
              <span className="mt-2 w-1.5 h-1.5 bg-yellow-400 rounded-full flex-shrink-0" />
              <span>{ingredient}</span>
            </li>
          ))}
        </ul>
      </div>

      <div>
        <h3 className="text-lg font-semibold text-gray-700 mb-3 uppercase tracking-wider">Instructions</h3>
        <ol className="space-y-4">
          {recipe.instructions.map((step, index) => (
            <li key={index} className="flex gap-4 text-gray-600">
              <span className="flex-shrink-0 w-6 h-6 rounded-full bg-gray-100 text-gray-500 font-semibold text-sm flex items-center justify-center">
                {index + 1}
              </span>
              <span>{step}</span>
            </li>
          ))}
        </ol>
      </div>
    </div>
  );
}
