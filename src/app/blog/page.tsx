import BlogClient from "./BlogClient";
import { Metadata } from "next";
import { resolveLang, getOgLocale, getAlternateLocales, buildLocalizedUrls, type Lang } from "@/lib/langUtils";

interface BlogPageContent {
  title: string;
  description: string;
}

function getBlogPageContent(lang: Lang): BlogPageContent {
  const content = {
    uz: {
      title: "Nutva — Yangiliklar",
      description: "So'nggi maqolalar va sog'liq bo'yicha maslahatlar"
    },
    ru: {
      title: "Nutva — Новости", 
      description: "Последние статьи и советы о здоровье"
    },
    en: {
      title: "Nutva — News",
      description: "Latest articles and health tips"
    }
  };
  
  return content[lang];
}

export async function generateMetadata(): Promise<Metadata> {
  const lang = await resolveLang();
  const content = getBlogPageContent(lang);
  const ogLocale = getOgLocale(lang);
  const alternateLocales = getAlternateLocales(lang);
  const localizedUrls = buildLocalizedUrls("/blog");

  return {
    title: content.title,
    description: content.description,
    keywords: "news, yangiliklar, maqola, nutva, sog'liq, wellness",
    alternates: {
      canonical: localizedUrls[lang],
      languages: localizedUrls,
    },
    openGraph: {
      title: content.title,
      description: content.description,
      url: localizedUrls[lang],
      type: "website",
      siteName: "Nutva Pharm",
      images: [{ url: "https://nutva.uz/seo_banner.jpg", width: 1200, height: 630 }],
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

export default function BlogPage() {
  return <BlogClient />;
}
