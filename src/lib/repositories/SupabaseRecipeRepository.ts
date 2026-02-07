import { SupabaseClient } from '@supabase/supabase-js';
import { RecipeRepository } from './RecipeRepository';
import { normalizeSourceUrl } from '../utils';

export class SupabaseRecipeRepository implements RecipeRepository {
  constructor(private supabase: SupabaseClient, private userId?: string) { }

  async getRecipes(): Promise<any[]> {
    const { data, error } = await this.supabase.from('recipes').select('*');
    if (error) {
      throw error;
    }
    return data || [];
  }

  async findBySourceUrl(url: string): Promise<any | null> {
    const raw = (url || '').trim();
    const normalized = normalizeSourceUrl(raw);
    const candidates = [normalized, raw].filter((value, index, self) => {
      return value && self.indexOf(value) === index;
    });

    for (const candidate of candidates) {
      const { data, error } = await this.supabase
        .from('recipes')
        .select('*')
        .eq('source_url', candidate)
        .single();

      if (error) {
        if (error.code === 'PGRST116') continue;
        throw error;
      }

      if (data) return data;
    }

    return null;
  }

  async addRecipe(recipe: any): Promise<any> {
    const sourceUrlInput = recipe.source_url || recipe.sourceUrl;
    const normalizedSourceUrl = normalizeSourceUrl(sourceUrlInput);
    if (sourceUrlInput) {
      const existing = await this.findBySourceUrl(sourceUrlInput);
      if (existing) return existing;
    }
    const dbRecipe = {
      title: recipe.title,
      ingredients: recipe.ingredients,
      instructions: recipe.instructions,
      source_url: normalizedSourceUrl || null,
      image_url: recipe.image_url || recipe.imageUrl,
      storage_path: recipe.storage_path,
      user_id: this.userId,
    };
    const { data, error } = await this.supabase
      .from('recipes')
      .insert([dbRecipe])
      .select()
      .single();

    if (error) {
      if (
        (error as any).code === '23505' ||
        (typeof error.message === 'string' && error.message.includes('duplicate key'))
      ) {
        if (sourceUrlInput || normalizedSourceUrl) {
          const existing = await this.findBySourceUrl(sourceUrlInput || normalizedSourceUrl);
          if (existing) return existing;
        }
      }
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

    return (data || []).map((recipe: any) => {
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

    return (data || []).map((recipe: any) => {
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

    const recipeData = data as any;

    if (locale && recipeData.recipe_translations && recipeData.recipe_translations.length > 0) {
      const translation = recipeData.recipe_translations[0];
      return { ...recipeData, ...translation, translations: recipeData.recipe_translations };
    }

    return { ...recipeData, translations: recipeData.recipe_translations || [] };
  }

  async updateRecipe(id: number, recipe: any): Promise<any> {
    const { data, error } = await this.supabase
      .from('recipes')
      .update({
        title: recipe.title,
        ingredients: recipe.ingredients,
        instructions: recipe.instructions,
        image_url: recipe.image_url || recipe.imageUrl,
        storage_path: recipe.storage_path,
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
      }, { onConflict: 'recipe_id,locale' });

    if (error) throw error;
  }
}
