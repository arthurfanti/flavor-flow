import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import Home from "./page";

// Mock next/navigation
const mockPush = jest.fn();
jest.mock("next/navigation", () => ({
  useRouter: jest.fn(() => ({
    push: mockPush,
  })),
}));

// Mock Auth
jest.mock("@/components/AuthProvider", () => ({
  useAuth: jest.fn(() => ({
    session: { user: { id: 'user-123' } },
    loading: false,
  })),
}));

// Mock sonner
jest.mock("sonner", () => ({
  toast: {
    error: jest.fn(),
    success: jest.fn(),
  },
}));

// Mock Repositories
jest.mock("../lib/supabase/client", () => ({
  createSupabaseClient: jest.fn(() => ({
    from: jest.fn().mockReturnThis(),
    select: jest.fn().mockReturnThis(),
    order: jest.fn().mockReturnThis(),
    limit: jest.fn().mockReturnThis(),
  })),
}));

jest.mock("../lib/repositories/SupabaseRecipeRepository", () => ({
  SupabaseRecipeRepository: jest.fn().mockImplementation(() => ({
    getLatest: jest.fn().mockResolvedValue([]),
    addRecipe: jest.fn().mockImplementation((r) => Promise.resolve({ id: 123, ...r })),
  })),
}));

jest.mock("../lib/repositories/SupabasePantryRepository", () => ({
  SupabasePantryRepository: jest.fn().mockImplementation(() => ({
    getItems: jest.fn().mockResolvedValue([
      { id: 1, name: 'Eggs', category: 'Dairy' },
      { id: 2, name: 'Butter', category: 'Dairy' },
    ]),
  })),
}));

jest.mock("../lib/services/VideoAIExtractor", () => ({
  VideoAIExtractor: jest.fn().mockImplementation(() => ({
    extractFromUrl: jest.fn().mockResolvedValue({ 
      id: 123,
      title: 'Mock Recipe 1', 
      ingredients: ['Ingredient A'], 
      instructions: ['Step 1'] 
    }),
  })),
}));

describe("Home Page Navigation", () => {
  const originalEnv = process.env;

  beforeEach(() => {
    jest.clearAllMocks();
    process.env = { 
      ...originalEnv, 
      NEXT_PUBLIC_SUPADATA_API_KEY: 'valid-key',
      NEXT_PUBLIC_OPENROUTER_API_KEY: 'valid-key'
    };
  });

  afterAll(() => {
    process.env = originalEnv;
  });

  it("navigates to the recipe detail page after successful extraction", async () => {
    render(<Home />);
    
    const input = screen.getByPlaceholderText(/Paste video URL/i);
    const button = screen.getByRole('button', { name: /Extract Recipe/i });

    fireEvent.change(input, { target: { value: 'https://example.com' } });
    fireEvent.click(button);

    await waitFor(() => {
      expect(mockPush).toHaveBeenCalledWith('/recipes/123');
    });
  });

  it("navigates to the recipe detail page when a recent recipe is clicked", async () => {
    const mockRecipes = [{ id: 456, title: 'Recent Recipe', ingredients: ['Item 1'] }];
    
    // Update Recipe Mock for this test
    const { SupabaseRecipeRepository } = require("../lib/repositories/SupabaseRecipeRepository");
    SupabaseRecipeRepository.mockImplementation(() => ({
      getLatest: jest.fn().mockResolvedValue(mockRecipes),
    }));

    render(<Home />);
    
    const recentRecipe = await screen.findByText('Recent Recipe');
    fireEvent.click(recentRecipe);

    expect(mockPush).toHaveBeenCalledWith('/recipes/456');
  });
});