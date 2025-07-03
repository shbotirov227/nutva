import React from "react";
import Image from "next/image";
import Container from "../components/Container";
import BgImage from "@/assets/images/carousel-bg-orange.webp";
import DefaultImg from "@/assets/images/default-img.png";
import AboutBrandImg from "@/assets/images/about-brand-img.jpg";
import { useTranslation } from "react-i18next";
import Link from "next/link";

export default function AboutBrandSection() {

  const { t } = useTranslation();

  return (
    <div
      className="py-16 bg-cover bg-center"
      style={{
        backgroundImage: `url(${BgImage.src})`,
      }}
    >
      <Container className="flex flex-col lg:flex-row-reverse items-center justify-center">
        <div className="w-full flex flex-col lg:flex-row-reverse items-center justify-between bg-white rounded-xl shadow-[10px_10px_10px_rgba(0,0,0,0.1)] py-8 px-6 md:px-10 gap-8">

          <div className="w-full lg:w-[40%] relative h-[250px] lg:h-[300px]">
            <Image
              src={AboutBrandImg || DefaultImg}
              alt="About Brand"
              fill
              className="object-cover rounded-xl"
              priority
            />
          </div>

          <div className="w-full lg:w-[60%]">
            <h2 className="text-3xl font-bold text-[#3F3F46] mb-4">
              {t("aboutBrand.title")}
            </h2>
            <p className="text-base text-[#3F3F46] leading-relaxed mb-6">
              {t("aboutBrand.text")}
            </p>
            <Link
              href="/about-us"
              className="bg-[#218A4F] hover:bg-[#365343] text-white text-md px-6 py-2 rounded-md"
            >
              {t("common.more")}
            </Link>
          </div>
        </div>
      </Container>
    </div>
  );
}
