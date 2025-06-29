import { Geist, Geist_Mono } from "next/font/google";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./globals.css";

// Providers
import { QueryProvider } from "@/providers/queryProvider";
import { AuthProvider } from "@/providers/sessionProvider";
import { LangProvider } from "@/context/LangContext";
import { CartProvider } from "@/context/CartContext";
import { BuyProvider } from "@/context/BuyContext";

// Components (UI)
import Layout from "@/components/Layout";
import InjectPixelScript from "@/components/InjectPixelScript";
import TrackVisit from "@/components/TrackVisit";

// Modal container (must be client-only)
import BuyModalContainerDynamic from "@/components/BuyModalContainerDynamic";

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
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
        suppressHydrationWarning
      >
        <AuthProvider>
          <QueryProvider>
            <LangProvider>
              <CartProvider>
                <BuyProvider>
                  <Layout>
                    {/* Server-side / Static components */}
                    <InjectPixelScript />
                    <TrackVisit />

                    {children}

                    {/* Client-only components */}
                    <BuyModalContainerDynamic />
                    <ToastContainer />

                  </Layout>
                </BuyProvider>
              </CartProvider>
            </LangProvider>
          </QueryProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
