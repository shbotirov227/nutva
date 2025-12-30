// app/robots.txt/route.ts
export const runtime = "nodejs"; // or "edge" if you prefer

export async function GET() {
  const body = `
User-agent: *
Allow: /

Disallow: /api/
Disallow: /admin/
Disallow: /private/

# IMPORTANT: do NOT block /_next/ for Google rendering. Keep it crawlable.

Sitemap: https://nutva.uz/sitemap.xml
Sitemap: https://nutva.uz/sitemap-0.xml

# Yandex cleanup for tracking params causing duplicates
User-agent: Yandex
Allow: /

Disallow: /api/
Disallow: /admin/
Disallow: /private/

Crawl-delay: 1
Clean-param: etext&ybaip /

Host: nutva.uz
`.trim();

  return new Response(body, {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Cache-Control": "public, max-age=3600",
    },
  });
}
