'use client';

import React from 'react';
import Link from 'next/link';
import { PlannedRecipe } from '@/lib/repositories/PlannerRepository';
import { normalizeImageUrl } from '@/lib/utils';

interface PlannerQueueProps {
  recipes: PlannedRecipe[];
  onRemove: (id: number) => void;
}

export default function PlannerQueue({ recipes, onRemove }: PlannerQueueProps) {
  if (recipes.length === 0) {
    return (
      <div className="w-full py-12 text-center bg-white rounded-3xl border border-ui-border shadow-sm">
        <p className="text-gray-400 font-medium italic">Your planner is empty.</p>
      </div>
    );
  }

  const renderContent = (recipe: PlannedRecipe) => (
    <>
      <div className="w-full sm:w-48 h-40 sm:h-full overflow-hidden bg-gray-100">
        {recipe.image_url ? (
          <img 
            src={normalizeImageUrl(recipe.image_url)} 
            alt={recipe.title}
            className="w-full h-full object-cover grayscale-[10%] group-hover:grayscale-0 group-hover:scale-110 transition-all duration-700"
            onError={(e) => {
              (e.target as HTMLImageElement).style.display = 'none';
            }}
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-brand-yellow">
            <svg className="w-12 h-12 opacity-20" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z" clipRule="evenodd" />
            </svg>
          </div>
        )}
      </div>
      
      <div className="flex-grow p-6 flex flex-col justify-center overflow-hidden">
        <span className="text-[10px] font-sans font-bold uppercase tracking-[0.2em] text-brand-yellow-dark mb-2 block">Planned Meal</span>
        <h3 className="text-2xl font-serif font-bold text-gray-900 leading-tight line-clamp-2">
          {recipe.title}
        </h3>
      </div>
    </>
  );

  return (
    <div className="w-full space-y-6 pb-12">
      {recipes.map((recipe, idx) => (
        <div 
          key={recipe.id}
          className="animate-fade-in group relative bg-white/10 rounded-3xl border border-white/20 shadow-[0_8px_30px_rgba(255,255,255,0.06)] overflow-hidden hover:bg-white/20 transition-all duration-500 sm:h-40 text-gray-900 backdrop-blur-md"
          style={{ animationDelay: `${idx * 100}ms` }}
        >
          <div className="flex flex-col sm:flex-row h-full">
            {recipe.recipe_id ? (
              <Link href={`/recipes/${recipe.recipe_id}`} className="flex flex-col sm:flex-row flex-grow min-w-0 h-full">
                 {renderContent(recipe)}
              </Link>
            ) : (
              <div className="flex flex-col sm:flex-row flex-grow min-w-0 h-full">
                 {renderContent(recipe)}
              </div>
            )}

            <div className="p-4 flex items-center justify-end sm:border-l border-gray-50 h-16 sm:h-full z-10 relative">
              <button
                onClick={() => onRemove(recipe.id!)}
                className="w-12 h-12 rounded-2xl text-gray-300 hover:text-red-500 hover:bg-red-50 flex items-center justify-center transition-all active:scale-90"
                aria-label="Remove recipe"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}