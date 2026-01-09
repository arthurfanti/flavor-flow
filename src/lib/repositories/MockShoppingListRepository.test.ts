import { MockShoppingListRepository } from './MockShoppingListRepository';

describe('MockShoppingListRepository Persistence', () => {
  it('should persist data across instances', async () => {
    const repo1 = new MockShoppingListRepository();
    const initialCount = (await repo1.getItems()).length;

    await repo1.addItem({ name: 'Persistent Item' });

    const repo2 = new MockShoppingListRepository();
    const newItems = await repo2.getItems();
    
    expect(newItems.length).toBe(initialCount + 1);
    expect(newItems.find(i => i.name === 'Persistent Item')).toBeDefined();
  });
});
