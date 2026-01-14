import React, { useState } from 'react';
import { normalizeImageUrl } from '@/lib/utils';

interface Recipe {
  title: string;
  ingredients: string[];
  instructions: string[];
  sourceUrl: string;
  image_url?: string;
}

interface RecipePreviewProps {
  recipe: Recipe | null;
  onAddToList: (ingredients: string[]) => void;
  onAddToPlanner: (recipe: Recipe) => void;
}

export default function RecipePreview({ recipe, onAddToList, onAddToPlanner }: RecipePreviewProps) {
  const [isAddingToList, setIsAddingToList] = useState(false);
  const [isAddingToPlanner, setIsAddingToPlanner] = useState(false);
  const [addedToList, setAddedToList] = useState(false);
  const [addedToPlanner, setAddedToPlanner] = useState(false);

  if (!recipe) return null;

  const handleAddToList = async () => {
    setIsAddingToList(true);
    try {
      await onAddToList(recipe.ingredients);
      setAddedToList(true);
      setTimeout(() => setAddedToList(false), 2000);
    } finally {
      setIsAddingToList(false);
    }
  };

  const handleAddToPlanner = async () => {
    setIsAddingToPlanner(true);
    try {
      await onAddToPlanner(recipe);
      setAddedToPlanner(true);
      setTimeout(() => setAddedToPlanner(false), 2000);
    } finally {
      setIsAddingToPlanner(false);
    }
  };

  return (
    <div className="w-full max-w-3xl bg-white rounded-[2.5rem] shadow-2xl shadow-gray-200/60 mt-8 animate-fade-in border border-gray-50/50 overflow-hidden text-left">
      {/* Hero Image Section */}
      {recipe.image_url && (
        <div className="w-full h-64 md:h-80 overflow-hidden relative group">
          <img 
            src={normalizeImageUrl(recipe.image_url)} 
            alt={recipe.title}
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
        </div>
      )}

      <div className="p-8 md:p-12">
        <div className="flex flex-col gap-8 mb-12">
          <div className="space-y-4">
            <span className="text-brand-yellow font-sans font-bold uppercase tracking-[0.3em] text-[10px] block">Freshly Extracted</span>
            <h2 className="text-4xl md:text-5xl font-serif font-bold text-gray-900 leading-[1.1] tracking-tight">{recipe.title}</h2>
          </div>
          
          <div className="flex flex-wrap gap-3">
            <button
              onClick={handleAddToList}
              disabled={isAddingToList || addedToList}
              className={`flex-1 sm:flex-none px-8 py-4 rounded-2xl font-bold uppercase tracking-widest text-[11px] transition-all active:scale-95 flex items-center justify-center gap-2 ${
                addedToList 
                ? 'bg-emerald-500 text-white shadow-emerald-200' 
                : 'bg-brand-yellow text-black hover:bg-brand-yellow-dark shadow-brand-yellow/20'
              } shadow-xl disabled:opacity-70`}
            >
              {isAddingToList ? (
                <>
                  <div className="animate-spin h-4 w-4 border-2 border-black border-t-transparent rounded-full" />
                  Adding...
                </>
              ) : addedToList ? (
                <>
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" />
                  </svg>
                  Added!
                </>
              ) : (
                <>
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                  </svg>
                  Add to List
                </>
              )}
            </button>
            <button
              onClick={handleAddToPlanner}
              disabled={isAddingToPlanner || addedToPlanner}
              className={`flex-1 sm:flex-none px-8 py-4 rounded-2xl font-bold uppercase tracking-widest text-[11px] transition-all active:scale-95 flex items-center justify-center gap-2 ${
                addedToPlanner
                ? 'bg-emerald-500 text-white shadow-emerald-200'
                : 'bg-gray-900 text-white hover:bg-black shadow-gray-900/10'
              } shadow-xl disabled:opacity-70`}
            >
              {isAddingToPlanner ? (
                <>
                  <div className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full" />
                  Planning...
                </>
              ) : addedToPlanner ? (
                <>
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" />
                  </svg>
                  Planned!
                </>
              ) : (
                <>
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  Add to Planner
                </>
              )}
            </button>
          </div>
        </div>
        
        <div className="grid md:grid-cols-[1fr_1.5fr] gap-12">
          <div className="space-y-6">
            <h3 className="text-xs font-sans font-bold text-gray-400 uppercase tracking-[0.2em] border-b border-gray-100 pb-4 text-left">Ingredients</h3>
            <ul className="space-y-4">
              {recipe.ingredients.map((ingredient, index) => (
                <li key={index} className="flex items-start gap-4 text-[15px] leading-relaxed text-gray-600 group">
                  <span className="mt-2 w-1.5 h-1.5 bg-brand-yellow rounded-full flex-shrink-0 group-hover:scale-125 transition-transform" />
                  <span className="group-hover:text-gray-900 transition-colors">{ingredient}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="space-y-6">
            <h3 className="text-xs font-sans font-bold text-gray-400 uppercase tracking-[0.2em] border-b border-gray-100 pb-4 text-left">Instructions</h3>
            <ol className="space-y-8">
              {recipe.instructions.map((step, index) => (
                <li key={index} className="flex gap-6 group">
                  <span className="flex-shrink-0 w-10 h-10 rounded-2xl bg-gray-50 text-gray-400 font-serif font-bold text-lg flex items-center justify-center group-hover:bg-brand-yellow/10 group-hover:text-brand-yellow-dark transition-colors">
                    {index + 1}
                  </span>
                  <p className="text-[16px] leading-relaxed text-gray-600 group-hover:text-gray-900 transition-colors pt-1 text-left">
                    {step}
                  </p>
                </li>
              ))}
            </ol>
          </div>
        </div>
      </div>
    </div>
  );
}