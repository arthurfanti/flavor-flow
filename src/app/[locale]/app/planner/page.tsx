"use client";

import React, { useState, useEffect, useMemo, useCallback } from "react";
import { createSupabaseClient } from "@/lib/supabase/client";
import { SupabasePlannerRepository } from "@/lib/repositories/SupabasePlannerRepository";
import { SupabaseShoppingListRepository } from "@/lib/repositories/SupabaseShoppingListRepository";
import PlannerQueue from "@/components/PlannerQueue";
import { PlannedRecipe } from "@/lib/repositories/PlannerRepository";
import { useAuth } from "@/components/AuthProvider";
import { useRouter } from "@/navigation";
import { useTranslations, useLocale } from "next-intl";
import { motion, useScroll, useTransform, useSpring } from "framer-motion";

export default function PlannerPage() {
  const t = useTranslations("Planner");
  const tCommon = useTranslations("Common");
  const locale = useLocale();
  const router = useRouter();
  const { session, loading: authLoading } = useAuth();
  const [recipes, setRecipes] = useState<PlannedRecipe[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [configError, setConfigError] = useState<string | null>(null);

  const { scrollY } = useScroll();
  const smoothScrollY = useSpring(scrollY, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001,
  });

  const heroOpacity = useTransform(smoothScrollY, [0, 300], [1, 0.4]);
  const heroScale = useTransform(smoothScrollY, [0, 300], [1, 1.1]);

  const repos = useMemo(() => {
    if (authLoading || !session?.user?.id) return null;
    try {
      const supabase = createSupabaseClient();
      return {
        planner: new SupabasePlannerRepository(supabase, session.user.id),
        shoppingList: new SupabaseShoppingListRepository(
          supabase,
          session.user.id,
        ),
      };
    } catch (e: any) {
      setConfigError(e.message);
      return null;
    }
  }, [session?.user?.id, authLoading]);

  const refreshQueue = useCallback(async () => {
    if (!repos?.planner) return;
    setIsLoading(true);
    try {
      const data = await repos.planner.getQueue(locale);
      setRecipes(data);
      localStorage.setItem("plannedRecipes", JSON.stringify(data));
    } catch (error) {
      console.error("Failed to fetch planned recipes:", error);
      const cached = localStorage.getItem("plannedRecipes");
      if (cached) setRecipes(JSON.parse(cached));
    } finally {
      setIsLoading(false);
    }
  }, [repos?.planner, locale]);

  useEffect(() => {
    if (!authLoading && !session) {
      router.push("/app/login");
    }
  }, [session, authLoading, router]);

  useEffect(() => {
    refreshQueue();
  }, [refreshQueue]);

  const handleRemove = async (id: number) => {
    if (!repos?.planner) return;
    try {
      const recipeToRemove = recipes.find((r) => r.id === id);
      setRecipes((prev) => prev.filter((r) => r.id !== id));
      await repos.planner.removeFromQueue(id);

      if (recipeToRemove?.recipe_id && repos.shoppingList) {
        await repos.shoppingList.removeItemsByRecipeId(
          recipeToRemove.recipe_id,
        );
      }
    } catch (error) {
      console.error("Failed to remove recipe:", error);
      await refreshQueue();
    }
  };

  if (configError) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen p-4 text-center">
        <h1 className="text-2xl font-bold text-red-600 mb-4">
          {tCommon("configurationError")}
        </h1>
        <p className="text-gray-700">{configError}</p>
        <p className="text-sm text-gray-500 mt-4">{tCommon("checkEnvVars")}</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center w-full text-gray-900 relative min-h-screen">
      {/* Hero Section: Fixed & Full-bleed */}
      <motion.div
        style={{
          opacity: heroOpacity,
          scale: heroScale,
          transformOrigin: "top center",
        }}
        className="fixed top-0 left-0 w-full h-[40vh] md:h-[50vh] z-0 overflow-hidden group"
      >
        <img
          src="https://images.unsplash.com/photo-1490645935967-10de6ba17061?auto=format&fit=crop&q=80&w=1000"
          alt="Healthy meal planning"
          className="w-full h-full object-cover brightness-[0.7]"
          onError={(e) => {
            (e.target as HTMLImageElement).style.display = "none";
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#121212] via-transparent to-transparent" />
        <div className="absolute bottom-16 left-8 right-8 max-w-2xl mx-auto w-full">
          <span className="text-brand-primary font-sans font-bold uppercase tracking-[0.2em] text-[10px] mb-2 block">
            {t("subtitle")}
          </span>
          <h1 className="text-4xl md:text-6xl font-display font-bold text-white tracking-tight">
            {t("title")}
          </h1>
        </div>
      </motion.div>

      {/* Spacer to push content down below the fixed hero */}
      <div className="h-[40vh] md:h-[50vh] w-full pointer-events-none" />

      {/* Content Card: Overlapping Hero */}
      <div className="w-full bg-[#121212] rounded-t-[2rem] -mt-12 relative z-20 flex flex-col items-center px-4 pt-12 pb-32 shadow-[0_-12px_24px_rgba(0,0,0,0.2)] border-t border-white/5 animate-fade-in">
        <div className="w-full max-w-2xl flex flex-col items-center">
          {isLoading ? (
            <div className="w-full py-20 flex justify-center">
              <div className="animate-spin h-8 w-8 border-4 border-brand-primary border-t-transparent rounded-full" />
            </div>
          ) : (
            <PlannerQueue recipes={recipes} onRemove={handleRemove} />
          )}
        </div>
      </div>
    </div>
  );
}
