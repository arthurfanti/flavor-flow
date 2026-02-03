import { createBrowserClient } from '@supabase/ssr'

export const createSupabaseClient = () => {
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

  return createBrowserClient(supabaseUrl, supabaseKey);
};
