"use client";

import React from "react";
import { Link } from "@/navigation";
import { getStorageUrl, normalizeImageUrl } from "@/lib/utils";

interface RecipePreviewData {
  id: number | string;
  title: string;
  image_url?: string;
  storage_path?: string;
}

interface RecipeTransitionLinkProps {
  recipe: RecipePreviewData;
  children: React.ReactNode;
  className?: string;
}

const STORAGE_KEY = "recipe-transition-preview";

/**
 * Stores preview data for the recipe being navigated to,
 * so the detail page can immediately render the hero image
 * before the full data loads.
 */
export function storeRecipePreview(recipe: RecipePreviewData) {
  const imageUrl = recipe.storage_path
    ? getStorageUrl(recipe.storage_path)
    : recipe.image_url
      ? normalizeImageUrl(recipe.image_url)
      : null;

  sessionStorage.setItem(
    STORAGE_KEY,
    JSON.stringify({
      id: recipe.id,
      title: recipe.title,
      imageUrl,
    }),
  );
}

/**
 * Reads and clears the stored preview data.
 */
export function getRecipePreview(): {
  id: string;
  title: string;
  imageUrl: string | null;
} | null {
  try {
    const data = sessionStorage.getItem(STORAGE_KEY);
    if (!data) return null;
    sessionStorage.removeItem(STORAGE_KEY);
    return JSON.parse(data);
  } catch {
    return null;
  }
}

/**
 * A Link wrapper that stores recipe preview data in sessionStorage
 * before navigating. This lets the recipe detail page show the hero
 * image immediately while the rest of the content loads.
 */
export default function RecipeTransitionLink({
  recipe,
  children,
  className,
}: RecipeTransitionLinkProps) {
  const handleClick = () => {
    storeRecipePreview(recipe);
  };

  return (
    <Link
      href={`/app/recipes/${recipe.id}`}
      className={className}
      onClick={handleClick}
    >
      {children}
    </Link>
  );
}
