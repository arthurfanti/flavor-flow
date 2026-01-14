update public.planned_recipes pr
set recipe_id = r.id
from public.recipes r
where pr.source_url = r.source_url
  and pr.recipe_id is null;
