-- Ensure the recipe_id column exists
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'planned_recipes' AND column_name = 'recipe_id') THEN
        ALTER TABLE public.planned_recipes ADD COLUMN recipe_id bigint references public.recipes(id);
    END IF;
END $$;

-- Backfill recipe_id for existing items based on source_url
UPDATE public.planned_recipes pr
SET recipe_id = r.id
FROM public.recipes r
WHERE pr.source_url = r.source_url
  AND pr.recipe_id IS NULL;
