import { render, screen, fireEvent, waitFor, cleanup } from "@testing-library/react";
import Home from "./page";
import RecipeDetailPage from "./recipes/[id]/page";
import RecipesPage from "./recipes/page";
import ShoppingListPage from "./shopping-list/page";
import PlannerPage from "./planner/page";
import { useParams } from "next/navigation";
import { MockRecipeRepository } from "../lib/repositories/MockRecipeRepository";
import { MockShoppingListRepository } from "../lib/repositories/MockShoppingListRepository";
import { MockPlannerRepository } from "../lib/repositories/MockPlannerRepository";
import { MockPantryRepository } from "../lib/repositories/MockPantryRepository";

// Mock next/navigation
const mockPush = jest.fn();
jest.mock("next/navigation", () => ({
  useRouter: jest.fn(() => ({
    push: mockPush,
  })),
  useParams: jest.fn(),
}));

// Mock Auth
const mockSession = { user: { id: 'user-123' } };
const mockAuthContext = {
  session: mockSession,
  loading: false,
};

jest.mock("@/components/AuthProvider", () => ({
  __esModule: true,
  useAuth: () => mockAuthContext,
}));

// Mock sonner
jest.mock("sonner", () => ({
  toast: {
    error: jest.fn(),
    success: jest.fn(),
  },
}));

// Swap Supabase Repos with Mock Repos for E2E testing logic
jest.mock("../lib/repositories/SupabaseRecipeRepository", () => ({
  SupabaseRecipeRepository: jest.fn().mockImplementation((supabase, userId) => new MockRecipeRepository(supabase, userId))
}));
jest.mock("../lib/repositories/SupabaseShoppingListRepository", () => ({
  SupabaseShoppingListRepository: jest.fn().mockImplementation((supabase, userId) => new MockShoppingListRepository(supabase, userId))
}));
jest.mock("../lib/repositories/SupabasePlannerRepository", () => ({
  SupabasePlannerRepository: jest.fn().mockImplementation((supabase, userId) => new MockPlannerRepository(supabase, userId))
}));
jest.mock("../lib/repositories/SupabasePantryRepository", () => ({
  SupabasePantryRepository: jest.fn().mockImplementation((supabase, userId) => new MockPantryRepository(supabase, userId))
}));
jest.mock("../lib/repositories/SupabaseProfileRepository", () => ({
  SupabaseProfileRepository: jest.fn().mockImplementation(() => ({
    getProfile: jest.fn().mockResolvedValue({ preferred_locale: 'en' })
  }))
}));

// Mock Supabase Client to succeed
jest.mock("../lib/supabase/client", () => ({
  createSupabaseClient: jest.fn(() => ({})),
}));

// Mock global fetch for AI Extraction
global.fetch = jest.fn(() =>
  Promise.resolve({
    ok: true,
    json: () => Promise.resolve({
      // Supadata response
      content: 'Mock transcript content',
      // or OpenRouter response
      choices: [{ message: { content: JSON.stringify({ title: 'Mock Recipe 1', ingredients: ['Ingredient A'], instructions: ['Step 1'] }) } }]
    }),
  })
) as jest.Mock;

describe("End-to-End Workflow", () => {
  const originalEnv = process.env;

  beforeEach(() => {
    MockRecipeRepository.clearForTests();
    MockShoppingListRepository.clearForTests();
    MockPlannerRepository.clearForTests();
    MockPantryRepository.clearForTests();
    jest.clearAllMocks();
    process.env = { 
      ...originalEnv, 
      NEXT_PUBLIC_SUPADATA_API_KEY: 'valid-key',
      NEXT_PUBLIC_OPENROUTER_API_KEY: 'valid-key'
    };
  });

  afterEach(() => {
    cleanup();
    process.env = originalEnv;
  });

  it("should complete the full flow: Extract -> Save -> Plan -> Shop", async () => {
    // 1. Home Page: Extract a recipe
    render(<Home />);
    
    const urlInput = screen.getByPlaceholderText(/Paste video URL/i);
    const extractButton = screen.getByRole('button', { name: /Extract Recipe/i });

    fireEvent.change(urlInput, { target: { value: 'https://example.com' } });
    fireEvent.click(extractButton);

    // Verify navigation after extraction (MockRecipeRepository clearForTests has 2 initial recipes, so new one is ID 3)
    await waitFor(() => expect(mockPush).toHaveBeenCalledWith('/recipes/3'));

    cleanup();

    // 2. Recipe Detail Page: Plan the recipe
    (useParams as jest.Mock).mockReturnValue({ id: '3' });
    render(<RecipeDetailPage />);
    
    const addPlannerButton = await screen.findByRole('button', { name: /Add to Planner/i });
    expect(screen.getByText('Mock Recipe 1')).toBeInTheDocument();

    fireEvent.click(addPlannerButton);
    await waitFor(() => expect(mockPush).toHaveBeenCalledWith('/planner'));

    cleanup();

    // 3. Recipes Page
    render(<RecipesPage />);
    await waitFor(() => {
      expect(screen.getAllByText('Mock Recipe 1').length).toBeGreaterThan(0);
    });

    cleanup();

    // 4. Planner Page
    render(<PlannerPage />);
    await waitFor(() => {
      expect(screen.getAllByText('Mock Recipe 1').length).toBeGreaterThan(0);
    });

    cleanup();

    // 5. Shopping List
    render(<ShoppingListPage />);
    expect(await screen.findByText('Ingredient A', {}, { timeout: 3000 })).toBeInTheDocument();
  });
});
