// app/product/[id]/head.tsx
import { cookies, headers } from "next/headers";

type Lang = "uz" | "ru" | "en";
type RouteParams = Promise<{ id: string }>;

async function resolveLang(): Promise<Lang> {
  const c = await cookies();
  const h = await headers();
  const fromCookie = c.get("lang")?.value?.toLowerCase();
  const fromHeader = h.get("x-lang")?.toLowerCase();
  const candidate = (fromCookie || fromHeader || "uz") as Lang;
  return (["uz", "ru", "en"].includes(candidate) ? candidate : "uz") as Lang;
}

function ogLocale(lang: Lang): string {
  switch (lang) {
    case "ru": return "ru_RU";
    case "en": return "en_US";
    default:   return "uz_UZ";
  }
}

export default async function Head({ params }: { params: RouteParams }) {
  const { id } = await params;
  const lang = await resolveLang();
  const res = await fetch(`https://nutva.uz/api/Product/${id}?lang=${lang}`, { cache: "no-store" });
  if (!res.ok) return null;
  const p = await res.json();

  const imgRaw: string = p?.imageUrls?.[0] || "https://nutva.uz/seo_banner.jpg";
  // const img = imgRaw.startsWith("http://nutva.uz/") ? imgRaw.replace("http://", "https://") : imgRaw;
  const price = String(Number(p?.price ?? 0));
  const inStock: boolean = typeof p?.inStock === "boolean" ? p.inStock : true;

  return (
    <>
      {/* Product-specific OG tags with property=... (best for FB/X/Telegram) */}
      <meta property="og:type" content="product" />
      <meta property="og:locale" content={ogLocale(lang)} />
      <meta property="product:brand" content="Nutva" />
      <meta property="product:retailer_item_id" content={p?.id ?? ""} />
      <meta property="product:price:amount" content={price} />
      <meta property="product:price:currency" content="UZS" />
      <meta property="product:availability" content={inStock ? "instock" : "out of stock"} />

      {/* (Optional duplicates — Next already sets core OG from Metadata; leave minimal here)
          If you want to force, uncomment:
      */}
      <meta property="og:image" content={imgRaw} />
      <meta property="og:image:width" content="1200" />
      <meta property="og:image:height" content="630" />
    </>
  );
}
