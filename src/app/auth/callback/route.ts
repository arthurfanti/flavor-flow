import { createServerClient, type CookieOptions } from '@supabase/ssr'
import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'

export async function GET(request: Request) {
    const { searchParams, origin } = new URL(request.url)
    const code = searchParams.get('code')
    // if "next" is in search params, use it as the redirection URL
    const next = searchParams.get('next') ?? '/app'

    if (code) {
        const cookieStore = cookies()
        const supabase = createServerClient(
            process.env.NEXT_PUBLIC_SUPABASE_URL!,
            process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_DEFAULT_KEY!,
            {
                cookies: {
                    get(name: string) {
                        return cookieStore.get(name)?.value
                    },
                    set(name: string, value: string, options: CookieOptions) {
                        cookieStore.set({ name, value, ...options })
                    },
                    remove(name: string, options: CookieOptions) {
                        cookieStore.delete({ name, ...options })
                    },
                },
            }
        )
        const { error: exchangeError } = await supabase.auth.exchangeCodeForSession(code)
        if (!exchangeError) {
            const { data: { user } } = await supabase.auth.getUser()
            if (user) {
                try {
                    const { SupabaseProfileRepository } = await import('@/lib/repositories/SupabaseProfileRepository')
                    const profileRepo = new SupabaseProfileRepository(supabase)
                    let profile = await profileRepo.getProfile(user.id)

                    if (!profile) {
                        // Determine locale from "next" if possible, or default to en
                        let initialLocale = 'en'
                        const match = next.match(/^\/([a-z]{2}(-[A-Z]{2})?)\//)
                        if (match) initialLocale = match[1]

                        await profileRepo.upsertProfile({
                            id: user.id,
                            display_name: user.user_metadata.full_name || user.user_metadata.name || null,
                            avatar_url: user.user_metadata.avatar_url || null,
                            preferred_locale: initialLocale,
                        })
                        profile = await profileRepo.getProfile(user.id)
                    }

                    const preferredLocale = profile?.preferred_locale || 'en'
                    // Clean up next to remove locale prefix if it exists to avoid double prefixing
                    // Only match supported locales followed by a slash or end of string
                    const cleanNext = next.replace(/^\/(en|pt|es|pt-BR)(\/|$)/, '$2') || '/app'
                    // Ensure cleanNext starts with a slash if it's not empty and doesn't have one
                    const finalNext = cleanNext.startsWith('/') ? cleanNext : `/${cleanNext}`

                    return NextResponse.redirect(`${origin}/${preferredLocale}${finalNext}`)
                } catch (e) {
                    console.error("Failed to fetch/create profile in callback", e)
                    return NextResponse.redirect(`${origin}${next}`)
                }
            }
        }
        return NextResponse.redirect(`${origin}${next}`)
    }

    // return the user to an error page with instructions
    return NextResponse.redirect(`${origin}/auth/auth-code-error`)
}
