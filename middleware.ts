// import { withAuth } from "next-auth/middleware";

// export default withAuth({
//   pages: {
//     signIn: "/login",
//   },
// });

// export const config = {
//   matcher: ["/admin/:path*"],
// };


import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const PUBLIC_FILE = /\.(.*)$/;
const locales = ["uz", "ru", "en"] as const;
const fallbackLng = "uz" as const;

export default function middleware(req: NextRequest) {
    const url = req.nextUrl.clone();
    const { pathname, searchParams } = url;

    // 1) Clean tracking params early
    const paramsToRemove = ["srsltid", "utm_source", "utm_medium", "utm_campaign"];
    let cleaned = false;
    for (const p of paramsToRemove) {
      if (searchParams.has(p)) {
        searchParams.delete(p);
        cleaned = true;
      }
    }
  if (cleaned) {
      url.search = searchParams.toString();
      return NextResponse.redirect(url, 301);
    }

    // Skip non-page assets and API
    if (pathname.startsWith("/api") || PUBLIC_FILE.test(pathname) || pathname.startsWith("/_next")) {
      // If the URL already has a locale segment, reflect it in the cookie for consistency
      const localeMatch = pathname.match(/^\/(uz|ru|en)(?:\/|$)/);
      if (localeMatch) {
        const res = NextResponse.next();
        res.cookies.set("lang", localeMatch[1], { path: "/", maxAge: 60 * 60 * 24 * 365 });
        return res;
      }
  return NextResponse.next();
    }

    const hasLocale = locales.some((l) => pathname === `/${l}` || pathname.startsWith(`/${l}/`));

    // 2) If missing locale, redirect to preferred (cookie or fallback)
    if (!hasLocale) {
      const cookieLang = req.cookies.get("lang")?.value;
      const isSupported = cookieLang && locales.includes(cookieLang as (typeof locales)[number]);
      const lang = (isSupported ? (cookieLang as (typeof locales)[number]) : fallbackLng);
      url.pathname = `/${lang}${pathname}`;
  const res = NextResponse.redirect(url);
  res.cookies.set("lang", lang, { path: "/", maxAge: 60 * 60 * 24 * 365 });
  res.headers.set("x-lang", lang);
  res.headers.set("content-language", lang);
  return res;
    }

    // 3) If locale exists in path, rewrite to underlying route without the prefix
    const localeMatch = pathname.match(/^\/(uz|ru|en)(?:\/(.*))?$/);
    if (localeMatch) {
      const currentLocale = localeMatch[1];
      const rest = localeMatch[2] ? `/${localeMatch[2]}` : "/";
      const rewriteUrl = req.nextUrl.clone();
      rewriteUrl.pathname = rest;
  const res = NextResponse.rewrite(rewriteUrl);
      // Keep cookie in sync
      res.cookies.set("lang", currentLocale, { path: "/", maxAge: 60 * 60 * 24 * 365 });
      res.headers.set("x-lang", currentLocale);
      res.headers.set("content-language", currentLocale);
      return res;
    }

    return NextResponse.next();
}

export const config = {
  // Exclude Next internals and common public files
  matcher: ["/((?!api|_next|_static|favicon.ico|robots.txt|sitemap.xml|seo_banner.jpg).*)"],
};
