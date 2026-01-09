# Plan: Integrated Recipe Workflow & Intelligent Shopping List

## Phase 1: Recipe Persistence and Repository Expansion
- [x] Task: Extend Recipe Repository for Persistence and Retrieval 47b5abf
    - [x] Sub-task: Update `RecipeRepository` interface with `getLatest(count: number)` and `getAll()`
    - [x] Sub-task: Implement new methods in `SupabaseRecipeRepository` and `MockRecipeRepository`
    - [x] Sub-task: Update `handleExtract` in Home page to persist the extracted recipe
- [x] Task: Build the Full Recipe List View 4ddad24
    - [x] Sub-task: Create `/recipes` page with a compact, refined list layout
    - [x] Sub-task: Implement navigation from Home to the new Recipes page
- [x] Task: Update Home Page Dashboard 4ddad24
    - [x] Sub-task: Replace the single preview with a "Recent Extractions" section (Last 3)
    - [x] Sub-task: Ensure the high-end visual style (Thumbnails + Serif Titles) is maintained
- [x] Task: Conductor - User Manual Verification 'Phase 1: Recipe Persistence and Repository Expansion' (Protocol in workflow.md) [checkpoint: 9dfb55c]

## Phase 2: Intelligent Matching Logic
- [x] Task: Implement Intelligent Matching Service c76b9e4
    - [x] Sub-task: Create `IngredientMatcher` utility with fuzzy matching logic (case-insensitive, simple pluralization)
    - [x] Sub-task: Write unit tests for various matching scenarios (e.g., "Butter" vs "butter", "Eggs" vs "Egg")
- [x] Task: Connect Planner to Shopping List with Pantry Awareness d998e6e
    - [x] Sub-task: Modify `handleAddToPlanner` to fetch current Pantry inventory
    - [x] Sub-task: Implement logic to filter ingredients against the Pantry using the `IngredientMatcher`
    - [x] Sub-task: Automatically push missing ingredients to the `ShoppingListRepository`
- [x] Task: Implement UX Feedback for Automated Sync d998e6e
    - [x] Sub-task: Add notification/alert detail showing "X items added, Y found in pantry"
- [x] Task: Conductor - User Manual Verification 'Phase 2: Intelligent Matching Logic' (Protocol in workflow.md) [checkpoint: 422769b]

## Phase 3: Final Integration and Quality Pass
- [x] Task: Verify End-to-End Workflow 9691a34
    - [x] Sub-task: Test flow: Extract -> Save -> Plan -> Shop (Offline and Online)
- [x] Task: Refine Visual Density of Recipe List af78af2
    - [x] Sub-task: Final audit of the compact list UI against "Adult Aesthetic" guidelines
- [ ] Task: Conductor - User Manual Verification 'Phase 3: Final Integration and Quality Pass' (Protocol in workflow.md)
