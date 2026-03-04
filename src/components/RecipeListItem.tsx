import React from "react";
import { ViewTransition } from "react";
import { normalizeImageUrl, getStorageUrl } from "@/lib/utils";
import { useTranslations } from "next-intl";
import { RecipeMediaCard } from "./RecipeMediaCard";
import { UtensilsCrossed } from "lucide-react";

interface RecipeListItemProps {
  recipe: any;
  recipeId?: number | string;
}

export default function RecipeListItem({
  recipe,
  recipeId,
}: RecipeListItemProps) {
  const t = useTranslations("Common");
  const transitionName = recipeId ? `recipe-hero-${recipeId}` : undefined;

  const imageSrc = recipe.storage_path
    ? getStorageUrl(recipe.storage_path)
    : recipe.image_url
      ? normalizeImageUrl(recipe.image_url)
      : undefined;

  const ingredientCount = recipe.ingredients?.length ?? 0;
  const metaText = t("ingredientsCount", { count: ingredientCount });

  const metaIcon = (
    <UtensilsCrossed
      className="w-4 h-4 flex-shrink-0"
      strokeWidth={1.75}
      aria-hidden="true"
    />
  );

  return (
    <RecipeMediaCard
      imageSrc={imageSrc}
      title={recipe.title}
      metaIcon={metaIcon}
      metaText={metaText}
      viewTransitionName={transitionName}
    />
  );
}
