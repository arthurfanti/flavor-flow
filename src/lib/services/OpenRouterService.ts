export class OpenRouterService {
  private baseUrl = "https://openrouter.ai/api/v1";

  constructor(private apiKey: string) {}

  async chat(messages: any[], model: string = "xiaomi/mimo-v2-flash:free", jsonMode: boolean = false): Promise<string> {
    const response = await fetch(`${this.baseUrl}/chat/completions`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${this.apiKey}`,
        "Content-Type": "application/json",
        "HTTP-Referer": "https://flavor-flow.app", // Required by OpenRouter
      },
      body: JSON.stringify({
        model: model,
        messages: messages,
        response_format: jsonMode ? { type: "json_object" } : undefined,
      }),
    });

    if (!response.ok) {
      throw new Error(`OpenRouter API failed: ${response.statusText}`);
    }

    const data = await response.json();
    return data.choices[0]?.message?.content || "";
  }

  async structureRecipe(transcript: string): Promise<any> {
    const content = await this.chat([
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
    ], "xiaomi/mimo-v2-flash:free", true);

    try {
      return JSON.parse(content);
    } catch (e) {
      throw new Error("AI returned invalid JSON");
    }
  }
}
