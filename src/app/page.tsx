// "use client";

import Blogs from "@/containers/Blogs";
import HeroSection from "@/containers/HeroSection";
import Products from "@/containers/Products";
import AboutBrandSection from "@/components/AboutBrandSection";

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
        </main>
    );
}
