import { SpoonacularExtractor } from './SpoonacularExtractor';

describe('SpoonacularExtractor', () => {
  beforeEach(() => {
    global.fetch = jest.fn();
  });

  it('should extract recipe data from a URL', async () => {
    const mockData = {
      title: 'Pasta',
      extendedIngredients: [{ original: '1 cup pasta' }],
      instructions: 'Cook it.',
    };
    
    (global.fetch as jest.Mock).mockResolvedValue({
      ok: true,
      json: jest.fn().mockResolvedValue(mockData),
    });

    const extractor = new SpoonacularExtractor('test-key');
    const result = await extractor.extractFromUrl('https://example.com');
    
    expect(result.title).toBe('Pasta');
    expect(result.ingredients).toContain('1 cup pasta');
    expect(global.fetch).toHaveBeenCalled();
  });

  it('should throw error if API fails', async () => {
    (global.fetch as jest.Mock).mockResolvedValue({
      ok: false,
      status: 500,
    });

    const extractor = new SpoonacularExtractor('test-key');
    await expect(extractor.extractFromUrl('https://example.com')).rejects.toThrow('Failed to extract recipe');
  });

  it('should handle missing fields in response', async () => {
    (global.fetch as jest.Mock).mockResolvedValue({
      ok: true,
      json: jest.fn().mockResolvedValue({}),
    });

    const extractor = new SpoonacularExtractor('test-key');
    const result = await extractor.extractFromUrl('https://example.com');
    
    expect(result.title).toBe('');
    expect(result.ingredients).toEqual([]);
    expect(result.instructions).toEqual([]);
  });
});
