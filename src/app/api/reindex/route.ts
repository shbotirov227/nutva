import { NextResponse } from "next/server";

// Simple endpoint to ping Google & Yandex about sitemap / changed URLs.
// Usage (server-side or manual): fetch('/api/reindex', { method: 'POST' })
// Optional JSON body: { urls: string[] }
// If urls omitted, only sitemap ping is sent.

const BASE = "https://nutva.uz";
const SITEMAP_URL = `${BASE}/sitemap.xml`;

async function ping(url: string) {
  try {
    const res = await fetch(url, { method: 'GET', cache: 'no-store' });
    return { url, ok: res.ok, status: res.status };
  } catch (e) {
    const err = e instanceof Error ? e.message : 'Unknown error';
    return { url, ok: false, status: 0, error: err };
  }
}

export async function POST(req: Request) {
  let body: { urls?: string[] } = {};
  try { body = await req.json(); } catch { /* ignore empty body */ }
  const submitted: string[] = Array.isArray(body.urls) ? body.urls.filter(u => typeof u === 'string') : [];

  // Deduplicate & basic validation
  const cleanUrls = [...new Set(submitted)].filter(u => /^https?:\/\//.test(u));

  // Google & Yandex sitemap ping endpoints
  const pingTargets: string[] = [
    `https://www.google.com/ping?sitemap=${encodeURIComponent(SITEMAP_URL)}`,
    `https://yandex.com/indexnow?url=${encodeURIComponent(SITEMAP_URL)}`,
    `https://yandex.com/ping?sitemap=${encodeURIComponent(SITEMAP_URL)}`,
  ];

  // If specific URLs provided, use IndexNow (Yandex/Bing support) & Google Indexing RPC style (non-official fallback: just recrawl via fetch)
  // NOTE: For guaranteed real-time indexing on Google you need the official Indexing API (requires JobPosting / BroadcastEvent types) – here we do best-effort pings.
  const INDEXNOW_ENDPOINT = 'https://api.indexnow.org/submit';
  if (cleanUrls.length > 0) {
    const key = process.env.INDEXNOW_KEY; // Optional: store an IndexNow key at /.well-known/; else still attempt
    const params = new URLSearchParams({
      url: cleanUrls[0], // IndexNow spec allows a single url param OR JSON body; keep it simple
      key: key || ''
    });
    pingTargets.push(`${INDEXNOW_ENDPOINT}?${params.toString()}`);
  }

  const results = await Promise.all(pingTargets.map(ping));

  return NextResponse.json({
    sitemap: SITEMAP_URL,
    submittedUrls: cleanUrls,
    pings: results,
    note: 'Pings are best-effort. Google may take hours/days; Yandex usually faster. For instant Google reindexing use official Indexing API (restricted) or update internal links + submit in Search Console.'
  });
}

export const runtime = 'edge';
