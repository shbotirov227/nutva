// unchanged imports
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
import { apiClient } from "@/lib/apiClient";
import { ProductName } from "@/types/enums";
import { productBgColors } from "@/types/records";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import ProductCard from "@/components/ProductCard";
import Container from "@/components/Container";
import "swiper/css/navigation";
import "swiper/css";
import clsx from "clsx";
import { useTranslated } from "@/hooks/useTranslated";

const SkeletonCard = () => (
  <div className="p-4 rounded-xl bg-gray-200 border border-gray-300 shadow-md min-h-[350px] flex flex-col">
    <Skeleton className="w-full h-48 rounded mb-4" />
    <Skeleton className="w-3/4 h-6 rounded mb-3" />
    <Skeleton className="w-5/6 h-4 rounded mb-3" />
    <Skeleton className="w-1/2 h-6 rounded" />
  </div>
);

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
    data: products = [],
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
  }, [setupNavigation]);

  const localized = useTranslated(products);
  const activeProduct = useMemo(() => localized?.[activeIndex], [localized, activeIndex]);
  const { color: activeColor, bgImage: activeBgImage } = useProductVisuals(activeProduct?.name as ProductName);

  if (!isMounted) return <SkeletonCard />;

  return (
    <div className="products relative w-full py-10">
      {isAviableBackground && activeBgImage && (
        <div
          className="absolute h-full w-full inset-0 -z-10 mx-auto px-4 sm:px-6 lg:px-8 py-10 overflow-hidden !bg-cover !bg-center !bg-no-repeat"
          style={{
            background: `url(${activeBgImage})`,
            transition: "background-image 0.5s ease-in-out",
          }}
        />
      )}

      <Container>
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between z-30 gap-4 mt-5 mb-8">
          <h2 className="text-3xl sm:text-4xl font-bold transition-colors duration-500" style={{ color: activeColor }}>
            {t("common.ourProducts")}
          </h2>
          <div className="flex items-center gap-4">
            <Button ref={prevRef} style={{ backgroundColor: activeColor }} className="size-10 text-white rounded-full shadow-md hover:bg-[#365343] transition-all duration-500">
              <ChevronLeft className="size-6" />
            </Button>
            <Button ref={nextRef} style={{ backgroundColor: activeColor }} className="size-10 text-white rounded-full shadow-md hover:bg-[#365343] transition-all duration-500">
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
          const realIndex = swiper.realIndex ?? (swiper.activeIndex % products.length);
          setActiveIndex(realIndex);
        }}
        onSwiper={(swiper) => {
          swiperRef.current = swiper;
          setupNavigation();
        }}
        className="mySwiper cursor-grab active:cursor-grabbing px-[5%] md:px-[4%] lg:px-[6%]"


      >
        {(isLoading || !products.length ? Array.from({ length: 5 }) : localized)?.map((product, index) => {
          if (!product || !product.name) return null;

          const isActive = activeIndex === index;
          return (
            <SwiperSlide
              key={index}
              className={clsx(
                "w-[84vw]",
                "sm:!w-[500px]",
                "md:!w-[330px] md:mx-auto",
                "lg:!w-[700px]",
                "xl:!w-[800px]",
                "2xl:!w-[850px]",
                "h-[800px] shrink-0 grow-0 transition-transform duration-500"
              )}
            >
              <Container className="max-w-[768px]:w-full">

                <div
                  className={clsx(
                    "w-full flex justify-center sm:block sm:w-auto transition-all duration-500",
                    isActive ? "scale-100" : "scale-90 opacity-100"
                  )}
                >
                  <ProductCard
                    product={product}
                    id={product.id}
                    title={product.name}
                    slug={product.slug}
                    bgColor={productBgColors[product.name as ProductName]}
                    description={product.description}
                    price={product.price}
                    image={product.imageUrls}
                    className={clsx(
                      "rounded-xl p-4 transition-all duration-500",
                      isActive ? "shadow-[10px_10px_10px_rgba(0,0,0,0.3)]" : "shadow-sm"
                    )}
                    imagePriority={index === 0}
                    index={index}
                    activeColor={isActive ? activeColor : ""}
                  />
                </div>
              </Container>
            </SwiperSlide>

          );
        })}
      </Swiper>

      <div className="flex items-center justify-center mt-10">
        <Link
          href="/contact"
          className="inline-flex items-center justify-center mx-auto text-white text-lg px-8 py-4 font-semibold rounded-lg shadow-md transition-all duration-500"
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
