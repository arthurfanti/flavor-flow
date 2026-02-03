import OpenAI from "openai";

export class OpenRouterService {
  private client: OpenAI;

  constructor(apiKey: string) {
    this.client = new OpenAI({
      baseURL: "https://openrouter.ai/api/v1",
      apiKey: apiKey,
    });
  }

  async chat(messages: any[], model: string = "google/gemma-3-27b-it:free", jsonMode: boolean = false): Promise<string> {
    try {
      const completion = await this.client.chat.completions.create({
        model: model,
        messages: messages,
        // Remove response_format JSON enforcement as it causes Bad Request with some free models
        // response_format: jsonMode ? { type: "json_object" } : undefined,
      }, {
        headers: {
          "HTTP-Referer": "https://flavor-flow.app", // Required by OpenRouter
          "X-Title": "Flavor Flow", // Optional
        },
      });

      return completion.choices[0]?.message?.content || "";
    } catch (error: any) {
      console.error("OpenRouter API Error:", error);
      throw new Error(`OpenRouter API failed: ${error.message}`);
    }
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
            
            Return ONLY the JSON object. Do not explain. Do not use markdown formatting.`,
      },
      {
        role: "user",
        content: transcript,
      },
    ], "google/gemma-3-27b-it:free", true);

    try {
      // Robust parsing: Strip markdown code blocks if present
      const cleanedContent = content.replace(/```json/g, '').replace(/```/g, '').trim();
      return JSON.parse(cleanedContent);
    } catch (e) {
      console.error("Failed to parse AI response:", content);
      throw new Error("AI returned invalid JSON");
    }
  }
}
