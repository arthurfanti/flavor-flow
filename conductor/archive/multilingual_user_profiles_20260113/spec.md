# Specification: Multilingual Recipes & User Profiles (Scoped Data)

## Overview
This track introduces a personalized, multi-user experience to Flavor Flow. It adds user authentication via Supabase, a profile management system with language preferences, and user-scoped data for the pantry, shopping list, and planner. It also implements an on-demand AI translation system for recipes while keeping the recipe library shared to prevent data duplication.

## Functional Requirements
- **User Authentication**: Integration with Supabase Auth for sign-up/login.
- **User Profiles**: 
    - A new Profile page where users can set their `Display Name`, `Avatar`, and `Preferred Language` (locale).
    - Data persistence for these preferences in a `profiles` table.
- **User-Bounded Data**:
    - **Pantry, Shopping List, Planner**: These features will now be private. Users only see and manage their own items.
    - **Row Level Security (RLS)**: Enable RLS on these tables to ensure data isolation.
- **Shared Recipe Library**:
    - Recipes remain global (shared across all users) to avoid redundant extraction/storage.
    - Recipes will include a `user_id` to track who originally extracted them (used for the "Recent Extractions" section).
- **On-Demand AI Translation**:
    - When a user views a recipe, the app checks their profile's `preferred_locale`.
    - If the recipe is not in that language, it is translated via OpenRouter (MiniMax M2.1) and cached in a `recipe_translations` table.
    - Fields translated: Title, Ingredients, Instructions.

## Technical Requirements
- **Database Schema**:
    - **New `profiles` table**: `id` (UUID, references auth.users), `display_name`, `avatar_url`, `preferred_locale` (default 'en'), `updated_at`.
    - **New `recipe_translations` table**: `id`, `recipe_id` (FK), `locale` (BCP 47), `title`, `ingredients` (JSONB), `instructions` (JSONB).
    - **Table Updates**: Add `user_id` (UUID) to `pantry_items`, `shopping_list`, `planned_recipes`, and `recipes`.
- **Supabase RLS Policies**:
    - `profiles`: Users can read/update only their own profile.
    - `pantry_items`, `shopping_list`, `planned_recipes`: Users can CRUD only their own data.
    - `recipes`: Read access for everyone; Insert access for authenticated users.
- **Frontend**:
    - Create a `/profile` route and component.
    - Update `Repository` patterns to automatically include the `user_id` from the active session.
    - Update `RecipePreview` to fetch/trigger translations based on user preference.

## Acceptance Criteria
- [ ] Users can sign in and see a personalized profile page.
- [ ] Changing language in the profile updates the displayed language of recipes (triggering AI if needed).
- [ ] User A cannot see User B's pantry, shopping list, or planned meals.
- [ ] Recipes extracted by User A appear in "Recent Extractions" for everyone (shared), but properly reflect the source user if needed.
- [ ] Translations are persisted and reused for all users requesting the same recipe in the same language.

## Out of Scope
- Full social features (commenting, sharing profiles).
- Manual translation editing by users.
