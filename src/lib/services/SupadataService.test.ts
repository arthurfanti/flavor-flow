import { SupadataService } from './SupadataService';

describe('SupadataService', () => {
  const apiKey = 'test-api-key';
  let service: SupadataService;

  beforeEach(() => {
    service = new SupadataService(apiKey);
    global.fetch = jest.fn();
  });

  it('should fetch transcript successfully from YouTube URL', async () => {
    const mockTranscript = 'This is a test transcript of a recipe.';
    (global.fetch as jest.Mock).mockResolvedValue({
      ok: true,
      json: () => Promise.resolve({ content: mockTranscript }),
    });

    const transcript = await service.fetchTranscript('https://youtube.com/watch?v=test');
    
    expect(transcript).toBe(mockTranscript);
    expect(global.fetch).toHaveBeenCalledWith(
      expect.stringContaining('supadata.ai'),
      expect.objectContaining({
        headers: expect.objectContaining({
          'x-api-key': apiKey,
        }),
      })
    );
  });

  it('should throw an error when API fails', async () => {
    (global.fetch as jest.Mock).mockResolvedValue({
      ok: false,
      status: 500,
    });

    await expect(service.fetchTranscript('https://youtube.com/watch?v=fail'))
      .rejects.toThrow('Failed to fetch transcript from Supadata');
  });
});
