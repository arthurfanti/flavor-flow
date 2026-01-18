-- Create profiles table
create table "public"."profiles" (
    "id" uuid not null references auth.users on delete cascade,
    "display_name" text,
    "avatar_url" text,
    "preferred_locale" text default 'en'::text,
    "updated_at" timestamp with time zone default now(),
    primary key ("id")
);

-- Create recipe_translations table
create table "public"."recipe_translations" (
    "id" uuid not null default gen_random_uuid(),
    "recipe_id" bigint not null references public.recipes(id) on delete cascade,
    "locale" text not null,
    "title" text,
    "ingredients" jsonb,
    "instructions" jsonb,
    primary key ("id"),
    unique ("recipe_id", "locale")
);

-- Add user_id to tables
alter table "public"."pantry_items" add column "user_id" uuid references auth.users on delete cascade;
alter table "public"."shopping_list" add column "user_id" uuid references auth.users on delete cascade;
alter table "public"."planned_recipes" add column "user_id" uuid references auth.users on delete cascade;
alter table "public"."recipes" add column "user_id" uuid references auth.users on delete set null;

-- Add source_locale to recipes
alter table "public"."recipes" add column "source_locale" text default 'en'::text;
