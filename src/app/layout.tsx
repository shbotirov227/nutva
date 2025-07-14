/* eslint-disable @next/next/next-script-for-ga */
/* eslint-disable @next/next/no-img-element */
import { Geist, Geist_Mono } from "next/font/google";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./globals.css";

import { QueryProvider } from "@/providers/queryProvider";
// import { AuthProvider } from "@/providers/sessionProvider";
import { LangProvider } from "@/context/LangContext";
import { RawCartProvider } from "@/context/CartContext";
import { BuyProvider } from "@/context/BuyContext";

import Layout from "@/components/Layout";
import InjectPixelScript from "@/components/InjectPixelScript";
import TrackVisit from "@/components/TrackVisit";

import BuyModalContainerDynamic from "@/components/BuyModalContainerDynamic";
import FloatingButtons from "@/components/FloatingButtons";

// Fonts
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
        {/* Google Tag Manager */}
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

        {/* Meta Pixel (Facebook) */}
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

        {/* Yandex Metrika */}
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(m,e,t,r,i,k,a){
              m[i]=m[i]||function(){(m[i].a=m[i].a||[]).push(arguments)};
              m[i].l=1*new Date();
              for (var j = 0; j < document.scripts.length; j++) {
                if (document.scripts[j].src === r) return;
              }
              k=e.createElement(t),a=e.getElementsByTagName(t)[0],
              k.async=1,k.src=r,a.parentNode.insertBefore(k,a)
            })(window, document, "script", "https://mc.yandex.ru/metrika/tag.js", "ym");
            
            ym(103208172, "init", {
              clickmap:true,
              trackLinks:true,
              accurateTrackBounce:true,
              webvisor:true
            });`,
          }}
        />
      </head>
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`} suppressHydrationWarning>
        {/* Google Tag Manager (noscript) */}
        <noscript>
          <iframe
            src="https://www.googletagmanager.com/ns.html?id=GTM-KLMGC5HH"
            height="0"
            width="0"
            style={{ display: "none", visibility: "hidden" }}
          />
        </noscript>

        {/* Facebook Pixel (noscript) */}
        <noscript>
          <img
            height="1"
            width="1"
            alt=""
            style={{ display: "none" }}
            src="https://www.facebook.com/tr?id=766139842501655&ev=PageView&noscript=1"
          />
        </noscript>

        {/* Yandex Metrika (noscript) */}
        <noscript>
          <div>
            <img
              src="https://mc.yandex.ru/watch/103208172"
              style={{ position: "absolute", left: "-9999px" }}
              alt=""
            />
          </div>
        </noscript>
        {/* <AuthProvider> */}
        <QueryProvider>
          <LangProvider>
            <RawCartProvider>
              <BuyProvider>
                <Layout>
                  {/* Server-side / Static components */}
                  <TrackVisit />
                  <InjectPixelScript />
                  {children}

                  <FloatingButtons />

                  {/* Client-only components */}
                  <BuyModalContainerDynamic />
                  <ToastContainer />

                </Layout>
              </BuyProvider>
            </RawCartProvider>
          </LangProvider>
        </QueryProvider>
        {/* </AuthProvider> */}
      </body>
    </html>
  );
}
