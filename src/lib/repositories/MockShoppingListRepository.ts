import { ShoppingListItem, ShoppingListRepository } from './ShoppingListRepository';

export class MockShoppingListRepository implements ShoppingListRepository {
  private static items: ShoppingListItem[] = [
    { id: 1, name: 'Mock Apple', bought: false },
    { id: 2, name: 'Mock Banana', bought: true },
  ];

  async getItems(): Promise<ShoppingListItem[]> {
    return MockShoppingListRepository.items;
  }

  async addItem(item: Partial<ShoppingListItem>): Promise<void> {
    const newItem: ShoppingListItem = {
      id: Date.now() + Math.random(),
      name: item.name || 'Unknown',
      bought: item.bought || false,
      recipe_id: item.recipe_id,
    };
    MockShoppingListRepository.items.push(newItem);
  }

  async addItems(items: Partial<ShoppingListItem>[]): Promise<void> {
    items.forEach(item => {
      const newItem: ShoppingListItem = {
        id: Date.now() + Math.random(),
        name: item.name || 'Unknown',
        bought: item.bought || false,
        recipe_id: item.recipe_id,
      };
      MockShoppingListRepository.items.push(newItem);
    });
  }

  async toggleItem(id: number, bought: boolean): Promise<void> {
    const item = MockShoppingListRepository.items.find((i) => i.id === id);
    if (item) {
      item.bought = bought;
    }
  }

  async removeItem(id: number): Promise<void> {
    MockShoppingListRepository.items = MockShoppingListRepository.items.filter((i) => i.id !== id);
  }

  static clearForTests() {
    MockShoppingListRepository.items = [
      { id: 1, name: 'Mock Apple', bought: false },
      { id: 2, name: 'Mock Banana', bought: true },
    ];
  }
}
