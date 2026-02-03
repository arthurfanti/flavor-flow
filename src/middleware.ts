import createMiddleware from "next-intl/middleware";
import { locales } from "./i18n/request";
import { NextRequest, NextResponse } from "next/server";
import { updateSession } from "./lib/supabase/middleware";

const intlMiddleware = createMiddleware({
  // A list of all locales that are supported
  locales,

  // Used when no locale matches
  defaultLocale: "en",
  localePrefix: 'always',
  localeDetection: true
});

export default async function middleware(request: NextRequest) {
  // 1. Run intl middleware first to handle locales and get the response
  const response = intlMiddleware(request);

  // 2. Initialize Supabase client and update session
  const supabase = updateSession(request, response);

  // 3. Get the user from the updated session
  const { data: { user } } = await supabase.auth.getUser();

  const pathname = request.nextUrl.pathname;

  // Extract locale from pathname (e.g. /en/app -> en)
  const segments = pathname.split('/');
  const locale = locales.includes(segments[1] as any) ? segments[1] : 'en';

  const isAppPath = pathname.startsWith(`/${locale}/app`) || pathname === `/${locale}/app`;
  const isLoginPage = pathname === `/${locale}/login` || pathname.startsWith(`/${locale}/login/`);
  const isLandingPath = pathname === `/${locale}` || pathname === `/${locale}/`;

  // Protect app routes: redirect to login if not authenticated
  if (isAppPath && !user) {
    return NextResponse.redirect(new URL(`/${locale}/login`, request.url));
  }

  // Prevent authenticated users from seeing landing or login page
  if ((isLandingPath || isLoginPage) && user) {
    return NextResponse.redirect(new URL(`/${locale}/app`, request.url));
  }

  return response;
}

export const config = {
  // Match all routes except static assets and API
  matcher: ["/((?!api|_next|.*\\..*).*)"],
};
