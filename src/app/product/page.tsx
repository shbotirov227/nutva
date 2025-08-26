import type { Metadata } from "next";
import { cookies, headers } from "next/headers";
import ProductsClient from "./ProductsClient";

export async function generateMetadata(): Promise<Metadata> {
  const c = await cookies();
  const h = await headers();
  const cookieLang = c.get("lang")?.value?.toLowerCase();
  const hdrLang = h.get("x-lang")?.toLowerCase();
  const lang = (["uz", "ru", "en"].includes(cookieLang || "")
    ? cookieLang
    : (["uz", "ru", "en"].includes(hdrLang || "") ? hdrLang : "uz")) as "uz" | "ru" | "en";

  const titles = { uz: "Mahsulotlar", ru: "Товары", en: "Products" } as const;
  const descs = {
    uz: "Nutva Pharm mahsulotlari: ilmiy asoslangan, sertifikatlangan biofaol qo'shimchalar. Tez yetkazib berish va rasmiy kafolat.",
    ru: "Товары Nutva Pharm: научно обоснованные БАДы с сертификатами. Быстрая доставка и гарантия.",
    en: "Nutva Pharm products: science-backed, certified supplements. Fast delivery and official guarantee.",
  } as const;
  const ogLocale = lang === "ru" ? "ru_RU" : lang === "en" ? "en_US" : "uz_UZ";
  const base = "https://nutva.uz";
  return {
    title: titles[lang],
    description: descs[lang],
    alternates: {
      canonical: `${base}/${lang}/product`,
      languages: {
        uz: `${base}/uz/product`,
        ru: `${base}/ru/product`,
        en: `${base}/en/product`,
        "x-default": `${base}/uz/product`,
      },
    },
    openGraph: {
      title: titles[lang],
      description: descs[lang],
      url: `${base}/${lang}/product`,
      images: [{ url: `${base}/seo_banner.jpg`, width: 1200, height: 630 }],
      type: "website",
      siteName: "Nutva Pharm",
      locale: ogLocale,
      alternateLocale: ["uz_UZ", "ru_RU", "en_US"].filter((l) => l !== ogLocale),
    },
    twitter: {
      card: "summary_large_image",
      title: titles[lang],
      description: descs[lang],
      images: [`${base}/seo_banner.jpg`],
    },
    robots: "index, follow",
  };
}

export default function Page() {
  return <ProductsClient />;
}
