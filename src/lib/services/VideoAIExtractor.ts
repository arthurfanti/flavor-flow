import { RecipeExtractor, ExtractedRecipe } from "./RecipeExtractor";
import { SupadataService } from "./SupadataService";
import { OpenRouterService } from "./OpenRouterService";
import { AIStage } from "@/components/AILoadingOverlay";

export class VideoAIExtractor implements RecipeExtractor {
  constructor(
    private supadata: SupadataService,
    private openRouter: OpenRouterService,
  ) {}

  private async getYouTubeThumbnail(url: string): Promise<string | null> {
    const regExp =
      /^.*((youtu.be\/)|(v\/)|(\/u\/\w\/)|(embed\/)|(watch\?))\??v?=?([^#&?]*).*/;
    const match = url.match(regExp);
    const videoId = match && match[7].length === 11 ? match[7] : null;

    if (!videoId) return null;

    const resolutions = [
      "maxresdefault.jpg",
      "sddefault.jpg",
      "hqdefault.jpg",
      "mqdefault.jpg",
      "default.jpg",
    ];
    for (const res of resolutions) {
      const imgUrl = `https://img.youtube.com/vi/${videoId}/${res}`;
      try {
        const response = await fetch(imgUrl, { method: "HEAD" });
        if (response.ok) {
          return imgUrl;
        }
      } catch (e) {
        // Ignore fetch errors and try the next resolution
      }
    }

    // Fallback if all else fails (though hqdefault is almost always present)
    return `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`;
  }

  async extractFromUrl(
    url: string,
    onProgress?: (stage: AIStage) => void,
  ): Promise<ExtractedRecipe> {
    let sourceText = "";
    let imageUrl = "";

    // Priority 1: YouTube direct thumbnail extraction
    if (url.includes("youtube.com") || url.includes("youtu.be")) {
      imageUrl = (await this.getYouTubeThumbnail(url)) || "";
    }

    // 2. Fetch metadata (Supadata)
    try {
      const metadata = await this.supadata.fetchMetadata(url);

      // Only use metadata image if we didn't get a YT thumbnail
      if (!imageUrl && metadata.image) {
        imageUrl = metadata.image;
      }

      sourceText = metadata.description || "";
    } catch (e) {
      console.warn("Metadata extraction failed:", e);
    }

    // 3. Try Transcript as primary source
    try {
      onProgress?.("transcribing");
      const transcript = await this.supadata.fetchTranscript(url);
      if (transcript) {
        sourceText = transcript;
      }
    } catch (e: any) {
      console.warn("Transcript extraction failed:", e);
      console.dir(e, { depth: null, colors: true });

      // If specific error AND we don't have metadata description, retry with mode=generate
      if (e.code === "transcript-unavailable" && !sourceText) {
        try {
          console.log("Retrying transcription with mode=generate...");
          const generatedTranscript = await this.supadata.fetchTranscript(url, {
            mode: "generate",
          });
          if (generatedTranscript) {
            sourceText = generatedTranscript;
          }
        } catch (retryError) {
          console.warn("Retry with generate mode also failed:", retryError);
        }
      } else {
        console.warn(
          "Transcript extraction failed, using description from metadata...",
        );
      }
    }

    if (!sourceText) {
      throw new Error(
        "No content found to extract recipe from (no transcript or description).",
      );
    }

    // 4. AI Structuring
    onProgress?.("analyzing");
    const structured = await this.openRouter.structureRecipe(sourceText);

    onProgress?.("finalizing");
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
