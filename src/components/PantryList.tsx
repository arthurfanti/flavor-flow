"use client";

import React from "react";
import {
  PantryItem,
  PantryCategory,
} from "@/lib/repositories/PantryRepository";
import { Trash2, AlertTriangle, CheckCircle2 } from "lucide-react";
import { useTranslations } from "next-intl";

interface PantryListProps {
  items: PantryItem[];
  onDelete: (id: number) => void;
  onToggleLowStock: (id: number, current: boolean) => void;
}

export default function PantryList({
  items,
  onDelete,
  onToggleLowStock,
}: PantryListProps) {
  const t = useTranslations("Pantry");

  if (items.length === 0) {
    return (
      <div className="w-full py-12 text-center border border-white/5 rounded-3xl bg-gradient-to-br from-[#1A1A1A] to-[#202020]">
        <p className="text-neutral-500 font-medium italic">{t("empty")}</p>
      </div>
    );
  }

  // Group items by category
  const categories: PantryCategory[] = [
    "Produce",
    "Spices",
    "Pantry Staples",
    "Dairy",
    "Meat",
    "Other",
  ];
  const groupedItems = categories.reduce(
    (acc, cat) => {
      const catItems = items.filter((item) => item.category === cat);
      if (catItems.length > 0) acc[cat] = catItems;
      return acc;
    },
    {} as Record<string, PantryItem[]>,
  );

  return (
    <div className="w-full space-y-12 pb-12">
      {Object.entries(groupedItems).map(([category, catItems], idx) => (
        <section
          key={category}
          className="animate-fade-in"
          style={{ animationDelay: `${idx * 100}ms` }}
        >
          <div className="flex items-center gap-4 mb-6 px-2">
            <h3 className="text-[11px] font-sans font-bold uppercase tracking-[0.2em] text-neutral-500">
              {t(`categories.${category}`)}
            </h3>
            <div className="h-px bg-white/5 flex-grow" />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {catItems.map((item) => (
              <div
                key={item.id}
                className="p-5 border border-white/5 hover:border-brand-primary/20 transition-colors group rounded-2xl bg-gradient-to-br from-[#1A1A1A] to-[#202020]"
              >
                <div className="flex items-center justify-between">
                  <div className="flex flex-col gap-1">
                    <span className="text-lg font-medium text-white group-hover:text-brand-primary transition-colors">
                      {item.name}
                    </span>
                    {item.is_low_stock && (
                      <div className="flex items-center gap-1.5 text-brand-primary">
                        <AlertTriangle className="h-3 w-3" />
                        <span className="text-[9px] font-bold uppercase tracking-wider">
                          {t("lowStock")}
                        </span>
                      </div>
                    )}
                  </div>

                  <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button
                      onClick={() =>
                        onToggleLowStock(item.id!, item.is_low_stock)
                      }
                      className={cn(
                        "p-2 rounded-lg transition-all",
                        item.is_low_stock
                          ? "text-emerald-400 hover:bg-emerald-400/10"
                          : "text-neutral-500 hover:bg-white/5 hover:text-white",
                      )}
                      title={
                        item.is_low_stock ? t("markInStock") : t("markLowStock")
                      }
                    >
                      {item.is_low_stock ? (
                        <CheckCircle2 className="h-5 w-5" />
                      ) : (
                        <AlertTriangle className="h-5 w-5" />
                      )}
                    </button>
                    <button
                      onClick={() => onDelete(item.id!)}
                      className="p-2 text-neutral-500 hover:text-red-400 hover:bg-red-400/10 rounded-lg transition-all"
                      title={t("removeItem")}
                    >
                      <Trash2 className="h-5 w-5" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>
      ))}
    </div>
  );
}

function cn(...inputs: any[]) {
  return inputs.filter(Boolean).join(" ");
}
