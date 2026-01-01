import { render, screen } from "@testing-library/react";
import Home from "./page";

// Mock Supabase and Repositories
jest.mock("../lib/supabase/client", () => ({
  createSupabaseClient: jest.fn(() => ({
    from: jest.fn().mockReturnThis(),
    select: jest.fn().mockReturnThis(),
    order: jest.fn().mockReturnThis(),
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

describe("Home", () => {
  it("renders the heading", () => {
    render(<Home />);
    const heading = screen.getByRole('heading', { name: /Flavor Flow/i, level: 1 });
    expect(heading).toBeInTheDocument();
  });

  it("renders the description", () => {
    render(<Home />);
    const description = screen.getByText(/Turn your favorite cooking videos/i);
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
});
