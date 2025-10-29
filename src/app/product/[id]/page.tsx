// app/product/[id]/page.tsx
import type { Metadata } from "next";
import ProductDetailClient from "./ProductClient";
import type { GetOneProductType } from "@/types/products/getOneProduct";
import { resolveLang, getOgLocale, getAlternateLocales, buildLocalizedUrls, type Lang } from "@/lib/langUtils";
import { cache } from "react";

/* ---------- helpers ---------- */

type RouteParams = Promise<{ id: string }>;

function ensureHttps(url?: string): string | undefined {
  if (!url) return url;
  try {
    const u = new URL(url);
    if (u.protocol === "http:" && u.hostname === "nutva.uz") {
      u.protocol = "https:";
      return u.toString();
    }
    return url;
  } catch {
    return url;
  }
}

const trim = (s: string, n: number) =>
  s.length > n ? s.slice(0, n - 1).trimEnd() + "…" : s;

interface ProductOptionalFields {
  inStock?: boolean;
  ratingValue?: number;
  ratingCount?: number;
  reviews?: Array<{
    author?: string;
    datePublished?: string;
    ratingValue?: number;
    reviewBody?: string;
  }>;
  breadcrumb?: Array<{ name: string; url: string }>;
}

const getProduct = cache(async function getProduct(
  id: string,
  lang: Lang
): Promise<GetOneProductType & ProductOptionalFields> {
  const base = "https://nutva.uz/api";
  const res = await fetch(`${base}/Product/${id}?lang=${lang}`, {
    // 5 minutes is fine; we’re not reading stock from backend anyway.
    next: { revalidate: 300 },
  });
  if (!res.ok) throw new Error("Failed to fetch product");
  return res.json();
});

/* ---------- JSON-LD types ---------- */

interface AggregateRatingLD {
  "@type": "AggregateRating";
  ratingValue: number;
  ratingCount: number;
}
interface ReviewLD {
  "@type": "Review";
  author?: { "@type": "Person"; name: string };
  datePublished?: string;
  reviewRating?: { "@type": "Rating"; ratingValue: number; bestRating: number };
  reviewBody?: string;
}
interface OfferLD {
  "@type": "Offer";
  url: string;
  priceCurrency: string;
  price: number;
  availability: string;
  itemCondition: "https://schema.org/NewCondition" | string;
  seller: { "@type": "Organization"; name: string };
  priceValidUntil?: string;
}
interface ProductLD {
  "@context": "https://schema.org/";
  "@type": "Product";
  "@id"?: string;
  name: string;
  description: string;
  image: string[];
  sku: string;
  gtin13?: string;
  brand: { "@type": "Brand"; name: string };
  offers: OfferLD;
  aggregateRating?: AggregateRatingLD;
  review?: ReviewLD[];
  category?: string;
  additionalProperty?: Array<{
    "@type": "PropertyValue";
    name: string;
    value: string;
  }>;
  mainEntityOfPage?: string;
}
interface BreadcrumbLD {
  "@context": "https://schema.org";
  "@type": "BreadcrumbList";
  itemListElement: Array<{
    "@type": "ListItem";
    position: number;
    name: string;
    item: string;
  }>;
}

/* ---------- metadata ---------- */

export async function generateMetadata(
  { params }: { params: RouteParams }
): Promise<Metadata> {
  const { id } = await params;
  const lang = await resolveLang();
  const product = await getProduct(id, lang);

  // Strip risky medical claims (RU)
  function cleanSeoText(input: string): string {
    const patterns = [
      /лечит\w*/gi, /лечение\w*/gi, /снимает\s+боль/gi, /при\s+[а-яё]+/gi,
      /артроз\w*/gi, /гастрит\w*/gi, /грыж\w*/gi, /остеохондроз\w*/gi,
      /гепатит\w*/gi, /цистит\w*/gi, /простатит\w*/gi, /бесплод\w*/gi,
      /паразит\w*/gi, /гельминт\w*/gi,
    ];
    let s = input;
    patterns.forEach((re) => { s = s.replace(re, ""); });
    return s.replace(/\s{2,}/g, " ").replace(/\s+([,.;:!?])/g, "$1").trim();
  }

  const rawTitle = product.metaTitle || product.name || "Товар";
  const rawDesc = product.metaDescription || product.description || "Описание товара";
  const title = cleanSeoText(trim(rawTitle, 60));
  const description = cleanSeoText(trim(rawDesc, 160));

  const ogLocale = getOgLocale(lang);
  const alternateLocales = getAlternateLocales(lang);
  const localizedUrls = buildLocalizedUrls(`/product/${id}`);
  const rawImage = product.imageUrls?.[0] || "https://nutva.uz/seo_banner.jpg";
  const image = ensureHttps(rawImage) || "https://nutva.uz/seo_banner.jpg";

  const keywords =
    typeof product.metaKeywords === "string"
      ? product.metaKeywords.split(",").map((k) => k.trim()).filter(Boolean)
      : [];

  return {
    title,
    description,
    keywords,
    other: {
      'product:price:amount': String(product.price ?? 0),
      'product:price:currency': 'UZS',
    },
    alternates: {
      canonical: localizedUrls[lang],
      languages: localizedUrls,
    },
    openGraph: {
      url: localizedUrls[lang],
      siteName: "Nutva Pharm",
      title,
      description,
      images: [{ url: image, width: 1200, height: 630, alt: title }],
      locale: ogLocale,
      alternateLocale: alternateLocales,
      type: 'website',
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [image],
    },
    robots: {
      index: true,
      follow: true,
      nocache: false,
      googleBot: {
        index: true,
        follow: true,
        "max-image-preview": "large",
        "max-video-preview": -1,
        "max-snippet": -1,
      },
    },
  };
}

/* ---------- page ---------- */

export default async function Page({ params }: { params: RouteParams }) {
  const { id } = await params;
  const lang = await resolveLang();
  const product = await getProduct(id, lang);

  // Same SEO sanitize as metadata
  function cleanSeoText(input: string): string {
    const patterns = [
      /лечит\w*/gi, /лечение\w*/gi, /снимает\s+боль/gi, /при\s+[а-яё]+/gi,
      /артроз\w*/gi, /гастрит\w*/gi, /грыж\w*/gi, /остеохондроз\w*/gi,
      /гепатит\w*/gi, /цистит\w*/gi, /простатит\w*/gi, /бесплод\w*/gi,
      /паразит\w*/gi, /гельминт\w*/gi,
    ];
    let s = input;
    patterns.forEach((re) => { s = s.replace(re, ""); });
    return s.replace(/\s{2,}/g, " ").replace(/\s+([,.;:!?])/g, "$1").trim();
  }

  const rawTitle = product.metaTitle || product.name || "Товар";
  const rawDesc = product.metaDescription || product.description || "Описание товара";
  const title = cleanSeoText(trim(rawTitle, 60));
  const description = cleanSeoText(trim(rawDesc, 160));

  const localizedUrls = buildLocalizedUrls(`/product/${id}`);
  const url = localizedUrls[lang];

  // Ensure HTTPS for all images
  const images = (product.imageUrls || [])
    .map((u) => ensureHttps(u))
    .filter((u): u is string => Boolean(u));
  const image = images[0] || "https://nutva.uz/seo_banner.jpg";

  const priceAmount = Number(product.price ?? 0);

  // 🔒 Force InStock for JSON-LD (must match UI & checkout)
  const availabilitySchema = "https://schema.org/InStock";

  const sku = product.id;
  const priceValidUntil = new Date(Date.now() + 1000 * 60 * 60 * 24 * 30)
    .toISOString()
    .split("T")[0];

  function getStructuredExtras(name?: string): {
    gtin13?: string;
    additionalProperty?: { '@type': 'PropertyValue'; name: string; value: string }[];
  } {
    if (!name) return {};
    const n = name.toLowerCase();
    const baseSerial = '001';
    if (n.includes('complex extra')) {
      return {
        gtin13: '4780143600027',
        additionalProperty: [
          { '@type': 'PropertyValue', name: 'Certifications', value: 'ISO 22000:2018; ISO 9001:2015' },
          { '@type': 'PropertyValue', name: 'TU', value: 'TU 310113257-006:2025' },
          { '@type': 'PropertyValue', name: 'Serial Number', value: baseSerial },
        ],
      };
    }
    if (n.includes('complex') && !n.includes('extra')) {
      return {
        gtin13: '4780143600096',
        additionalProperty: [
          { '@type': 'PropertyValue', name: 'Certifications', value: 'ISO 22000:2018; ISO 9001:2015' },
          { '@type': 'PropertyValue', name: 'TU', value: 'TU 310113257-006:2025' },
          { '@type': 'PropertyValue', name: 'Serial Number', value: baseSerial },
        ],
      };
    }
    if (n.includes('gelmin kids')) {
      return {
        gtin13: '4780143600089',
        additionalProperty: [
          { '@type': 'PropertyValue', name: 'Certifications', value: 'ISO 22000:2018; ISO 9001:2015' },
          { '@type': 'PropertyValue', name: 'TU', value: 'TU 310713257-006:2025' },
          { '@type': 'PropertyValue', name: 'Serial Number', value: baseSerial },
          { '@type': 'PropertyValue', name: 'Capsules', value: '60 pcs (0.26 g each), Net weight 15.6 g' },
          { '@type': 'PropertyValue', name: 'Ingredients', value: "Indov (Rukola) 136.7 mg; Qora sedana ~46 mg; Uora andiz 37.7 mg; Bo‘ymodaron 12.5 mg; Qovoq urug‘i 12.4 mg; Makkai sano (Senna) 12.2 mg; Dastarbosh (Pizhma) 11.7 mg" },
        ],
      };
    }
    return {};
  }
  const extras = getStructuredExtras(product.name);

  const productJsonLd: ProductLD = {
    "@context": "https://schema.org/",
    "@type": "Product",
    "@id": `${url}#product`,
    name: title,
    description,
    image: images.length ? images : [image],
    sku,
    gtin13: extras.gtin13,
    brand: { "@type": "Brand", name: "Nutva" },
    offers: {
      "@type": "Offer",
      url,
      priceCurrency: "UZS",
      price: priceAmount,
      availability: availabilitySchema,      // <-- always InStock
      itemCondition: "https://schema.org/NewCondition",
      seller: { "@type": "Organization", name: "Nutva" },
      priceValidUntil,
    },
    category: "Dietary Supplements",
    additionalProperty: extras.additionalProperty,

    mainEntityOfPage: url,
  };

  if (typeof product.ratingValue === "number" && typeof product.ratingCount === "number" && product.ratingCount > 0) {
    productJsonLd.aggregateRating = {
      "@type": "AggregateRating",
      ratingValue: product.ratingValue,
      ratingCount: product.ratingCount,
    };
  }

  const breadcrumbsLD: BreadcrumbLD | null =
    Array.isArray(product.breadcrumb) && product.breadcrumb.length > 0
      ? {
          "@context": "https://schema.org",
          "@type": "BreadcrumbList",
          itemListElement: product.breadcrumb.map((b, i) => ({
            "@type": "ListItem",
            position: i + 1,
            name: b.name,
            item: b.url.startsWith("http") ? b.url : `https://nutva.uz${b.url}`,
          })),
        }
      : null;

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(productJsonLd) }} />
      {breadcrumbsLD && (
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbsLD) }} />
      )}
      <ProductDetailClient id={id} initialProduct={product} initialLang={lang} />
    </>
  );
}
