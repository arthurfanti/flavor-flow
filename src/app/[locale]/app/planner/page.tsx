'use client';

import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { createSupabaseClient } from '@/lib/supabase/client';
import { SupabasePlannerRepository } from '@/lib/repositories/SupabasePlannerRepository';
import PlannerQueue from '@/components/PlannerQueue';
import { PlannedRecipe } from '@/lib/repositories/PlannerRepository';
import { useAuth } from '@/components/AuthProvider';
import { useRouter } from '@/navigation';
import { useTranslations, useLocale } from 'next-intl';

export default function PlannerPage() {
  const t = useTranslations('Planner');
  const tCommon = useTranslations('Common');
  const locale = useLocale();
  const router = useRouter();
  const { session, loading: authLoading } = useAuth();
  const [recipes, setRecipes] = useState<PlannedRecipe[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [configError, setConfigError] = useState<string | null>(null);

  const plannerRepo = useMemo(() => {
    if (authLoading || !session?.user?.id) return null;
    try {
      const supabase = createSupabaseClient();
      return new SupabasePlannerRepository(supabase, session.user.id);
    } catch (e: any) {
      setConfigError(e.message);
      return null;
    }
  }, [session?.user?.id, authLoading]);

  const refreshQueue = useCallback(async () => {
    if (!plannerRepo) return;
    setIsLoading(true);
    try {
      const data = await plannerRepo.getQueue(locale);
      setRecipes(data);
      localStorage.setItem('plannedRecipes', JSON.stringify(data));
    } catch (error) {
      console.error('Failed to fetch planned recipes:', error);
      const cached = localStorage.getItem('plannedRecipes');
      if (cached) setRecipes(JSON.parse(cached));
    } finally {
      setIsLoading(false);
    }
  }, [plannerRepo, locale]);

  useEffect(() => {
    if (!authLoading && !session) {
      router.push('/app/login');
    }
  }, [session, authLoading, router]);

  useEffect(() => {
    refreshQueue();
  }, [refreshQueue]);

  const handleRemove = async (id: number) => {
    if (!plannerRepo) return;
    try {
      setRecipes(prev => prev.filter(r => r.id !== id));
      await plannerRepo.removeFromQueue(id);
    } catch (error) {
      console.error('Failed to remove recipe:', error);
      await refreshQueue();
    }
  };

  if (configError) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen p-4 text-center">
        <h1 className="text-2xl font-bold text-red-600 mb-4">{tCommon('configurationError')}</h1>
        <p className="text-gray-700">{configError}</p>
        <p className="text-sm text-gray-500 mt-4">{tCommon('checkEnvVars')}</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col w-full animate-fade-in pb-20 text-gray-900">
      <div className="w-full h-56 rounded-[2rem] overflow-hidden mb-10 shadow-lg relative group bg-gradient-to-br from-brand-yellow/20 to-orange-100">
        <img 
          src="https://images.unsplash.com/photo-1490645935967-10de6ba17061?auto=format&fit=crop&q=80&w=1000" 
          alt="Healthy meal planning"
          className="w-full h-full object-cover group-hover:scale-105 transition-all duration-1000 ease-out"
          onError={(e) => {
            (e.target as HTMLImageElement).style.display = 'none';
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />
        <div className="absolute bottom-8 left-8">
          <span className="text-brand-yellow font-sans font-bold uppercase tracking-[0.2em] text-[10px] mb-2 block">{t('subtitle')}</span>
          <h1 className="text-4xl font-bold text-white tracking-tight">
            {t('title')}
          </h1>
        </div>
      </div>

      <header className="mb-10 text-center">
        <p className="text-xl text-gray-500 font-medium italic leading-relaxed max-w-sm mx-auto">
          {t('description')}
        </p>
      </header>

      {isLoading ? (
        <div className="w-full py-20 flex justify-center">
          <div className="animate-spin h-8 w-8 border-4 border-brand-yellow border-t-transparent rounded-full" />
        </div>
      ) : (
        <PlannerQueue recipes={recipes} onRemove={handleRemove} />
      )}
    </div>
  );
}
