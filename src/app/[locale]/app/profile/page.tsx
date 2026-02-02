'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { useRouter } from '@/navigation';
import { useAuth } from '@/components/AuthProvider';
import { createSupabaseClient } from '@/lib/supabase/client';
import { SupabaseProfileRepository } from '@/lib/repositories/SupabaseProfileRepository';
import { MagicCard } from '@/components/MagicCard';
import { MagicInput } from '@/components/MagicInput';
import { MagicButton } from '@/components/MagicButton';
import { User, Languages, Save } from 'lucide-react';
import { toast } from 'sonner';
import { useTranslations } from 'next-intl';

export default function ProfilePage() {
  const t = useTranslations('Profile');
  const tc = useTranslations('Common');
  const router = useRouter();
  const { session, loading: authLoading } = useAuth();
  const userId = session?.user?.id;
  const isAuthenticated = Boolean(session);
  const [displayName, setDisplayName] = useState('');
  const [locale, setLocale] = useState('en');
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  const profileRepo = useMemo(() => {
    if (authLoading || !userId) return null;
    return new SupabaseProfileRepository(createSupabaseClient());
  }, [userId, authLoading]);

  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      router.push('/app/login');
    }
  }, [authLoading, isAuthenticated, router]);

  useEffect(() => {
    const loadProfile = async () => {
      if (!profileRepo || !userId) return;
      try {
        const profile = await profileRepo.getProfile(userId);
        if (profile) {
          setDisplayName(profile.display_name || '');
          setLocale(profile.preferred_locale || 'en');
        }
      } catch (error) {
        console.error('Failed to load profile:', error);
        toast.error(tc('loadProfileError'));
      } finally {
        setIsLoading(false);
      }
    };

    if (profileRepo) {
      loadProfile();
    }
  }, [profileRepo, userId, tc]);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!profileRepo || !session?.user?.id) return;

    setIsSaving(true);
    try {
      await profileRepo.upsertProfile({
        id: session.user.id,
        display_name: displayName,
        preferred_locale: locale,
      });
      toast.success(tc('saveProfileSuccess'));
    } catch (error) {
      console.error('Failed to save profile:', error);
      toast.error(tc('saveProfileError'));
    } finally {
      setIsSaving(false);
    }
  };

  if (authLoading || isLoading) {
    return (
      <div className="flex justify-center items-center min-h-[60vh]" role="status">
        <div className="animate-spin h-8 w-8 border-4 border-brand-primary border-t-transparent rounded-full" />
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto p-6 pb-24 animate-fade-in">
      <header className="mb-12">
        <span className="text-brand-primary font-sans font-bold uppercase tracking-[0.3em] text-[10px] block mb-2">{t('subtitle')}</span>
        <h1 className="text-4xl font-display font-bold text-white tracking-tight">{t('title')}</h1>
        <p className="text-neutral-400 mt-3 text-lg">{t('description')}</p>
      </header>

      <MagicCard 
        className="p-8 md:p-10 border-white/5"
        gradientColor="#E05D44"
        variant="neon"
      >
        <form onSubmit={handleSave} className="space-y-10">
          <div className="space-y-4">
            <label htmlFor="displayName" className="flex items-center gap-2 text-sm font-bold text-neutral-300 uppercase tracking-widest">
              <User className="h-4 w-4 text-brand-primary" />
              {t('displayName')}
            </label>
            <MagicInput
              type="text"
              id="displayName"
              value={displayName}
              onChange={(e) => setDisplayName(e.target.value)}
              placeholder={t('displayNamePlaceholder')}
              className="h-14"
            />
          </div>

          <div className="space-y-4">
            <label htmlFor="locale" className="flex items-center gap-2 text-sm font-bold text-neutral-300 uppercase tracking-widest">
              <Languages className="h-4 w-4 text-brand-primary" />
              {t('language')}
            </label>
            <div className="relative">
              <select
                id="locale"
                value={locale}
                onChange={(e) => setLocale(e.target.value)}
                className="w-full h-14 px-4 py-2 border border-white/10 rounded-md focus:outline-none focus:ring-2 focus:ring-brand-primary/50 bg-glass-surface text-foreground appearance-none backdrop-blur-sm transition-all cursor-pointer"
              >
                <option value="en">{t('languages.en')}</option>
                <option value="es">{t('languages.es')}</option>
                <option value="fr">{t('languages.fr')}</option>
                <option value="de">{t('languages.de')}</option>
                <option value="it">{t('languages.it')}</option>
                <option value="pt">{t('languages.pt')}</option>
                <option value="ja">{t('languages.ja')}</option>
                <option value="zh">{t('languages.zh')}</option>
              </select>
              <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-neutral-500">
                <svg className="h-4 w-4 fill-current" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                  <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
                </svg>
              </div>
            </div>
            <p className="text-xs text-neutral-500 italic mt-2">
              {t('translationAuto')}
            </p>
          </div>

          <div className="pt-6">
            <MagicButton
              type="submit"
              disabled={isSaving}
              variant="shiny"
              className="w-full h-14 font-bold uppercase tracking-[0.2em] text-xs"
            >
              {isSaving ? (
                <div className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full" />
              ) : (
                <span className="flex items-center gap-2">
                  <Save className="h-4 w-4" />
                  {tc('save')}
                </span>
              )}
            </MagicButton>
          </div>
        </form>
      </MagicCard>
    </div>
  );
}
