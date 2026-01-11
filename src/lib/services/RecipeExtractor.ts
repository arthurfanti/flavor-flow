export interface ExtractedRecipe {
  title: string;
  ingredients: string[];
  instructions: string[];
  sourceUrl: string;
  image_url?: string;
}

export interface RecipeExtractor {
  extractFromUrl(url: string): Promise<ExtractedRecipe>;
  searchRecipes(query: string): Promise<ExtractedRecipe[]>;
}
