import {
  cleanup,
  fireEvent,
  render,
  screen,
  waitFor,
} from "@testing-library/react";
import { NextIntlClientProvider } from "next-intl";
import { useParams } from "next/navigation";
import { MockPantryRepository } from "../lib/repositories/MockPantryRepository";
import { MockPlannerRepository } from "../lib/repositories/MockPlannerRepository";
import { MockRecipeRepository } from "../lib/repositories/MockRecipeRepository";
import { MockShoppingListRepository } from "../lib/repositories/MockShoppingListRepository";
import messages from "../messages/messages-v3-en.json";
import AppHome from "./[locale]/app/page";
import PlannerPage from "./[locale]/app/planner/page";
import RecipeDetailPage from "./[locale]/app/recipes/[id]/page";
import RecipesPage from "./[locale]/app/recipes/page";
import ShoppingListPage from "./[locale]/app/shopping-list/page";
import { extractRecipeAction } from "@/app/actions/ai";
import { toast } from "sonner";

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
const mockSession = { user: { id: "user-123" } };
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

jest.mock("@/app/actions/ai", () => ({
  extractRecipeAction: jest.fn(async (url: string) => ({
    title: "Mock Recipe 1",
    ingredients: ["Ingredient A"],
    instructions: ["Step 1"],
    sourceUrl: url,
  })),
}));

// Swap Supabase Repos with Mock Repos for E2E testing logic
jest.mock("../lib/repositories/SupabaseRecipeRepository", () => {
  const {
    MockRecipeRepository,
  } = require("../lib/repositories/MockRecipeRepository");
  return {
    SupabaseRecipeRepository: jest
      .fn()
      .mockImplementation(
        (supabase, userId) => new MockRecipeRepository(supabase, userId),
      ),
  };
});
jest.mock("../lib/repositories/SupabaseShoppingListRepository", () => {
  const {
    MockShoppingListRepository,
  } = require("../lib/repositories/MockShoppingListRepository");
  return {
    SupabaseShoppingListRepository: jest
      .fn()
      .mockImplementation(
        (supabase, userId) => new MockShoppingListRepository(supabase, userId),
      ),
  };
});
jest.mock("../lib/repositories/SupabasePlannerRepository", () => {
  const {
    MockPlannerRepository,
  } = require("../lib/repositories/MockPlannerRepository");
  return {
    SupabasePlannerRepository: jest
      .fn()
      .mockImplementation(
        (supabase, userId) => new MockPlannerRepository(supabase, userId),
      ),
  };
});
jest.mock("../lib/repositories/SupabasePantryRepository", () => {
  const {
    MockPantryRepository,
  } = require("../lib/repositories/MockPantryRepository");
  return {
    SupabasePantryRepository: jest
      .fn()
      .mockImplementation(
        (supabase, userId) => new MockPantryRepository(supabase, userId),
      ),
  };
});
jest.mock("../lib/repositories/SupabaseProfileRepository", () => ({
  SupabaseProfileRepository: jest.fn().mockImplementation(() => ({
    getProfile: jest.fn().mockResolvedValue({ preferred_locale: "en" }),
  })),
}));

// Mock Supabase Client to succeed
jest.mock("../lib/supabase/client", () => ({
  createSupabaseClient: jest.fn(() => ({})),
}));

const renderLocalized = (ui: React.ReactElement) => {
  return render(
    <NextIntlClientProvider locale="en" messages={messages}>
      {ui}
    </NextIntlClientProvider>,
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
      NEXT_PUBLIC_SUPADATA_API_KEY: "valid-key",
      NEXT_PUBLIC_OPENROUTER_API_KEY: "valid-key",
    };
  });

  afterEach(() => {
    cleanup();
    process.env = originalEnv;
  });

  it("should complete the full flow: Extract -> Save -> Plan -> Shop", async () => {
    // 1. Home Page: Extract a recipe
    renderLocalized(<AppHome />);

    const urlInput = screen.getByPlaceholderText(/Paste video URL/i);
    const extractButton = screen.getByRole("button", {
      name: /Extract Recipe/i,
    });

    fireEvent.change(urlInput, { target: { value: "https://example.com/new" } });
    fireEvent.click(extractButton);

    // Verify navigation after extraction (MockRecipeRepository clearForTests has 2 initial recipes, so new one is ID 3)
    await waitFor(() => expect(mockPush).toHaveBeenCalledWith("/app/recipes/3"));

    cleanup();

    // 2. Recipe Detail Page: Plan the recipe
    (useParams as jest.Mock).mockReturnValue({ id: "3" });
    renderLocalized(<RecipeDetailPage />);

    const addPlannerButton = await screen.findByRole("button", {
      name: /addToPlanner/i,
    });
    expect(screen.getByText("Mock Recipe 1")).toBeInTheDocument();

    fireEvent.click(addPlannerButton);
    await waitFor(() => expect(mockPush).toHaveBeenCalledWith("/app/planner"));

    cleanup();

    // 3. Recipes Page
    renderLocalized(<RecipesPage />);
    await waitFor(() => {
      expect(screen.getAllByText("Mock Recipe 1").length).toBeGreaterThan(0);
    });

    cleanup();

    // 4. Planner Page
    renderLocalized(<PlannerPage />);
    await waitFor(() => {
      expect(screen.getAllByText("Mock Recipe 1").length).toBeGreaterThan(0);
    });

    cleanup();

    // 5. Shopping List
    renderLocalized(<ShoppingListPage />);
    expect(
      await screen.findByText("Ingredient A", {}, { timeout: 3000 }),
    ).toBeInTheDocument();
  });

  it("should reuse existing recipe when URL already exists", async () => {
    const existingRecipeId = 42;
    MockRecipeRepository.seedForTests([
      {
        id: existingRecipeId,
        title: "Existing Recipe",
        ingredients: ["Ingredient A"],
        instructions: ["Step 1"],
        source_url: "https://example.com/dupe",
      },
    ]);

    renderLocalized(<AppHome />);

    const urlInput = screen.getByPlaceholderText(/Paste video URL/i);
    const extractButton = screen.getByRole("button", {
      name: /Extract Recipe/i,
    });

    fireEvent.change(urlInput, { target: { value: "https://example.com/dupe/" } });
    fireEvent.click(extractButton);

    await waitFor(() =>
      expect(mockPush).toHaveBeenCalledWith(`/app/recipes/${existingRecipeId}`),
    );
    expect(toast.success).toHaveBeenCalledWith("alreadySaved");
    expect(extractRecipeAction).not.toHaveBeenCalled();
  });
});
