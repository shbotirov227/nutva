"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { useQuery } from "@tanstack/react-query";
import { apiClient } from "@/lib/apiClient";
import Container from "@/components/Container";
import { useProductVisuals } from "@/hooks/useProductVisuals";
import { ProductName } from "@/types/enums";
import ProductPriceCard from "@/components/ProductPriceCard";
import { useLang } from "@/context/LangContext";
import { useTranslation } from "react-i18next";
import clsx from "clsx";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import ProductsComponent from "@/containers/Products";
import SaleSection from "@/containers/SaleSection";
import ProductImage from "@/assets/images/product-green.png";
import DefaultVideoImg from "@/assets/images/reviewcard-img.png";
import CertificateImg1 from "@/assets/images/certificate-img1.png";
import CertificateImg2 from "@/assets/images/certificate_1748945174-1.png";
import CertificateImg3 from "@/assets/images/certificate_1748945174-2.png";
import CertificateImg4 from "@/assets/images/certificate_1748945174-3.png";
import CertificateImg5 from "@/assets/images/certificate_1748945174-4.png";
import CertificateImg6 from "@/assets/images/certificate_1748945174-5.png";
import ProductDetailSkeleton from "@/components/ProductDetailSkleton";
import type { GetOneProductType } from "@/types/products/getOneProduct";
import { AnimatePresence, LayoutGroup, motion } from "framer-motion";
import { getProductKeyFromName } from "@/helper/getProductKeyFromName";
import { getProductDetailMiddleImage } from "@/helper/getProductDetailMiddleImage";
import YouTubeEmbed from "@/components/YouTubeEmbed";
import { getProductMedia } from "@/helper/getProductMedia";
import { useCart } from "@/context/CartContext";
import { CountdownTimer } from "@/components/CountDownTimer";

const certificateImages = [
  CertificateImg1,
  CertificateImg2,
  CertificateImg3,
  CertificateImg4,
  CertificateImg5,
  CertificateImg6,
];

type Props = {
  id: string;
  initialProduct: GetOneProductType;
  initialLang: "uz" | "ru" | "en";
};

export default function ProductDetailClient({ id, initialProduct, initialLang }: Props) {
  const [activeTab, setActiveTab] = useState("1");
  const { lang } = useLang();
  const { t } = useTranslation();
  useCart();

  const {
    data: product,
    isLoading,
    refetch,
  } = useQuery<GetOneProductType, Error, GetOneProductType, [string, string, string]>({
    queryKey: ["product", id, lang],
    queryFn: () => apiClient.getOneProductById(id, lang),
    // v5: placeholderData — SSR natijasini darhol ko‘rsatadi, keyin fresh bilan almashtiradi
    placeholderData: initialProduct,
    staleTime: 0,
    gcTime: 5 * 60 * 1000,
    refetchOnMount: "always",
    refetchOnWindowFocus: false,
    enabled: Boolean(id && lang),
  });

  useEffect(() => {
    if (initialLang !== lang) refetch();
  }, [lang, initialLang, refetch]);

  useEffect(() => {
    if (id) {
      apiClient.postProductView(id).catch((err) => {
        console.error("View count post error:", err);
      });
    }
  }, [id]);

  const { color, bgDetailImage, bgColor } = useProductVisuals(
    product?.name as ProductName,
    { includeBgColor: true, includeBgImage: true }
  );

  const productKey = getProductKeyFromName(product?.name || "");
  const middleImage = product ? getProductDetailMiddleImage(product) : undefined;
  const { youtubelink, image } = getProductMedia(product?.name as ProductName);

  if (isLoading || !product) {
    return <ProductDetailSkeleton />;
  }

  const handleBuyClick = async () => apiClient.postBuyProduct(id);

  return (
    <div className="relative pt-32 overflow-hidden">
      <div className="absolute inset-0 -z-20" style={{ backgroundColor: bgColor }} />
      <div
        className="absolute inset-0 -z-10 object-cover bg-top bg-no-repeat"
        style={{ backgroundImage: `url(${bgDetailImage})` }}
      />

      <div className="relative z-10">
        <Container>
          <AnimatePresence mode="popLayout">
            <LayoutGroup id={`product-detail-${product.id}`}>
              <motion.div
                layout
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.3, layout: { duration: 0.25 } }}
                className="w-full rounded-xl flex flex-col gap-4"
              >
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center mb-8">
                  <motion.div layout layoutId={`product-image-${product.id}`} className="w-full">
                    <Image
                      src={product?.imageUrls?.[0] || ProductImage}
                      alt={product?.name || "Product Image"}
                      width={500}
                      height={500}
                      priority
                      className="w-full h-auto max-w-full object-contain rounded-2xl"
                    />
                  </motion.div>

                  <motion.div layout layoutId={`price-card-${product.id}`} className="w-full">
                    <ProductPriceCard
                      product={product}
                      color={color}
                      bgColor={bgColor}
                      onClick={handleBuyClick}
                    />
                  </motion.div>
                </div>
              </motion.div>
            </LayoutGroup>
          </AnimatePresence>

          <div className="space-y-4">
            <CountdownTimer
              storageKey={`countdown:product:${id}`}
              resetDurationMs={24 * 60 * 60 * 1000}
              color={color}
              bgColor={bgColor}
              products={[{ productId: product.id, quantity: 1 }]}
              discountPercentage={15}
              title="Chegirma tugashiga"
              subtitle="Bugun xarid qilganlar uchun"
            />
          </div>

          <Tabs defaultValue={activeTab} onValueChange={setActiveTab} className="my-10">
            <TabsList className="grid grid-cols-4 max-[450px]:grid-cols-3 max-[350px]:grid-cols-2 mb-5 justify-center gap-4 bg-transparent">
              {(product?.name === ProductName.GELMIN_KIDS ? ["1", "5", "4"] : ["1", "4"]).map((tab) => (
                <TabsTrigger
                  key={`tab-${tab}-${lang}`}
                  value={tab}
                  asChild
                  className={clsx(
                    "cursor-pointer shadow-md px-4 py-2 max-[450px]:px-2 max-[450px]:py-1 rounded-lg",
                    activeTab === tab ? "!bg-black text-white" : ""
                  )}
                >
                  <Button
                    size="lg"
                    variant={activeTab === tab ? "default" : "outline"}
                    className="w-full sm:w-auto text-sm sm:text-base font-semibold"
                  >
                    {t(`product.tab.${tab}`)}
                  </Button>
                </TabsTrigger>
              ))}
            </TabsList>

            <AnimatePresence mode="wait">
              <motion.div
                layout
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.3 }}
                className="w-full rounded-xl flex flex-col gap-4"
              >
                <Container>
                  <TabsContent value="1">
                    <ul className="space-y-4 my-12 list-disc grid grid-cols-1 md:grid-cols-2 gap-4 gap-x-18">
                      {productKey &&
                        Object.entries(
                          // i18next object returns
                          (t(`products.${productKey}.tab.1`, { returnObjects: true }) as Record<string, string>) || {}
                        ).flatMap(([key, value]) => {
                          if (typeof value !== "string") return [];
                          const parts = value
                            .split("•")
                            .map((item) => item.trim())
                            .filter((item) => item.length > 0);

                          return parts.map((part, index) => {
                            if (index === 0) {
                              return (
                                <li key={`${key}-${index}`} className="text-base font-semibold">
                                  {part}
                                </li>
                              );
                            }
                            const dashIndex = part.indexOf("–");
                            if (dashIndex > -1) {
                              const beforeDash = part.slice(0, dashIndex + 1).trim();
                              const afterDash = part.slice(dashIndex + 1).trim();
                              return (
                                <li key={`${key}-${index}`} className="text-base font-semibold">
                                  {beforeDash}
                                  <br />
                                  {afterDash}
                                </li>
                              );
                            }
                            return (
                              <li key={`${key}-${index}`} className="text-base font-semibold">
                                {part}
                              </li>
                            );
                          });
                        })}
                    </ul>

                    <div className="mt-10 w-full flex justify-center">
                      <Image
                        src={middleImage || DefaultVideoImg}
                        alt="Product Image"
                        width={500}
                        height={500}
                        className="w-[600px] rounded-xl h-auto"
                      />
                    </div>

                    <div className="mt-10">
                      {(() => {
                        const keyRoot = getProductKeyFromName(product?.name);
                        const allowedKeys = [
                          ProductName.GELMIN_KIDS,
                          ProductName.COMPLEX,
                          ProductName.COMPLEX_EXTRA,
                          ProductName.FERTILIA_WOMEN,
                          ProductName.VIRIS_MEN,
                        ];
                        const isCustomAdditional = allowedKeys.includes(product?.name as ProductName);
                        const baseKey =
                          isCustomAdditional && keyRoot
                            ? `products.additional.${keyRoot}`
                            : "products.additional";

                        return (
                          <>
                            <h4 className="text-lg font-semibold mb-6">
                              {t(`${baseKey}.title`)}
                            </h4>

                            <ul className="space-y-3">
                              {Array.from({ length: 10 }).map((_, i) => {
                                const key = `${baseKey}.${i + 1}`;
                                const translated = t(key);
                                if (translated === key) return null;
                                const [bold, ...rest] = String(translated).split(" - ");
                                return (
                                  <li key={i} className="text-base">
                                    <span className="font-semibold">{bold}</span>
                                    {rest.length > 0 && ` - ${rest.join(" - ")}`}
                                  </li>
                                );
                              })}
                            </ul>
                          </>
                        );
                      })()}
                    </div>

                    <div className="flex justify-center mt-10">
                      {youtubelink ? (
                        <YouTubeEmbed
                          link={youtubelink}
                          className="w-[650px] rounded-xl h-[500px] object-cover"
                        />
                      ) : (
                        <Image
                          className="w-[650px] rounded-xl h-[500px] object-cover"
                          src={image}
                          width={500}
                          alt="Product Detail Image"
                        />
                      )}
                    </div>
                  </TabsContent>

                  <TabsContent value="4">
                    <div className="w-full px-4">
                      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 my-12">
                        {certificateImages.map((item, idx) => (
                          <div key={`certificate-${idx}`} className="flex justify-center">
                            <Image
                              src={item.src}
                              alt={`Certificate ${idx + 1}`}
                              width={250}
                              height={350}
                              className="w-full max-w-[250px] h-auto object-contain rounded-xl"
                            />
                          </div>
                        ))}
                      </div>
                    </div>
                  </TabsContent>

                  <TabsContent value="5">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 my-12">
                      <ul className="space-y-6 list-disc list-inside">
                        <h3 className="text-lg font-bold mb-6">
                          {t("products.gelminKids.tab.gijjalar.1.title")}
                        </h3>
                        {Array.from({ length: 5 }).map((_, idx) => (
                          <li key={idx} className="text-base font-medium">
                            {t(`products.gelminKids.tab.gijjalar.1.${idx + 1}`)}
                          </li>
                        ))}
                      </ul>

                      <ul className="space-y-6 list-disc list-inside">
                        <h3 className="text-lg font-bold mb-6">
                          {t("products.gelminKids.tab.gijjalar.2.title")}
                        </h3>
                        {Array.from({ length: 2 }).map((_, idx) => (
                          <li key={idx} className="text-base font-medium">
                            {t(`products.gelminKids.tab.gijjalar.2.${idx + 1}`)}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </TabsContent>
                </Container>
              </motion.div>
            </AnimatePresence>
          </Tabs>
        </Container>
        <ProductsComponent isAviableBackground={false} />
        <SaleSection />
      </div>
    </div>
  );
}
