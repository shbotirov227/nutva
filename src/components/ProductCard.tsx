"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { useTranslation } from "react-i18next";
import NoImage from "@/assets/images/noimage.webp";

type ProductCardProps = {
  id: string;
  title: string;
  slug: string;
  bgColor?: string;
  description: string;
  price?: number;
  image: string[];
  className?: string
  style?: React.CSSProperties,
  imagePriority?: boolean,
  index?: number,
  activeColor?: string
}

const ProductCard = ({
  id,
  title,
  slug,
  bgColor,
  description,
  image,
  className,
  style,
  imagePriority,
  index,
  activeColor
}: ProductCardProps) => {

  const { t } = useTranslation();

  return (
    <div
      style={{ backgroundColor: bgColor ? bgColor : "white", ...style }}
      className={`w-full h-auto shadow-[10px_15px_15px_rgba(0,0,0,0.1),_10px_15px_15px_rgba(0,0,0,0.1)] rounded flex flex-col lg:flex-row items-center justify-between ${className}`}
    >
      <div className="w-full lg:w-[55%] p-6 text-center lg:text-left">
        <h2 className="text-white text-2xl sm:text-3xl md:text-4xl font-semibold mb-5">{title}</h2>
        <span className="text-white text-lg sm:text-xl mb-6 block">{slug}</span>
        <p className="text-white text-sm sm:text-base md:text-md mt-6 mb-5">{description}</p>
        <div className="mt-4 flex flex-col sm:flex-row justify-center lg:justify-start items-center gap-4">
          <Link
            href={`/product/${id}`}
            style={{ color: activeColor }}
            className="bg-white font-bold px-4 py-2 rounded-lg transition-all"
          >
            {t("common.buy")}
          </Link>
          <Link
            href={`/product/${id}`}
            className="text-white font-semibold bg-transparent underline px-4 py-2"
          >
            {t("common.more")}
          </Link>
        </div>
      </div>

      <div className="w-full lg:w-[45%] mt-6 lg:mt-0 px-4">
        {image?.length > 0 ? (
          <Image
            src={image[0]}
            alt={`Product Image ${image[0]}`}
            width={0}
            height={0}
            sizes="100vw"
            className="w-full h-56 object-contain rounded"
            loading={index === 0 ? "eager" : "lazy"}
            priority={imagePriority}
            decoding="async"
          />
        ) : (
          <Image
            src={NoImage}
            alt="No Image"
            width={0}
            height={0}
            sizes="100vw"
            className="w-full h-56 object-contain rounded"
            loading={index === 0 ? "eager" : "lazy"}
            priority={imagePriority}
            decoding="async"
          />
        )}
      </div>
    </div>
  )
}

export default ProductCard;