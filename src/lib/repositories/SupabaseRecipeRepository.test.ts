import { SupabaseRecipeRepository } from "./SupabaseRecipeRepository";
import { createClient, SupabaseClient } from "@supabase/supabase-js";

// Mock supabase
jest.mock("@supabase/supabase-js", () => ({
  createClient: jest.fn(),
}));

describe("SupabaseRecipeRepository", () => {
  let mockSupabase: jest.Mocked<SupabaseClient>;

  beforeEach(() => {
    mockSupabase = {
      from: jest.fn().mockReturnThis(),
      select: jest.fn().mockReturnThis(),
      rpc: jest.fn(),
    } as unknown as jest.Mocked<SupabaseClient>;
  });

  it("should be defined", () => {
    const repo = new SupabaseRecipeRepository(mockSupabase);
    expect(repo).toBeDefined();
  });

  it("should have a getRecipes method", async () => {
    const repo = new SupabaseRecipeRepository(mockSupabase);
    expect(typeof repo.getRecipes).toBe("function");
  });

  it("getRecipes should call supabase select", async () => {
    const repo = new SupabaseRecipeRepository(mockSupabase);
    // Mock return value
    (mockSupabase.from as jest.Mock).mockReturnValue({
      select: jest.fn().mockResolvedValue({ data: [], error: null }),
    });

    await repo.getRecipes();
    expect(mockSupabase.from).toHaveBeenCalledWith("recipes");
  });

  it("getRecipes should throw error if supabase fails", async () => {
    const repo = new SupabaseRecipeRepository(mockSupabase);
    const mockError = new Error("Supabase error");

    (mockSupabase.from as jest.Mock).mockReturnValue({
      select: jest.fn().mockResolvedValue({ data: null, error: mockError }),
    });

    await expect(repo.getRecipes()).rejects.toThrow("Supabase error");
  });

  it("addRecipe should call supabase insert without user_id and link to user", async () => {
    const repo = new SupabaseRecipeRepository(mockSupabase);

    // Mock RPC for checkRecipeExistsByUrl - no existing recipe
    (mockSupabase.rpc as jest.Mock).mockResolvedValue({
      data: [],
      error: null,
    });

    // Mock for insert flow
    const mockLinkSingle = jest
      .fn()
      .mockResolvedValue({ data: { id: "link-id" }, error: null });
    const mockLinkSelect = jest
      .fn()
      .mockReturnValue({ single: mockLinkSingle });
    const mockLinkInsert = jest
      .fn()
      .mockReturnValue({ select: mockLinkSelect });

    const mockSingle = jest
      .fn()
      .mockResolvedValue({ data: { id: 1, title: "Test" }, error: null });
    const mockSelect = jest.fn().mockReturnValue({ single: mockSingle });
    const mockInsert = jest
      .fn()
      .mockReturnValueOnce({ select: mockSelect }) // recipes insert
      .mockReturnValueOnce({ select: mockLinkSelect }); // user_recipes insert

    (mockSupabase.from as jest.Mock).mockImplementation((table: string) => {
      if (table === "user_recipes") {
        return { insert: mockLinkInsert };
      }
      return {
        select: jest.fn().mockReturnThis(),
        eq: jest.fn().mockReturnThis(),
        single: jest
          .fn()
          .mockResolvedValue({ data: null, error: { code: "PGRST116" } }),
        insert: mockInsert,
      };
    });

    const newRecipe = {
      title: "Test",
      sourceUrl: "http://example.com",
      ingredients: [],
      instructions: [],
      image_url: "img.jpg",
    };
    await repo.addRecipe(newRecipe);

    // Verify insert was called WITHOUT user_id
    const insertCall = mockInsert.mock.calls[0][0];
    expect(insertCall[0]).not.toHaveProperty("user_id");
    expect(insertCall[0]).toEqual(
      expect.objectContaining({
        title: "Test",
        ingredients: [],
        instructions: [],
        source_url: "http://example.com",
        image_url: "img.jpg",
      }),
    );

    // Verify user_recipes link was created
    expect(mockSupabase.from).toHaveBeenCalledWith("user_recipes");
  });

  it("addRecipe should throw error if supabase fails", async () => {
    const repo = new SupabaseRecipeRepository(mockSupabase);
    const mockError = new Error("Supabase error");

    // Mock RPC for checkRecipeExistsByUrl - no existing recipe
    (mockSupabase.rpc as jest.Mock).mockResolvedValue({
      data: [],
      error: null,
    });

    const mockSingle = jest
      .fn()
      .mockResolvedValue({ data: null, error: mockError });
    const mockSelect = jest.fn().mockReturnValue({ single: mockSingle });
    const mockInsert = jest.fn().mockReturnValue({ select: mockSelect });

    (mockSupabase.from as jest.Mock).mockReturnValue({
      select: jest.fn().mockReturnThis(),
      eq: jest.fn().mockReturnThis(),
      single: jest
        .fn()
        .mockResolvedValue({ data: null, error: { code: "PGRST116" } }),
      insert: mockInsert,
    });

    await expect(repo.addRecipe({ title: "Test" })).rejects.toThrow(
      "Supabase error",
    );
  });

  it("checkRecipeExistsByUrl should use RPC function", async () => {
    const repo = new SupabaseRecipeRepository(mockSupabase);

    (mockSupabase.rpc as jest.Mock).mockResolvedValue({
      data: [{ recipe_id: 42 }],
      error: null,
    });

    const result = await repo.checkRecipeExistsByUrl(
      "https://example.com/test",
    );
    expect(mockSupabase.rpc).toHaveBeenCalledWith(
      "check_recipe_exists_by_url",
      { p_source_url: "https://example.com/test" },
    );
    expect(result).toBe(42);
  });

  it("checkRecipeExistsByUrl should return null when no match", async () => {
    const repo = new SupabaseRecipeRepository(mockSupabase);

    (mockSupabase.rpc as jest.Mock).mockResolvedValue({
      data: [],
      error: null,
    });

    const result = await repo.checkRecipeExistsByUrl(
      "https://example.com/nonexistent",
    );
    expect(result).toBeNull();
  });

  it("linkRecipeToUser should insert into user_recipes", async () => {
    const repo = new SupabaseRecipeRepository(mockSupabase);

    const mockSingle = jest
      .fn()
      .mockResolvedValue({ data: { id: "link-id" }, error: null });
    const mockSelect = jest.fn().mockReturnValue({ single: mockSingle });
    const mockInsert = jest.fn().mockReturnValue({ select: mockSelect });

    (mockSupabase.from as jest.Mock).mockReturnValue({
      insert: mockInsert,
    });

    await repo.linkRecipeToUser(42);

    expect(mockSupabase.from).toHaveBeenCalledWith("user_recipes");
    expect(mockInsert).toHaveBeenCalledWith({ recipe_id: 42 });
  });

  it("linkRecipeToUser should not throw on duplicate", async () => {
    const repo = new SupabaseRecipeRepository(mockSupabase);

    const mockSingle = jest
      .fn()
      .mockResolvedValue({ data: null, error: { code: "23505" } });
    const mockSelect = jest.fn().mockReturnValue({ single: mockSingle });
    const mockInsert = jest.fn().mockReturnValue({ select: mockSelect });

    (mockSupabase.from as jest.Mock).mockReturnValue({
      insert: mockInsert,
    });

    // Should not throw
    await expect(repo.linkRecipeToUser(42)).resolves.toBeUndefined();
  });

  it("findBySourceUrl should query by normalized source_url", async () => {
    const repo = new SupabaseRecipeRepository(mockSupabase);
    const mockSingle = jest
      .fn()
      .mockResolvedValue({ data: { id: 1 }, error: null });
    const mockEq = jest.fn().mockReturnValue({ single: mockSingle });
    const mockSelect = jest.fn().mockReturnValue({ eq: mockEq });

    (mockSupabase.from as jest.Mock).mockReturnValue({
      select: mockSelect,
    });

    const result = await repo.findBySourceUrl("https://Example.com/test/");
    expect(result).toEqual({ id: 1 });
    expect(mockSupabase.from).toHaveBeenCalledWith("recipes");
    expect(mockSelect).toHaveBeenCalledWith("*");
    expect(mockEq).toHaveBeenCalledWith(
      "source_url",
      "https://example.com/test",
    );
  });

  it("getLatest should call supabase select, order and limit", async () => {
    const repo = new SupabaseRecipeRepository(mockSupabase);
    const mockLimit = jest.fn().mockResolvedValue({ data: [], error: null });
    const mockOrder = jest.fn().mockReturnValue({ limit: mockLimit });
    const mockSelect = jest.fn().mockReturnValue({ order: mockOrder });

    (mockSupabase.from as jest.Mock).mockReturnValue({
      select: mockSelect,
    });

    await repo.getLatest(3);
    expect(mockSupabase.from).toHaveBeenCalledWith("recipes");
    expect(mockSelect).toHaveBeenCalledWith("*");
    expect(mockOrder).toHaveBeenCalledWith("created_at", { ascending: false });
    expect(mockLimit).toHaveBeenCalledWith(3);
  });

  it("getAll should call supabase select and order", async () => {
    const repo = new SupabaseRecipeRepository(mockSupabase);
    const mockOrder = jest.fn().mockResolvedValue({ data: [], error: null });
    const mockSelect = jest.fn().mockReturnValue({ order: mockOrder });

    (mockSupabase.from as jest.Mock).mockReturnValue({
      select: mockSelect,
    });

    await repo.getAll();
    expect(mockSupabase.from).toHaveBeenCalledWith("recipes");
    expect(mockSelect).toHaveBeenCalledWith("*");
    expect(mockOrder).toHaveBeenCalledWith("title", { ascending: true });
  });
});
