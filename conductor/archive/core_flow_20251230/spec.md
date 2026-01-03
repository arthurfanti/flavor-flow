# Track Spec: Core Recipe Extraction and Shopping List Flow

## Overview
This track focuses on the core value proposition of Flavor Flow: converting social media video URLs (YouTube, Instagram, TikTok) into actionable recipes and automatically populating a shopping list that works offline.

## Objectives
- Implement a Progressive Web App (PWA) shell using Next.js and Tailwind CSS.
- Integrate a third-party Recipe Extraction API.
- Create a user flow: Paste URL -> View Extracted Recipe -> Add to Shopping List.
- Enable offline access for the shopping list using Supabase/Local Storage/Service Workers.

## Key Features
- **URL Input Component:** A clean, mobile-first input field for pasting video URLs.
- **Recipe Preview:** A sophisticated display of the extracted ingredients and steps, using the editorial serif headings defined in our guidelines.
- **Recipe Editing:** Allow users to manually adjust extracted data.
- **Shopping List View:** A consolidated list of ingredients from planned recipes, with "bought" toggles.
- **Offline Persistence:** Ensure the shopping list remains functional without an internet connection.

## Technical Considerations
- **Frontend:** Next.js (App Router), Tailwind CSS, React Query.
- **Backend/Storage:** Supabase for authentication and data persistence, with offline sync capabilities.
- **API:** Selection and integration of a specialized recipe extraction service.
- **PWA:** Configuration of service workers and manifest for "installable" experience.

## Acceptance Criteria
- User can paste a valid YouTube/Instagram/TikTok URL and receive structured recipe data.
- User can edit the extracted data.
- User can add ingredients to a global shopping list.
- Shopping list is accessible and editable while offline.
- The app can be installed on a mobile home screen.
