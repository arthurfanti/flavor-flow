# Track Spec: Live Integration & Mock Removal

## Overview
This track focuses on the transition from a prototype using mock data to a fully functional application integrated with Supabase and Spoonacular. The objective is to ensure that all core features (Pantry, Shopping List, Planner, and Recipe Library) are backed by a live database and that recipe data is fetched from the real Spoonacular API.

## Functional Requirements
### 1. Supabase Migration
- **Full Repository Switch:** Update the application to use `SupabaseRecipeRepository`, `SupabasePantryRepository`, `SupabaseShoppingListRepository`, and `SupabasePlannerRepository` exclusively.
- **Database Schema:** Provide a comprehensive SQL migration script to create the necessary tables (`recipes`, `pantry`, `shopping_list`, `planned_recipes`) and basic Row Level Security (RLS) policies.
- **Data Persistence:** Ensure all "Add", "Update", and "Delete" actions are reflected in the live Supabase instance.

### 2. Spoonacular Integration
- **Live Extraction:** Verify and ensure the `SpoonacularExtractor` successfully parses URLs using a live API key.
- **Search Functionality:** Implement or verify the ability to search for recipes via the Spoonacular API and save them to the library.

### 3. Integration Verification
- Remove or disable "Mock Mode" fallbacks once environment variables are detected.
- Implement robust error handling for API failures (e.g., Spoonacular rate limits) and database connection issues.

## Non-Functional Requirements
- **Performance:** Database queries should be optimized for mobile responsiveness.
- **Reliability:** The app must correctly identify when it is connected to live services vs. when configuration is missing.

## Acceptance Criteria
- A SQL script is provided that sets up the entire database schema in one run.
- Extracted recipes are saved to the `recipes` table in Supabase and visible in the UI.
- Searching for recipes returns real-time data from Spoonacular.
- Any change made in the Pantry, Planner, or Shopping List persists after a page refresh.
- Automated tests pass against the live repository implementations (using mocks only for the external network layer during CI).

## Out of Scope
- Advanced user authentication (multi-user isolation) beyond basic Supabase setup.
- Complex real-time synchronization features.
