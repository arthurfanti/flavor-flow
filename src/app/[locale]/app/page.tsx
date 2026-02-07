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
import { createSupabaseClient } from "@/lib/supabase/client";
import { useRouter } from "@/navigation";
import { useTranslations, useLocale } from "next-intl";
import { useCallback, useEffect, useMemo, useState } from "react";
import { extractRecipeAction } from "@/app/actions/ai";
import { toast } from "sonner";
import { motion, useScroll, useTransform, useSpring } from "framer-motion";

export default function Home() {
  const t = useTranslations("Home");
  const tCommon = useTranslations("Common");
  const locale = useLocale();
  const router = useRouter();
  const { session, loading: authLoading } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [aiStage, setAiStage] = useState<AIStage>("idle");
  const [recentRecipes, setRecentRecipes] = useState<any[]>([]);

  const { scrollY } = useScroll();
  const smoothScrollY = useSpring(scrollY, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001
  });

  const heroOpacity = useTransform(smoothScrollY, [0, 300], [1, 0.4]);
  const heroScale = useTransform(smoothScrollY, [0, 300], [1, 1.1]);

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
      console.error(e.message);
      return null;
    }
  }, [session?.user?.id, authLoading]);

  const refreshRecent = useCallback(async () => {
    if (!repos?.recipe) return;
    try {
      const latest = await repos.recipe.getLatest(3, locale);
      setRecentRecipes(latest);
    } catch (error) {
      console.error("Failed to fetch recent recipes:", error);
    }
  }, [repos?.recipe, locale]);

  useEffect(() => {
    refreshRecent();
  }, [refreshRecent]);

  const handleExtract = async (url: string) => {
    if (!repos) {
      toast.error(tCommon("unexpectedError"));
      return;
    }
    setIsLoading(true);
    setAiStage("analyzing"); // Default stage since we lack granular progress from server action
    try {
      console.log("Flavor Flow: Initializing True AI Extraction...");

      const extracted = await extractRecipeAction(url);

      console.log("Flavor Flow: AI Extraction successful:", extracted.title);

      console.log("Flavor Flow: Saving to Supabase...");
      const savedRecipe = await repos.recipe.addRecipe(extracted);
      console.log("Flavor Flow: Save successful.");

      toast.success(t("extractionSuccess"));
      router.push(`/app/recipes/${savedRecipe.id}`);
    } catch (error: any) {
      console.error(
        "Flavor Flow Error Object:",
        JSON.stringify(error, Object.getOwnPropertyNames(error))
      );
      const msg =
        error.message === "Failed to fetch"
          ? tCommon("networkError")
          : error.message || tCommon("unexpectedError");
      toast.error(t("extractionErrorPrefix", { message: msg }));
    } finally {
      setIsLoading(false);
      setAiStage("idle");
    }
  };

  return (
    <div className="flex flex-col items-center w-full text-gray-900 relative min-h-screen">
      <AILoadingOverlay stage={aiStage} />

      {/* Hero Section: Fixed & Full-bleed */}
      <motion.div 
        style={{ opacity: heroOpacity, scale: heroScale, transformOrigin: 'top center' }}
        className="fixed top-0 left-0 w-full h-[40vh] md:h-[50vh] z-0 overflow-hidden group"
      >
        <img
          src="https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&q=80&w=1000"
          alt="Fresh food"
          className="w-full h-full object-cover group-hover:scale-105 transition-all duration-1000 ease-out brightness-[0.7]"
          onError={(e) => {
            (e.target as HTMLImageElement).style.display = "none";
          }}
        />
        <div className="absolute bottom-16 left-8 right-8 max-w-2xl mx-auto w-full">
          <span className="text-brand-primary font-sans font-bold uppercase tracking-[0.2em] text-[10px] mb-2 block">
            {t("premiumKitchen")}
          </span>
          <h1 className="text-4xl md:text-6xl font-display font-bold text-white tracking-tight">
            {t("discover")}
          </h1>
        </div>
      </motion.div>

      {/* Spacer to push content down below the fixed hero */}
      <div className="h-[40vh] md:h-[50vh] w-full pointer-events-none" />

      {/* Content Card: Overlapping Hero */}
      <div className="w-full bg-[#121212] rounded-t-[2rem] -mt-12 relative z-20 flex flex-col items-center px-4 pt-12 pb-32 shadow-[0_-12px_24px_rgba(0,0,0,0.2)] border-t border-white/5 animate-fade-in">
        <div className="w-full max-w-2xl flex flex-col items-center">
          <header className="text-center mb-12 max-w-lg">
            <p className="text-2xl text-neutral-300 font-medium leading-relaxed">
              {t("description")}
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
                {t("startRecipe")}
              </h2>
              <UrlInput onExtract={handleExtract} isLoading={isLoading} />

              <div className="mt-10 px-4 py-6 border-t border-white/5">
                <p className="text-xs text-neutral-500 text-center uppercase tracking-widest font-medium">
                  {t("socialSources")}
                </p>
              </div>
            </div>
          </MagicCard>

          {!isLoading && recentRecipes.length > 0 && (
            <div className="w-full mt-16 animate-slide-up">
              <div className="flex items-center justify-between mb-8 px-2">
                <h2 className="text-sm font-sans font-bold uppercase tracking-[0.2em] text-neutral-500">
                  {t("recentExtractions")}
                </h2>
                <Link
                  href="/app/recipes"
                  className="text-[10px] font-sans font-bold uppercase tracking-widest text-brand-primary hover:text-brand-primary/80 transition-colors"
                >
                  {t("viewAll")}
                </Link>
              </div>
              <div className="flex flex-col gap-4">
                {recentRecipes.map((r) => (
                  <div
                    key={r.id}
                    className="cursor-pointer active:scale-[0.98] transition-transform"
                    onClick={() => router.push(`/app/recipes/${r.id}`)}
                  >
                    <RecipeListItem recipe={r} />
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}