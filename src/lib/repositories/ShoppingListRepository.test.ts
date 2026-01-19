import { SupabaseClient } from '@supabase/supabase-js';
import { SupabaseShoppingListRepository } from './SupabaseShoppingListRepository';

describe('SupabaseShoppingListRepository', () => {
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
    } as unknown as jest.Mocked<SupabaseClient>;
  });

  it('should be defined', () => {
    const repo = new SupabaseShoppingListRepository(mockSupabase, 'user-123');
    expect(repo).toBeDefined();
  });

  it('getItems should call supabase select with user_id filter', async () => {
    const repo = new SupabaseShoppingListRepository(mockSupabase, 'user-123');
    const mockOrder = jest.fn().mockResolvedValue({ data: [], error: null });
    const mockEq = jest.fn().mockReturnValue({ order: mockOrder });
    const mockSelect = jest.fn().mockReturnValue({ eq: mockEq });
    
    (mockSupabase.from as jest.Mock).mockReturnValue({
      select: mockSelect,
    });

    await repo.getItems();
    expect(mockSupabase.from).toHaveBeenCalledWith('shopping_list');
    expect(mockSelect).toHaveBeenCalledWith('*');
    expect(mockEq).toHaveBeenCalledWith('user_id', 'user-123');
    expect(mockOrder).toHaveBeenCalledWith('id', { ascending: true });
  });

  it('addItem should call supabase insert with user_id', async () => {
    const repo = new SupabaseShoppingListRepository(mockSupabase, 'user-123');
    (mockSupabase.from as jest.Mock).mockReturnValue({
      insert: jest.fn().mockResolvedValue({ error: null }),
    });

    await repo.addItem({ name: 'Apples' });
    expect(mockSupabase.from).toHaveBeenCalledWith('shopping_list');
    expect(mockSupabase.from('shopping_list').insert).toHaveBeenCalledWith([
      expect.objectContaining({ user_id: 'user-123' })
    ]);
  });

  it('toggleItem should call supabase update with user_id filter', async () => {
    const repo = new SupabaseShoppingListRepository(mockSupabase, 'user-123');
    const mockUpdate = jest.fn().mockReturnThis();
    const mockEqId = jest.fn().mockReturnThis();
    const mockEqUser = jest.fn().mockResolvedValue({ error: null });
    
    (mockSupabase.from as jest.Mock).mockReturnValue({
      update: mockUpdate,
    });
    mockUpdate.mockReturnValue({ eq: mockEqId });
    mockEqId.mockReturnValue({ eq: mockEqUser });

    await repo.toggleItem(1, true);
    expect(mockUpdate).toHaveBeenCalledWith({ bought: true });
    expect(mockEqId).toHaveBeenCalledWith('id', 1);
    expect(mockEqUser).toHaveBeenCalledWith('user_id', 'user-123');
  });

  it('removeItem should call supabase delete with user_id filter', async () => {
    const repo = new SupabaseShoppingListRepository(mockSupabase, 'user-123');
    const mockDelete = jest.fn().mockReturnThis();
    const mockEqId = jest.fn().mockReturnThis();
    const mockEqUser = jest.fn().mockResolvedValue({ error: null });
    
    (mockSupabase.from as jest.Mock).mockReturnValue({
      delete: mockDelete,
    });
    mockDelete.mockReturnValue({ eq: mockEqId });
    mockEqId.mockReturnValue({ eq: mockEqUser });

    await repo.removeItem(1);
    expect(mockDelete).toHaveBeenCalled();
    expect(mockEqId).toHaveBeenCalledWith('id', 1);
    expect(mockEqUser).toHaveBeenCalledWith('user_id', 'user-123');
  });
});
