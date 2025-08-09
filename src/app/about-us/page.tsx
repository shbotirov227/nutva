// src/app/about-us/page.tsx (SERVER)
import type { Metadata } from "next";
import AboutClient from "./AboutClient";

export const metadata: Metadata = {
  title: "Biz haqimizda — Nutva Pharm",
  description: "Nutva Pharm kompaniyasining maqsadi, qadriyatlari va faoliyati haqida batafsil. Ilmiy asoslangan biofaol qo‘shimchalar.",
  alternates: { canonical: "https://nutva.uz/about-us" },
  openGraph: {
    title: "Biz haqimizda — Nutva Pharm",
    description: "Nutva Pharm: maqsad, qadriyatlar va ilmiy yondashuv.",
    url: "https://nutva.uz/about-us",
    images: [{ url: "https://nutva.uz/seo_banner.jpg", width: 1200, height: 630 }],
    type: "website",
    siteName: "Nutva Pharm",
  },
  twitter: {
    card: "summary_large_image",
    title: "Biz haqimizda — Nutva Pharm",
    description: "Bizning ilmiy yondashuv va sifat standartlarimiz haqida bilib oling.",
    images: ["https://nutva.uz/seo_banner.jpg"],
  },
  robots: "index, follow",
};

export default function Page() {
  return <AboutClient />;
}
