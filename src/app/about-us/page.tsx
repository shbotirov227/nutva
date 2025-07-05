"use client";

import { useState } from "react";
import { useTranslation } from "react-i18next";
import Image from "next/image";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import SaleSection from "@/containers/SaleSection";
import Container from "@/components/Container";
import BannerImg from "@/assets/images/bannerImg1.jpg";
import ProductImg from "@/assets/images/product-green.webp";
import ContactFormModal from "@/components/ContactForm";

const features = [
  {
    title: "Стратегические Формулы",
    content:
      "NUTVA Complex находится в авангарде инновационных натуральных добавок, которые способствуют укреплению здоровья и благополучия благодаря тщательно сбалансированным формулам...",
  },
  {
    title: "Международное Сотрудничество",
    content:
      "Мы сотрудничаем с ведущими мировыми производителями и научными центрами, что позволяет нам обеспечивать высокое качество и эффективность продукции...",
  },
  {
    title: "Ответственность за Устойчивое Развитие",
    content:
      "NUTVA придерживается принципов устойчивого развития, минимизируя воздействие на окружающую среду и поддерживая экологические инициативы...",
  },
  {
    title: "Инновационный Подход",
    content:
      "Наши продукты создаются на основе последних научных исследований и современных технологий...",
  },
  {
    title: "Вклад в Общество",
    content:
      "Мы активно участвуем в социальных проектах, направленных на улучшение здоровья и качества жизни населения...",
  },
];

const faqs = [
  {
    question: "часто задаваемые вопросы",
    answer: "Ответ на часто задаваемый вопрос номер один...",
  },
  {
    question: "часто задаваемые вопросы",
    answer: "Ответ на часто задаваемый вопрос номер два...",
  },
  {
    question: "часто задаваемые вопросы",
    answer: "Ответ на часто задаваемый вопрос номер три...",
  },
  {
    question: "часто задаваемые вопросы",
    answer: "Ответ на часто задаваемый вопрос номер четыре...",
  },
];

export default function AboutPage() {

  const [selectedFeature, setSelectedFeature] = useState(0);
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const { t } = useTranslation();

  return (
    <section className="bg-[#BEE1B5] py-20 px-4">
      <Container>
        <div className="max-w-6xl mx-auto">

          <div className="grid md:grid-cols-2 gap-10 items-center mb-14">
            <div>
              <h2 className="text-[20px] md:text-[24px] font-semibold text-[#1A3929] mb-2 text-center md:text-left">
                {t("aboutUs.title")}
              </h2>
              <p className="text-sm md:text-base text-[#1A3929] text-center md:text-left">
                {t("aboutUs.subtitle")} <br />
                <strong className="text-[20px] md:text-[24px]"></strong> {t("aboutBrand.text")}
              </p>
            </div>
            <div className="w-full h-auto rounded-lg overflow-hidden shadow-md">
              <Image
                src={BannerImg}
                alt="Promo Image"
                width={800}
                height={500}
                className="w-full h-auto object-cover"
              />
            </div>
          </div>

          <div className="text-center mb-14">
            <ContactFormModal>
              <Button className="w-full md:w-[634px] h-[58px] bg-[#267A41] hover:bg-[#1F6335] text-white px-6 py-3 rounded-full text-lg md:text-2xl cursor-pointer">
                {t("button.freeConsultation")}
              </Button>
            </ContactFormModal>
          </div>

          <div className="grid gap-10 items-center flex-col">
            <div>
              <Image
                src={BannerImg}
                alt="About section image"
                width={800}
                height={500}
                className="h-auto object-cover rounded-lg shadow-md m-auto"
              />
            </div>
            <div className="text-center px-2 md:px-0">
              <h2 className="text-[24px] md:text-[36px] font-semibold text-[#1A3929] mb-2">
                {t("aboutUs.title")}
              </h2>
              <p className="text-sm md:text-base text-[#1A3929]">
                {t("aboutUs.subtitle")} <br /> <strong></strong> {t("aboutBrand.text")}
              </p>
            </div>
          </div>
        </div>

        <div className="max-w-6xl mx-auto mt-30 px-4 md:px-6">
          <div className="mb-20">
            <p className="text-xs md:text-sm uppercase tracking-widest text-[#1A3929] text-center md:text-left">
              ОСОБЕННОСТИ
            </p>
            <h2 className="text-xl md:text-2xl font-semibold text-[#1A3929] mb-10 text-center md:text-left">
              ПОЧЕМУ ВЫБИРАЮТ NUTVA
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-start">
              <div className="space-y-4">
                {features.map((feature, index) => (
                  <button
                    key={index}
                    onClick={() => setSelectedFeature(index)}
                    className={cn(
                      "text-left w-full text-[#1A3929] text-sm md:text-base font-medium",
                      selectedFeature === index && "font-bold border-l-4 border-[#1A3929] pl-2"
                    )}
                  >
                    {feature.title}
                  </button>
                ))}
              </div>
              <div className="md:col-span-2 text-[#1A3929]">
                <h3 className="text-lg md:text-xl font-semibold mb-2">
                  {features[selectedFeature].title}
                </h3>
                <p className="text-sm md:text-base">
                  {features[selectedFeature].content}
                </p>
                <div className="mt-6">
                  <Image
                    src={ProductImg}
                    alt="placeholder"
                    width={400}
                    height={300}
                    className="rounded-lg drop-shadow-[0_4px_4px_rgba(0,0,0,0.25)] w-60 h-auto object-contain"
                  />
                </div>
              </div>
            </div>
          </div>

          <h2 className="text-xl md:text-2xl font-bold text-[#1A3929] text-center mb-10">
            Часто задаваемые вопросы
          </h2>
          <div className="grid gap-6 grid-cols-1 md:grid-cols-2">
            {faqs.map((faq, index) => (
              <div key={index}>
                <Button
                  onClick={() => setOpenFaq(openFaq === index ? null : index)}
                  className="w-full bg-[#267A41] hover:bg-[#1F6335] text-white text-left py-4 md:py-6 px-4 text-sm md:text-base"
                >
                  <div className="flex items-center justify-between">
                    {faq.question}
                    <span className="ml-4">
                      {openFaq === index ? "˄" : "˅"}
                    </span>
                  </div>
                </Button>
                {openFaq === index && (
                  <div className="mt-2 p-4 bg-white rounded shadow text-[#1A3929] text-sm md:text-base">
                    {faq.answer}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </Container>
      <SaleSection />
    </section>
  );
}
