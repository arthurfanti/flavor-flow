export type PantryCategory = 'Produce' | 'Spices' | 'Pantry Staples' | 'Dairy' | 'Meat' | 'Other';

export interface PantryItem {
  id?: number;
  name: string;
  category: PantryCategory;
  is_low_stock: boolean;
  created_at?: string;
}

export interface PantryRepository {
  getItems(): Promise<PantryItem[]>;
  addItem(item: Partial<PantryItem>): Promise<void>;
  updateItem(id: number, updates: Partial<PantryItem>): Promise<void>;
  removeItem(id: number): Promise<void>;
}
