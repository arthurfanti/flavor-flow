import { render, screen, fireEvent, waitFor, cleanup } from "@testing-library/react";
import Home from "./page";
import RecipesPage from "./recipes/page";
import ShoppingListPage from "./shopping-list/page";
import PlannerPage from "./planner/page";
import { MockRecipeRepository } from "../lib/repositories/MockRecipeRepository";
import { MockShoppingListRepository } from "../lib/repositories/MockShoppingListRepository";
import { MockPlannerRepository } from "../lib/repositories/MockPlannerRepository";
import { MockPantryRepository } from "../lib/repositories/MockPantryRepository";

// Mock Supabase
jest.mock("../lib/supabase/client", () => ({
  createSupabaseClient: jest.fn(() => {
    throw new Error("Supabase not configured");
  }),
}));

// Mock window.alert
window.alert = jest.fn();

describe("End-to-End Workflow", () => {
  beforeEach(() => {
    MockRecipeRepository.clearForTests();
    MockShoppingListRepository.clearForTests();
    MockPlannerRepository.clearForTests();
    MockPantryRepository.clearForTests();
    jest.clearAllMocks();
  });

  afterEach(cleanup);

  it("should complete the full flow: Extract -> Save -> Plan -> Shop", async () => {
    // 1. Home Page: Extract a recipe
    render(<Home />);
    
    const urlInput = screen.getByPlaceholderText(/Paste video URL/i);
    const extractButton = screen.getByRole('button', { name: /Extract Recipe/i });

    fireEvent.change(urlInput, { target: { value: 'https://example.com' } });
    fireEvent.click(extractButton);

    const addPlannerButton = await screen.findByRole('button', { name: /Add to Planner/i });
    // Use getAllByText because it appears in header AND preview
    expect(screen.getAllByText('Mock Recipe 1').length).toBeGreaterThan(0);

    // 2. Add to Planner
    fireEvent.click(addPlannerButton);
    await waitFor(() => expect(window.alert).toHaveBeenCalled());

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
    expect(await screen.findByText('Ingredient A')).toBeInTheDocument();
  });
});
