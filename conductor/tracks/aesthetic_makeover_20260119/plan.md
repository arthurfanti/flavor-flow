# Plan: Aesthetic Makeover (Magic UI & Airbnb Guidance)

This plan overhauls the application's visual identity using Magic UI and Airbnb design principles, optimized for a high-contrast dark aesthetic.

## Phase 1: Foundation & Design System [checkpoint: a84f79c]

- [x] Task 1: Design Tokens & Styleguide efc86f2
    - [ ] Create `STYLEGUIDE.md` with tokens for Colors (Glow/Neon focus), Typography, Spacing, and Elevation.
    - [ ] Update `tailwind.config.ts` to include new tokens and Magic UI animation extensions.
- [x] Task 2: Library Integration 262350a
    - [ ] Install `magic-ui` and peer dependencies (`framer-motion`, `lucide-react`, `clsx`, `tailwind-merge`).
    - [ ] Configure `lib/utils.ts` for cn helper if not already optimized.
- [x] Task: Conductor - User Manual Verification 'Foundation & Design System' (Protocol in workflow.md)

## Phase 2: Component Makeover (TDD) [checkpoint: eaf994a]

- [x] Task 1: Core Interactive Elements f0dde50
    - [ ] Write Tests: Verify visual state and accessibility for new components.
    - [ ] Implement: Overhaul Buttons (using `ShinyButton` logic), Inputs, and Modals.
- [x] Task 2: Card & Surface System 861e6a8
    - [ ] Write Tests: Ensure layout consistency across different content types.
    - [ ] Implement: Create `MagicCard` and `NeonGradientCard` wrappers for Recipes and Pantry items.
- [x] Task: Conductor - User Manual Verification 'Component Makeover' (Protocol in workflow.md)

## Phase 3: Page-Level Overhaul [checkpoint: c6872df]

- [x] Task 1: Immersive Discovery (Home) 7825ec4
- [x] Task 2: Editorial Recipe Detail ed6548e
- [x] Task 3: Interactive Tooling (Pantry/Planner/List) bfbf12a
- [x] Task: Conductor - User Manual Verification 'Page-Level Overhaul' (Protocol in workflow.md) 41472af
