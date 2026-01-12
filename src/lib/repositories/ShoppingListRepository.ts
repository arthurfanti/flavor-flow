export interface ShoppingListItem {
  id?: number;
  name: string;
  bought: boolean;
  recipe_id?: number;
}

export interface ShoppingListRepository {
  getItems(): Promise<ShoppingListItem[]>;
  addItem(item: Partial<ShoppingListItem>): Promise<void>;
  addItems(items: Partial<ShoppingListItem>[]): Promise<void>;
  toggleItem(id: number, bought: boolean): Promise<void>;
  removeItem(id: number): Promise<void>;
}
