import { OpenRouterService } from './OpenRouterService';

export interface TranslatableRecipe {
  title: string;
  ingredients: string[];
  instructions: string[];
}

export class TranslationService {
  constructor(private openRouter: OpenRouterService) {}

  async translateRecipe(recipe: TranslatableRecipe, targetLocale: string): Promise<TranslatableRecipe> {
    try {
      const prompt = `
        Translate the following recipe JSON into the target language.
        Target Language: ${targetLocale}
        
        Recipe:
        ${JSON.stringify(recipe, null, 2)}
        
        Return ONLY the translated JSON with the same structure (title, ingredients, instructions).
        Do not change numbers or quantities, just translate the text.
      `;

      const response = await this.openRouter.chat([
        {
          role: "system",
          content: "You are a professional culinary translator. Output valid JSON only."
        },
        {
          role: "user",
          content: prompt
        }
      ], "xiaomi/mimo-v2-flash:free", true);

      return JSON.parse(response);
    } catch (error: any) {
      throw new Error(`Translation failed: ${error.message}`);
    }
  }
}
