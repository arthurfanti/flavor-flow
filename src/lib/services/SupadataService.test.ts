import { SupadataService } from './SupadataService';

const mockTranscript = jest.fn();

jest.mock('@supadata/js', () => {
  class SupadataError extends Error {
    error?: string;
  }
  return {
    Supadata: jest.fn().mockImplementation(() => ({
      transcript: mockTranscript,
    })),
    SupadataError,
  };
});

describe('SupadataService', () => {
  const apiKey = 'test-api-key';
  let service: SupadataService;

  beforeEach(() => {
    service = new SupadataService(apiKey);
    mockTranscript.mockReset();
  });

  it('should fetch transcript successfully from YouTube URL', async () => {
    const mockResponse = {
      content: [
        { text: 'First part.' },
        { text: 'Second part.' }
      ]
    };
    mockTranscript.mockResolvedValue(mockResponse);

    const transcript = await service.fetchTranscript('https://youtube.com/watch?v=test');
    
    expect(transcript).toBe('First part. Second part.');
    expect(mockTranscript).toHaveBeenCalledWith({
      url: 'https://youtube.com/watch?v=test',
      text: true,
      mode: undefined,
    });
  });

  it('should throw an error when API fails', async () => {
    const { SupadataError } = require('@supadata/js');
    mockTranscript.mockRejectedValue(new SupadataError('Failed to fetch transcript from Supadata'));

    await expect(service.fetchTranscript('https://youtube.com/watch?v=fail'))
      .rejects.toThrow('Failed to fetch transcript from Supadata');
  });
});
