/* eslint-disable @next/next/no-img-element */
/* src/app/layout.tsx */
import type { Metadata, Viewport } from "next";
import { cookies, headers } from "next/headers";
import Script from "next/script";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./globals.css";

import { QueryProvider } from "@/providers/queryProvider";
import { LangProvider } from "@/context/LangContext";
import { RawCartProvider } from "@/context/CartContext";
import { BuyProvider } from "@/context/BuyContext";

import Layout from "@/components/Layout";
import InjectPixelScript from "@/components/InjectPixelScript";
import TrackVisit from "@/components/TrackVisit";
import BuyModalContainerDynamic from "@/components/BuyModalContainerDynamic";
import FloatingButtons from "@/components/FloatingButtons";

// Fonts are provided via system fallbacks in globals.css to avoid external fetches

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#ffffff",
};

export async function generateMetadata(): Promise<Metadata> {
  const cookieStore = await cookies();
  const h = await headers();
  const headerLang = h.get("x-lang")?.toLowerCase();
  const cookieLang = cookieStore.get("lang")?.value?.toLowerCase();
  const candidate = headerLang || cookieLang || "uz";
  const lang = (["uz", "ru", "en"].includes(candidate) ? candidate : "uz") as "uz" | "ru" | "en";
  const ogLocale = lang === "ru" ? "ru_RU" : lang === "en" ? "en_US" : "uz_UZ";
  const titles = {
    uz: "Nutva Pharm — Ilmiy asoslangan biofaol qo'shimchalar",
    ru: "Nutva Pharm — Научно обоснованные биологически активные добавки",
    en: "Nutva Pharm — Science‑backed dietary supplements",
  } as const;
  const descriptions = {
    uz: "Nutva Pharm — ilmiy asoslangan, sifatli va tabiiy biofaol qo‘shimchalar. Har bir mahsulot salomatligingizni tiklashga va mustahkamlashga qaratilgan aniq yechimdir.",
    ru: "Nutva Pharm — научно обоснованные, сертифицированные и натуральные БАДы. Каждый продукт — точное решение для восстановления и укрепления здоровья.",
    en: "Nutva Pharm — science‑backed, certified and natural supplements. Each product is a precise solution to restore and strengthen your health.",
  } as const;
  return {
  metadataBase: new URL("https://nutva.uz"),
  title: {
    default: titles[lang],
    template: "%s — Nutva Pharm",
  },
  description: descriptions[lang],
  // Important: keywords are low-weight, but we include them as requested.
  keywords: [
    // Brand & products
    "Nutva", "Нутва",
    "Nutva Pharm", "Нутва Фарм",
    "nutva.uz", "nutva uz", "Нутва УЗ",
    "Nutva Complex", "Нутва Комплекс",
    "Nutva Extra", "Нутва Экстра",
    "Nutva Gelmin Kids", "Нутва Гельмин Кидс",
    "Nutva Fertilia Women", "Нутва Фертилия Вумен",
    "Nutva Viris Men", "Нутва Вирис Мен",
    "Nutva Complex Extra", "Нутва Комплекс Экстра",

    // Existing generic terms (uz/ru)
    "biologik faol qo‘shimchalar", "биологик фаол қўшимчалар",
    "bioaktiv qo‘shimchalar", "биоактив қўшимчалар",
    "BAT", "БАТ", "BAA", "БАА",
    "o'simlik ekstraktlari", "ўсимлик экстрактлари",
    "vitaminlar", "витаминлар",
    "mineral qo‘shimchalar", "минерал қўшимчалар",
    "ilmiy asoslangan qo‘shimchalar", "илмий асосланган қўшимчалар",
    "immunitetni kuchaytiruvchi vositalar", "иммунитетни кучайтирувчи воситалар",
    "gormonal balans uchun qo‘shimchalar", "гормонал мувозанат учун қўшимчалар",
    "hazmni yaxshilovchi vositalar", "ҳазмни яхшилайдиган воситалар",
    "sertifikatlangan qo‘shimchalar", "сертификатланган қўшимчалар",
    "ayollar salomatligi uchun qo‘shimchalar", "аёллар саломатлиги учун қўшимчалар",
    "homiladorlikni rejalashtirish", "ҳомиладорликни режалаштириш",
    "bolalar uchun BAT", "болалар учун БАТ",
    "oshqozon-ichak salomatligi", "ошқозон-ичак саломатлиги",
    "osteoporoz davolash", "остеопороз даволаш",
    "gonartroz davo", "гоноартроз даво",
    "koksartroz qo‘shimchalari", "коксартроз учун қўшимчалар",
    "umurtqa churrasi vosita", "умуртқа чурраси учун восита",
    "artroz va artrit qo‘shimchalari", "артроз ва артрит учун БАТ",
    "oyoqlarning shishishi uchun", "оёқ шишиши учун восита",
    "BAT Toshkent", "БАТ Тошкент",
    "BAT Samarqand", "БАТ Самарқанд",
    "BAT Buxoro", "БАТ Бухоро",
    "BAT Farg‘ona", "БАТ Фарғона",
    "BAT Andijon", "БАТ Андижон",
    "BAT Namangan", "БАТ Наманган",
    "biologik faol qo‘shimcha O‘zbekiston", "биологик фаол қўшимча Ўзбекистонда",
    "sifatli BAT O‘zbekistonda", "сифатli БАТ Ўзбекистонда",

    // ➕ Requested RU queries (verbatim)
    "био активные добавки",
    "био активные добавки ташкент",
    "бады в ташкенте",
    "купить бады ташкент",
    "бады для восстановления суставов",
    "бады цена",
    "бады в узбекистан",
    "заказать бады в ташкенте",
    "витамины бады",
    "витамины и бады для суставов",
    "бад узбекистон",
    "эффективные бады для суставов",
    "бад в ташкент",
    "витамины бады ташкент",
    "купить бады",
    "бады для костей",
    "заказать бады",
    "бады для лечения суставов",
    "бады витамины",
    "бады ташкент",
    "бады для суставов",
    "бады купить ташкент",
    "бады купить",
    "бады для роста костей",
  ],
  authors: [{ name: "Nutva Pharm", url: "https://nutva.uz" }],
  creator: "Nutva Pharm",
  publisher: "Nutva Pharm",
  // Fine-grained robots (Google respects these; Yandex follows standard robots)
  robots: {
    index: true,
    follow: true,
    nocache: false,
    noarchive: false,
    googleBot: {
      index: true,
      follow: true,
      "max-snippet": -1,
      "max-video-preview": -1,
      "max-image-preview": "large",
    },
  },
  referrer: "origin-when-cross-origin",
  formatDetection: {
    telephone: false,
    address: false,
    email: false,
  },
  
  verification: {
    google: "UvbmZYZaowizMbMapriLrVKCoiGywdpBr50iEVlajJ4",
    yandex: "aef60ba7c050b521",
  },
  openGraph: {
  title: titles[lang],
  description: descriptions[lang],
  url: `https://nutva.uz/${lang}`,
    siteName: "Nutva Pharm",
    images: [{ url: "https://nutva.uz/seo_banner.jpg", width: 1200, height: 630, alt: "Nutva Pharm" }],
    type: "website",
    locale: ogLocale,
    alternateLocale: ["uz_UZ", "ru_RU", "en_US"].filter((l) => l !== ogLocale),
  },
  twitter: {
    card: "summary_large_image",
  title: titles[lang],
  description: descriptions[lang],
    images: ["https://nutva.uz/seo_banner.jpg"],
  },
  alternates: {
    canonical: `https://nutva.uz/${lang}`,
    languages: {
      uz: "https://nutva.uz/uz",
      ru: "https://nutva.uz/ru",
      en: "https://nutva.uz/en",
      "x-default": "https://nutva.uz/uz",
    },
  },
  icons: {
    icon: "/favicon.ico",
    shortcut: "/favicon.ico",
    // add apple touch icon if you have it:
    // apple: "/apple-touch-icon.png",
  },
  };
}

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  // Resolve lang on server from cookie; fallback to uz
  const cookieStore = await cookies();
  const cookieLang = cookieStore.get("lang")?.value as string | undefined;
  const lang = ["uz", "ru", "en"].includes((cookieLang || "").toLowerCase())
    ? (cookieLang as "uz" | "ru" | "en")
    : "uz";
  return (
    <html lang={lang} suppressHydrationWarning>
      <head>
        {/* GA4 */}
        <Script id="ga4-src" src="https://www.googletagmanager.com/gtag/js?id=G-E1CNZ3JV1T" strategy="afterInteractive" />
        <Script
          id="ga4-init"
          strategy="afterInteractive"
          dangerouslySetInnerHTML={{
            __html: `
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('js', new Date());
              gtag('config', 'G-E1CNZ3JV1T');
            `,
          }}
        />

        {/* GTM */}
        <Script
          id="gtm-init"
          strategy="afterInteractive"
          dangerouslySetInnerHTML={{
            __html: `
              (function(w,d,s,l,i){
                w[l]=w[l]||[]; w[l].push({'gtm.start': new Date().getTime(), event:'gtm.js'});
                var f=d.getElementsByTagName(s)[0],
                    j=d.createElement(s), dl=l!='dataLayer'?'&l='+l:'';
                j.async=true; j.src='https://www.googletagmanager.com/gtm.js?id='+i+dl;
                f.parentNode.insertBefore(j,f);
              })(window,document,'script','dataLayer','GTM-KLMGC5HH');
            `,
          }}
        />

        {/* Facebook Pixel */}
        <Script
          id="fb-pixel"
          strategy="afterInteractive"
          dangerouslySetInnerHTML={{
            __html: `
              !function(f,b,e,v,n,t,s)
              {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
              n.callMethod.apply(n,arguments):n.queue.push(arguments)};
              if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
              n.queue=[];t=b.createElement(e);t.async=!0;t.src=v;
              s=b.getElementsByTagName(e)[0];s.parentNode.insertBefore(t,s)}
              (window, document,'script','https://connect.facebook.net/en_US/fbevents.js');
              fbq('init', '766139842501655'); 
              fbq('track', 'PageView');
            `,
          }}
        />

        {/* Yandex Metrika – single loader, two counters */}
        <Script id="ym-src" src="https://mc.yandex.ru/metrika/tag.js" strategy="afterInteractive" />
        <Script
          id="ym-init"
          strategy="afterInteractive"
          dangerouslySetInnerHTML={{
            __html: `
              window.ym = window.ym || function(){(ym.a=ym.a||[]).push(arguments)};
              ym.l = 1*new Date();
              ym(103208172, "init", { clickmap:true, trackLinks:true, accurateTrackBounce:true, webvisor:true });
              ym(103392899, "init", { clickmap:true, trackLinks:true, accurateTrackBounce:true, webvisor:true, ecommerce:"dataLayer" });
            `,
          }}
        />

        {/* Organization JSON-LD */}
        <Script
          id="org-ldjson"
          type="application/ld+json"
          strategy="afterInteractive"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "Organization",
              "@id": "https://nutva.uz/#organization",
              name: "Nutva Pharm",
              url: "https://nutva.uz",
              logo: "https://nutva.uz/logo.png",
              sameAs: [
                "https://www.instagram.com/nutva_extra/",
                "https://www.instagram.com/gelmin_kids/",
                "https://www.instagram.com/viris.men/",
                "https://www.instagram.com/nutva_fertilia/",
                "https://www.instagram.com/nutva.uz/",
                "https://t.me/nutvacomplex_extra",
                "https://t.me/nutva_gelminkids",
                "https://t.me/nutva_virismen",
                "https://t.me/nutva_fertiliawomen",
                "https://t.me/Nutva_Complex",
                "https://t.me/nutvauz",
                "https://www.facebook.com/profile.php?id=61576285561357",
                "https://www.facebook.com/profile.php?id=61576231412052",
                "https://www.facebook.com/profile.php?id=61576134155901",
                "https://www.facebook.com/profile.php?id=61576354677800",
                "https://www.facebook.com/NUTVAC0MPLEX",
                "https://www.youtube.com/@NutvaUz?sub_confirmation=1",
              ],
              areaServed: "UZ",
            }),
          }}
        />

        {/* WebSite JSON-LD (Sitelinks Search) — ensure /search exists with ?q= */}
        <Script
          id="website-ldjson"
          type="application/ld+json"
          strategy="afterInteractive"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "WebSite",
              "@id": "https://nutva.uz/#website",
              url: "https://nutva.uz",
              name: "Nutva Pharm",
              inLanguage: ["uz-UZ", "ru-RU"],
              potentialAction: {
                "@type": "SearchAction",
                target: "https://nutva.uz/search?q={search_term_string}",
                "query-input": "required name=search_term_string",
              },
            }),
          }}
        />
      </head>

  <body className="antialiased" suppressHydrationWarning>
        {/* GTM noscript */}
        <noscript>
          <iframe
            src="https://www.googletagmanager.com/ns.html?id=GTM-KLMGC5HH"
            height="0"
            width="0"
            style={{ display: "none", visibility: "hidden" }}
          />
        </noscript>

        {/* Facebook Pixel noscript */}
        <noscript>
          <img height="1" width="1" alt="" style={{ display: "none" }} src="https://www.facebook.com/tr?id=766139842501655&ev=PageView&noscript=1" />
        </noscript>

        {/* Yandex Metrika noscript */}
        <noscript>
          <div>
            <img src="https://mc.yandex.ru/watch/103208172" style={{ position: "absolute", left: "-9999px" }} alt="" />
            <img src="https://mc.yandex.ru/watch/103392899" style={{ position: "absolute", left: "-9999px" }} alt="" />
          </div>
        </noscript>

        <QueryProvider>
          <LangProvider>
            <RawCartProvider>
              <BuyProvider>
                <Layout>
                  <TrackVisit />
                  <InjectPixelScript />
                  {children}
                  <FloatingButtons />
                  <BuyModalContainerDynamic />
                  <ToastContainer />
                </Layout>
              </BuyProvider>
            </RawCartProvider>
          </LangProvider>
        </QueryProvider>
      </body>
    </html>
  );
}
