"use client";

import React, { useState, useEffect, useMemo, useCallback } from "react";
import { useAuth } from "@/components/AuthProvider";
import RecipeListItem from "@/components/RecipeListItem";
import { SupabaseRecipeRepository } from "@/lib/repositories/SupabaseRecipeRepository";
import { createSupabaseClient } from "@/lib/supabase/client";
import { Link, useRouter } from "@/navigation";
import { useLocale, useTranslations } from "next-intl";
import { motion, useScroll, useTransform, useSpring } from "framer-motion";
import { Skeleton } from "@/components/Skeleton";

export default function RecipesPage() {
  const t = useTranslations("Recipes");
  const tCommon = useTranslations("Common");
  const locale = useLocale();
  const router = useRouter();
  const { session, loading: authLoading } = useAuth();
  const [recipes, setRecipes] = useState<any[]>([]);
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

  const recipeRepo = useMemo(() => {
    if (authLoading || !session?.user?.id) return null;
    try {
      const supabase = createSupabaseClient();
      return new SupabaseRecipeRepository(supabase);
    } catch (e: any) {
      setConfigError(e.message);
      return null;
    }
  }, [session?.user?.id, authLoading]);

  const fetchRecipes = useCallback(async () => {
    if (!recipeRepo) return;
    setIsLoading(true);
    try {
      const data = await recipeRepo.getAll(locale);
      setRecipes(data);
    } catch (error) {
      console.error("Failed to fetch recipes:", error);
    } finally {
      setIsLoading(false);
    }
  }, [recipeRepo, locale]);

  useEffect(() => {
    if (!authLoading && !session) {
      router.push("/app/login");
    }
  }, [session, authLoading, router]);

  useEffect(() => {
    fetchRecipes();
  }, [fetchRecipes]);

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
    <div className="flex flex-col items-center w-full text-foreground relative min-h-screen pb-20">
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
          src="https://images.unsplash.com/photo-1556910103-1c02745aae4d?auto=format&fit=crop&q=80&w=1000"
          alt="Recipe Collection"
          className="w-full h-full object-cover brightness-[0.7]"
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
            <div className="w-full space-y-4">
              {[...Array(5)].map((_, i) => (
                <Skeleton key={i} variant="list-item" />
              ))}
            </div>
          ) : recipes.length === 0 ? (
            <div className="w-full py-12 text-center bg-[#1A1A1A] rounded-3xl border border-white/5">
              <p className="text-neutral-500 font-medium italic">
                {t("empty")}
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-4 w-full">
              {recipes.map((recipe) => (
                <Link
                  key={recipe.id || recipe.sourceUrl}
                  href={`/app/recipes/${recipe.id}`}
                >
                  <RecipeListItem recipe={recipe} />
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
