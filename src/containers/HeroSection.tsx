/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React from "react";
import Image from "next/image";
import Container from "@/components/Container";
import { useQuery } from "@tanstack/react-query";
import { apiClient } from "@/lib/apiClient";
// import { GetAllBannerType } from "@/types/banner/getAllBanner";
import { useLang } from "@/context/LangContext";

import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay } from "swiper/modules";
// import { GetOneBannerType } from "@/types/banner/getOneBanner";
import { useTranslated } from "@/hooks/useTranslated";
import "swiper/css/pagination";
import "swiper/css";
import Link from "next/link";
import { useTranslation } from "react-i18next";

const HeroSection = () => {
  const { lang } = useLang();
  const { t } = useTranslation();

  const { data: banner = [] } = useQuery({
    queryKey: ["banner", lang],
    queryFn: () => apiClient.getBanner(lang),
    refetchOnWindowFocus: false,
    staleTime: 1000 * 60 * 5,
  });

  const localized = useTranslated(banner);

  return (
    <div className="relative min-h-screen pt-[56px]">
      <div
        className="absolute inset-0 -z-10 bg-cover bg-center brightness-50"
        style={{
          backgroundImage: `url(/hero-bg.webp)`,
        }}
      ></div>

      <Swiper
        modules={[Autoplay]}
        autoplay={{ delay: 2000, disableOnInteraction: false }}
        loop
        speed={1000}
        className="w-full h-full"
      >
        {localized.map((item: any, idx: number) => {
          return (
            <SwiperSlide key={idx} className="cursor-grab active:cursor-grabbing">
              <Container className="flex flex-col md:flex-row items-center justify-around gap-6 sm:gap-10 w-full px-4 sm:px-6 min-h-screen">
                <div className="flex flex-col md:flex-row items-center justify-center gap-6 max-md:flex-col-reverse sm:gap-10 w-full px-4 sm:px-6 min-h-screen">

                  <div className="text-start max-md:text-center text-white max-w-2xl">
                    <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold mb-3 sm:mb-4">
                      {item?.title}
                    </h1>
                    <p className="text-base sm:text-lg md:text-xl md:leading-relaxed mb-4 md:mb-6">
                      {item?.subtitle}
                    </p>
                    <Link
                      href={item?.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-white bg-[rgba(255,255,255,0.3)] hover:bg-[rgba(255,255,255,0.4)] px-4 py-2 rounded-md transition-all delay-75"
                    >
                      {t("common.more")}
                    </Link>
                  </div>

                  <div className="flex flex-wrap justify-center gap-4">
                    {item?.imageUrls?.map((image: string, i: number) => (
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
