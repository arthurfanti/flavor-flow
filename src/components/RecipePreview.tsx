import React, { useState, useRef } from 'react';
import { normalizeImageUrl, getStorageUrl } from '@/lib/utils';
import { MagicCard } from './MagicCard';
import { MagicButton } from './MagicButton';
import { ShoppingCart, Calendar, Check, ChefHat } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { motion, useScroll, useTransform, useSpring } from 'framer-motion';

interface Recipe {
  title: string;
  ingredients: string[];
  instructions: string[];
  sourceUrl: string;
  image_url?: string;
  storage_path?: string;
}

interface RecipePreviewProps {
  recipe: Recipe | null;
  onAddToList: (ingredients: string[]) => void;
  onAddToPlanner: (recipe: Recipe) => void;
}

export default function RecipePreview({ recipe, onAddToList, onAddToPlanner }: RecipePreviewProps) {
  const t = useTranslations('RecipeDetail');
  const [isAddingToList, setIsAddingToList] = useState(false);
  const [isAddingToPlanner, setIsAddingToPlanner] = useState(false);
  const [addedToList, setAddedToList] = useState(false);
  const [addedToPlanner, setAddedToPlanner] = useState(false);
  
  const { scrollY } = useScroll();
  const smoothScrollY = useSpring(scrollY, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001
  });

  const heroOpacity = useTransform(smoothScrollY, [0, 300], [1, 0.4]);
  const heroScale = useTransform(smoothScrollY, [0, 300], [1, 1.1]);

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
    <div className="w-full flex flex-col items-center animate-fade-in text-left">
      {/* Hero Image Section: Fixed & Full-bleed */}
      {recipe.image_url && (
        <motion.div 
          style={{ opacity: heroOpacity, scale: heroScale, transformOrigin: 'top center' }}
          className="fixed top-0 left-0 w-full h-[50vh] z-0 overflow-hidden"
        >
          <img
            src={recipe.storage_path ? getStorageUrl(recipe.storage_path) : normalizeImageUrl(recipe.image_url)}
            alt={recipe.title}
            className="w-full h-full object-cover brightness-[0.85]"
          />
          <div className="absolute top-8 left-8 z-10">
            <div className="glass px-4 py-2 rounded-full flex items-center gap-2">
              <ChefHat className="h-4 w-4 text-brand-primary" />
              <span className="text-[10px] font-bold uppercase tracking-widest text-white">{t('aiKitchen')}</span>
            </div>
          </div>
        </motion.div>
      )}

      {/* Spacer to push content down below the fixed hero */}
      <div className="h-[45vh] w-full pointer-events-none" />

      {/* Content Card: Overlapping Hero */}
      <div className="w-full bg-[#121212] rounded-t-[2rem] relative z-10 px-6 md:px-12 pt-12 pb-32 shadow-[0_-12px_24px_rgba(0,0,0,0.2)] border-t border-white/5 animate-fade-in">
        <div className="w-full max-w-2xl mx-auto">
          <div className="flex flex-col gap-8 mb-12">
            <div className="space-y-3">
              <span className="inline-block bg-brand-primary/20 text-brand-primary px-3 py-1 rounded-md font-sans font-bold uppercase tracking-[0.2em] text-[9px] border border-brand-primary/30">
                {t('premiumRecipe')}
              </span>
              <h2 className="text-3xl md:text-5xl font-display font-bold text-white leading-tight tracking-tight">
                {recipe.title}
              </h2>
            </div>

                      <div className="flex flex-col sm:flex-row gap-4">
                        <MagicButton
                          onClick={handleAddToPlanner}
                          disabled={isAddingToPlanner || addedToPlanner}
                          variant={addedToPlanner ? "glass" : "default"}
                          className="w-full sm:flex-1 h-14 order-1 sm:order-2"
                        >
                          {isAddingToPlanner ? (
                            <div className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full" />
                          ) : addedToPlanner ? (
                            <><Check className="h-4 w-4 text-emerald-400" /> {t('planned')}</>
                          ) : (
                            <><Calendar className="h-4 w-4" /> {t('addToPlanner')}</>
                          )}
                        </MagicButton>
            
                        <MagicButton
                          onClick={handleAddToList}
                          disabled={isAddingToList || addedToList}
                          variant={addedToList ? "glass" : "glass"}
                          className="w-full sm:flex-1 h-14 order-2 sm:order-1 border-white/10"
                        >
                          {isAddingToList ? (
                            <div className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full" />
                          ) : addedToList ? (
                            <><Check className="h-4 w-4 text-emerald-400" /> {t('added')}</>
                          ) : (
                            <><ShoppingCart className="h-4 w-4" /> {t('addToList')}</>
                          )}
                        </MagicButton>
                      </div>          </div>

          <div className="grid lg:grid-cols-[1fr_1.8fr] gap-16">
            <div className="space-y-8">
              <div className="flex items-center gap-3 border-b border-white/5 pb-4">
                <h3 className="text-[11px] font-sans font-bold text-neutral-500 uppercase tracking-[0.2em]">{t('ingredients')}</h3>
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
              <h3 className="text-[11px] font-sans font-bold text-neutral-500 uppercase tracking-[0.2em] border-b border-white/5 pb-4">{t('preparation')}</h3>
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
      </div>
    </div>
  );
}