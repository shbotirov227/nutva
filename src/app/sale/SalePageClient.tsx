"use client";

import React, { useMemo } from "react";
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
import { useLang } from "@/context/LangContext";
import { useDiscount } from "@/hooks/useDiscount";
import { ProductName } from "@/types/enums";

const SalePageClient: React.FC = () => {
  const { t } = useTranslation();
  const color = productBgColors.Complex;
  const router = useRouter();
  const { lang } = useLang();

  // const productsDataThree = [
  //   {
  //     title: t("sale.products_data.1.title"),
  //     image: SaleCardImg1,
  //     itemData: [
  //       {
  //         title: "Complex",
  //         discountPrice: "990 000",
  //         originalPrice: "1 170 000",
  //         productImage: ProductGreen,
  //       },
  //       {
  //         title: "Complex",
  //         discountPrice: "990 000",
  //         originalPrice: "1 170 000",
  //         productImage: ProductGreen,
  //       },
  //     ],
  //     totalPriceSection: {
  //       totalPrice: "1 980 000",
  //       originalPrice: "2 340 000",
  //       discountPrice: "360 000",
  //     },
  //   },
  //   {
  //     title: t("sale.products_data.2.title"),
  //     image: SaleCardImg2,
  //     itemData: [
  //       {
  //         title: "Complex",
  //         discountPrice: "640 000",
  //         originalPrice: "1 170 000",
  //         productImage: ProductGreen,
  //       },
  //       {
  //         title: "Complex Extra",
  //         discountPrice: "640 000",
  //         originalPrice: "1 170 000",
  //         productImage: ProductRed,
  //       },
  //       {
  //         title: "Gelmin Kids",
  //         discountPrice: "290 000",
  //         originalPrice: "490 000",
  //         productImage: ProductOrange,
  //       },
  //     ],
  //     totalPriceSection: {
  //       totalPrice: "1 570 000",
  //       originalPrice: "2 830 000",
  //       discountPrice: "1 260 000",
  //     },
  //   },
  //   {
  //     title: t("sale.products_data.3.title"),
  //     image: SaleCardImg3,
  //     itemData: [
  //       {
  //         title: `Complex 2 ${t("common.pcs")}`,
  //         discountPrice: "560 000",
  //         originalPrice: "1 170 000",
  //         productImage: ProductGreen,
  //       },
  //       {
  //         title: `Complex Extra 2 ${t("common.pcs")}`,
  //         discountPrice: "560 000",
  //         originalPrice: "1 170 000",
  //         productImage: ProductRed,
  //       },
  //       {
  //         title: "Gelmin Kids",
  //         discountPrice: "220 000",
  //         originalPrice: "490 000",
  //         productImage: ProductOrange,
  //       },
  //     ],
  //     totalPriceSection: {
  //       totalPrice: "2 460 000",
  //       originalPrice: "5 170 000",
  //       discountPrice: "2 710 000",
  //     },
  //   },
  // ];


const complex1 = useDiscount(ProductName.COMPLEX, 1);
  const complex2 = useDiscount(ProductName.COMPLEX, 2);
  const complex3 = useDiscount(ProductName.COMPLEX, 3);
  const complex5 = useDiscount(ProductName.COMPLEX, 5);

  const extra1 = useDiscount(ProductName.COMPLEX_EXTRA, 1);
  const extra3 = useDiscount(ProductName.COMPLEX_EXTRA, 3);
  const extra5 = useDiscount(ProductName.COMPLEX_EXTRA, 5);

  const gelmin1 = useDiscount(ProductName.GELMIN_KIDS, 1);
  const gelmin3 = useDiscount(ProductName.GELMIN_KIDS, 3);
  const gelmin5 = useDiscount(ProductName.GELMIN_KIDS, 5);

  const productsDataThree = useMemo(() => {
    const fmt = (n: number) => n.toLocaleString("uz-UZ");

    return [
      {
        title: t("sale.products_data.1.title"),
        image: SaleCardImg1,
        itemData: [
          {
            title: "Complex",
            discountPrice: fmt(complex2.pricePerUnit),
            originalPrice: fmt(complex1.basePrice),
            productImage: ProductGreen,
          },
          {
            title: "Complex",
            discountPrice: fmt(complex2.pricePerUnit),
            originalPrice: fmt(complex1.basePrice),
            productImage: ProductGreen,
          },
        ],
        totalPriceSection: {
          totalPrice: fmt(complex2.totalPrice),
          originalPrice: fmt(complex1.basePrice * 2),
          discountPrice: fmt((complex1.basePrice * 2) - complex2.totalPrice),
        },
      },

      {
        title: t("sale.products_data.2.title"),
        image: SaleCardImg2,
        itemData: [
          {
            title: "Complex",
            discountPrice: fmt(complex3.pricePerUnit),
            originalPrice: fmt(complex1.basePrice),
            productImage: ProductGreen,
          },
          {
            title: "Complex Extra",
            discountPrice: fmt(extra3.pricePerUnit),
            originalPrice: fmt(extra1.basePrice),
            productImage: ProductRed,
          },
          {
            title: "Gelmin Kids",
            discountPrice: fmt(gelmin3.pricePerUnit),
            originalPrice: fmt(gelmin1.basePrice),
            productImage: ProductOrange,
          },
        ],
        totalPriceSection: {
          totalPrice: fmt(
            complex3.pricePerUnit + extra3.pricePerUnit + gelmin3.pricePerUnit
          ),
          originalPrice: fmt(
            complex1.basePrice + extra1.basePrice + gelmin1.basePrice
          ),
          discountPrice: fmt(
            (complex1.basePrice + extra1.basePrice + gelmin1.basePrice) -
            (complex3.pricePerUnit + extra3.pricePerUnit + gelmin3.pricePerUnit)
          ),
        },
      },

      {
        title: t("sale.products_data.3.title"),
        image: SaleCardImg3,
        itemData: [
          {
            title: `Complex 2 ${t("common.pcs")}`,
            discountPrice: fmt(complex5.pricePerUnit),
            originalPrice: fmt(complex1.basePrice),
            productImage: ProductGreen,
          },
          {
            title: `Complex Extra 2 ${t("common.pcs")}`,
            discountPrice: fmt(extra5.pricePerUnit),
            originalPrice: fmt(extra1.basePrice),
            productImage: ProductRed,
          },
          {
            title: "Gelmin Kids",
            discountPrice: fmt(gelmin5.pricePerUnit),
            originalPrice: fmt(gelmin1.basePrice),
            productImage: ProductOrange,
          },
        ],
        totalPriceSection: {
          totalPrice: fmt(
            complex5.pricePerUnit + extra5.pricePerUnit + gelmin5.pricePerUnit
          ),
          originalPrice: fmt(
            complex1.basePrice + extra1.basePrice + gelmin1.basePrice
          ),
          discountPrice: fmt(
            (complex1.basePrice + extra1.basePrice + gelmin1.basePrice) -
            (complex5.pricePerUnit + extra5.pricePerUnit + gelmin5.pricePerUnit)
          ),
        },
      },
    ];
  }, [
    t,
    complex1,
    complex2,
    complex3,
    complex5,
    extra1,
    extra3,
    extra5,
    gelmin1,
    gelmin3,
    gelmin5,
  ]);


  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: "Chegirmalar va paketlar — Nutva Pharm",
    url: "https://nutva.uz/sale",
    description:
      "Nutva Pharm chegirmalari: Complex, Complex Extra va Gelmin Kids bo‘yicha paketli takliflar.",
    isPartOf: { "@type": "WebSite", name: "Nutva Pharm", url: "https://nutva.uz" },
  };

  // Helper to map a product title to its image (centralized logic)
  const imageForTitle = (title: string) => {
    switch (true) {
      case title.startsWith("Complex Extra"):
        return ProductRed;
      case title.startsWith("Complex"):
        return ProductGreen;
      case title.startsWith("Gelmin Kids"):
        return ProductOrange;
      default:
        return ProductGreen;
    }
  };

  // Detect multi-quantity titles (e.g., "Complex 2 pcs") to show per-unit badge
  const isMultiQtyTitle = (title: string) => {
    const pcs = t("common.pcs");
    return title.includes(` 2 ${pcs}`); // We only flag the 2x bundle per request
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
          style={{ backgroundColor: '#DCFCE8', minHeight: '100vh' }}
        >
          <Container className="pt-32 pb-25">
            <div className="flex max-md:flex-col items-center justify-between text-center">
              <div className="w-[55%] max-md:w-full flex flex-col items-center justify-center">
                <h1
                  className="text-6xl max-md:text-4xl font-bold mb-5 text-emerald-900"
                >
                  {t("sale.title")}
                </h1>
                <p className="text-3xl max-md:text-2xl text-emerald-700/80">
                  {t("sale.subtitle")}
                </p>
              </div>

              <div className="w-[45%] max-md:w-[90%]">
                <Image src={SaleHeroImg} alt="Sale" className="w-full object-cover" />
              </div>
            </div>

            <PriceTable color={color} />

            <section
              className="w-full mx-auto my-10 rounded-2xl font-semibold p-15 text-white bg-white border-2 shadow-lg"
              style={{ borderColor: color, background: 'linear-gradient(135deg, #10b981, #059669)' }}
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
              <h4 className="text-3xl font-bold text-center mb-5 text-emerald-900">
                {t("sale.discount_examples")}
              </h4>

              {productsDataThree.map((item, index) => (
                <div
                  key={index}
                  className="w-full mx-auto my-10 bg-white rounded-2xl shadow-lg border border-green-200 overflow-hidden"
                >
                  <li
                    className="text-xl font-bold px-5 py-7 text-white !list-disc"
                    style={{ background: 'linear-gradient(135deg, #10b981, #059669)' }}
                  >
                    {item.title}
                  </li>

                  <div className="grid gap-6 p-5 grid-cols-1 md:grid-cols-1 lg:grid-cols-1 xl:grid-cols-[60%_40%] items-center">
                    <div>
                      <h4 className="text-lg font-bold my-4 text-emerald-900">
                        {t("sale.table.products_label")}
                      </h4>
                      <div
                        className={`grid gap-6 ${
                          item.itemData.length >= 3
                            ? "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3"
                            : "grid-cols-1 sm:grid-cols-2"
                        }`}
                      >
                        {item.itemData.map((product, pIndex) => (
                          <div key={pIndex} className="relative">
                            <SaleCard
                              color={color}
                              img={imageForTitle(product.title)}
                              title={product.title}
                              discountPrice={product.discountPrice}
                              originalPrice={product.originalPrice}
                            />
                            {isMultiQtyTitle(product.title) && (
                              <span
                                className="absolute top-2 right-2 rounded-full bg-white/90 border px-2 py-1 text-[11px] font-semibold text-gray-700 shadow-sm"
                                title={t("sale.price_per_unit_tooltip")}
                              >
                                {t("sale.price_per_unit_badge")}
                              </span>
                            )}
                          </div>
                        ))}
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
              className="w-full mx-auto my-15 bg-white rounded-2xl shadow-lg border border-green-200 overflow-hidden"
            >
              <h2 
                className="text-xl font-bold text-center px-5 py-7 text-white"
                style={{ background: 'linear-gradient(135deg, #10b981, #059669)' }}
              >
                {t("sale.how_discounts_work")}
              </h2>

              <div className="flex flex-col lg:flex-row justify-center gap-7 p-7">
                <div className="flex items-center rounded-2xl p-5 bg-white shadow-md border border-green-100">
                  <Image src={CheckedIcon} alt="Checked icon" className="inline-block mr-4 size-6" />
                  <p className="text-lg font-semibold text-emerald-900">
                    {t("sale.step_1")}
                  </p>
                </div>

                <div className="flex items-center rounded-2xl p-5 bg-white shadow-md border border-green-100">
                  <Image src={CheckedIcon} alt="Checked icon" className="inline-block mr-4 size-6" />
                  <p className="text-lg font-semibold text-emerald-900">
                    {t("sale.step_2")}
                  </p>
                </div>

                <div className="flex items-center rounded-2xl p-5 bg-white shadow-md border border-green-100">
                  <Image src={CheckedIcon} alt="Checked icon" className="inline-block mr-4 size-6" />
                  <p className="text-lg font-semibold text-emerald-900">
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
                className="mx-auto mt-10 bg-white text-emerald-900 hover:bg-emerald-50 hover:text-emerald-900 cursor-pointer p-5 transition-colors border border-emerald-200"
                onClick={() => router.push(`/${lang}/product`)}
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
