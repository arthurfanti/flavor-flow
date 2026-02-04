-- Storage policies for recipe_thumbnails bucket

-- 1. Allow public read access to all objects in the bucket
create policy "Public Read Access"
on storage.objects for select
using ( bucket_id = 'recipe_thumbnails' );

-- 2. Allow authenticated users to upload new thumbnails
create policy "Authenticated Insert Access"
on storage.objects for insert
with check (
    bucket_id = 'recipe_thumbnails' 
    AND auth.role() = 'authenticated'
);

-- 3. Allow authenticated users to update their own uploads (if needed)
create policy "Authenticated Update Access"
on storage.objects for update
using (
    bucket_id = 'recipe_thumbnails' 
    AND auth.role() = 'authenticated'
);

-- 4. Make the bucket public
update storage.buckets
set public = true
where id = 'recipe_thumbnails';

-- Note: You generally don't "enable" RLS on storage.objects directly as it's managed by Supabase, 
-- but you must have policies for any bucket you create.
