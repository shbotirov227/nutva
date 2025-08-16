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
import { withAuth } from "next-auth/middleware";

const PUBLIC_FILE = /\.(.*)$/;
const locales = ["uz", "ru", "en"];
const fallbackLng = "uz";

export default withAuth(
  function middleware(req: NextRequest) {
    const { pathname } = req.nextUrl;

    if (
      pathname.startsWith("/api") ||
      PUBLIC_FILE.test(pathname) ||
      pathname.startsWith("/_next")
    ) {
      // If the URL already has a locale segment, reflect it in the cookie for consistency
      const localeMatch = pathname.match(/^\/(uz|ru|en)(?:\/|$)/);
      if (localeMatch) {
        const res = NextResponse.next();
        res.cookies.set("lang", localeMatch[1], { path: "/", maxAge: 60 * 60 * 24 * 365 });
        return res;
      }

      return NextResponse.next();
    }

    const pathnameIsMissingLocale = locales.every(
      (locale) => !pathname.startsWith(`/${locale}`)
    );

    if (pathnameIsMissingLocale) {
      const cookieLang = req.cookies.get("lang")?.value;
      const lang = locales.includes(cookieLang || "") ? (cookieLang as string) : fallbackLng;

      const url = req.nextUrl.clone();
      url.pathname = `/${lang}${pathname}`;
      const res = NextResponse.redirect(url);
      // Ensure cookie exists on first visit so client detection uses it
      res.cookies.set("lang", lang, { path: "/", maxAge: 60 * 60 * 24 * 365 });
      return res;
    }

    // Keep cookie synced with the current locale segment when it exists
    const localeMatch = pathname.match(/^\/(uz|ru|en)(?:\/|$)/);
    if (localeMatch) {
      const res = NextResponse.next();
      res.cookies.set("lang", localeMatch[1], { path: "/", maxAge: 60 * 60 * 24 * 365 });
      return res;
    }

    return NextResponse.next();
  },
  {
    pages: {
      signIn: "/login",
    },
  }
);

export const config = {
  matcher: ["/((?!api|_next|_static|favicon.ico).*)"],
};
