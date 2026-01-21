'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/components/AuthProvider';
import { createSupabaseClient } from '@/lib/supabase/client';
import { SupabaseProfileRepository } from '@/lib/repositories/SupabaseProfileRepository';
import { MagicCard } from '@/components/MagicCard';
import { MagicInput } from '@/components/MagicInput';
import { MagicButton } from '@/components/MagicButton';
import { User, Languages, Save } from 'lucide-react';
import { toast } from 'sonner';

export default function ProfilePage() {
  const router = useRouter();
  const { session, loading: authLoading } = useAuth();
  const [displayName, setDisplayName] = useState('');
  const [locale, setLocale] = useState('en');
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  const profileRepo = useMemo(() => {
    if (authLoading || !session?.user?.id) return null;
    return new SupabaseProfileRepository(createSupabaseClient());
  }, [session?.user?.id, authLoading]);

  useEffect(() => {
    if (!authLoading && !session) {
      router.push('/login');
    }
  }, [authLoading, !!session, router]);

  useEffect(() => {
    const loadProfile = async () => {
      if (!profileRepo || !session?.user?.id) return;
      try {
        const profile = await profileRepo.getProfile(session.user.id);
        if (profile) {
          setDisplayName(profile.display_name || '');
          setLocale(profile.preferred_locale || 'en');
        }
      } catch (error) {
        console.error('Failed to load profile:', error);
        toast.error('Failed to load profile');
      } finally {
        setIsLoading(false);
      }
    };

    if (profileRepo) {
      loadProfile();
    }
  }, [!!profileRepo, session?.user?.id]);

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
      toast.success('Profile saved successfully');
    } catch (error) {
      console.error('Failed to save profile:', error);
      toast.error('Failed to save profile');
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
        <span className="text-brand-primary font-sans font-bold uppercase tracking-[0.3em] text-[10px] block mb-2">Preferences</span>
        <h1 className="text-4xl font-display font-bold text-white tracking-tight">Profile Settings</h1>
        <p className="text-neutral-400 mt-3 text-lg">Manage your account preferences and language.</p>
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
              Display Name
            </label>
            <MagicInput
              type="text"
              id="displayName"
              value={displayName}
              onChange={(e) => setDisplayName(e.target.value)}
              placeholder="Your Name"
              className="h-14"
            />
          </div>

          <div className="space-y-4">
            <label htmlFor="locale" className="flex items-center gap-2 text-sm font-bold text-neutral-300 uppercase tracking-widest">
              <Languages className="h-4 w-4 text-brand-primary" />
              Preferred Language
            </label>
            <div className="relative">
              <select
                id="locale"
                value={locale}
                onChange={(e) => setLocale(e.target.value)}
                className="w-full h-14 px-4 py-2 border border-white/10 rounded-md focus:outline-none focus:ring-2 focus:ring-brand-primary/50 bg-glass-surface text-foreground appearance-none backdrop-blur-sm transition-all cursor-pointer"
              >
                <option value="en">English</option>
                <option value="es">Spanish</option>
                <option value="fr">French</option>
                <option value="de">German</option>
                <option value="it">Italian</option>
                <option value="pt">Portuguese</option>
                <option value="ja">Japanese</option>
                <option value="zh">Chinese</option>
              </select>
              <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-neutral-500">
                <svg className="h-4 w-4 fill-current" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                  <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
                </svg>
              </div>
            </div>
            <p className="text-xs text-neutral-500 italic mt-2">
              Recipes will be automatically translated to this language when viewed.
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
                  Save Profile
                </span>
              )}
            </MagicButton>
          </div>
        </form>
      </MagicCard>
    </div>
  );
}
