import { cookies, headers } from "next/headers";
import BlogClient from "./BlogClient";
import { Metadata } from "next";

export async function generateMetadata(): Promise<Metadata> {
  const c = await cookies();
  const h = await headers();
  const cookieLang = c.get("lang")?.value?.toLowerCase();
  const hdrLang = h.get("x-lang")?.toLowerCase();
  const lang = (['uz','ru','en'].includes(cookieLang || '') ? cookieLang : (['uz','ru','en'].includes(hdrLang || '') ? hdrLang : 'uz')) as 'uz'|'ru'|'en';

  const base = "https://nutva.uz";
  const title = lang === "ru" ? "Nutva — Новости" : lang === "en" ? "Nutva — News" : "Nutva — Yangiliklar";
  const description =
    lang === "ru"
      ? "Последние статьи и советы о здоровье"
      : lang === "en"
      ? "Latest articles and health tips"
      : "So'nggi maqolalar va sog'liq bo'yicha maslahatlar";
  const ogLocale = lang === "ru" ? "ru_RU" : lang === "en" ? "en_US" : "uz_UZ";

  return {
    title,
    description,
    keywords: "news, yangiliklar, maqola, nutva, sog'liq, wellness",
    alternates: {
      canonical: `${base}/${lang}/blog`,
      languages: {
        uz: `${base}/uz/blog`,
        ru: `${base}/ru/blog`,
        en: `${base}/en/blog`,
        "x-default": `${base}/uz/blog`,
      },
    },
    openGraph: {
      title,
      description,
      url: `${base}/${lang}/blog`,
      type: "website",
      siteName: "Nutva Pharm",
      images: [{ url: `${base}/seo_banner.jpg`, width: 1200, height: 630 }],
      locale: ogLocale,
      alternateLocale: ["uz_UZ", "ru_RU", "en_US"].filter((l) => l !== ogLocale),
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [`${base}/seo_banner.jpg`],
    },
    robots: "index, follow",
  };
}

export default function BlogPage() {
  return <BlogClient />;
}
