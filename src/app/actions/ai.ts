'use server';

import { OpenRouterService } from '@/lib/services/OpenRouterService';
import { SupadataService } from '@/lib/services/SupadataService';
import { VideoAIExtractor } from '@/lib/services/VideoAIExtractor';
import { TranslationService, TranslatableRecipe } from '@/lib/services/TranslationService';
import { ImageStorageService } from '@/lib/services/ImageStorageService';
import { createClient as createSupabaseServerClient } from '@/lib/supabase/server';

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
        const recipe = await extractor.extractFromUrl(url);

        // Upload thumbnail to Supabase if it exists
        if (recipe.image_url) {
            try {
                const supabase = await createSupabaseServerClient();
                const storageService = new ImageStorageService(supabase);
                const uploadResult = await storageService.uploadFromUrl(recipe.image_url);

                if (uploadResult) {
                    recipe.image_url = uploadResult.publicUrl;
                    (recipe as any).storage_path = uploadResult.storagePath;
                }
            } catch (storageError) {
                console.warn("Failed to upload thumbnail to Supabase storage:", storageError);
                // Fall back to original image_url
            }
        }

        return recipe;
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
