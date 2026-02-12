"use client";

import { useAuth } from "@/components/AuthProvider";
import ShoppingList from "@/components/ShoppingList";
import { Skeleton } from "@/components/Skeleton";
import { SupabasePantryRepository } from "@/lib/repositories/SupabasePantryRepository";
import { SupabaseShoppingListRepository } from "@/lib/repositories/SupabaseShoppingListRepository";
import { createSupabaseClient } from "@/lib/supabase/client";
import { useRouter } from "@/navigation";
import { useTranslations } from "next-intl";
import { useCallback, useEffect, useMemo, useState } from "react";
import { toast } from "sonner";
import { motion, useScroll, useTransform, useSpring } from "framer-motion";

export default function ShoppingListPage() {
  const t = useTranslations("ShoppingList");
  const tCommon = useTranslations("Common");
  const router = useRouter();
  const { session, loading: authLoading } = useAuth();
  const [items, setItems] = useState<any[]>([]);
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
        shoppingList: new SupabaseShoppingListRepository(
          supabase,
          session.user.id,
        ),
        pantry: new SupabasePantryRepository(supabase, session.user.id),
      };
    } catch (e: any) {
      setConfigError(e.message);
      return null;
    }
  }, [session?.user?.id, authLoading]);

  const refreshItems = useCallback(async () => {
    if (!repos?.shoppingList) return;
    setIsLoading(true);
    try {
      const data = await repos.shoppingList.getItems();
      setItems(data);
      localStorage.setItem("shoppingList", JSON.stringify(data));
    } catch (error) {
      console.error("Failed to fetch shopping list:", error);
      const cached = localStorage.getItem("shoppingList");
      if (cached) setItems(JSON.parse(cached));
    } finally {
      setIsLoading(false);
    }
  }, [repos]);

  useEffect(() => {
    if (!authLoading && !session) {
      router.push("/app/login");
    }
  }, [session, authLoading, router]);

  useEffect(() => {
    refreshItems();
  }, [refreshItems]);

  const handleToggleItem = async (id: number, bought: boolean) => {
    if (!repos?.shoppingList) return;
    try {
      // Optimistic update with sorting (bought items at bottom)
      const newItems = items
        .map((item) => (item.id === id ? { ...item, bought } : item))
        .sort((a, b) => Number(a.bought) - Number(b.bought));
      setItems(newItems);
      localStorage.setItem("shoppingList", JSON.stringify(newItems));

      // DB Update
      await repos.shoppingList.toggleItem(id, bought);

      // Auto-add to pantry if bought
      if (bought && repos.pantry) {
        const item = items.find((i) => i.id === id);
        if (item) {
          try {
            await repos.pantry.addItem({
              name: item.name,
              is_low_stock: false,
              category: "Other",
            });
            toast.success(t("addedToPantry", { item: item.name }));
          } catch (pantryError) {
            console.error("Failed to auto-add to pantry:", pantryError);
          }
        }
      }
    } catch (error) {
      console.error("Failed to toggle item:", error);
      await refreshItems();
    }
  };

  const handleRemoveItem = async (id: number) => {
    if (!repos?.shoppingList) return;
    try {
      const newItems = items.filter((item) => item.id !== id);
      setItems(newItems);
      localStorage.setItem("shoppingList", JSON.stringify(newItems));
      await repos.shoppingList.removeItem(id);
    } catch (error) {
      console.error("Failed to remove item:", error);
      await refreshItems();
    }
  };

  const handleClearBought = async () => {
    if (!repos?.shoppingList) return;
    try {
      const newItems = items.filter((item) => !item.bought);
      setItems(newItems);
      localStorage.setItem("shoppingList", JSON.stringify(newItems));
      await repos.shoppingList.clearBoughtItems();
      toast.success(t("clearSuccess"));
    } catch (error) {
      console.error("Failed to clear bought items:", error);
      await refreshItems();
    }
  };

  const handleClearAll = async () => {
    if (!repos?.shoppingList) return;
    try {
      setItems([]);
      localStorage.setItem("shoppingList", JSON.stringify([]));
      await repos.shoppingList.clearAll();
      toast.success(t("clearAllSuccess"));
    } catch (error) {
      console.error("Failed to clear all items:", error);
      await refreshItems();
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
          src="https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&q=80&w=1000"
          alt="Grocery shopping"
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
          <header className="mb-10 text-center">
            <p className="text-xl text-neutral-300 font-medium italic leading-relaxed max-w-sm mx-auto">
              {t("description")}
            </p>
          </header>

          {isLoading ? (
            <div className="w-full max-w-2xl mt-8 space-y-4">
              <Skeleton variant="card" className="h-32" />
              <div className="space-y-2">
                {[1, 2, 3].map((i) => (
                  <Skeleton key={i} variant="list-item" />
                ))}
              </div>
            </div>
          ) : (
            <ShoppingList
              items={items}
              onToggle={handleToggleItem}
              onRemove={handleRemoveItem}
              onClearBought={handleClearBought}
              onClearAll={handleClearAll}
            />
          )}
        </div>
      </div>
    </div>
  );
}
