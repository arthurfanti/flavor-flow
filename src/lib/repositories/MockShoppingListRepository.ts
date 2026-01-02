import { ShoppingListItem, ShoppingListRepository } from './ShoppingListRepository';

export class MockShoppingListRepository implements ShoppingListRepository {
  private items: ShoppingListItem[] = [
    { id: 1, name: 'Mock Apple', bought: false },
    { id: 2, name: 'Mock Banana', bought: true },
  ];

  async getItems(): Promise<ShoppingListItem[]> {
    return this.items;
  }

  async addItem(item: Partial<ShoppingListItem>): Promise<void> {
    const newItem: ShoppingListItem = {
      id: Date.now(),
      name: item.name || 'Unknown',
      bought: item.bought || false,
      recipe_id: item.recipe_id,
    };
    this.items.push(newItem);
  }

  async toggleItem(id: number, bought: boolean): Promise<void> {
    const item = this.items.find((i) => i.id === id);
    if (item) {
      item.bought = bought;
    }
  }

  async removeItem(id: number): Promise<void> {
    this.items = this.items.filter((i) => i.id !== id);
  }
}
