/* eslint-disable react/no-unescaped-entities */
/* eslint-disable @next/next/next-script-for-ga */
/* eslint-disable @next/next/no-img-element */
import { Geist, Geist_Mono } from "next/font/google";
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

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  metadataBase: new URL("https://nutva.uz"),
  title: "Nutva Pharm — Ilmiy asoslangan biofaol qo'shimchalar",
  description:
    "Nutva Pharm — ilmiy asoslangan, sifatli va tabiiy biofaol qo'shimchalar. Har bir mahsulot salomatligingizni tiklashga va mustahkamlashga qaratilgan aniq yechimdir.",
  keywords: [
    // 🔷 Brend nomlari
    "Nutva", "Нутва",
    "Nutva Pharm", "Нутва Фарм",
    "nutva.uz", "nutva uz", "Нутва УЗ",

    // 🔷 Mahsulot nomlari
    "Nutva Complex", "Нутва Комплекс",
    "Nutva Extra", "Нутва Экстра",
    "Nutva Gelmin Kids", "Нутва Гельмин Кидс",
    "Nutva Fertilia Women", "Нутва Фертилия Вумен",
    "Nutva Viris Men", "Нутва Вирис Мен",
    "Nutva Complex Extra", "Нутва Комплекс Экстра",

    // 🔷 Qo'shimcha turlari
    "biologik faol qo'shimchalar", "биологик фаол қўшимчалар",
    "bioaktiv qo'shimchalar", "биоактив қўшимчалар",
    "BAT", "БАТ",
    "BAA", "БАА",
    "o'simlik ekstraktlari", "ўсимлик экстрактлари",
    "vitaminlar", "витаминлар",
    "mineral qo'shimchalar", "минерал қўшимчалар",

    // 🔷 Foyda va maqsadlar
    "ilmiy asoslangan qo'shimchalar", "илмий асосланган қўшимчалар",
    "immunitetni kuchaytiruvchi vositalar", "иммунитетни кучайтирувчи воситалар",
    "gormonal balans uchun qo'shimchalar", "гормонал мувозанат учун қўшимчалар",
    "hazmni yaxshilovchi vositalar", "ҳазмни яхшилайдиган воситалар",
    "sertifikatlangan qo'shimchalar", "сертификатланган қўшимчалар",

    // 🔷 Sog'liq muammolari uchun
    "ayollar salomatligi uchun qo'shimchalar", "аёллар саломатлиги учун қўшимчалар",
    "homiladorlikni rejalashtirish", "ҳомиладорликни режалаштириш",
    "bolalar uchun BAT", "болалар учун БАТ",
    "oshqozon-ichak salomatligi", "ошқозон-ичак саломатлиги",

    // 🔷 Suyak, bo'g'im va boshqa kasalliklar
    "osteoporoz davolash", "остеопороз даволаш",
    "gonartroz davo", "гоноартроз даво",
    "koksartroz uchun qo'shimchalar", "коксартроз учун қўшимчалар",
    "umurtqa churrasi uchun vosita", "умуртқа чурраси учун восита",
    "artroz va artrit qo'shimchalari", "артроз ва артрит учун БАТ",
    "oyoqlarning shishishi uchun", "оёқ шишиши учун восита",

    // 🔷 Lokalizatsiya (geotargeting)
    "BAT Toshkent", "БАТ Тошкент",
    "BAT Samarqand", "БАТ Самарқанд",
    "BAT Buxoro", "БАТ Бухоро",
    "BAT Farg'ona", "БАТ Фарғона",
    "BAT Andijon", "БАТ Андижон",
    "BAT Namangan", "БАТ Наманган",
    "biologik faol qo'shimcha O'zbekiston", "биологик фаол қўшимча Ўзбекистонда",
    "sifatli BAT O'zbekistonda", "сифатли БАТ Ўзбекистонда"
  ],
  authors: [{ name: "Nutva Pharm" }],
  robots: "index, follow",
  alternates: {
    canonical: "https://nutva.uz/",
  },
  verification: {
    google: "UvbmZYZaowizMbMapriLrVKCoiGywdpBr50iEVlajJ4",
    yandex: "aef60ba7c050b521",
  },
  openGraph: {
    title: "Nutva Pharm — Ilmiy asoslangan biofaol qo'shimchalar",
    description:
      "Har bir mahsulot salomatligingizni tiklashga va mustahkamlashga qaratilgan aniq yechimdir.",
    url: "https://nutva.uz",
    siteName: "Nutva Pharm",
    images: [
      {
        url: "https://nutva.uz/seo_banner.jpg",
        width: 1200,
        height: 630,
      },
    ],
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Nutva Pharm — Ilmiy asoslangan biofaol qo'shimchalar",
    description:
      "Har bir mahsulot salomatligingizni tiklashga va mustahkamlashga qaratilgan aniq yechimdir.",
    images: ["https://nutva.uz/seo_banner.jpg"],
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="uz" suppressHydrationWarning>
      <head>
        <title>Nutva Pharm — Ilmiy asoslangan biofaol qo'shimchalar</title>
        <meta name="description" content="Nutva Pharm — ilmiy asoslangan, sifatli va tabiiy biofaol qo'shimchalar. Har bir mahsulot salomatligingizni tiklashga va mustahkamlashga qaratilgan aniq yechimdir." />
        <meta name="keywords" content="nutva, bioaktiv qo'shimchalar, sog'liq, nutva uz, vitaminlar, tabiiy dori, o'simlik ekstraktlari" />
        <meta name="author" content="Nutva Pharm" />
        <meta name="robots" content="index, follow" />
        <link rel="canonical" href="https://nutva.uz/" />

        {/* Open Graph */}
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://nutva.uz/" />
        <meta property="og:title" content="Nutva Pharm — Ilmiy asoslangan biofaol qo'shimchalar" />
        <meta property="og:description" content="Har bir mahsulot salomatligingizni tiklashga va mustahkamlashga qaratilgan aniq yechimdir." />
        <meta property="og:image" content="https://nutva.uz/seo_banner.jpg" />

        {/* Twitter */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:url" content="https://nutva.uz/" />
        <meta name="twitter:title" content="Nutva Pharm — Ilmiy asoslangan biofaol qo'shimchalar" />
        <meta name="twitter:description" content="Har bir mahsulot salomatligingizni tiklashga va mustahkamlashga qaratilgan aniq yechimdir." />
        <meta name="twitter:image" content="https://nutva.uz/seo_banner.jpg" />

        {/* Google Analytics */}
        <script
          async
          src="https://www.googletagmanager.com/gtag/js?id=G-E1CNZ3JV1T"
        ></script>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('js', new Date());
              gtag('config', 'G-E1CNZ3JV1T');
            `,
          }}
        />

        {/* Google Tag Manager */}
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
              new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
              j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
              'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
              })(window,document,'script','dataLayer','GTM-KLMGC5HH');
            `,
          }}
        />

        {/* Facebook Pixel */}
        <script
          dangerouslySetInnerHTML={{
            __html: `!function(f,b,e,v,n,t,s)
            {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
            n.callMethod.apply(n,arguments):n.queue.push(arguments)};
            if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
            n.queue=[];t=b.createElement(e);t.async=!0;
            t.src=v;s=b.getElementsByTagName(e)[0];
            s.parentNode.insertBefore(t,s)}(window, document,'script',
            'https://connect.facebook.net/en_US/fbevents.js');
            fbq('init', '766139842501655'); 
            fbq('track', 'PageView');`,
          }}
        />

        {/* Yandex Metrika #1 */}
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function(m,e,t,r,i,k,a){
                m[i]=m[i]||function(){(m[i].a=m[i].a||[]).push(arguments)};
                m[i].l=1*new Date();
                for (var j = 0; j < document.scripts.length; j++) {
                  if (document.scripts[j].src === r && m[i].a && m[i].a.length > 0) return;
                }
                k=e.createElement(t),a=e.getElementsByTagName(t)[0],
                k.async=1,k.src=r,a.parentNode.insertBefore(k,a)
              })(window, document, "script", "https://mc.yandex.ru/metrika/tag.js", "ym");

              ym(103208172, "init", {
                clickmap:true,
                trackLinks:true,
                accurateTrackBounce:true,
                webvisor:true
              });
            `,
          }}
        />

        {/* Yandex Metrika #2 */}
        <script
          dangerouslySetInnerHTML={{
            __html: `
              window.dataLayer = window.dataLayer || [];

              (function(m,e,t,r,i,k,a){
                m[i]=m[i]||function(){(m[i].a=m[i].a||[]).push(arguments)};
                m[i].l=1*new Date();
                for (var j = 0; j < document.scripts.length; j++) {
                  if (document.scripts[j].src === r && m[i].a && m[i].a.length > 1) return;
                }
                k=e.createElement(t),a=e.getElementsByTagName(t)[0],
                k.async=1,k.src=r,a.parentNode.insertBefore(k,a)
              })(window, document, "script", "https://mc.yandex.ru/metrika/tag.js", "ym");

              ym(103392899, "init", {
                clickmap:true,
                trackLinks:true,
                accurateTrackBounce:true,
                webvisor:true,
                ecommerce:"dataLayer"
              });
            `,
          }}
        />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
        suppressHydrationWarning
      >
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
          <img
            height="1"
            width="1"
            alt=""
            style={{ display: "none" }}
            src="https://www.facebook.com/tr?id=766139842501655&ev=PageView&noscript=1"
          />
        </noscript>

        {/* Yandex Metrika noscript */}
        <noscript>
          <div>
            <img
              src="https://mc.yandex.ru/watch/103208172"
              style={{ position: "absolute", left: "-9999px" }}
              alt=""
            />
          </div>
        </noscript>
        <noscript>
          <div>
            <img
              src="https://mc.yandex.ru/watch/103392899"
              style={{ position: "absolute", left: "-9999px" }}
              alt=""
            />
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
