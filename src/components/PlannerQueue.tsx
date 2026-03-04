"use client";

import { PlannedRecipe } from "@/lib/repositories/PlannerRepository";
import { normalizeImageUrl } from "@/lib/utils";
import { Trash2 } from "lucide-react";
import { useTranslations } from "next-intl";
import RecipeTransitionLink from "@/components/RecipeTransitionLink";
import { RecipeMediaCard } from "@/components/RecipeMediaCard";

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

  return (
    <div className="w-full space-y-6 pb-12">
      {recipes.map((recipe, idx) => {
        const imageSrc = recipe.image_url
          ? normalizeImageUrl(recipe.image_url)
          : undefined;

        const card = (
          <div
            key={recipe.id}
            className="relative animate-fade-in group"
            style={{ animationDelay: `${idx * 100}ms` }}
          >
            {recipe.recipe_id ? (
              <RecipeTransitionLink
                recipe={{
                  id: recipe.recipe_id,
                  title: recipe.title,
                  image_url: recipe.image_url,
                }}
              >
                <RecipeMediaCard
                  imageSrc={imageSrc}
                  title={recipe.title}
                  metaText={t("plannedMeal")}
                  viewTransitionName={
                    recipe.recipe_id
                      ? `recipe-hero-${recipe.recipe_id}`
                      : undefined
                  }
                />
              </RecipeTransitionLink>
            ) : (
              <RecipeMediaCard
                imageSrc={imageSrc}
                title={recipe.title}
                metaText={t("plannedMeal")}
              />
            )}

            {/* Remove button — overlaid top-right */}
            <button
              onClick={() => onRemove(recipe.id!)}
              className="absolute top-3 right-3 z-20 w-9 h-9 rounded-xl bg-black/50 backdrop-blur-sm text-white/70 hover:text-red-400 hover:bg-red-400/20 flex items-center justify-center transition-all active:scale-90 focus:outline-none focus-visible:ring-2 focus-visible:ring-white"
              aria-label={t("remove")}
            >
              <Trash2 className="h-4 w-4" />
            </button>
          </div>
        );

        return card;
      })}
    </div>
  );
}
