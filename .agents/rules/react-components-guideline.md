# React Component Guideline

This document provides rules and best practices for creating React components in the Flavor Flow project.

## Rule: Single Responsibility
- Each component should have a single, clear responsibility. A component that fetches data, manages complex state, and renders a sophisticated UI should be broken down.

## Rule: 'use client' for Interactivity
- Components are Server Components by default in the Next.js App Router.
- Add the `'use client';` directive at the top of any file that uses React hooks (`useState`, `useEffect`, etc.) or browser-only APIs.

## File Structure
- Components are located in `src/components/`.
- Each component should have its own file (e.g., `UrlInput.tsx`).
- Tests for a component should be co-located with the file, named `[ComponentName].test.tsx`.

## Styling
- **Tailwind CSS:** All styling MUST be done using Tailwind CSS utility classes. Avoid custom CSS files for individual components.
- **Conditional Classes:** Use template literals for dynamic classes.
  ```tsx
  className={`p-4 ${isActive ? 'bg-yellow-400' : 'bg-gray-100'}`}
  ```

## Props
- **TypeScript:** All components MUST define their props using a TypeScript `interface`.
- **Clarity:** Prop names should be clear and unambiguous (e.g., `isLoading` is better than `loading`).

## State Management
- **Lift State Up:** When multiple components need to share state, lift it to their closest common ancestor.
- **Avoid Prop Drilling:** For deeply nested state, consider using React Context in the future, but for now, lifting state is preferred.

## Example Component Structure
```tsx
'use client'; // If hooks are used

import React, { useState } from 'react';

// 1. Define Props interface
interface MyComponentProps {
  initialCount: number;
}

// 2. Define the Component
export default function MyComponent({ initialCount }: MyComponentProps) {
  const [count, setCount] = useState(initialCount);

  // 3. Render JSX with Tailwind classes
  return (
    <div>
      <p>Count: {count}</p>
      <button 
        onClick={() => setCount(count + 1)}
        className="bg-yellow-400 p-2 rounded-lg"
      >
        Increment
      </button>
    </div>
  );
}
```
# Frontend Skill Guide

This document outlines the core frontend skills and conventions for the Flavor Flow project. All frontend agents should adhere to these guidelines.

## Core Technologies
- **Framework:** Next.js (App Router)
- **Language:** TypeScript
- **UI:** React
- **Styling:** Tailwind CSS

## Architecture & Patterns
- **Component-Based:** All UI is built using React components. Keep components small, focused, and reusable.
- **Repository Pattern:** Data fetching logic is abstracted into repositories (`/src/lib/repositories`). UI components should not directly call data sources (e.g., `fetch` or Supabase client).
- **Service Layer:** External API integrations (like Spoonacular) are handled in a dedicated service layer (`/src/lib/services`).

## Component Guidelines
- **Location:** Components reside in `src/components/`.
- **Client Components:** Use `'use client';` directive for components that require interactivity (hooks, event handlers).
- **Styling:** Use Tailwind CSS utility classes directly in the JSX.
- **Props:** Use TypeScript interfaces for prop types.

## State Management
- **Local State:** Use `useState` for component-level state (e.g., form inputs, UI toggles).
- **Cross-Component State:** For state shared between components (like `recipe` or `shoppingListItems` in `Home`), lift state up to the nearest common ancestor.
- **Server State:** Use `useEffect` for initial data fetching. For more complex scenarios in the future, consider `react-query` as per `tech-stack.md`.