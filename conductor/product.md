# Product Guide: Flavor Flow

## Initial Concept
it is a recipe app, but not yet another recipe app, no! it is video-based, so the user inputs a url from youtube, instagram or tiktok and the app extracts from it the ingredients list and the steps. But what really makes it stands out is the fact that it has a shopping list combined, so the usar can select which recipes they want for the week's planning and the app will then add ingredients to the list! also, the app has a pantry view where users can keep track of ingredients they have and ones that are missing.

## Target Users
Flavor Flow is designed for a diverse audience focused on simplifying their cooking and shopping experience:
- **Busy Professionals:** Individuals looking to automate the tedious parts of meal planning and grocery shopping.
- **Social-Media Savvy Cooks:** Food enthusiasts who find inspiration on platforms like YouTube, Instagram, and TikTok and want an easy way to save and use those recipes.
- **Students and Solo Dwellers:** People managing their own kitchens who need an efficient way to track their pantry and cook simple meals.

## Core Features (MVP)
- **True AI Video-to-Recipe Extraction:** A cutting-edge pipeline that uses high-fidelity transcription and Large Language Models (MiniMax M2.1) to extract ingredients and steps from any video URL (YouTube, Instagram, TikTok), even when they are only spoken.
- **Intelligent Planner & Shopping List:** A tool to queue recipes for cooking. When adding a recipe to the planner, the app automatically identifies missing ingredients by cross-referencing your Digital Pantry and adds only those items to the shopping list.
- **User Authentication & Profiles:** Secure account creation and management via Supabase Auth. Personalized user profiles allow users to set display names and language preferences.
- **Multilingual Support & On-Demand Translation:** A global recipe library where content is automatically translated into the user's preferred language using AI (MiniMax M2.1) if the original source is different.
- **Recipe Library:** A dedicated space to archive and manage all successfully extracted recipes for future reference.
- **Digital Pantry Management:** A dedicated view for users to track their current inventory, helping to reduce food waste and identify missing ingredients for planned recipes.

## User Experience Goals
- **Immersive "Magic" UI (P0):** A sophisticated, high-contrast interface powered by dynamic lighting, glow effects, and smooth animations that make the application feel premium and interactive.
- **Editorial Cookbook Aesthetic (P1):** A layout anchored by Airbnb's editorial spacing and card-based principles, optimized for a dark mode environment.
- **Immersive AI Experience (P1):** A sophisticated extraction overlay with 3D-inspired icons and smooth transitions that guides the user through the transcription and analysis phases.
- **Offline Capability (P0):** Essential access to shopping lists and pantry inventory even without an internet connection, ensuring reliability in grocery stores or kitchens with poor reception.
- **Seamless Automation (P1):** The transition from planning to shopping is made intelligent through automatic pantry-awareness, reducing manual data entry for the user.
- **Efficient Video Processing (P1):** While prioritizing UX, the app aims for fast and reliable extraction of recipe data from video links to provide a seamless user journey.

## Platform Strategy
- **Progressive Web App (PWA):** Flavor Flow will be built as a PWA to ensure cross-platform compatibility (Web, iOS, Android) while providing the installable experience and offline functionality that users expect from a modern utility app.
