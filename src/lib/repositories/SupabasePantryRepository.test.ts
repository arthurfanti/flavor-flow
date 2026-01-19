import { SupabaseClient } from '@supabase/supabase-js';
import { SupabasePantryRepository } from './SupabasePantryRepository';

describe('SupabasePantryRepository', () => {
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

  it('getItems should call supabase select with user_id filter', async () => {
    const repo = new SupabasePantryRepository(mockSupabase, 'user-123');
    const mockOrder = jest.fn().mockResolvedValue({ data: [], error: null });
    const mockEq = jest.fn().mockReturnValue({ order: mockOrder });
    const mockSelect = jest.fn().mockReturnValue({ eq: mockEq });
    
    (mockSupabase.from as jest.Mock).mockReturnValue({
      select: mockSelect,
    });

    await repo.getItems();
    expect(mockSupabase.from).toHaveBeenCalledWith('pantry_items');
    expect(mockSelect).toHaveBeenCalledWith('*');
    expect(mockEq).toHaveBeenCalledWith('user_id', 'user-123');
    expect(mockOrder).toHaveBeenCalledWith('name', { ascending: true });
  });

  it('addItem should call supabase insert with user_id', async () => {
    const repo = new SupabasePantryRepository(mockSupabase, 'user-123');
    (mockSupabase.from as jest.Mock).mockReturnValue({
      insert: jest.fn().mockResolvedValue({ error: null }),
    });

    await repo.addItem({ name: 'Flour', category: 'Pantry Staples' });
    expect(mockSupabase.from).toHaveBeenCalledWith('pantry_items');
    expect(mockSupabase.from('pantry_items').insert).toHaveBeenCalledWith([
      expect.objectContaining({ user_id: 'user-123' })
    ]);
  });

  it('updateItem should call supabase update with user_id filter', async () => {
    const repo = new SupabasePantryRepository(mockSupabase, 'user-123');
    const mockUpdate = jest.fn().mockReturnThis();
    const mockEqId = jest.fn().mockReturnThis();
    const mockEqUser = jest.fn().mockResolvedValue({ error: null });
    
    (mockSupabase.from as jest.Mock).mockReturnValue({
      update: mockUpdate,
    });
    mockUpdate.mockReturnValue({ eq: mockEqId });
    mockEqId.mockReturnValue({ eq: mockEqUser });

    await repo.updateItem(1, { is_low_stock: true });
    expect(mockUpdate).toHaveBeenCalledWith({ is_low_stock: true });
    expect(mockEqId).toHaveBeenCalledWith('id', 1);
    expect(mockEqUser).toHaveBeenCalledWith('user_id', 'user-123');
  });

  it('removeItem should call supabase delete with user_id filter', async () => {
    const repo = new SupabasePantryRepository(mockSupabase, 'user-123');
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
