import { SupabaseClient } from '@supabase/supabase-js';
import { PantryRepository, PantryItem } from './PantryRepository';

export class SupabasePantryRepository implements PantryRepository {
  constructor(private supabase: SupabaseClient, private userId: string) {}

  async getItems(): Promise<PantryItem[]> {
    const { data, error } = await this.supabase
      .from('pantry_items')
      .select('*')
      .eq('user_id', this.userId)
      .order('name', { ascending: true });
    
    if (error) throw error;
    return data || [];
  }

  async addItem(item: Partial<PantryItem>): Promise<void> {
    const { error } = await this.supabase
      .from('pantry_items')
      .insert([{ 
        ...item, 
        user_id: this.userId,
        is_low_stock: item.is_low_stock || false 
      }]);
    
    if (error) throw error;
  }

  async updateItem(id: number, updates: Partial<PantryItem>): Promise<void> {
    const { error } = await this.supabase
      .from('pantry_items')
      .update(updates)
      .eq('id', id)
      .eq('user_id', this.userId);
    
    if (error) throw error;
  }

  async removeItem(id: number): Promise<void> {
    const { error } = await this.supabase
      .from('pantry_items')
      .delete()
      .eq('id', id)
      .eq('user_id', this.userId);
    
    if (error) throw error;
  }
}
