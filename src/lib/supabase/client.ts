import { createClient, SupabaseClient } from "@supabase/supabase-js";

let supabaseInstance: SupabaseClient | null = null;

export const createSupabaseClient = () => {
  if (supabaseInstance) return supabaseInstance;

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_DEFAULT_KEY!;

  const isPlaceholder = (val: string | undefined) => 
    !val || 
    val === '' || 
    val.includes('your-') || 
    val.includes('placeholder') || 
    val.includes('project-id') ||
    val.includes('anon-key');

  if (isPlaceholder(supabaseUrl) || isPlaceholder(supabaseKey)) {
    throw new Error('Supabase configuration is missing or using placeholders.');
  }

  if (!supabaseUrl.startsWith('https://') || !(supabaseUrl.includes('.supabase.co') || supabaseUrl.includes('.supabase.com'))) {
    throw new Error('Invalid Supabase URL format.');
  }

  supabaseInstance = createClient(supabaseUrl, supabaseKey);
  return supabaseInstance;
};
