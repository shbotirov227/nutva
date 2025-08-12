import type { Metadata } from "next";
import ProductsClient from "./ProductsClient";

export const metadata: Metadata = {
  title: "Mahsulotlar",
  description:
    "Nutva Pharm mahsulotlari: ilmiy asoslangan, sertifikatlangan biofaol qo'shimchalar. Tez yetkazib berish va rasmiy kafolat.",
  alternates: { canonical: "https://nutva.uz/product" },
  openGraph: {
    title: "Mahsulotlar",
    description:
      "Nutva Pharm katalogi: bo'g'imlar, immunitet, gormonal balans va boshqalar uchun qo'shimchalar.",
    url: "https://nutva.uz/product",
    images: [{ url: "https://nutva.uz/seo_banner.jpg", width: 1200, height: 630 }],
    type: "website",
    siteName: "Nutva Pharm",
  },
  twitter: {
    card: "summary_large_image",
    title: "Mahsulotlar",
    description: "Ilmiy asoslangan biofaol qo'shimchalar katalogi.",
    images: ["https://nutva.uz/seo_banner.jpg"],
  },
  robots: "index, follow",
};

export default function Page() {
  return <ProductsClient />;
}
