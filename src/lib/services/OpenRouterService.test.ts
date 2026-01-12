import { OpenRouterService } from './OpenRouterService';

describe('OpenRouterService', () => {
  const apiKey = 'test-router-key';
  let service: OpenRouterService;

  beforeEach(() => {
    service = new OpenRouterService(apiKey);
    global.fetch = jest.fn();
  });

  it('should structure transcript into recipe JSON', async () => {
    const mockOutput = {
      choices: [{
        message: {
          content: JSON.stringify({
            title: 'AI Pasta',
            ingredients: ['100g Pasta', 'Tomato Sauce'],
            instructions: ['Boil pasta', 'Add sauce']
          })
        }
      }]
    };

    (global.fetch as jest.Mock).mockResolvedValue({
      ok: true,
      json: () => Promise.resolve(mockOutput),
    });

    const result = await service.structureRecipe('Some raw transcript text');
    
    expect(result.title).toBe('AI Pasta');
    expect(result.ingredients).toContain('100g Pasta');
    expect(result.instructions).toContain('Boil pasta');
    expect(global.fetch).toHaveBeenCalledWith(
      'https://openrouter.ai/api/v1/chat/completions',
      expect.objectContaining({
        method: 'POST',
        headers: expect.objectContaining({
          'Authorization': `Bearer ${apiKey}`,
          'HTTP-Referer': expect.any(String),
        }),
        body: expect.stringContaining('minimax/minimax-01'), // MiniMax M2.1 on OpenRouter
      })
    );
  });

  it('should throw error when OpenRouter fails', async () => {
    (global.fetch as jest.Mock).mockResolvedValue({
      ok: false,
      status: 401,
    });

    await expect(service.structureRecipe('text'))
      .rejects.toThrow('Failed to structure recipe via AI');
  });
});
