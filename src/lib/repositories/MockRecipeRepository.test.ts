import { MockRecipeRepository } from './MockRecipeRepository';

describe('MockRecipeRepository', () => {
  beforeEach(() => {
    MockRecipeRepository.clearForTests();
  });

  it('should return mock recipes', async () => {
    const repo = new MockRecipeRepository();
    const recipes = await repo.getRecipes();
    expect(recipes.length).toBeGreaterThan(0);
    expect(recipes[0]).toHaveProperty('title');
  });

  it('should allow adding a recipe (mock)', async () => {
    const repo = new MockRecipeRepository();
    const initialCount = (await repo.getRecipes()).length;
    await repo.addRecipe({ title: 'New Recipe' });
    const newCount = (await repo.getRecipes()).length;
    expect(newCount).toBe(initialCount + 1);
  });

  it('should return latest recipes', async () => {
    const repo = new MockRecipeRepository();
    const latest = await repo.getLatest(1);
    expect(latest.length).toBe(1);
  });

  it('should return all recipes', async () => {
    const repo = new MockRecipeRepository();
    const all = await repo.getAll();
    expect(all.length).toBeGreaterThan(0);
  });

  it('should find recipe by source URL', async () => {
    MockRecipeRepository.seedForTests([
      { id: 1, title: 'Seeded', source_url: 'https://example.com/test' },
    ]);
    const repo = new MockRecipeRepository();
    const found = await repo.findBySourceUrl('https://Example.com/test/');
    expect(found?.id).toBe(1);
  });

  it('should return existing recipe on duplicate source URL', async () => {
    MockRecipeRepository.seedForTests([
      { id: 1, title: 'Seeded', source_url: 'https://example.com/test' },
    ]);
    const repo = new MockRecipeRepository();
    const first = await repo.addRecipe({ title: 'Dup', sourceUrl: 'https://example.com/test/' });
    const all = await repo.getRecipes();
    expect(first.id).toBe(1);
    expect(all.length).toBe(1);
  });
});
