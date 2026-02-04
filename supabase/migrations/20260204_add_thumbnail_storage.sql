-- Add storage_path to recipes table
alter table public.recipes 
add column storage_path text;

-- Add comment explaining the column
comment on column public.recipes.storage_path is 'Path to the thumbnail image in Supabase Storage bucket';
