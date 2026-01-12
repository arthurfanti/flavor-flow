# Track Spec: Integrated Recipe Workflow & Intelligent Shopping List

## Overview
This track implements the "missing link" in the Flavor Flow journey: persisting extracted recipes and intelligently automating the shopping list population based on real-time pantry inventory.

## Functional Requirements
### 1. Recipe Persistence & Management
- **Persistence:** Save all successfully extracted recipes to the Supabase `recipes` table.
- **Recipe List View:** Create a new page (`/recipes`) displaying a compact, refined list of all saved recipes for quick scanning.
- **Home Page Updates:** Replace the temporary extraction preview with a "Recent Extractions" section showing the 3 latest recipes (Thumbnail + Title).

### 2. Intelligent Shopping List Integration
- **Contextual Addition:** When a user clicks "Add to Planner", the app must:
    1. Retrieve the list of ingredients for that recipe.
    2. Retrieve the current user's Digital Pantry inventory.
    3. Perform **Fuzzy/Smart Matching** (case-insensitive, singular/plural handling) to determine which ingredients are missing.
    4. Automatically add only the **missing** items to the `shopping_list` table.
- **Feedback:** Provide clear UI feedback on how many items were added vs. how many were already in the pantry.

### 3. Logic & Repositories
- **RecipeRepository:** Extend to support full CRUD and "Latest 3" retrieval.
- **Matching Service:** Implement a utility service to handle the intelligent comparison between recipe ingredients and pantry items.

## Visual & UX Requirements
- **Compact Refinement:** The full recipe list should prioritize information density and ease of scanning while maintaining the "Editorial Elegance" style.
- **Seamless Automation:** The transition from "Planning" to "Shopping" should feel invisible and intelligent to the user.

## Acceptance Criteria
- Successfully extracted recipes are immediately visible in the "Recent Extractions" list.
- Adding a recipe with "Eggs" to the planner does NOT add them to the shopping list if "Egg" is in the pantry.
- The `/recipes` page displays all saved recipes in a refined, text-optimized list.
- Users can navigate from Home to the full recipe list easily.
