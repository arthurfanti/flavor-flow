import { SupabaseClient } from '@supabase/supabase-js';
import { SupabasePlannerRepository } from './SupabasePlannerRepository';

describe('SupabasePlannerRepository', () => {
  let mockSupabase: jest.Mocked<SupabaseClient>;

  beforeEach(() => {
    mockSupabase = {
      from: jest.fn().mockReturnThis(),
      select: jest.fn().mockReturnThis(),
      insert: jest.fn().mockReturnThis(),
      update: jest.fn().mockReturnThis(),
      delete: jest.fn().mockReturnThis(),
      eq: jest.fn().mockReturnThis(),
      order: jest.fn().mockReturnThis(),
      limit: jest.fn().mockReturnThis(),
    } as unknown as jest.Mocked<SupabaseClient>;
  });

  it('getQueue should call supabase select and order', async () => {
    const repo = new SupabasePlannerRepository(mockSupabase);
    const mockOrder = jest.fn().mockResolvedValue({ data: [], error: null });
    const mockSelect = jest.fn().mockReturnValue({ order: mockOrder });
    
    (mockSupabase.from as jest.Mock).mockReturnValue({
      select: mockSelect,
    });

    await repo.getQueue();
    expect(mockSupabase.from).toHaveBeenCalledWith('planned_recipes');
    expect(mockSelect).toHaveBeenCalledWith('*');
    expect(mockOrder).toHaveBeenCalledWith('order', { ascending: true });
  });

  it('addToQueue should calculate next order and insert', async () => {
    const repo = new SupabasePlannerRepository(mockSupabase);
    
    // Mock get max order
    const mockLimit = jest.fn().mockResolvedValue({ data: [{ order: 5 }], error: null });
    const mockOrder = jest.fn().mockReturnValue({ limit: mockLimit });
    const mockSelect = jest.fn().mockReturnValue({ order: mockOrder });
    
    // Mock insert
    const mockInsert = jest.fn().mockResolvedValue({ error: null });

    (mockSupabase.from as jest.Mock).mockImplementation((table) => {
      if (table === 'planned_recipes') {
        return {
          select: mockSelect,
          insert: mockInsert
        };
      }
      return {};
    });

    await repo.addToQueue({ title: 'New Recipe' });
    
    expect(mockInsert).toHaveBeenCalledWith([expect.objectContaining({
      title: 'New Recipe',
      order: 6
    })]);
  });

  it('removeFromQueue should call supabase delete', async () => {
    const repo = new SupabasePlannerRepository(mockSupabase);
    const mockDelete = jest.fn().mockReturnThis();
    const mockEq = jest.fn().mockResolvedValue({ error: null });
    
    (mockSupabase.from as jest.Mock).mockReturnValue({
      delete: mockDelete,
    });
    mockDelete.mockReturnValue({ eq: mockEq });

    await repo.removeFromQueue(1);
    expect(mockEq).toHaveBeenCalledWith('id', 1);
  });
});
