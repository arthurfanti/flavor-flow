# Specification: Comprehensive App Localization and Multilingual Lists

## Overview
Currently, Flavor Flow uses a `recipe_translations` table for the recipe detail view, but the rest of the application remains hardcoded in English. This track aims to eliminate all hardcoded UI strings by integrating `next-intl` and ensuring that all recipe lists (Home, Search, Planner, etc.) display content in the user's preferred language (en, pt-BR, or es).

## Functional Requirements
- **UI Localization**: Integrate `next-intl` to manage static UI strings (labels, buttons, headers, error messages).
- **Localized Lists**: Update `SupabaseRecipeRepository` and list-based components (`RecipeListItem`, `PlannerQueue`, etc.) to fetch and prioritize the user's preferred language for recipe titles and metadata.
- **Language Selection Sync**: Ensure the `preferred_locale` in the user's Supabase profile is the source of truth for the application's active locale.
- **Initial Language Support**: Provide high-quality translation files for English (en), Portuguese (pt-BR), and Spanish (es).
- **Fallback Strategy**: If a translation is missing for a specific recipe, fall back to the original source language.

## Non-Functional Requirements
- **Performance**: Optimized fetching of translations to avoid "N+1" query patterns in recipe lists.
- **Maintainability**: Centralized storage of UI strings in JSON files according to `next-intl` conventions.

## Acceptance Criteria
- [ ] 100% of UI text is moved from components into localization JSON files.
- [ ] Recipe titles in the "Recent Extractions" list on the Home page match the user's preferred language.
- [ ] Recipes in the Meal Planner and Recipe Library display their translated titles.
- [ ] Changing the language in the Profile page immediately updates the entire app UI and all recipe lists without a full page reload if possible (or via proper Next.js routing).
- [ ] Automated tests verify that components render the correct string based on the active locale.

## Out of Scope
- Adding support for languages beyond English, Portuguese, and Spanish in this specific track.
- Translating legacy data that cannot be mapped to the `recipe_translations` table.
