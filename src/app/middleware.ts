// middleware.ts
import { NextRequest, NextResponse } from "next/server";

const SEO_PARAMS = new Set(["etext", "ybaip"]);

function isBot(userAgent: string) {
  const ua = userAgent.toLowerCase();
  return (
    ua.includes("googlebot") ||
    ua.includes("yandex") ||
    ua.includes("bingbot") ||
    ua.includes("duckduckbot") ||
    ua.includes("slurp")
  );
}

export function middleware(req: NextRequest) {
  const url = req.nextUrl.clone();
  const ua = req.headers.get("user-agent") || "";

  // FAQAT robotlar uchun tozalash
  if (isBot(ua)) {
    let changed = false;
    for (const p of SEO_PARAMS) {
      if (url.searchParams.has(p)) {
        url.searchParams.delete(p);
        changed = true;
      }
    }
    if (changed) {
      return NextResponse.redirect(url, 308);
    }
  }

  // Odamlar uchun hech narsa qilmaymiz
  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!_next|api|.*\\..*).*)"],
};
