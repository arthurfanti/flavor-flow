# Implementation Plan: Comprehensive App Localization

This plan outlines the steps to integrate `next-intl` for UI localization and update the repository layer to ensure all recipe lists display translated content based on the user's preferred locale.

## Phase 1: Localization Infrastructure & Setup [checkpoint: 51e2e26]
- [x] Task: Install and configure `next-intl`
    - [x] Install `next-intl` dependency.
    - [x] Set up the dynamic `[locale]` dynamic segment in `src/app`.
    - [x] Configure `i18n.ts` and middleware for locale detection and redirection.
    - [x] Create initial JSON message files in `messages/` for `en`, `pt-BR`, and `es`.
- [x] Task: Sync User Profile with App Locale
    - [x] **Write Tests**: Verify that the locale switcher correctly updates the `preferred_locale` in Supabase.
    - [x] **Implement**: Logic to update the app's active locale when the user's profile is updated.
- [x] Task: Conductor - User Manual Verification 'Localization Infrastructure & Setup' (Protocol in workflow.md) 51e2e26

## Phase 2: Static UI Localization (Eliminating Hardcoded Strings)
- [x] Task: Localize Core Layout & Navigation 061fd22
    - [ ] **Write Tests**: Check that `TabBar` and `MainLayout` render labels in the active locale.
    - [ ] **Implement**: Move strings from `TabBar`, `MainLayout`, and common headers to JSON messages.
- [x] Task: Localize Home Page & Extraction UI 51e2e26
    - [x] **Write Tests**: Verify "Discover", "Start your recipe", and "Recent Extractions" are localized.
    - [x] **Implement**: Update `src/app/page.tsx` and `UrlInput` to use `useTranslations`.
- [x] Task: Localize Recipe Detail & Editor 6553aa5
    - [ ] **Write Tests**: Ensure buttons like "Add to List", "Edit Recipe", and labels in `RecipeEditor` are localized.
    - [ ] **Implement**: Update `RecipePreview` and `RecipeEditor` components.
- [x] Task: Localize Planner, Shopping List & Pantry a94856f
    - [x] **Write Tests**: Verify all headers and empty state messages are localized.
    - [x] **Implement**: Update `PlannerQueue`, `ShoppingList`, and `PantryList` views.
- [x] Task: Localize Profile & Authentication a94856f
    - [ ] **Write Tests**: Check that profile settings and login forms are localized.
    - [ ] **Implement**: Update `Profile` and `Login` pages.
- [ ] Task: Conductor - User Manual Verification 'Static UI Localization' (Protocol in workflow.md)

## Phase 3: Localized Dynamic Content (Recipe Lists)
- [ ] Task: Update Recipe Repository for List Translations
    - [ ] **Write Tests**: Verify `getLatest` and `getAll` return translated titles when a locale is provided.
    - [ ] **Implement**: Update `SupabaseRecipeRepository` to perform a left join on `recipe_translations` for list-based queries.
- [ ] Task: Localize List Components
    - [ ] **Write Tests**: Ensure `RecipeListItem` displays the translated title if available.
    - [ ] **Implement**: Update `RecipeListItem` and `PlannerQueue` to prioritize translation data.
- [ ] Task: Conductor - User Manual Verification 'Localized Dynamic Content' (Protocol in workflow.md)

## Phase 4: Quality Assurance & Final Polish
- [ ] Task: Verify 100% Localization Coverage
    - [ ] Scan entire `src/` directory for remaining hardcoded English strings.
    - [ ] Ensure all error messages and toast notifications are localized.
- [ ] Task: Final Quality Gates
    - [ ] Run full test suite with `CI=true`.
    - [ ] Verify responsive behavior across all locales (handling longer strings).
    - [ ] Ensure >80% coverage for new localization logic.
- [ ] Task: Conductor - User Manual Verification 'Quality Assurance & Final Polish' (Protocol in workflow.md)
