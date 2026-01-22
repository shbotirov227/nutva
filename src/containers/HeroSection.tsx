/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Pagination, EffectFade } from "swiper/modules";
import { useQuery } from "@tanstack/react-query";
import { apiClient } from "@/lib/apiClient";
import { normalizeImageUrl } from "@/lib/imageUtils";
import { useLang } from "@/context/LangContext";
import { useTranslated } from "@/hooks/useTranslated";
import { useLowPowerMode } from "@/hooks/useLowPowerMode";

import "swiper/css/pagination";
import "swiper/css/effect-fade";
import "swiper/css";

const HeroSection = () => {
  const { lang } = useLang();
  const lowPowerMode = useLowPowerMode();

  const { data: banner = [], isLoading } = useQuery({
    queryKey: ["banner", lang],
    queryFn: () => apiClient.getBanner(lang),
    refetchOnWindowFocus: false,
    staleTime: 1000 * 60 * 5,
  });

  const localized = useTranslated(banner);

  return (
    <div className="relative pt-[56px] overflow-hidden md:min-h-[calc(100svh-56px)]">
      {isLoading ? (
        <div className="w-full aspect-[16/9] md:aspect-auto md:h-[calc(100svh-56px)] bg-gradient-to-br from-gray-100 to-gray-200 animate-pulse" />
      ) : (
        <Swiper
          modules={lowPowerMode ? [Pagination] : [Autoplay, Pagination, EffectFade]}
          autoplay={lowPowerMode ? false : { delay: 5000, disableOnInteraction: false }}
          effect="fade"
          fadeEffect={{ crossFade: true }}
          loop
          speed={1000}
          slidesPerView={1}
          pagination={{ 
            clickable: true,
            bulletClass: "swiper-pagination-bullet !bg-white/60",
            bulletActiveClass: "swiper-pagination-bullet-active !bg-white"
          }}
          className="w-full md:h-[calc(100svh-56px)] hero-swiper"
        >
          {localized.map((item: any, idx: number) => {
            const images: string[] = Array.isArray(item?.imageUrls) ? item.imageUrls : [];
            const mainImage = normalizeImageUrl(images[0]);
            const hasLink = Boolean(item?.link);
            
            return (
              <SwiperSlide key={item.id || idx}>
                <div className="relative w-full aspect-[16/9] md:aspect-auto md:h-[calc(100svh-56px)]">
                  {hasLink ? (
                    <Link
                      href={item.link}
                      target={item.link.startsWith('http') ? "_blank" : undefined}
                      rel={item.link.startsWith('http') ? "noopener noreferrer" : undefined}
                      className="block w-full h-full cursor-pointer group"
                    >
                      {mainImage ? (
                        <Image
                          src={mainImage}
                          alt={item?.title || `Hero banner ${idx + 1}`}
                          fill
                          sizes="100vw"
                          priority={idx === 0}
                          loading={idx === 0 ? "eager" : "lazy"}
                          unoptimized
                          onError={(e) => {
                            (e.currentTarget as HTMLImageElement).src = "/seo_banner.jpg";
                          }}
                          className="object-contain md:object-cover object-center transition-transform duration-300 group-hover:scale-[1.02]"
                        />
                      ) : (
                        <div className="w-full h-full bg-gradient-to-br from-emerald-400 to-sky-500" />
                      )}
                    </Link>
                  ) : (
                    <>
                      {mainImage ? (
                        <Image
                          src={mainImage}
                          alt={item?.title || `Hero banner ${idx + 1}`}
                          fill
                          sizes="100vw"
                          priority={idx === 0}
                          loading={idx === 0 ? "eager" : "lazy"}
                          unoptimized
                          onError={(e) => {
                            (e.currentTarget as HTMLImageElement).src = "/seo_banner.jpg";
                          }}
                          className="object-contain md:object-cover object-center"
                        />
                      ) : (
                        <div className="w-full h-full bg-gradient-to-br from-emerald-400 to-sky-500" />
                      )}
                    </>
                  )}
                </div>
              </SwiperSlide>
            );
          })}
        </Swiper>
      )}
      
      {/* Custom Swiper Styles */}
      <style jsx global>{`
        .hero-swiper .swiper-pagination {
          bottom: 1rem !important;
        }
        
        .hero-swiper .swiper-pagination-bullet {
          width: 10px;
          height: 10px;
          opacity: 0.7;
          transition: all 0.3s ease;
        }
        
        .hero-swiper .swiper-pagination-bullet-active {
          width: 28px;
          border-radius: 5px;
          opacity: 1;
        }
        
        @media (min-width: 768px) {
          .hero-swiper .swiper-pagination {
            bottom: 2rem !important;
          }
          
          .hero-swiper .swiper-pagination-bullet {
            width: 12px;
            height: 12px;
          }
          
          .hero-swiper .swiper-pagination-bullet-active {
            width: 32px;
            border-radius: 6px;
          }
        }
      `}</style>
    </div>
  );
};

export default HeroSection;