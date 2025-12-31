export interface RecipeRepository {
  getRecipes(): Promise<any[]>;
}
