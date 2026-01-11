# Plan: Live Integration & Mock Removal

## Phase 1: Database Schema & Supabase Configuration
- [x] Task: Create SQL Migration Script 603b64a
    - [x] Sub-task: Define tables for `recipes`, `pantry`, `shopping_list`, and `planned_recipes`
    - [x] Sub-task: Include basic RLS policies for local development/testing
- [x] Task: Environment Variable Audit 1ad701e
    - [x] Sub-task: Ensure `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`, and `NEXT_PUBLIC_SPOONACULAR_API_KEY` are correctly mapped in the app
- [ ] Task: Conductor - User Manual Verification 'Phase 1: Database Schema & Supabase Configuration' (Protocol in workflow.md)

## Phase 2: Live Repository Integration & Mock Removal
- [ ] Task: Verify and Fix Supabase Repositories
    - [ ] Sub-task: Run unit tests for `SupabaseRecipeRepository`, `SupabasePantryRepository`, `SupabaseShoppingListRepository`, and `SupabasePlannerRepository`
    - [ ] Sub-task: Address any failing tests or mismatches between current schema and live Supabase behavior
- [ ] Task: Remove Mock Fallbacks
    - [ ] Sub-task: Update `Home`, `PantryPage`, `ShoppingListPage`, and `PlannerPage` to remove the `try-catch` mock fallback logic
    - [ ] Sub-task: Ensure the application fails gracefully with a clear error message if keys are missing
- [ ] Task: Conductor - User Manual Verification 'Phase 2: Live Repository Integration & Mock Removal' (Protocol in workflow.md)

## Phase 3: Spoonacular Search & Extraction Verification
- [ ] Task: Live Search Integration
    - [ ] Sub-task: Verify search logic using the real Spoonacular API
    - [ ] Sub-task: Ensure results can be saved directly to the Supabase `recipes` table
- [ ] Task: Live Extraction Pass
    - [ ] Sub-task: Verify that extraction from YouTube/Instagram URLs works with the live API
- [ ] Task: Conductor - User Manual Verification 'Phase 3: Spoonacular Search & Extraction Verification' (Protocol in workflow.md)

## Phase 4: Final End-to-End Integration Pass
- [ ] Task: End-to-End Test Suite Execution
    - [ ] Sub-task: Run the comprehensive E2E test against the live (test) environment
    - [ ] Sub-task: Verify manual flow: Extract -> Save -> Plan -> Shop
- [ ] Task: Conductor - User Manual Verification 'Phase 4: Final End-to-End Integration Pass' (Protocol in workflow.md)
