import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  const url = request.nextUrl.clone();

  const paramsToRemove = ["srsltid", "utm_source", "utm_medium", "utm_campaign"];
  let hasRedirect = false;

  for (const param of paramsToRemove) {
    if (url.searchParams.has(param)) {
      url.searchParams.delete(param);
      hasRedirect = true;
    }
  }

  if (hasRedirect) {
    return NextResponse.redirect(url, 301);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/", "/:path*"],
};
