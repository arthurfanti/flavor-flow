# Flavor Flow Styleguide

## Overview
This styleguide defines the visual language for Flavor Flow's "Aesthetic Makeover." It combines the editorial elegance of Airbnb with the high-impact, dynamic lighting effects of Magic UI.

## Typography
### Primary Font (Body & UI)
- **Family**: Inter
- **Usage**: General UI text, inputs, buttons, instructional copy.
- **Weights**: Regular (400), Medium (500), Semibold (600).

### Display Font (Headings & Editorial)
- **Family**: Playfair Display
- **Usage**: Recipe titles, major section headers, hero statements.
- **Weights**: Bold (700), Italic.

## Color Palette

### Base & Backgrounds
- **Background**: `#0F0F0F` (Almost black, better for OLED/Contrast than #000)
- **Surface (Card)**: `#1A1A1A`
- **Glass Surface**: `rgba(255, 255, 255, 0.05)` with `backdrop-filter: blur(12px)`

### Brand Identity (Premium Kitchen)
- **Brand Primary**: `#E05D44` (Terracotta - Warm, appetizing)
- **Brand Secondary**: `#8A9A5B` (Sage - Fresh, organic)
- **Neutral**: `#A0A0A0` (Silver - Metallic/Industrial kitchen feel)

### Magic / Glow Effects (Dark Mode Optimized)
- **Neon Amber**: `#FFBF00` (Used for active states, beams, and "magic" highlights)
- **Cyber Blue**: `#00F0FF` (Used sparingly for "AI" or "Tech" indicators)

## Spacing System
Based on Airbnb's 8pt grid, but allowing 4pt increments for fine-tuning.

- `xs`: 4px
- `sm`: 8px
- `md`: 16px
- `lg`: 24px
- `xl`: 32px
- `2xl`: 48px
- `3xl`: 64px

## Elevation & Shadows
- **Level 1 (Card)**: `0 2px 8px rgba(0, 0, 0, 0.4)`
- **Level 2 (Float)**: `0 8px 24px rgba(0, 0, 0, 0.5)`
- **Level 3 (Magic Glow)**: `0 0 20px rgba(255, 191, 0, 0.3)`

## Animation (Magic UI)
- **Transitions**: `cubic-bezier(0.4, 0, 0.2, 1)` (Standard iOS/Material ease)
- **Durations**:
    - Fast: 200ms
    - Medium: 300ms
    - Slow: 500ms
