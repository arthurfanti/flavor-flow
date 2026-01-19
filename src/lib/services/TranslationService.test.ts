import { TranslationService } from './TranslationService';
import { OpenRouterService } from './OpenRouterService';

// Mock OpenRouterService
jest.mock('./OpenRouterService');

describe('TranslationService', () => {
  let openRouterService: jest.Mocked<OpenRouterService>;
  let translationService: TranslationService;

  beforeEach(() => {
    openRouterService = new OpenRouterService('key') as jest.Mocked<OpenRouterService>;
    // Setup chat mock
    openRouterService.chat = jest.fn();
    translationService = new TranslationService(openRouterService);
  });

  it('translateRecipe should prompt LLM and return translated fields', async () => {
    const mockRecipe = {
      title: 'Pasta',
      ingredients: ['Pasta', 'Sauce'],
      instructions: ['Boil', 'Serve']
    };
    
    const translatedJSON = {
      title: 'Pâtes',
      ingredients: ['Pâtes', 'Sauce'],
      instructions: ['Bouillir', 'Servir']
    };

    openRouterService.chat.mockResolvedValue(JSON.stringify(translatedJSON));

    const result = await translationService.translateRecipe(mockRecipe, 'fr');

    expect(openRouterService.chat).toHaveBeenCalledWith(
      expect.arrayContaining([
        expect.objectContaining({ role: 'system' }),
        expect.objectContaining({ role: 'user', content: expect.stringContaining('Target Language: fr') })
      ]),
      expect.any(String),
      true // jsonMode
    );

    expect(result).toEqual(translatedJSON);
  });

  it('should throw error if translation fails', async () => {
    openRouterService.chat.mockRejectedValue(new Error('API Error'));
    
    const mockRecipe = { title: 'T', ingredients: [], instructions: [] };
    
    await expect(translationService.translateRecipe(mockRecipe, 'es'))
      .rejects.toThrow('Translation failed: API Error');
  });
});
