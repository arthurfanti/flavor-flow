import { PantryRepository, PantryItem } from './PantryRepository';

export class MockPantryRepository implements PantryRepository {
  private static items: PantryItem[] = [
    { id: 1, name: 'Olive Oil', category: 'Pantry Staples', is_low_stock: false },
    { id: 2, name: 'Garlic', category: 'Produce', is_low_stock: true },
    { id: 3, name: 'Cumin', category: 'Spices', is_low_stock: false },
  ];

  async getItems(): Promise<PantryItem[]> {
    return [...MockPantryRepository.items].sort((a, b) => a.name.localeCompare(b.name));
  }

  async addItem(item: Partial<PantryItem>): Promise<void> {
    const newItem: PantryItem = {
      id: Date.now(),
      name: item.name || 'Unknown',
      category: item.category || 'Other',
      is_low_stock: item.is_low_stock || false,
    };
    MockPantryRepository.items.push(newItem);
  }

  async updateItem(id: number, updates: Partial<PantryItem>): Promise<void> {
    const index = MockPantryRepository.items.findIndex(i => i.id === id);
    if (index !== -1) {
      MockPantryRepository.items[index] = { ...MockPantryRepository.items[index], ...updates };
    }
  }

  async removeItem(id: number): Promise<void> {
    MockPantryRepository.items = MockPantryRepository.items.filter(i => i.id !== id);
  }
}
