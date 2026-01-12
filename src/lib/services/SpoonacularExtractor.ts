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

    // Junk filter for common social media footer/metadata strings
    const junkKeywords = [
      'google llc', 'youtube', 'copyright', 'urheberrecht', 'impressum', 
      'datenschutz', 'terms of service', 'all rights reserved', 'privacy policy'
    ];

    const cleanIngredients = (data.extendedIngredients || [])
      .map((i: any) => i.original)
      .filter((ing: string) => {
        const lowerIng = ing.toLowerCase();
        return !junkKeywords.some(keyword => lowerIng.includes(keyword));
      });

    return {
      title: data.title || '',
      ingredients: cleanIngredients,
      instructions: (data.instructions || '').split('\n').filter((s: string) => s.trim() !== ''),
      sourceUrl: url,
      image_url: data.image,
    };
  }

  async searchRecipes(query: string): Promise<ExtractedRecipe[]> {
    const response = await fetch(
      `https://api.spoonacular.com/recipes/complexSearch?query=${encodeURIComponent(query)}&addRecipeInformation=true&fillIngredients=true&number=5&apiKey=${this.apiKey}`
    );

    if (!response.ok) {
      throw new Error('Failed to search recipes');
    }

    const data = await response.json();

    return (data.results || []).map((r: any) => ({
      title: r.title,
      ingredients: (r.extendedIngredients || []).map((i: any) => i.original),
      instructions: (r.analyzedInstructions?.[0]?.steps || []).map((s: any) => s.step),
      sourceUrl: r.sourceUrl || '',
      image_url: r.image,
    }));
  }
}
