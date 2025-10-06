"use client";

import React, { useRef, useState, useMemo } from "react";
import { useTranslation } from "react-i18next";
import { Swiper, SwiperClass, SwiperSlide } from "swiper/react";
import { Autoplay } from "swiper/modules";
import Container from "@/components/Container";
import ReviewCard from "@/components/ReviewCard";
import "swiper/css";
import { useReviewVideos } from "@/constants/reviewsVideos";

type CategoryFilter = "all" | "gelmin" | "complex" | "complexExtra";

const Reviews = () => {
  const { t } = useTranslation();
  const allVideos = useReviewVideos();
  const [selectedCategory, setSelectedCategory] = useState<CategoryFilter>("all");
  const swiperRef = useRef<SwiperClass | null>(null);

  // Kategoriya bo'yicha filtrlangan videolar
  const filteredVideos = useMemo(() => {
    if (selectedCategory === "all") return allVideos;
    return allVideos.filter((video) => video.category === selectedCategory);
  }, [selectedCategory, allVideos]);

  // Kategoriya o'zgarganda swiper'ni yangilash
  const handleCategoryChange = (category: CategoryFilter) => {
    setSelectedCategory(category);
    // Swiper'ni birinchi slide'ga qaytarish
    if (swiperRef.current) {
      swiperRef.current.slideTo(0);
    }
  };

  return (
    <div className="max-[920px]:px-4 max-sm:px-0 py-8 sm:py-12">
      <Container className="text-center mb-8 px-4 sm:px-6 lg:px-8">
        <h2 className="text-2xl sm:text-3xl font-bold text-[#3F3F46] mb-4">
          {t("reviewSection.title")}
        </h2>
        <p className="w-full sm:w-[80%] md:w-[70%] mx-auto text-sm sm:text-base text-[#3F3F46] mb-6">
          {t("reviewSection.subtitle")}
        </p>

        {/* Kategoriya filtri */}
        <div className="flex flex-wrap justify-center gap-3 sm:gap-4">
          <button
            onClick={() => handleCategoryChange("all")}
            className={`px-4 sm:px-6 py-2.5 sm:py-3 rounded-full text-sm sm:text-base font-semibold transition-all duration-300 transform ${
              selectedCategory === "all"
                ? "bg-gradient-to-r from-green-500 to-green-600 text-white shadow-xl shadow-green-500/30 scale-105 hover:from-green-600 hover:to-green-700"
                : "bg-white text-gray-700 border-2 border-gray-200 hover:border-green-400 hover:text-green-600 hover:bg-green-50 shadow-sm"
            }`}
          >
            {t("reviewSection.categories.all")} ({allVideos.length})
          </button>
          <button
            onClick={() => handleCategoryChange("complex")}
            className={`px-4 sm:px-6 py-2.5 sm:py-3 rounded-full text-sm sm:text-base font-semibold transition-all duration-300 transform ${
              selectedCategory === "complex"
                ? "bg-gradient-to-r from-green-500 to-green-600 text-white shadow-xl shadow-green-500/30 scale-105 hover:from-green-600 hover:to-green-700"
                : "bg-white text-gray-700 border-2 border-gray-200 hover:border-green-400 hover:text-green-600 hover:bg-green-50 shadow-sm"
            }`}
          >
            Nutva Complex (3)
          </button>
          {/* <button
            onClick={() => handleCategoryChange("complexExtra")}
            className={`px-4 sm:px-6 py-2.5 sm:py-3 rounded-full text-sm sm:text-base font-semibold transition-all duration-300 transform ${
              selectedCategory === "complexExtra"
                ? "!bg-gradient-to-r !from-red-500 !via-red-600 !to-rose-600 !text-white !shadow-xl !shadow-red-500/30 scale-105 hover:!from-red-600 hover:!via-red-700 hover:!to-rose-700"
                : "bg-white text-gray-700 border-2 border-gray-200 hover:border-red-400 hover:text-red-600 hover:bg-red-50 shadow-sm"
            }`}
            style={selectedCategory === "complexExtra" ? {
              background: 'linear-gradient(to right, rgb(239, 68, 68), rgb(220, 38, 38), rgb(244, 63, 94))',
              color: 'white',
              boxShadow: '0 20px 25px -5px rgb(239 68 68 / 0.3), 0 8px 10px -6px rgb(239 68 68 / 0.3)'
            } : {}}
          >
            Complex Extra (3)
          </button> */}
          <button
            onClick={() => handleCategoryChange("gelmin")}
            className={`px-4 sm:px-6 py-2.5 sm:py-3 rounded-full text-sm sm:text-base font-semibold transition-all duration-300 transform ${
              selectedCategory === "gelmin"
                ? "!bg-gradient-to-r !from-orange-500 !via-orange-600 !to-amber-600 !text-white !shadow-xl !shadow-orange-500/30 scale-105 hover:!from-orange-600 hover:!via-orange-700 hover:!to-amber-700"
                : "bg-white text-gray-700 border-2 border-gray-200 hover:border-orange-400 hover:text-orange-600 hover:bg-orange-50 shadow-sm"
            }`}
            style={selectedCategory === "gelmin" ? {
              background: 'linear-gradient(to right, rgb(249, 115, 22), rgb(234, 88, 12), rgb(217, 119, 6))',
              color: 'white',
              boxShadow: '0 20px 25px -5px rgb(249 115 22 / 0.3), 0 8px 10px -6px rgb(249 115 22 / 0.3)'
            } : {}}
          >
            Gelmin Kids (3)
          </button>
        </div>
      </Container>

      {/* Video slider */}
      <Swiper
        key={selectedCategory} // Kategoriya o'zgarganda swiper'ni qayta render qilish
        modules={[Autoplay]}
        onSwiper={(swiper) => (swiperRef.current = swiper)}
        loop={filteredVideos.length > 3}
        slidesPerView={1}
        spaceBetween={20}
        centeredSlides={false}
        speed={700}
        autoplay={{
          delay: 5000,
          disableOnInteraction: false,
        }}
        breakpoints={{
          480: { slidesPerView: 1.5, centeredSlides: true, spaceBetween: 20 },
          640: { slidesPerView: 1.7, centeredSlides: true, spaceBetween: 25 },
          768: { slidesPerView: 2.4, centeredSlides: false, spaceBetween: 30 },
          1024: { slidesPerView: 3, centeredSlides: false, spaceBetween: 20 },
          1280: { slidesPerView: 3, centeredSlides: false, spaceBetween: 24 },
        }}
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
                onPlay={() => swiperRef.current?.autoplay.stop()}
              />
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
};

export default Reviews;
