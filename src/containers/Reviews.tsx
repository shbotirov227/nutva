"use client";

import Container from "@/components/Container";
import ReviewCard from "@/components/ReviewCard";
import React from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay } from "swiper/modules";
import "swiper/css";

const Reviews = () => {
  return (
    <>
      <Container className="text-center my-10 px-4 sm:px-6 lg:px-8">
        <h2 className="text-2xl sm:text-3xl font-bold text-[#3F3F46]">
          Реальные отзывы наших клиентов
        </h2>
        <p className="w-full sm:w-[80%] md:w-[70%] mx-auto mt-4 text-sm sm:text-base text-[#3F3F46]">
          Узнайте, как NUTVA помогает улучшить качество жизни и достичь желаемых результатов. Видео-отзывы от тех, кто уже попробовал наш продукт, подтверждают эффективность и качество.
        </p>
      </Container>

      <Swiper
        modules={[Autoplay]}
        loop
        slidesPerView={1}
        spaceBetween={20}
        centeredSlides={false}
        speed={600}
        autoplay={{
          delay: 3000,
          disableOnInteraction: false,
        }}
        breakpoints={{
          480: { slidesPerView: 1, spaceBetween: 20 },
          640: { slidesPerView: 2, spaceBetween: 25 },
          768: { slidesPerView: 3, spaceBetween: 30 },
          1024: { slidesPerView: 4, spaceBetween: 40 },
          1280: { slidesPerView: 4, spaceBetween: 55 },
        }}
        aria-label="Отзывы клиентов"
        className="mySwiper cursor-grab active:cursor-grabbing px-4 sm:px-6 lg:px-8 py-5"
      >
        {Array.from({ length: 5 }).map((_, index) => (
          <SwiperSlide key={index} className="pb-7">
            <div className="w-full max-w-sm mx-auto">
              <ReviewCard />
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </>
  );
};

export default Reviews;
