import React from 'react';

interface ShoppingListItem {
  id?: number;
  name: string;
  bought: boolean;
}

interface ShoppingListProps {
  items: ShoppingListItem[];
  onToggle: (id: number, bought: boolean) => void;
  onRemove: (id: number) => void;
}

export default function ShoppingList({ items, onToggle, onRemove }: ShoppingListProps) {
  if (items.length === 0) {
    return (
      <div className="w-full max-w-2xl bg-white/10 rounded-3xl shadow-xl shadow-gray-200/50 p-12 text-center mt-8">
        <div className="text-gray-400 mb-4">
          <svg className="w-16 h-16 mx-auto opacity-20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
          </svg>
        </div>
        <p className="text-gray-500 font-medium">Your shopping list is empty</p>
      </div>
    );
  }

  return (
    <div className="w-full max-w-2xl bg-white/10 rounded-3xl shadow-xl shadow-cyan-300/10 p-6 md:p-8 mt-8 border border-white/20 backdrop-blur-md text-gray-900">
      <span className="text-[10px] font-sans font-bold uppercase tracking-[0.2em] text-brand-yellow-dark mb-2 block px-1">Inventory</span>
      <h2 className="text-3xl font-serif font-bold text-gray-900 mb-8 px-1">Shopping List</h2>
      <ul className="divide-y divide-gray-50">
        {items.map((item) => (
          <li key={item.id} className="py-5 flex items-center justify-between group px-1">
            <div className="flex items-center gap-5">
              <div className="relative flex items-center">
                <input
                  type="checkbox"
                  checked={item.bought}
                  onChange={(e) => onToggle(item.id!, e.target.checked)}
                  className="peer w-6 h-6 rounded-lg border-2 border-gray-100 text-brand-yellow focus:ring-brand-yellow cursor-pointer transition-all checked:border-brand-yellow"
                />
              </div>
              <span className={`text-lg font-medium transition-all duration-500 ${item.bought ? 'text-gray-300 line-through' : 'text-gray-700'}`}>
                {item.name}
              </span>
            </div>
            <button
              onClick={() => onRemove(item.id!)}
              className="text-gray-400 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity p-2"
              aria-label="Remove item"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}
