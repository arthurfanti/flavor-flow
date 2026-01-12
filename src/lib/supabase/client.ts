import { createClient } from "@supabase/supabase-js";

export const createSupabaseClient = () => {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_DEFAULT_KEY!;

  console.log('Flavor Flow Debug: Initializing Supabase Client with URL:', supabaseUrl);

  const isPlaceholder = (val: string | undefined) => 
    !val || 
    val === '' || 
    val.includes('your-') || 
    val.includes('placeholder') || 
    val.includes('project-id') ||
    val.includes('anon-key');

  if (isPlaceholder(supabaseUrl) || isPlaceholder(supabaseKey)) {
    console.warn('Flavor Flow: Invalid Supabase configuration detected.');
    throw new Error('Supabase configuration is missing or using placeholders.');
  }

  if (!supabaseUrl.startsWith('https://') || !(supabaseUrl.includes('.supabase.co') || supabaseUrl.includes('.supabase.com'))) {
    console.warn('Flavor Flow: Supabase URL does not look like a valid Supabase endpoint:', supabaseUrl);
    throw new Error('Invalid Supabase URL format.');
  }

  console.log('Flavor Flow: Supabase Client initialized successfully.');
  return createClient(supabaseUrl, supabaseKey);
};
