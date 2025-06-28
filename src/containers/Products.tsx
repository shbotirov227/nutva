"use client";

import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { useQuery } from "@tanstack/react-query";
import { useTranslation } from "react-i18next";
import { ChevronLeft, ChevronRight } from "lucide-react";
import type { NavigationOptions, Swiper as SwiperType } from "swiper/types";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Autoplay } from "swiper/modules";
import { useProductVisuals } from "@/hooks/useProductVisuals";
import { GetAllProductsType } from "@/types/products/getAllProducts";
import { apiClient } from "@/lib/apiClient";
import { ProductName } from "@/types/enums";
import { productBgColors } from "@/types/records";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import ProductCard from "@/components/ProductCard";
import Container from "@/components/Container";
import "swiper/css/navigation";
import "swiper/css";
// import dynamic from "next/dynamic";



const SkeletonCard = () => (
  <div className="p-4 rounded-xl bg-gray-200 border border-gray-300 shadow-[10px_10px_10px_rgba(0,0,0,0.1),_10px_10px_10px_rgba(0,0,0,0.1)] min-h-[350px] flex flex-col">
    <Skeleton className="w-full h-48 rounded mb-4" />
    <Skeleton className="w-3/4 h-6 rounded mb-3" />
    <Skeleton className="w-5/6 h-4 rounded mb-3" />
    <Skeleton className="w-1/2 h-6 rounded" />
  </div>
);

// const Swiper = dynamic(() => import("swiper/react").then(mod => mod.Swiper), {
//   ssr: false,
// });
// const SwiperSlide = dynamic(() => import("swiper/react").then(mod => mod.SwiperSlide), {
//   ssr: false,
// });

const Products = ({ isAviableBackground }: { isAviableBackground?: boolean }) => {
  const { t } = useTranslation();
  const [activeIndex, setActiveIndex] = useState<number>(0);
  const swiperRef = useRef<SwiperType | null>(null);
  const prevRef = useRef<HTMLButtonElement | null>(null);
  const nextRef = useRef<HTMLButtonElement | null>(null);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const {
    data: products = [] as GetAllProductsType[],
    isLoading
  } = useQuery({
    queryKey: ["products"],
    queryFn: () => apiClient.getAllProducts("en"),
    refetchOnWindowFocus: false,
    staleTime: 1000 * 60 * 5,
  });


  const setupNavigation = useCallback(() => {
    if (
      swiperRef.current &&
      prevRef.current &&
      nextRef.current &&
      swiperRef.current.params.navigation &&
      typeof swiperRef.current.params.navigation !== "boolean"
    ) {
      const navigation = swiperRef.current.params.navigation as NavigationOptions;
      navigation.prevEl = prevRef.current;
      navigation.nextEl = nextRef.current;

      swiperRef.current.navigation.destroy();
      swiperRef.current.navigation.init();
      swiperRef.current.navigation.update();
    }
  }, []);

  useEffect(() => {
    if (products.length) {
      setActiveIndex(0);
      setupNavigation();
    }
  }, [products, setupNavigation]);

  useEffect(() => {
    if (swiperRef.current) {
      setupNavigation();
    }
  }, [setupNavigation])

  const activeProduct = useMemo(() => products?.[activeIndex], [products, activeIndex]);

  const { color: activeColor, bgImage: activeBgImage } = useProductVisuals(
    activeProduct?.name as ProductName
  );

  if (!isMounted) {
    return <SkeletonCard />;
  }

  return (
    <div className="relative w-full py-10">
      {isAviableBackground ? (
        <div
          className="absolute h-full w-full inset-0 -z-10 mx-auto px-4 sm:px-6 lg:px-8 py-10 overflow-hidden duration-500 !bg-cover !bg-center !bg-no-repeat !  object-fit-cover"
          style={{
            background: `url(${activeBgImage})`,
            transition: "background-image 0.5s ease-in-out",
          }}
        ></div>
      ) : null}

      <Container>
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between z-30 gap-4 mt-5 mb-8">
          <h2
            className="text-3xl sm:text-4xl font-bold transition-colors duration-500"
            style={{ color: activeColor }}
          >
            {t("common.ourProducts")}
          </h2>
          <div className="flex items-center gap-4">
            <Button
              ref={prevRef}
              style={{ backgroundColor: activeColor }}
              className="flex items-center justify-center size-10 text-white rounded-full shadow-md hover:bg-[#365343] transition-all duration-500 cursor-pointer"
            >
              <ChevronLeft className="size-6" />
            </Button>
            <Button
              ref={nextRef}
              style={{ backgroundColor: activeColor }}
              className="flex items-center justify-center size-10 text-white rounded-full shadow-md hover:bg-[#365343] transition-all duration-500 cursor-pointer"
            >
              <ChevronRight className="size-6" />
            </Button>
          </div>
        </div>
      </Container>

      <Swiper
        key={products.length}
        modules={[Autoplay, Navigation]}
        slidesPerView={"auto"}
        centeredSlides={true}
        spaceBetween={55}
        slidesPerGroup={1}
        loop={true}
        speed={600}
        autoplay={{
          delay: 5000,
          disableOnInteraction: false,
        }}
        navigation={{
          prevEl: prevRef.current,
          nextEl: nextRef.current,
        }}
        onBeforeInit={(swiper) => {
          if (swiper.params.navigation && typeof swiper.params.navigation !== "boolean") {
            (swiper.params.navigation as NavigationOptions).prevEl = prevRef.current;
            (swiper.params.navigation as NavigationOptions).nextEl = nextRef.current;
          }
        }}
        onSlideChange={(swiper) => {
          // fix for loop + active index bug:
          const realIndex = swiper.realIndex ?? (swiper.activeIndex % products.length);
          setActiveIndex(realIndex);
        }}
        onSwiper={(swiper) => {
          swiperRef.current = swiper;
          setupNavigation();
        }}
        breakpoints={{
          320: {
            slidesPerView: 1,
            spaceBetween: 20,
            centeredSlides: true,
          },
          480: {
            slidesPerView: 1,
            spaceBetween: 25,
            centeredSlides: true,
          },
          768: {
            slidesPerView: 2,
            spaceBetween: 30,
            centeredSlides: true,
          },
          900: {
            slidesPerView: "auto",
            spaceBetween: 35,
            centeredSlides: true,
          },
          1024: {
            slidesPerView: "auto",
            spaceBetween: 40,
            centeredSlides: true,
          },
          1280: {
            slidesPerView: "auto",
            spaceBetween: 55,
            centeredSlides: true,
          },
        }}
        className="mySwiper cursor-grab active:cursor-grabbing px-[10%]"
      >
        {isLoading || !products?.length
          ? Array.from({ length: 5 }).map((_, idx) => (
            <SwiperSlide
              key={idx}
              className="!w-[90vw] sm:!w-[600px] md:!w-[700px] lg:!w-[800px] min-h-[400px] shrink-0 grow-0"
            >
              <SkeletonCard />
            </SwiperSlide>
          ))
          : products?.map((product: GetAllProductsType[number], index: number) => {
            const isActive = activeIndex === index;
            return (
              <SwiperSlide
                key={product.id}
                className="!w-[90vw] sm:!w-[600px] md:!w-[700px] lg:!w-[800px] min-h-[400px] shrink-0 grow-0 transition-transform duration-500"
              >
                <ProductCard
                  id={product?.id}
                  title={product?.name}
                  slug={product?.slug}
                  bgColor={productBgColors[product.name as ProductName]}
                  description={product?.description}
                  price={product?.price}
                  image={product?.imageUrls}
                  className={`rounded-xl p-4
                                          ${isActive
                      ? "shadow-[10px_10px_10px_rgba(0,0,0,0.3),_10px_10px_10px_rgba(0,0,0,0.3)]"
                      : ""
                    }`}
                  imagePriority={index === 0}
                  index={index}
                  activeColor={activeIndex === index ? activeColor : ""}
                />
              </SwiperSlide>
            );
          })}
      </Swiper>
      <div className="flex items-center justify-center mt-10">
        <Link
          href="/contact"
          className="inline-flex items-center justify-center mx-auto text-white text-lg px-8 py-4 font-semibold rounded-lg shadow-[3px_5px_5px_rgba(0,0,0,0.1),_3px_5px_5px_rgba(0,0,0,0.1)] hover:shadow-[3px_5px_5px_rgba(0,0,0,0.3),_3px_5px_5px_rgba(0,0,0,0.3)] transition-all duration-500 cursor-pointer"
          style={{ backgroundColor: activeColor }}
        >
          {t("product.consultation")}
        </Link>
      </div>

    </div>
  );
};

const ProductsComponent = React.memo(Products);
Products.displayName = "Products";
export default ProductsComponent;