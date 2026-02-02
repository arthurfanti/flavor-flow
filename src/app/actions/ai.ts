'use server';

import { OpenRouterService } from '@/lib/services/OpenRouterService';
import { SupadataService } from '@/lib/services/SupadataService';
import { VideoAIExtractor } from '@/lib/services/VideoAIExtractor';
import { TranslationService, TranslatableRecipe } from '@/lib/services/TranslationService';
import { AIStage } from '@/components/AILoadingOverlay';

function getServices() {
    const supadataKey = process.env.SUPADATA_API_KEY;
    const openRouterKey = process.env.OPENROUTER_API_KEY;

    if (!supadataKey || !openRouterKey) {
        throw new Error("AI Extraction keys (Supadata/OpenRouter) are missing from server environment.");
    }

    return {
        supadata: new SupadataService(supadataKey),
        openRouter: new OpenRouterService(openRouterKey)
    };
}

export async function extractRecipeAction(url: string) {
    try {
        const { supadata, openRouter } = getServices();
        const extractor = new VideoAIExtractor(supadata, openRouter);

        // Note: The onProgress callback cannot be passed over the network to a Server Action
        // We'll have to rely on the client state for loading indication or implement a different mechanism if granular progress is needed.
        // For now, we'll run it without progress updates or simulate them on client if needed.

        return await extractor.extractFromUrl(url);
    } catch (error: any) {
        console.error("Extract Recipe Action failed:", error);
        throw new Error(error.message || "Failed to extract recipe");
    }
}

export async function translateRecipeAction(recipe: TranslatableRecipe, targetLocale: string) {
    try {
        const { openRouter } = getServices();
        const translationService = new TranslationService(openRouter);

        return await translationService.translateRecipe(recipe, targetLocale);
    } catch (error: any) {
        console.error("Translate Recipe Action failed:", error);
        throw new Error(error.message || "Failed to translate recipe");
    }
}
