import { SupabaseClient } from '@supabase/supabase-js';
import { SupabaseRecipeRepository } from './SupabaseRecipeRepository';

describe('SupabaseRecipeRepository Locale Support', () => {
  let mockSupabase: jest.Mocked<SupabaseClient>;

  beforeEach(() => {
    mockSupabase = {
      from: jest.fn().mockReturnThis(),
      select: jest.fn().mockReturnThis(),
      eq: jest.fn().mockReturnThis(),
      single: jest.fn().mockReturnThis(),
      insert: jest.fn().mockReturnThis(),
    } as unknown as jest.Mocked<SupabaseClient>;
  });

  it('getById should fetch translation if locale is provided', async () => {
    const repo = new SupabaseRecipeRepository(mockSupabase);
    const mockRecipe = {
      id: 1,
      title: 'Original Title',
      source_locale: 'en',
      recipe_translations: [
        { title: 'Translated Title', ingredients: ['Tr 1'], instructions: ['Step 1'] }
      ]
    };

    const mockSingle = jest.fn().mockResolvedValue({ data: mockRecipe, error: null });
    const mockEqLocale = jest.fn().mockReturnValue({ single: mockSingle });
    const mockEqId = jest.fn().mockReturnValue({ eq: mockEqLocale });
    const mockSelect = jest.fn().mockReturnValue({ eq: mockEqId });

    (mockSupabase.from as jest.Mock).mockReturnValue({
      select: mockSelect,
    });

    const result = await repo.getById('1', 'fr');

    expect(mockSupabase.from).toHaveBeenCalledWith('recipes');
    expect(mockSelect).toHaveBeenCalledWith('*, recipe_translations(title, ingredients, instructions)');
    expect(mockEqId).toHaveBeenCalledWith('id', '1');
    expect(mockEqLocale).toHaveBeenCalledWith('recipe_translations.locale', 'fr');
    
    // Expect the result to be merged
    expect(result).toEqual(expect.objectContaining({
      title: 'Translated Title',
      ingredients: ['Tr 1'],
      instructions: ['Step 1']
    }));
  });

  it('getById should return original if no translation found', async () => {
    const repo = new SupabaseRecipeRepository(mockSupabase);
    const mockRecipe = {
      id: 1,
      title: 'Original Title',
      source_locale: 'en',
      recipe_translations: []
    };

    const mockSingle = jest.fn().mockResolvedValue({ data: mockRecipe, error: null });
    const mockEqLocale = jest.fn().mockReturnValue({ single: mockSingle });
    const mockEqId = jest.fn().mockReturnValue({ eq: mockEqLocale });
    const mockSelect = jest.fn().mockReturnValue({ eq: mockEqId });

    (mockSupabase.from as jest.Mock).mockReturnValue({
      select: mockSelect,
    });

    const result = await repo.getById('1', 'fr');

    expect(result).toEqual(expect.objectContaining({
      title: 'Original Title',
    }));
  });
});
