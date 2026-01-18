-- Enable RLS on new tables
alter table public.profiles enable row level security;
alter table public.recipe_translations enable row level security;

-- Drop insecure policies from recipes
drop policy if exists "Enable read access for all users" on public.recipes;
drop policy if exists "Enable insert access for all users" on public.recipes;
drop policy if exists "Enable update access for all users" on public.recipes;
drop policy if exists "Enable delete access for all users" on public.recipes;

-- Drop insecure policies from pantry_items
drop policy if exists "Enable read access for all users" on public.pantry_items;
drop policy if exists "Enable insert access for all users" on public.pantry_items;
drop policy if exists "Enable update access for all users" on public.pantry_items;
drop policy if exists "Enable delete access for all users" on public.pantry_items;

-- Drop insecure policies from shopping_list
drop policy if exists "Enable read access for all users" on public.shopping_list;
drop policy if exists "Enable insert access for all users" on public.shopping_list;
drop policy if exists "Enable update access for all users" on public.shopping_list;
drop policy if exists "Enable delete access for all users" on public.shopping_list;

-- Drop insecure policies from planned_recipes
drop policy if exists "Enable read access for all users" on public.planned_recipes;
drop policy if exists "Enable insert access for all users" on public.planned_recipes;
drop policy if exists "Enable update access for all users" on public.planned_recipes;
drop policy if exists "Enable delete access for all users" on public.planned_recipes;


-- Profiles Policies
create policy "Users can view their own profile" on public.profiles for select using (auth.uid() = id);
create policy "Users can insert their own profile" on public.profiles for insert with check (auth.uid() = id);
create policy "Users can update their own profile" on public.profiles for update using (auth.uid() = id);

-- Pantry Items Policies
create policy "Users can view their own pantry items" on public.pantry_items for select using (auth.uid() = user_id);
create policy "Users can insert their own pantry items" on public.pantry_items for insert with check (auth.uid() = user_id);
create policy "Users can update their own pantry items" on public.pantry_items for update using (auth.uid() = user_id);
create policy "Users can delete their own pantry items" on public.pantry_items for delete using (auth.uid() = user_id);

-- Shopping List Policies
create policy "Users can view their own shopping list" on public.shopping_list for select using (auth.uid() = user_id);
create policy "Users can insert their own shopping list" on public.shopping_list for insert with check (auth.uid() = user_id);
create policy "Users can update their own shopping list" on public.shopping_list for update using (auth.uid() = user_id);
create policy "Users can delete their own shopping list" on public.shopping_list for delete using (auth.uid() = user_id);

-- Planned Recipes Policies
create policy "Users can view their own planned recipes" on public.planned_recipes for select using (auth.uid() = user_id);
create policy "Users can insert their own planned recipes" on public.planned_recipes for insert with check (auth.uid() = user_id);
create policy "Users can update their own planned recipes" on public.planned_recipes for update using (auth.uid() = user_id);
create policy "Users can delete their own planned recipes" on public.planned_recipes for delete using (auth.uid() = user_id);

-- Recipes Policies
create policy "Recipes are viewable by everyone" on public.recipes for select using (true);
create policy "Authenticated users can insert recipes" on public.recipes for insert with check (auth.role() = 'authenticated');
create policy "Users can update their own recipes" on public.recipes for update using (auth.uid() = user_id);
create policy "Users can delete their own recipes" on public.recipes for delete using (auth.uid() = user_id);

-- Recipe Translations Policies
create policy "Translations are viewable by everyone" on public.recipe_translations for select using (true);
create policy "Authenticated users can insert translations" on public.recipe_translations for insert with check (auth.role() = 'authenticated');
create policy "Authenticated users can update translations" on public.recipe_translations for update using (auth.role() = 'authenticated');
