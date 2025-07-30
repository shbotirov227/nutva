"use client";

import { useState } from "react";
import { useTranslation } from "react-i18next";
import Image from "next/image";
import Head from "next/head";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import SaleSection from "@/containers/SaleSection";
import Container from "@/components/Container";
import BannerImg from "@/assets/images/bannerImg1.jpg";
import ProductImg from "@/assets/images/product-green.webp";
import ContactFormModal from "@/components/ContactForm";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { AnimatePresence, motion } from "framer-motion";

export default function AboutPage() {
  const [selectedFeature, setSelectedFeature] = useState(0);
  const [openFaq, setOpenFaq] = useState<string | undefined>(undefined);
  const { t } = useTranslation();

  const features = Array.from({ length: 4 }, (_, i) => ({
    title: t(`about.accordionQuestions.${i + 1}`),
    content: t(`about.accordionContent.${i + 1}`),
  }));

  return (
    <>
      <Head>
        <title>Biz haqimizda — Nutva Pharm</title>
        <meta
          name="description"
          content="Nutva Pharm kompaniyasining maqsadi, qadriyatlari va faoliyati haqida batafsil ma’lumot. Bizning biofaol qo‘shimchalarimiz salomatlikni mustahkamlaydi."
        />
        <link rel="canonical" href="https://nutva.uz/about-us" />
        <meta name="robots" content="index, follow" />
        <meta property="og:title" content="Biz haqimizda — Nutva Pharm" />
        <meta property="og:description" content="Nutva Pharm kompaniyasining maqsadi, qadriyatlari va faoliyati haqida batafsil ma’lumot." />
        <meta property="og:url" content="https://nutva.uz/about-us" />
        <meta property="og:type" content="website" />
        <meta property="og:image" content="https://nutva.uz/logo.png" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Biz haqimizda — Nutva Pharm" />
        <meta name="twitter:description" content="Biz kimligimiz, qadriyatlarimiz va ilmiy asoslangan yondashuvimiz haqida bilib oling." />
        <meta name="twitter:image" content="https://nutva.uz/logo.png" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "AboutPage",
              "name": "Biz haqimizda — Nutva Pharm",
              "description": "Nutva Pharm kompaniyasi haqida ma’lumot. Ilmiy asoslangan biofaol mahsulotlar ishlab chiqaruvchisi.",
              "url": "https://nutva.uz/about-us",
            }),
          }}
        />
      </Head>

      <section className="bg-[#BEE1B5] py-20 px-4">
        <Container>
          <div className="max-w-6xl mx-auto !mb-0">
            <div className="grid md:grid-cols-2 gap-10 items-center mb-14">
              <div>
                <h1 className="text-2xl md:text-3xl font-bold text-[#1A3929] mb-3 text-center md:text-left">
                  {t("aboutUs.title")}
                </h1>
                <p className="text-sm md:text-base text-[#1A3929] text-center md:text-left">
                  {t("aboutUs.subtitle")} <br />
                  <strong className="text-[20px] md:text-[24px]"></strong> {t("aboutBrand.text")}
                </p>
              </div>
              <div className="w-full h-auto rounded-lg overflow-hidden shadow-md">
                <Image
                  src={BannerImg}
                  alt="Nutva Pharm promo banner"
                  width={800}
                  height={500}
                  className="w-full h-auto object-cover"
                />
              </div>
            </div>

            <div className="text-center mb-14">
              <ContactFormModal>
                <Button className="w-full md:w-[634px] h-[58px] bg-[#267A41] hover:bg-[#1F6335] text-white px-6 py-3 rounded-xl text-lg md:text-2xl cursor-pointer">
                  {t("button.freeConsultation")}
                </Button>
              </ContactFormModal>
            </div>

            <div className="grid gap-10 items-center flex-col">
              <div>
                <Image
                  src={BannerImg}
                  alt="Nutva Pharm haqida rasm"
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

          <div className="max-w-6xl mx-auto mt-[120px] px-4 md:px-6">
            <div className="mb-20">
              <p className="text-xs md:text-sm uppercase tracking-widest text-[#1A3929] text-center md:text-left">
                {t("about.features")}
              </p>
              <h2 className="text-xl md:text-2xl font-semibold text-[#1A3929] mb-10 text-center md:text-left">
                {t("about.whyChoose")}
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-start">
                <div className="relative space-y-4">
                  <div
                    className="absolute left-0 w-[4px] h-6 bg-[#1A3929] rounded transition-all duration-300"
                    style={{ top: `${selectedFeature * 2.5}rem` }}
                  />
                  {features.map((feature, index) => {
                    const isActive = selectedFeature === index;
                    return (
                      <button
                        key={index}
                        onClick={() => setSelectedFeature(index)}
                        className={cn(
                          "pl-4 relative w-full text-left text-[#1A3929] text-sm md:text-base cursor-pointer transition-all duration-150 ease-in-out",
                          isActive ? "font-bold scale-105 ml-1" : "font-normal scale-100"
                        )}
                      >
                        {feature.title}
                      </button>
                    );
                  })}
                </div>
                <div className="md:col-span-2 text-[#1A3929]">
                  <AnimatePresence mode="wait">
                    <motion.div
                      key={selectedFeature}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      transition={{ duration: 0.3 }}
                    >
                      <h3 className="text-lg md:text-xl font-semibold mb-2">
                        {features[selectedFeature].title}
                      </h3>
                      <p className="text-sm md:text-base">{features[selectedFeature].content}</p>
                      <div className="mt-6">
                        <Image
                          src={ProductImg}
                          alt="Nutva mahsuloti"
                          width={400}
                          height={300}
                          className="rounded-lg drop-shadow-[0_4px_4px_rgba(0,0,0,0.25)] w-60 h-auto object-contain"
                        />
                      </div>
                    </motion.div>
                  </AnimatePresence>
                </div>
              </div>
            </div>

            <h2 className="text-xl md:text-2xl font-bold text-[#1A3929] text-center mb-10">
              {t("about.faqTitle")}
            </h2>

            <div className="grid gap-4 md:grid-cols-2">
              {Array.from({ length: 10 }).map((_, index) => {
                const itemValue = `item-${index}`;
                return (
                  <Accordion
                    type="single"
                    collapsible
                    value={openFaq}
                    onValueChange={(val) => setOpenFaq(val as string | undefined)}
                    className="w-full"
                    key={itemValue}
                  >
                    <AccordionItem value={itemValue} className="bg-white rounded-lg shadow-sm">
                      <AccordionTrigger className="text-left bg-[#267A41] hover:bg-[#1F6335] text-white px-4 py-4 md:py-6 text-sm md:text-base cursor-pointer">
                        {t(`about.faq.title.${index + 1}`)}
                      </AccordionTrigger>
                      <AccordionContent className="text-[#1A3929] p-6 text-sm md:text-base">
                        {t(`about.faq.content.${index + 1}`)}
                      </AccordionContent>
                    </AccordionItem>
                  </Accordion>
                );
              })}
            </div>
          </div>
        </Container>
        <SaleSection />
      </section>
    </>
  );
}
