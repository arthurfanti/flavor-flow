"use client";

import { useAuth } from "@/components/AuthProvider";
import RecipeEditor from "@/components/RecipeEditor";
import RecipePreview from "@/components/RecipePreview";
import { Skeleton } from "@/components/Skeleton";
import { getRecipePreview } from "@/components/RecipeTransitionLink";
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
import { ViewTransition } from "react";
import { translateRecipeAction } from "@/app/actions/ai";
import { toast } from "sonner";
import { ChefHat } from "lucide-react";

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

  // Read preview data from sessionStorage (set by RecipeTransitionLink)
  const previewRef = useRef(getRecipePreview());
  const preview = previewRef.current;

  const repos = useMemo(() => {
    if (authLoading) return null;
    try {
      const supabase = createSupabaseClient();
      const userId = session?.user?.id;
      return {
        recipe: new SupabaseRecipeRepository(supabase),
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
          console.log(
            "RecipeDetailPage: Triggering AI translation via Server Action...",
          );
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
            console.error(
              "RecipeDetailPage: AI translation returned undefined",
            );
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
            recipe_id: targetRecipe.id,
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

  if (error)
    return (
      <div className="p-8 text-center text-red-500 font-medium">{error}</div>
    );

  // Loading state: show hero image from preview + skeleton content
  if (isLoading) {
    return (
      <div className="flex flex-col items-center w-full pb-20">
        <div className="w-full flex flex-col items-center">
          {/* Hero Image — available immediately from the preview */}
          {preview?.imageUrl && (
            <div className="fixed top-0 left-0 w-full h-[50vh] z-0 overflow-hidden">
              <ViewTransition name={`recipe-hero-${id}`}>
                <img
                  src={preview.imageUrl}
                  alt={preview.title || ""}
                  className="w-full h-full object-cover brightness-[0.85]"
                />
              </ViewTransition>
              <div className="absolute top-8 left-8 z-10">
                <div className="glass px-4 py-2 rounded-full flex items-center gap-2">
                  <ChefHat className="h-4 w-4 text-brand-primary" />
                  <span className="text-[10px] font-bold uppercase tracking-widest text-white">
                    {t("aiKitchen")}
                  </span>
                </div>
              </div>
            </div>
          )}

          {/* Spacer */}
          <div
            className={
              preview?.imageUrl
                ? "h-[45vh] w-full pointer-events-none"
                : "h-8 w-full"
            }
          />

          {/* Skeleton Content */}
          <div className="w-full bg-[#121212] rounded-t-[2rem] relative z-10 px-6 md:px-12 pt-12 pb-32 shadow-[0_-12px_24px_rgba(0,0,0,0.2)] border-t border-white/5">
            <div className="w-full max-w-2xl mx-auto">
              <div className="flex flex-col gap-8 mb-12">
                <div className="space-y-4">
                  <Skeleton variant="text" className="w-24 h-5" />
                  <Skeleton variant="text" className="w-3/4 h-10" />
                  <Skeleton variant="text" className="w-1/2 h-10" />
                </div>
                <div className="flex flex-col sm:flex-row gap-4">
                  <Skeleton variant="card" className="h-14 flex-1 rounded-xl" />
                  <Skeleton variant="card" className="h-14 flex-1 rounded-xl" />
                </div>
              </div>
              <div className="grid lg:grid-cols-[1fr_1.8fr] gap-16">
                <div className="space-y-6">
                  <Skeleton variant="text" className="w-32 h-4" />
                  {[...Array(6)].map((_, i) => (
                    <Skeleton key={i} variant="text" className="w-full h-5" />
                  ))}
                </div>
                <div className="space-y-8">
                  <Skeleton variant="text" className="w-32 h-4" />
                  {[...Array(4)].map((_, i) => (
                    <div key={i} className="flex gap-8">
                      <Skeleton
                        variant="text"
                        className="w-8 h-8 rounded-full flex-shrink-0"
                      />
                      <div className="flex-1 space-y-2">
                        <Skeleton variant="text" className="w-full h-5" />
                        <Skeleton variant="text" className="w-3/4 h-5" />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!recipe) return null;

  return (
    <div className="flex flex-col items-center w-full animate-fade-in pb-20">
      {!isEditing ? (
        <div className="w-full max-w-3xl flex flex-col items-center">
          <RecipePreview
            recipe={recipe}
            recipeId={id}
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
