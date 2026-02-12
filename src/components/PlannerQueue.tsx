"use client";

import { PlannedRecipe } from "@/lib/repositories/PlannerRepository";
import { normalizeImageUrl } from "@/lib/utils";
import { Trash2 } from "lucide-react";
import { useTranslations } from "next-intl";
import { Link } from "@/navigation";
import { MagicCard } from "@/components/MagicCard";

interface PlannerQueueProps {
  recipes: PlannedRecipe[];
  onRemove: (id: number) => void;
}

export default function PlannerQueue({ recipes, onRemove }: PlannerQueueProps) {
  const t = useTranslations("Planner");

  if (recipes.length === 0) {
    return (
      <div className="w-full py-12 text-center border border-white/5 rounded-2xl bg-gradient-to-br from-[#1A1A1A] to-[#202020]">
        <p className="text-neutral-500 font-medium italic">{t("empty")}</p>
      </div>
    );
  }

  const renderContent = (recipe: PlannedRecipe) => (
    <>
      <div className="w-full sm:w-48 h-40 sm:h-full overflow-hidden bg-white/5 relative group">
        {recipe.image_url ? (
          <img
            src={normalizeImageUrl(recipe.image_url)}
            alt={recipe.title}
            className="w-full h-full object-cover transition-all duration-700 group-hover:scale-110 brightness-[0.8]"
            onError={(e) => {
              (e.target as HTMLImageElement).style.display = "none";
            }}
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-brand-primary/20">
            <svg className="w-12 h-12" fill="currentColor" viewBox="0 0 20 20">
              <path
                fillRule="evenodd"
                d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z"
                clipRule="evenodd"
              />
            </svg>
          </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-r from-black/40 to-transparent sm:hidden" />
      </div>

      <div className="flex-grow p-6 flex flex-col justify-center overflow-hidden">
        <span className="text-[10px] font-sans font-bold uppercase tracking-[0.2em] text-brand-primary mb-2 block">
          {t("plannedMeal")}
        </span>
        <h3 className="text-2xl font-display font-bold text-white leading-tight line-clamp-2 group-hover:text-brand-primary transition-colors">
          {recipe.title}
        </h3>
      </div>
    </>
  );

  return (
    <div className="w-full space-y-6 pb-12">
      {recipes.map((recipe, idx) => (
        <MagicCard
          key={recipe.id}
          className="animate-fade-in group relative sm:h-40 overflow-hidden shadow-lg"
          style={{ animationDelay: `${idx * 100}ms` }}
        >
          <div className="flex flex-col sm:flex-row h-full">
            {recipe.recipe_id ? (
              <Link
                href={`/app/recipes/${recipe.recipe_id}`}
                className="flex flex-col sm:flex-row flex-grow min-w-0 h-full"
              >
                {renderContent(recipe)}
              </Link>
            ) : (
              <div className="flex flex-col sm:flex-row flex-grow min-w-0 h-full">
                {renderContent(recipe)}
              </div>
            )}

            <div className="p-4 flex items-center justify-end sm:border-l border-white/5 h-16 sm:h-full z-10 relative">
              <button
                onClick={() => onRemove(recipe.id!)}
                className="w-12 h-12 rounded-2xl text-neutral-500 hover:text-red-400 hover:bg-red-400/10 flex items-center justify-center transition-all active:scale-90"
                aria-label={t("remove")}
              >
                <Trash2 className="h-5 w-5" />
              </button>
            </div>
          </div>
        </MagicCard>
      ))}
    </div>
  );
}
