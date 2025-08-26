"use client";

import React from "react";
import Image, { StaticImageData } from "next/image";
import { Button } from "@/components/ui/button";
import { useTranslation } from "react-i18next";
import tinycolor from "tinycolor2";
import { useRouter } from "next/navigation";
import { useLang } from "@/context/LangContext";

const SaleTotalCard = (
  {
    color,
    image,
    totalPrice,
    originalPrice,
    discountPrice
  }: {
    color: string;
    image: StaticImageData;
    totalPrice: string;
    originalPrice: string;
    discountPrice: string;
  }) => {

  const { t } = useTranslation();
  const router = useRouter();
  const { lang } = useLang();

  const tinycolorColor = tinycolor(color);
  const hoverColor = tinycolorColor.darken(7).toHexString();
  const textColor = tinycolorColor.isDark() ? "#fff" : "#000";

  return (
    <div className="w-full flex flex-col items-center justify-center text-center p-10">
      <Image
        src={image}
        alt="Product"
        className="w-[60%] object-contain mt-5"
      // priority
      />
      <div className="w-full text-center mt-5 bg-linear-270 from-[#51FFAE] to-[#6DB19E] p-5 rounded-2xl">
        <p className="text-3xl font-semibold text-white bg-linear-270">
          {totalPrice} {t("common.sum")}
        </p>
        <p className="text-white text-lg font-semibold mt-2 line-through">
          {originalPrice} {t("common.sum")}
        </p>
        <p className="text-white text-lg font-semibold bg-[#F04F4F] rounded-2xl py-3 mt-5">{discountPrice} {t("common.sum")} {t("sale.saveFor")}</p>
      </div>
      <Button
        className="w-full text-lg py-7 rounded-2xl mt-5 cursor-pointer transition-all duration-300"
        style={{
          backgroundColor: color,
          color: textColor,
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.backgroundColor = hoverColor;
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.backgroundColor = color;
        }}
        onClick={() => {
          router.push(`/${lang}/product`);
        }}
        variant="default"
        size="lg"
      >
        {t("sale.button")}
      </Button>
    </div>
  )
}

export default SaleTotalCard;