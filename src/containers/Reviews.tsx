"use client";

import React, { useRef } from "react";
import { useTranslation } from "react-i18next";
import { Swiper, SwiperClass, SwiperSlide } from "swiper/react";
import { Autoplay } from "swiper/modules";
import Container from "@/components/Container";
import ReviewCard from "@/components/ReviewCard";
import "swiper/css";
import { useReviewVideos } from "@/constants/reviewsVideos";
import { useLowPowerMode } from "@/hooks/useLowPowerMode";

const Reviews = () => {
  const { t } = useTranslation();
  const allVideos = useReviewVideos();
  const swiperRef = useRef<SwiperClass | null>(null);
  const lowPowerMode = useLowPowerMode();

  // Hozircha barcha videolar to'liq ko'rsatiladi (kategoriya filtri o'chirilgan)
  const filteredVideos = allVideos;

  return (
    <div className="max-[920px]:px-4 max-sm:px-0 py-8 sm:py-12">
      <Container className="text-center mb-8 px-4 sm:px-6 lg:px-8">
        <h2 className="text-2xl sm:text-3xl font-bold text-[#3F3F46] mb-4">
          {t("reviewSection.title")}
        </h2>
        <p className="w-full sm:w-[80%] md:w-[70%] mx-auto text-sm sm:text-base text-[#3F3F46] mb-6">
          {t("reviewSection.subtitle")}
        </p>

        {/* Kategoriya filtri (hozircha o'chirilgan)
        <div className="flex flex-wrap justify-center gap-3 sm:gap-4">
          {([
            { key: "all", label: t("reviewSection.categories.all"), color: "green" },
            { key: "complex", label: "Nutva Complex", color: "green" },
            { key: "complexExtra", label: "Complex Extra", color: "red" },
            { key: "gelmin", label: "Gelmin Kids", color: "orange" },
          ] as { key: CategoryFilter; label: string; color: string }[])
            .filter(btn => btn.key === 'all' || allVideos.some(v => v.category === btn.key))
            .map(btn => {
              const count = btn.key === 'all' ? allVideos.length : allVideos.filter(v => v.category === btn.key).length;
              const active = selectedCategory === btn.key;
              const base = "px-4 sm:px-6 py-2.5 sm:py-3 rounded-full text-sm sm:text-base font-semibold transition-all duration-300 transform border-2";
              const palette: Record<string, { from: string; to: string; hoverFrom: string; hoverTo: string; shadow: string; }> = {
                green: { from: 'from-green-500', to: 'to-green-600', hoverFrom: 'hover:from-green-600', hoverTo: 'hover:to-green-700', shadow: 'shadow-green-500/30' },
                red: { from: 'from-red-500', to: 'to-rose-600', hoverFrom: 'hover:from-red-600', hoverTo: 'hover:to-rose-700', shadow: 'shadow-red-500/30' },
                orange: { from: 'from-orange-500', to: 'to-amber-600', hoverFrom: 'hover:from-orange-600', hoverTo: 'hover:to-amber-700', shadow: 'shadow-orange-500/30' },
              };
              const p = palette[btn.color];
              const activeCls = `bg-gradient-to-r ${p.from} ${p.to} text-white shadow-xl ${p.shadow} scale-105 ${p.hoverFrom} ${p.hoverTo}`;
              const inactiveCls = "bg-white text-gray-700 border-gray-200 hover:border-gray-300 hover:text-gray-800 hover:bg-gray-50";
              return (
                <button
                  key={btn.key}
                  onClick={() => handleCategoryChange(btn.key)}
                  aria-pressed={active}
                  className={`${base} ${active ? activeCls : inactiveCls}`}
                >
                  {btn.label} ({count})
                </button>
              );
            })}
        </div>
        */}
      </Container>

      {/* Video slider */}
      <Swiper
        key={lowPowerMode ? "reviews-lp" : "reviews"}
        modules={lowPowerMode ? [] : [Autoplay]}
        onSwiper={(swiper) => (swiperRef.current = swiper)}
        loop={!lowPowerMode && filteredVideos.length > 3}
        slidesPerView={1}
        spaceBetween={20}
        centeredSlides={false}
        roundLengths
        watchOverflow
        touchStartPreventDefault={false}
        speed={700}
        autoplay={
          lowPowerMode
            ? false
            : {
                delay: 5000,
                disableOnInteraction: false,
              }
        }
        breakpoints={
          lowPowerMode
            ? {
                0: { slidesPerView: 1, centeredSlides: false, spaceBetween: 16 },
              }
            : {
                480: { slidesPerView: 1.5, centeredSlides: true, spaceBetween: 20 },
                640: { slidesPerView: 1.7, centeredSlides: true, spaceBetween: 25 },
                768: { slidesPerView: 2.4, centeredSlides: false, spaceBetween: 30 },
                1024: { slidesPerView: 3, centeredSlides: false, spaceBetween: 20 },
                1280: { slidesPerView: 3, centeredSlides: false, spaceBetween: 24 },
              }
        }
        aria-label="Отзывы клиентов"
        className="mySwiper cursor-grab active:cursor-grabbing px-4 sm:px-6 lg:px-8 py-5"
      >
        {filteredVideos.map((item, index) => (
          <SwiperSlide 
            key={`${item.category}-${item.url}-${index}`} 
            className="pb-7"
          >
            <div className="w-full max-w-sm mx-auto">
              <ReviewCard
                url={item.url}
                title={item.title}
                onPlay={() => swiperRef.current?.autoplay?.stop?.()}
              />
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
};

export default Reviews;
