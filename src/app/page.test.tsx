import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import Home from "./page";

// Mock next/navigation
jest.mock("next/navigation", () => ({
  useRouter: jest.fn(() => ({
    push: jest.fn(),
  })),
}));

// Mock sonner
jest.mock("sonner", () => ({
  toast: {
    error: jest.fn(),
    success: jest.fn(),
  },
}));

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
    addItems: jest.fn().mockResolvedValue(null),
    toggleItem: jest.fn().mockResolvedValue(null),
    removeItem: jest.fn().mockResolvedValue(null),
  })),
}));

const mockGetLatest = jest.fn().mockResolvedValue([]);
const mockAddRecipe = jest.fn().mockResolvedValue(null);
jest.mock("../lib/repositories/SupabaseRecipeRepository", () => ({
  SupabaseRecipeRepository: jest.fn().mockImplementation(() => ({
    getLatest: mockGetLatest,
    getAll: jest.fn().mockResolvedValue([]),
    addRecipe: mockAddRecipe,
  })),
}));

jest.mock("../lib/repositories/SupabasePlannerRepository", () => ({
  SupabasePlannerRepository: jest.fn().mockImplementation(() => ({
    addToQueue: jest.fn().mockResolvedValue(null),
  })),
}));

jest.mock("../lib/repositories/SupabasePantryRepository", () => ({
  SupabasePantryRepository: jest.fn().mockImplementation(() => ({
    getItems: jest.fn().mockResolvedValue([]),
  })),
}));

const fetchMock = jest.fn() as jest.MockedFunction<typeof fetch>;
global.fetch = fetchMock;

fetchMock.mockImplementation(() =>
  Promise.resolve({
    ok: true,
    json: () => Promise.resolve({
      // Supadata response
      content: 'Mock transcript content',
      // or OpenRouter response
      choices: [{ message: { content: JSON.stringify({ title: 'Mock Recipe 1', ingredients: ['Ingredient A'], instructions: ['Step 1'] }) } }]
    }),
  } as Response)
);

describe("Home", () => {
  const originalEnv = process.env;

  beforeEach(() => {
    jest.clearAllMocks();
    process.env = { 
      ...originalEnv, 
      NEXT_PUBLIC_SUPADATA_API_KEY: 'valid-key',
      NEXT_PUBLIC_OPENROUTER_API_KEY: 'valid-key',
      NEXT_PUBLIC_SUPABASE_URL: 'https://test.supabase.co',
      NEXT_PUBLIC_SUPABASE_ANON_KEY: 'test-key'
    };
  });

  afterAll(() => {
    process.env = originalEnv;
  });

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
    mockGetLatest.mockResolvedValue(mockRecipes);

    render(<Home />);
    expect(await screen.findByText(/Recent Extractions/i)).toBeInTheDocument();
    expect(screen.getByText('Recent Recipe')).toBeInTheDocument();
    
    // Verify View All link
    const viewAllLink = screen.getByRole('link', { name: /View All/i });
    expect(viewAllLink).toBeInTheDocument();
    expect(viewAllLink).toHaveAttribute('href', '/recipes');
  });

  it("calls addRecipe and refreshes list on successful extraction", async () => {
    // Reset mocks for this test
    mockGetLatest.mockResolvedValue([]);
    mockAddRecipe.mockResolvedValue(null);

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
