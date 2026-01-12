import { RecipeExtractor, ExtractedRecipe } from './RecipeExtractor';
import { SupadataService } from './SupadataService';
import { OpenRouterService } from './OpenRouterService';

export class VideoAIExtractor implements RecipeExtractor {
  constructor(
    private supadata: SupadataService,
    private openRouter: OpenRouterService
  ) {}

  async extractFromUrl(url: string): Promise<ExtractedRecipe> {
    let sourceText = '';
    let imageUrl = '';

    try {
      // 1. Try Transcript first
      sourceText = await this.supadata.fetchTranscript(url);
    } catch (e) {
      console.warn('Transcript extraction failed, falling back to metadata...');
    }

    // 2. Fallback to description if transcript is empty/failed
    if (!sourceText) {
      const metadata = await this.supadata.fetchMetadata(url);
      sourceText = metadata.description || '';
      imageUrl = metadata.image || '';
    }

    if (!sourceText) {
      throw new Error('No content found to extract recipe from (no transcript or description).');
    }

    // 3. AI Structuring
    const structured = await this.openRouter.structureRecipe(sourceText);

    return {
      ...structured,
      sourceUrl: url,
      image_url: imageUrl || structured.image_url,
    };
  }

  async searchRecipes(query: string): Promise<ExtractedRecipe[]> {
    return this.openRouter.searchRecipes?.(query) || [];
  }
}