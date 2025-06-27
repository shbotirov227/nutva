"use client";

import { useEffect, useState } from "react";
import Blogs from "@/containers/Blogs";
import HeroSection from "@/containers/HeroSection";
import Products from "@/containers/Products";
import AboutBrandSection from "@/containers/AboutBrandSection";
import Reviews from "@/containers/Reviews";
import SaleSection from "@/containers/SaleSection";

// export const metadata = {
//     title: "Nutva Complex",
//     description: "Welcome to our shop where you can find amazing products.",
// };

export default function App() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return (
    <main className="">
      <HeroSection />
      <Products isAviableBackground />
      <Blogs />
      <AboutBrandSection />
      <Reviews />
      <SaleSection />
    </main>
  );
}
