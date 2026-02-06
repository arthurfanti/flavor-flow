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

### Phase 2: Core Layout Implementation

- [ ] Task: Remove existing topbar and associated components
    - [ ] Identify and remove rendering of the current topbar component.
    - [ ] Ensure no regressions on pages that might have used the topbar.
- [ ] Task: Implement full-width, no-border-radius Hero Section
    - [ ] Identify the main container for the recipe image.
    - [ ] Adjust CSS to ensure the recipe image extends to the absolute top of the page.
    - [ ] Ensure the Hero Section spans full width and has no border-radius.
- [ ] Task: Design and implement the content card with rounded top borders
    - [ ] Create a new React component for the content card or modify an existing one.
    - [ ] Apply CSS to ensure rounded borders only on the top edge.
    - [ ] Position the card to visually overlap a small part of the Hero Section, making the image visible behind its rounded corners.
- [ ] Task: Integrate logo-free overlay elements within the Hero Section
    - [ ] Identify any elements that should overlay the Hero image (excluding the logo).
    - [ ] Position these elements appropriately.
    - [ ] Apply a subtle gradient to the top of the Hero image if necessary to ensure legibility of overlaid elements.
- [ ] Task: Conductor - User Manual Verification 'Core Layout Implementation' (Protocol in workflow.md)

### Phase 3: Bottom Navbar & Navigation Logic

- [ ] Task: Identify or create a bottom navigation component
    - [ ] Check for `src/components/TabBar.tsx` as a potential candidate for modification.
    - [ ] If no suitable component exists, scaffold a new `BottomNavbar.tsx` component.
- [ ] Task: Move user profile button to the bottom navigation bar
    - [ ] Identify the existing user profile button component.
    - [ ] Integrate it into the chosen bottom navigation component.
- [ ] Task: Implement dynamic show/hide logic for the bottom navbar
    - [ ] Write unit tests for scroll-based show/hide behavior (Red Phase).
    - [ ] Implement event listeners for scroll and scroll speed detection.
    - [ ] Apply CSS transitions for smooth sliding animation (Green Phase).
    - [ ] Refactor logic for efficiency and readability.
- [ ] Task: Style the bottom navbar with solid background and visual distinction
    - [ ] Apply `background-color: #121212`.
    - [ ] Add a subtle shadow or a `1px` darker border on the top edge for visual distinction.
- [ ] Task: Conductor - User Manual Verification 'Bottom Navbar & Navigation Logic' (Protocol in workflow.md)

### Phase 4: UI Refinements & Accessibility

- [ ] Task: Refactor action buttons for hierarchy and design consistency
    - [ ] Write unit tests for button styling and state (e.g., primary/secondary variations).
    - [ ] Adjust CSS for consistent height and alignment.
    - [ ] Implement visual differentiation based on primary/secondary roles.
    - [ ] Address long text scenarios (stacking or icon-only).
- [ ] Task: Improve contrast for tags and text elements
    - [ ] Identify specific elements (e.g., "RECEITA PREMIUM") with low contrast.
    - [ ] Write unit tests to verify contrast ratios if possible, or visually inspect.
    - [ ] Modify CSS to use vibrant accents or solid backgrounds as needed to meet WCAG.
- [ ] Task: Adjust typography and spacing
    - [ ] Write unit tests for typography (e.g., specific font sizes and line heights).
    - [ ] Reduce font size of primary titles by 15-20%.
    - [ ] Refine whitespace between related UI elements to create logical blocks.
- [ ] Task: Ensure scroll indication for ingredients
    - [ ] Write integration tests to verify partial visibility of ingredients.
    - [ ] Adjust the positioning of the content card and ingredients section to ensure the first line is partially visible above the bottom navbar.
- [ ] Task: Conductor - User Manual Verification 'UI Refinements & Accessibility' (Protocol in workflow.md)

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
