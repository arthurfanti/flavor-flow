export interface PlannedRecipe {
  id?: number;
  title: string;
  image_url?: string;
  source_url: string;
  planned_at: string; // ISO date string
  order: number;
}

export interface PlannerRepository {
  getQueue(): Promise<PlannedRecipe[]>;
  addToQueue(recipe: Partial<PlannedRecipe>): Promise<void>;
  removeFromQueue(id: number): Promise<void>;
  reorderQueue(orderedIds: number[]): Promise<void>;
}
