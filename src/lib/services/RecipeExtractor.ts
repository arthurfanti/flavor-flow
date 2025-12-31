export interface ExtractedRecipe {
  title: string;
  ingredients: string[];
  instructions: string[];
  sourceUrl: string;
}

export interface RecipeExtractor {
  extractFromUrl(url: string): Promise<ExtractedRecipe>;
}
