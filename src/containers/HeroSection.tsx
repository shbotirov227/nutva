"use client";

import React from "react";
import Image from "next/image";
import ProductImage from "@/assets/images/product-green.png";
import Container from "@/components/Container";
import { useTranslation } from "react-i18next";
import { useQuery } from "@tanstack/react-query";
import { apiClient } from "@/lib/apiClient";
import { GetAllBannerType } from "@/types/banner/getAllBanner";
import { useLang } from "@/context/LangContext";

const HeroSection = () => {

  const { t } = useTranslation();
  const { lang } = useLang();

  const { data: banner = [] as GetAllBannerType } = useQuery({
    queryKey: ["banner", lang],
    queryFn: () => apiClient.getBanner(),
    refetchOnWindowFocus: false,
    staleTime: 1000 * 60 * 5,
  });

  const data = banner[0];
  const localized = data?.[lang as "uz" | "ru" | "en"];

  return (
    <div className="relative min-h-screen flex items-center pt-[56px]">
      <div
        className="absolute inset-0 -z-10 bg-cover bg-center brightness-50"
        style={{
          backgroundImage: `url(${data?.imageUrls ? data?.imageUrls[0] : ""})`,
        }}
      ></div>

      <Container className="flex flex-col md:flex-row items-center justify-around gap-6 sm:gap-10 w-full px-4 sm:px-6">
        <div className="text-start text-white max-w-2xl">
          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold mb-3 sm:mb-4">
            {localized?.title}
          </h1>
          <p className="text-base sm:text-lg md:text-xl md:leading-relaxed mb-4 md:mb-6">
            {localized?.description}
          </p>
        </div>
        <Image
          src={data?.imageUrls[1] || ProductImage}
          alt="product-image"
          width={450}
          height={450}
          className="w-[220px] sm:w-[300px] md:w-[400px] lg:w-[450px] h-auto inline-block mr-2"
        />
      </Container>
    </div>
  );
};

export default HeroSection;
