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
      title: "Nutva — Blog va Yangiliklar",
      description: "Sog'liqni saqlash, immunitetni mustahkamlash, vitaminlar va biologik faol qo'shimchalar haqida foydali maqolalar. Nutva mahsulotlari, mutaxassislar maslahatlari va ilmiy tadqiqotlar."
    },
    ru: {
      title: "Nutva — Блог и Новости", 
      description: "Полезные статьи о здоровье, укреплении иммунитета, витаминах и биологически активных добавках. Продукция Nutva, советы специалистов и научные исследования."
    },
    en: {
      title: "Nutva — Blog & News",
      description: "Useful articles about health, immune support, vitamins and dietary supplements. Nutva products, expert advice and scientific research."
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
    keywords: lang === "uz" 
      ? "blog, yangiliklar, maqola, nutva, sog'liq, immunitet, vitamin, biologik faol qo'shimcha, salomatlik, nutva complex, gelmin kids, tibbiy maslahatlar"
      : lang === "ru"
      ? "блог, новости, статьи, nutva, здоровье, иммунитет, витамины, БАД, здравоохранение, nutva complex, gelmin kids, медицинские советы"
      : "blog, news, articles, nutva, health, immunity, vitamins, dietary supplements, wellness, nutva complex, gelmin kids, medical advice",
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
      images: [{ url: "https://nutva.uz/seo_banner.jpg", width: 1200, height: 630, alt: "Nutva Blog" }],
      locale: ogLocale,
      alternateLocale: alternateLocales,
    },
    twitter: {
      card: "summary_large_image",
      title: content.title,
      description: content.description,
      images: ["https://nutva.uz/seo_banner.jpg"],
    },
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        'max-video-preview': -1,
        'max-image-preview': 'large',
        'max-snippet': -1,
      },
    },
  };
}

export default function BlogPage() {
  return <BlogClient />;
}
