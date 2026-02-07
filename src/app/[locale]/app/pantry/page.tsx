'use client';

import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { createSupabaseClient } from '@/lib/supabase/client';
import { SupabasePantryRepository } from '@/lib/repositories/SupabasePantryRepository';
import PantryList from '@/components/PantryList';
import PantryItemForm from '@/components/PantryItemForm';
import { PantryItem } from '@/lib/repositories/PantryRepository';
import { useAuth } from '@/components/AuthProvider';
import { useRouter } from '@/navigation';
import { useTranslations } from 'next-intl';
import { motion, useScroll, useTransform, useSpring } from 'framer-motion';

export default function PantryPage() {
  const t = useTranslations('Pantry');
  const tCommon = useTranslations('Common');
  const router = useRouter();
  const { session, loading: authLoading } = useAuth();
  const [items, setItems] = useState<PantryItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isAdding, setIsAdding] = useState(false);
  const [configError, setConfigError] = useState<string | null>(null);

  const { scrollY } = useScroll();
  const smoothScrollY = useSpring(scrollY, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001
  });

  const heroOpacity = useTransform(smoothScrollY, [0, 300], [1, 0.4]);
  const heroScale = useTransform(smoothScrollY, [0, 300], [1, 1.1]);

  const pantryRepo = useMemo(() => {
    if (authLoading || !session?.user?.id) return null;
    try {
      const supabase = createSupabaseClient();
      return new SupabasePantryRepository(supabase, session.user.id);
    } catch (e: any) {
      setConfigError(e.message);
      return null;
    }
  }, [session?.user?.id, authLoading]);

  const refreshItems = useCallback(async () => {
    if (!pantryRepo) return;
    setIsLoading(true);
    try {
      const data = await pantryRepo.getItems();
      setItems(data);
      localStorage.setItem('pantryItems', JSON.stringify(data));
    } catch (error) {
      console.error('Failed to fetch pantry items:', error);
      const cached = localStorage.getItem('pantryItems');
      if (cached) setItems(JSON.parse(cached));
    } finally {
      setIsLoading(false);
    }
  }, [pantryRepo]);

  useEffect(() => {
    if (!authLoading && !session) {
      router.push('/app/login');
    }
  }, [session, authLoading, router]);

  useEffect(() => {
    refreshItems();
  }, [refreshItems]);

  const handleSaveItem = async (data: Partial<PantryItem>) => {
    if (!pantryRepo) return;
    try {
      await pantryRepo.addItem(data);
      await refreshItems();
      setIsAdding(false);
    } catch (error) {
      console.error('Failed to save pantry item:', error);
    }
  };

  const handleDeleteItem = async (id: number) => {
    if (!pantryRepo) return;
    try {
      await pantryRepo.removeItem(id);
      await refreshItems();
    } catch (error) {
      console.error('Failed to delete pantry item:', error);
    }
  };

  const handleToggleLowStock = async (id: number, current: boolean) => {
    if (!pantryRepo) return;
    try {
      await pantryRepo.updateItem(id, { is_low_stock: !current });
      await refreshItems();
    } catch (error) {
      console.error('Failed to update pantry item:', error);
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
    <div className="flex flex-col items-center w-full text-gray-900 relative min-h-screen">
      {/* Hero Section: Fixed & Full-bleed */}
      <motion.div 
        style={{ opacity: heroOpacity, scale: heroScale, transformOrigin: 'top center' }}
        className="fixed top-0 left-0 w-full h-[40vh] md:h-[50vh] z-0 overflow-hidden group"
      >
        <img 
          src="https://images.unsplash.com/photo-1580927942266-81d0519eb7be?auto=format&fit=crop&q=80&w=1000" 
          alt="Kitchen pantry"
          className="w-full h-full object-cover brightness-[0.7]"
          onError={(e) => {
            (e.target as HTMLImageElement).style.display = 'none';
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#121212] via-transparent to-transparent" />
        <div className="absolute bottom-16 left-8 right-8 max-w-2xl mx-auto w-full">
          <span className="text-brand-primary font-sans font-bold uppercase tracking-[0.2em] text-[10px] mb-2 block">{t('subtitle')}</span>
          <h1 className="text-4xl md:text-6xl font-display font-bold text-white tracking-tight">
            {t('title')}
          </h1>
        </div>
      </motion.div>

      {/* Spacer to push content down below the fixed hero */}
      <div className="h-[40vh] md:h-[50vh] w-full pointer-events-none" />

      {/* Content Card: Overlapping Hero */}
      <div className="w-full bg-[#121212] rounded-t-[2rem] -mt-12 relative z-20 flex flex-col items-center px-4 pt-12 pb-32 shadow-[0_-12px_24px_rgba(0,0,0,0.2)] border-t border-white/5 animate-fade-in">
        <div className="w-full max-w-2xl flex flex-col items-center">
          {!isAdding && (
            <>
              <header className="mb-10 flex items-center justify-between w-full px-2">
                <div>
                  <p className="text-neutral-300 font-medium italic">
                    {t('description')}
                  </p>
                </div>
                <button 
                  onClick={() => setIsAdding(true)}
                  className="w-14 h-14 rounded-2xl bg-brand-primary text-white flex items-center justify-center shadow-lg shadow-brand-primary/20 hover:scale-105 active:scale-95 transition-all"
                >
                  <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                  </svg>
                </button>
              </header>

              {isLoading ? (
                <div className="w-full py-20 flex justify-center">
                  <div className="animate-spin h-8 w-8 border-4 border-brand-primary border-t-transparent rounded-full" />
                </div>
              ) : (
                <PantryList 
                  items={items} 
                  onDelete={handleDeleteItem}
                  onToggleLowStock={handleToggleLowStock}
                />
              )}
            </>
          )}

          {isAdding && (
            <div className="w-full max-w-lg py-4">
              <header className="mb-10 text-center">
                <h2 className="text-3xl font-display font-bold text-white mb-2">{t('addItemTitle')}</h2>
                <p className="text-neutral-400 italic">{t('addItemDescription')}</p>
              </header>
              <PantryItemForm onSave={handleSaveItem} onCancel={() => setIsAdding(false)} />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
