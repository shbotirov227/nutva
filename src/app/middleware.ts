// middleware.ts
import { NextRequest, NextResponse } from "next/server";

const STRIP_PARAMS = new Set(["etext", "ybaip"]);

export function middleware(req: NextRequest) {
  const url = req.nextUrl;

  // Skip Next internals + api
  if (
    url.pathname.startsWith("/_next") ||
    url.pathname.startsWith("/api") ||
    url.pathname.startsWith("/admin")
  ) {
    return NextResponse.next();
  }

  let changed = false;

  STRIP_PARAMS.forEach((p) => {
    if (url.searchParams.has(p)) {
      url.searchParams.delete(p);
      changed = true;
    }
  });

  if (!changed) return NextResponse.next();

  // If no params left, remove trailing "?"
  const clean = new URL(url.toString());
  clean.search = url.searchParams.toString();

  return NextResponse.redirect(clean, 301);
}

export const config = {
  matcher: [
    // run on everything except next internals / static files
    "/((?!_next/static|_next/image|favicon.ico|robots.txt|sitemap.xml).*)",
  ],
};
