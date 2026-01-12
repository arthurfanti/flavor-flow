# Plan: True AI Video Extraction with Supadata & MiniMax

## Phase 1: API Infrastructure & Service Layer
- [x] Task: Integrate Supadata for Video Transcription 1cd049b
    - [x] Sub-task: Write unit tests for `SupadataService` (mocking API responses).
    - [x] Sub-task: Implement `SupadataService` to handle transcript extraction.
- [x] Task: Integrate OpenRouter for MiniMax M2.1 0b3258e
    - [x] Sub-task: Write unit tests for `OpenRouterService` (mocking MiniMax output).
    - [x] Sub-task: Implement `OpenRouterService` with specialized prompts for recipe structuring.
- [x] Task: Conductor - User Manual Verification 'Phase 1: API Infrastructure & Service Layer' (Protocol in workflow.md) [checkpoint: cafa214]

## Phase 2: Core Extraction Logic & Multi-Platform Support
- [ ] Task: Implement Unified AI Extractor
    - [ ] Sub-task: Write tests for `VideoAIExtractor` orchestration.
    - [ ] Sub-task: Implement `VideoAIExtractor` orchestrating Supadata -> OpenRouter flow.
    - [ ] Sub-task: Implement fallback logic to scrape descriptions if transcripts are missing.
- [ ] Task: Conductor - User Manual Verification 'Phase 2: Core Extraction Logic & Multi-Platform Support' (Protocol in workflow.md)

## Phase 3: Sophisticated Loading UI (3D Airbnb Style)
- [ ] Task: Design Loading Stage Component
    - [ ] Sub-task: Create visually refined loading states for "Transcribing", "Analyzing", and "Finalizing".
    - [ ] Sub-task: Source or generate 3D-inspired icons/images for each step.
- [ ] Task: Implement UI State Management for Progress
    - [ ] Sub-task: Connect `VideoAIExtractor` progress events to the UI.
- [ ] Task: Conductor - User Manual Verification 'Phase 3: Sophisticated Loading UI' (Protocol in workflow.md)

## Phase 4: Database Sync & Final End-to-End Integration
- [ ] Task: Update Persistence Flow
    - [ ] Sub-task: Ensure AI-extracted recipes map correctly to Supabase `recipes` table.
- [ ] Task: Final Quality Pass & E2E Test
    - [ ] Sub-task: Test with real YouTube, Instagram, and TikTok URLs where the recipe is only spoken.
- [ ] Task: Conductor - User Manual Verification 'Phase 4: Final End-to-End Integration' (Protocol in workflow.md)
