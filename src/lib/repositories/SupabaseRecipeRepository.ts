import { SupabaseClient } from '@supabase/supabase-js';
import { RecipeRepository } from './RecipeRepository';

export class SupabaseRecipeRepository implements RecipeRepository {
  constructor(private supabase: SupabaseClient, private userId?: string) {}

  async getRecipes(): Promise<any[]> {
    const { data, error } = await this.supabase.from('recipes').select('*');
    if (error) {
      throw error;
    }
    return data || [];
  }

  async addRecipe(recipe: any): Promise<any> {
    const dbRecipe = {
      title: recipe.title,
      ingredients: recipe.ingredients,
      instructions: recipe.instructions,
      source_url: recipe.source_url || recipe.sourceUrl,
      image_url: recipe.image_url || recipe.imageUrl,
      user_id: this.userId,
    };
    const { data, error } = await this.supabase
      .from('recipes')
      .insert([dbRecipe])
      .select()
      .single();
      
    if (error) {
      throw error;
    }
    return data;
  }

  async getLatest(count: number, locale?: string): Promise<any[]> {
    let query = this.supabase.from('recipes').select(locale ? '*, recipe_translations(title)' : '*');
    
    if (locale) {
      query = query.eq('recipe_translations.locale', locale);
    }

    const { data, error } = await query
      .order('created_at', { ascending: false })
      .limit(count);

    if (error) throw error;

    return (data || []).map(recipe => {
      if (locale && recipe.recipe_translations && recipe.recipe_translations.length > 0) {
        return { ...recipe, title: recipe.recipe_translations[0].title };
      }
      return recipe;
    });
  }

  async getAll(locale?: string): Promise<any[]> {
    let query = this.supabase.from('recipes').select(locale ? '*, recipe_translations(title)' : '*');
    
    if (locale) {
      query = query.eq('recipe_translations.locale', locale);
    }

    const { data, error } = await query.order('title', { ascending: true });

    if (error) throw error;

    return (data || []).map(recipe => {
      if (locale && recipe.recipe_translations && recipe.recipe_translations.length > 0) {
        return { ...recipe, title: recipe.recipe_translations[0].title };
      }
      return recipe;
    });
  }

  async getById(id: string, locale?: string): Promise<any | null> {
    let query = this.supabase
      .from('recipes')
      .select(locale ? '*, recipe_translations(title, ingredients, instructions)' : '*')
      .eq('id', id);

    if (locale) {
      query = query.eq('recipe_translations.locale', locale);
    }

    const { data, error } = await query.single();
    
    if (error) {
      if (error.code === 'PGRST116') return null;
      throw error;
    }

    if (locale && data.recipe_translations && data.recipe_translations.length > 0) {
      const translation = data.recipe_translations[0];
      return { ...data, ...translation, translations: data.recipe_translations };
    }

    return { ...data, translations: data.recipe_translations || [] };
  }

  async updateRecipe(id: number, recipe: any): Promise<any> {
    const { data, error } = await this.supabase
      .from('recipes')
      .update({
        title: recipe.title,
        ingredients: recipe.ingredients,
        instructions: recipe.instructions,
        image_url: recipe.image_url || recipe.imageUrl,
      })
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  async saveTranslation(recipeId: number, locale: string, translation: any): Promise<void> {
    const { error } = await this.supabase
      .from('recipe_translations')
      .upsert({
        recipe_id: recipeId,
        locale,
        title: translation.title,
        ingredients: translation.ingredients,
        instructions: translation.instructions,
      });

    if (error) throw error;
  }
}
