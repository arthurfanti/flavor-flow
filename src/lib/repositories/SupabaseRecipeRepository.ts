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
    const dbRecipe = {
      title: recipe.title,
      ingredients: recipe.ingredients,
      instructions: recipe.instructions,
      source_url: recipe.sourceUrl || recipe.source_url,
      image_url: recipe.image_url,
    };
    const { error } = await this.supabase.from('recipes').insert([dbRecipe]);
    if (error) {
      throw error;
    }
  }

  async getLatest(count: number): Promise<any[]> {
    const { data, error } = await this.supabase
      .from('recipes')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(count);
    if (error) throw error;
    return data || [];
  }

  async getAll(): Promise<any[]> {
    const { data, error } = await this.supabase
      .from('recipes')
      .select('*')
      .order('title', { ascending: true });
    if (error) throw error;
    return data || [];
  }
}
