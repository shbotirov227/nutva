"use client";

import React from "react";
import Image from "next/image";
import Container from "@/components/Container";
import { useQuery } from "@tanstack/react-query";
import { apiClient } from "@/lib/apiClient";
import { GetAllBannerType } from "@/types/banner/getAllBanner";
import { useLang } from "@/context/LangContext";

import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Pagination } from "swiper/modules";
import "swiper/css";
import "swiper/css/pagination";
import { GetOneBannerType } from "@/types/banner/getOneBanner";

const HeroSection = () => {
  const { lang } = useLang();

  const { data: banner = [] as GetAllBannerType } = useQuery({
    queryKey: ["banner", lang],
    queryFn: () => apiClient.getBanner(lang),
    refetchOnWindowFocus: false,
    staleTime: 1000 * 60 * 5,
  });

  return (
    <div className="relative min-h-screen pt-[56px]">
      <div
        className="absolute inset-0 -z-10 bg-cover bg-center brightness-50"
        style={{
          backgroundImage: `url(/hero-bg.webp)`,
        }}
      ></div>

      <Swiper
        modules={[Autoplay, Pagination]}
        autoplay={{ delay: 4000, disableOnInteraction: false }}
        pagination={{ clickable: true }}
        loop
        className="w-full h-full"
      >
        {banner.map((item: GetOneBannerType, idx: number) => {
          const localized = item[lang as "uz" | "ru" | "en"];

          return (
            <SwiperSlide key={idx}>
              <Container className="flex flex-col md:flex-row items-center justify-around gap-6 sm:gap-10 w-full px-4 sm:px-6 min-h-screen">
                <div className="text-start text-white max-w-2xl">
                  <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold mb-3 sm:mb-4">
                    {localized?.title}
                  </h1>
                  <p className="text-base sm:text-lg md:text-xl md:leading-relaxed mb-4 md:mb-6">
                    {localized?.subtitle}
                  </p>
                </div>

                <div className="flex flex-wrap justify-center gap-4">
                  {localized?.imageUrls?.map((image: string, i: number) => (
                    <Image
                      key={i}
                      src={image}
                      alt={`banner-image-${i}`}
                      width={450}
                      height={450}
                      className="w-[220px] sm:w-[300px] md:w-[400px] lg:w-[450px] h-auto"
                    />
                  ))}
                </div>
              </Container>
            </SwiperSlide>
          );
        })}
      </Swiper>
    </div>
  );
};

export default HeroSection;
