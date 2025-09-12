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
  price: string;
  availability: string; // schema URL
  itemCondition: "https://schema.org/NewCondition" | string;
  seller: { "@type": "Organization"; name: string };
  priceValidUntil?: string;
}
interface ProductLD {
  "@context": "https://schema.org/";
  "@type": "Product";
  name: string;
  description: string;
  image: string[];
  sku: string;
  brand: { "@type": "Brand"; name: string };
  offers: OfferLD;
  aggregateRating?: AggregateRatingLD;
  review?: ReviewLD[];
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
  const rawImage = product.imageUrls?.[0] || "https://nutva.uz/seo_banner.jpg";
  const image = ensureHttps(rawImage) || "https://nutva.uz/seo_banner.jpg";

  const priceAmount = Number(product.price ?? 0);
  const priceString = String(priceAmount);
  const isInStock = typeof product.inStock === "boolean" ? product.inStock : true;
  const availabilitySchema = isInStock ? "https://schema.org/InStock" : "https://schema.org/OutOfStock";

  const productJsonLd: ProductLD = {
    "@context": "https://schema.org/",
    "@type": "Product",
    name: title,
    description,
    image: [image],
    sku: product.id,
    brand: { "@type": "Brand", name: "Nutva" },
    offers: {
      "@type": "Offer",
      url,
      priceCurrency: "UZS",
      price: priceString,
      availability: availabilitySchema,
      itemCondition: "https://schema.org/NewCondition",
      seller: { "@type": "Organization", name: "Nutva" },
    },
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
