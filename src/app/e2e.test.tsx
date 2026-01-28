import { render, screen, fireEvent, waitFor, cleanup } from "@testing-library/react";
import Home from "./[locale]/page";
import RecipeDetailPage from "./[locale]/recipes/[id]/page";
import RecipesPage from "./[locale]/recipes/page";
import ShoppingListPage from "./[locale]/shopping-list/page";
import PlannerPage from "./[locale]/planner/page";
import { MockRecipeRepository } from "../lib/repositories/MockRecipeRepository";
import { MockShoppingListRepository } from "../lib/repositories/MockShoppingListRepository";
import { MockPlannerRepository } from "../lib/repositories/MockPlannerRepository";
import { MockPantryRepository } from "../lib/repositories/MockPantryRepository";
import { NextIntlClientProvider } from "next-intl";
import { useParams } from "next/navigation";
import messages from "../messages/messages-v3-en.json";

// Mock next/navigation
jest.mock("next/navigation", () => ({
  useParams: jest.fn(),
  useRouter: jest.fn(),
}));

// Mock @/navigation
const mockPush = jest.fn();
jest.mock("@/navigation", () => ({
  useRouter: jest.fn(() => ({
    push: mockPush,
  })),
  usePathname: jest.fn(),
  Link: ({ children, href }: any) => <a href={href}>{children}</a>,
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
jest.mock("../lib/repositories/SupabaseRecipeRepository", () => {
  const { MockRecipeRepository } = require("../lib/repositories/MockRecipeRepository");
  return {
    SupabaseRecipeRepository: jest.fn().mockImplementation((supabase, userId) => new MockRecipeRepository(supabase, userId))
  };
});
jest.mock("../lib/repositories/SupabaseShoppingListRepository", () => {
  const { MockShoppingListRepository } = require("../lib/repositories/MockShoppingListRepository");
  return {
    SupabaseShoppingListRepository: jest.fn().mockImplementation((supabase, userId) => new MockShoppingListRepository(supabase, userId))
  };
});
jest.mock("../lib/repositories/SupabasePlannerRepository", () => {
  const { MockPlannerRepository } = require("../lib/repositories/MockPlannerRepository");
  return {
    SupabasePlannerRepository: jest.fn().mockImplementation((supabase, userId) => new MockPlannerRepository(supabase, userId))
  };
});
jest.mock("../lib/repositories/SupabasePantryRepository", () => {
  const { MockPantryRepository } = require("../lib/repositories/MockPantryRepository");
  return {
    SupabasePantryRepository: jest.fn().mockImplementation((supabase, userId) => new MockPantryRepository(supabase, userId))
  };
});
jest.mock("../lib/repositories/SupabaseProfileRepository", () => ({
  SupabaseProfileRepository: jest.fn().mockImplementation(() => ({
    getProfile: jest.fn().mockResolvedValue({ preferred_locale: 'en' })
  }))
}));

// Mock Supabase Client to succeed
jest.mock("../lib/supabase/client", () => ({
  createSupabaseClient: jest.fn(() => ({})),
}));

// Mock VideoAIExtractor
jest.mock("../lib/services/VideoAIExtractor", () => ({
  VideoAIExtractor: jest.fn().mockImplementation(() => ({
    extractFromUrl: jest.fn().mockResolvedValue({
      title: 'Mock Recipe 1',
      ingredients: ['Ingredient A'],
      instructions: ['Step 1'],
      sourceUrl: 'https://example.com'
    }),
  })),
}));

const renderLocalized = (ui: React.ReactElement) => {
  return render(
    <NextIntlClientProvider locale="en" messages={messages}>
      {ui}
    </NextIntlClientProvider>
  );
};

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
    renderLocalized(<Home />);
    
    const urlInput = screen.getByPlaceholderText(/Paste video URL/i);
    const extractButton = screen.getByRole('button', { name: /Extract Recipe/i });

    fireEvent.change(urlInput, { target: { value: 'https://example.com' } });
    fireEvent.click(extractButton);

    // Verify navigation after extraction (MockRecipeRepository clearForTests has 2 initial recipes, so new one is ID 3)
    await waitFor(() => expect(mockPush).toHaveBeenCalledWith('/recipes/3'));

    cleanup();

    // 2. Recipe Detail Page: Plan the recipe
    (useParams as jest.Mock).mockReturnValue({ id: '3' });
    renderLocalized(<RecipeDetailPage />);
    
    const addPlannerButton = await screen.findByRole('button', { name: /addToPlanner/i });
    expect(screen.getByText('Mock Recipe 1')).toBeInTheDocument();

    fireEvent.click(addPlannerButton);
    await waitFor(() => expect(mockPush).toHaveBeenCalledWith('/planner'));

    cleanup();

    // 3. Recipes Page
    renderLocalized(<RecipesPage />);
    await waitFor(() => {
      expect(screen.getAllByText('Mock Recipe 1').length).toBeGreaterThan(0);
    });

    cleanup();

    // 4. Planner Page
    renderLocalized(<PlannerPage />);
    await waitFor(() => {
      expect(screen.getAllByText('Mock Recipe 1').length).toBeGreaterThan(0);
    });

    cleanup();

    // 5. Shopping List
    renderLocalized(<ShoppingListPage />);
    expect(await screen.findByText('Ingredient A', {}, { timeout: 3000 })).toBeInTheDocument();
  });
});