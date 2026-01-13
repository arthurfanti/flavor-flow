# Plan: Migration to Material Symbols Icons

This plan outlines the steps to replace existing navigation icons with Google's Material Symbols Rounded, ensuring consistency and maintainability.

## Phase 1: Infrastructure and Helper Component [checkpoint: 34b0949]

- [x] **Task 1: Integrate Material Symbols Stylesheet** 8745b4ac
- [x] **Task 2: Create Reusable Icon Component (TDD)** 469af4df
- [x] **Task: Conductor - User Manual Verification 'Infrastructure and Helper Component' (Protocol in workflow.md)** 34b0949

## Phase 2: TabBar Migration

- [x] **Task 1: Update TabBar Navigation (TDD)** 7c96f567
    - [ ] **Write Tests (Red Phase)**: Update `src/components/TabBar.test.tsx` to expect the `Icon` component (or its underlying HTML structure) with the new icon names (`home`, `calendar_month`, `kitchen`, `shopping_bag`).
    - [ ] **Implement (Green Phase)**: Update `src/components/TabBar.tsx` to remove SVG paths and use the `Icon` component for all navigation items.
    - [ ] **Refactor/Coverage**: Ensure tests pass and the UI remains visually consistent.
- [ ] **Task: Conductor - User Manual Verification 'TabBar Migration' (Protocol in workflow.md)**
