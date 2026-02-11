export interface RecipeRepository {
  getRecipes(): Promise<any[]>;
  findBySourceUrl(url: string): Promise<any | null>;
  addRecipe(recipe: any): Promise<any>;
  getLatest(count: number): Promise<any[]>;
  getAll(): Promise<any[]>;
  getById(id: string, locale?: string): Promise<any | null>;
  updateRecipe(id: number, recipe: any): Promise<any>;
  saveTranslation(
    recipeId: number,
    locale: string,
    translation: any,
  ): Promise<void>;
  linkRecipeToUser(recipeId: string | number): Promise<void>;
  checkRecipeExistsByUrl(url: string): Promise<number | null>;
}
