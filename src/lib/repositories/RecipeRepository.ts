export interface RecipeRepository {
  getRecipes(): Promise<any[]>;
  addRecipe(recipe: any): Promise<any>;
  getLatest(count: number): Promise<any[]>;
  getAll(): Promise<any[]>;
  getById(id: string): Promise<any | null>;
}
