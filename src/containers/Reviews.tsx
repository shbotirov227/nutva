"use client";

import React, { useRef } from "react";
import { useTranslation } from "react-i18next";
import { Swiper, SwiperClass, SwiperSlide } from "swiper/react";
import { Autoplay } from "swiper/modules";
import Container from "@/components/Container";
import ReviewCard from "@/components/ReviewCard";
import "swiper/css";
import { useReviewVideos } from "@/constants/reviewsVideos";

const Reviews = () => {
  const { t } = useTranslation();
  const reviewVideos = useReviewVideos();
  const swiperRef = useRef<SwiperClass | null>(null);

  return (
    <div className="max-[920px]:px-4 max-sm:px-0">
      <Container className="text-center my-10 px-4 sm:px-6 lg:px-8">
        <h2 className="text-2xl sm:text-3xl font-bold text-[#3F3F46]">
          {t("reviewSection.title")}
        </h2>
        <p className="w-full sm:w-[80%] md:w-[70%] mx-auto mt-4 text-sm sm:text-base text-[#3F3F46]">
          {t("reviewSection.subtitle")}
        </p>
      </Container>

      <Swiper
        modules={[Autoplay]}
        onSwiper={(swiper) => (swiperRef.current = swiper)}
        loop
        slidesPerView={1}
        spaceBetween={20}
        centeredSlides={false}
        speed={700}
        autoplay={{
          delay: 3000,
          disableOnInteraction: false,
        }}
        breakpoints={{
          480: { slidesPerView: 1, spaceBetween: 20 },
          640: { slidesPerView: 1, spaceBetween: 25 },
          768: { slidesPerView: 2, spaceBetween: 30 },
          1024: { slidesPerView: 3, spaceBetween: 40 },
          1280: { slidesPerView: 3, spaceBetween: 55 },
        }}
        aria-label="Отзывы клиентов"
        className="mySwiper cursor-grab active:cursor-grabbing px-4 sm:px-6 lg:px-8 py-5"
      >
        {reviewVideos.map((item, index) => (
          <SwiperSlide key={index} className="pb-7">
            <div className="w-full max-w-sm mx-auto">
              <ReviewCard
                url={item.url}
                title={item.title}
                description={item.description}
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
