-- Deduplicate any existing source_url collisions by keeping earliest created_at
with ranked as (
  select
    id,
    source_url,
    row_number() over (
      partition by source_url
      order by created_at asc, id asc
    ) as rn
  from public.recipes
  where source_url is not null
)
delete from public.recipes
where id in (select id from ranked where rn > 1);

create unique index if not exists recipes_source_url_unique
  on public.recipes (source_url)
  where source_url is not null;
