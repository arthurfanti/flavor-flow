import { SupabaseClient } from '@supabase/supabase-js';
import { ShoppingListRepository, ShoppingListItem } from './ShoppingListRepository';

export class SupabaseShoppingListRepository implements ShoppingListRepository {
  constructor(private supabase: SupabaseClient, private userId: string) {}

  async getItems(): Promise<ShoppingListItem[]> {
    const { data, error } = await this.supabase
      .from('shopping_list')
      .select('*')
      .eq('user_id', this.userId)
      .order('id', { ascending: true });
    
    if (error) throw error;
    return data || [];
  }

  async addItem(item: Partial<ShoppingListItem>): Promise<void> {
    const { error } = await this.supabase
      .from('shopping_list')
      .insert([{ 
        ...item, 
        user_id: this.userId,
        bought: item.bought || false 
      }]);
    
    if (error) throw error;
  }

  async addItems(items: Partial<ShoppingListItem>[]): Promise<void> {
    if (items.length === 0) return;
    const { error } = await this.supabase
      .from('shopping_list')
      .insert(items.map(item => ({ 
        ...item, 
        user_id: this.userId,
        bought: item.bought || false 
      })));
    
    if (error) throw error;
  }

  async toggleItem(id: number, bought: boolean): Promise<void> {
    const { error } = await this.supabase
      .from('shopping_list')
      .update({ bought })
      .eq('id', id)
      .eq('user_id', this.userId);
    
    if (error) throw error;
  }

  async removeItem(id: number): Promise<void> {
    const { error } = await this.supabase
      .from('shopping_list')
      .delete()
      .eq('id', id)
      .eq('user_id', this.userId);
    
    if (error) throw error;
  }
}
