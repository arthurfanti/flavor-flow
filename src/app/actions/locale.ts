'use server'

import { cookies } from 'next/headers'
import { PREFERRED_LOCALE_COOKIE, isValidLocale } from '@/lib/utils/locale-cookie'

export async function setPreferredLocaleCookie(locale: string) {
    if (!isValidLocale(locale)) return
    
    const cookieStore = await cookies()
    cookieStore.set(PREFERRED_LOCALE_COOKIE, locale, {
        path: '/',
        maxAge: 60 * 60 * 24 * 365,
        sameSite: 'lax',
        secure: process.env.NODE_ENV === 'production',
    })
}