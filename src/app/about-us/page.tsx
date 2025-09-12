// src/app/about-us/page.tsx (SERVER)
import type { Metadata } from "next";
import { resolveLang, getOgLocale, getAlternateLocales, buildLocalizedUrls, type Lang } from "@/lib/langUtils";
import AboutClient from "./AboutClient";

interface AboutPageContent {
  title: string;
  description: string;
  ogDescription: string;
}

function getAboutPageContent(lang: Lang): AboutPageContent {
  const content = {
    uz: {
      title: "Biz haqimizda — Nutva Pharm",
      description: "Nutva Pharm kompaniyasining maqsadi, qadriyatlari va faoliyati haqida batafsil. Ilmiy asoslangan biofaol qo'shimchalar.",
      ogDescription: "Nutva Pharm: maqsad, qadriyatlar va ilmiy yondashuv."
    },
    ru: {
      title: "О нас — Nutva Pharm",
      description: "Подробно о целях, ценностях и деятельности компании Nutva Pharm. Научно обоснованные биологически активные добавки.",
      ogDescription: "Nutva Pharm: цели, ценности и научный подход."
    },
    en: {
      title: "About Us — Nutva Pharm",
      description: "Learn about Nutva Pharm's mission, values and activities. Science-backed dietary supplements.",
      ogDescription: "Nutva Pharm: mission, values and scientific approach."
    }
  };
  
  return content[lang];
}

export async function generateMetadata(): Promise<Metadata> {
  const lang = await resolveLang();
  const content = getAboutPageContent(lang);
  const ogLocale = getOgLocale(lang);
  const alternateLocales = getAlternateLocales(lang);
  const localizedUrls = buildLocalizedUrls("/about-us");

  return {
    title: content.title,
    description: content.description,
    alternates: { 
      canonical: localizedUrls[lang],
      languages: localizedUrls
    },
    openGraph: {
      title: content.title,
      description: content.ogDescription,
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
      description: content.ogDescription,
      images: ["https://nutva.uz/seo_banner.jpg"],
    },
    robots: {
      index: true,
      follow: true,
    },
  };
}

export default function Page() {
  return <AboutClient />;
}
