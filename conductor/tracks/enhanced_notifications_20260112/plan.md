# Plan: Enhanced Notifications & Optimized Planner Flow

## Phase 1: Sonner Infrastructure & Error Refactor
- [x] Task: Install Sonner & Setup Toaster 96e9a73
    - [ ] Sub-task: Install `sonner` package.
    - [ ] Sub-task: Add `<Toaster />` component to the root `layout.tsx`.
- [ ] Task: Refactor Error Notifications
    - [ ] Sub-task: Write tests in `page.test.tsx` (or relevant component tests) to expect `toast.error` instead of `alert`.
    - [ ] Sub-task: Replace all `alert()` calls for errors with `toast.error()`.
- [ ] Task: Refactor Major Success Notifications
    - [ ] Sub-task: Update `handleExtract` to use `toast.success` for successful extraction.
    - [ ] Sub-task: Remove redundant alerts for minor actions (Shopping List, Pantry) as per spec.
- [ ] Task: Conductor - User Manual Verification 'Phase 1: Sonner Infrastructure & Error Refactor' (Protocol in workflow.md)

## Phase 2: Planner Interaction Optimization
- [ ] Task: Implement Planner Redirection
    - [ ] Sub-task: Update `handleAddToPlanner` in `page.tsx` to use `useRouter` for redirection.
    - [ ] Sub-task: Ensure redirection occurs *after* the async addition and shopping list sync are complete.
- [ ] Task: Verify Redirection & State Persistence
    - [ ] Sub-task: Write an E2E test in `e2e.test.tsx` to verify the "Add to Planner -> Redirect -> View in Planner" flow.
- [ ] Task: Conductor - User Manual Verification 'Phase 2: Planner Interaction Optimization' (Protocol in workflow.md)

## Phase 3: Final Integration & Cleanup
- [ ] Task: Final Quality Pass
    - [ ] Sub-task: Audit all components for any remaining native `alert()` calls.
    - [ ] Sub-task: Ensure toast styles align with the "Adult Aesthetic" (minimalist styling).
- [ ] Task: Conductor - User Manual Verification 'Phase 3: Final Integration & Cleanup' (Protocol in workflow.md)
