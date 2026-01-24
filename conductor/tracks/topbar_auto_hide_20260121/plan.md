# Plan: Auto-Hide Topbar with Velocity Reveal

This plan implements an intelligent topbar that reveals itself only upon high-velocity upward scrolls, optimizing content immersion.

## Phase 1: Foundation & Scroll Logic [checkpoint: 3ab6252]

- [x] Task 1: Scroll Velocity Detection 0652d3e
    - [ ] Write Tests: Create `src/lib/hooks/useScrollVelocity.test.ts` to verify velocity calculation and threshold crossing logic.
    - [ ] Implement: Create `useScrollVelocity` hook to track scroll direction and speed.
- [x] Task: Conductor - User Manual Verification 'Foundation & Scroll Logic' (Protocol in workflow.md)

## Phase 2: UI & Animation Integration [checkpoint: 2f58c90]

- [x] Task 1: Header Animation Logic 396ddf8
    - [ ] Write Tests: Update `src/components/MainLayout.test.tsx` to verify the header's visibility states based on scroll triggers.
    - [ ] Implement: Refactor the header in `src/components/MainLayout.tsx` to use `framer-motion` for the sliding transition.
- [x] Task 2: Natural Flow & Unlocking Logic 0ee840d
    - [ ] Write Tests: Verify the transition from "Fixed/Revealed" back to "Natural/Scrolling" when a downward scroll occurs.
    - [ ] Implement: Ensure the header "unlocks" its fixed position correctly when scrolling down.
- [x] Task: Conductor - User Manual Verification 'UI & Animation Integration' (Protocol in workflow.md)

## Phase 3: Polish & Refinement

- [x] Task 1: Threshold Calibration 2f3245c
    - [ ] Implement: Fine-tune the velocity constant based on real-world "flick" behavior on mobile and desktop.
- [x] Task: Conductor - User Manual Verification 'Polish & Refinement' (Protocol in workflow.md)
