// app/sale/page.tsx
import type { Metadata } from "next";
import { cookies, headers } from "next/headers";
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
  const c = await cookies();
  const h = await headers();
  const cookieLang = c.get("lang")?.value?.toLowerCase();
  const hdrLang = h.get("x-lang")?.toLowerCase();
  const locale = (["uz", "ru", "en"].includes(cookieLang || "")
    ? cookieLang
    : (["uz", "ru", "en"].includes(hdrLang || "") ? hdrLang : "uz")) as "uz" | "ru" | "en";
  const { title, desc } = t[locale];

  return {
    title,
    description: desc,
    alternates: {
      canonical: `${SITE}/${locale}${PATH}`,
      languages: {
        uz: `${SITE}/uz/sale`,
        ru: `${SITE}/ru/sale`,
        en: `${SITE}/en/sale`,
        "x-default": `${SITE}/uz/sale`,
      },
    },
    openGraph: {
      type: "website",
      url: `${SITE}/${locale}${PATH}`,
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
