"use client";

import React from "react";
import Container from "@/components/Container";
import Image from "next/image";
import { useTranslation } from "react-i18next";
import { productBgColors } from "@/types/records";
import PriceTable from "./components/PriceTable";
import SaleCard from "./components/SaleCard";
import SaleTotalCard from "./components/SaleTotalCard";
import SaleHeroImg from "@/assets/images/sale-page-hero-img.png";
import SaleCardImg1 from "@/assets/images/sale-total-card-img-1.png";
import SaleCardImg2 from "@/assets/images/sale-total-card-img-2.png";
import SaleCardImg3 from "@/assets/images/sale-total-card-img-3.png";
import StarIcon from "@/assets/images/star-icon.svg";
import ProductGreen from "@/assets/images/product-green.png";
import ProductRed from "@/assets/images/product-red.png";
import ProductOrange from "@/assets/images/product-orange.png";
import CheckedIcon from "@/assets/images/checked-icon.svg";
import { Button } from "@/components/ui/button";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";
import Script from "next/script";

const SalePageClient: React.FC = () => {
  const { t } = useTranslation();
  const color = productBgColors.Complex;
  const router = useRouter();

  const productsDataThree = [
    {
      title: t("sale.products_data.1.title"),
      image: SaleCardImg1,
      itemData: [
        {
          title: "Complex",
          discountPrice: "990 000",
          originalPrice: "1 170 000",
          productImage: ProductGreen,
        },
        {
          title: "Complex",
          discountPrice: "990 000",
          originalPrice: "1 170 000",
          productImage: ProductGreen,
        },
      ],
      totalPriceSection: {
        totalPrice: "1 980 000",
        originalPrice: "2 340 000",
        discountPrice: "360 000",
      },
    },
    {
      title: t("sale.products_data.2.title"),
      image: SaleCardImg2,
      itemData: [
        {
          title: "Complex",
          discountPrice: "640 000",
          originalPrice: "1 170 000",
          productImage: ProductGreen,
        },
        {
          title: "Complex Extra",
          discountPrice: "640 000",
          originalPrice: "1 170 000",
          productImage: ProductRed,
        },
        {
          title: "Gelmin Kids",
          discountPrice: "290 000",
          originalPrice: "490 000",
          productImage: ProductOrange,
        },
      ],
      totalPriceSection: {
        totalPrice: "1 570 000",
        originalPrice: "2 830 000",
        discountPrice: "1 260 000",
      },
    },
    {
      title: t("sale.products_data.3.title"),
      image: SaleCardImg3,
      itemData: [
        {
          title: `Complex 2 ${t("common.pcs")}`,
          discountPrice: "390 000",
          originalPrice: "1 170 000",
          productImage: ProductGreen,
        },
        {
          title: `Complex Extra 2 ${t("common.pcs")}`,
          discountPrice: "390 000",
          originalPrice: "1 170 000",
          productImage: ProductRed,
        },
        {
          title: "Gelmin Kids",
          discountPrice: "220 000",
          originalPrice: "490 000",
          productImage: ProductOrange,
        },
      ],
      totalPriceSection: {
        totalPrice: "2 460 000",
        originalPrice: "5 170 000",
        discountPrice: "2 710 000",
      },
    },
  ];

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: "Chegirmalar va paketlar — Nutva Pharm",
    url: "https://nutva.uz/sale",
    description:
      "Nutva Pharm chegirmalari: Complex, Complex Extra va Gelmin Kids bo‘yicha paketli takliflar.",
    isPartOf: { "@type": "WebSite", name: "Nutva Pharm", url: "https://nutva.uz" },
  };

  return (
    <>
      {/* JSON-LD (safe, short, non-spammy) */}
      <Script
        id="sale-jsonld"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <AnimatePresence mode="popLayout">
        <motion.div
          layout
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.3 }}
          className="w-full rounded-xl flex flex-col gap-4"
        >
          <Container className="pt-32 pb-25">
            <div className="flex max-md:flex-col items-center justify-between text-center">
              <div className="w-[55%] max-md:w-full flex flex-col items-center justify-center">
                <h1
                  className="text-6xl max-md:text-4xl font-bold mb-5"
                  style={{ color }}
                >
                  {t("sale.title")}
                </h1>
                <p className="text-3xl max-md:text-2xl" style={{ color }}>
                  {t("sale.subtitle")}
                </p>
              </div>

              <div className="w-[45%] max-md:w-[90%]">
                <Image src={SaleHeroImg} alt="Sale" className="w-full object-cover" />
              </div>
            </div>

            <PriceTable color={color} />

            <section
              className="w-full mx-auto my-10 rounded-2xl font-semibold p-15 text-white bg-[#0FB759AB] border-2"
              style={{ borderColor: color }}
            >
              <p className="text-2xl text-center mb-2">{t("sale.special_offers")}</p>
              <p className="text-2xl text-center mb-2">{t("sale.buy_more_save_more")}</p>
              <p className="text-2xl text-center flex items-center justify-center">
                <Image src={StarIcon} alt="Star" className="inline-block mr-2 size-7" />
                {t("sale.best_price_quality")}
                <Image src={StarIcon} alt="Star" className="inline-block ml-2 size-7" />
              </p>
            </section>

            <section className="w-full mx-auto mt-10">
              <h4 className="text-3xl font-bold text-center mb-5" style={{ color }}>
                {t("sale.discount_examples")}
              </h4>

              {productsDataThree.map((item, index) => (
                <div
                  key={index}
                  className="w-full mx-auto my-10 bg-white rounded-2xl shadow-lg border-2 overflow-hidden"
                  style={{ borderColor: color }}
                >
                  <li
                    className="text-xl font-bold bg-[#0FB759AB] px-5 py-7 text-white !list-disc"
                    style={{ color }}
                  >
                    {item.title}
                  </li>

                  <div className="grid gap-6 p-5 grid-cols-1 md:grid-cols-1 lg:grid-cols-1 xl:grid-cols-[60%_40%] items-center">
                    <div>
                      <h4 className="text-lg font-bold my-4" style={{ color }}>
                        {t("sale.table.products_label")}
                      </h4>
                      <div
                        className={`grid gap-6 ${
                          item.itemData.length >= 3
                            ? "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3"
                            : "grid-cols-1 sm:grid-cols-2"
                        }`}
                      >
                        {item.itemData.map((product, pIndex) => {
                          const productImage = () => {
                            switch (product.title) {
                              case "Complex":
                                return ProductGreen;
                              case "Complex Extra":
                                return ProductRed;
                              case "Gelmin Kids":
                                return ProductOrange;
                              case `Complex 1 ${t("common.pcs")}`:
                              case `Complex 2 ${t("common.pcs")}`:
                                return ProductGreen;
                              case `Complex Extra 1 ${t("common.pcs")}`:
                              case `Complex Extra 2 ${t("common.pcs")}`:
                                return ProductRed;
                              default:
                                return ProductGreen;
                            }
                          };
                          return (
                            <SaleCard
                              key={pIndex}
                              color={color}
                              img={productImage()}
                              title={product.title}
                              discountPrice={product.discountPrice}
                              originalPrice={product.originalPrice}
                            />
                          );
                        })}
                      </div>
                    </div>

                    <div className="w-full mt-10 md:mt-0 flex justify-center">
                      <SaleTotalCard
                        color={color}
                        image={item.image}
                        totalPrice={item.totalPriceSection.totalPrice}
                        originalPrice={item.totalPriceSection.originalPrice}
                        discountPrice={item.totalPriceSection.discountPrice}
                      />
                    </div>
                  </div>
                </div>
              ))}
            </section>

            <div
              className="w-full mx-auto my-15 bg-white rounded-2xl shadow-lg border-2 overflow-hidden"
              style={{ borderColor: color }}
            >
              <h2 className="text-xl font-bold bg-[#0FB759AB] text-center px-5 py-7 text-white">
                {t("sale.how_discounts_work")}
              </h2>

              <div className="flex flex-col lg:flex-row justify-center gap-7 p-7">
                <div className="flex items-center rounded-2xl p-5 bg-[#32BF6833]">
                  <Image src={CheckedIcon} alt="Checked icon" className="inline-block mr-4 size-6" />
                  <p className="text-lg font-semibold text-gray-700" style={{ color }}>
                    {t("sale.step_1")}
                  </p>
                </div>

                <div className="flex items-center rounded-2xl p-5 bg-[#32BF6833]">
                  <Image src={CheckedIcon} alt="Checked icon" className="inline-block mr-4 size-6" />
                  <p className="text-lg font-semibold text-gray-700" style={{ color }}>
                    {t("sale.step_2")}
                  </p>
                </div>

                <div className="flex items-center rounded-2xl p-5 bg-[#32BF6833]">
                  <Image src={CheckedIcon} alt="Checked icon" className="inline-block mr-4 size-6" />
                  <p className="text-lg font-semibold text-gray-700" style={{ color }}>
                    {t("sale.step_3")}
                  </p>
                </div>
              </div>
            </div>

            <div className="w-full mx-auto mt-12 bg-linear-270 text-white from-[#51FFAE] to-[#6DB19E] rounded-2xl shadow-lg p-10 text-center">
              <h3 className="text-3xl font-bold text-center mb-5">{t("sale.ready_for_discounts")}</h3>
              <p className="text-lg font-semibold text-center">{t("sale.limited_offers")}</p>
              <Button
                size="lg"
                className="mx-auto mt-10 bg-white text-[#339668] hover:text-white cursor-pointer p-5"
                onClick={() => router.push("/product")}
              >
                {t("sale.start_shopping")}
              </Button>
            </div>
          </Container>
        </motion.div>
      </AnimatePresence>
    </>
  );
};

export default SalePageClient;
