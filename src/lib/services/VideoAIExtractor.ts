import { RecipeExtractor, ExtractedRecipe } from './RecipeExtractor';
import { SupadataService } from './SupadataService';
import { OpenRouterService } from './OpenRouterService';
import { AIStage } from '@/components/AILoadingOverlay';

export class VideoAIExtractor implements RecipeExtractor {
  constructor(
    private supadata: SupadataService,
    private openRouter: OpenRouterService
  ) {}

  async extractFromUrl(url: string, onProgress?: (stage: AIStage) => void): Promise<ExtractedRecipe> {
    let sourceText = '';
    let imageUrl = '';

    // 1. Fetch metadata first to ensure we always have an image and a backup description
    try {
      const metadata = await this.supadata.fetchMetadata(url);
      imageUrl = metadata.image || '';
      sourceText = metadata.description || '';
    } catch (e) {
      console.warn('Metadata extraction failed:', e);
    }

    // 2. Try Transcript as primary source
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

    // 3. AI Structuring
    onProgress?.('analyzing');
    const structured = await this.openRouter.structureRecipe(sourceText);

    onProgress?.('finalizing');
    return {
      ...structured,
      source_url: url,
      sourceUrl: url, // Keep for backward compatibility if needed
      image_url: imageUrl || structured.image_url,
    };
  }

  async searchRecipes(query: string): Promise<ExtractedRecipe[]> {
    // OpenRouterService doesn't implement searchRecipes, return empty array
    return [];
  }
}