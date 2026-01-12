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
    
    // Handle array of content objects
    if (Array.isArray(data.content)) {
      return data.content.map((item: any) => item.text).join(' ');
    }
    
    return data.content || '';
  }

  async fetchMetadata(url: string): Promise<{ title?: string; description?: string; image?: string }> {
    const response = await fetch(`${this.baseUrl}/media/metadata?url=${encodeURIComponent(url)}`, {
      headers: {
        'x-api-key': this.apiKey,
      },
    });

    if (!response.ok) {
      throw new Error('Failed to fetch metadata from Supadata');
    }

    const data = await response.json();
    return {
      title: data.title,
      description: data.description,
      image: data.image || data.thumbnail,
    };
  }
}