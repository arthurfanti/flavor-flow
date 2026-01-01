import React, { useState } from 'react';

interface Recipe {
  title: string;
  ingredients: string[];
  instructions: string[];
  sourceUrl: string;
}

interface RecipeEditorProps {
  recipe: Recipe;
  onSave: (updatedRecipe: Recipe) => void;
  onCancel: () => void;
}

export default function RecipeEditor({ recipe, onSave, onCancel }: RecipeEditorProps) {
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
    <div className="w-full max-w-2xl bg-white rounded-3xl shadow-xl shadow-gray-200/50 p-6 md:p-8 mt-8">
      <h2 className="text-2xl font-bold mb-4">Edit Recipe</h2>
      
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700">Title</label>
        <input
          type="text"
          value={editedRecipe.title}
          onChange={handleTitleChange}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-yellow-400 focus:ring focus:ring-yellow-400 focus:ring-opacity-50 p-2 border"
        />
      </div>

      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700">Ingredients</label>
        {editedRecipe.ingredients.map((ingredient, index) => (
          <input
            key={index}
            type="text"
            value={ingredient}
            onChange={(e) => handleIngredientChange(index, e.target.value)}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-yellow-400 focus:ring focus:ring-yellow-400 focus:ring-opacity-50 p-2 border mb-2"
          />
        ))}
      </div>

      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-700">Instructions</label>
        {editedRecipe.instructions.map((step, index) => (
          <textarea
            key={index}
            value={step}
            onChange={(e) => handleInstructionChange(index, e.target.value)}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-yellow-400 focus:ring focus:ring-yellow-400 focus:ring-opacity-50 p-2 border mb-2"
            rows={2}
          />
        ))}
      </div>

      <div className="flex justify-end gap-3">
        <button
          onClick={onCancel}
          className="px-4 py-2 rounded-lg text-gray-600 hover:bg-gray-100 font-medium"
        >
          Cancel
        </button>
        <button
          onClick={() => onSave(editedRecipe)}
          className="px-4 py-2 rounded-lg bg-yellow-400 text-black hover:bg-yellow-500 font-semibold shadow-sm"
        >
          Save
        </button>
      </div>
    </div>
  );
}
