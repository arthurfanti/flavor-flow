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
    const repo = new SupabaseShoppingListRepository(mockSupabase);
    expect(repo).toBeDefined();
  });

  it('getItems should call supabase select', async () => {
    const repo = new SupabaseShoppingListRepository(mockSupabase);
    const mockOrder = jest.fn().mockResolvedValue({ data: [], error: null });
    const mockSelect = jest.fn().mockReturnValue({ order: mockOrder });
    
    (mockSupabase.from as jest.Mock).mockReturnValue({
      select: mockSelect,
    });

    await repo.getItems();
    expect(mockSupabase.from).toHaveBeenCalledWith('shopping_list');
    expect(mockSelect).toHaveBeenCalledWith('*');
    expect(mockOrder).toHaveBeenCalledWith('id', { ascending: true });
  });

  it('addItem should call supabase insert', async () => {
    const repo = new SupabaseShoppingListRepository(mockSupabase);
    (mockSupabase.from as jest.Mock).mockReturnValue({
      insert: jest.fn().mockResolvedValue({ error: null }),
    });

    await repo.addItem({ name: 'Apples' });
    expect(mockSupabase.from).toHaveBeenCalledWith('shopping_list');
  });

  it('toggleItem should call supabase update', async () => {
    const repo = new SupabaseShoppingListRepository(mockSupabase);
    const mockUpdate = jest.fn().mockReturnThis();
    const mockEq = jest.fn().mockResolvedValue({ error: null });
    
    (mockSupabase.from as jest.Mock).mockReturnValue({
      update: mockUpdate,
    });
    mockUpdate.mockReturnValue({ eq: mockEq });

    await repo.toggleItem(1, true);
    expect(mockUpdate).toHaveBeenCalledWith({ bought: true });
    expect(mockEq).toHaveBeenCalledWith('id', 1);
  });

  it('removeItem should call supabase delete', async () => {
    const repo = new SupabaseShoppingListRepository(mockSupabase);
    const mockDelete = jest.fn().mockReturnThis();
    const mockEq = jest.fn().mockResolvedValue({ error: null });
    
    (mockSupabase.from as jest.Mock).mockReturnValue({
      delete: mockDelete,
    });
    mockDelete.mockReturnValue({ eq: mockEq });

    await repo.removeItem(1);
    expect(mockDelete).toHaveBeenCalled();
    expect(mockEq).toHaveBeenCalledWith('id', 1);
  });
});
