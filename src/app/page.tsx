"use client";
import Blogs from "@/containers/Blogs";
import HeroSection from "@/containers/HeroSection";
import Products from "@/containers/Products";
import AboutBrandSection from "@/containers/AboutBrandSection";
import Reviews from "@/containers/Reviews";
import SaleSection from "@/containers/SaleSection";
import { useEffect, useState } from "react";
import { DiscountPopup } from "@/components/DiscountPopup";

// SEO uchun to‘g‘ri metadata export qilinmoqda
// export const metadata = {
//   title: "Nutva Pharm — Ilmiy asoslangan biofaol qo‘shimchalar",
//   description:
//     "Nutva Pharm — ilmiy asoslangan, sifatli va tabiiy biofaol qo‘shimchalar. Har bir mahsulot salomatligingizni tiklashga va mustahkamlashga qaratilgan aniq yechimdir.",
//   keywords: ["nutva", "bioaktiv qo‘shimchalar", "sog‘liq", "nutva uz"],
//   authors: [{ name: "Nutva Pharm" }],
//   robots: "index, follow",
//   alternates: {
//     canonical: "https://nutva.uz/",
//   },
//   openGraph: {
//     title: "Nutva Pharm — Ilmiy asoslangan biofaol qo‘shimchalar",
//     description:
//       "Har bir mahsulot salomatligingizni tiklashga va mustahkamlashga qaratilgan aniq yechimdir.",
//     url: "https://nutva.uz",
//     siteName: "Nutva Pharm",
//     images: [
//       {
//         url: "https://nutva.uz/seo_banner.jpg",
//         width: 1200,
//         height: 630,
//       },
//     ],
//     type: "website",
//   },
//   twitter: {
//     card: "summary_large_image",
//     title: "Nutva Pharm — Ilmiy asoslangan biofaol qo‘shimchalar",
//     description:
//       "Har bir mahsulot salomatligingizni tiklashga va mustahkamlashga qaratilgan aniq yechimdir.",
//     images: ["https://nutva.uz/seo_banner.jpg"],
//   },
// };

export default function HomePage() {
  const [showDiscount, setShowDiscount] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setShowDiscount(true), 5000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <>
      <main>
        <HeroSection />
        <Products isAviableBackground />
        <Blogs />
        <AboutBrandSection />
        <Reviews />
        <SaleSection />
      </main>
      <DiscountPopup isVisible={showDiscount} onClose={() => setShowDiscount(false)} />
    </>
  );
}
