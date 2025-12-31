export interface RecipeRepository {
  getRecipes(): Promise<any[]>;
  addRecipe(recipe: any): Promise<void>;
}
