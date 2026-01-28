import { render, screen, waitFor } from "@testing-library/react";
import RecipesPage from "./page";

// Mock Auth
jest.mock("@/components/AuthProvider", () => ({
  useAuth: jest.fn(() => ({
    session: { user: { id: 'user-123' } },
    loading: false,
  })),
}));

// Mock Supabase and Repositories
jest.mock("@/lib/supabase/client", () => ({
  createSupabaseClient: jest.fn(() => ({
    from: jest.fn().mockReturnThis(),
    select: jest.fn().mockReturnThis(),
    order: jest.fn().mockReturnThis(),
  })),
}));

jest.mock("@/lib/repositories/SupabaseRecipeRepository", () => ({
  SupabaseRecipeRepository: jest.fn().mockImplementation(() => ({
    getAll: jest.fn().mockResolvedValue([
      { id: 1, title: 'Test Recipe 1', image_url: '' },
      { id: 2, title: 'Test Recipe 2', image_url: '' },
    ]),
  })),
}));

describe("RecipesPage", () => {
  it("renders the heading 'My Recipes'", async () => {
    render(<RecipesPage />);
    const heading = await screen.findByRole('heading', { name: /title/i, level: 1 });
    expect(heading).toBeInTheDocument();
  });

  it("renders a list of recipes from the repository", async () => {
    render(<RecipesPage />);
    
    // Wait for recipes to load
    await waitFor(() => {
      expect(screen.getByText('Test Recipe 1')).toBeInTheDocument();
      expect(screen.getByText('Test Recipe 2')).toBeInTheDocument();
    });
  });

  it("renders empty state when no recipes found", async () => {
    // @ts-ignore
    require("@/lib/repositories/SupabaseRecipeRepository").SupabaseRecipeRepository.mockImplementation(() => ({
      getAll: jest.fn().mockResolvedValue([]),
    }));

    render(<RecipesPage />);
    
    await waitFor(() => {
      expect(screen.getByText(/empty/i)).toBeInTheDocument();
    });
  });
});
