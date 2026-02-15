import createMiddleware from "next-intl/middleware";
import { locales, Locale } from "./i18n/request";
import { NextRequest, NextResponse } from "next/server";
import { updateSession } from "./lib/supabase/middleware";
import { PREFERRED_LOCALE_COOKIE, isValidLocale } from "./lib/utils/locale-cookie";

const intlMiddleware = createMiddleware({
  locales,
  defaultLocale: "en",
  localePrefix: 'always',
  localeDetection: true
});

/**
 * Creates a redirect response with the preferred locale cookie set
 */
function createLocaleRedirect(
  request: NextRequest,
  targetPath: string,
  preferredLocale: string
): NextResponse {
  const redirectResponse = NextResponse.redirect(new URL(targetPath, request.url));
  redirectResponse.cookies.set(PREFERRED_LOCALE_COOKIE, preferredLocale, {
    path: '/',
    maxAge: 60 * 60 * 24 * 365,
    sameSite: 'lax',
    secure: process.env.NODE_ENV === 'production',
  });
  return redirectResponse;
}

/**
 * Gets the user's preferred locale, checking cookie first then database
 */
async function getPreferredLocale(
  supabase: ReturnType<typeof updateSession>,
  userId: string,
  request: NextRequest
): Promise<string | null> {
  // Check cookie first (fast path)
  const cookieLocale = request.cookies.get(PREFERRED_LOCALE_COOKIE)?.value;
  if (isValidLocale(cookieLocale)) {
    return cookieLocale;
  }

  // Fall back to database
  try {
    const { data: profile } = await supabase
      .from('profiles')
      .select('preferred_locale')
      .eq('id', userId)
      .single();
    
    if (profile?.preferred_locale && isValidLocale(profile.preferred_locale)) {
      return profile.preferred_locale;
    }
  } catch (error) {
    console.error('Failed to fetch preferred locale:', error);
  }

  return null;
}

export default async function middleware(request: NextRequest) {
  const response = intlMiddleware(request);
  const supabase = updateSession(request, response);
  const { data: { user } } = await supabase.auth.getUser();

  const pathname = request.nextUrl.pathname;
  const segments = pathname.split('/');
  const urlLocale = locales.includes(segments[1] as Locale) ? segments[1] : 'en';

  const isAppPath = pathname.startsWith(`/${urlLocale}/app`) || pathname === `/${urlLocale}/app`;
  const isLoginPage = pathname === `/${urlLocale}/login` || pathname.startsWith(`/${urlLocale}/login/`);
  const isLandingPath = pathname === `/${urlLocale}` || pathname === `/${urlLocale}/`;

  // Redirect unauthenticated users from app to login
  if (isAppPath && !user) {
    return NextResponse.redirect(new URL(`/${urlLocale}/login`, request.url));
  }

  // Redirect authenticated users from landing/login to app with preferred locale
  if ((isLandingPath || isLoginPage) && user) {
    const preferredLocale = await getPreferredLocale(supabase, user.id, request);
    const targetLocale = preferredLocale || urlLocale;
    return createLocaleRedirect(request, `/${targetLocale}/app`, targetLocale);
  }

  // Enforce preferred locale for authenticated users on app paths
  if (isAppPath && user) {
    const preferredLocale = await getPreferredLocale(supabase, user.id, request);
    
    if (preferredLocale && preferredLocale !== urlLocale) {
      // Build redirect path with correct locale
      const newPath = pathname.replace(`/${urlLocale}`, `/${preferredLocale}`);
      return createLocaleRedirect(request, newPath, preferredLocale);
    }
    
    // Ensure cookie is set even if no redirect needed (sync state)
    if (preferredLocale && !request.cookies.get(PREFERRED_LOCALE_COOKIE)?.value) {
      response.cookies.set(PREFERRED_LOCALE_COOKIE, preferredLocale, {
        path: '/',
        maxAge: 60 * 60 * 24 * 365,
        sameSite: 'lax',
        secure: process.env.NODE_ENV === 'production',
      });
    }
  }

  return response;
}

export const config = {
  // Match all routes except static assets and API
  // Explicitly allowing /auth/callback to not be handled by intl if needed
  matcher: ["/((?!api|_next|auth|.*\\..*).*)", "/", "/(en|pt|es)/:path*"],
};
