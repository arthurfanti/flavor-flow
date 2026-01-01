# Plan: Core Recipe Extraction and Shopping List Flow

## Phase 1: Project Scaffolding & PWA Setup [checkpoint: f75e981]
- [x] Task: Initialize Next.js project with TypeScript and Tailwind CSS (3775798)
- [x] Task: Configure PWA support (manifest, service workers, icons) (f52565d)
- [x] Task: Set up Supabase project and client-side repository abstraction (6bbb6be)
- [x] Task: Conductor - User Manual Verification 'Phase 1: Project Scaffolding & PWA Setup' (Protocol in workflow.md) (f75e981)

## Phase 2: Recipe Extraction Service [checkpoint: fe65f44]
- [x] Task: Create Repository and Mock Service for Recipe Extraction (0f4ba0f)
    - [x] Sub-task: Write tests for Recipe Repository (0f4ba0f)
    - [x] Sub-task: Implement Recipe Repository with mock data (0f4ba0f)
- [x] Task: Integrate Third-Party Recipe Extraction API (b77b60f)
    - [x] Sub-task: Write integration tests for API service (b77b60f)
    - [x] Sub-task: Implement API service with real provider (b77b60f)
- [x] Task: Build URL Input and Extraction Loading UI (eed9572)
    - [x] Sub-task: Write tests for URL input component (eed9572)
    - [x] Sub-task: Implement URL input with loading state and sophisticated styling (eed9572)
- [x] Task: Conductor - User Manual Verification 'Phase 2: Recipe Extraction Service' (Protocol in workflow.md) (fe65f44)

## Phase 3: Recipe Display and Editing [checkpoint: c79939d]
- [x] Task: Build Recipe Preview Component (bbc747e)
    - [x] Sub-task: Write tests for Recipe Preview (serif headings, list layout) (bbc747e)
    - [x] Sub-task: Implement Recipe Preview UI (bbc747e)
- [x] Task: Implement Recipe Edit Functionality (0c5c668)
    - [x] Sub-task: Write tests for editing ingredients and steps (0c5c668)
    - [x] Sub-task: Implement edit forms and state persistence (0c5c668)
- [x] Task: Conductor - User Manual Verification 'Phase 3: Recipe Display and Editing' (Protocol in workflow.md) (c79939d)

## Phase 4: Shopping List & Offline Sync
- [ ] Task: Implement Shopping List Store with Offline Persistence
    - [ ] Sub-task: Write tests for shopping list repository (add/toggle/remove)
    - [ ] Sub-task: Implement Supabase sync with local caching/optimistic updates
- [ ] Task: Build Shopping List UI
    - [ ] Sub-task: Write tests for shopping list view and "bought" toggle
    - [ ] Sub-task: Implement shopping list UI (mobile-first, clean design)
- [ ] Task: Connect Recipe Preview to Shopping List
    - [ ] Sub-task: Write tests for "Add ingredients to list" flow
    - [ ] Sub-task: Implement "Add to list" buttons and logic
- [ ] Task: Conductor - User Manual Verification 'Phase 4: Shopping List & Offline Sync' (Protocol in workflow.md)

## Phase 5: Final Polish & PWA Verification
- [ ] Task: Final UI/UX Polish (colors, typography, transitions)
- [ ] Task: Verify PWA Installation and Offline functionality on mobile
- [ ] Task: Conductor - User Manual Verification 'Phase 5: Final Polish & PWA Verification' (Protocol in workflow.md)
