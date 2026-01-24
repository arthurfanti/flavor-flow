# Specification: Auto-Hide Topbar with Velocity Reveal

## Overview
This track implements an intelligent, interaction-aware topbar for Flavor Flow. The goal is to maximize content immersion while maintaining accessibility to navigation. The topbar will hide naturally during downward scrolls and reveal itself only when a high-velocity upward "flick" is detected, providing a "magical" and intentional user experience.

## Functional Requirements
- **Initial State**: The topbar is visible on page load.
- **Natural Hiding (Scroll Down)**: 
    - As the user scrolls down, the topbar remains in its relative position to the content and scrolls out of view naturally.
- **Velocity-Triggered Reveal (Scroll Up)**:
    - The topbar remains hidden during slow or moderate upward scrolls.
    - If the upward scroll velocity exceeds a specific threshold (intentional fast swipe), the topbar reveals itself by sliding down smoothly into a fixed position at the top of the viewport.
- **Fluid Transition**: 
    - Reveal animation should be a smooth slide-down (approx. 300ms) using `framer-motion` to match the project's premium aesthetic.
- **Context Preservation (Re-hiding)**:
    - Once revealed and fixed, if the user scrolls down again, the topbar should "unlock" from its fixed position and scroll away naturally with the page content.

## Technical Requirements
- **Velocity Tracking**: Use `framer-motion`'s `useScroll` and `useVelocity` or a custom scroll listener to calculate real-time scroll speed.
- **Configuration**: The velocity threshold and animation duration should be defined as constants for easy fine-tuning.
- **Component**: Modify the existing header/topbar in `src/components/MainLayout.tsx`.

## Acceptance Criteria
- [ ] Topbar is visible on initial load.
- [ ] Topbar scrolls out of view naturally when scrolling down.
- [ ] Topbar remains hidden during slow upward scrolls.
- [ ] Topbar reveals with a smooth slide-down animation when a fast upward scroll is detected.
- [ ] Topbar scrolls away naturally again if a downward scroll starts after a reveal.
- [ ] Performance is maintained (no layout thrashing or lag during scroll events).

## Out of Scope
- Implementation of a search bar or new navigation items within the topbar.
- Persistent "sticky" topbar behavior (except during the velocity-triggered reveal state).
