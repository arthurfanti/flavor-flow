# Tech Stack: Flavor Flow

## Frontend
- **Framework:** React (Next.js) - Chosen for its robust ecosystem, SEO capabilities (if needed), and excellent support for building Progressive Web Apps (PWAs).
- **Styling:** Tailwind CSS - Utility-first CSS for rapid development of a clean, sophisticated, and responsive UI.
- **UI Components:** Magic UI & Framer Motion - For high-impact visual effects (glow, neon, beams) and smooth transitions.
- **Iconography:** Lucide React & Material Symbols (Rounded) - For a versatile and expressive icon system.
- **Utilities:** `clsx`, `tailwind-merge` - For safe and efficient class name management.
- **Notifications:** Sonner - Modern, lightweight toast library for non-blocking feedback.
- **State Management:** React Query (TanStack Query) - For efficient data fetching, caching, and handling the synchronization between the app and the backend.

## Backend & Infrastructure
- **BaaS (Backend as a Service):** Supabase - Provides a fast foundation for authentication (Supabase Auth), real-time database (PostgreSQL), and storage. 
    - *Strategic Note:* We will implement a repository pattern in the frontend to abstract database calls, ensuring we can migrate to a custom backend (like Node.js or Python) in the future without a full rewrite.
    - *Security:* Row Level Security (RLS) is used to isolate user-bounded data (pantry, shopping list, planner).
- **PWA Support:** Native Next.js support (Metadata API for Manifest) + Custom Service Worker - To handle installability and offline caching without reliance on outdated third-party packages.

## External Services
- **Recipe Extraction Pipeline:**
    - **Supadata.ai:** Used for fetching video transcripts and media metadata.
    - **OpenRouter (MiniMax M2.1):** Used for transforming raw transcripts into structured recipe JSON (ingredients and instructions).
- **On-Demand Translation:**
    - **OpenRouter (MiniMax M2.1):** Used for translating recipe fields (title, ingredients, instructions) into user-preferred languages.

## Development & Deployment
- **Language:** TypeScript - For type safety and better developer experience across the stack.
- **Hosting:** Vercel (recommended for Next.js) or Netlify.
