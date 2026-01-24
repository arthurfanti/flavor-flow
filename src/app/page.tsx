"use client";

import AILoadingOverlay, { AIStage } from "@/components/AILoadingOverlay";
import { useAuth } from "@/components/AuthProvider";
import { MagicCard } from "@/components/MagicCard";
import RecipeListItem from "@/components/RecipeListItem";
import UrlInput from "@/components/UrlInput";
import { SupabasePantryRepository } from "@/lib/repositories/SupabasePantryRepository";
import { SupabasePlannerRepository } from "@/lib/repositories/SupabasePlannerRepository";
import { SupabaseRecipeRepository } from "@/lib/repositories/SupabaseRecipeRepository";
import { SupabaseShoppingListRepository } from "@/lib/repositories/SupabaseShoppingListRepository";
import { IngredientMatcher } from "@/lib/services/IngredientMatcher";
import { OpenRouterService } from "@/lib/services/OpenRouterService";
import { SupadataService } from "@/lib/services/SupadataService";
import { VideoAIExtractor } from "@/lib/services/VideoAIExtractor";
import { createSupabaseClient } from "@/lib/supabase/client";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useMemo, useState } from "react";
import { toast } from "sonner";

export default function Home() {
  const router = useRouter();
  const { session, loading: authLoading } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [aiStage, setAiStage] = useState<AIStage>("idle");
  const [recentRecipes, setRecentRecipes] = useState<any[]>([]);
  const [configError, setConfigError] = useState<string | null>(null);

  const extractor = useMemo(() => {
    try {
      const supadataKey = process.env.NEXT_PUBLIC_SUPADATA_API_KEY;
      const openRouterKey = process.env.NEXT_PUBLIC_OPENROUTER_API_KEY;

      if (!supadataKey || !openRouterKey) {
        throw new Error(
          "AI Extraction keys (Supadata/OpenRouter) are missing."
        );
      }

      return new VideoAIExtractor(
        new SupadataService(supadataKey),
        new OpenRouterService(openRouterKey)
      );
    } catch (e: any) {
      console.warn("AI Extractor could not be initialized:", e.message);
      return null;
    }
  }, []);

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
      };
    } catch (e: any) {
      setConfigError(e.message);
      return null;
    }
  }, [session?.user?.id, authLoading]);

  const refreshRecent = useCallback(async () => {
    if (!repos?.recipe) return;
    try {
      const latest = await repos.recipe.getLatest(3);
      setRecentRecipes(latest);
    } catch (error) {
      console.error("Failed to fetch recent recipes:", error);
    }
  }, [repos?.recipe]);

  useEffect(() => {
    refreshRecent();
  }, [refreshRecent]);

  const handleExtract = async (url: string) => {
    if (!repos || !extractor) {
      toast.error(
        "AI Extractor or Repositories not initialized. Check your API keys."
      );
      return;
    }
    setIsLoading(true);
    try {
      console.log("Flavor Flow: Initializing True AI Extraction...");
      const extracted = await extractor.extractFromUrl(url, (stage) =>
        setAiStage(stage)
      );
      console.log("Flavor Flow: AI Extraction successful:", extracted.title);

      console.log("Flavor Flow: Saving to Supabase...");
      const savedRecipe = await repos.recipe.addRecipe(extracted);
      console.log("Flavor Flow: Save successful.");

      toast.success("Recipe extracted and saved!");
      router.push(`/recipes/${savedRecipe.id}`);
    } catch (error: any) {
      console.error(
        "Flavor Flow Error Object:",
        JSON.stringify(error, Object.getOwnPropertyNames(error))
      );
      // More user-friendly error message
      const msg =
        error.message === "Failed to fetch"
          ? "Network error: Could not reach the server. Please check your internet connection or Supabase settings."
          : error.message || "An unexpected error occurred.";
      toast.error(`Extraction Error: ${msg}`);
    } finally {
      setIsLoading(false);
      setAiStage("idle");
    }
  };

  if (configError) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen p-4 text-center">
        <h1 className="text-2xl font-bold text-red-600 mb-4">
          Configuration Error
        </h1>
        <p className="text-gray-700">{configError}</p>
        <p className="text-sm text-gray-500 mt-4">
          Please check your environment variables.
        </p>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center w-full animate-fade-in text-gray-900 relative">
      <AILoadingOverlay stage={aiStage} />

      <div className="w-full h-56 rounded-[2rem] overflow-hidden mb-10 shadow-2xl relative group border border-white/5">
        <img
          src="https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&q=80&w=1000"
          alt="Fresh food"
          className="w-full h-full object-cover group-hover:scale-105 transition-all duration-1000 ease-out brightness-[0.7]"
          onError={(e) => {
            (e.target as HTMLImageElement).style.display = "none";
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
        <div className="absolute bottom-8 left-8">
          <span className="text-brand-primary font-sans font-bold uppercase tracking-[0.2em] text-[10px] mb-2 block">
            Premium Kitchen
          </span>
          <h1 className="text-4xl font-display font-bold text-white tracking-tight">
            Discover
          </h1>
        </div>
      </div>

      <header className="text-center mb-12 max-w-lg">
        <p className="text-2xl text-neutral-300 font-medium leading-relaxed">
          Transform your cooking inspiration into actionable lists.
        </p>
        <div className="w-12 h-1 bg-brand-primary mx-auto mt-6 rounded-full shadow-[0_0_12px_rgba(224,93,68,0.4)]" />
      </header>

      <MagicCard
        className="w-full max-w-2xl inset-0 border-white/5 shadow-2xl"
        gradientColor="#E05D44"
        variant="neon"
      >
        <div className="p-6">
          <h2 className="text-2xl font-display font-bold text-white mb-8 p-4 text-center">
            Start your recipe
          </h2>
          <UrlInput onExtract={handleExtract} isLoading={isLoading} />

          <div className="mt-10 px-4 py-6 border-t border-white/5">
            <p className="text-xs text-neutral-500 text-center uppercase tracking-widest font-medium">
              YouTube • Instagram • TikTok
            </p>
          </div>
        </div>
      </MagicCard>

      {!isLoading && recentRecipes.length > 0 && (
        <div className="w-full mt-16 animate-slide-up">
          <div className="flex items-center justify-between mb-8 px-2">
            <h2 className="text-sm font-sans font-bold uppercase tracking-[0.2em] text-neutral-500">
              Recent Extractions
            </h2>
            <Link
              href="/recipes"
              className="text-[10px] font-sans font-bold uppercase tracking-widest text-brand-primary hover:text-brand-primary/80 transition-colors"
            >
              View All
            </Link>
          </div>

          <div className="grid grid-cols-1 gap-4">
            {recentRecipes.map((r, i) => (
              <div
                key={r.id || `${r.sourceUrl}-${i}`}
                className="cursor-pointer active:scale-[0.98] transition-transform"
                onClick={() => router.push(`/recipes/${r.id}`)}
              >
                <RecipeListItem recipe={r} />
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
