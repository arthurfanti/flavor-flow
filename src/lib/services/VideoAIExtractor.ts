import { RecipeExtractor, ExtractedRecipe } from './RecipeExtractor';
import { SupadataService } from './SupadataService';
import { OpenRouterService } from './OpenRouterService';
import { AIStage } from '@/components/AILoadingOverlay';

export class VideoAIExtractor implements RecipeExtractor {
  constructor(
    private supadata: SupadataService,
    private openRouter: OpenRouterService
  ) { }

  private getYouTubeThumbnail(url: string): string | null {
    const regExp = /^.*((youtu.be\/)|(v\/)|(\/u\/\w\/)|(embed\/)|(watch\?))\??v?=?([^#&?]*).*/;
    const match = url.match(regExp);
    const videoId = (match && match[7].length === 11) ? match[7] : null;
    return videoId ? `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg` : null;
  }

  async extractFromUrl(url: string, onProgress?: (stage: AIStage) => void): Promise<ExtractedRecipe> {
    let sourceText = '';
    let imageUrl = '';

    // Priority 1: YouTube direct thumbnail extraction
    if (url.includes('youtube.com') || url.includes('youtu.be')) {
      imageUrl = this.getYouTubeThumbnail(url) || '';
    }

    // 2. Fetch metadata (Supadata)
    try {
      const metadata = await this.supadata.fetchMetadata(url);

      // Only overwrite if we didn't get a YT thumbnail or if Supadata has something better
      if (!imageUrl || metadata.image) {
        imageUrl = metadata.image || imageUrl;
      }

      sourceText = metadata.description || '';
    } catch (e) {
      console.warn('Metadata extraction failed:', e);
    }

    // 3. Try Transcript as primary source
    try {
      onProgress?.('transcribing');
      const transcript = await this.supadata.fetchTranscript(url);
      if (transcript) {
        sourceText = transcript;
      }
    } catch (e) {
      console.warn('Transcript extraction failed, using description from metadata...');
    }

    if (!sourceText) {
      throw new Error('No content found to extract recipe from (no transcript or description).');
    }

    // 4. AI Structuring
    onProgress?.('analyzing');
    const structured = await this.openRouter.structureRecipe(sourceText);

    onProgress?.('finalizing');
    return {
      ...structured,
      source_url: url,
      sourceUrl: url, // Keep for backward compatibility if needed
      image_url: imageUrl || structured.image_url || null,
    };
  }

  async searchRecipes(query: string): Promise<ExtractedRecipe[]> {
    // OpenRouterService doesn't implement searchRecipes, return empty array
    return [];
  }
}