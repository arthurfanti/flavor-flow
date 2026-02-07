# Implementation Plan: Flavor Flow UX Overhaul

## Overview
This plan outlines the steps to implement the UI/UX improvements specified in `spec.md` for the Flavor Flow application. The focus is on enhancing the main screens' visual appeal, usability, and accessibility, adhering to TDD principles and the project's GitFlow workflow.

## Phases

### Phase 1: Setup & Initial Assessment [checkpoint: 7ffdd4f3]

- [x] Task: Create feature branch for UX overhaul
    - [x] Identify `develop` branch as base.
    - [x] Create `feature/ux-overhaul` branch.
- [x] Task: Review existing `MainLayout` component and relevant page files
    - [x] Read `src/components/MainLayout.tsx` to understand global layout.
    - [x] Read `src/app/[locale]/app/page.tsx` or similar primary display page to understand current component structure for main recipe display.
    - [x] Identify current topbar implementation (if any) and its components.
    - [x] Identify current bottom navigation implementation (if any).
- [x] Task: Update `product-guidelines.md` for new background color
    - [x] Confirm `#121212` has replaced `#0F0F0F` as the primary dark background. (Already completed)
- [x] Task: Conductor - User Manual Verification 'Setup & Initial Assessment' (Protocol in workflow.md)

### Phase 2: Core Layout Implementation [checkpoint: 562077fc]

- [x] Task: Remove existing topbar and associated components
    - [x] Identify and remove rendering of the current topbar component.
    - [x] Ensure no regressions on pages that might have used the topbar.
- [x] Task: Implement full-width, no-border-radius Hero Section
    - [x] Identify the main container for the recipe image.
    - [x] Adjust CSS to ensure the recipe image extends to the absolute top of the page.
    - [x] Ensure the Hero Section spans full width and has no border-radius.
- [x] Task: Design and implement the content card with rounded top borders
    - [x] Create a new React component for the content card or modify an existing one.
    - [x] Apply CSS to ensure rounded borders only on the top edge.
    - [x] Position the card to visually overlap a small part of the Hero Section, making the image visible behind its rounded corners.
- [x] Task: Integrate logo-free overlay elements within the Hero Section
    - [x] Identify any elements that should overlay the Hero image (excluding the logo).
    - [x] Position these elements appropriately.
    - [x] Apply a subtle gradient to the top of the Hero image if necessary to ensure legibility of overlaid elements.
- [x] Task: Fix Layout & Add Parallax Effects (Feedback Iteration)
    - [x] Implement fixed/sticky positioning for Hero image to allow content to scroll over it.
    - [x] Ensure proper z-index and negative margin for the content card to achieve visual overlap.
    - [x] Implement scroll-based opacity fading for the Hero image.
- [x] Task: Apply Hero Parallax Effects to Home Page (Consistency)
    - [x] Update `src/app/[locale]/app/page.tsx` to match `RecipePreview` hero animations (fixed position, opacity/scale on scroll).
- [x] Task: Conductor - User Manual Verification 'Core Layout Implementation' (Protocol in workflow.md)

### Phase 3: Bottom Navbar & Navigation Logic [checkpoint: 5ee8f8ea]

- [x] Task: Identify or create a bottom navigation component
    - [x] Check for `src/components/TabBar.tsx` as a potential candidate for modification.
    - [x] If no suitable component exists, scaffold a new `BottomNavbar.tsx` component.
- [x] Task: Move user profile button to the bottom navigation bar
    - [x] Identify the existing user profile button component.
    - [x] Integrate it into the chosen bottom navigation component.
- [x] Task: Implement dynamic show/hide logic for the bottom navbar
    - [x] Write unit tests for scroll-based show/hide behavior (Red Phase).
    - [x] Implement event listeners for scroll and scroll speed detection.
    - [x] Apply CSS transitions for smooth sliding animation (Green Phase).
    - [x] Refactor logic for efficiency and readability.
- [x] Task: Style the bottom navbar with solid background and visual distinction
    - [x] Apply `background-color: #121212`.
    - [x] Add a subtle shadow or a `1px` darker border on the top edge for visual distinction.
- [x] Task: Conductor - User Manual Verification 'Bottom Navbar & Navigation Logic' (Protocol in workflow.md)

### Phase 4: UI Refinements & Accessibility [checkpoint: d1d040c4]

- [x] Task: Refactor action buttons for hierarchy and design consistency
    - [x] Write unit tests for button styling and state (e.g., primary/secondary variations).
    - [x] Adjust CSS for consistent height and alignment.
    - [x] Implement visual differentiation based on primary/secondary roles.
    - [x] Address long text scenarios (stacking or icon-only).
- [x] Task: Improve contrast for tags and text elements
    - [x] Identify specific elements (e.g., "RECEITA PREMIUM" tag) with low contrast.
    - [x] Write unit tests to verify contrast ratios if possible, or visually inspect.
    - [x] Modify CSS to use vibrant accents or solid backgrounds as needed to meet WCAG.
- [x] Task: Adjust typography and spacing
    - [x] Write unit tests for typography (e.g., specific font sizes and line heights).
    - [x] Reduce font size of primary titles by 15-20%.
    - [x] Refine whitespace between related UI elements to create logical blocks.
- [x] Task: Ensure scroll indication for ingredients
    - [x] Write integration tests to verify partial visibility of ingredients.
    - [x] Adjust the positioning of the content card and ingredients section to ensure the first line is partially visible above the bottom navbar.
- [x] Task: Conductor - User Manual Verification 'UI Refinements & Accessibility' (Protocol in workflow.md)

### Phase 5: Final Review & Integration

- [ ] Task: Conduct comprehensive review against all Acceptance Criteria
    - [ ] Verify all functional and non-functional requirements are met.
    - [ ] Check responsiveness across target devices (mobile, tablet).
    - [ ] Confirm absence of "Flavor Flow" logo from the screen.
- [ ] Task: Perform cross-browser compatibility testing
    - [ ] Test on Chrome, Firefox, Safari (mobile and desktop).
- [ ] Task: Merge `feature/ux-overhaul` into `develop`
    - [ ] Follow GitFlow process for merging and branch cleanup.
- [ ] Task: Conductor - User Manual Verification 'Final Review & Integration' (Protocol in workflow.md)
