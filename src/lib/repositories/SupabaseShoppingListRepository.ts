import { SupabaseClient } from '@supabase/supabase-js';
import { ShoppingListRepository, ShoppingListItem } from './ShoppingListRepository';

export class SupabaseShoppingListRepository implements ShoppingListRepository {
  constructor(private supabase: SupabaseClient) {}

  async getItems(): Promise<ShoppingListItem[]> {
    const { data, error } = await this.supabase
      .from('shopping_list')
      .select('*')
      .order('id', { ascending: true });
    
    if (error) throw error;
    return data || [];
  }

  async addItem(item: Partial<ShoppingListItem>): Promise<void> {
    const { error } = await this.supabase
      .from('shopping_list')
      .insert([{ ...item, bought: item.bought || false }]);
    
    if (error) throw error;
  }

  async toggleItem(id: number, bought: boolean): Promise<void> {
    const { error } = await this.supabase
      .from('shopping_list')
      .update({ bought })
      .eq('id', id);
    
    if (error) throw error;
  }

  async removeItem(id: number): Promise<void> {
    const { error } = await this.supabase
      .from('shopping_list')
      .delete()
      .eq('id', id);
    
    if (error) throw error;
  }
}
