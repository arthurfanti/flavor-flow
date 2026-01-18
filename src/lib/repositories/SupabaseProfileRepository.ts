import { SupabaseClient } from '@supabase/supabase-js';

export interface UserProfile {
  id: string;
  display_name: string | null;
  avatar_url?: string | null;
  preferred_locale: string;
  updated_at?: string;
}

export interface ProfileRepository {
  getProfile(userId: string): Promise<UserProfile | null>;
  upsertProfile(profile: UserProfile): Promise<void>;
}

export class SupabaseProfileRepository implements ProfileRepository {
  constructor(private supabase: SupabaseClient) {}

  async getProfile(userId: string): Promise<UserProfile | null> {
    const { data, error } = await this.supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .single();

    if (error) {
      if (error.code === 'PGRST116') return null; // Not found
      throw error;
    }

    return data;
  }

  async upsertProfile(profile: UserProfile): Promise<void> {
    const { error } = await this.supabase
      .from('profiles')
      .upsert(profile);

    if (error) throw error;
  }
}
