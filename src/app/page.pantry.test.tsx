import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import Home from "./page";

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
    addRecipe: jest.fn().mockResolvedValue(null),
  })),
}));

const mockAddItem = jest.fn().mockResolvedValue(null);
jest.mock("../lib/repositories/SupabaseShoppingListRepository", () => ({
  SupabaseShoppingListRepository: jest.fn().mockImplementation(() => ({
    addItem: mockAddItem,
  })),
}));

jest.mock("../lib/repositories/SupabasePlannerRepository", () => ({
  SupabasePlannerRepository: jest.fn().mockImplementation(() => ({
    addToQueue: jest.fn().mockResolvedValue(null),
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

// Mock window.alert
window.alert = jest.fn();

describe("Home Pantry Integration", () => {
  it("filters ingredients against pantry when adding to planner", async () => {
    render(<Home />);
    
    // Simulate an extracted recipe being set
    // We can't easily trigger the internal state from outside without complex mocking
    // But we can trigger handleExtract and mock its result
    
    // Actually, let's just use the 'recipe' state being populated.
    // We need to trigger handleExtract.
    
    const input = screen.getByPlaceholderText(/Paste video URL/i);
    const button = screen.getByRole('button', { name: /Extract Recipe/i });

    fireEvent.change(input, { target: { value: 'https://example.com' } });
    
    // Mocking the extractor inside handleExtract is hard because it's instantiated inside.
    // But we know if process.env.NEXT_PUBLIC_SPOONACULAR_API_KEY is missing, it uses MockRecipeRepository.
    
    fireEvent.click(button);

    // Wait for recipe preview to appear
    // The MockRecipeRepository returns a recipe with "Ingredient A"
    const addPlannerButton = await screen.findByRole('button', { name: /Add to Planner/i });
    
    // Now, before clicking, let's ensure we know what the mock recipe ingredients are.
    // MockRecipe 1 has ['Ingredient A']
    // Pantry has ['Eggs', 'Butter']
    // So 'Ingredient A' should be added to shopping list.
    
    fireEvent.click(addPlannerButton);
    
    await waitFor(() => {
      expect(mockAddItem).toHaveBeenCalledWith({ name: 'Ingredient A', bought: false });
    });
    
    expect(window.alert).toHaveBeenCalledWith(expect.stringContaining("1 items added"));
  });

  it("skips ingredients already in pantry", async () => {
    // Update Pantry Mock for this test
    require("../lib/repositories/SupabasePantryRepository").SupabasePantryRepository.mockImplementation(() => ({
        getItems: jest.fn().mockResolvedValue([
          { id: 1, name: 'Ingredient A', category: 'Test' },
        ]),
    }));

    render(<Home />);
    
    const input = screen.getByPlaceholderText(/Paste video URL/i);
    const button = screen.getByRole('button', { name: /Extract Recipe/i });
    fireEvent.change(input, { target: { value: 'https://example.com' } });
    fireEvent.click(button);

    const addPlannerButton = await screen.findByRole('button', { name: /Add to Planner/i });
    
    // Clear previous calls
    mockAddItem.mockClear();
    
    fireEvent.click(addPlannerButton);
    
    await waitFor(() => {
      expect(window.alert).toHaveBeenCalledWith(expect.stringContaining("0 items added"));
    });
    
    expect(mockAddItem).not.toHaveBeenCalled();
    expect(window.alert).toHaveBeenCalledWith(expect.stringContaining("1 items found in your pantry"));
  });
});
