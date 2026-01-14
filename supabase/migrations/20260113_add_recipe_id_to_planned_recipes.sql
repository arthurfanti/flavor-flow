alter table public.planned_recipes 
add column recipe_id bigint references public.recipes(id);
