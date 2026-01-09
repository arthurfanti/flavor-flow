# Plan: Integrated Recipe Workflow & Intelligent Shopping List

## Phase 1: Recipe Persistence and Repository Expansion
- [x] Task: Extend Recipe Repository for Persistence and Retrieval 47b5abf
    - [x] Sub-task: Update `RecipeRepository` interface with `getLatest(count: number)` and `getAll()`
    - [x] Sub-task: Implement new methods in `SupabaseRecipeRepository` and `MockRecipeRepository`
    - [x] Sub-task: Update `handleExtract` in Home page to persist the extracted recipe
- [ ] Task: Build the Full Recipe List View
    - [ ] Sub-task: Create `/recipes` page with a compact, refined list layout
    - [ ] Sub-task: Implement navigation from Home to the new Recipes page
- [ ] Task: Update Home Page Dashboard
    - [ ] Sub-task: Replace the single preview with a "Recent Extractions" section (Last 3)
    - [ ] Sub-task: Ensure the high-end visual style (Thumbnails + Serif Titles) is maintained
- [ ] Task: Conductor - User Manual Verification 'Phase 1: Recipe Persistence and Repository Expansion' (Protocol in workflow.md)

## Phase 2: Intelligent Matching Logic
- [ ] Task: Implement Intelligent Matching Service
    - [ ] Sub-task: Create `IngredientMatcher` utility with fuzzy matching logic (case-insensitive, simple pluralization)
    - [ ] Sub-task: Write unit tests for various matching scenarios (e.g., "Butter" vs "butter", "Eggs" vs "Egg")
- [ ] Task: Connect Planner to Shopping List with Pantry Awareness
    - [ ] Sub-task: Modify `handleAddToPlanner` to fetch current Pantry inventory
    - [ ] Sub-task: Implement logic to filter ingredients against the Pantry using the `IngredientMatcher`
    - [ ] Sub-task: Automatically push missing ingredients to the `ShoppingListRepository`
- [ ] Task: Implement UX Feedback for Automated Sync
    - [ ] Sub-task: Add notification/alert detail showing "X items added, Y found in pantry"
- [ ] Task: Conductor - User Manual Verification 'Phase 2: Intelligent Matching Logic' (Protocol in workflow.md)

## Phase 3: Final Integration and Quality Pass
- [ ] Task: Verify End-to-End Workflow
    - [ ] Sub-task: Test flow: Extract -> Save -> Plan -> Shop (Offline and Online)
- [ ] Task: Refine Visual Density of Recipe List
    - [ ] Sub-task: Final audit of the compact list UI against "Adult Aesthetic" guidelines
- [ ] Task: Conductor - User Manual Verification 'Phase 3: Final Integration and Quality Pass' (Protocol in workflow.md)
