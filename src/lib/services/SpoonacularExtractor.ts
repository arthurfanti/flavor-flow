import { RecipeExtractor, ExtractedRecipe } from './RecipeExtractor';

export class SpoonacularExtractor implements RecipeExtractor {
  constructor(private apiKey: string) {}

  async extractFromUrl(url: string): Promise<ExtractedRecipe> {
    const response = await fetch(
      `https://api.spoonacular.com/recipes/extract?url=${encodeURIComponent(url)}&apiKey=${this.apiKey}`
    );

    if (!response.ok) {
      throw new Error('Failed to extract recipe');
    }

    const data = await response.json();

    return {
      title: data.title || '',
      ingredients: (data.extendedIngredients || []).map((i: any) => i.original),
      instructions: (data.instructions || '').split('\n').filter((s: string) => s.trim() !== ''),
      sourceUrl: url,
    };
  }
}
