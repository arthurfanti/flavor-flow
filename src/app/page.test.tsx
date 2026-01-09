import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import Home from "./page";

// Mock Supabase and Repositories
jest.mock("../lib/supabase/client", () => ({
  createSupabaseClient: jest.fn(() => ({
    from: jest.fn().mockReturnThis(),
    select: jest.fn().mockReturnThis(),
    order: jest.fn().mockReturnThis(),
    limit: jest.fn().mockReturnThis(),
  })),
}));

jest.mock("../lib/repositories/SupabaseShoppingListRepository", () => ({
  SupabaseShoppingListRepository: jest.fn().mockImplementation(() => ({
    getItems: jest.fn().mockResolvedValue([]),
    addItem: jest.fn().mockResolvedValue(null),
    toggleItem: jest.fn().mockResolvedValue(null),
    removeItem: jest.fn().mockResolvedValue(null),
  })),
}));

jest.mock("../lib/repositories/SupabaseRecipeRepository", () => ({
  SupabaseRecipeRepository: jest.fn().mockImplementation(() => ({
    getLatest: jest.fn().mockResolvedValue([]),
    getAll: jest.fn().mockResolvedValue([]),
    addRecipe: jest.fn().mockResolvedValue(null),
  })),
}));

describe("Home", () => {
  it("renders the heading", () => {
    render(<Home />);
    const heading = screen.getByRole('heading', { name: /Discover/i, level: 1 });
    expect(heading).toBeInTheDocument();
  });

  it("renders the description", () => {
    render(<Home />);
    const description = screen.getByText(/Transform your cooking inspiration/i);
    expect(description).toBeInTheDocument();
  });

  it("renders the UrlInput component", () => {
    render(<Home />);
    expect(screen.getByPlaceholderText(/Paste video URL/i)).toBeInTheDocument();
  });

  it("does not render RecipePreview initially", () => {
    render(<Home />);
    expect(screen.queryByText(/Ingredients/i)).not.toBeInTheDocument();
    expect(screen.queryByText(/Edit Recipe/i)).not.toBeInTheDocument();
  });

  it("renders Recent Extractions section if recipes exist", async () => {
    const mockRecipes = [{ title: 'Recent Recipe', image_url: '', ingredients: [] }];
    // @ts-ignore
    require("../lib/repositories/SupabaseRecipeRepository").SupabaseRecipeRepository.mockImplementation(() => ({
      getLatest: jest.fn().mockResolvedValue(mockRecipes),
    }));

    render(<Home />);
    expect(await screen.findByText(/Recent Extractions/i)).toBeInTheDocument();
    expect(screen.getByText('Recent Recipe')).toBeInTheDocument();
  });

  it("calls addRecipe and refreshes list on successful extraction", async () => {
    // Mock getLatest for initial load
    const mockGetLatest = jest.fn().mockResolvedValue([]);
    // Mock addRecipe
    const mockAddRecipe = jest.fn().mockResolvedValue(null);
    
    // @ts-ignore
    require("../lib/repositories/SupabaseRecipeRepository").SupabaseRecipeRepository.mockImplementation(() => ({
      getLatest: mockGetLatest,
      addRecipe: mockAddRecipe,
    }));

    render(<Home />);
    
    const input = screen.getByPlaceholderText(/Paste video URL/i);
    const button = screen.getByRole('button', { name: /Extract Recipe/i });

    // Type a URL
    fireEvent.change(input, { target: { value: 'https://example.com/recipe' } });
    
    // Click extract
    fireEvent.click(button);

    // Wait for the async actions
    // Since handleExtract is async, we need to wait for something to change or use waitFor
    // The component sets state 'recipe' on success, which renders RecipePreview
    // RecipePreview usually shows the title
    
    // Note: handleExtract logic might use Mock repository if API key is missing. 
    // We can assume it tries to save regardless of source (Mock or API).
    
    // waitFor expecting addRecipe to be called
    await waitFor(() => {
      expect(mockAddRecipe).toHaveBeenCalled();
    });
    
    // Verify getLatest was called again (initial + after save)
    // initial call in useEffect -> 1
    // after save -> 1
    // total 2 calls? Or maybe more if re-renders happen. At least called > 0.
    await waitFor(() => {
       expect(mockGetLatest).toHaveBeenCalledTimes(2); 
    });
  });
});
