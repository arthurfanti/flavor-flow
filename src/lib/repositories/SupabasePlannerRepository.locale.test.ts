import { SupabaseClient } from '@supabase/supabase-js';
import { SupabasePlannerRepository } from './SupabasePlannerRepository';

describe('SupabasePlannerRepository Locale Support', () => {
  let mockSupabase: jest.Mocked<SupabaseClient>;

  beforeEach(() => {
    mockSupabase = {
      from: jest.fn().mockReturnThis(),
      select: jest.fn().mockReturnThis(),
      eq: jest.fn().mockReturnThis(),
      order: jest.fn().mockReturnThis(),
    } as unknown as jest.Mocked<SupabaseClient>;
  });

  it('getQueue should fetch translations if locale is provided', async () => {
    const repo = new SupabasePlannerRepository(mockSupabase, 'user-123');
    const mockData = [
      {
        id: 1,
        title: 'Original Title',
        recipes: {
          recipe_translations: [{ title: 'Translated Title' }]
        }
      }
    ];

    const mockResult = { data: mockData, error: null };
    const mockOrder = jest.fn().mockResolvedValue(mockResult);
    (mockSupabase.from as jest.Mock).mockReturnValue({
      select: jest.fn().mockReturnThis(),
      eq: jest.fn().mockReturnThis(),
      order: mockOrder,
    });

    const result = await repo.getQueue('fr');

    expect(mockSupabase.from).toHaveBeenCalledWith('planned_recipes');
    expect(result[0].title).toBe('Translated Title');
  });

  it('getQueue should return original title if no translation found', async () => {
    const repo = new SupabasePlannerRepository(mockSupabase, 'user-123');
    const mockData = [
      {
        id: 1,
        title: 'Original Title',
        recipes: {
          recipe_translations: []
        }
      }
    ];

    const mockResult = { data: mockData, error: null };
    (mockSupabase.from as jest.Mock).mockReturnValue({
      select: jest.fn().mockReturnThis(),
      eq: jest.fn().mockReturnThis(),
      order: jest.fn().mockResolvedValue(mockResult),
    });

    const result = await repo.getQueue('fr');

    expect(result[0].title).toBe('Original Title');
  });
});
