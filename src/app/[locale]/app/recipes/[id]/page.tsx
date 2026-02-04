"use client";

import { useAuth } from "@/components/AuthProvider";
import RecipeEditor from "@/components/RecipeEditor";
import RecipePreview from "@/components/RecipePreview";
import { SupabasePantryRepository } from "@/lib/repositories/SupabasePantryRepository";
import { SupabasePlannerRepository } from "@/lib/repositories/SupabasePlannerRepository";
import { SupabaseProfileRepository } from "@/lib/repositories/SupabaseProfileRepository";
import { SupabaseRecipeRepository } from "@/lib/repositories/SupabaseRecipeRepository";
import { SupabaseShoppingListRepository } from "@/lib/repositories/SupabaseShoppingListRepository";
import { IngredientMatcher } from "@/lib/services/IngredientMatcher";
import { createSupabaseClient } from "@/lib/supabase/client";
import { useRouter } from "@/navigation";
import { useTranslations } from "next-intl";
import { useParams } from "next/navigation";
import { useEffect, useMemo, useRef, useState } from "react";
import { translateRecipeAction } from "@/app/actions/ai";
import { toast } from "sonner";

export default function RecipeDetailPage() {
  const t = useTranslations("RecipeDetail");
  const params = useParams();
  const id = params?.id as string;
  const router = useRouter();
  const { session, loading: authLoading } = useAuth();
  const [recipe, setRecipe] = useState<any | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const repos = useMemo(() => {
    if (authLoading) return null;
    try {
      const supabase = createSupabaseClient();
      const userId = session?.user?.id;
      return {
        recipe: new SupabaseRecipeRepository(supabase, userId),
        shoppingList: userId
          ? new SupabaseShoppingListRepository(supabase, userId)
          : null,
        planner: userId
          ? new SupabasePlannerRepository(supabase, userId)
          : null,
        pantry: userId ? new SupabasePantryRepository(supabase, userId) : null,
        profile: userId ? new SupabaseProfileRepository(supabase) : null,
      };
    } catch (e: any) {
      console.error(e);
      return null;
    }
  }, [session?.user?.id, authLoading]);

  /* Removed translationService useMemo as logic is moved to server action */

  const translationInProgress = useRef(false);

  useEffect(() => {
    const fetchAndTranslate = async () => {
      if (!repos || !id || translationInProgress.current) return;
      try {
        let preferredLocale = "en";
        if (session?.user?.id && repos.profile) {
          const profile = await repos.profile.getProfile(session.user.id);
          if (profile?.preferred_locale) {
            preferredLocale = profile.preferred_locale;
          }
        }

        const data = await repos.recipe.getById(id, preferredLocale);
        if (!data) {
          setError("Recipe not found");
          setIsLoading(false);
          return;
        }

        const sourceLocale = data.source_locale || "en";
        const existingTranslations = data.translations || [];

        // Check if translation is needed
        if (
          sourceLocale !== preferredLocale &&
          existingTranslations.length === 0
        ) {
          console.log("RecipeDetailPage: Triggering AI translation via Server Action...");
          translationInProgress.current = true;

          const translated = await translateRecipeAction(
            {
              title: data.title,
              ingredients: data.ingredients,
              instructions: data.instructions,
            },
            preferredLocale,
          );

          if (!translated) {
            console.error("RecipeDetailPage: AI translation returned undefined");
            toast.error("Failed to translate recipe automatically.");
            setRecipe(data);
            return;
          }

          await repos.recipe.saveTranslation(
            Number(id),
            preferredLocale,
            translated,
          );

          setRecipe({ ...data, ...translated });
        } else {
          setRecipe(data);
        }
      } catch (err) {
        console.error(err);
        setError("Failed to load recipe");
      } finally {
        setIsLoading(false);
        translationInProgress.current = false;
      }
    };

    fetchAndTranslate();
  }, [repos, id, session?.user?.id]);

  const handleAddToList = async (ingredients: string[]) => {
    if (!repos?.shoppingList) return;
    try {
      await repos.shoppingList.addItems(
        ingredients.map((ing) => ({ name: ing, bought: false })),
      );
      toast.success("Added ingredients to shopping list");
    } catch (error) {
      console.error("Failed to add to shopping list:", error);
      toast.error("Failed to add items to shopping list.");
    }
  };

  const handleAddToPlanner = async (targetRecipe: any) => {
    if (!repos?.planner || !repos.pantry || !repos.shoppingList) return;
    try {
      await repos.planner.addToQueue({
        title: targetRecipe.title,
        recipe_id: targetRecipe.id,
        source_url: targetRecipe.source_url || targetRecipe.sourceUrl || "",
        image_url: targetRecipe.image_url || targetRecipe.imageUrl,
      });

      const pantryItems = await repos.pantry.getItems();
      const matcher = new IngredientMatcher();

      const missingIngredients = (targetRecipe.ingredients || []).filter(
        (ing: string) => {
          const found = pantryItems.find((p) => matcher.isMatch(p.name, ing));
          return !found;
        },
      );

      if (missingIngredients.length > 0) {
        await repos.shoppingList.addItems(
          missingIngredients.map((ing: string) => ({
            name: ing,
            bought: false,
          })),
        );
      }

      toast.success("Added to planner");
      router.push("/app/planner");
    } catch (error) {
      console.error("Failed to add to planner:", error);
      toast.error("Failed to add to planner. Please try again.");
    }
  };

  const handleSave = async (updatedRecipe: any) => {
    if (!repos?.recipe || !id) return;
    try {
      await repos.recipe.updateRecipe(Number(id), updatedRecipe);
      setRecipe(updatedRecipe);
      setIsEditing(false);
      toast.success("Recipe updated successfully");
    } catch (error) {
      console.error("Failed to update recipe:", error);
      toast.error("Failed to update recipe");
    }
  };

  if (isLoading)
    return (
      <div className="flex justify-center py-20">
        <div className="animate-spin h-8 w-8 border-4 border-brand-yellow border-t-transparent rounded-full" />
      </div>
    );
  if (error)
    return (
      <div className="p-8 text-center text-red-500 font-medium">{error}</div>
    );
  if (!recipe) return null;

  return (
    <div className="flex flex-col items-center w-full animate-fade-in pb-20">
      {!isEditing ? (
        <div className="w-full max-w-3xl flex flex-col items-center">
          <RecipePreview
            recipe={recipe}
            onAddToList={handleAddToList}
            onAddToPlanner={handleAddToPlanner}
          />
          <div className="mt-6 flex justify-center">
            <button
              onClick={() => setIsEditing(true)}
              className="text-neutral-500 hover:text-white font-medium underline transition-colors"
            >
              {t("editRecipe")}
            </button>
          </div>
        </div>
      ) : (
        <div className="w-full max-w-3xl">
          <RecipeEditor
            recipe={recipe}
            onSave={handleSave}
            onCancel={() => setIsEditing(false)}
          />
        </div>
      )}
    </div>
  );
}
