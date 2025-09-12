// app/sale/page.tsx
import type { Metadata } from "next";
import SalePageClient from "./SalePageClient";
import { resolveLang, getOgLocale, getAlternateLocales, buildLocalizedUrls, type Lang } from "@/lib/langUtils";

const OG_IMAGE = "https://nutva.uz/seo_banner.jpg";

interface SalePageContent {
  title: string;
  desc: string;
}

function getSalePageContent(lang: Lang): SalePageContent {
  const content = {
    uz: {
      title: "Chegirmalar va paketlar — Nutva Pharm",
      desc:
        "Nutva Pharm chegirmalari: Complex, Complex Extra va Gelmin Kids bo'yicha paketli takliflar. Tez yetkazib berish. Rasmiy do'kon.",
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
  
  return content[lang];
}

export async function generateMetadata(): Promise<Metadata> {
  const lang = await resolveLang();
  const content = getSalePageContent(lang);
  const ogLocale = getOgLocale(lang);
  const alternateLocales = getAlternateLocales(lang);
  const localizedUrls = buildLocalizedUrls("/sale");

  return {
    title: content.title,
    description: content.desc,
    alternates: {
      canonical: localizedUrls[lang],
      languages: localizedUrls,
    },
    openGraph: {
      type: "website",
      url: localizedUrls[lang],
      siteName: "Nutva Pharm",
      title: content.title,
      description: content.desc,
      images: [{ url: OG_IMAGE }],
      locale: ogLocale,
      alternateLocale: alternateLocales,
    },
    twitter: {
      card: "summary_large_image",
      title: content.title,
      description: content.desc,
      images: [OG_IMAGE],
    },
    robots: {
      index: true,
      follow: true,
    },
  };
}

export default function Page() {
  return <SalePageClient />;
}