import { SupabaseClient } from '@supabase/supabase-js';
import { SupabaseProfileRepository, UserProfile } from './SupabaseProfileRepository';

describe('SupabaseProfileRepository', () => {
  let mockSupabase: jest.Mocked<SupabaseClient>;

  beforeEach(() => {
    mockSupabase = {
      from: jest.fn().mockReturnThis(),
      select: jest.fn().mockReturnThis(),
      insert: jest.fn().mockReturnThis(),
      update: jest.fn().mockReturnThis(),
      eq: jest.fn().mockReturnThis(),
      single: jest.fn().mockReturnThis(),
    } as unknown as jest.Mocked<SupabaseClient>;
  });

  it('getProfile should fetch profile by user id', async () => {
    const repo = new SupabaseProfileRepository(mockSupabase);
    const mockProfile: UserProfile = {
      id: 'user-123',
      display_name: 'Test User',
      preferred_locale: 'en',
    };

    const mockSingle = jest.fn().mockResolvedValue({ data: mockProfile, error: null });
    const mockEq = jest.fn().mockReturnValue({ single: mockSingle });
    const mockSelect = jest.fn().mockReturnValue({ eq: mockEq });

    (mockSupabase.from as jest.Mock).mockReturnValue({
      select: mockSelect,
    });

    const result = await repo.getProfile('user-123');
    
    expect(mockSupabase.from).toHaveBeenCalledWith('profiles');
    expect(mockSelect).toHaveBeenCalledWith('*');
    expect(mockEq).toHaveBeenCalledWith('id', 'user-123');
    expect(result).toEqual(mockProfile);
  });

  it('upsertProfile should call supabase upsert', async () => {
    const repo = new SupabaseProfileRepository(mockSupabase);
    const mockProfile: UserProfile = {
      id: 'user-123',
      display_name: 'Updated Name',
      preferred_locale: 'fr',
    };

    const mockUpsert = jest.fn().mockResolvedValue({ error: null });
    
    (mockSupabase.from as jest.Mock).mockReturnValue({
      upsert: mockUpsert,
    });

    await repo.upsertProfile(mockProfile);
    expect(mockSupabase.from).toHaveBeenCalledWith('profiles');
    expect(mockUpsert).toHaveBeenCalledWith(mockProfile);
  });
});
