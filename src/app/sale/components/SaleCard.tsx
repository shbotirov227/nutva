"use client";

import React from "react";
import Image, { StaticImageData } from "next/image";
import { useTranslation } from "react-i18next";

const SaleCard = ({
  img,
  title,
  color,
  discountPrice,
  originalPrice
}: {
  img: StaticImageData,
  title: string;
  color: string;
  discountPrice: string;
  originalPrice: string;
}) => {

  const { t } = useTranslation();

  return (
    <div>
      <div className="flex items-center justify-between flex-col p-5 bg-[#32BF6833] rounded-2xl shadow-md border-1" style={{ borderColor: color }}>
        <Image
          src={img}
          className="w-30 h-30 object-contain mb-1"
          alt="Product"
          // priority
        />
        <div className="flex flex-col text-center">
          <h3 className="text-xl font-bold mb-3" style={{ color }}>{title}</h3>
          <p className="text-xl font-bold text-[#FF0000] mb-1">{discountPrice} {t("common.sum")}</p>
          <p className="text-[#7A7A7A] font-semibold line-through">{originalPrice} {t("common.sum")}</p>
        </div>
      </div>
    </div>
  )
}

export default SaleCard;