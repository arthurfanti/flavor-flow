import { MockRecipeRepository } from './MockRecipeRepository';

describe('MockRecipeRepository', () => {
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
});
