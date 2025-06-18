"use client";

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
    return (
        <main className="">
            <HeroSection />
            <Products />
            <Blogs />
            <AboutBrandSection />
            <Reviews />
            <SaleSection />
        </main>
    );
}
