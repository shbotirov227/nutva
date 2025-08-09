// app/sale/page.tsx
import type { Metadata } from "next";
import SalePageClient from "./SalePageClient";
const SITE = "https://nutva.uz";
const PATH = "/sale";
const OG_IMAGE = `${SITE}/seo_banner.jpg`;

const t = {
  uz: {
    title: "Chegirmalar va paketlar — Nutva Pharm",
    desc:
      "Nutva Pharm chegirmalari: Complex, Complex Extra va Gelmin Kids bo‘yicha paketli takliflar. Tez yetkazib berish. Rasmiy do‘kon.",
  },
  ru: {
    title: "Скидки и наборы — Nutva Pharm",
    desc:
      "Скидки Nutva Pharm: комплекты с Complex, Complex Extra и Gelmin Kids. Быстрая доставка. Официальный магазин.",
  },
  en: {
    title: "Deals & Bundles — Nutva Pharm",
    desc:
      "Nutva Pharm deals: bundles for Complex, Complex Extra, and Gelmin Kids. Fast delivery. Official store.",
  },
};


export async function generateMetadata(): Promise<Metadata> {
  // Next can’t read the URL here without a request object.
  // If you need perfect locale detection, wire this to your i18n routing.
  const locale: "uz" | "ru" | "en" = "uz";
  const { title, desc } = t[locale];

  return {
    title,
    description: desc,
    alternates: {
      canonical: `${SITE}${PATH}`,
      languages: {
        uz: `${SITE}/sale`,
        ru: `${SITE}/ru/sale`,
        en: `${SITE}/en/sale`,
        "x-default": `${SITE}/sale`,
      },
    },
    openGraph: {
      type: "website",
      url: `${SITE}${PATH}`,
      siteName: "Nutva Pharm",
      title,
      description: desc,
      images: [{ url: OG_IMAGE }],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description: desc,
      images: [OG_IMAGE],
    },
    robots: {
      index: true,
      follow: true,
    },
    other: {
      // Small hint to preload hero/banner if you want
      // (Next doesn’t have a direct metadata preload; use <link> in layout if needed)
    },
  };
}

export default function Page() {
  return <SalePageClient />;
}
