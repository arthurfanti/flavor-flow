import { OpenRouterService } from "./OpenRouterService";

const mockCreate = jest.fn();

jest.mock("openai", () => ({
  __esModule: true,
  default: jest.fn().mockImplementation(() => ({
    chat: {
      completions: {
        create: mockCreate,
      },
    },
  })),
}));

describe("OpenRouterService", () => {
  const apiKey = "test-router-key";
  let service: OpenRouterService;

  beforeEach(() => {
    service = new OpenRouterService(apiKey);
    mockCreate.mockReset();
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

    mockCreate.mockResolvedValue(mockOutput);

    const result = await service.structureRecipe("Some raw transcript text");

    expect(result.title).toBe("AI Pasta");
    expect(result.ingredients).toContain("100g Pasta");
    expect(result.instructions).toContain("Boil pasta");
    expect(mockCreate).toHaveBeenCalledWith(
      expect.objectContaining({
        model: "google/gemma-3-27b-it:free",
        messages: expect.any(Array),
      })
    );
  });

  it("should throw error when OpenRouter fails", async () => {
    mockCreate.mockRejectedValue(new Error("Unauthorized"));

    await expect(service.structureRecipe("text")).rejects.toThrow(
      "OpenRouter API failed"
    );
  });
});
