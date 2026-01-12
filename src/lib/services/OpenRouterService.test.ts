import { OpenRouterService } from "./OpenRouterService";

// Mock fetch type
type FetchMock = jest.MockedFunction<typeof fetch>;

describe("OpenRouterService", () => {
  const apiKey = "test-router-key";
  let service: OpenRouterService;
  let fetchMock: FetchMock;

  beforeEach(() => {
    service = new OpenRouterService(apiKey);
    fetchMock = jest.fn() as FetchMock;
    global.fetch = fetchMock;
  });

  it("should structure transcript into recipe JSON", async () => {
    const mockOutput = {
      choices: [
        {
          message: {
            content: JSON.stringify({
              title: "AI Pasta",
              ingredients: ["100g Pasta", "Tomato Sauce"],
              instructions: ["Boil pasta", "Add sauce"],
            }),
          },
        },
      ],
    };

    fetchMock.mockResolvedValue({
      ok: true,
      json: () => Promise.resolve(mockOutput),
    } as Response);

    const result = await service.structureRecipe("Some raw transcript text");

    expect(result.title).toBe("AI Pasta");
    expect(result.ingredients).toContain("100g Pasta");
    expect(result.instructions).toContain("Boil pasta");
    expect(global.fetch).toHaveBeenCalledWith(
      "https://openrouter.ai/api/v1/chat/completions",
      expect.objectContaining({
        method: "POST",
        headers: expect.objectContaining({
          Authorization: `Bearer ${apiKey}`,
          "HTTP-Referer": expect.any(String),
        }),
        body: expect.stringContaining("xiaomi/mimo-v2-flash:free"), // Mimo V2 Flash on OpenRouter
      })
    );
  });

  it("should throw error when OpenRouter fails", async () => {
    fetchMock.mockResolvedValue({
      ok: false,
      status: 401,
    } as Response);

    await expect(service.structureRecipe("text")).rejects.toThrow(
      "Failed to structure recipe via AI"
    );
  });
});
