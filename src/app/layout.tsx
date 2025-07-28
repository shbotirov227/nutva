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

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="uz" suppressHydrationWarning>
      <head>
        {/* ✅ SEO — Title & Meta Description */}
        <title>Nutva Pharm — Tabiiy Biofaol Qo‘shimchalar</title>
        <meta
          name="description"
          content="Nutva Pharm —  ilmiy asoslangan, sifatli va tabiiy biofaol qo‘shimchalar.
Har bir mahsulot salomatligingizni tiklashga va mustahkamlashga qaratilgan aniq yechimdir."
        />

        {/* Canonical */}
        <link rel="canonical" href="https://nutva.uz/" />

        {/* ✅ Social (Open Graph + Twitter) */}
        <meta property="og:title" content="Nutva Pharm —  ilmiy asoslangan, sifatli va tabiiy biofaol qo‘shimchalar." />
        <meta property="og:description" content="Har bir mahsulot salomatligingizni tiklashga va mustahkamlashga qaratilgan aniq yechimdir." />
        <meta property="og:url" content="https://nutva.uz/" />
        <meta property="og:type" content="website" />
        <meta property="og:image" content="https://nutva.uz/logo.png" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Nutva Pharm —  ilmiy asoslangan, sifatli va tabiiy biofaol qo‘shimchalar." />
        <meta name="twitter:description" content="Har bir mahsulot salomatligingizni tiklashga va mustahkamlashga qaratilgan aniq yechimdir." />
        <meta name="twitter:image" content="https://nutva.uz/logo.png" />

        {/* Meta Verification */}
        <meta name="yandex-verification" content="aef60ba7c050b521" />
        <meta name="google-site-verification" content="UvbmZYZaowizMbMapriLrVKCoiGywdpBr50iEVlajJ4" />

        {/* Canonical and robots-friendly meta */}
        <meta name="robots" content="index, follow" />

        {/* ✅ Google Tag Manager */}
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
              new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
              j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
              'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
              })(window,document,'script','dataLayer','GTM-KLMGC5HH');`,
          }}
        />

        {/* Google Analytics */}
        <script async src="https://www.googletagmanager.com/gtag/js?id=G-E1CNZ3JV1T"></script>
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

        {/* Yandex Metrika #2 — e-commerce */}
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

      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`} suppressHydrationWarning>
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

        {/* Yandex Metrika #1 noscript */}
        <noscript>
          <div>
            <img
              src="https://mc.yandex.ru/watch/103208172"
              style={{ position: "absolute", left: "-9999px" }}
              alt=""
            />
          </div>
        </noscript>

        {/* Yandex Metrika #2 noscript */}
        <noscript>
          <div>
            <img
              src="https://mc.yandex.ru/watch/103392899"
              style={{ position: "absolute", left: "-9999px" }}
              alt=""
            />
          </div>
        </noscript>

        {/* App Providers */}
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
