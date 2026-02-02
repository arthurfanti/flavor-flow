import { render, screen, waitFor } from '@testing-library/react';
import RecipeDetailPage from '../../app/recipes/[id]/page';
import { useParams } from 'next/navigation';
import { useAuth } from '@/components/AuthProvider';
import { SupabaseRecipeRepository } from '@/lib/repositories/SupabaseRecipeRepository';
import { SupabaseProfileRepository } from '@/lib/repositories/SupabaseProfileRepository';
import { TranslationService } from '@/lib/services/TranslationService';

// Mocks
jest.mock('next/navigation', () => ({
  useParams: jest.fn(),
}));

jest.mock('@/navigation', () => ({
  useRouter: jest.fn(() => ({ push: jest.fn() })),
}));

jest.mock('@/components/AuthProvider', () => ({
  useAuth: jest.fn(),
}));

jest.mock('@/lib/supabase/client', () => ({
  createSupabaseClient: jest.fn(),
}));

jest.mock('@/lib/repositories/SupabaseRecipeRepository');
jest.mock('@/lib/repositories/SupabaseProfileRepository');
jest.mock('@/lib/repositories/SupabaseShoppingListRepository');
jest.mock('@/lib/repositories/SupabasePlannerRepository');
jest.mock('@/lib/repositories/SupabasePantryRepository');
jest.mock('@/lib/services/TranslationService');

describe('RecipeDetailPage Translation Logic', () => {
  const mockId = '123';
  const mockUser = { id: 'user-456' };
  const originalEnv = process.env;

  beforeEach(() => {
    jest.clearAllMocks();
    process.env = { ...originalEnv, NEXT_PUBLIC_OPENROUTER_API_KEY: 'test-key' };
    (useParams as jest.Mock).mockReturnValue({ id: mockId });
    (useAuth as jest.Mock).mockReturnValue({ session: { user: mockUser }, loading: false });
  });

  afterAll(() => {
    process.env = originalEnv;
  });

  it('triggers translation when preferred locale mismatches source locale', async () => {
    const mockRecipe = {
      id: mockId,
      title: 'English Title',
      ingredients: ['Ing 1'],
      instructions: ['Step 1'],
      source_locale: 'en',
      translations: []
    };

    const mockProfile = {
      preferred_locale: 'fr'
    };

    const mockTranslatedRecipe = {
      title: 'Titre Français',
      ingredients: ['Ing 1 FR'],
      instructions: ['Étape 1']
    };

    // Setup repository mocks
    const mockRecipeRepo = {
      getById: jest.fn().mockResolvedValue(mockRecipe),
      saveTranslation: jest.fn().mockResolvedValue(undefined),
    };
    (SupabaseRecipeRepository as jest.Mock).mockImplementation(() => mockRecipeRepo);

    const mockProfileRepo = {
      getProfile: jest.fn().mockResolvedValue(mockProfile),
    };
    (SupabaseProfileRepository as jest.Mock).mockImplementation(() => mockProfileRepo);

    // Setup translation service mock
    const mockTranslationService = {
      translateRecipe: jest.fn().mockResolvedValue(mockTranslatedRecipe),
    };
    (TranslationService as jest.Mock).mockImplementation(() => mockTranslationService);

    render(<RecipeDetailPage />);

    await waitFor(() => {
      expect(screen.getByText('Titre Français')).toBeInTheDocument();
    });

    expect(mockTranslationService.translateRecipe).toHaveBeenCalledWith(
      expect.objectContaining({ title: 'English Title' }),
      'fr'
    );
  });
});
