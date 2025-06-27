import React from "react";
import Image from "next/image";
import { Button } from "../components/ui/button";
import Container from "../components/Container";
import BgImage from "@/assets/images/carousel-bg-orange.webp";
import DefaultImg from "@/assets/images/default-img.png";
import { useTranslation } from "react-i18next";

export default function AboutBrandSection() {

  const { t } = useTranslation();

  return (
    <div
      className="py-16 bg-cover bg-center"
      style={{
        backgroundImage: `url(${BgImage.src})`,
      }}
    >
      <Container className="flex flex-col md:flex-row-reverse items-center justify-center">
        <div className="w-full flex flex-col md:flex-row-reverse items-center justify-between bg-white rounded-xl shadow-[10px_10px_10px_rgba(0,0,0,0.1)] py-8 px-6 md:px-10 gap-8">

          {/* Image On Top in Mobile, On Right in Desktop */}
          <div className="w-full md:w-[40%] relative h-[250px] md:h-[300px]">
            <Image
              src={DefaultImg}
              alt="About Brand"
              fill
              className="object-cover rounded-xl"
              priority
            />
          </div>

          {/* Text - Left in Desktop, Below in Mobile */}
          <div className="w-full md:w-[60%]">
            <h2 className="text-3xl font-bold text-[#3F3F46] mb-4">
              {t("aboutBrand.title")}
            </h2>
            <p className="text-base text-[#3F3F46] leading-relaxed mb-6">
              Corem ipsum dolor sit amet, consectetur adipiscing elit. Nunc vulputate libero et velit interdum, ac aliquet odio mattis. Class aptent taciti sociosqu ad litora torquent per conubia nostra, per inceptos himenaeos. Curabitur tempus urna at turpis condimentum lobortis. Ut commodo efficitur neque. Corem ipsum dolor sit amet, consectetur adipiscing elit. Nunc vulputate libero et velit interdum, ac aliquet odio mattis. Class aptent taciti sociosqu ad litora torquent per conubia nostra, per inceptos himenaeos. Corem ipsum dolor sit amet, consectetur adipiscing elit. Nunc vulputate libero et velit interdum, ac aliquet odio mattis. Class aptent taciti sociosqu ad litora torquent per conubia nostra, per inceptos himenaeos. Curabitur tempus urna at turpis condimentum lobortis. Ut commodo efficitur neque. Corem ipsum dolor sit amet, consectetur adipiscing elit. Nunc vulputate libero et velit interdum, ac aliquet odio mattis. Class aptent taciti sociosqu ad litora torquent per conubia nostra, per inceptos himenaeos.
            </p>
            <Button
              className="bg-[#218A4F] hover:bg-[#365343] text-white text-md"
              variant="default"
              size="lg"
            >
              Подробнее
            </Button>
          </div>
        </div>
      </Container>
    </div>
  );
}
