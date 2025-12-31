import { RecipeRepository } from './RecipeRepository';

export class MockRecipeRepository implements RecipeRepository {
  private recipes: any[] = [
    { id: 1, title: 'Mock Recipe 1', ingredients: ['Ingredient A'], instructions: ['Step 1'] },
    { id: 2, title: 'Mock Recipe 2', ingredients: ['Ingredient B'], instructions: ['Step 1'] },
  ];

  async getRecipes(): Promise<any[]> {
    return this.recipes;
  }

  async addRecipe(recipe: any): Promise<void> {
    this.recipes.push({ id: this.recipes.length + 1, ...recipe });
  }
}
