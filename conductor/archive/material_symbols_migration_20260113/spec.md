# Specification: Migration to Material Symbols Icons

## Overview
This track involves replacing the existing inline SVG icons in the main navigation (TabBar) with Google's Material Symbols (Rounded style). This change aims to provide a more consistent, modern, and easily maintainable iconography system across the Flavor Flow application.

## Functional Requirements
- Integrate the Material Symbols Rounded stylesheet into the application's root layout.
- Create a reusable `Icon` component to abstract the Material Symbols implementation.
- Update the `TabBar` component to use the new `Icon` component for all navigation items:
    - **Home**: `home`
    - **Planner**: `calendar_month`
    - **Pantry**: `kitchen`
    - **Shopping**: `shopping_bag`
- Ensure the icons maintain the current sizing (6x6 in Tailwind units / 24px) and color logic (active vs. inactive states).

## Non-Functional Requirements
- **Consistency**: The new icons should align with the "Mobile-First & Clean Design" goal of the project.
- **Maintainability**: Using a helper component ensures that future icon updates or style changes can be handled in a single location.
- **Performance**: Standard Google Fonts loading via stylesheet.

## Acceptance Criteria
- [ ] Material Symbols Rounded stylesheet is successfully loaded in `layout.tsx`.
- [ ] A new `Icon.tsx` component exists in `src/components/`.
- [ ] `TabBar.tsx` uses the `Icon` component for all 4 navigation items.
- [ ] Icons display correctly on mobile and desktop views.
- [ ] Active navigation item correctly highlights the icon with `text-brand-yellow-dark`.
- [ ] No regression in the layout or responsiveness of the TabBar.

## Out of Scope
- Replacing icons in other parts of the application (unless explicitly requested later).
- Changing the visual style of the TabBar labels or general layout.
