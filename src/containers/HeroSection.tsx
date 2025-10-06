/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React from "react";
import Image from "next/image";
import Container from "@/components/Container";
import { useQuery } from "@tanstack/react-query";
import { apiClient } from "@/lib/apiClient";
import { normalizeImageUrl } from "@/lib/imageUtils";
// import { GetAllBannerType } from "@/types/banner/getAllBanner";
import { useLang } from "@/context/LangContext";

import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Pagination } from "swiper/modules";
// import { GetOneBannerType } from "@/types/banner/getOneBanner";
import { useTranslated } from "@/hooks/useTranslated";
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/effect-fade";
import Link from "next/link";
import { useTranslation } from "react-i18next";

const HeroSection = () => {
  const { lang } = useLang();
  const { t } = useTranslation();

  const { data: banner = [], isLoading } = useQuery({
    queryKey: ["banner", lang],
    queryFn: () => apiClient.getBanner(lang),
    refetchOnWindowFocus: false,
    staleTime: 1000 * 60 * 5,
  });

  const localized = useTranslated(banner);

  return (
    <div className="relative min-h-[calc(100svh-56px)] pt-[56px] overflow-x-hidden">{/* overflow-x-hidden to avoid horizontal scroll caused by wide transforms */}
      {/* Optimized global background using next/image instead of CSS background */}
      <div className="absolute inset-0 -z-30 brightness-75">
        <Image
          src="/hero-bg2.webp"
          alt=""
          fill
          sizes="100vw"
          priority={false}
          loading="lazy"
          decoding="async"
          className="object-cover md:object-[62%_center] scale-[1.08]"
        />
      </div>
      {/* Background dark overlay (soft) */}
      <div className="absolute inset-0 -z-10 bg-black/15" aria-hidden />
      {/* Subtle radial glow (behind overlay for balanced contrast) */}
      <div className="pointer-events-none absolute inset-0 -z-20 bg-[radial-gradient(60%_40%_at_50%_20%,rgba(16,185,129,0.2)_0%,transparent_65%)]" aria-hidden />

      {isLoading ? (
        <Container className="min-h-[calc(100svh-56px)] flex items-center">
          <div className="w-full grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
            <div className="space-y-4">
              <div className="h-10 w-3/4 rounded-lg bg-white/10 animate-pulse" />
              <div className="h-4 w-full rounded bg-white/10 animate-pulse" />
              <div className="h-4 w-5/6 rounded bg-white/10 animate-pulse" />
              <div className="h-12 w-40 rounded-md bg-white/10 animate-pulse" />
            </div>
            <div className="mx-auto h-64 w-64 md:h-80 md:w-80 rounded-2xl bg-white/10 animate-pulse" />
          </div>
        </Container>
      ) : (
        <Swiper
          modules={[Autoplay, Pagination]}
          autoplay={{ delay: 3500, disableOnInteraction: false }}
          loop
          speed={700}
          slidesPerView={1}
          pagination={{ clickable: true }}
          className="w-full h-full"
        >
          {localized.map((item: any, idx: number) => {
            const images: string[] = Array.isArray(item?.imageUrls) ? item.imageUrls : [];
            const mainImage = normalizeImageUrl(images[0]);
            const hasLink = Boolean(item?.link);
            const isExternal = hasLink && /^https?:\/\//.test(item.link);
            // Default: place text card on the right for all slides on desktop.
            // Allow API to override with item.cardPosition: 'left' | 'right'.
            const cardOnRight = item?.cardPosition ? item.cardPosition === "right" : true;
            return (
              <SwiperSlide key={item.id || item.title || idx} className="cursor-grab active:cursor-grabbing">
                <Container className="w-full min-h-[calc(100svh-56px)] flex items-center">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-10 md:gap-8 items-center w-full">
                    {/* Left: content card */}
                    <div className={`relative max-w-2xl order-2 ${cardOnRight ? "md:order-2 md:justify-self-end" : "md:order-1"}`}>
                      <div className="rounded-2xl border border-white/15 bg-white/10 backdrop-blur-md p-6 sm:p-8 shadow-[0_20px_60px_rgba(0,0,0,0.25)]">
                        <h1 className="text-white text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight drop-shadow">
                          {item?.title}
                        </h1>
                        {item?.subtitle && (
                          <p className="mt-4 text-white/90 text-base sm:text-lg md:text-xl leading-relaxed">
                            {item.subtitle}
                          </p>
                        )}
                        {hasLink && (
                          <div className="mt-6">
                            <Link
                              href={item.link}
                              {...(isExternal ? { target: "_blank", rel: "noopener noreferrer" } : {})}
                              className="inline-flex items-center justify-center rounded-lg px-5 py-3 text-base font-semibold text-white shadow-lg transition-all"
                              style={{ background: "linear-gradient(90deg,#10b981,#0ea5e9)" }}
                              aria-label={t("common.more")}
                            >
                              {t("common.more")}
                            </Link>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Right: visual */}
                    <div className={`relative flex justify-center ${cardOnRight ? "md:justify-start md:order-1 md:pl-10" : "md:justify-end md:order-2 md:pr-6"} items-center order-1`}>
                      {/* Accent blobs */}
                      <div className={`absolute ${cardOnRight ? "-left-8 -top-8" : "-right-8 -top-8"} h-40 w-40 rounded-full blur-3xl opacity-40 bg-emerald-400`} aria-hidden />
                      <div className={`absolute ${cardOnRight ? "left-0 bottom-0" : "right-0 bottom-0"} h-28 w-28 rounded-full blur-2xl opacity-30 bg-sky-400`} aria-hidden />

            {mainImage ? (
                        <Image
                          src={mainImage}
                          alt={item?.title ? `${item.title} — banner` : `banner-${idx + 1}`}
                          width={640}
                          height={640}
                          sizes="(max-width: 768px) 65vw, 30vw"
                          priority={idx === 0}
                          loading={idx === 0 ? "eager" : "lazy"}
                          decoding="async"
                          fetchPriority={idx === 0 ? "high" : "low"}
                          // Bypass Next Image Optimizer to avoid 504 from remote hosts
                          unoptimized
                          onError={(e) => {
                            // Graceful fallback to local placeholder if remote image fails
                            (e.currentTarget as HTMLImageElement).src = "/seo_banner.jpg";
                          }}
                          className={`w-[54vw] max-w-[420px] md:max-w-[480px] h-auto object-contain drop-shadow-2xl md:translate-y-1 ${cardOnRight ? "md:translate-x-6" : "md:-translate-x-2"}`}
                        />
                      ) : (
                        <div className="h-64 w-64 md:h-80 md:w-80 rounded-2xl bg-white/10" />
                      )}
                    </div>
                  </div>
                </Container>
              </SwiperSlide>
            );
          })}
        </Swiper>
      )}
    </div>
  );
};

export default HeroSection;
