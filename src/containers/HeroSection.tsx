"use client";

import React from "react";
import Image from "next/image";
import ProductImage from "@/assets/images/product-green.png";
import Container from "@/components/Container";

const HeroSection = () => {
    return (
        <div className="relative min-h-screen flex items-center pt-[56px]">
            <div
                className="absolute inset-0 -z-10 bg-cover bg-center brightness-50"
                style={{
                    backgroundImage: "url('/hero-bg.webp')",
                }}
            ></div>

            <Container className="flex flex-col md:flex-row items-center justify-around gap-10 w-full">
                <div className="text-start text-white max-w-2xl">
                    <h1 className="text-4xl md:text-6xl font-bold mb-4">Nutva Complex</h1>
                    <p className="text-lg md:text-xl md:leading-relaxed mb-6">
                        Укрепляет защитные функции организма и помогает бороться с усталостью.
                    </p>
                </div>
                <Image
                    src={ProductImage}
                    alt="product-image"
                    width={450}
                    height={450}
                    className="inline-block mr-2"
                />
            </Container>
        </div>
    );
};

export default HeroSection;
