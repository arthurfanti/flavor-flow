import { VideoAIExtractor } from './VideoAIExtractor';
import { SupadataService } from './SupadataService';
import { OpenRouterService } from './OpenRouterService';

jest.mock('./SupadataService');
jest.mock('./OpenRouterService');

describe('VideoAIExtractor', () => {
  let extractor: VideoAIExtractor;
  let mockSupadata: jest.Mocked<SupadataService>;
  let mockOpenRouter: jest.Mocked<OpenRouterService>;

  beforeEach(() => {
    mockSupadata = new SupadataService('key') as jest.Mocked<SupadataService>;
    mockOpenRouter = new OpenRouterService('key') as jest.Mocked<OpenRouterService>;
    extractor = new VideoAIExtractor(mockSupadata, mockOpenRouter);
  });

  it('should orchestrate full extraction flow', async () => {
    const url = 'https://youtube.com/watch?v=123';
    const transcript = 'Raw transcript text';
    const structuredRecipe = {
      title: 'AI Recipe',
      ingredients: ['Ing 1'],
      instructions: ['Step 1']
    };

    mockSupadata.fetchTranscript.mockResolvedValue(transcript);
    mockOpenRouter.structureRecipe.mockResolvedValue(structuredRecipe);

    const result = await extractor.extractFromUrl(url);

    expect(result).toEqual({
      ...structuredRecipe,
      sourceUrl: url,
    });
    expect(mockSupadata.fetchTranscript).toHaveBeenCalledWith(url);
    expect(mockOpenRouter.structureRecipe).toHaveBeenCalledWith(transcript);
  });

  it('should fallback to metadata if transcript is empty', async () => {
    const url = 'https://instagram.com/p/123';
    const description = 'Written recipe in caption';
    const structuredRecipe = { title: 'IG Recipe', ingredients: [], instructions: [] };

    mockSupadata.fetchTranscript.mockResolvedValue(''); // Empty
    mockSupadata.fetchMetadata.mockResolvedValue({ description, image: 'ig.jpg' });
    mockOpenRouter.structureRecipe.mockResolvedValue(structuredRecipe);

    const result = await extractor.extractFromUrl(url);

    expect(result.title).toBe('IG Recipe');
    expect(result.image_url).toBe('ig.jpg');
    expect(mockSupadata.fetchMetadata).toHaveBeenCalledWith(url);
    expect(mockOpenRouter.structureRecipe).toHaveBeenCalledWith(description);
  });
});
