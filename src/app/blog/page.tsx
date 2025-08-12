import { cookies } from "next/headers";
import BlogClient from "./BlogClient";
import { Metadata } from "next";

export async function generateMetadata(): Promise<Metadata> {
  const cookieStore = await cookies();
  const lang = cookieStore.get("lang")?.value || "uz";

  return {
    title: lang === "ru" ? "Nutva - Новости" : lang === "en" ? "Nutva - News" : "Nutva - Yangiliklar",
    description:
      lang === "ru"
        ? "Последние статьи и советы о здоровье"
        : lang === "en"
          ? "Latest articles and health tips"
          : "So'nggi maqolalar va sog'liq bo'yicha maslahatlar",
    keywords: "news, yangiliklar, maqola, nutva, sog'liq, wellness",
  };
}

export default function BlogPage() {
  return <BlogClient />;
}
