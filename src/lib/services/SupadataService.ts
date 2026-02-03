import { Supadata, SupadataError } from '@supadata/js';

export class SupadataService {
  private client: Supadata;

  constructor(apiKey: string) {
    this.client = new Supadata({ apiKey });
  }

  async fetchTranscript(url: string, options?: { mode?: 'generate' }): Promise<string> {
    try {
      const result = await this.client.transcript({
        url,
        text: true,
        mode: options?.mode
      });

      // Handle async job response (polling)
      if ('jobId' in result) {
        // Poll for completion
        let job = await this.client.transcript.getJobStatus(result.jobId);
        let retries = 0;
        const maxRetries = 30; // 30 seconds timeout roughly

        while (job.status !== 'completed' && job.status !== 'failed' && retries < maxRetries) {
          await new Promise(resolve => setTimeout(resolve, 1000));
          job = await this.client.transcript.getJobStatus(result.jobId);
          retries++;
        }

        if (job.status === 'failed') {
          // Re-throw internal error structure as a standard error or pass through
          const error = new Error(job.error?.message || 'Transcript job failed');
          if (job.error?.error) {
            (error as any).code = job.error.error;
          }
          throw error;
        }

        if (job.status !== 'completed') {
          throw new Error('Transcript job timed out');
        }

        // job.result is Transcript object
        const content = job.result?.content;
        if (Array.isArray(content)) {
          return content.map(c => c.text).join(' ');
        }
        return (content as string) || '';
      }

      // Handle direct response
      const content = result.content;
      if (Array.isArray(content)) {
        return content.map(c => c.text).join(' ');
      }
      return (content as string) || '';

    } catch (e: any) {
      if (e instanceof SupadataError || e.error) {
        // Map SDK error to our expected structure for retry logic
        const error = new Error(e.message || 'Supadata Error');
        (error as any).code = e.error; // e.g. 'transcript-unavailable'
        throw error;
      }
      throw e;
    }
  }

  async fetchMetadata(url: string): Promise<{ title?: string; description?: string; image?: string }> {
    try {
      const data = await this.client.metadata({ url });

      let image = '';
      if (data.media) {
        if (data.media.type === 'video') {
          image = data.media.thumbnailUrl;
        } else if (data.media.type === 'image') {
          image = data.media.url;
        } else if (data.media.type === 'carousel' && data.media.items.length > 0) {
          const first = data.media.items[0];
          if (first.type === 'video') image = first.thumbnailUrl;
          else if (first.type === 'image') image = first.url;
        }
      }

      return {
        title: data.title || undefined,
        description: data.description || undefined,
        image: image || undefined,
      };
    } catch (e) {
      console.warn('Supadata metadata fetch failed:', e);
      throw new Error('Failed to fetch metadata from Supadata');
    }
  }
}