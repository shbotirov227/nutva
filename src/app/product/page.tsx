import type { Metadata } from "next";
import ProductsClient from "./ProductsClient";
import { resolveLang, getOgLocale, getAlternateLocales, buildLocalizedUrls, type Lang } from "@/lib/langUtils";
import type { GetAllProductsType } from "@/types/products/getAllProducts";

interface ProductPageContent {
  title: string;
  description: string;
}

function getProductPageContent(lang: Lang): ProductPageContent {
  const content = {
    uz: {
      title: "Mahsulotlar",
      description: "Nutva Pharm mahsulotlari: ilmiy asoslangan, sertifikatlangan biofaol qo'shimchalar. Tez yetkazib berish va rasmiy kafolat."
    },
    ru: {
      title: "Товары",
      description: "Товары Nutva Pharm: научно обоснованные БАДы с сертификатами. Быстрая доставка и гарантия."
    },
    en: {
      title: "Products",
      description: "Nutva Pharm products: science-backed, certified supplements. Fast delivery and official guarantee."
    }
  };
  
  return content[lang];
}

export async function generateMetadata(): Promise<Metadata> {
  const lang = await resolveLang();
  const content = getProductPageContent(lang);
  const ogLocale = getOgLocale(lang);
  const alternateLocales = getAlternateLocales(lang);
  const localizedUrls = buildLocalizedUrls("/product");

  return {
    title: content.title,
    description: content.description,
    alternates: {
      canonical: localizedUrls[lang],
      languages: localizedUrls,
    },
    openGraph: {
      title: content.title,
      description: content.description,
      url: localizedUrls[lang],
      images: [{ url: "https://nutva.uz/seo_banner.jpg", width: 1200, height: 630 }],
      type: "website",
      siteName: "Nutva Pharm",
      locale: ogLocale,
      alternateLocale: alternateLocales,
    },
    twitter: {
      card: "summary_large_image",
      title: content.title,
      description: content.description,
      images: ["https://nutva.uz/seo_banner.jpg"],
    },
    robots: "index, follow",
  };
}

export default async function Page() {
  const lang = await resolveLang();
  // Fetch a small subset for ItemList; avoid heavy data
  let products: { id: string; name: string; imageUrls?: string[] }[] = [];
  try {
    const base = "https://nutva.uz/api";
    const res = await fetch(`${base}/Product?lang=${lang}`, { next: { revalidate: 60 } });
    const list: GetAllProductsType = res.ok ? await res.json() : [] as unknown as GetAllProductsType;
    products = (Array.isArray(list) ? list : []).slice(0, 24).map((p, i) => ({
      id: p.id,
      name: p.name,
      imageUrls: p.imageUrls,
      position: i + 1,
    }));
  } catch {}

  const base = "https://nutva.uz";
  const itemListElements = products.map((p, idx) => ({
    "@type": "ListItem",
    position: idx + 1,
    url: `${base}/${lang}/product/${p.id}`,
    name: p.name,
    image: Array.isArray(p.imageUrls) && p.imageUrls[0] ? p.imageUrls[0] : undefined,
  }));

  const itemListLd = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    itemListElement: itemListElements,
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(itemListLd) }} />
      <ProductsClient />
    </>
  );
}
