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
    
    const mockSingle = jest.fn().mockResolvedValue({ data: { id: 1, title: 'Test' }, error: null });
    const mockSelect = jest.fn().mockReturnValue({ single: mockSingle });
    const mockInsert = jest.fn().mockReturnValue({ select: mockSelect });

    (mockSupabase.from as jest.Mock).mockReturnValue({
      select: jest.fn().mockReturnThis(),
      eq: jest.fn().mockReturnThis(),
      single: jest.fn().mockResolvedValue({ data: null, error: { code: 'PGRST116' } }),
      insert: mockInsert,
    });

    const newRecipe = { title: 'Test', sourceUrl: 'http://example.com', ingredients: [], instructions: [], image_url: 'img.jpg' };
    await repo.addRecipe(newRecipe);
    
    expect(mockSupabase.from).toHaveBeenCalledWith('recipes');
    expect(mockInsert).toHaveBeenCalledWith([
      expect.objectContaining({
        title: 'Test',
        ingredients: [],
        instructions: [],
        source_url: 'http://example.com',
        image_url: 'img.jpg',
      }),
    ]);
    expect(mockSelect).toHaveBeenCalled();
    expect(mockSingle).toHaveBeenCalled();
  });

  it('addRecipe should throw error if supabase fails', async () => {
    const repo = new SupabaseRecipeRepository(mockSupabase);
    const mockError = new Error('Supabase error');
    
    const mockSingle = jest.fn().mockResolvedValue({ data: null, error: mockError });
    const mockSelect = jest.fn().mockReturnValue({ single: mockSingle });
    const mockInsert = jest.fn().mockReturnValue({ select: mockSelect });

    (mockSupabase.from as jest.Mock).mockReturnValue({
      select: jest.fn().mockReturnThis(),
      eq: jest.fn().mockReturnThis(),
      single: jest.fn().mockResolvedValue({ data: null, error: { code: 'PGRST116' } }),
      insert: mockInsert,
    });

    await expect(repo.addRecipe({ title: 'Test' })).rejects.toThrow('Supabase error');
  });

  it('findBySourceUrl should query by normalized source_url', async () => {
    const repo = new SupabaseRecipeRepository(mockSupabase);
    const mockSingle = jest.fn().mockResolvedValue({ data: { id: 1 }, error: null });
    const mockEq = jest.fn().mockReturnValue({ single: mockSingle });
    const mockSelect = jest.fn().mockReturnValue({ eq: mockEq });

    (mockSupabase.from as jest.Mock).mockReturnValue({
      select: mockSelect,
    });

    const result = await repo.findBySourceUrl('https://Example.com/test/');
    expect(result).toEqual({ id: 1 });
    expect(mockSupabase.from).toHaveBeenCalledWith('recipes');
    expect(mockSelect).toHaveBeenCalledWith('*');
    expect(mockEq).toHaveBeenCalledWith('source_url', 'https://example.com/test');
  });

  it('addRecipe should return existing recipe on duplicate source_url', async () => {
    const repo = new SupabaseRecipeRepository(mockSupabase);
    const duplicateError = { code: '23505', message: 'duplicate key value' };

    const mockInsertSingle = jest.fn().mockResolvedValue({ data: null, error: duplicateError });
    const mockInsertSelect = jest.fn().mockReturnValue({ single: mockInsertSingle });
    const mockInsert = jest.fn().mockReturnValue({ select: mockInsertSelect });

    const mockFindSingle = jest
      .fn()
      .mockResolvedValueOnce({ data: null, error: { code: 'PGRST116' } })
      .mockResolvedValueOnce({ data: { id: 7 }, error: null });
    const mockFindEq = jest.fn().mockReturnValue({ single: mockFindSingle });
    const mockFindSelect = jest.fn().mockReturnValue({ eq: mockFindEq });

    (mockSupabase.from as jest.Mock).mockReturnValue({
      select: mockFindSelect,
      insert: mockInsert,
    });

    const result = await repo.addRecipe({ title: 'Dup', sourceUrl: 'https://example.com' });
    expect(result).toEqual({ id: 7 });
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
