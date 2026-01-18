# Plan: Multilingual Recipes & User Profiles (Scoped Data)

This plan implements user authentication, personalized profiles with language preferences, data scoping for privacy, and an on-demand AI translation system for shared recipes.

## Phase 1: Database Foundation & Auth Setup [checkpoint: 00278c8]

- [x] **Task 1: Database Migration - Schema Updates** b267622
    - [ ] Create `profiles` table linked to `auth.users`.
    - [ ] Create `recipe_translations` table.
    - [ ] Add `user_id` columns to `pantry_items`, `shopping_list`, `planned_recipes`, and `recipes`.
    - [ ] Add `source_locale` to `recipes`.
- [x] **Task 2: Row Level Security (RLS) Implementation** dafac750
    - [ ] Enable RLS on all dynamic tables.
    - [ ] Define policies for `profiles` (owner only).
    - [ ] Define policies for `pantry_items`, `shopping_list`, `planned_recipes` (owner only).
    - [ ] Define policies for `recipes` (Global read, Authenticated insert).
- [x] **Task 3: Supabase Auth Frontend Setup** 9b7d1894
    - [ ] Implement Auth context/hooks to manage session state.
    - [ ] Create a basic Login/Sign-up entry point.
- [ ] **Task: Conductor - User Manual Verification 'Database Foundation & Auth Setup' (Protocol in workflow.md)**

## Phase 2: User-Aware Repositories (TDD)

- [x] **Task 1: Profile Repository (TDD)** b8d473ea
    - [ ] **Write Tests**: Create `SupabaseProfileRepository.test.ts`.
    - [ ] **Implement**: Create `SupabaseProfileRepository.ts` for profile CRUD.
- [ ] **Task 2: Scoping Existing Repositories (TDD)**
    - [ ] **Write Tests**: Update tests for Pantry, Shopping List, and Planner to expect `user_id` filtering.
    - [ ] **Implement**: Update repository implementations to pass the session `user_id` to Supabase calls.
- [ ] **Task 3: Localized Recipe Repository (TDD)**
    - [ ] **Write Tests**: Create tests for fetching recipes with automatic translation joins.
    - [ ] **Implement**: Update `RecipeRepository` to handle locale fallbacks and `user_id` tracking.
- [ ] **Task: Conductor - User Manual Verification 'User-Aware Repositories' (Protocol in workflow.md)**

## Phase 3: Translation Engine & UI Integration

- [ ] **Task 1: AI Translation Service (TDD)**
    - [ ] **Write Tests**: Create `TranslationService.test.ts` mocking OpenRouter.
    - [ ] **Implement**: Create `TranslationService.ts` to prompt MiniMax M2.1 for JSON recipe translations.
- [ ] **Task 2: Profile Page & Language Selector**
    - [ ] **Write Tests**: Component tests for the Profile settings form.
    - [ ] **Implement**: Create `/profile` page with locale, name, and avatar settings.
- [ ] **Task 3: On-Demand Translation Logic in UI**
    - [ ] **Write Tests**: Update `RecipePreview.test.tsx` to verify translation trigger when locales mismatch.
    - [ ] **Implement**: Integrate `TranslationService` into the recipe view flow.
- [ ] **Task: Conductor - User Manual Verification 'Translation Engine & UI Integration' (Protocol in workflow.md)**
