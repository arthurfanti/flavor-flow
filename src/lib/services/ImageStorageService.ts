import { SupabaseClient } from '@supabase/supabase-js';

export class ImageStorageService {
    private bucketName = 'recipe_thumbnails';

    constructor(private supabase: SupabaseClient) { }

    /**
     * Downloads an image from a URL and uploads it to Supabase Storage.
     * @param imageUrl The external image URL (e.g., from Instagram or YouTube)
     * @returns The storage path and public URL of the uploaded image
     */
    async uploadFromUrl(imageUrl: string): Promise<{ storagePath: string; publicUrl: string } | null> {
        try {
            if (!imageUrl || imageUrl.startsWith('data:')) return null;

            // 1. Download the image
            const response = await fetch(imageUrl);
            if (!response.ok) {
                throw new Error(`Failed to fetch image: ${response.statusText}`);
            }

            const blob = await response.blob();
            const contentType = response.headers.get('content-type') || 'image/jpeg';
            const extension = contentType.split('/')[1] || 'jpg';
            const fileName = `${crypto.randomUUID()}.${extension}`;
            const filePath = `thumbnails/${fileName}`;

            // 2. Upload to Supabase Storage
            const { data, error } = await this.supabase.storage
                .from(this.bucketName)
                .upload(filePath, blob, {
                    contentType,
                    cacheControl: '3600',
                    upsert: false
                });

            if (error) {
                throw error;
            }

            // 3. Get the public URL
            const { data: publicUrlData } = this.supabase.storage
                .from(this.bucketName)
                .getPublicUrl(filePath);

            return {
                storagePath: filePath,
                publicUrl: publicUrlData.publicUrl
            };
        } catch (error) {
            console.error('Error in ImageStorageService.uploadFromUrl:', error);
            return null;
        }
    }
}
