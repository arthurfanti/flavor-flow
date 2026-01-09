import { PlannerRepository, PlannedRecipe } from './PlannerRepository';

export class MockPlannerRepository implements PlannerRepository {
  private static queue: PlannedRecipe[] = [
    { 
      id: 1, 
      title: 'Creamy Lemon Pasta', 
      source_url: 'https://example.com/pasta', 
      image_url: 'https://images.unsplash.com/photo-1473093226795-af9932fe5856?auto=format&fit=crop&q=80&w=1000',
      planned_at: new Date().toISOString(),
      order: 0 
    },
    { 
      id: 2, 
      title: 'Roasted Salmon', 
      source_url: 'https://example.com/salmon', 
      image_url: 'https://images.unsplash.com/photo-1467003909585-2f8a72700288?auto=format&fit=crop&q=80&w=1000',
      planned_at: new Date().toISOString(),
      order: 1 
    },
  ];

  async getQueue(): Promise<PlannedRecipe[]> {
    return [...MockPlannerRepository.queue].sort((a, b) => a.order - b.order);
  }

  async addToQueue(recipe: Partial<PlannedRecipe>): Promise<void> {
    const nextOrder = MockPlannerRepository.queue.length > 0 ? Math.max(...MockPlannerRepository.queue.map(r => r.order)) + 1 : 0;
    const newRecipe: PlannedRecipe = {
      id: Date.now(),
      title: recipe.title || 'Unknown Recipe',
      source_url: recipe.source_url || '',
      image_url: recipe.image_url,
      planned_at: new Date().toISOString(),
      order: nextOrder,
    };
    MockPlannerRepository.queue.push(newRecipe);
  }

  async removeFromQueue(id: number): Promise<void> {
    MockPlannerRepository.queue = MockPlannerRepository.queue.filter(r => r.id !== id);
  }

  async reorderQueue(orderedIds: number[]): Promise<void> {
    MockPlannerRepository.queue = MockPlannerRepository.queue.map(recipe => {
      const newOrder = orderedIds.indexOf(recipe.id!);
      return newOrder !== -1 ? { ...recipe, order: newOrder } : recipe;
    });
  }

  static clearForTests() {
    MockPlannerRepository.queue = [
      { 
        id: 1, 
        title: 'Creamy Lemon Pasta', 
        source_url: 'https://example.com/pasta', 
        image_url: 'https://images.unsplash.com/photo-1473093226795-af9932fe5856?auto=format&fit=crop&q=80&w=1000',
        planned_at: new Date().toISOString(),
        order: 0 
      },
      { 
        id: 2, 
        title: 'Roasted Salmon', 
        source_url: 'https://example.com/salmon', 
        image_url: 'https://images.unsplash.com/photo-1467003909585-2f8a72700288?auto=format&fit=crop&q=80&w=1000',
        planned_at: new Date().toISOString(),
        order: 1 
      },
    ];
  }
}
