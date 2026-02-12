import React from "react";
import {
  Trash2,
  ShoppingBag,
  Check,
  ListChecks,
  RotateCcw,
} from "lucide-react";
import { useTranslations } from "next-intl";
import { MagicButton } from "./MagicButton";
import { cn } from "@/lib/utils";

interface ShoppingListItem {
  id?: number;
  name: string;
  bought: boolean;
}

interface ShoppingListProps {
  items: ShoppingListItem[];
  onToggle: (id: number, bought: boolean) => void;
  onRemove: (id: number) => void;
  onClearBought?: () => void;
  onClearAll?: () => void;
}

export default function ShoppingList({
  items,
  onToggle,
  onRemove,
  onClearBought,
  onClearAll,
}: ShoppingListProps) {
  const t = useTranslations("ShoppingList");
  const boughtCount = items.filter((i) => i.bought).length;

  if (items.length === 0) {
    return (
      <div className="w-full max-w-2xl py-12 text-center mt-8 border border-white/5 rounded-3xl bg-gradient-to-br from-[#1A1A1A] to-[#202020]">
        <div className="text-neutral-700 mb-4">
          <ShoppingBag className="w-16 h-16 mx-auto opacity-20" />
        </div>
        <p className="text-neutral-500 font-medium">{t("empty")}</p>
      </div>
    );
  }

  return (
    <div className="w-full max-w-2xl p-6 md:p-10 mt-8 border border-white/5 rounded-[2rem] bg-[#121212] relative overflow-hidden shadow-2xl">
      <div className="absolute inset-0 bg-gradient-to-br from-[#1A1A1A] via-[#151515] to-[#121212] opacity-80" />
      <div className="relative z-10">
        <div className="flex flex-col gap-8 mb-12">
          <div className="space-y-3">
            <span className="inline-block bg-brand-primary/20 text-brand-primary px-3 py-1 rounded-md font-sans font-bold uppercase tracking-[0.2em] text-[9px] border border-brand-primary/30">
              {t("inventory")}
            </span>
            <h2 className="text-3xl md:text-5xl font-display font-bold text-white leading-tight tracking-tight">
              {t("shoppingList")}
            </h2>
          </div>

          <div className="flex flex-col sm:flex-row gap-4">
            {boughtCount > 0 && onClearBought && (
              <MagicButton
                onClick={onClearBought}
                variant="default"
                className="w-full sm:flex-1 h-14 order-1 sm:order-2"
              >
                <ListChecks className="mr-2 h-4 w-4" /> {t("clearBought")}
              </MagicButton>
            )}

            {onClearAll && (
              <MagicButton
                onClick={onClearAll}
                variant="glass"
                className="w-full sm:flex-1 h-14 order-2 sm:order-1 border-white/10 text-neutral-400 hover:text-white"
              >
                <RotateCcw className="mr-2 h-3 w-3" /> {t("clearAll")}
              </MagicButton>
            )}
          </div>
        </div>

        <ul className="space-y-2">
          {items.map((item) => (
            <li
              key={item.id}
              className="group flex items-center justify-between py-4 px-4 rounded-xl hover:bg-white/5 transition-all duration-300 border border-transparent hover:border-white/5"
            >
              <div
                className="flex items-center gap-5 cursor-pointer flex-1"
                onClick={() => onToggle(item.id!, !item.bought)}
              >
                <div className="relative flex items-center justify-center flex-shrink-0">
                  <input
                    type="checkbox"
                    checked={item.bought}
                    onChange={() => {}} // handled by parent div click
                    className="peer appearance-none w-6 h-6 rounded-lg border-2 border-white/10 checked:bg-brand-primary checked:border-brand-primary transition-all duration-300 cursor-pointer checkbox-animated"
                    aria-label={
                      item.bought
                        ? t("markNotBought", { name: item.name })
                        : t("markBought", { name: item.name })
                    }
                  />
                  <Check
                    className="h-3.5 w-3.5 text-white absolute pointer-events-none opacity-0 peer-checked:opacity-100 transition-none"
                    strokeWidth={3.5}
                  />
                </div>
                <span
                  className={cn(
                    "text-[17px] font-medium transition-all duration-500 select-none",
                    item.bought
                      ? "text-neutral-600 line-through"
                      : "text-neutral-200",
                  )}
                >
                  {item.name}
                </span>
              </div>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onRemove(item.id!);
                }}
                className="text-neutral-600 hover:text-red-400 opacity-0 group-hover:opacity-100 transition-all p-2 hover:bg-red-400/10 rounded-lg flex-shrink-0"
                aria-label={t("removeItem")}
              >
                <Trash2 className="h-5 w-5" />
              </button>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
