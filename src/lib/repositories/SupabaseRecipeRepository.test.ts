import { SupabaseRecipeRepository } from './SupabaseRecipeRepository';
import { createClient, SupabaseClient } from '@supabase/supabase-js';

// Mock supabase
jest.mock('@supabase/supabase-js', () => ({
  createClient: jest.fn(),
}));

describe('SupabaseRecipeRepository', () => {
  let mockSupabase: jest.Mocked<SupabaseClient>;

  beforeEach(() => {
    mockSupabase = {
      from: jest.fn().mockReturnThis(),
      select: jest.fn().mockReturnThis(),
    } as unknown as jest.Mocked<SupabaseClient>;
  });

  it('should be defined', () => {
    const repo = new SupabaseRecipeRepository(mockSupabase);
    expect(repo).toBeDefined();
  });

  it('should have a getRecipes method', async () => {
    const repo = new SupabaseRecipeRepository(mockSupabase);
    expect(typeof repo.getRecipes).toBe('function');
  });

  it('getRecipes should call supabase select', async () => {
    const repo = new SupabaseRecipeRepository(mockSupabase);
    // Mock return value
    (mockSupabase.from as jest.Mock).mockReturnValue({
      select: jest.fn().mockResolvedValue({ data: [], error: null }),
    });

    await repo.getRecipes();
    expect(mockSupabase.from).toHaveBeenCalledWith('recipes');
  });

  it('getRecipes should throw error if supabase fails', async () => {
    const repo = new SupabaseRecipeRepository(mockSupabase);
    const mockError = new Error('Supabase error');
    
    (mockSupabase.from as jest.Mock).mockReturnValue({
      select: jest.fn().mockResolvedValue({ data: null, error: mockError }),
    });

    await expect(repo.getRecipes()).rejects.toThrow('Supabase error');
  });

  it('addRecipe should call supabase insert', async () => {
    const repo = new SupabaseRecipeRepository(mockSupabase);
    (mockSupabase.from as jest.Mock).mockReturnValue({
      insert: jest.fn().mockResolvedValue({ error: null }),
    });

    const newRecipe = { title: 'Test' };
    await repo.addRecipe(newRecipe);
    expect(mockSupabase.from).toHaveBeenCalledWith('recipes');
  });

  it('addRecipe should throw error if supabase fails', async () => {
    const repo = new SupabaseRecipeRepository(mockSupabase);
    const mockError = new Error('Supabase error');
    
    (mockSupabase.from as jest.Mock).mockReturnValue({
      insert: jest.fn().mockResolvedValue({ error: mockError }),
    });

    await expect(repo.addRecipe({ title: 'Test' })).rejects.toThrow('Supabase error');
  });
});
