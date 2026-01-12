export interface RecipeRepository {
  getRecipes(): Promise<any[]>;
  addRecipe(recipe: any): Promise<void>;
  getLatest(count: number): Promise<any[]>;
  getAll(): Promise<any[]>;
}
