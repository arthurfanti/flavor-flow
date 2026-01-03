import { SupabaseClient } from '@supabase/supabase-js';
import { PlannerRepository, PlannedRecipe } from './PlannerRepository';

export class SupabasePlannerRepository implements PlannerRepository {
  constructor(private supabase: SupabaseClient) {}

  async getQueue(): Promise<PlannedRecipe[]> {
    const { data, error } = await this.supabase
      .from('planned_recipes')
      .select('*')
      .order('order', { ascending: true });
    
    if (error) throw error;
    return data || [];
  }

  async addToQueue(recipe: Partial<PlannedRecipe>): Promise<void> {
    // Get current max order
    const { data } = await this.supabase
      .from('planned_recipes')
      .select('order')
      .order('order', { ascending: false })
      .limit(1);
    
    const nextOrder = (data && data[0]?.order !== undefined) ? data[0].order + 1 : 0;

    const { error } = await this.supabase
      .from('planned_recipes')
      .insert([{ ...recipe, order: nextOrder, planned_at: new Date().toISOString() }]);
    
    if (error) throw error;
  }

  async removeFromQueue(id: number): Promise<void> {
    const { error } = await this.supabase
      .from('planned_recipes')
      .delete()
      .eq('id', id);
    
    if (error) throw error;
  }

  async reorderQueue(orderedIds: number[]): Promise<void> {
    // Basic implementation: update each item's order
    // In a production app, this should ideally be a single RPC call or transaction
    for (let i = 0; i < orderedIds.length; i++) {
      const { error } = await this.supabase
        .from('planned_recipes')
        .update({ order: i })
        .eq('id', orderedIds[i]);
      if (error) throw error;
    }
  }
}
