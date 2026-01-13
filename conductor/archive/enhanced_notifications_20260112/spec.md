# Track Spec: Enhanced Notifications with Sonner

## Overview
This track replaces native browser `alert()` calls with **Sonner**, a modern toast notification library. It aims to improve user experience by providing non-blocking, visually consistent feedback for system events and major user actions, while optimizing the flow for key interactions like meal planning.

## Functional Requirements
### 1. Toast Notification System
- **Library:** Integrate `sonner` for all toast notifications.
- **Global Error Handling:** All API errors, configuration issues, or unexpected failures must trigger an error toast.
- **Selective Success Feedback:** 
    - Major successes (e.g., "Recipe Successfully Extracted", "Recipe Saved") will trigger a success toast.
    - Minor interactions (e.g., checking an item in the shopping list, updating pantry stock) will rely on **UI-only feedback** (visual changes in the component) rather than toasts.

### 2. Intelligent Redirection
- **Planner Flow:** When a user clicks "Add to Planner" from the recipe preview, the app should:
    1. Complete the background logic (pantry sync and shopping list updates).
    2. Immediately **redirect the user to the Planner view** (`/planner`) instead of showing a success toast on the current page.

## Technical Requirements
- **Installation:** Add `sonner` dependency.
- **Implementation:** 
    - Wrap the application in the `Toaster` component in the root layout.
    - Replace existing `alert()` calls in `src/app/page.tsx` and other components with `toast.error()` or `toast.success()`.
    - Use `next/navigation`'s `useRouter` or `redirect` for the Planner redirection.

## Acceptance Criteria
- No native `alert()` dialogs appear during standard use.
- Critical errors (e.g., invalid URL, network failure) display a clearly visible error toast at the top or bottom of the screen.
- Clicking "Add to Planner" successfully saves the data and lands the user on the `/planner` page.
- Adding an item to the shopping list provides immediate visual feedback in the list without an intrusive toast.

## Out of Scope
- Custom animation configurations for toasts (standard Sonner defaults are fine).
- Swipe-to-dismiss logic for mobile (default Sonner behavior is sufficient).
