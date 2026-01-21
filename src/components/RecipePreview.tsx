import React, { useState } from 'react';
import { normalizeImageUrl } from '@/lib/utils';
import { MagicCard } from './MagicCard';
import { MagicButton } from './MagicButton';
import { ShoppingCart, Calendar, Check, ChefHat } from 'lucide-react';

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
    <MagicCard className="w-full max-w-3xl mt-8 animate-fade-in border-white/5 overflow-hidden text-left" variant="default">
      {/* Hero Image Section */}
      {recipe.image_url && (
        <div className="w-full h-64 md:h-96 overflow-hidden relative group">
          <img 
            src={normalizeImageUrl(recipe.image_url)} 
            alt={recipe.title}
            className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105 brightness-[0.85]"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#1A1A1A] via-transparent to-transparent" />
          <div className="absolute top-6 left-6">
             <div className="glass px-4 py-2 rounded-full flex items-center gap-2">
                <ChefHat className="h-4 w-4 text-brand-primary" />
                <span className="text-[10px] font-bold uppercase tracking-widest text-white">AI Kitchen</span>
             </div>
          </div>
        </div>
      )}

      <div className="p-8 md:p-12 -mt-12 relative z-10">
        <div className="flex flex-col gap-10 mb-16">
          <div className="space-y-4">
            <span className="text-brand-primary font-sans font-bold uppercase tracking-[0.3em] text-[10px] block">Premium Recipe</span>
            <h2 className="text-4xl md:text-6xl font-display font-bold text-white leading-[1.1] tracking-tight">{recipe.title}</h2>
          </div>
          
          <div className="flex flex-wrap gap-4">
            <MagicButton
              onClick={handleAddToList}
              disabled={isAddingToList || addedToList}
              variant={addedToList ? "glass" : "shiny"}
              className="flex-1 sm:flex-none h-14"
            >
              {isAddingToList ? (
                <div className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full" />
              ) : addedToList ? (
                <><Check className="h-4 w-4 text-emerald-400" /> Added</>
              ) : (
                <><ShoppingCart className="h-4 w-4" /> Add to List</>
              )}
            </MagicButton>
            
            <MagicButton
              onClick={handleAddToPlanner}
              disabled={isAddingToPlanner || addedToPlanner}
              variant={addedToPlanner ? "glass" : "default"}
              className="flex-1 sm:flex-none h-14 bg-foreground text-background hover:bg-neutral-200 border-none"
            >
              {isAddingToPlanner ? (
                <div className="animate-spin h-4 w-4 border-2 border-background border-t-transparent rounded-full" />
              ) : addedToPlanner ? (
                <><Check className="h-4 w-4 text-emerald-600" /> Planned</>
              ) : (
                <><Calendar className="h-4 w-4" /> Add to Planner</>
              )}
            </MagicButton>
          </div>
        </div>
        
        <div className="grid lg:grid-cols-[1fr_1.8fr] gap-16">
          <div className="space-y-8">
            <div className="flex items-center gap-3 border-b border-white/5 pb-4">
               <h3 className="text-[11px] font-sans font-bold text-neutral-500 uppercase tracking-[0.2em]">Ingredients</h3>
               <span className="text-[10px] bg-white/5 text-neutral-400 px-2 py-0.5 rounded-full">{recipe.ingredients.length}</span>
            </div>
            <ul className="space-y-5">
              {recipe.ingredients.map((ingredient, index) => (
                <li key={index} className="flex items-start gap-4 text-[16px] leading-relaxed text-neutral-300 group">
                  <span className="mt-2.5 w-1 h-1 bg-brand-primary/60 rounded-full flex-shrink-0 group-hover:scale-150 transition-transform shadow-[0_0_8px_rgba(224,93,68,0.4)]" />
                  <span className="group-hover:text-white transition-colors">{ingredient}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="space-y-8">
            <h3 className="text-[11px] font-sans font-bold text-neutral-500 uppercase tracking-[0.2em] border-b border-white/5 pb-4">Preparation</h3>
            <ol className="space-y-10">
              {recipe.instructions.map((step, index) => (
                <li key={index} className="flex gap-8 group">
                  <span className="flex-shrink-0 w-8 h-8 rounded-full border border-brand-primary/20 text-brand-primary font-display font-bold text-sm flex items-center justify-center group-hover:bg-brand-primary group-hover:text-white transition-all duration-500 shadow-sm">
                    {index + 1}
                  </span>
                  <p className="text-[18px] leading-relaxed text-neutral-200 group-hover:text-white transition-colors pt-0.5 text-left font-light">
                    {step}
                  </p>
                </li>
              ))}
            </ol>
          </div>
        </div>
      </div>
    </MagicCard>
  );
}