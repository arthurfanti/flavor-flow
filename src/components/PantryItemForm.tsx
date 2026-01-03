'use client';

import React, { useState } from 'react';
import { PantryItem, PantryCategory } from '@/lib/repositories/PantryRepository';

interface PantryItemFormProps {
  initialData?: Partial<PantryItem>;
  onSave: (data: Partial<PantryItem>) => void;
  onCancel: () => void;
}

const categories: PantryCategory[] = ['Produce', 'Spices', 'Pantry Staples', 'Dairy', 'Meat', 'Other'];

export default function PantryItemForm({ initialData, onSave, onCancel }: PantryItemFormProps) {
  const [name, setName] = useState(initialData?.name || '');
  const [category, setCategory] = useState<PantryCategory>(initialData?.category || 'Pantry Staples');
  const [isLowStock, setIsLowStock] = useState(initialData?.is_low_stock || false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({ name, category, is_low_stock: isLowStock });
  };

  return (
    <form onSubmit={handleSubmit} className="w-full space-y-8 animate-fade-in">
      <div className="space-y-6">
        <div>
          <label className="block text-sm font-sans font-bold uppercase tracking-widest text-gray-400 mb-2">
            Item Name
          </label>
          <input
            type="text"
            required
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="e.g. Olive Oil"
            className="w-full p-5 rounded-2xl border border-gray-100 focus:outline-none focus:ring-4 focus:ring-brand-yellow/20 bg-white shadow-sm transition-all text-lg font-medium text-gray-700"
          />
        </div>

        <div>
          <label htmlFor="pantry-category" className="block text-sm font-sans font-bold uppercase tracking-widest text-gray-400 mb-2">
            Category
          </label>
          <select
            id="pantry-category"
            value={category}
            onChange={(e) => setCategory(e.target.value as PantryCategory)}
            className="w-full p-5 rounded-2xl border border-gray-100 focus:outline-none focus:ring-4 focus:ring-brand-yellow/20 bg-white shadow-sm transition-all text-lg font-medium text-gray-700 appearance-none"
          >
            {categories.map(cat => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
          </select>
        </div>

        <div className="flex items-center justify-between p-5 bg-white rounded-2xl border border-gray-50 shadow-sm">
          <span className="text-lg font-medium text-gray-700">Mark as Low Stock</span>
          <button
            type="button"
            onClick={() => setIsLowStock(!isLowStock)}
            className={`w-14 h-8 rounded-full transition-colors relative ${isLowStock ? 'bg-brand-yellow' : 'bg-gray-200'}`}
          >
            <div className={`absolute top-1 w-6 h-6 bg-white rounded-full transition-all ${isLowStock ? 'left-7' : 'left-1'}`} />
          </button>
        </div>
      </div>

      <div className="flex gap-4 pt-4">
        <button
          type="button"
          onClick={onCancel}
          className="flex-1 p-5 rounded-2xl font-bold uppercase tracking-widest text-xs text-gray-400 bg-white border border-gray-100 hover:bg-gray-50 transition-all"
        >
          Cancel
        </button>
        <button
          type="submit"
          className="flex-1 p-5 rounded-2xl font-bold uppercase tracking-widest text-xs bg-brand-yellow text-black hover:bg-brand-yellow-dark shadow-lg shadow-brand-yellow/10 transition-all active:scale-95"
        >
          Save Item
        </button>
      </div>
    </form>
  );
}
