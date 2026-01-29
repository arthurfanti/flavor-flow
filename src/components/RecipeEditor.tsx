import React, { useState } from 'react';
import { useTranslations } from 'next-intl';

interface Recipe {
  title: string;
  ingredients: string[];
  instructions: string[];
  sourceUrl: string;
  image_url?: string;
}

interface RecipeEditorProps {
  recipe: Recipe;
  onSave: (updatedRecipe: Recipe) => void;
  onCancel: () => void;
}

export default function RecipeEditor({ recipe, onSave, onCancel }: RecipeEditorProps) {
  const t = useTranslations('RecipeEditor');
  const tc = useTranslations('Common');
  const [editedRecipe, setEditedRecipe] = useState<Recipe>({ ...recipe });

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEditedRecipe({ ...editedRecipe, title: e.target.value });
  };

  const handleIngredientChange = (index: number, value: string) => {
    const newIngredients = [...editedRecipe.ingredients];
    newIngredients[index] = value;
    setEditedRecipe({ ...editedRecipe, ingredients: newIngredients });
  };

  const handleInstructionChange = (index: number, value: string) => {
    const newInstructions = [...editedRecipe.instructions];
    newInstructions[index] = value;
    setEditedRecipe({ ...editedRecipe, instructions: newInstructions });
  };

  return (
    <div className="w-full max-w-2xl bg-white/10 rounded-[2rem] shadow-xl shadow-cyan-300/10 p-8 md:p-10 mt-8 animate-fade-in border border-white/20 backdrop-blur-md text-gray-900">
      <header className="mb-10">
        <span className="text-brand-yellow font-sans font-bold uppercase tracking-[0.2em] text-[10px] mb-2 block">{t('editingMode')}</span>
        <h2 className="text-4xl font-serif font-bold text-gray-900 tracking-tight">{t('title')}</h2>
      </header>
      
      <div className="space-y-8">
        <div>
          <label className="block text-sm font-sans font-bold uppercase tracking-widest text-gray-400 mb-3">{t('recipeTitle')}</label>
          <input
            type="text"
            value={editedRecipe.title}
            onChange={handleTitleChange}
            className="w-full p-5 rounded-2xl border border-white/20 focus:outline-none focus:ring-4 focus:ring-sky-300/40 bg-white/10 backdrop-blur-md shadow-[0_8px_30px_rgba(255,255,255,0.06)] transition-all text-xl font-medium text-gray-900 placeholder:text-gray-500"
          />
        </div>

        <div>
          <label className="block text-sm font-sans font-bold uppercase tracking-widest text-gray-400 mb-3">{t('ingredients')}</label>
          <div className="space-y-3">
            {editedRecipe.ingredients.map((ingredient, index) => (
              <input
                key={index}
                type="text"
                value={ingredient}
                onChange={(e) => handleIngredientChange(index, e.target.value)}
                className="w-full p-4 rounded-xl border border-gray-100 focus:outline-none focus:ring-4 focus:ring-brand-yellow/10 bg-gray-50/50 transition-all text-gray-700"
              />
            ))}
          </div>
        </div>

        <div>
          <label className="block text-sm font-sans font-bold uppercase tracking-widest text-gray-400 mb-3">{t('instructions')}</label>
          <div className="space-y-3">
            {editedRecipe.instructions.map((step, index) => (
              <textarea
                key={index}
                value={step}
                onChange={(e) => handleInstructionChange(index, e.target.value)}
                className="w-full p-4 rounded-xl border border-gray-100 focus:outline-none focus:ring-4 focus:ring-brand-yellow/10 bg-gray-50/50 transition-all text-gray-700 leading-relaxed"
                rows={2}
              />
            ))}
          </div>
        </div>
      </div>

      <div className="flex gap-4 pt-10 border-t border-gray-50 mt-10">
        <button
          onClick={onCancel}
          className="flex-1 p-5 rounded-2xl font-bold uppercase tracking-widest text-xs text-gray-400 bg-white border border-gray-100 hover:bg-gray-50 transition-all"
        >
          {tc('cancel')}
        </button>
        <button
          onClick={() => onSave(editedRecipe)}
          className="flex-1 p-5 rounded-2xl font-bold uppercase tracking-widest text-xs bg-brand-yellow text-black hover:bg-brand-yellow-dark shadow-lg shadow-brand-yellow/10 transition-all active:scale-95"
        >
          {tc('save')}
        </button>
      </div>
    </div>
  );
}
