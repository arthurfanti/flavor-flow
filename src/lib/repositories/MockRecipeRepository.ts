import { RecipeRepository } from './RecipeRepository';
import { normalizeSourceUrl } from '../utils';

export class MockRecipeRepository implements RecipeRepository {
  constructor(private _supabase?: any, private _userId?: string) {}
  private static recipes: any[] = [
    { id: 1, title: 'Mock Recipe 1', ingredients: ['Ingredient A'], instructions: ['Step 1'] },
    { id: 2, title: 'Mock Recipe 2', ingredients: ['Ingredient B'], instructions: ['Step 1'] },
  ];

  async getRecipes(): Promise<any[]> {
    return MockRecipeRepository.recipes;
  }

  async findBySourceUrl(url: string): Promise<any | null> {
    const raw = (url || '').trim();
    const normalized = normalizeSourceUrl(raw);
    const candidates = [normalized, raw].filter((value, index, self) => {
      return value && self.indexOf(value) === index;
    });
    if (candidates.length === 0) return null;
    return (
      MockRecipeRepository.recipes.find((r) => {
        const candidate = normalizeSourceUrl(r.source_url || r.sourceUrl || '');
        return candidates.includes(candidate) || candidates.includes((r.source_url || r.sourceUrl || '').trim());
      }) || null
    );
  }

  async addRecipe(recipe: any): Promise<any> {
    const sourceUrlInput = recipe.source_url || recipe.sourceUrl;
    const normalizedSourceUrl = normalizeSourceUrl(sourceUrlInput);
    if (sourceUrlInput) {
      const existing = await this.findBySourceUrl(sourceUrlInput);
      if (existing) return existing;
    }
    const newRecipe = {
      id: MockRecipeRepository.recipes.length + 1,
      ...recipe,
      source_url: normalizedSourceUrl || recipe.source_url || recipe.sourceUrl,
    };
    MockRecipeRepository.recipes.push(newRecipe);
    return newRecipe;
  }

  async getLatest(count: number): Promise<any[]> {
    return MockRecipeRepository.recipes.slice(-count).reverse();
  }

  async getAll(): Promise<any[]> {
    return [...MockRecipeRepository.recipes].sort((a, b) => a.title.localeCompare(b.title));
  }

  async getById(id: string, locale?: string): Promise<any | null> {
    return MockRecipeRepository.recipes.find(r => r.id.toString() === id) || null;
  }

  async updateRecipe(id: number, recipe: any): Promise<any> {
    const index = MockRecipeRepository.recipes.findIndex(r => r.id === id);
    if (index === -1) throw new Error('Recipe not found');
    const updated = { ...MockRecipeRepository.recipes[index], ...recipe };
    MockRecipeRepository.recipes[index] = updated;
    return updated;
  }

  async saveTranslation(recipeId: number, locale: string, translation: any): Promise<void> {
    // Mock save
  }

  static clearForTests() {
    MockRecipeRepository.recipes = [
      { id: 1, title: 'Mock Recipe 1', ingredients: ['Ingredient A'], instructions: ['Step 1'] },
      { id: 2, title: 'Mock Recipe 2', ingredients: ['Ingredient B'], instructions: ['Step 1'] },
    ];
  }

  static seedForTests(recipes: any[]) {
    MockRecipeRepository.recipes = recipes;
  }
}
