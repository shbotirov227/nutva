import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Nutva - Tabiiy G'amxo'rlik | Taplinks",
  description: "Nutva - Biologik faol qo'shimcha mahsulotlari. Oilangiz uchun tabiiy g'amxo'rlik. Barcha ijtimoiy tarmoq linklari va bog'lanish ma'lumotlari.",
  keywords: "Nutva, biologik qo'shimcha, tabiiy mahsulotlar, sog'liq, nutva.uz, taplinks",
  robots: "index, follow",
  openGraph: {
    title: "Nutva - Tabiiy G'amxo'rlik",
    description: "Biologik faol qo'shimcha mahsulotlari. Oilangiz uchun tabiiy g'amxo'rlik.",
    type: "website",
    images: ["/logo.png"],
  },
  twitter: {
    card: "summary_large_image",
    title: "Nutva - Tabiiy G'amxo'rlik",
    description: "Biologik faol qo'shimcha mahsulotlari. Oilangiz uchun tabiiy g'amxo'rlik.",
  }
};

export default function TaplinksLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}