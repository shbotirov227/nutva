"use client";

import Head from "next/head";

import Blogs from "@/containers/Blogs";
import HeroSection from "@/containers/HeroSection";
import Products from "@/containers/Products";
import AboutBrandSection from "@/containers/AboutBrandSection";
import Reviews from "@/containers/Reviews";
import SaleSection from "@/containers/SaleSection";

export default function App() {
  return (
    <>
      <Head>
        {/* ✅ Basic SEO */}
        <title>Nutva Pharm — Ilmiy asoslangan biofaol qo‘shimchalar</title>
        <meta
          name="description"
          content="Nutva Pharm — ilmiy asoslangan, sifatli va tabiiy biofaol qo‘shimchalar. Har bir mahsulot salomatligingizni tiklashga va mustahkamlashga qaratilgan aniq yechimdir."
        />
        <meta
          name="keywords"
          content="nutva, bioaktiv qo‘shimchalar, sog‘liq, nutva uz"
        />
        <meta name="author" content="Nutva Pharm" />
        <meta name="robots" content="index, follow" />
        <link rel="canonical" href="https://nutva.uz/" />

        {/* ✅ Open Graph */}
        <meta property="og:title" content="Nutva Pharm — Ilmiy asoslangan biofaol qo‘shimchalar" />
        <meta
          property="og:description"
          content="Har bir mahsulot salomatligingizni tiklashga va mustahkamlashga qaratilgan aniq yechimdir."
        />
        <meta property="og:url" content="https://nutva.uz" />
        <meta property="og:site_name" content="Nutva Pharm" />
        <meta property="og:image" content="https://nutva.uz/logo.png" />
        <meta property="og:image:width" content="1200" />
        <meta property="og:image:height" content="630" />
        <meta property="og:type" content="website" />

        {/* ✅ Twitter Card */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta
          name="twitter:title"
          content="Nutva Pharm — Ilmiy asoslangan biofaol qo‘shimchalar"
        />
        <meta
          name="twitter:description"
          content="Har bir mahsulot salomatligingizni tiklashga va mustahkamlashga qaratilgan aniq yechimdir."
        />
        <meta name="twitter:image" content="https://nutva.uz/logo.png" />

        {/* ✅ Favicon */}
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main>
        <HeroSection />
        <Products isAviableBackground />
        <Blogs />
        <AboutBrandSection />
        <Reviews />
        <SaleSection />
      </main>
    </>
  );
}
