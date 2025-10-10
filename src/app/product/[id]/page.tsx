// app/product/[id]/page.tsx
import type { Metadata } from "next";
import ProductDetailClient from "./ProductClient";
import type { GetOneProductType } from "@/types/products/getOneProduct";
import { resolveLang, getOgLocale, getAlternateLocales, buildLocalizedUrls, type Lang } from "@/lib/langUtils";
import { cache } from "react";

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

// Optional fields you may add to your API without breaking types
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
    // Reuse result within the same request and revalidate periodically in production
    next: { revalidate: 60 },
  });
  if (!res.ok) throw new Error("Failed to fetch product");
  return res.json();
});

/** ---- JSON-LD types ---- */
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
  availability: string; // schema URL
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

export async function generateMetadata(
  { params }: { params: RouteParams }
): Promise<Metadata> {
  const { id } = await params;
  const lang = await resolveLang();
  const product = await getProduct(id, lang);

  const rawTitle = product.metaTitle || product.name || "Mahsulot";
  // Always prioritize metaDescription (SEO optimized) over plain description
  const rawDesc = product.metaDescription || product.description || "Mahsulot tavsifi";
  const title = trim(rawTitle, 60);
  const description = trim(rawDesc, 160);

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
      // Next Metadata openGraph.type union doesn't include raw 'product'; keep website here
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

export default async function Page({ params }: { params: RouteParams }) {
  const { id } = await params;
  const lang = await resolveLang();
  const product = await getProduct(id, lang);

  const rawTitle = product.metaTitle || product.name || "Mahsulot";
  const rawDesc = product.metaDescription || product.description || "Mahsulot tavsifi";
  const title = trim(rawTitle, 60);
  const description = trim(rawDesc, 160);

  const localizedUrls = buildLocalizedUrls(`/product/${id}`);
  const url = localizedUrls[lang];
  // Prefer all images if available, ensure HTTPS for nutva.uz assets
  const images = (product.imageUrls || [])
    .map((u) => ensureHttps(u))
    .filter((u): u is string => Boolean(u));
  const image = images[0] || "https://nutva.uz/seo_banner.jpg";

  const priceAmount = Number(product.price ?? 0);
  // Reflect availability if provided by API, otherwise default to in stock
  const isInStock = typeof product.inStock === 'boolean' ? Boolean(product.inStock) : true;
  const availabilitySchema = isInStock ? "https://schema.org/InStock" : "https://schema.org/OutOfStock";

  // Optional future GTIN / SKU mapping (if backend adds gtin field) – placeholder logic
  const sku = product.id; // could be replaced with product.sku if provided later
  const priceValidUntil = new Date(Date.now() + 1000 * 60 * 60 * 24 * 30).toISOString().split("T")[0]; // 30 days

  // Map product-specific structured extras (gtin13, certifications, TU, serial, ingredients)
  function getStructuredExtras(name?: string): { gtin13?: string; additionalProperty?: { '@type': 'PropertyValue'; name: string; value: string; }[] } {
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
          { '@type': 'PropertyValue', name: 'Ingredients', value: 'Indov (Rukola) 136.7 mg; Qora sedana ~46 mg; Uora andiz 37.7 mg; Bo‘ymodaron 12.5 mg; Qovoq urug‘i 12.4 mg; Makkai sano (Senna) 12.2 mg; Dastarbosh (Pizhma) 11.7 mg' },
        ],
      };
    }
    return {};
  }
  const extras = getStructuredExtras(product.name);

  const productJsonLd: ProductLD = {
    "@context": "https://schema.org/",
    "@type": "Product",
    // Stable ID to link references of the same entity
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
      availability: availabilitySchema,
      itemCondition: "https://schema.org/NewCondition",
      seller: { "@type": "Organization", name: "Nutva" },
      priceValidUntil,
    },
    category: 'Dietary Supplements',
    additionalProperty: extras.additionalProperty,
    // Help search engines connect the Product with this page entity
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore: mainEntityOfPage not in our local type
    mainEntityOfPage: url,
  };

  if (typeof product.ratingValue === "number" && typeof product.ratingCount === "number" && product.ratingCount > 0) {
    productJsonLd.aggregateRating = {
      "@type": "AggregateRating",
      ratingValue: product.ratingValue,
      ratingCount: product.ratingCount,
    };
  }
  if (Array.isArray(product.reviews) && product.reviews.length > 0) {
    productJsonLd.review = product.reviews.slice(0, 20).map((r) => ({
      "@type": "Review",
      author: r.author ? { "@type": "Person", name: r.author } : undefined,
      datePublished: r.datePublished,
      reviewRating:
        typeof r.ratingValue === "number"
          ? { "@type": "Rating", ratingValue: r.ratingValue, bestRating: 5 }
          : undefined,
      reviewBody: r.reviewBody,
    }));
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
            item: b.url,
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
