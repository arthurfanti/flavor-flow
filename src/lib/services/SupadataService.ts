export class SupadataService {
  private baseUrl = 'https://api.supadata.ai/v1';

  constructor(private apiKey: string) {}

  async fetchTranscript(url: string): Promise<string> {
    const response = await fetch(`${this.baseUrl}/youtube/transcript?url=${encodeURIComponent(url)}`, {
      headers: {
        'x-api-key': this.apiKey,
      },
    });

    if (!response.ok) {
      throw new Error('Failed to fetch transcript from Supadata');
    }

    const data = await response.json();
    return data.content || '';
  }
}