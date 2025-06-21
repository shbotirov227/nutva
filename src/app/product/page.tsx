"use client";

import { useMemo, useState } from "react";
// import Image from "next/image";
import Container from "@/components/Container";
import { useQuery } from "@tanstack/react-query";
import { apiClient } from "@/lib/apiClient";
import { ProductName } from "@/types/enums";
import { GetAllProductsType } from "@/types/products/getAllProducts";
import { productBgColors } from "@/types/records";
import ProductBgImg1 from "@/assets/images/carousel-bg-green.webp";
import ProductBgImg2 from "@/assets/images/carousel-bg-orange.webp";
import ProductBgImg3 from "@/assets/images/carousel-bg-red.webp";
import ProductBgImg4 from "@/assets/images/carousel-bg-purple.webp";
import ProductBgImg5 from "@/assets/images/carousel-bg-blue.webp";

const productBgImages: Record<ProductName, string> = {
  [ProductName.COMPLEX]: ProductBgImg1.src,
  [ProductName.GELMIN_KIDS]: ProductBgImg2.src,
  [ProductName.COMPLEX_EXTRA]: ProductBgImg3.src,
  [ProductName.FERTILIA_WOMEN]: ProductBgImg4.src,
  [ProductName.VIRIS_MEN]: ProductBgImg5.src,
};

export default function ProductPage() {
  const [
    activeIndex,
    // setActiveIndex
  ] = useState<number>(0);

  const { data: products = [] as GetAllProductsType[] } = useQuery({
    queryKey: ["products"],
    queryFn: () => apiClient.getAllProducts("en"),
    refetchOnWindowFocus: false,
    staleTime: 1000 * 60 * 5,
  });

  const activeProduct = useMemo(
    () => products?.[activeIndex],
    [products, activeIndex]
  );

  const { activeColor, activeBgImage } = useMemo(() => {
    const color =
      productBgColors[activeProduct?.name as ProductName] ?? "#218A4F";
    const bgImage = productBgImages[activeProduct?.name as ProductName] ?? "";

    return {
      activeColor: color,
      activeBgImage: bgImage,
    };
  }, [activeProduct]);

  console.log(activeProduct, activeColor, activeBgImage);
  console.log(activeProduct?.image?.url);

  return (
    <div className="pt-32">
      <Container>
        <div
          className="absolute h-full w-full inset-0 -z-10 mx-auto px-4 sm:px-6 lg:px-8 py-10 overflow-hidden duration-500 bg-cover bg-center"
          style={{
            // backgroundImage: `url(${activeBgImage})`,
            transition: "background-image 0.5s ease-in-out",
          }}
        ></div>
        {/* <Image src={activeProduct?.image?.url} alt="Product" width={500} height={500} /> */}

        <h1>Products page</h1>
      </Container>
    </div>
  );
}
