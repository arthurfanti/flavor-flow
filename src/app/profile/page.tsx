'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/components/AuthProvider';
import { createSupabaseClient } from '@/lib/supabase/client';
import { SupabaseProfileRepository } from '@/lib/repositories/SupabaseProfileRepository';
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
      <div className="flex justify-center items-center min-h-screen" role="status">
        <div className="animate-spin h-8 w-8 border-4 border-brand-yellow border-t-transparent rounded-full" />
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto p-6 pb-24">
      <header className="mb-8">
        <h1 className="text-3xl font-serif font-bold text-gray-900">Profile Settings</h1>
        <p className="text-gray-500 mt-2">Manage your account preferences and language.</p>
      </header>

      <form onSubmit={handleSave} className="space-y-6 bg-white p-8 rounded-3xl shadow-sm border border-gray-100">
        <div>
          <label htmlFor="displayName" className="block text-sm font-medium text-gray-700 mb-1">
            Display Name
          </label>
          <input
            type="text"
            id="displayName"
            value={displayName}
            onChange={(e) => setDisplayName(e.target.value)}
            className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-yellow/50"
            placeholder="Your Name"
          />
        </div>

        <div>
          <label htmlFor="locale" className="block text-sm font-medium text-gray-700 mb-1">
            Preferred Language
          </label>
          <select
            id="locale"
            value={locale}
            onChange={(e) => setLocale(e.target.value)}
            className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-yellow/50 bg-white"
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
          <p className="text-xs text-gray-400 mt-2">
            Recipes will be automatically translated to this language when viewed.
          </p>
        </div>

        <div className="pt-4">
          <button
            type="submit"
            disabled={isSaving}
            className="w-full bg-brand-yellow text-black font-bold py-3 px-6 rounded-xl hover:brightness-105 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSaving ? 'Saving...' : 'Save Profile'}
          </button>
        </div>
      </form>
    </div>
  );
}
