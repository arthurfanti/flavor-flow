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
  onAddToPlanner: (recipe: Recipe) => void;
}

export default function RecipePreview({ recipe, onAddToList, onAddToPlanner }: RecipePreviewProps) {
  if (!recipe) return null;

  return (
    <div className="w-full max-w-2xl bg-white rounded-3xl shadow-xl shadow-gray-200/50 p-6 md:p-8 mt-8 animate-fade-in">
      <div className="flex flex-col sm:flex-row justify-between items-start gap-4 mb-8">
        <h2 className="text-3xl font-serif font-bold text-gray-900">{recipe.title}</h2>
        <div className="flex gap-2 w-full sm:w-auto">
          <button
            onClick={() => onAddToList(recipe.ingredients)}
            className="flex-1 sm:flex-none bg-brand-yellow text-black px-4 py-3 rounded-xl font-bold uppercase tracking-widest text-[10px] hover:bg-brand-yellow-dark shadow-lg shadow-brand-yellow/10 transition-all active:scale-95"
          >
            Add to List
          </button>
          <button
            onClick={() => onAddToPlanner(recipe)}
            className="flex-1 sm:flex-none bg-white text-gray-400 border border-gray-100 px-4 py-3 rounded-xl font-bold uppercase tracking-widest text-[10px] hover:text-gray-600 hover:bg-gray-50 transition-all active:scale-95"
          >
            Add to Planner
          </button>
        </div>
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
