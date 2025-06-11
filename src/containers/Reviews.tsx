"use client";

import Container from "@/components/Container";
import ReviewCard from "@/components/ReviewCard";
import React from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay } from "swiper/modules"; // 👈 MUHIM QADAM

// Swiper styles (agar hali qo‘shilmagan bo‘lsa)
import "swiper/css";

const Reviews = () => {
  return (
    <>
      <Container className="text-center my-10">
        <h2 className="text-3xl font-bold text-center text-[#3F3F46]">Реальные отзывы наших клиентов</h2>
        <p className="w-[70%] mx-auto mt-4 text-center text-[#3F3F46]">
          Узнайте, как NUTVA помогает улучшить качество жизни и достичь желаемых результатов. Видео-отзывы от тех, кто уже попробовал наш продукт, подтверждают эффективность и качество.
        </p>
      </Container>

      <Swiper
        modules={[Autoplay]}
        loop={true}
        slidesPerView={4}
        centeredSlides={false}
        spaceBetween={55}
        slidesPerGroup={1}
        speed={600}
        autoplay={{
          delay: 3000,
          disableOnInteraction: false,
        }}
        breakpoints={{
          320: {
            slidesPerView: 1,
            spaceBetween: 20,
          },
          480: {
            slidesPerView: 1,
            spaceBetween: 25,
          },
          768: {
            slidesPerView: 3,
            spaceBetween: 30,
          },
          900: {
            slidesPerView: 3.7,
            spaceBetween: 35,
          },
          1024: {
            slidesPerView: 4,
            spaceBetween: 40,
          },
          1280: {
            slidesPerView: 4,
            spaceBetween: 55,
          },
        }}
        className="mySwiper cursor-grab active:cursor-grabbing py-5"
      >
        {Array.from({ length: 5 }).map((_, index) => (
          <SwiperSlide key={index} className="pb-7">
            <ReviewCard />
          </SwiperSlide>
        ))}
      </Swiper>
    </>
  );
};

export default Reviews;
