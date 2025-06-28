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
      return NextResponse.next();
    }

    const pathnameIsMissingLocale = locales.every(
      (locale) => !pathname.startsWith(`/${locale}`)
    );

    if (pathnameIsMissingLocale) {
      const lang =
        req.cookies.get("lang")?.value || fallbackLng;

      const url = req.nextUrl.clone();
      url.pathname = `/${lang}${pathname}`;
      return NextResponse.redirect(url);
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
