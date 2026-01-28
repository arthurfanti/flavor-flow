import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import Home from "./[locale]/page";
import { toast } from "sonner";
import { NextIntlClientProvider } from "next-intl";
import messages from "../messages/messages-v3-en.json";

// Mock @/navigation
const mockPush = jest.fn();
jest.mock("@/navigation", () => ({
  useRouter: jest.fn(() => ({
    push: mockPush,
  })),
  Link: ({ children, href }: any) => <a href={href}>{children}</a>,
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

jest.mock("../lib/repositories/SupabaseRecipeRepository", () => ({
  SupabaseRecipeRepository: jest.fn().mockImplementation(() => ({
    getLatest: jest.fn().mockResolvedValue([]),
    getAll: jest.fn().mockResolvedValue([]),
    addRecipe: jest.fn().mockImplementation((r) => Promise.resolve({ id: 123, ...r })),
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

jest.mock("../lib/services/VideoAIExtractor", () => ({
  VideoAIExtractor: jest.fn().mockImplementation(() => ({
    extractFromUrl: jest.fn(),
  })),
}));

const renderHome = () => {
  return render(
    <NextIntlClientProvider locale="en" messages={messages}>
      <Home />
    </NextIntlClientProvider>
  );
};

describe("Home Notifications", () => {
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

  it("calls toast.error when extraction fails", async () => {
    const { VideoAIExtractor } = require("../lib/services/VideoAIExtractor");
    const mockExtract = jest.fn().mockRejectedValue(new Error("Failed to fetch"));
    VideoAIExtractor.mockImplementation(() => ({
      extractFromUrl: mockExtract,
    }));

    renderHome();
    
    const input = screen.getByPlaceholderText(/Paste video URL/i);
    const button = screen.getByRole('button', { name: /Extract Recipe/i });

    fireEvent.change(input, { target: { value: 'https://example.com/fail' } });
    fireEvent.click(button);

    await waitFor(() => {
      expect(toast.error).toHaveBeenCalledWith(expect.stringContaining("extractionErrorPrefix"));
    });
  });

  it("calls toast.success on successful extraction", async () => {
    const { VideoAIExtractor } = require("../lib/services/VideoAIExtractor");
    const mockExtract = jest.fn().mockResolvedValue({ title: 'Mock Recipe', ingredients: [], instructions: [] });
    VideoAIExtractor.mockImplementation(() => ({
      extractFromUrl: mockExtract,
    }));

    renderHome();
    
    const input = screen.getByPlaceholderText(/Paste video URL/i);
    const button = screen.getByRole('button', { name: /Extract Recipe/i });

    fireEvent.change(input, { target: { value: 'https://example.com/success' } });
    fireEvent.click(button);

    await waitFor(() => {
      expect(toast.success).toHaveBeenCalledWith(expect.stringContaining("extractionSuccess"));
    });
  });
});
