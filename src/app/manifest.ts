import { MetadataRoute } from 'next'

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'Flavor Flow',
    short_name: 'Flavor Flow',
    description: 'Transform video recipes into a shopping list',
    start_url: '/',
    id: '/',
    display: 'standalone',
    background_color: '#ffffff',
    theme_color: '#ffffff',
    icons: [
      {
        src: '/icon.svg',
        sizes: '192x192',
        type: 'image/svg+xml',
      },
      {
        src: '/icon.svg',
        sizes: '512x512',
        type: 'image/svg+xml',
      },
    ],
    screenshots: [
      {
        src: '/screenshot-mobile.svg',
        sizes: '1080x1920',
        type: 'image/svg+xml',
        // @ts-ignore - Next.js types might not yet fully support form_factor
        form_factor: 'narrow',
      },
      {
        src: '/screenshot-desktop.svg',
        sizes: '1920x1080',
        type: 'image/svg+xml',
        // @ts-ignore
        form_factor: 'wide',
      },
    ],
  }
}

// Named export for testing
export { manifest }
