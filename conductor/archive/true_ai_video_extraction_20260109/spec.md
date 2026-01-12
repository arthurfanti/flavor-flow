# Track Spec: True AI Video Extraction with Supadata & MiniMax

## Overview
This track replaces the previous scraping-based extraction with a "True AI" pipeline. The app will use Supadata.ai to extract transcripts directly from video audio (YouTube, Instagram, TikTok) and leverage MiniMax M2.1 (via OpenRouter) to structure that raw audio into refined ingredients and instructions.

## Functional Requirements
### 1. AI Extraction Pipeline
- **Transcription Service:** Integrate Supadata.ai API to fetch transcripts from provided video URLs.
- **AI Structuring Engine:** Integrate OpenRouter with the MiniMax M2.1 model.
- **Prompt Engineering:** Develop a robust system prompt that instructs MiniMax to extract ingredients (with quantities) and numbered instructions from the transcript.
- **Multi-Source Logic:** If a transcript is unavailable, the system should fall back to scraping the video description as a secondary data source.

### 2. UI/UX: Step-by-Step AI Progress
- **Dynamic Loading State:** Implement a sophisticated extraction overlay with 3D-inspired icons (Airbnb style) for each phase:
    1. **Transcribing:** Extracting what is being said in the video.
    2. **Analyzing:** Thinking through ingredients and steps with MiniMax.
    3. **Finalizing:** Rendering your editorial-style recipe.
- **Animation:** Use smooth transitions between loading stages to maintain the "Adult Aesthetic."

### 3. Multi-Platform & Language Support
- Support standard URL formats for YouTube, Instagram, and TikTok.
- Ensure the AI can process non-English transcripts and produce structured English output (or preserve the source language as appropriate).

## Technical Requirements
- **API Management:** Store and use `NEXT_PUBLIC_SUPADATA_API_KEY` and `NEXT_PUBLIC_OPENROUTER_API_KEY`.
- **Error Handling:** Gracefully handle API timeouts, rate limits, or videos without accessible audio/transcripts.

## Acceptance Criteria
- Pasting a YouTube link with *only spoken ingredients* results in a complete, structured recipe list in the app.
- The UI displays specific, visually appealing loading stages during the process.
- No "junk" (like copyright footers) appears in the ingredient list.
- Extracted recipes are saved to Supabase following the successful AI pass.

## Out of Scope
- Real-time video playback inside the app.
- Manual audio file uploads (URLs only for now).
