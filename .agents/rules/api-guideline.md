# API Interaction Guideline

This document defines the rules for interacting with APIs and data sources in the Flavor Flow project.

## Rule: The Repository Pattern is Mandatory

All data fetching and persistence logic MUST be abstracted into a **Repository**. This provides a consistent interface for the application to interact with data, regardless of the underlying data source (e.g., Supabase, a REST API, or `localStorage`).

### 1. Define the Interface
- For each data domain (e.g., Recipes, Shopping List), define a TypeScript interface in `/src/lib/repositories/`.
- This interface lists the required methods (e.g., `getItems`, `addItem`).

```typescript
// Example: src/lib/repositories/ShoppingListRepository.ts
export interface ShoppingListItem { ... }
export interface ShoppingListRepository {
  getItems(): Promise<ShoppingListItem[]>;
  addItem(item: Partial<ShoppingListItem>): Promise<void>;
}
```

### 2. Implement the Interface
- Create a concrete implementation of the interface for the specific data source.
- Example: `SupabaseShoppingListRepository` implements `ShoppingListRepository` and uses the Supabase client.
- Mock implementations (e.g., `MockShoppingListRepository`) should also be created for testing and local development.

### 3. Use in the UI
- UI components (e.g., pages in `/src/app`) should instantiate and use a repository to fetch or modify data.
- Components should NOT directly use `fetch`, `axios`, or the `SupabaseClient`.

### 4. Dependency Injection (DI)
- Repositories should receive their dependencies (like the Supabase client) via their constructor. This makes them easy to test.

### Fallback Mechanism
- If a repository relies on external services or environment variables (like Supabase), the UI layer should gracefully handle initialization errors and fall back to a mock repository to prevent crashes.
