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

  it('getQueue should call supabase select and order with user_id filter', async () => {
    const repo = new SupabasePlannerRepository(mockSupabase, 'user-123');
    const mockOrder = jest.fn().mockResolvedValue({ data: [], error: null });
    const mockEq = jest.fn().mockReturnValue({ order: mockOrder });
    const mockSelect = jest.fn().mockReturnValue({ eq: mockEq });
    
    (mockSupabase.from as jest.Mock).mockReturnValue({
      select: mockSelect,
    });

    await repo.getQueue();
    expect(mockSupabase.from).toHaveBeenCalledWith('planned_recipes');
    expect(mockSelect).toHaveBeenCalledWith('*');
    expect(mockEq).toHaveBeenCalledWith('user_id', 'user-123');
    expect(mockOrder).toHaveBeenCalledWith('order', { ascending: true });
  });

  it('addToQueue should calculate next order and insert with user_id', async () => {
    const repo = new SupabasePlannerRepository(mockSupabase, 'user-123');
    
    // Mock get max order
    const mockLimit = jest.fn().mockResolvedValue({ data: [{ order: 5 }], error: null });
    const mockOrder = jest.fn().mockReturnValue({ limit: mockLimit });
    const mockEq = jest.fn().mockReturnValue({ order: mockOrder });
    const mockSelect = jest.fn().mockReturnValue({ eq: mockEq });
    
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
    
    expect(mockEq).toHaveBeenCalledWith('user_id', 'user-123');
    expect(mockInsert).toHaveBeenCalledWith([expect.objectContaining({
      title: 'New Recipe',
      order: 6,
      user_id: 'user-123'
    })]);
  });

  it('removeFromQueue should call supabase delete with user_id filter', async () => {
    const repo = new SupabasePlannerRepository(mockSupabase, 'user-123');
    const mockDelete = jest.fn().mockReturnThis();
    const mockEqId = jest.fn().mockReturnThis();
    const mockEqUser = jest.fn().mockResolvedValue({ error: null });
    
    (mockSupabase.from as jest.Mock).mockReturnValue({
      delete: mockDelete,
    });
    mockDelete.mockReturnValue({ eq: mockEqId });
    mockEqId.mockReturnValue({ eq: mockEqUser });

    await repo.removeFromQueue(1);
    expect(mockEqId).toHaveBeenCalledWith('id', 1);
    expect(mockEqUser).toHaveBeenCalledWith('user_id', 'user-123');
  });
});
