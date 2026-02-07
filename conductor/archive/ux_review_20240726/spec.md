# Specification: Flavor Flow UX Overhaul

## 1. Overview
This track focuses on implementing a comprehensive set of UI/UX improvements for the Flavor Flow app's main screens. The goal is to enhance the user experience by refining visual hierarchy, optimizing layout for immersion, improving accessibility, balancing typography, and ensuring clear content discoverability, all while maintaining a premium aesthetic.

## 2. Functional Requirements

### 2.1 Action Hierarchy & Button Design
- Redesign primary action buttons for consistent height and improved visual alignment.
- Clearly differentiate between primary and secondary actions through visual styling (e.g., solid fill for primary, outline for secondary).
- Buttons with long text should either stack vertically to occupy full width or utilize icons only where context allows.

### 2.2 Layout Optimization & Immersive Header
- The existing black header bar (where the app name is currently displayed) must be eliminated.
- **Hero Section:**
    - This section, typically containing the main recipe image and initial overlaid content, must begin at the absolute top of the page.
    - It must span the full width of the viewport.
    - It must have no border-radius, maintaining sharp corners.
- **The "Flavor Flow" logo will be entirely absent from this screen.** Any initial overlay elements (e.g., action buttons or information unrelated to core navigation) may be positioned directly over the recipe image within this Hero Section, with a subtle gradient at the top of the image (if necessary) to ensure text legibility.
- **Subsequent Content Sections:**
    - All sections following the Hero Section (e.g., ingredients, steps) will be wrapped by a single, distinct "content card" or container.
    - This content card will feature rounded borders *only on its top edge*.
    - The content card will visually overlap a small portion of the Hero Section, designed specifically so that the Hero image remains visible behind the rounded top corners of the card.

### 2.3 Dynamic Bottom Navigation Bar
- The former topbar's responsibilities are consolidated and refined.
- **The "Flavor Flow" logo will not be present in the bottom navigation bar.**
- The user profile button will be moved from its previous location (likely the removed topbar) to the new bottom navigation bar.
- The bottom navigation bar will initially be fixed at the bottom of the screen.
- Implement dynamic show/hide logic based on scroll speed:
    - When scrolling down past a predefined speed threshold, the bottom navbar will slide down and hide from view.
    - When scrolling up past a predefined speed threshold, the bottom navbar will slide up and become visible again.
- The bottom navigation bar's background will be a solid very dark graphite gray (`#121212`).
- To ensure visual distinctiveness from the main background, the bottom navbar will feature a subtle visual cue such as a soft shadow or a `1px` darker border along its top edge.

### 2.4 Accessibility & Contrast Improvements
- The primary background color for dark mode will be updated from `#0F0F0F` to a very dark graphite gray (`#121212`) across relevant UI elements to reduce eye strain and improve visual comfort.
    - *Note:* This change necessitates updating the `product-guidelines.md` document to reflect the new background color.
- Improve the contrast of text and tag elements (e.g., "RECEITA PREMIUM") to comply with WCAG accessibility standards. This may involve using more vibrant accent colors or introducing solid background elements behind such text.

### 2.5 Typography & Visual Rhythm
- Adjust the font size of primary titles by approximately 15-20% to prevent awkward line breaks and improve aesthetic balance.
- Refine the spacing (whitespace) between related UI elements (e.g., main title, associated tags, and action buttons) to create more cohesive and logical visual blocks.

### 2.6 Scroll Indication
- Given the new content card overlap, the visibility of the "INGREDIENTES" section will be naturally signaled by the content card's presence. However, ensuring the first line of the "INGREDIENTES" section is partially visible just below the top-rounded edge of the content card is critical to clearly signal to the user that there is more content below.

## 3. Non-Functional Requirements
- **Performance:** Dynamic show/hide animations for the bottom navbar must be smooth and performant, without jank.
- **Aesthetics:** The overall design must maintain an "Adult Aesthetic" and avoid "cartoonish" elements, integrating "Premium Kitchen" accents (Terracotta `#E05D44`, Sage `#8A9A5B`) thoughtfully.
- **Responsiveness:** All UI changes must be fully responsive across various screen sizes (mobile, tablet, desktop as applicable for a PWA).

## 4. Acceptance Criteria
- All functional requirements outlined in Section 2 are implemented and verified.
- The new primary background color (`#121212`) is consistently applied, and `product-guidelines.md` is updated to reflect this change.
- Contrast issues for text and tags are resolved, meeting WCAG standards.
- Typography adjustments lead to improved readability and visual balance.
- Scrollable content is intuitively indicated by the partial visibility of the "INGREDIENTES" section, specifically within the new content card design.
- The bottom navigation bar functions precisely as specified (fixed, dynamic hide/show, solid background, visual distinction), with *only the user profile button* moved to it.
- The "Flavor Flow" logo is entirely absent from this screen.
- The full-width, no-border-radius Hero Section is correctly implemented.
- The content card correctly overlaps the Hero Section with rounded top borders.

## 5. Out of Scope
- Changes to the core functionality of recipe extraction, planning, or shopping list logic beyond UI integration points.
- Any major re-architecture of existing components or systems unless explicitly required to facilitate the UX improvements.
