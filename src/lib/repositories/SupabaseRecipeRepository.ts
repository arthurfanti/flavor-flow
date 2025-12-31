import { SupabaseClient } from '@supabase/supabase-js';
import { RecipeRepository } from './RecipeRepository';

export class SupabaseRecipeRepository implements RecipeRepository {
  constructor(private supabase: SupabaseClient) {}

  async getRecipes(): Promise<any[]> {
    const { data, error } = await this.supabase.from('recipes').select('*');
    if (error) {
      throw error;
    }
    return data || [];
  }

  async addRecipe(recipe: any): Promise<void> {
    const { error } = await this.supabase.from('recipes').insert([recipe]);
    if (error) {
      throw error;
    }
  }
}
