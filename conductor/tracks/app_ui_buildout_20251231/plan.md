# Plan: Comprehensive Application UI Build-out

## Phase 1: Main Application Shell & Navigation [checkpoint: 8333e45]
- [x] Task: Create responsive MainLayout component with Navigation Header (3699974)
    - [x] Sub-task: Write tests for MainLayout (rendering, responsive behavior) (3699974)
    - [x] Sub-task: Implement MainLayout with Tailwind CSS (3699974)
- [x] Task: Implement Bottom Tab Bar for Mobile (57bba59)
    - [x] Sub-task: Write tests for TabBar (active states, navigation links) (57bba59)
    - [x] Sub-task: Implement TabBar with clear icons and serif labels (57bba59)
- [x] Task: Integrate App Shell into Next.js App Router (08dda8e)
    - [x] Sub-task: Update root layout to wrap all pages in MainLayout (08dda8e)
- [x] Task: Conductor - User Manual Verification 'Phase 1: Main Application Shell & Navigation' (Protocol in workflow.md) (8333e45)

## Phase 2: Digital Pantry Module
- [ ] Task: Create Pantry Repository and Domain Types
    - [ ] Sub-task: Define PantryItem interface and category types
    - [ ] Sub-task: Implement SupabasePantryRepository with CRUD operations
    - [ ] Sub-task: Write unit tests for repository methods
- [ ] Task: Build Pantry Inventory View
    - [ ] Sub-task: Write tests for PantryList component (categorization, low-stock filter)
    - [ ] Sub-task: Implement PantryList UI with staggered reveals and editorial headings
- [ ] Task: Implement Pantry Item Management UI
    - [ ] Sub-task: Write tests for Add/Edit item forms
    - [ ] Sub-task: Implement modal or slide-over forms for item creation/updates
- [ ] Task: Conductor - User Manual Verification 'Phase 2: Digital Pantry Module' (Protocol in workflow.md)

## Phase 3: Meal Planner Module
- [ ] Task: Create Planner Repository and Domain Types
    - [ ] Sub-task: Define PlannedRecipe interface
    - [ ] Sub-task: Implement SupabasePlannerRepository (queue management)
    - [ ] Sub-task: Write unit tests for repository methods
- [ ] Task: Build Meal Planner Queue View
    - [ ] Sub-task: Write tests for PlannerQueue component (reordering logic, recipe display)
    - [ ] Sub-task: Implement PlannerQueue UI with reorderable list items and appetizing imagery
- [ ] Task: Connect Home Page to Planner
    - [ ] Sub-task: Add "Add to Planner" action to RecipePreview component
    - [ ] Sub-task: Implement logic to move extracted recipes into the planner queue
- [ ] Task: Conductor - User Manual Verification 'Phase 3: Meal Planner Module' (Protocol in workflow.md)

## Phase 4: Integration & Visual Refinement
- [ ] Task: Implement Global Staggered Reveals and Transitions
    - [ ] Sub-task: Add framer-motion (or CSS transitions) for smooth page switching
- [ ] Task: Final Quality Pass on Typography and Spacing
    - [ ] Sub-task: Audit all views against "Editorial Elegance" and "Adult Aesthetic" guidelines
- [ ] Task: Conductor - User Manual Verification 'Phase 4: Integration & Visual Refinement' (Protocol in workflow.md)
