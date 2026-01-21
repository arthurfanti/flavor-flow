# Specification: Aesthetic Makeover (Magic UI & Airbnb Guidance)

## Overview
This track implements a comprehensive visual makeover for Flavor Flow. We are transitioning from a standard clean look to a sophisticated, highly interactive experience powered by **Magic UI**. The design logic will be anchored by **Airbnb's** editorial spacing and card-based layout principles, but uniquely optimized for a **Dynamic/Dark Mode** environment where glow, neon, and beam effects can truly shine.

## Functional Requirements
- **Styleguide Definition**: 
    - Create a `STYLEGUIDE.md` file at the project root.
    - Define design tokens: Color palette (Premium Kitchen + Glow tokens), Typography (Playfair Display & Inter usage), Spacing (Airbnb-inspired scale), and Elevation (Magic UI shaders/shadows).
- **Magic UI Integration**:
    - Install and configure Magic UI and its dependencies (Framer Motion, Lucide React, etc.).
    - Implement core Magic UI components: `MagicCard`, `ShinyButton`, `AnimatedBeam`, and `NeonGradientCard` across the application.
- **Component Refactor**:
    - Overhaul all primary UI elements (Cards, Buttons, Inputs, Modals) to match the new styleguide and leverage Magic UI animations.
- **Layout Makeover**:
    - **Home / Discovery**: Implement a grid-based layout with high-quality imagery and fluid entry animations.
    - **Recipe Detail**: Editorial-style layout with immersive Magic UI effects for instructions and ingredients.
    - **Planner / Pantry / Shopping List**: Interactive, "magical" lists using Magic UI transitions and soft-elevated cards.
- **Primary Theme Optimization**:
    - Prioritize a high-contrast/dark mode aesthetic that maximizes the visual impact of Magic UI's lighting and motion effects.

## Technical Requirements
- **Library**: `magicui.design` (and associated Peer Dependencies).
- **Animation**: Framer Motion for complex transitions.
- **Tokens**: Synchronize Tailwind config with the new `STYLEGUIDE.md`.

## Acceptance Criteria
- [ ] `STYLEGUIDE.md` is present and comprehensive.
- [ ] The entire application adheres to the dark-mode optimized Airbnb aesthetic.
- [ ] Magic UI components are used "all in" across major pages (Home, Library, Planner, Pantry).
- [ ] UI is responsive and maintains performance despite heavy animation usage.
- [ ] Visual hierarchy remains clear and accessible despite the dynamic effects.

## Out of Scope
- Changes to AI extraction logic or backend repositories.
- Addition of new functional features (focus is purely aesthetic).
