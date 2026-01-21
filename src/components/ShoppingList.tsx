import React from 'react';
import { MagicCard } from './MagicCard';
import { Trash2, ShoppingBag, Check } from 'lucide-react';

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
      <MagicCard 
        className="w-full max-w-2xl py-12 text-center mt-8 border-white/5"
        gradientColor="#E05D44"
        variant="neon"
      >
        <div className="text-neutral-700 mb-4">
          <ShoppingBag className="w-16 h-16 mx-auto opacity-20" />
        </div>
        <p className="text-neutral-500 font-medium">Your shopping list is empty</p>
      </MagicCard>
    );
  }

  return (
    <MagicCard 
      className="w-full max-w-2xl p-6 md:p-10 mt-8 border-white/5 overflow-hidden" 
      variant="neon"
      gradientColor="#E05D44"
    >
      <div className="flex flex-col gap-1 mb-10 px-1">
        <span className="text-[10px] font-sans font-bold uppercase tracking-[0.2em] text-brand-primary block">Inventory</span>
        <h2 className="text-4xl font-display font-bold text-white">Shopping List</h2>
      </div>
      
      <ul className="space-y-1">
        {items.map((item) => (
          <li key={item.id} className="group flex items-center justify-between py-4 px-2 rounded-xl hover:bg-white/5 transition-all duration-300">
            <div className="flex items-center gap-5">
              <div 
                role="checkbox"
                aria-checked={item.bought}
                aria-label={`Mark ${item.name} as ${item.bought ? 'not bought' : 'bought'}`}
                className={cn(
                  "w-6 h-6 rounded-lg border-2 flex items-center justify-center cursor-pointer transition-all duration-300",
                  item.bought ? "bg-brand-primary border-brand-primary" : "border-white/10 hover:border-brand-primary/50"
                )}
                onClick={() => onToggle(item.id!, !item.bought)}
              >
                {item.bought && <Check className="h-4 w-4 text-white" />}
              </div>
              <span className={cn(
                "text-[17px] font-medium transition-all duration-500",
                item.bought ? "text-neutral-600 line-through" : "text-neutral-200"
              )}>
                {item.name}
              </span>
            </div>
            <button
              onClick={() => onRemove(item.id!)}
              className="text-neutral-600 hover:text-red-400 opacity-0 group-hover:opacity-100 transition-all p-2 hover:bg-red-400/10 rounded-lg"
              aria-label="Remove item"
            >
              <Trash2 className="h-5 w-5" />
            </button>
          </li>
        ))}
      </ul>
    </MagicCard>
  );
}

function cn(...inputs: any[]) {
    return inputs.filter(Boolean).join(' ');
}
