import { useMemo } from "react";
import { ProductName } from "@/types/enums";
import { productBgColors } from "@/types/records";
import { bgColors } from "@/types/records";

import CarouselBgImg1 from "@/assets/images/carousel-bg-green.webp";
import CarouselBgImg2 from "@/assets/images/carousel-bg-orange.webp";
import CarouselBgImg3 from "@/assets/images/carousel-bg-red.webp";
import CarouselBgImg4 from "@/assets/images/carousel-bg-purple.webp";
import CarouselBgImg5 from "@/assets/images/carousel-bg-blue.webp";

type Options = {
  includeBgColor?: boolean;
};

const productBgImages: Record<ProductName, string> = {
  [ProductName.COMPLEX]: CarouselBgImg1.src,
  [ProductName.GELMIN_KIDS]: CarouselBgImg2.src,
  [ProductName.COMPLEX_EXTRA]: CarouselBgImg3.src,
  [ProductName.FERTILIA_WOMEN]: CarouselBgImg4.src,
  [ProductName.VIRIS_MEN]: CarouselBgImg5.src,
};

export function useProductVisuals(productName?: ProductName, options?: Options) {
  return useMemo(() => {
    const color = productBgColors[productName ?? ProductName.COMPLEX] || "#218A4F";
    const bgImage = productBgImages[productName ?? ProductName.COMPLEX] || "";
    const bgColor = options?.includeBgColor ? bgColors[productName ?? ProductName.COMPLEX] || "#D8F6D1" : undefined;
    return { color, bgImage, bgColor };
  }, [options?.includeBgColor, productName]);
}
