export class OpenRouterService {
  private baseUrl = "https://openrouter.ai/api/v1";

  constructor(private apiKey: string) {}

  async structureRecipe(transcript: string): Promise<any> {
    const response = await fetch(`${this.baseUrl}/chat/completions`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${this.apiKey}`,
        "Content-Type": "application/json",
        "HTTP-Referer": "https://flavor-flow.app", // Required by OpenRouter
      },
      body: JSON.stringify({
        model: "xiaomi/mimo-v2-flash:free",
        messages: [
          {
            role: "system",
            content: `You are an expert chef and culinary editor. 
            Convert the following raw video transcript into a structured recipe JSON.
            The JSON MUST have:
            - title: A concise, appetizing title.
            - ingredients: An array of strings, including quantities (e.g., "2 large eggs").
            - instructions: An array of numbered steps.
            
            Return ONLY the JSON. No preamble.`,
          },
          {
            role: "user",
            content: transcript,
          },
        ],
        response_format: { type: "json_object" },
      }),
    });

    if (!response.ok) {
      throw new Error("Failed to structure recipe via AI");
    }

    const data = await response.json();
    const content = data.choices[0]?.message?.content;

    try {
      return JSON.parse(content);
    } catch (e) {
      throw new Error("AI returned invalid JSON");
    }
  }
}
