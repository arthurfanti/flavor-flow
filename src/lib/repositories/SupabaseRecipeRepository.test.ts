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

  it('addRecipe should call supabase insert with mapped fields', async () => {
    const repo = new SupabaseRecipeRepository(mockSupabase);
    const mockInsert = jest.fn().mockResolvedValue({ error: null });
    (mockSupabase.from as jest.Mock).mockReturnValue({
      insert: mockInsert,
    });

    const newRecipe = { title: 'Test', sourceUrl: 'http://example.com', ingredients: [], instructions: [], image_url: 'img.jpg' };
    await repo.addRecipe(newRecipe);
    
    expect(mockSupabase.from).toHaveBeenCalledWith('recipes');
    expect(mockInsert).toHaveBeenCalledWith([{
      title: 'Test',
      ingredients: [],
      instructions: [],
      source_url: 'http://example.com',
      image_url: 'img.jpg'
    }]);
  });

  it('addRecipe should throw error if supabase fails', async () => {
    const repo = new SupabaseRecipeRepository(mockSupabase);
    const mockError = new Error('Supabase error');
    
    (mockSupabase.from as jest.Mock).mockReturnValue({
      insert: jest.fn().mockResolvedValue({ error: mockError }),
    });

    await expect(repo.addRecipe({ title: 'Test' })).rejects.toThrow('Supabase error');
  });

  it('getLatest should call supabase select, order and limit', async () => {
    const repo = new SupabaseRecipeRepository(mockSupabase);
    const mockLimit = jest.fn().mockResolvedValue({ data: [], error: null });
    const mockOrder = jest.fn().mockReturnValue({ limit: mockLimit });
    const mockSelect = jest.fn().mockReturnValue({ order: mockOrder });
    
    (mockSupabase.from as jest.Mock).mockReturnValue({
      select: mockSelect,
    });

    await repo.getLatest(3);
    expect(mockSupabase.from).toHaveBeenCalledWith('recipes');
    expect(mockSelect).toHaveBeenCalledWith('*');
    expect(mockOrder).toHaveBeenCalledWith('created_at', { ascending: false });
    expect(mockLimit).toHaveBeenCalledWith(3);
  });

  it('getAll should call supabase select and order', async () => {
    const repo = new SupabaseRecipeRepository(mockSupabase);
    const mockOrder = jest.fn().mockResolvedValue({ data: [], error: null });
    const mockSelect = jest.fn().mockReturnValue({ order: mockOrder });
    
    (mockSupabase.from as jest.Mock).mockReturnValue({
      select: mockSelect,
    });

    await repo.getAll();
    expect(mockSupabase.from).toHaveBeenCalledWith('recipes');
    expect(mockSelect).toHaveBeenCalledWith('*');
    expect(mockOrder).toHaveBeenCalledWith('title', { ascending: true });
  });
});
