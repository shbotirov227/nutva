/* eslint-disable @next/next/no-img-element */

import type { Metadata, Viewport } from "next";
import { headers } from "next/headers";
import Script from "next/script";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./globals.css";
import { Inter } from "next/font/google";

import { QueryProvider } from "@/providers/queryProvider";
import { LangProvider } from "@/context/LangContext";
import { RawCartProvider } from "@/context/CartContext";
import { BuyProvider } from "@/context/BuyContext";
import { resolveLang, getOgLocale, getAlternateLocales, buildLocalizedUrls, getHomePageContent } from "@/lib/langUtils";

import Layout from "@/components/Layout";
import InjectPixelScript from "@/components/InjectPixelScript";
import TrackVisit from "@/components/TrackVisit";
import BuyModalContainerDynamic from "@/components/BuyModalContainerDynamic";
import FloatingButtons from "@/components/FloatingButtons";
import { WebVitals } from "@/components/WebVitals";
import { ServiceWorkerRegistration } from "@/components/ServiceWorkerRegistration";

const inter = Inter({ subsets: ["latin", "cyrillic"], display: "swap", variable: "--font-inter" });

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#ffffff",
};

export async function generateMetadata(): Promise<Metadata> {
  const lang = await resolveLang();
  const content = getHomePageContent(lang);
  const ogLocale = getOgLocale(lang);
  const alternateLocales = getAlternateLocales(lang);

  const h = await headers();
  const proto = h.get("x-forwarded-proto") || (process.env.VERCEL ? "https" : "http");
  const host = h.get("host") || "nutva.uz";
  const baseUrl = `${proto}://${host}`;

  const pathname = h.get("x-pathname") || `/${lang}`;
  const localizedUrls = buildLocalizedUrls(pathname, baseUrl);

  return {
    metadataBase: new URL(baseUrl),
    title: {
      default: content.title,
      template: "%s — Nutva Pharm",
    },
    description: content.description,

    other: {
      'preload-hero-bg': '/hero-bg2.webp',
      'preload-logo': '/header-nutva-logo.png',
    },
    keywords: [
      "Nutva", "Нутва",
      "Nutva Pharm", "Нутва Фарм",
      "nutva.uz", "nutva uz", "Нутва УЗ",
      "Nutva Complex", "Нутва Комплекс",
      "Nutva Extra", "Нутва Экстра",
      "Nutva Gelmin Kids", "Нутва Гельмин Кидс",
      "Nutva Fertilia Women", "Нутва Фертилия Вумен",
      "Nutva Viris Men", "Нутва Вирис Мен",
      "Nutva Complex Extra", "Нутва Комплекс Экстра",
      "biologik faol qo'shimchalar", "биологик фаол қўшимчалар",
      "bioaktiv qo'shimchalar", "биоактив қўшимчалар",
      "BAT", "БАТ", "BAA", "БАА",
      "o'simlik ekstraktlari", "ўсимлик экстрактлари",
      "vitaminlar", "витаминлар",
      "mineral qo'shimchalar", "минерал қўшимчалар",
      "bio aktivnye dobavki",
      "bio aktivnye dobavki tashkent",
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
      title: content.title,
      description: content.description,
      url: localizedUrls[lang],
      siteName: "Nutva Pharm",
      images: [{ url: "https://nutva.uz/seo_banner.jpg", width: 1200, height: 630, alt: "Nutva Pharm" }],
      type: "website",
      locale: ogLocale,
      alternateLocale: alternateLocales,
    },
    twitter: {
      card: "summary_large_image",
      title: content.title,
      description: content.description,
      images: ["https://nutva.uz/seo_banner.jpg"],
    },
    alternates: {
      canonical: localizedUrls[lang],
      languages: localizedUrls,
    },
    icons: {
      icon: "/favicon.ico?v=2",
      shortcut: "/favicon.ico?v=2",
      apple: "/logo.png",
    },
  };
}

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const lang = await resolveLang();

  return (
    <html lang={lang} suppressHydrationWarning className={inter.variable}>
      <head>
        {/* Critical resource preloading */}
        <link
          rel="preload"
          href="/header-nutva-logo.png"
          as="image"
          type="image/png"
          fetchPriority="high"
        />

        {/* Critical preconnect hints */}
        <link rel="preconnect" href="https://www.googletagmanager.com" />
        <link rel="preconnect" href="https://nutva.uz" />

        {/* DNS prefetch */}
        <link rel="dns-prefetch" href="//connect.facebook.net" />
        <link rel="dns-prefetch" href="//mc.yandex.ru" />
        <link rel="dns-prefetch" href="//i.ytimg.com" />
        <link rel="dns-prefetch" href="//googleads.g.doubleclick.net" />

        {/* PWA Manifest */}
        <link rel="manifest" href="/manifest.json" />
        <meta name="theme-color" content="#10b981" />
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="mobile-web-app-status-bar-style" content="default" />
        <meta name="mobile-web-app-title" content="Nutva Pharm" />

        {/* Google Tag Manager - GTM-WQMGD4GC (Yangi) */}
        <Script id="gtm-new" strategy="afterInteractive">
          {`(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
})(window,document,'script','dataLayer','GTM-WQMGD4GC');`}
        </Script>

        {/* Google Tag Manager - GTM-KLMGC5HH (Eski) */}
        <Script id="gtm-old" strategy="afterInteractive">
          {`(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
})(window,document,'script','dataLayer','GTM-KLMGC5HH');`}
        </Script>

        {/* GA4 */}
        <Script id="ga4-src" src="https://www.googletagmanager.com/gtag/js?id=G-E1CNZ3JV1T" strategy="lazyOnload" />
        <Script
          id="ga4-init"
          strategy="lazyOnload"
          dangerouslySetInnerHTML={{
            __html: `
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('js', new Date());
              gtag('config', 'G-E1CNZ3JV1T');
            `,
          }}
        />

        {/* Google tag (gtag.js) event - delayed navigation helper for click conversions */}
        <Script id="ga4-delayed-nav-helper" strategy="afterInteractive">
          {`
            // Helper function to delay opening a URL until a gtag event is sent.
            // Exposed globally as window.gtagSendEvent(url)
            (function(){
              function gtagSendEvent(url) {
                var navigate = function () {
                  if (typeof url === 'string') {
                    window.location = url;
                  }
                };
                try {
                  if (typeof gtag === 'function') {
                    // Event name kept as provided by instructions: 'tel:'
                    gtag('event', 'tel:', {
                      'event_callback': navigate,
                      'event_timeout': 2000
                    });
                    // Fallback in case callback isn't called (network issues)
                    setTimeout(navigate, 2100);
                    return false;
                  }
                } catch (e) {}
                // If gtag is missing, proceed immediately
                navigate();
                return false;
              }
              window.gtagSendEvent = gtagSendEvent;
            })();
          `}
        </Script>

        {/* Google Ads Conversion */}
        <Script id="google-ads-src" src="https://www.googletagmanager.com/gtag/js?id=AW-17445920499" strategy="lazyOnload" />
        <Script
          id="google-ads-init"
          strategy="lazyOnload"
          dangerouslySetInnerHTML={{
            __html: `
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('js', new Date());
              gtag('config', 'AW-17445920499');
            `,
          }}
        />

        {/* Facebook Pixel */}
        <Script id="fb-pixel" strategy="lazyOnload">
          {`!function(f,b,e,v,n,t,s)
{if(f.fbq)return;n=f.fbq=function(){n.callMethod?
n.callMethod.apply(n,arguments):n.queue.push(arguments)};
if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
n.queue=[];t=b.createElement(e);t.async=!0;
t.src=v;s=b.getElementsByTagName(e)[0];
s.parentNode.insertBefore(t,s)}(window, document,'script',
'https://connect.facebook.net/en_US/fbevents.js');
fbq('init', '766139842501655');
fbq('track', 'PageView');`}
        </Script>

        {/* Yandex Metrika */}
        <Script id="ym-src" src="https://mc.yandex.ru/metrika/tag.js" strategy="lazyOnload" />
        <Script
          id="ym-init"
          strategy="lazyOnload"
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
          strategy="lazyOnload"
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

        {/* WebSite JSON-LD */}
        <Script
          id="website-ldjson"
          type="application/ld+json"
          strategy="lazyOnload"
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
        {/* GTM noscript - GTM-WQMGD4GC (Yangi) */}
        <noscript>
          <iframe
            src="https://www.googletagmanager.com/ns.html?id=GTM-WQMGD4GC"
            height="0"
            width="0"
            style={{ display: "none", visibility: "hidden" }}
          />
        </noscript>

        {/* GTM noscript - GTM-KLMGC5HH (Eski) */}
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
                  <ServiceWorkerRegistration />
                  <WebVitals />
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