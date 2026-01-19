import { RecipeRepository } from './RecipeRepository';

export class MockRecipeRepository implements RecipeRepository {
  constructor(private _supabase?: any, private _userId?: string) {}
  private static recipes: any[] = [
    { id: 1, title: 'Mock Recipe 1', ingredients: ['Ingredient A'], instructions: ['Step 1'] },
    { id: 2, title: 'Mock Recipe 2', ingredients: ['Ingredient B'], instructions: ['Step 1'] },
  ];

  async getRecipes(): Promise<any[]> {
    return MockRecipeRepository.recipes;
  }

  async addRecipe(recipe: any): Promise<any> {
    const newRecipe = { id: MockRecipeRepository.recipes.length + 1, ...recipe };
    MockRecipeRepository.recipes.push(newRecipe);
    return newRecipe;
  }

  async getLatest(count: number): Promise<any[]> {
    return MockRecipeRepository.recipes.slice(-count).reverse();
  }

  async getAll(): Promise<any[]> {
    return [...MockRecipeRepository.recipes].sort((a, b) => a.title.localeCompare(b.title));
  }

  async getById(id: string): Promise<any | null> {
    return MockRecipeRepository.recipes.find(r => r.id.toString() === id) || null;
  }

  static clearForTests() {
    MockRecipeRepository.recipes = [
      { id: 1, title: 'Mock Recipe 1', ingredients: ['Ingredient A'], instructions: ['Step 1'] },
      { id: 2, title: 'Mock Recipe 2', ingredients: ['Ingredient B'], instructions: ['Step 1'] },
    ];
  }
}
