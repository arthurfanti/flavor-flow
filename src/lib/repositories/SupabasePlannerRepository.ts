import { SupabaseClient } from '@supabase/supabase-js';
import { PlannerRepository, PlannedRecipe } from './PlannerRepository';

export class SupabasePlannerRepository implements PlannerRepository {
  constructor(private supabase: SupabaseClient, private userId: string) {}

  async getQueue(locale?: string): Promise<PlannedRecipe[]> {
    let query = this.supabase
      .from('planned_recipes')
      .select(locale ? '*, recipe_translations(title)' : '*')
      .eq('user_id', this.userId);

    if (locale) {
      query = query.eq('recipe_translations.locale', locale);
    }
    
    const { data, error } = await query.order('order', { ascending: true });
    
    if (error) throw error;

    return (data || []).map((item: any) => {
      if (locale && item.recipe_translations && item.recipe_translations.length > 0) {
        return { ...item, title: item.recipe_translations[0].title };
      }
      return item;
    });
  }

  async addToQueue(recipe: Partial<PlannedRecipe>): Promise<void> {
    // Get current max order
    const { data } = await this.supabase
      .from('planned_recipes')
      .select('order')
      .eq('user_id', this.userId)
      .order('order', { ascending: false })
      .limit(1);
    
    const nextOrder = (data && data[0]?.order !== undefined) ? data[0].order + 1 : 0;

    const dbRecipe = {
      title: recipe.title,
      recipe_id: recipe.recipe_id,
      source_url: recipe.source_url || (recipe as any).sourceUrl || '',
      image_url: recipe.image_url || (recipe as any).imageUrl,
      order: nextOrder,
      user_id: this.userId,
      planned_at: new Date().toISOString()
    };

    const { error } = await this.supabase
      .from('planned_recipes')
      .insert([dbRecipe]);
    
    if (error) throw error;
  }

  async removeFromQueue(id: number): Promise<void> {
    const { error } = await this.supabase
      .from('planned_recipes')
      .delete()
      .eq('id', id)
      .eq('user_id', this.userId);
    
    if (error) throw error;
  }

  async reorderQueue(orderedIds: number[]): Promise<void> {
    for (let i = 0; i < orderedIds.length; i++) {
      const { error } = await this.supabase
        .from('planned_recipes')
        .update({ order: i })
        .eq('id', orderedIds[i])
        .eq('user_id', this.userId);
      if (error) throw error;
    }
  }
}
