import React from 'react';
import { ExtractedRecipe } from '@/lib/services/RecipeExtractor';
import { normalizeImageUrl } from '@/lib/utils';
import { useTranslations } from 'next-intl';

interface RecipeListItemProps {
  recipe: any;
}

export default function RecipeListItem({ recipe }: RecipeListItemProps) {
  const t = useTranslations('Common');
  return (
    <div className="flex items-center gap-4 p-3 bg-gradient-to-r from-[#1A1A1A] to-[#202020] rounded-2xl hover:brightness-110 transition-all cursor-pointer group text-neutral-100">
      <div className="w-14 h-14 rounded-xl overflow-hidden flex-shrink-0 bg-neutral-800">
        {recipe.image_url ? (
          <img
            src={normalizeImageUrl(recipe.image_url)}
            alt={recipe.title}
            className="w-full h-full object-cover grayscale-[10%] group-hover:grayscale-0 transition-all"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-brand-yellow/40">
            <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z" clipRule="evenodd" />
            </svg>
          </div>
        )}
      </div>
      <div className="flex-grow min-w-0">
        <h3 className="text-lg font-serif font-bold text-neutral-100 truncate tracking-tight group-hover:text-brand-primary transition-colors">
          {recipe.title}
        </h3>
        <p className="text-xs text-neutral-400 font-sans uppercase tracking-widest mt-1">
          {t('ingredientsCount', { count: recipe.ingredients?.length || 0 })}
        </p>
      </div>
      <div className="flex-shrink-0 opacity-0 group-hover:opacity-100 transition-opacity pr-2">
        <svg className="w-5 h-5 text-neutral-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
        </svg>
      </div>
    </div>
  );
}
